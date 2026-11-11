import React, { useEffect, useRef, useState } from 'react';
import { X, Eye, EyeOff, Mail, User } from 'lucide-react';
import { api, UserSession } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const focusFrame = window.requestAnimationFrame(() => emailInputRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (mode === 'register') {
      if (password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return;
      }
      if (password !== passwordConfirm) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      const user = mode === 'login'
        ? await api.login(email.trim(), password)
        : await api.register(name.trim(), email.trim(), password);
      onSuccess(user);
      onClose();
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal-content p-8"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '30rem' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-muted"
          aria-label="Close sign-in dialog"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <X aria-hidden="true" style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>

        <div className="text-center mb-6">
          <div className="brand-badge mx-auto mb-3" aria-hidden="true">Q</div>
          <h2 id="auth-modal-title" className="font-serif text-3xl font-medium text-obsidian">
            {mode === 'login' ? 'Sign in to ClosetIQ' : 'Create your account'}
          </h2>
          <p className="text-sm text-muted mt-1">
            {mode === 'login'
              ? 'Access your wardrobe and saved style details.'
              : 'Create an account to start organizing your wardrobe.'}
          </p>
        </div>

        <div className="flex rounded-lg p-1 bg-linen-warm mb-6" style={{ border: '1px solid var(--border-stone)' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${mode === 'login' ? 'bg-linen-pure text-obsidian shadow-sm' : 'text-muted'}`}
            aria-pressed={mode === 'login'}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${mode === 'register' ? 'bg-linen-pure text-obsidian shadow-sm' : 'text-muted'}`}
            aria-pressed={mode === 'register'}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Create account
          </button>
        </div>

        {error && (
          <p className="p-3.5 rounded-lg mb-4 bg-linen-warm text-terracotta text-sm" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
                Full name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input-editorial"
                  required
                />
                <User aria-hidden="true" style={{ position: 'absolute', right: '1rem', top: '0.85rem', width: '1rem', height: '1rem', color: 'var(--text-light)' }} />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-email"
                ref={emailInputRef}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-editorial"
                required
              />
              <Mail aria-hidden="true" style={{ position: 'absolute', right: '1rem', top: '0.85rem', width: '1rem', height: '1rem', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-editorial"
                minLength={mode === 'register' ? 8 : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword
                  ? <EyeOff aria-hidden="true" style={{ width: '1.1rem', height: '1.1rem' }} />
                  : <Eye aria-hidden="true" style={{ width: '1.1rem', height: '1.1rem' }} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-password-confirm" className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password-confirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  className="input-editorial"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((visible) => !visible)}
                  aria-label={showPasswordConfirm ? 'Hide password confirmation' : 'Show password confirmation'}
                  style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPasswordConfirm
                    ? <EyeOff aria-hidden="true" style={{ width: '1.1rem', height: '1.1rem' }} />
                    : <Eye aria-hidden="true" style={{ width: '1.1rem', height: '1.1rem' }} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2" style={{ padding: '0.85rem' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>
    </div>
  );
};
