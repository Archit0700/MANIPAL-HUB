import Link from 'next/link';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';

export const revalidate = 0;

export default async function ArticlesPage() {
  const articles = await api.articles();

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Articles</h1>
        <p style={{ color: 'rgba(226,232,240,0.75)', maxWidth: '700px' }}>
          Long-form guides that highlight campus resources, study tips, and community opportunities.
        </p>
      </div>
      <div className="card-grid">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="card">
            <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.8)', marginBottom: '0.5rem' }}>
              {formatDate(article.publishedAt)}
            </p>
            <h2 style={{ marginTop: 0 }}>{article.title}</h2>
            <p style={{ color: 'rgba(226,232,240,0.75)' }}>{article.summary ?? article.body?.slice(0, 140)}</p>
            <div style={{ marginTop: '1rem' }}>
              {article.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
