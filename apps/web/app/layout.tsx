import './globals.css';
import type { Metadata } from 'next';
import { SiteHeader } from '../components/site-header';

export const metadata: Metadata = {
  title: 'MANIPAL HUB',
  description: 'Manipal University Jaipur knowledge base, map, and chat assistant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-body">
        <SiteHeader />
        <main>
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}
