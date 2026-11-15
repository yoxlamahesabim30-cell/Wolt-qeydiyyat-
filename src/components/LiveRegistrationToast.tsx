import React, { useEffect, useState } from 'react';
import { User, X } from 'lucide-react';

const LIVE_NOTIFICATIONS = [
  'Elvin • Bakı • 2 dəqiqə əvvəl qeydiyyatdan keçdi ✅',
  'Aysel • Sumqayıt • 5 dəqiqə əvvəl qeydiyyatdan keçdi ✅',
  'Tural • Bakı • 9 dəqiqə əvvəl qeydiyyatdan keçdi ✅',
  'Nigar • Gəncə • 12 dəqiqə əvvəl qeydiyyatdan keçdi ✅',
  'Rəşad • Bakı • 18 dəqiqə əvvəl qeydiyyatdan keçdi ✅',
  'Samirə • Sumqayıt • 23 dəqiqə əvvəl qeydiyyatdan keçdi ✅',
] as const;

export const LiveRegistrationToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let hideTimeout: number | undefined;
    let intervalId: number | undefined;

    const triggerToast = (advanceIndex: boolean) => {
      if (advanceIndex) {
        setCurrentIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
      }
      setVisible(true);
      window.clearTimeout(hideTimeout);
      hideTimeout = window.setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    // Show first notification 5 seconds after entering the site
    const initialTimeout = window.setTimeout(() => {
      triggerToast(false);

      // Repeat every 15 seconds continuously
      intervalId = window.setInterval(() => {
        triggerToast(true);
      }, 15000);
    }, 5000);

    return () => {
      window.clearTimeout(initialTimeout);
      window.clearTimeout(hideTimeout);
      window.clearInterval(intervalId);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-30 max-w-[calc(100vw-5.75rem)] sm:bottom-6 sm:left-6 sm:max-w-sm"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-blue-400/25 bg-[#091838]/95 px-3.5 py-3 text-white shadow-2xl shadow-black/50 backdrop-blur-md">
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
          aria-hidden="true"
        >
          <User className="h-4 w-4" />
        </span>

        <p className="min-w-0 flex-1 text-xs sm:text-sm font-medium leading-snug text-slate-100">
          {LIVE_NOTIFICATIONS[currentIndex]}
        </p>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Bildirişi bağla"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
