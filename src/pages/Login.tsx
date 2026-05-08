import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/profile';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-sandstone/50 rounded-2xl shadow-xl shadow-midnight/5 overflow-hidden">
        <div className="bg-midnight text-white p-6">
          <div className="w-12 h-12 bg-eucalyptus rounded-xl flex items-center justify-center mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Welcome back</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to manage trips, bookings, and admin tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-ember/10 text-ember text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-midnight/70 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-sandstone/20 border border-sandstone/60 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight/70 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-sandstone/20 border border-sandstone/60 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-eucalyptus hover:bg-eucalyptus-dark disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            Sign In
          </button>

          <p className="text-center text-sm text-midnight/60">
            New traveller?{' '}
            <Link to="/register" className="text-eucalyptus hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
