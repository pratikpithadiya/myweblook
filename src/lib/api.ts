import { WeddingEvent, FaceMatchResponse, CloudStorageMetrics, Photo } from '../types';

export async function fetchEvents(): Promise<WeddingEvent[]> {
  const res = await fetch('/api/events');
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchEvent(id: string): Promise<WeddingEvent> {
  const res = await fetch(`/api/events/${id}`);
  if (!res.ok) throw new Error('Failed to fetch event');
  return res.json();
}

export async function createEvent(data: {
  name: string;
  coupleNames: string;
  date?: string;
  venue?: string;
  studioName?: string;
  coverUrl?: string;
}): Promise<WeddingEvent> {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function uploadPhotos(
  eventId: string,
  photos: Array<{
    url: string;
    title?: string;
    category?: string;
    faceCount?: number;
    detectedPersons?: string[];
    faceFeatures?: string;
  }>
): Promise<{ message: string; photos: Photo[]; totalPhotos: number }> {
  const res = await fetch(`/api/events/${eventId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos }),
  });
  if (!res.ok) throw new Error('Failed to upload photos');
  return res.json();
}

export async function matchFace(data: {
  eventId: string;
  selfieImage?: string;
  guestPersonaHint?: string;
}): Promise<FaceMatchResponse> {
  const res = await fetch('/api/face-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to perform facial match');
  return res.json();
}

export async function fetchStorageMetrics(): Promise<CloudStorageMetrics> {
  const res = await fetch('/api/cloud-storage/metrics');
  if (!res.ok) throw new Error('Failed to fetch storage metrics');
  return res.json();
}
