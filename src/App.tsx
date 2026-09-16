import React, { useState, useEffect } from 'react';
import {
  Camera,
  QrCode,
  Sparkles,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { WeddingEvent, CloudStorageMetrics } from './types';
import { fetchEvents, fetchStorageMetrics } from './lib/api';
import { StudioDashboard } from './components/StudioDashboard';
import { GuestExperience } from './components/GuestExperience';
import { QRCodeModal } from './components/QRCodeModal';

export default function App() {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<WeddingEvent | null>(null);
  const [storageMetrics, setStorageMetrics] = useState<CloudStorageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'studio' | 'guest'>('studio');
  const [showQRModal, setShowQRModal] = useState(false);
  const [mobilePreviewFrame, setMobilePreviewFrame] = useState(false);

  // Initialize and check for URL parameters (e.g. ?event=id&view=guest from QR code)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsList, metrics] = await Promise.all([
        fetchEvents(),
        fetchStorageMetrics(),
      ]);

      const sanitizedEvents = (eventsList || []).map(ev => ({
        ...ev,
        photos: ev.photos || [],
      }));

      setEvents(sanitizedEvents);
      setStorageMetrics(metrics);

      // Check query params
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get('event');
      const viewParam = params.get('view');

      if (eventParam) {
        const found = sanitizedEvents.find(e => e.id === eventParam);
        if (found) {
          setCurrentEvent(found);
        } else if (sanitizedEvents.length > 0) {
          setCurrentEvent(sanitizedEvents[0]);
        }
      } else if (sanitizedEvents.length > 0) {
        setCurrentEvent(sanitizedEvents[0]);
      }

      if (viewParam === 'guest') {
        setViewMode('guest');
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <p className="text-xs tracking-wider uppercase text-amber-400 font-mono">
          Loading Wedding Studio & Cloud Vault...
        </p>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-400 mb-3">No wedding events found.</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Application Mode Navigation Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Studio Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm tracking-tight text-white">
                  Luxe Wedding Studio
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/15 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20">
                  QR Face Match
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Current Event: <span className="text-amber-300 font-medium">{currentEvent.coupleNames}</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher & Tools */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Studio vs Guest Experience */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
              <button
                id="toggle-studio-mode-btn"
                onClick={() => setViewMode('studio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'studio'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Photographer Studio</span>
              </button>

              <button
                id="toggle-guest-mode-btn"
                onClick={() => setViewMode('guest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'guest'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Guest Face Scan</span>
              </button>
            </div>

            {/* Quick Standee QR trigger */}
            <button
              id="top-nav-qr-btn"
              onClick={() => setShowQRModal(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
              title="Show Event QR Standee"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Mobile Device Frame Toggle (when in guest mode) */}
            {viewMode === 'guest' && (
              <button
                id="toggle-mobile-frame-btn"
                onClick={() => setMobilePreviewFrame(!mobilePreviewFrame)}
                className={`p-2 rounded-xl border text-xs transition-colors ${
                  mobilePreviewFrame
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Toggle Smartphone Frame Preview"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col justify-start">
        {viewMode === 'studio' ? (
          <StudioDashboard
            events={events}
            currentEvent={currentEvent}
            storageMetrics={storageMetrics}
            onSelectEvent={setCurrentEvent}
            onRefreshEvents={loadData}
            onOpenQRModal={() => setShowQRModal(true)}
            onOpenGuestMode={() => setViewMode('guest')}
          />
        ) : (
          /* Guest Experience View */
          <div className="w-full flex justify-center py-2">
            {mobilePreviewFrame ? (
              /* Simulated iPhone / Smartphone Device Frame */
              <div className="relative border-4 border-slate-700 bg-slate-900 rounded-[38px] p-2.5 shadow-2xl shadow-black/80 max-w-[420px] w-full overflow-hidden">
                {/* Dynamic Island / Speaker notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-40 border border-slate-800" />
                <div className="rounded-[30px] overflow-hidden">
                  <GuestExperience
                    event={currentEvent}
                    onBackToStudio={() => setViewMode('studio')}
                  />
                </div>
              </div>
            ) : (
              /* Standard Responsive Mobile Viewport */
              <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <GuestExperience
                  event={currentEvent}
                  onBackToStudio={() => setViewMode('studio')}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Event QR Code & Standee Modal */}
      {showQRModal && (
        <QRCodeModal
          event={currentEvent}
          onClose={() => setShowQRModal(false)}
          onOpenGuestMode={() => {
            setShowQRModal(false);
            setViewMode('guest');
          }}
        />
      )}
    </div>
  );
}
