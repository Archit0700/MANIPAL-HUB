import { api } from '../../lib/api';

export const revalidate = 0;

export default async function FaqPage() {
  const faqs = await api.faqs();

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'rgba(226,232,240,0.75)', maxWidth: '640px' }}>
          Answers to the topics students ask about the most: IDs, parking, wellness, and academic support.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {faqs.map((faq) => (
          <details key={faq.id} className="card">
            <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{faq.question}</summary>
            <p style={{ marginTop: '0.75rem', color: 'rgba(226,232,240,0.85)' }}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
