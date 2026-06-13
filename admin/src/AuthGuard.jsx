import { useUser, useClerk, SignIn } from '@clerk/clerk-react';

// ✅ Only this email is allowed into the admin panel
const ALLOWED_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default function AuthGuard({ children }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();

    // Still loading Clerk session
    if (!isLoaded) {
        return (
            <div className="auth-loading">
                <div className="auth-spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    // Not signed in → show Clerk's hosted Sign In UI (Google only)
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

    // Signed in but wrong email → access denied
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (userEmail !== ALLOWED_ADMIN_EMAIL) {
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

    // ✅ Authorized — render the app
    return children;
}
