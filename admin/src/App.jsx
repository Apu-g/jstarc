import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Award, Calendar, Images, Menu, X, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard';
import Masters from './pages/Masters';
import BlackBelts from './pages/BlackBelts';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';


const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Masters', path: '/masters', icon: Award },
    { name: 'Black Belts', path: '/blackbelts', icon: Users },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gallery', path: '/gallery', icon: Images },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
];


function SidebarUserInfo() {
    const { user } = useUser();
    if (!user) return null;
    return (
        <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.firstName || 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.primaryEmailAddress?.emailAddress}
            </div>
        </div>
    );
}

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { signOut } = useClerk();

    return (
        <BrowserRouter>
            <div className="app-layout">
                {/* Mobile toggle */}
                <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-brand">
                        <div className="brand-icon">JS</div>
                        <div>
                            <h1>JSTARC</h1>
                            <span>Admin Panel</span>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="view-site-btn">
                            View Live Site →
                        </a>
                        <div className="sidebar-user">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: { width: 34, height: 34 },
                                        userButtonPopoverCard: {
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                        },
                                    },
                                }}
                            />
                            <SidebarUserInfo />
                        </div>
                        <button
                            className="logout-btn"
                            onClick={() => signOut()}
                            title="Sign out"
                        >
                            <LogOut size={15} />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

                {/* Main content */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/masters" element={<Masters />} />
                        <Route path="/blackbelts" element={<BlackBelts />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
