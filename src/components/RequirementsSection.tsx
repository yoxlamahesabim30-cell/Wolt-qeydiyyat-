import React, { useState } from 'react';
import { ArrowUpRight, Check, Play, Youtube } from 'lucide-react';
import { LINKS, REGISTRATION_REQUIREMENTS } from '../data/fleetData';
import videoPreviewImg from '../assets/images/video_registration_preview_1794716674989.jpg';

export const RequirementsSection: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [thumbError, setThumbError] = useState(false);

  const toggleRequirement = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="telebler"
      className="border-b border-blue-400/15 bg-[#061026] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold text-sky-400">
            Müraciət Hazırlığı
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-bold tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Qeydiyyat Tələbləri və Video Təlimat
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Qeydiyyat formunu doldurmazdan əvvəl aşağıdakı 6 tələbin hazır olduğundan əmin olun və video təlimatı izləyin.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Interactive Requirements Checklist */}
          <div className="card-surface rounded-2xl p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-400/15 pb-4">
              <h3 className="font-[var(--font-display)] text-lg font-bold text-white">
                Tələb Olunan Sənədlər və Şərtlər
              </h3>
              <span className="text-xs sm:text-sm font-semibold text-sky-300 tabular-nums">
                {checkedIds.length} / {REGISTRATION_REQUIREMENTS.length} hazırdır
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {REGISTRATION_REQUIREMENTS.map((req) => {
                const isChecked = checkedIds.includes(req.id);
                return (
                  <li key={req.id}>
                    <button
                      type="button"
                      onClick={() => toggleRequirement(req.id)}
                      aria-pressed={isChecked}
                      className={`flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        isChecked
                          ? 'border-sky-400/50 bg-blue-900/45'
                          : 'border-blue-400/15 bg-[#040b1a]/70 hover:border-blue-400/35'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          isChecked
                            ? 'border-sky-400 bg-sky-400 text-slate-950'
                            : 'border-blue-400/35 bg-blue-950/60 text-transparent'
                        }`}
                        aria-hidden="true"
                      >
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-[var(--font-display)] text-xs font-bold text-sky-400 tabular-nums">
                            {req.number}.
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-white">
                            {req.title}
                          </span>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-slate-300">
                          {req.detail}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-blue-400/15 pt-6">
              <p className="text-xs sm:text-sm text-slate-300">
                30 Noyabr 2026 tarixinədək qeydiyyat tamamilə ödənişsizdir.
              </p>
              <a
                href={LINKS.registration}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                <span>Qeydiyyat Formunu Aç</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: Registration Video Guide */}
          <div className="card-surface rounded-2xl p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-sky-400">
                Addım-Addım İzah
              </p>
              <h3 className="mt-1.5 font-[var(--font-display)] text-lg sm:text-xl font-bold text-white">
                Qeydiyyat Video Təlimatı
              </h3>
              <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                Müraciət formunun doldurulması və sənədlərin düzgün göndərilməsi qaydasını qısa video təlimatda izləyin.
              </p>

              {/* Video Preview Thumbnail Anchor */}
              <a
                href={LINKS.video}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube-da qeydiyyat video təlimatını izlə"
                className="group relative mt-5 block aspect-video overflow-hidden rounded-xl border border-blue-400/25 bg-[#040b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
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
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-900/70 to-[#040b1a]" />
                )}

                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#040b1a]/85 via-[#040b1a]/30 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-slate-950 shadow-xl transition-transform duration-150 group-hover:scale-105">
                    <Play className="h-6 w-6 fill-current ml-0.5" aria-hidden="true" />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="text-xs font-semibold text-white">
                    Qeydiyyat Prosesi · Video Təlimat
                  </p>
                </div>
              </a>
            </div>

            <a
              href={LINKS.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
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
