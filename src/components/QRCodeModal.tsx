import React, { useState } from 'react';
import { QrCode, Download, ExternalLink, Printer, Check, Copy, Sparkles, X, Smartphone } from 'lucide-react';
import { WeddingEvent } from '../types';

interface QRCodeModalProps {
  event: WeddingEvent;
  onClose: () => void;
  onOpenGuestMode: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ event, onClose, onOpenGuestMode }) => {
  const [copied, setCopied] = useState(false);

  const fullGuestUrl = `${window.location.origin}${event.directGuestUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullGuestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = event.qrCodeDataUrl;
    link.download = `${event.name.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    link.click();
  };

  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div id="qr-modal-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div id="qr-modal-container" className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Event QR Scanner & Standee</h3>
              <p className="text-xs text-slate-400">Guests scan this at your wedding reception table</p>
            </div>
          </div>
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Standee Card */}
        <div className="p-6 flex flex-col items-center">
          <div
            id="printable-standee"
            className="w-full max-w-sm bg-gradient-to-b from-stone-50 via-white to-stone-100 text-slate-900 rounded-xl p-6 shadow-xl border-4 border-amber-200 text-center relative overflow-hidden"
          >
            {/* Elegant corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/60" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/60" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/60" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/60" />

            <div className="text-[11px] font-semibold tracking-widest text-amber-800 uppercase mb-1">
              {event.studioName}
            </div>
            <h4 className="text-xl font-serif font-bold text-stone-900 tracking-tight mb-0.5">
              {event.coupleNames}
            </h4>
            <p className="text-xs text-stone-500 mb-4">{event.date} • {event.venue}</p>

            {/* QR Code Container */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-inner inline-block mx-auto mb-3">
              <img
                id="event-qr-image"
                src={event.qrCodeDataUrl}
                alt={`QR code for ${event.name}`}
                className="w-52 h-52 object-contain"
              />
            </div>

            <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Face Scan Instant Gallery</span>
            </div>
            <p className="text-[13px] text-stone-700 leading-snug px-2">
              Scan with your phone camera & take a 1-second selfie to find all your pictures!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="w-full mt-6 space-y-3">
            <button
              id="test-as-guest-btn"
              onClick={onOpenGuestMode}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              <span>Test as Guest (Face Recognition Scan)</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                id="download-qr-btn"
                onClick={handleDownloadQR}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Save QR</span>
              </button>
              <button
                id="copy-link-btn"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                id="print-standee-btn"
                onClick={handlePrintStandee}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
