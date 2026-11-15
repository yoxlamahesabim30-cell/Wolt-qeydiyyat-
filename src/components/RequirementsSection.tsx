import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Play, Volume2, Square, Youtube } from 'lucide-react';
import { LINKS, REGISTRATION_REQUIREMENTS } from '../data/fleetData';
import videoPreviewImg from '../assets/images/video_registration_preview_1794716674989.jpg';

const MALE_VOICE_HINTS = ['babek', 'male', 'kişi', 'erkek', 'man', 'tural', 'orxan', 'murad'];
const FEMALE_VOICE_HINTS = ['banu', 'female', 'qadın', 'woman', 'leyla', 'aynura', 'gulnar', 'emine', 'yeliz', 'filiz'];

function pickAzerbaijaniMaleVoice(voices: SpeechSynthesisVoice[]): {
  voice: SpeechSynthesisVoice | null;
  isExplicitMale: boolean;
} {
  const azVoices = voices.filter((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return (
      lang === 'az' ||
      lang.startsWith('az-') ||
      lang.startsWith('az_') ||
      name.includes('azerbaijani') ||
      name.includes('azərbaycan')
    );
  });

  if (azVoices.length === 0) {
    return { voice: null, isExplicitMale: false };
  }

  const maleAz = azVoices.find((v) => {
    const name = v.name.toLowerCase();
    return MALE_VOICE_HINTS.some((hint) => name.includes(hint));
  });
  if (maleAz) {
    return { voice: maleAz, isExplicitMale: true };
  }

  const nonFemaleAz = azVoices.find((v) => {
    const name = v.name.toLowerCase();
    return !FEMALE_VOICE_HINTS.some((hint) => name.includes(hint));
  });
  if (nonFemaleAz) {
    return { voice: nonFemaleAz, isExplicitMale: false };
  }

  return { voice: azVoices[0], isExplicitMale: false };
}

export const RequirementsSection: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [thumbError, setThumbError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleRequirement = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSpeakRequirement = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceError('Telefonunuzda Azərbaycan dili səsi tapılmadı');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const availableVoices =
      voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const { voice, isExplicitMale } = pickAzerbaijaniMaleVoice(availableVoices);

    if (!voice) {
      setSpeakingId(null);
      setVoiceError('Telefonunuzda Azərbaycan dili səsi tapılmadı');
      return;
    }

    setVoiceError(null);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'az-AZ';
    utterance.voice = voice;

    // Normal, slow and clear official delivery
    utterance.rate = 0.88;
    utterance.pitch = isExplicitMale ? 0.94 : 0.85;
    utterance.volume = 1;

    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
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
            Qeydiyyat formunu doldurmazdan əvvəl aşağıdakı 6 tələbin hazır olduğundan əmin olun. Səsli izah üçün istənilən bəndə və ya səs işarəsinə klikləyin.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Interactive Requirements Checklist with Audio Explanations */}
          <div className="card-surface rounded-2xl p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-400/15 pb-4">
              <h3 className="font-[var(--font-display)] text-lg font-bold text-white">
                Tələb Olunan Sənədlər və Şərtlər
              </h3>
              <span className="text-xs sm:text-sm font-semibold text-sky-300 tabular-nums">
                {checkedIds.length} / {REGISTRATION_REQUIREMENTS.length} hazırdır
              </span>
            </div>

            {voiceError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-xs sm:text-sm font-medium text-yellow-300"
              >
                {voiceError}
              </div>
            )}

            <ul className="mt-5 space-y-3">
              {REGISTRATION_REQUIREMENTS.map((req) => {
                const isChecked = checkedIds.includes(req.id);
                const isSpeaking = speakingId === req.id;

                return (
                  <li key={req.id}>
                    <div
                      className={`flex w-full items-start gap-3 rounded-xl border p-3.5 transition-colors duration-150 ${
                        isSpeaking
                          ? 'border-yellow-400/60 bg-blue-900/55'
                          : isChecked
                          ? 'border-sky-400/50 bg-blue-900/45'
                          : 'border-blue-400/15 bg-[#040b1a]/70 hover:border-blue-400/35'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleRequirement(req.id)}
                        aria-pressed={isChecked}
                        aria-label={`${req.title} hazır kimi işarələ`}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                          isChecked
                            ? 'border-sky-400 bg-sky-400 text-slate-950'
                            : 'border-blue-400/35 bg-blue-950/60 text-transparent hover:border-sky-400/60'
                        }`}
                      >
                        <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSpeakRequirement(req.id, req.spokenText)}
                        aria-label={`${req.title} səsli izahını dinlə`}
                        className="flex flex-1 items-start justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 rounded-lg"
                      >
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

                        <span
                          className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                            isSpeaking
                              ? 'border-yellow-400 bg-yellow-400 text-slate-950'
                              : 'border-blue-400/25 bg-blue-950/70 text-sky-300 hover:border-sky-400/60 hover:text-white'
                          }`}
                          title={isSpeaking ? 'Dayandır' : 'Səsli izahı dinlə'}
                          aria-hidden="true"
                        >
                          {isSpeaking ? (
                            <Square className="h-3.5 w-3.5 fill-current" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                    </div>
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
