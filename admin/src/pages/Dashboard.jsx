import { useState, useEffect } from 'react';
import { Award, Users, Calendar, Images } from 'lucide-react';
import { api } from '../api';

export default function Dashboard() {
    const [stats, setStats] = useState({ masters: 0, blackbelts: 0, events: 0, photos: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.getMasters(),
            api.getBlackbelts(),
            api.getEvents(),
            api.getGallery(),
        ]).then(([masters, blackbelts, events, gallery]) => {
            setStats({
                masters: Array.isArray(masters) ? masters.length : 0,
                blackbelts: Array.isArray(blackbelts) ? blackbelts.length : 0,
                events: Array.isArray(events) ? events.length : 0,
                photos: gallery?.files ? gallery.files.length : 0,
            });
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Masters', value: stats.masters, icon: Award, color: '#6c5ce7', bg: 'rgba(108,92,231,0.15)' },
        { label: 'Black Belts', value: stats.blackbelts, icon: Users, color: '#00d68f', bg: 'rgba(0,214,143,0.15)' },
        { label: 'Events', value: stats.events, icon: Calendar, color: '#ffa502', bg: 'rgba(255,165,2,0.15)' },
        { label: 'Gallery Photos', value: stats.photos, icon: Images, color: '#45aaf2', bg: 'rgba(69,170,242,0.15)' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your JSTARC website content</p>
                </div>
            </div>

            <div className="stats-grid">
                {cards.map(card => (
                    <div key={card.label} className="stat-card">
                        <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                            <card.icon size={24} />
                        </div>
                        <div className="stat-value" style={{ color: card.color }}>
                            {loading ? '...' : card.value}
                        </div>
                        <div className="stat-label">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Quick Actions</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <a href="/masters" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-ghost" style={{ width: '100%' }}>
                            <Award size={18} /> Manage Masters
                        </button>
                    </a>
                    <a href="/blackbelts" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-ghost" style={{ width: '100%' }}>
                            <Users size={18} /> Manage Black Belts
                        </button>
                    </a>
                    <a href="/events" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-ghost" style={{ width: '100%' }}>
                            <Calendar size={18} /> Manage Events
                        </button>
                    </a>
                    <a href="/gallery" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-ghost" style={{ width: '100%' }}>
                            <Images size={18} /> Manage Gallery
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
