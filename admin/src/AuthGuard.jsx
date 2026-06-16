import { useUser, useClerk, SignIn } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function AuthGuard({ children }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const [allowedEmails, setAllowedEmails] = useState(null); // null = still fetching
    const [fetchError, setFetchError] = useState(false);

    // Fetch allowed emails from Supabase whenever a user is signed in
    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        supabase
            .from('admin_settings')
            .select('email')
            .then(({ data, error }) => {
                if (error) {
                    console.error('AuthGuard: failed to fetch admin_settings', error);
                    setFetchError(true);
                } else {
                    const emails = new Set((data || []).map(r => r.email.toLowerCase().trim()));
                    setAllowedEmails(emails);
                }
            });
    }, [isLoaded, isSignedIn]);

    // ── 1. Clerk still initializing ─────────────────────────────────────────
    if (!isLoaded) {
        return (
            <div className="auth-loading">
                <div className="auth-spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    // ── 2. Not signed in → show Clerk Sign In ───────────────────────────────
    if (!isSignedIn) {
        return (
            <div className="auth-screen">
                <div className="auth-card">
                    <div className="auth-logo">
                        <div className="brand-icon" style={{ width: 56, height: 56, fontSize: 22, margin: '0 auto 16px' }}>JS</div>
                        <h1>JSTARC Admin</h1>
                        <p>Sign in with your authorized Google account to continue.</p>
                    </div>
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: { width: '100%' },
                                card: {
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                },
                                headerTitle: { color: 'var(--text-primary)' },
                                headerSubtitle: { color: 'var(--text-secondary)' },
                                socialButtonsBlockButton: {
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                },
                                socialButtonsBlockButtonText: { color: 'var(--text-primary)' },
                                dividerLine: { background: 'var(--border)' },
                                dividerText: { color: 'var(--text-muted)' },
                                formFieldInput: {
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                },
                                formButtonPrimary: {
                                    background: 'var(--accent)',
                                    color: 'white',
                                },
                                footerActionLink: { color: 'var(--accent)' },
                            },
                        }}
                    />
                </div>
            </div>
        );
    }

    // ── 3. Signed in, but still fetching allowed emails ─────────────────────
    if (allowedEmails === null && !fetchError) {
        return (
            <div className="auth-loading">
                <div className="auth-spinner" />
                <p>Verifying access...</p>
            </div>
        );
    }

    // ── 4. Could not fetch settings (DB error) ──────────────────────────────
    if (fetchError) {
        return (
            <div className="auth-screen">
                <div className="auth-card auth-denied">
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h2>Configuration Error</h2>
                    <p>Could not load admin settings from the database.</p>
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        Make sure the <code>admin_settings</code> table exists in your Supabase project.
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                    <button className="btn btn-danger" style={{ marginTop: 12 }} onClick={() => signOut()}>
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    // ── 5. Signed in but email not in allowed list ──────────────────────────
    const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
    if (!allowedEmails.has(userEmail)) {
        return (
            <div className="auth-screen">
                <div className="auth-card auth-denied">
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
                    <h2>Access Denied</h2>
                    <p>
                        <strong>{userEmail}</strong> is not authorized to access this admin panel.
                    </p>
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        Please sign in with the authorized administrator account.
                    </p>
                    <button
                        className="btn btn-danger"
                        style={{ marginTop: 24 }}
                        onClick={() => signOut()}
                    >
                        Sign Out & Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ── 6. ✅ Authorized — render the app ───────────────────────────────────
    return children;
}
