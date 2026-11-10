import React, { useState } from 'react';
import { api, UserSession } from '../services/api';
import { X, Eye, EyeOff, Mail, User, Sparkles } from 'lucide-react';

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
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setError('Please provide your email or login ID and password.');
          setLoading(false);
          return;
        }
        const user = await api.login(email.trim(), password);
        onSuccess(user);
        onClose();
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password) {
          setError('All registration fields are required.');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must contain at least 8 characters.');
          setLoading(false);
          return;
        }
        if (password !== passwordConfirm) {
          setError('Passwords do not match. Please verify confirmation.');
          setLoading(false);
          return;
        }
        const user = await api.register(name.trim(), email.trim(), password);
        onSuccess(user);
        onClose();
      } else if (mode === 'forgot') {
        if (!resetToken) {
          if (!email.trim()) {
            setError('Please enter your account email address.');
            setLoading(false);
            return;
          }
          const res = await api.requestPasswordReset(email.trim());
          setResetToken(res.demoToken);
          setSuccessMsg(res.message);
        } else {
          if (!resetCodeInput.trim() || !newPassword) {
            setError('Please enter the reset code and your new password.');
            setLoading(false);
            return;
          }
          if (newPassword.length < 8) {
            setError('New password must contain at least 8 characters.');
            setLoading(false);
            return;
          }
          const res = await api.resetPassword(email.trim(), resetCodeInput.trim(), newPassword);
          setSuccessMsg(res.message);
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setResetToken('');
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDemoGirl = () => {
    setMode('login');
    setEmail('demo.girl@closetiq.fashion');
    setPassword('DemoGirl@2026!');
    setError('');
    setSuccessMsg('Demo Girl credentials autofilled. Click "Sign In to Studio" below to proceed.');
  };

  const handleAutofillDemoBoy = () => {
    setMode('login');
    setEmail('demo.boy@closetiq.fashion');
    setPassword('DemoBoy@2026!');
    setError('');
    setSuccessMsg('Demo Boy credentials autofilled. Click "Sign In to Studio" below to proceed.');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content p-8" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '30rem' }}>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-muted"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <X style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="brand-badge mx-auto mb-3" style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.35rem' }}>
            Q
          </div>
          <h2 className="font-serif text-3xl font-medium text-obsidian">
            {mode === 'login' ? 'Client Access' : mode === 'register' ? 'Private Atelier Registration' : 'Password Recovery'}
          </h2>
          <p className="text-xs text-muted mt-1">
            {mode === 'login'
              ? 'Access your personal colorimetry and luxury styling dossier.'
              : mode === 'register'
              ? 'Create your bespoke fashion intelligence profile.'
              : 'Secure verification and credential renewal.'}
          </p>
        </div>

        {/* Tabs for Login / Register */}
        {mode !== 'forgot' && (
          <div className="flex rounded-xl p-1 bg-linen-warm mb-6" style={{ border: '1px solid var(--border-stone)' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                mode === 'login' ? 'bg-linen-pure text-obsidian shadow-sm' : 'text-muted'
              }`}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                mode === 'register' ? 'bg-linen-pure text-obsidian shadow-sm' : 'text-muted'
              }`}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Register
            </button>
          </div>
        )}

        {/* Error / Success Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl mb-4 bg-linen-warm text-terracotta text-xs font-medium" style={{ border: '1px solid var(--accent-terracotta)' }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl mb-4 text-xs font-medium" style={{ backgroundColor: 'var(--accent-olive-light)', color: 'var(--accent-olive)', border: '1px solid var(--accent-olive)' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Sloane Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-editorial"
                  required
                />
                <User style={{ position: 'absolute', right: '1rem', top: '0.85rem', width: '1rem', height: '1rem', color: 'var(--text-light)' }} />
              </div>
            </div>
          )}

          <div>
            <label className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
              Email or Login ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="name@closetiq.luxury"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-editorial"
                required
              />
              <Mail style={{ position: 'absolute', right: '1rem', top: '0.85rem', width: '1rem', height: '1rem', color: 'var(--text-light)' }} />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                    className="text-xs text-terracotta"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.7rem' }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-editorial"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff style={{ width: '1.1rem', height: '1.1rem' }} /> : <Eye style={{ width: '1.1rem', height: '1.1rem' }} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="input-editorial"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                  title={showPasswordConfirm ? 'Hide password' : 'Show password'}
                >
                  {showPasswordConfirm ? <EyeOff style={{ width: '1.1rem', height: '1.1rem' }} /> : <Eye style={{ width: '1.1rem', height: '1.1rem' }} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'forgot' && resetToken && (
            <>
              <div>
                <label className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter reset code from message"
                  value={resetCodeInput}
                  onChange={(e) => setResetCodeInput(e.target.value)}
                  className="input-editorial"
                  required
                />
              </div>
              <div>
                <label className="editorial-caps text-muted mb-1 block" style={{ fontSize: '0.62rem' }}>
                  New Secure Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-editorial"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
            style={{ padding: '0.85rem' }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to Studio' : mode === 'register' ? 'Complete Registration' : resetToken ? 'Save New Password' : 'Send Reset Instructions'}
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-muted"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Demo Accounts Autofill Section */}
        <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border-stone-light)' }}>
          <p className="editorial-caps text-muted text-center mb-3" style={{ fontSize: '0.62rem' }}>
            Quick Demo Autofill (Development & Review)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAutofillDemoGirl}
              className="editorial-card p-3 text-left transition hover:border-obsidian"
              style={{
                cursor: 'pointer',
                backgroundColor: 'var(--bg-linen-pure)',
                borderColor: email === 'demo.girl@closetiq.fashion' ? 'var(--accent-terracotta)' : 'var(--border-stone)',
                borderWidth: email === 'demo.girl@closetiq.fashion' ? '2px' : '1px',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent-terracotta)' }} />
                <span className="font-serif text-sm font-medium text-obsidian">Demo Girl</span>
              </div>
              <p className="text-muted truncate font-mono" style={{ fontSize: '0.62rem' }}>
                demo.girl@closetiq.fashion
              </p>
            </button>

            <button
              type="button"
              onClick={handleAutofillDemoBoy}
              className="editorial-card p-3 text-left transition hover:border-obsidian"
              style={{
                cursor: 'pointer',
                backgroundColor: 'var(--bg-linen-pure)',
                borderColor: email === 'demo.boy@closetiq.fashion' ? 'var(--accent-olive)' : 'var(--border-stone)',
                borderWidth: email === 'demo.boy@closetiq.fashion' ? '2px' : '1px',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent-olive)' }} />
                <span className="font-serif text-sm font-medium text-obsidian">Demo Boy</span>
              </div>
              <p className="text-muted truncate font-mono" style={{ fontSize: '0.62rem' }}>
                demo.boy@closetiq.fashion
              </p>
            </button>
          </div>
          <p className="text-center text-muted mt-2" style={{ fontSize: '0.65rem' }}>
            Clicking a demo button autofills credentials. Click <strong>Sign In to Studio</strong> to log in.
          </p>
        </div>
      </div>
    </div>
  );
};
