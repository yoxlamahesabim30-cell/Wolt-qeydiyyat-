import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Play, Volume2, Youtube } from 'lucide-react';
import { LINKS, REGISTRATION_REQUIREMENTS } from '../data/fleetData';
import videoPreviewImg from '../assets/images/video_registration_preview_1794716674989.jpg';

function buildGoogleTtsUrl(text: string): string {
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=az&client=tw-ob&q=${encodeURIComponent(
    text
  )}`;
}

export const RequirementsSection: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [thumbError, setThumbError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.setAttribute('referrerpolicy', 'no-referrer');
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
      }
    };
  }, []);

  const toggleRequirement = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSpeakRequirement = (id: string, text: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (speakingId === id) {
      audio.pause();
      audio.currentTime = 0;
      setSpeakingId(null);
      return;
    }

    audio.pause();
    audio.src = buildGoogleTtsUrl(text);
    audio.playbackRate = 0.95;
    setSpeakingId(id);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setSpeakingId(null);
      });
    }
  };

  return (
    <section
      id="telebler"
      className="border-b border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setSpeakingId(null)}
        onError={() => setSpeakingId(null)}
        className="hidden"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
            Müraciət Hazırlığı
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Qeydiyyat Tələbləri və Video Təlimat
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
            Qeydiyyat formunu doldurmazdan əvvəl aşağıdakı 6 tələbin hazır olduğundan əmin olun. Səsli izah üçün istənilən bəndə və ya səs işarəsinə klikləyin.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Interactive Requirements Checklist with Google Translate TTS Audio */}
          <div className="wolt-card rounded-2xl p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0099C6]/20 pb-4">
              <h3 className="font-[var(--font-display)] text-lg font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                Tələb Olunan Sənədlər və Şərtlər
              </h3>
              <span className="text-xs sm:text-sm font-bold text-[#0099C6] tabular-nums">
                {checkedIds.length} / {REGISTRATION_REQUIREMENTS.length} hazırdır
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {REGISTRATION_REQUIREMENTS.map((req) => {
                const isChecked = checkedIds.includes(req.id);
                const isSpeaking = speakingId === req.id;

                return (
                  <li key={req.id}>
                    <div
                      className={`flex w-full items-start gap-3 rounded-xl border p-3.5 transition-colors duration-150 ${
                        isSpeaking
                          ? 'border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A]'
                          : isChecked
                          ? 'border-[#0099C6]/60 bg-[#E4F4FA]/75 dark:bg-[#0F172A]/80'
                          : 'border-[#0099C6]/20 bg-[#F1F5F9] dark:bg-[#0F172A]/50 hover:border-[#0099C6]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleRequirement(req.id)}
                        aria-pressed={isChecked}
                        aria-label={`${req.title} hazır kimi işarələ`}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6] ${
                          isChecked
                            ? 'border-[#0099C6] bg-[#0099C6] text-[#F8FAFC]'
                            : 'border-[#0099C6]/45 bg-[#F8FAFC] dark:bg-[#1E293B] text-transparent hover:border-[#0099C6]'
                        }`}
                      >
                        <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSpeakRequirement(req.id, req.spokenText)}
                        aria-label={`${req.title} səsli izahını dinlə`}
                        className="flex flex-1 items-start justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6] rounded-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-[var(--font-display)] text-xs font-extrabold text-[#0099C6] tabular-nums">
                              {req.number}.
                            </span>
                            <span className="text-sm sm:text-base font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                              {req.title}
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1]">
                            {req.detail}
                          </p>
                        </div>

                        {isSpeaking ? (
                          <span
                            className="mt-0.5 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#0099C6] px-3 text-xs font-bold text-[#F8FAFC] animate-pulse"
                            aria-hidden="true"
                          >
                            <span className="inline-flex items-end gap-0.5 h-3">
                              <span className="w-0.5 h-2 bg-[#F8FAFC] rounded-full animate-bounce" />
                              <span className="w-0.5 h-3 bg-[#F8FAFC] rounded-full animate-pulse" />
                              <span className="w-0.5 h-1.5 bg-[#F8FAFC] rounded-full animate-bounce" />
                            </span>
                            <span>çalınır...</span>
                          </span>
                        ) : (
                          <span
                            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#1E293B] text-[#0099C6] hover:bg-[#0099C6] hover:text-[#F8FAFC] transition-colors"
                            title="Səsli izahı dinlə"
                            aria-hidden="true"
                          >
                            <Volume2 className="h-4 w-4" />
                          </span>
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div
              id="qeydiyyat-formasi"
              className="mt-6 scroll-mt-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#0099C6]/20 pt-6"
            >
              <p className="text-xs sm:text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">
                30 Noyabr 2026 tarixinədək qeydiyyat tamamilə ödənişsizdir.
              </p>
              <a
                href={LINKS.registration}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-5 py-3 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
              >
                <span>Qeydiyyat Formunu Aç</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: Registration Video Guide */}
          <div className="wolt-card-soft rounded-2xl p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-[#0099C6]">
                Addım-Addım İzah
              </p>
              <h3 className="mt-1.5 font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                Qeydiyyat Video Təlimatı
              </h3>
              <p className="mt-2.5 text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                Müraciət formunun doldurulması və sənədlərin düzgün göndərilməsi qaydasını qısa video təlimatda izləyin.
              </p>

              {/* Video Preview Thumbnail Anchor */}
              <a
                href={LINKS.video}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube-da qeydiyyat video təlimatını izlə"
                className="group relative mt-5 block aspect-video overflow-hidden rounded-xl border border-[#0099C6]/35 bg-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
              >
                {!thumbError ? (
                  <img
                    src={videoPreviewImg}
                    alt="FLASHLY FLEET Wolt kuryer qeydiyyat video təlimatı"
                    referrerPolicy="no-referrer"
                    onError={() => setThumbError(true)}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#1E293B]" />
                )}

                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B]/85 via-[#0B1B2B]/25 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0099C6] text-[#F8FAFC] shadow-xl transition-transform duration-150 group-hover:scale-105 group-hover:bg-[#007FA6]">
                    <Play className="h-6 w-6 fill-current ml-0.5" aria-hidden="true" />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="text-xs font-bold text-[#F8FAFC]">
                    Qeydiyyat Prosesi · Video Təlimat
                  </p>
                </div>
              </a>
            </div>

            <a
              href={LINKS.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-5 py-3 text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
            >
              <Youtube className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Videonu YouTube-da İzlə</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
