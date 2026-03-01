import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { api, fileToBase64 } from '../api';



export default function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const fileRef = useRef(null);

    const load = () => api.getGallery().then(data => {
        if (data?.files) setPhotos(data.files);
    });
    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const handleUpload = async (files) => {
        if (!files.length) return;
        setUploading(true);
        try {
            const photoData = [];
            for (const file of files) {
                const base64 = await fileToBase64(file);
                photoData.push({ base64, filename: file.name });
            }
            await api.uploadGalleryPhotos({ photos: photoData });
            showToast(`${photoData.length} photo(s) uploaded!`);
            load();
        } catch (e) { showToast('Upload failed', 'error'); }
        setUploading(false);
    };

    const handleDelete = async (filename) => {
        if (!confirm('Delete this photo from the gallery?')) return;
        try {
            await api.deleteGalleryPhoto(filename);
            showToast('Photo deleted');
            load();
        } catch (e) {
            console.error("Delete Gallery Photo Error:", e);
            alert("Delete failed: " + e.message);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Gallery</h1>
                    <p>Manage the scrolling marquee photos on the homepage ({photos.length} photos)</p>
                </div>
            </div>

            <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ marginBottom: 24 }}>
                <Upload size={40} style={{ margin: '0 auto 12px', color: 'var(--accent)' }} />
                <h3>{uploading ? 'Uploading...' : 'Click to upload photos'}</h3>
                <p>JPG, PNG, WebP — multiple files supported. Photos will appear in the homepage marquee.</p>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => handleUpload(Array.from(e.target.files))} />
            </div>

            <div className="photo-grid">
                {photos.map((photo, i) => (
                    <div key={photo.name || i} className="photo-card">
                        <img src={photo.src} alt={`Marquee photo ${i + 1}`} />
                        <button className="photo-delete" onClick={() => handleDelete(photo.name)}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {photos.length === 0 && !uploading && (
                <div className="empty-state">
                    <h3>No gallery photos</h3>
                    <p>Upload some photos to populate the homepage marquee</p>
                </div>
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
