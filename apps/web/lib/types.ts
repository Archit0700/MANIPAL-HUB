export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body?: string;
  heroImage?: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export type Poi = {
  id: string;
  name: string;
  summary: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EventItem = {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  startAt: string;
  endAt: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Doc = {
  id: string;
  title: string;
  source: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChatCitation = {
  id: string;
  content: string;
  source?: string | null;
  distance: number;
};

export type ChatResponse = {
  answer: string;
  citations: ChatCitation[];
};
