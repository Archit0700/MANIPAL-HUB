import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';

export const revalidate = 0;

export default async function EventsPage() {
  const events = await api.events();

  const sorted = [...events].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Events</h1>
        <p style={{ color: 'rgba(226,232,240,0.75)', maxWidth: '640px' }}>
          Plan your semester with upcoming expos, showcases, and campus happenings.
        </p>
      </div>

      <div className="card-grid">
        {sorted.map((event) => (
          <div key={event.id} className="card">
            <p style={{ color: 'rgba(148,163,184,0.85)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              {formatDate(event.startAt, { hour: 'numeric', minute: '2-digit' })}
              {event.endAt ? ` - ${formatDate(event.endAt, { hour: 'numeric', minute: '2-digit' })}` : ''}
            </p>
            <h2 style={{ marginTop: 0 }}>{event.title}</h2>
            <p style={{ color: 'rgba(226,232,240,0.78)' }}>{event.summary}</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(94,234,212,0.8)', marginTop: '0.75rem' }}>{event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
