'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/events', label: 'Events' },
  { href: '/map', label: 'Map' },
  { href: '/chat', label: 'Chat' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: '1px solid rgba(148,163,184,0.25)',
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(12px)',
        color: 'rgba(226,232,240,0.92)',
      }}
    >
      <div
        className="container"
        style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 600,
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            color: '#f8fafc',
          }}
        >
          MANIPAL HUB
        </Link>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: active ? '1px solid rgba(94,234,212,0.6)' : '1px solid transparent',
                  background: active ? 'rgba(94,234,212,0.12)' : 'transparent',
                  fontSize: '0.95rem',
                  color: active ? 'rgba(94,234,212,0.9)' : 'rgba(226,232,240,0.85)',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
