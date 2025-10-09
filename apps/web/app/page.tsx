import Link from 'next/link';
import { api } from '../lib/api';

export default async function HomePage() {
  const [articles, events] = await Promise.all([api.articles(), api.events()]);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <section style={{ textAlign: 'center', paddingTop: '1rem' }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>MANIPAL HUB</h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', color: 'rgba(226,232,240,0.8)' }}>
          Explore curated articles, campus FAQs, upcoming events, and an interactive map. Chat with the assistant to
          get context-aware answers sourced from campus knowledge.
        </p>
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.8rem' }}>Latest Articles</h2>
          <Link href="/articles" style={{ color: 'rgba(94,234,212,1)' }}>
            View all
          </Link>
        </div>
        <div className="card-grid">
          {articles.slice(0, 3).map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="card">
              <h3 style={{ marginTop: 0 }}>{article.title}</h3>
              <p style={{ color: 'rgba(226,232,240,0.75)' }}>
                {article.summary ?? article.body?.slice(0, 160)}
                {article.summary || article.body ? '...' : ''}
              </p>
              <div style={{ marginTop: '1rem' }}>
                {article.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.8rem' }}>Upcoming Events</h2>
          <Link href="/events" style={{ color: 'rgba(94,234,212,1)' }}>
            All events
          </Link>
        </div>
        <div className="card-grid">
          {events.slice(0, 2).map((event) => (
            <div key={event.id} className="card">
              <h3>{event.title}</h3>
              <p style={{ color: 'rgba(226,232,240,0.75)' }}>{event.summary}</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', color: 'rgba(148,163,184,0.85)' }}>
                {event.location}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
