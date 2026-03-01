import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api, fileToBase64 } from '../api';

const emptyMaster = { id: '', name: '', designation: '', rank: '', quote: '', bio: '', achievements: '', facePos: '50% 10%' };

export default function Masters() {
    const [masters, setMasters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyMaster);
    const [photoFile, setPhotoFile] = useState(null);
    const [toast, setToast] = useState(null);

    const load = () => api.getMasters().then(data => { if (Array.isArray(data)) setMasters(data); });
    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const openAdd = () => { setEditing(null); setForm(emptyMaster); setPhotoFile(null); setShowModal(true); };
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
                await api.updateMaster(data);
                showToast('Master updated!');
            } else {
                await api.addMaster(data);
                showToast('Master added!');
            }
            setShowModal(false);
            load();
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this master?')) return;
        try {
            await api.deleteMaster(id);
            showToast('Master deleted');
            load();
        } catch (err) {
            console.error("Delete Master Error:", err);
            alert("Delete failed: " + err.message);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Masters</h1>
                    <p>Manage the masters displayed on the Team page</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>
                    <Plus size={18} /> Add Master
                </button>
            </div>

            <div className="card" style={{ overflow: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Master</th>
                            <th>Rank</th>
                            <th>Quote</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {masters.map(m => (
                            <tr key={m.id}>
                                <td>
                                    <div className="member-cell">
                                        <img src={m.src} alt={m.name} className="member-avatar" onError={(e) => e.target.style.display = 'none'} />
                                        <div>
                                            <div className="member-name">{m.name}</div>
                                            <div className="member-desc">{m.designation}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge badge-purple">{m.rank}</span></td>
                                <td style={{ maxWidth: 200, color: 'var(--text-secondary)', fontSize: 13 }}>{m.quote?.slice(0, 60)}...</td>
                                <td>
                                    <div className="actions">
                                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}><Pencil size={14} /></button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {masters.length === 0 && (
                            <tr><td colSpan={4}><div className="empty-state"><h3>No masters yet</h3><p>Click &quot;Add Master&quot; to get started</p></div></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editing ? 'Edit Master' : 'Add New Master'}</h2>
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Master Jai Kumar Kannan" />
                        </div>
                        <div className="form-group">
                            <label>Designation</label>
                            <input className="form-input" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="Head Instructor - 5th Dan" />
                        </div>
                        <div className="form-group">
                            <label>Rank</label>
                            <input className="form-input" value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} placeholder="5th Dan Black Belt" />
                        </div>
                        <div className="form-group">
                            <label>Quote</label>
                            <textarea className="form-input" value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} placeholder="Inspirational quote..." />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea className="form-input" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short biography..." />
                        </div>
                        <div className="form-group">
                            <label>Achievements (comma separated)</label>
                            <input className="form-input" value={form.achievements} onChange={e => setForm({ ...form, achievements: e.target.value })} placeholder="5th Dan, National Referee" />
                        </div>
                        <div className="form-group">
                            <label>Photo</label>
                            <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} style={{ color: 'var(--text-secondary)' }} />
                            {editing?.src && !photoFile && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Current: {editing.src}</p>}
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                {editing ? 'Save Changes' : 'Add Master'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
