import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Save, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Profile() {
  const { user, logout, saveProfile, isAdmin } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [favoriteDestinations, setFavoriteDestinations] = useState(
    user?.preferences?.favoriteDestinations?.join(', ') || ''
  );
  const [experientialPreferences, setExperientialPreferences] = useState(
    user?.preferences?.experientialPreferences?.join(', ') || ''
  );
  const [status, setStatus] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await saveProfile({
      name,
      preferences: {
        favoriteDestinations: favoriteDestinations.split(',').map((item) => item.trim()).filter(Boolean),
        experientialPreferences: experientialPreferences.split(',').map((item) => item.trim()).filter(Boolean)
      }
    });
    setStatus('Profile saved.');
  };

  return (
    <div className="min-h-screen bg-pearl">
      <section className="bg-midnight text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-eucalyptus rounded-lg flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-eucalyptus text-sm font-medium">{user?.role}</p>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{user?.name}</h1>
            </div>
          </div>
          <p className="text-white/60">{user?.email}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} className="bg-white border border-sandstone/50 rounded-2xl p-6 space-y-5">
            {status && <div className="p-3 bg-eucalyptus/10 text-eucalyptus rounded-lg text-sm">{status}</div>}

            <div>
              <label className="block text-sm font-medium text-midnight/70 mb-2">Display name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-sandstone/20 border border-sandstone/60 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight/70 mb-2">Favorite destinations</label>
              <input
                value={favoriteDestinations}
                onChange={(event) => setFavoriteDestinations(event.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-sandstone/20 border border-sandstone/60 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight/70 mb-2">Experience preferences</label>
              <input
                value={experientialPreferences}
                onChange={(event) => setExperientialPreferences(event.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-sandstone/20 border border-sandstone/60 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none"
              />
            </div>

            <button className="inline-flex items-center gap-2 px-5 py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white rounded-lg font-medium transition-colors">
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </form>

          <aside className="space-y-4">
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-3 bg-white border border-sandstone/50 rounded-2xl p-5 hover:border-eucalyptus/40 transition-colors">
                <Shield className="w-5 h-5 text-eucalyptus" />
                <div>
                  <h2 className="font-semibold text-midnight">Admin Dashboard</h2>
                  <p className="text-sm text-midnight/60">Manage curated activities and analytics.</p>
                </div>
              </Link>
            )}

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-midnight text-white rounded-lg font-medium hover:bg-midnight/90 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}
