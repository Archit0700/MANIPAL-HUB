import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '../../../lib/api';
import { formatDate } from '../../../lib/format';

async function loadArticle(slug: string) {
  try {
    return await api.article(slug);
  } catch (error) {
    return null;
  }
}

type ArticlePageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await loadArticle(params.slug);
  if (!article) {
    return { title: 'Article not found - MANIPAL HUB' };
  }

  return {
    title: `${article.title} - MANIPAL HUB`,
    description: article.summary ?? article.title,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await loadArticle(params.slug);

  if (!article) {
    notFound();
  }

  const published = formatDate(article.publishedAt);
  const sections = article.body?.split(/\n\s*\n/).filter(Boolean) ?? [];

  return (
    <article style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
      <div>
        <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem' }}>{published}</p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{article.title}</h1>
        {article.summary && (
          <p style={{ color: 'rgba(226,232,240,0.8)', fontSize: '1.05rem', maxWidth: '640px' }}>{article.summary}</p>
        )}
        {article.tags.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {article.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1.25rem', color: 'rgba(226,232,240,0.88)', fontSize: '1.05rem' }}>
        {sections.length > 0 ? (
          sections.map((section, index) => <p key={index}>{section}</p>)
        ) : (
          <p>Content coming soon.</p>
        )}
      </div>
    </article>
  );
}
