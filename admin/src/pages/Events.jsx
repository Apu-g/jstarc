import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload, Image, X, Pencil } from 'lucide-react';
import { api, fileToBase64 } from '../api';



export default function Events() {
    const [events, setEvents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showPhotosModal, setShowPhotosModal] = useState(null);
    const [eventPhotos, setEventPhotos] = useState([]);
    const [form, setForm] = useState({ title: '', date: '', location: '', category: 'Gallery' });
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const fileRef = useRef(null);

    const load = () => api.getEvents().then(data => { if (Array.isArray(data)) setEvents(data); });
    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const openAdd = () => {
        setEditing(null);
        setForm({ title: '', date: '', location: '', category: 'Gallery' });
        setShowAddModal(true);
    };

    const openEdit = (event) => {
        setEditing(event);
        setForm({
            id: event.id,
            title: event.title,
            date: event.date || '',
            location: event.location || '',
            category: event.category || 'Gallery'
        });
        setShowAddModal(true);
    };

    const handleSaveEvent = async () => {
        if (!form.title) { showToast('Title required', 'error'); return; }
        try {
            if (editing) {
                await api.updateEvent(form);
                showToast('Event updated!');
            } else {
                await api.addEvent(form);
                showToast('Event created!');
            }
            setShowAddModal(false);
            setEditing(null);
            setForm({ title: '', date: '', location: '', category: 'Gallery' });
            load();
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm('Delete this event and all its photos?')) return;
        try {
            await api.deleteEvent(id);
            showToast('Event deleted');
            load();
        } catch (e) {
            console.error("Delete Event Error:", e);
            alert("Delete failed: " + e.message);
        }
    };

    const openPhotos = async (event) => {
        setShowPhotosModal(event);
        const photos = await api.getEventPhotos(event.folder);
        setEventPhotos(Array.isArray(photos) ? photos : []);
    };

    const handleUploadPhotos = async (files) => {
        if (!files.length || !showPhotosModal) return;
        setUploading(true);
        try {
            const photos = [];
            for (const file of files) {
                const base64 = await fileToBase64(file);
                photos.push({ base64, filename: file.name });
            }
            await api.uploadEventPhotos({ folder: showPhotosModal.folder, photos });
            showToast(`${photos.length} photo(s) uploaded!`);
            openPhotos(showPhotosModal);
        } catch (e) { showToast('Upload failed', 'error'); }
        setUploading(false);
    };

    const handleDeletePhoto = async (photoPath) => {
        try {
            await api.deleteEventPhoto(photoPath);
            showToast('Photo deleted');
            openPhotos(showPhotosModal);
        } catch (e) {
            console.error("Delete Photo Error:", e);
            alert("Delete failed: " + e.message);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Events</h1>
                    <p>Manage events and their photo galleries</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>
                    <Plus size={18} /> Add Event
                </button>
            </div>

            <div className="event-grid">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        {event.image && <img src={event.image} alt={event.title} className="event-card-img" onError={(e) => e.target.style.display = 'none'} />}
                        <div className="event-card-body">
                            <h3>{event.title}</h3>
                            <p>📅 {event.date}</p>
                            <p>📍 {event.location}</p>
                            <span className="badge badge-blue">{event.category}</span>
                            <div className="event-card-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(event)}>
                                    <Pencil size={14} /> Profile
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={() => openPhotos(event)}>
                                    <Image size={14} /> Photos
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEvent(event.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <h3>No events yet</h3>
                        <p>Click &quot;Add Event&quot; to create your first event</p>
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditing(null); }}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editing ? 'Edit Event' : 'Create New Event'}</h2>
                        <div className="form-group">
                            <label>Event Title</label>
                            <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Prince Cup 2026" />
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="Year 2026" />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Bangalore" />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option value="Gallery">Gallery</option>
                                <option value="Win">Win</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => { setShowAddModal(false); setEditing(null); }}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveEvent}>
                                {editing ? 'Save Changes' : 'Create Event'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPhotosModal && (
                <div className="modal-overlay" onClick={() => setShowPhotosModal(null)}>
                    <div className="modal" style={{ maxWidth: 800 }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2>{showPhotosModal.title} — Photos</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowPhotosModal(null)}><X size={18} /></button>
                        </div>

                        <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                            <Upload size={32} style={{ margin: '0 auto 8px', color: 'var(--accent)' }} />
                            <h3>{uploading ? 'Uploading...' : 'Drop photos or click to upload'}</h3>
                            <p>JPG, PNG, WebP — multiple files supported</p>
                            <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => handleUploadPhotos(Array.from(e.target.files))} />
                        </div>

                        <div className="photo-grid" style={{ marginTop: 20 }}>
                            {eventPhotos.map((photo, i) => (
                                <div key={i} className="photo-card">
                                    <img src={photo} alt={`Event photo ${i + 1}`} />
                                    <button className="photo-delete" onClick={() => handleDeletePhoto(photo)}>×</button>
                                </div>
                            ))}
                        </div>
                        {eventPhotos.length === 0 && !uploading && (
                            <div className="empty-state"><p>No photos yet for this event</p></div>
                        )}
                    </div>
                </div>
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
