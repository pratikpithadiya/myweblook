import React, { useState } from 'react';
import {
  QrCode,
  UploadCloud,
  ShieldCheck,
  Zap,
  Plus,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
  Lock,
  Layers,
  Calendar,
  MapPin,
  Camera,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { WeddingEvent, Photo, CloudStorageMetrics } from '../types';
import { uploadPhotos, createEvent } from '../lib/api';

interface StudioDashboardProps {
  events: WeddingEvent[];
  currentEvent: WeddingEvent;
  storageMetrics: CloudStorageMetrics | null;
  onSelectEvent: (event: WeddingEvent) => void;
  onRefreshEvents: () => void;
  onOpenQRModal: () => void;
  onOpenGuestMode: () => void;
}

// Curated sample batch photos for instant camera sync simulation
const SAMPLE_ADDITIONAL_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    title: 'Bouquet Toss Golden Hour',
    category: 'party',
    faceCount: 3,
    detectedPersons: ['guest_maya', 'guest_emma'],
    faceFeatures: 'Maya and Emma reaching for bridal bouquet during reception party.',
  },
  {
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    title: 'First Dance Under Chandeliers',
    category: 'reception',
    faceCount: 2,
    detectedPersons: ['bride', 'groom'],
    faceFeatures: 'Bride and Groom slow dancing under floral chandelier.',
  },
  {
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    title: 'Groomsmen Cheers & Cigar Lounge',
    category: 'candid',
    faceCount: 2,
    detectedPersons: ['guest_david', 'groom'],
    faceFeatures: 'David and Groom celebrating with cigars in terrace lounge.',
  },
  {
    url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    title: 'Sunset Vineyard Stroll',
    category: 'portraits',
    faceCount: 2,
    detectedPersons: ['bride', 'groom'],
    faceFeatures: 'Intimate portrait among Tuscan vineyards at golden sunset.',
  },
];

export const StudioDashboard: React.FC<StudioDashboardProps> = ({
  events,
  currentEvent,
  storageMetrics,
  onSelectEvent,
  onRefreshEvents,
  onOpenQRModal,
  onOpenGuestMode,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStorageDetails, setShowStorageDetails] = useState(false);

  // New Event Form State
  const [newEventName, setNewEventName] = useState('');
  const [newCoupleNames, setNewCoupleNames] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Simulate auto-upload from photographer's camera or memory card
  const handleAutoCameraSync = async () => {
    setIsUploading(true);
    setUploadProgress('Connecting to Camera Wi-Fi...');

    setTimeout(async () => {
      setUploadProgress('Encrypting & Uploading 4 Raw Frames to Cloud Storage...');
      setTimeout(async () => {
        setUploadProgress('Gemini Vision AI: Vectorizing Faces & Biometric Indexing...');
        try {
          await uploadPhotos(currentEvent.id, SAMPLE_ADDITIONAL_PHOTOS);
          setUploadProgress('Sync Complete! 4 Photos Added & Indexed');
          onRefreshEvents();
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(null);
          }, 1000);
        } catch (err) {
          console.error('Upload failed:', err);
          setIsUploading(false);
          setUploadProgress(null);
        }
      }, 1000);
    }, 800);
  };

  const handleCreateNewEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName || !newCoupleNames) return;

    setIsCreatingEvent(true);
    try {
      const created = await createEvent({
        name: newEventName,
        coupleNames: newCoupleNames,
        date: newDate || 'Upcoming Weekend',
        venue: newVenue || 'Lakeside Estate & Gardens',
        studioName: currentEvent.studioName,
      });
      setShowCreateModal(false);
      setNewEventName('');
      setNewCoupleNames('');
      setNewDate('');
      setNewVenue('');
      onRefreshEvents();
      onSelectEvent(created);
    } catch (err) {
      console.error('Event creation error:', err);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const currentPhotos = currentEvent?.photos || [];
  const filteredPhotos = filterCategory === 'all'
    ? currentPhotos
    : currentPhotos.filter(p => p.category === filterCategory);

  return (
    <div id="studio-dashboard-main" className="space-y-6">
      {/* Top Studio Bar with Event Selector & Cloud Vault Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                <span>{currentEvent.studioName}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">Photographer Control Hub</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
              {currentEvent.name}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
                <span>{currentEvent.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500/80" />
                <span>{currentEvent.venue}</span>
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentPhotos.length} Photos Indexed</span>
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Event Switcher */}
            <select
              id="event-select-dropdown"
              value={currentEvent.id}
              onChange={(e) => {
                const found = events.find(ev => ev.id === e.target.value);
                if (found) onSelectEvent(found);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500 font-medium"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.coupleNames} ({(ev.photos || []).length} photos)
                </option>
              ))}
            </select>

            <button
              id="open-create-event-modal-btn"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>New Event</span>
            </button>

            {/* Cloud Storage Vault Badge */}
            <button
              id="cloud-storage-metrics-btn"
              onClick={() => setShowStorageDetails(!showStorageDetails)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AES-256 Cloud Vault</span>
            </button>
          </div>
        </div>

        {/* Expandable Cloud Storage Details */}
        {showStorageDetails && storageMetrics && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in duration-200">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Encrypted Storage Bucket</span>
              <span className="text-emerald-400 font-mono font-semibold truncate block">
                {storageMetrics.bucketName}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Total Vault Storage</span>
              <span className="text-white font-mono font-semibold block">
                {(storageMetrics.totalStorageBytes / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Multi-Region Edge CDN</span>
              <span className="text-amber-400 font-mono font-semibold block">
                {storageMetrics.cdnLatencyMs}ms Global Latency
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Security Standard</span>
              <span className="text-slate-300 font-semibold block">
                AES-256 CMEK + Zero Leak
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Event QR Code Standee Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <QrCode className="w-4 h-4" />
                <span>Wedding QR Standee</span>
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                Auto-Generated
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Guest Reception QR Code
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Place this standee at tables or entry kiosk. When guests scan with their phone, they are guided to scan their face and instantly access only their pictures.
            </p>

            {/* QR Code Preview Thumbnail */}
            <div
              onClick={onOpenQRModal}
              className="bg-stone-50 p-4 rounded-xl border border-amber-200/40 shadow-inner flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform group relative"
            >
              <img
                src={currentEvent.qrCodeDataUrl}
                alt="Event QR Preview"
                className="w-40 h-40 object-contain"
              />
              <div className="mt-2 text-center">
                <div className="text-[11px] font-serif font-bold text-stone-900">{currentEvent.coupleNames}</div>
                <div className="text-[9px] text-amber-800 font-semibold tracking-wider uppercase">Scan for Face Match Gallery</div>
              </div>
              <div className="absolute inset-0 bg-slate-950/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                <Eye className="w-4 h-4" />
                <span>View Full Standee</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <button
              id="open-qr-standee-modal-btn"
              onClick={onOpenQRModal}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Open Printable Standee</span>
            </button>
            <button
              id="launch-mobile-guest-test-btn"
              onClick={onOpenGuestMode}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Test Face Scan as Guest</span>
            </button>
          </div>
        </div>

        {/* Card 2: Automatic Camera Sync & High-Speed Image Processing */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <UploadCloud className="w-4 h-4" />
                <span>Automated Ingestion</span>
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                {currentEvent.syncStatus}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              High-Speed Photo Upload & AI Indexing
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              As you take photos during the wedding ceremony, photos auto-upload and Gemini Vision extracts facial biometric descriptors in milliseconds.
            </p>

            {/* Ingestion Pipeline Visualizer */}
            <div className="space-y-2.5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Wi-Fi Tether / SD Sync</span>
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AES-256 Cloud Vault</span>
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gemini 3.8 Flash Vision</span>
                </span>
                <span className="text-amber-400 font-mono text-[11px]">340ms/photo</span>
              </div>
            </div>

            {/* Live Progress Bar if Uploading */}
            {isUploading && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Wedding Photos...</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-4/5 animate-pulse" />
                </div>
                <p className="text-[10px] text-amber-200/80 italic">{uploadProgress}</p>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button
              id="simulate-camera-sync-btn"
              disabled={isUploading}
              onClick={handleAutoCameraSync}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Simulate Camera Wi-Fi Sync (+4 Photos)</span>
            </button>
          </div>
        </div>

        {/* Card 3: Cloud Storage Security Vault */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Cloud Storage</span>
              </span>
              <span className="text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/20 font-mono">
                Encrypted
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Zero-Leak Wedding Privacy
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Guests can only unlock photos where they appear. Full gallery access is protected by biometric validation and time-limited signed URLs.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Total Encrypted Storage</span>
                <span className="text-white font-mono font-bold">
                  {((currentPhotos.reduce((acc, p) => acc + p.fileSizeBytes, 0)) / 1000000).toFixed(1)} MB
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Security Encryption</span>
                <span className="text-emerald-400 font-mono font-bold">AES-256 CMEK</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Face Recognition Engine</span>
                <span className="text-amber-400 font-mono font-bold">Gemini 3.8 Flash</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="text-slate-200 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Personalized Delivery Guarantee</span>
              </div>
              <p>Guests scan QR &gt; Scan face &gt; Download personalized wedding collection in 1 tap.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wedding Photos Gallery Grid with Face Recognition Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Event Photo Stream</span>
              <span className="text-xs font-normal text-slate-400">({currentPhotos.length} total)</span>
            </h2>
            <p className="text-xs text-slate-400">
              High-resolution wedding frames with recognized guest tags and facial descriptors
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'ceremony', 'reception', 'portraits', 'party', 'candid'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full capitalize whitespace-nowrap text-xs font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500/50 shadow-md transition-all"
            >
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Top Tag Bar */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <span className="bg-slate-950/80 backdrop-blur-xs text-[10px] text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-500/30">
                  {photo.category.toUpperCase()}
                </span>
                <span className="bg-slate-950/80 backdrop-blur-xs text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>ENC</span>
                </span>
              </div>

              {/* Bottom Metadata Bar */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-2.5 pt-6">
                <p className="text-xs font-bold text-white truncate">{photo.title}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{photo.faceCount} {photo.faceCount === 1 ? 'face' : 'faces'} recognized</span>
                  <span className="font-mono text-amber-400/90 truncate max-w-[110px]">
                    {photo.detectedPersons?.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE NEW EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-1">Create New Wedding Event</h3>
            <p className="text-xs text-slate-400 mb-4">
              Instantly provisions a cloud encrypted storage vault and generates a unique table scanner QR code.
            </p>

            <form onSubmit={handleCreateNewEvent} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Isabella & Noah's Royal Gala"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Couple Names</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Isabella Rossi & Noah Vance"
                  value={newCoupleNames}
                  onChange={(e) => setNewCoupleNames(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. November 12, 2025"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Castiglion del Bosco"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingEvent}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50"
                >
                  {isCreatingEvent ? 'Generating...' : 'Create & Generate QR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
