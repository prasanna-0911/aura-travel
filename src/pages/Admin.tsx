import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BarChart3, Edit3, Plus, Save, Trash2 } from 'lucide-react';
import { Activity } from '@/data';
import {
  AdminAnalytics,
  createAdminActivity,
  deleteAdminActivity,
  getAdminActivities,
  getAdminAnalytics,
  updateAdminActivity
} from '@/services/catalogService';

const emptyActivity: Partial<Activity> = {
  name: '',
  destination: 'Goa',
  category: 'leisure',
  description: '',
  experiential_tags: ['peaceful'],
  duration_hours: 2,
  cost_inr: 0,
  opening_hours: { weekday: '09:00-18:00', weekend: '09:00-18:00' },
  location: { lat: 15.4909, lng: 73.8278, address: 'Goa' },
  images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop'],
  user_rating: 4.5,
  accessibility: 'easy-access',
  best_time: 'anytime'
};

export function Admin() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Activity>>(emptyActivity);
  const [status, setStatus] = useState('');

  const groupedCounts = useMemo(() => {
    return activities.reduce<Record<string, number>>((acc, activity) => {
      acc[activity.destination] = (acc[activity.destination] || 0) + 1;
      return acc;
    }, {});
  }, [activities]);

  async function loadAdminData() {
    const [nextActivities, nextAnalytics] = await Promise.all([
      getAdminActivities(),
      getAdminAnalytics()
    ]);
    setActivities(nextActivities);
    setAnalytics(nextAnalytics);
  }

  useEffect(() => {
    loadAdminData().catch((error) => setStatus(error instanceof Error ? error.message : 'Failed to load admin data'));
  }, []);

  const startEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setForm(activity);
    setStatus('');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyActivity);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      experiential_tags: typeof form.experiential_tags === 'string'
        ? String(form.experiential_tags).split(',').map((tag) => tag.trim()).filter(Boolean)
        : form.experiential_tags
    };

    if (editingId) {
      await updateAdminActivity(editingId, payload);
      setStatus('Activity updated.');
    } else {
      await createAdminActivity(payload);
      setStatus('Activity created.');
    }

    resetForm();
    await loadAdminData();
  };

  const handleDelete = async (id: string) => {
    await deleteAdminActivity(id);
    setStatus('Activity deleted.');
    await loadAdminData();
  };

  return (
    <div className="min-h-screen bg-pearl">
      <section className="bg-midnight text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-eucalyptus" />
            <span className="text-eucalyptus text-sm font-medium">Admin</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Aura Travel Dashboard</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {status && <div className="p-3 bg-eucalyptus/10 text-eucalyptus rounded-lg text-sm">{status}</div>}

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['Catalog Entities', analytics?.total_entities ?? activities.length],
            ['Activities', analytics?.total_activities ?? activities.length],
            ['Users', analytics?.total_users ?? 0],
            ['Bookings', analytics?.total_bookings ?? 0]
          ].map(([label, value]) => (
            <div key={label} className="bg-white border border-sandstone/50 rounded-2xl p-5">
              <p className="text-sm text-midnight/60">{label}</p>
              <p className="text-3xl font-bold text-midnight mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className="bg-white border border-sandstone/50 rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-midnight flex items-center gap-2">
              {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Edit Activity' : 'Add Activity'}
            </h2>

            <input
              value={form.name || ''}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Activity name"
              className="w-full px-3 py-2 rounded-lg bg-sandstone/20 border border-sandstone/60 outline-none focus:border-eucalyptus"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.destination || 'Goa'}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
                className="px-3 py-2 rounded-lg bg-sandstone/20 border border-sandstone/60 outline-none focus:border-eucalyptus"
              >
                <option>Goa</option>
                <option>Manali</option>
                <option>Pune</option>
              </select>
              <select
                value={form.category || 'leisure'}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="px-3 py-2 rounded-lg bg-sandstone/20 border border-sandstone/60 outline-none focus:border-eucalyptus"
              >
                <option value="leisure">Leisure</option>
                <option value="cultural">Cultural</option>
                <option value="adventure">Adventure</option>
                <option value="wellness">Wellness</option>
                <option value="wildlife">Wildlife</option>
                <option value="shopping">Shopping</option>
                <option value="nightlife">Nightlife</option>
              </select>
            </div>
            <textarea
              value={form.description || ''}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Description"
              className="w-full h-24 px-3 py-2 rounded-lg bg-sandstone/20 border border-sandstone/60 outline-none focus:border-eucalyptus"
              required
            />
            <input
              value={(form.experiential_tags || []).join(', ')}
              onChange={(event) => setForm({ ...form, experiential_tags: event.target.value.split(',').map((tag) => tag.trim()) })}
              placeholder="Tags"
              className="w-full px-3 py-2 rounded-lg bg-sandstone/20 border border-sandstone/60 outline-none focus:border-eucalyptus"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={form.cost_inr || 0}
                onChange={(event) => setForm({ ...form, cost_inr: Number(event.target.value) })}
                className="px-3 py-2 rounded-lg bg-sandstone/20 border border-sandstone/60 outline-none focus:border-eucalyptus"
              />
              <input
                type="number"
                step="0.5"
                value={form.duration_hours || 2}
                onChange={(event) => setForm({ ...form, duration_hours: Number(event.target.value) })}
                className="px-3 py-2 rounded-lg bg-sandstone/20 border border-sandstone/60 outline-none focus:border-eucalyptus"
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white rounded-lg font-medium transition-colors">
              <Save className="w-4 h-4" />
              {editingId ? 'Save Activity' : 'Create Activity'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="w-full py-2 text-midnight/60 hover:text-midnight">
                Cancel edit
              </button>
            )}
          </form>

          <div className="bg-white border border-sandstone/50 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-sandstone/50">
              <h2 className="font-semibold text-midnight">Activities</h2>
              <p className="text-sm text-midnight/60">
                {Object.entries(groupedCounts).map(([destination, count]) => `${destination}: ${count}`).join(' | ')}
              </p>
            </div>
            <div className="divide-y divide-sandstone/40 max-h-[640px] overflow-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-midnight">{activity.name}</h3>
                    <p className="text-sm text-midnight/60">{activity.destination} | {activity.category} | Rs {activity.cost_inr}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(activity)} className="p-2 rounded-lg bg-sandstone/40 hover:bg-sandstone">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(activity.id)} className="p-2 rounded-lg bg-ember/10 text-ember hover:bg-ember/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
