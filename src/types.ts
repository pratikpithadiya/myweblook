export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: 'ceremony' | 'reception' | 'portraits' | 'party' | 'candid';
  timestamp: string;
  cloudStorageRef: string;
  isEncrypted: boolean;
  fileSizeBytes: number;
  faceCount: number;
  detectedPersons?: string[]; // IDs of recognized personas (e.g. 'guest_maya', 'guest_david', 'bride', 'groom')
  faceFeatures?: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  coupleNames: string;
  date: string;
  venue: string;
  studioName: string;
  coverUrl: string;
  qrCodeDataUrl: string;
  directGuestUrl: string;
  totalPhotos: number;
  photos: Photo[];
  cloudStorageBucket: string;
  encryptionStatus: 'AES-256-Active' | 'Ready';
  syncStatus: 'Live Sync Active' | 'Completed' | 'Idle';
  createdAt: string;
}

export interface FaceMatchResponse {
  success: boolean;
  guestId?: string;
  matchedPhotoIds: string[];
  confidenceScore: number;
  analysisNotes?: string;
  detectedFeatures?: string;
  processingTimeMs: number;
}

export interface CloudStorageMetrics {
  bucketName: string;
  region: string;
  totalStorageBytes: number;
  totalPhotosProcessed: number;
  encryptionStandard: string;
  cdnLatencyMs: number;
  syncRatePerMin: number;
  securityCompliance: string[];
}
