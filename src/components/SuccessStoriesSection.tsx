import React, { useState } from 'react';
import { Star } from 'lucide-react';
import elvinAvatarImg from '../assets/images/courier_avatar_elvin_1794737374373.jpg';
import ayselAvatarImg from '../assets/images/courier_avatar_aysel_1794737375107.jpg';
import turalAvatarImg from '../assets/images/courier_avatar_tural_wolt_1794737388255.jpg';

interface CourierStory {
  id: string;
  name: string;
  initials: string;
  vehicle: string;
  city: string;
  quote: string;
  avatar: string;
}

const COURIER_STORIES: CourierStory[] = [
  {
    id: 'elvin',
    name: 'Elvin M.',
    initials: 'EM',
    vehicle: 'Velosiped',
    city: 'Bakı',
    quote: 'Ayda 980 AZN qazanıram, öz işimin patronuyam',
    avatar: elvinAvatarImg,
  },
  {
    id: 'aysel',
    name: 'Aysel H.',
    initials: 'AH',
    vehicle: 'Skuter',
    city: 'Sumqayıt',
    quote: 'Tələbəyəm, dərsdən sonra işləyib 1200 AZN qazanıram',
    avatar: ayselAvatarImg,
  },
  {
    id: 'tural',
    name: 'Tural R.',
    initials: 'TR',
    vehicle: 'Avtomobil',
    city: 'Bakı',
    quote: 'Əvvəl taksi sürürdüm, indi Wolt-da daha çox qazanıram',
    avatar: turalAvatarImg,
  },
];

export const SuccessStoriesSection: React.FC = () => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  return (
    <section
      id="ugurlu-kuryerler"
      className="corporate-gradient border-b border-blue-400/15 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold text-sky-400">
            Real Təcrübələr
          </p>
          <h2
            className="mt-2 font-[var(--font-display)] font-bold tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
          >
            Onlar Artıq Qazanır, Sən Niyə Yox?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Komandamızla işləyən kuryerlərin gündəlik iş və qazanc təcrübələri.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {COURIER_STORIES.map((story) => (
            <article
              key={story.id}
              className="card-surface rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-sky-400/40 bg-blue-900/70">
                    {!imgErrors[story.id] ? (
                      <img
                        src={story.avatar}
                        alt={`${story.name} — ${story.vehicle} kuryeri`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setImgErrors((prev) => ({ ...prev, [story.id]: true }))
                        }
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-[var(--font-display)] text-base font-bold text-white">
                        {story.initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-[var(--font-display)] text-base sm:text-lg font-bold text-white truncate">
                      {story.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-sky-300">
                      {story.vehicle} · {story.city}
                    </p>
                  </div>
                </div>

                {/* 5 Stars */}
                <div
                  className="mt-4 flex items-center gap-1"
                  aria-label="5 ulduzdan 5 reytinq"
                >
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="mt-3 text-sm sm:text-base text-slate-100 leading-relaxed">
                  “{story.quote}”
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
