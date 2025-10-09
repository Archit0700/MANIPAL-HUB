import { Article, ChatResponse, Doc, EventItem, Faq, Poi } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  articles(): Promise<Article[]> {
    return fetchJson<Article[]>('/articles');
  },
  article(slug: string): Promise<Article> {
    return fetchJson<Article>(`/articles/${slug}`);
  },
  faqs(): Promise<Faq[]> {
    return fetchJson<Faq[]>('/faqs');
  },
  pois(): Promise<Poi[]> {
    return fetchJson<Poi[]>('/pois');
  },
  events(): Promise<EventItem[]> {
    return fetchJson<EventItem[]>('/events');
  },
  docs(): Promise<Doc[]> {
    return fetchJson<Doc[]>('/docs');
  },
  async chat(message: string, limit = 5): Promise<ChatResponse> {
    return fetchJson<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, limit }),
    });
  },
};
