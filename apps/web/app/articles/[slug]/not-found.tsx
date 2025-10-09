import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Article not found</h1>
      <p style={{ color: 'rgba(226,232,240,0.75)' }}>
        Return to the <Link href="/articles">articles directory</Link> to explore the full knowledge base.
      </p>
    </div>
  );
}
