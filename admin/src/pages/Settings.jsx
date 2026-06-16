import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle, Mail, Lock } from 'lucide-react';
import { api } from '../api';
import { useUser } from '@clerk/clerk-react';

export default function Settings() {
    const { user } = useUser();
    const currentEmail = user?.primaryEmailAddress?.emailAddress;

    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [emailError, setEmailError] = useState('');

    useEffect(() => { loadEmails(); }, []);

    async function loadEmails() {
        setLoading(true);
        try {
            const data = await api.getAdminEmails();
            setEmails(data);
        } catch (e) {
            showToast('error', 'Failed to load admin emails: ' + e.message);
        } finally {
            setLoading(false);
        }
    }

    function showToast(type, message) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    async function handleAdd() {
        const trimmed = newEmail.trim().toLowerCase();
        if (!trimmed) { setEmailError('Please enter an email address.'); return; }
        if (!isValidEmail(trimmed)) { setEmailError('Please enter a valid email address.'); return; }
        if (emails.includes(trimmed)) { setEmailError('This email is already in the list.'); return; }
        if (emails.length >= 10) { setEmailError('Maximum 10 admin emails allowed.'); return; }

        setEmailError('');
        setSaving(true);
        try {
            await api.addAdminEmail(trimmed);
            setEmails(prev => [...prev, trimmed]);
            setNewEmail('');
            showToast('success', `${trimmed} added as admin.`);
        } catch (e) {
            showToast('error', 'Failed to add email: ' + e.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleRemove(email) {
        if (email === currentEmail) {
            showToast('error', "You can't remove your own email — you'd lose access!");
            return;
        }
        if (emails.length <= 1) {
            showToast('error', 'You must keep at least one admin email.');
            return;
        }
        setSaving(true);
        try {
            await api.removeAdminEmail(email);
            setEmails(prev => prev.filter(e => e !== email));
            showToast('success', `${email} removed from admin list.`);
        } catch (e) {
            showToast('error', 'Failed to remove email: ' + e.message);
        } finally {
            setSaving(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleAdd();
        if (e.key === 'Escape') { setNewEmail(''); setEmailError(''); }
    }

    return (
        <div className="page-container">
            {toast && (
                <div className={`settings-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <Shield size={22} style={{ display: 'inline', marginRight: 10, color: 'var(--accent)' }} />
                        Admin Access Control
                    </h1>
                    <p className="page-subtitle">
                        Manage who can log into this admin panel. Changes take effect immediately.
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={loadEmails} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="settings-layout">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">
                                <Mail size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--accent)' }} />
                                Authorized Admin Emails
                            </h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                                Only these Google accounts can sign in to this panel.
                            </p>
                        </div>
                        <span className="settings-badge">{emails.length} / 10</span>
                    </div>

                    <div className="settings-add-row">
                        <div className="settings-input-wrapper">
                            <Mail size={14} className="settings-input-icon" />
                            <input
                                type="email"
                                className={`form-input settings-email-input ${emailError ? 'input-error' : ''}`}
                                placeholder="newadmin@gmail.com"
                                value={newEmail}
                                onChange={e => { setNewEmail(e.target.value); setEmailError(''); }}
                                onKeyDown={handleKeyDown}
                                disabled={saving || emails.length >= 10}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleAdd}
                            disabled={saving || !newEmail.trim() || emails.length >= 10}
                        >
                            <Plus size={16} />
                            Add Admin
                        </button>
                    </div>
                    {emailError && (
                        <p className="settings-field-error">
                            <AlertCircle size={13} />
                            {emailError}
                        </p>
                    )}

                    <div className="settings-email-list">
                        {loading ? (
                            <div className="settings-loading">
                                <div className="auth-spinner" style={{ width: 24, height: 24 }} />
                                <span>Loading admin list...</span>
                            </div>
                        ) : emails.length === 0 ? (
                            <div className="settings-empty">
                                <Shield size={32} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
                                <p>No admin emails configured.</p>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add your email above to get started.</p>
                            </div>
                        ) : (
                            emails.map(email => (
                                <div key={email} className="settings-email-row">
                                    <div className="settings-email-info">
                                        <div className="settings-avatar">{email[0].toUpperCase()}</div>
                                        <div>
                                            <span className="settings-email-text">{email}</span>
                                            {email === currentEmail && (
                                                <span className="settings-you-badge">You</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemove(email)}
                                        disabled={saving || email === currentEmail || emails.length <= 1}
                                        title={
                                            email === currentEmail ? "Can't remove your own account"
                                            : emails.length <= 1 ? 'Must keep at least one admin'
                                            : `Remove ${email}`
                                        }
                                    >
                                        <Trash2 size={13} />
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="card settings-info-card">
                    <h3 className="card-title">
                        <Lock size={15} style={{ display: 'inline', marginRight: 8, color: 'var(--accent)' }} />
                        Security Notes
                    </h3>
                    <ul className="settings-info-list">
                        <li>
                            <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                            Admin emails are stored securely in your Supabase database — not in code or .env files.
                        </li>
                        <li>
                            <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                            Changes are <strong>instant</strong> — new admins can sign in immediately.
                        </li>
                        <li>
                            <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                            Authentication is handled by <strong>Clerk</strong> — only verified Google accounts can attempt login.
                        </li>
                        <li>
                            <AlertCircle size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                            You cannot remove your own email — this prevents accidental lockout.
                        </li>
                        <li>
                            <AlertCircle size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                            Maximum of 10 admin accounts allowed.
                        </li>
                    </ul>

                    <div className="settings-env-note">
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                            What still lives in <code>.env</code>:
                        </p>
                        <code style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', lineHeight: 1.8 }}>
                            VITE_SUPABASE_URL<br />
                            VITE_SUPABASE_ANON_KEY<br />
                            VITE_CLERK_PUBLISHABLE_KEY
                        </code>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                            These are infrastructure credentials needed to boot the app — they never need to change.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
