import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api, fileToBase64 } from '../api';

const emptyMember = { id: '', name: '', rank: 'Black Belt', desc: '', bio: '', achievements: '', facePos: '50% 15%' };

export default function BlackBelts() {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyMember);
    const [photoFile, setPhotoFile] = useState(null);
    const [toast, setToast] = useState(null);

    const load = () => api.getBlackbelts().then(data => { if (Array.isArray(data)) setMembers(data); });
    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const openAdd = () => { setEditing(null); setForm(emptyMember); setPhotoFile(null); setShowModal(true); };
    const openEdit = (m) => {
        setEditing(m);
        setForm({ ...m, achievements: Array.isArray(m.achievements) ? m.achievements.join(', ') : '' });
        setPhotoFile(null);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        const data = {
            ...form,
            id: form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            achievements: form.achievements ? form.achievements.split(',').map(s => s.trim()).filter(Boolean) : [],
        };

        if (photoFile) {
            data.photoBase64 = await fileToBase64(photoFile);
            data.photoFilename = photoFile.name;
        }

        try {
            if (editing) {
                await api.updateBlackbelt(data);
                showToast('Member updated!');
            } else {
                await api.addBlackbelt(data);
                showToast('Member added!');
            }
            setShowModal(false);
            load();
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this member?')) return;
        try {
            await api.deleteBlackbelt(id);
            showToast('Member deleted');
            load();
        } catch (err) {
            console.error("Delete Error:", err);
            alert("Delete failed: " + err.message);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Black Belts</h1>
                    <p>Manage team members on the constellation timeline</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>
                    <Plus size={18} /> Add Member
                </button>
            </div>

            <div className="card" style={{ overflow: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Rank</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m => (
                            <tr key={m.id}>
                                <td>
                                    <div className="member-cell">
                                        <img src={m.img} alt={m.name} className="member-avatar" onError={(e) => e.target.style.display = 'none'} />
                                        <div>
                                            <div className="member-name">{m.name}</div>
                                            <div className="member-desc">{m.bio?.slice(0, 50)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge badge-green">{m.rank}</span></td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{m.desc}</td>
                                <td>
                                    <div className="actions">
                                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}><Pencil size={14} /></button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr><td colSpan={4}><div className="empty-state"><h3>No members yet</h3></div></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editing ? 'Edit Member' : 'Add New Member'}</h2>
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Vivek" />
                        </div>
                        <div className="form-group">
                            <label>Rank</label>
                            <input className="form-input" value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} placeholder="Black Belt" />
                        </div>
                        <div className="form-group">
                            <label>Description / Role</label>
                            <input className="form-input" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Demonstration Team" />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea className="form-input" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short biography..." />
                        </div>
                        <div className="form-group">
                            <label>Achievements (comma separated)</label>
                            <input className="form-input" value={form.achievements} onChange={e => setForm({ ...form, achievements: e.target.value })} placeholder="Gold Medal, National Qualifier" />
                        </div>
                        <div className="form-group">
                            <label>Face Position (CSS)</label>
                            <input className="form-input" value={form.facePos} onChange={e => setForm({ ...form, facePos: e.target.value })} placeholder="50% 15%" />
                        </div>
                        <div className="form-group">
                            <label>Photo</label>
                            <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} style={{ color: 'var(--text-secondary)' }} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                {editing ? 'Save Changes' : 'Add Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
