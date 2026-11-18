import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Link2,
  Loader2,
  MessageCircle,
  Search,
  ShieldCheck,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useRegistrationModal } from '../context/RegistrationModalContext';

type ReferralTab = 'my-link' | 'register-invited';
type ReferrerSubMode = 'request' | 'lookup';

interface InvitedItem {
  id: string;
  referredName: string;
  referredPhoneMasked: string;
  vehicleType: string;
  registrationStatus: 'pending_docs' | 'under_review' | 'approved' | 'rejected';
  bonusStatus: 'pending' | 'approved' | 'rejected';
  bonusAmountSnapshot: string;
  createdAt: string;
}

interface ReferrerResult {
  name: string;
  code: string | null;
  approved: boolean;
  createdAt: string;
}

const REG_STATUS_LABELS: Record<
  InvitedItem['registrationStatus'],
  { label: string; badgeClass: string }
> = {
  pending_docs: {
    label: 'Sənəd gözlənilir',
    badgeClass:
      'bg-[#FEF3C7] text-[#92400E] dark:bg-[#451A03] dark:text-[#FDE68A]',
  },
  under_review: {
    label: 'Sənəd yoxlanılır',
    badgeClass:
      'bg-[#E4F4FA] text-[#007FA6] dark:bg-[#0F172A] dark:text-[#7DD3FC]',
  },
  approved: {
    label: 'Təsdiqlənib',
    badgeClass:
      'bg-[#DCFCE7] text-[#166534] dark:bg-[#052E16] dark:text-[#86EFAC]',
  },
  rejected: {
    label: 'Rədd edilib',
    badgeClass:
      'bg-[#FEE2E2] text-[#991B1B] dark:bg-[#450A0A] dark:text-[#FCA5A5]',
  },
};

const BONUS_STATUS_LABELS: Record<
  InvitedItem['bonusStatus'],
  { label: string; badgeClass: string }
> = {
  pending: {
    label: 'Admin təsdiqi gözləyir',
    badgeClass:
      'bg-[#E2E8F0] text-[#334155] dark:bg-[#334155] dark:text-[#E2E8F0]',
  },
  approved: {
    label: 'Bonus Təsdiqləndi',
    badgeClass:
      'bg-[#DCFCE7] text-[#166534] dark:bg-[#052E16] dark:text-[#86EFAC]',
  },
  rejected: {
    label: 'Ləğv edilib',
    badgeClass:
      'bg-[#FEE2E2] text-[#991B1B] dark:bg-[#450A0A] dark:text-[#FCA5A5]',
  },
};

const REFERRAL_STEPS = [
  {
    number: '01',
    text: 'Təsdiqlənmiş kuryer kimi unikal dəvət linkini və kodunu al',
  },
  {
    number: '02',
    text: 'Dostun həmin linklə qeydiyyatdan keçsin və sənədlərini təsdiqlətsin',
  },
  {
    number: '03',
    text: 'Şərtlər tamamlandıqda və admin təsdiqlədikdə SƏN bonus qazanırsan',
  },
] as const;

const VEHICLE_OPTIONS = [
  'Velosiped',
  'Skuter',
  'Motosiklet',
  'Avtomobil',
] as const;

const LAST_QUERY_STORAGE_KEY = 'flashly_referrer_query';

export const ReferralSection: React.FC = () => {
  const { config, activeRefCode } = useSiteConfig();
  const { openRegistrationModal } = useRegistrationModal();
  const { referralSettings } = config;

  const [activeTab, setActiveTab] = useState<ReferralTab>(() =>
    activeRefCode ? 'register-invited' : 'my-link'
  );
  const [subMode, setSubMode] = useState<ReferrerSubMode>('request');

  // Referrer request / lookup form states
  const [reqName, setReqName] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [lookupQuery, setLookupQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(LAST_QUERY_STORAGE_KEY) || '';
  });
  const [referrerLoading, setReferrerLoading] = useState(false);
  const [referrerError, setReferrerError] = useState('');
  const [referrerResult, setReferrerResult] = useState<ReferrerResult | null>(null);
  const [invitedList, setInvitedList] = useState<InvitedItem[]>([]);
  const [copiedType, setCopiedType] = useState<'link' | 'code' | null>(null);

  // Invited user registration states
  const [invCode, setInvCode] = useState(activeRefCode || '');
  const [invName, setInvName] = useState('');
  const [invPhone, setInvPhone] = useState('');
  const [invVehicle, setInvVehicle] = useState<string>('Velosiped');
  const [invSubmitting, setInvSubmitting] = useState(false);
  const [invError, setInvError] = useState('');
  const [invSuccess, setInvSuccess] = useState<{
    referrerName: string;
    referrerCode: string;
  } | null>(null);
  const [validatedReferrerName, setValidatedReferrerName] = useState('');

  useEffect(() => {
    if (activeRefCode) {
      setInvCode(activeRefCode);
      setActiveTab('register-invited');
    }
  }, [activeRefCode]);

  // Validate active referral code for friendly attribution display
  useEffect(() => {
    const clean = invCode.trim().toUpperCase();
    if (clean.length < 5) {
      setValidatedReferrerName('');
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/referrals/validate/${encodeURIComponent(clean)}`);
        if (!res.ok) {
          if (!cancelled) setValidatedReferrerName('');
          return;
        }
        const data = (await res.json()) as { valid?: boolean; referrerName?: string };
        if (!cancelled && data.valid && data.referrerName) {
          setValidatedReferrerName(data.referrerName);
        } else if (!cancelled) {
          setValidatedReferrerName('');
        }
      } catch {
        if (!cancelled) setValidatedReferrerName('');
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [invCode]);

  // Restore last looked-up courier status silently on load if stored
  useEffect(() => {
    if (!lookupQuery.trim()) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/referrals/referrer-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: lookupQuery.trim() }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          referrer?: ReferrerResult;
          invited?: InvitedItem[];
        };
        if (!cancelled && data.referrer) {
          setReferrerResult(data.referrer);
          setInvitedList(data.invited || []);
        }
      } catch {
        // ignore silent restore error
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const originUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://flashlyfleet.az';

  const personalReferralLink = referrerResult?.code
    ? `${originUrl}/?ref=${encodeURIComponent(referrerResult.code)}`
    : originUrl;

  const shareText = referrerResult?.code
    ? `Salam! FLASHLY FLEET ilə Wolt kuryeri olaraq qeydiyyatdan keç, birlikdə qazanaq! Dəvət kodum: ${referrerResult.code} — Link: ${personalReferralLink}`
    : `Salam! Wolt-da kuryer qeydiyyatı 30 Noyabr-dək pulsuzdur. Link burdadır: ${originUrl}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const copyText = async (value: string, type: 'link' | 'code') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedType(type);
      window.setTimeout(() => setCopiedType(null), 2500);
    } catch {
      setCopiedType(null);
    }
  };

  const handleReferrerRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setReferrerError('');
    if (!reqName.trim() || !reqPhone.trim()) {
      setReferrerError('Zəhmət olmasa ad-soyad və telefon nömrəsini daxil edin.');
      return;
    }

    setReferrerLoading(true);
    try {
      const res = await fetch('/api/referrals/referrer-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reqName.trim(),
          phone: reqPhone.trim(),
        }),
      });
      const data = (await res.json()) as {
        referrer?: ReferrerResult;
        invited?: InvitedItem[];
        error?: string;
      };

      if (!res.ok || !data.referrer) {
        setReferrerError(data.error || 'Sorğu zamanı xəta baş verdi.');
        return;
      }

      setReferrerResult(data.referrer);
      setInvitedList(data.invited || []);
      try {
        window.localStorage.setItem(LAST_QUERY_STORAGE_KEY, reqPhone.trim());
        setLookupQuery(reqPhone.trim());
      } catch {
        // ignore
      }
    } catch {
      setReferrerError('Serverlə əlaqə xətası baş verdi.');
    } finally {
      setReferrerLoading(false);
    }
  };

  const handleReferrerLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setReferrerError('');
    if (!lookupQuery.trim()) {
      setReferrerError('Telefon nömrəsi və ya dəvət kodu daxil edin.');
      return;
    }

    setReferrerLoading(true);
    try {
      const res = await fetch('/api/referrals/referrer-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: lookupQuery.trim() }),
      });
      const data = (await res.json()) as {
        referrer?: ReferrerResult;
        invited?: InvitedItem[];
        error?: string;
      };

      if (!res.ok || !data.referrer) {
        setReferrerResult(null);
        setInvitedList([]);
        setReferrerError(data.error || 'Məlumat tapılmadı.');
        return;
      }

      setReferrerResult(data.referrer);
      setInvitedList(data.invited || []);
      try {
        window.localStorage.setItem(LAST_QUERY_STORAGE_KEY, lookupQuery.trim());
      } catch {
        // ignore
      }
    } catch {
      setReferrerError('Serverlə əlaqə xətası baş verdi.');
    } finally {
      setReferrerLoading(false);
    }
  };

  const handleInvitedRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvError('');
    setInvSuccess(null);

    if (!invCode.trim() || !invName.trim() || !invPhone.trim()) {
      setInvError('Dəvət kodu, ad-soyad və telefon nömrəsi mütləq doldurulmalıdır.');
      return;
    }

    setInvSubmitting(true);
    try {
      const res = await fetch('/api/referrals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: invCode.trim().toUpperCase(),
          name: invName.trim(),
          phone: invPhone.trim(),
          vehicleType: invVehicle,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        referral?: { referrerName: string; referrerCode: string };
        error?: string;
      };

      if (!res.ok || !data.success || !data.referral) {
        setInvError(data.error || 'Dəvət qeydiyyatı tamamlana bilmədi.');
        return;
      }

      setInvSuccess({
        referrerName: data.referral.referrerName,
        referrerCode: data.referral.referrerCode,
      });
      setInvName('');
      setInvPhone('');
    } catch {
      setInvError('Serverlə əlaqə zamanı xəta baş verdi.');
    } finally {
      setInvSubmitting(false);
    }
  };

  const bonusLabel = referralSettings.bonusAmount
    ? referralSettings.bonusAmount
    : 'Məbləğ admin tərəfindən təyin ediləcək';

  return (
    <section
      id="dostunu-getir"
      className="border-b border-[#0099C6]/20 bg-[#F1F5F9] dark:bg-[#0F172A] py-14 sm:py-20 transition-colors"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="wolt-card rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-bold text-[#0099C6]">
              Tövsiyə Proqramı
            </p>
            <h2
              className="mt-2 font-[var(--font-display)] font-extrabold tracking-tight text-[#0B1B2B] dark:text-[#E2E8F0] text-balance"
              style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)' }}
            >
              🤝 Dostunu Gətir, Bonus Qazan!
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1]">
              Qazanmağı tək yemə, dostunla bölüş!
            </p>
          </div>

          {/* 3 Steps */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {REFERRAL_STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-5"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] font-[var(--font-display)] text-xs font-extrabold text-[#0099C6] tabular-nums shadow-xs">
                  {step.number}
                </span>
                <p className="mt-3 font-[var(--font-display)] text-sm sm:text-base font-bold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {!referralSettings.enabled ? (
            <div className="mt-7 rounded-2xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] p-6 text-center">
              <p className="font-[var(--font-display)] text-sm sm:text-base font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                Referral proqramı hazırda admin tərəfindən müvəqqəti dayandırılıb.
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1]">
                Aktivləşdirildikdə burada unikal dəvət linkinizlə dostlarınızı dəvət edə biləcəksiniz.
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] p-4 sm:p-6">
              {/* Primary Mode Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('my-link')}
                  className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-all ${
                    activeTab === 'my-link'
                      ? 'bg-[#0099C6] text-[#F8FAFC] shadow-sm'
                      : 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0B1B2B] dark:text-[#E2E8F0] border border-[#0099C6]/25 hover:border-[#0099C6]'
                  }`}
                >
                  <Link2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Unikal Dəvət Linkim (Kuryerlər)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('register-invited')}
                  className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-all ${
                    activeTab === 'register-invited'
                      ? 'bg-[#0099C6] text-[#F8FAFC] shadow-sm'
                      : 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0B1B2B] dark:text-[#E2E8F0] border border-[#0099C6]/25 hover:border-[#0099C6]'
                  }`}
                >
                  <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    Dəvət Kodu ilə Qeydiyyat{activeRefCode ? ` (${activeRefCode})` : ''}
                  </span>
                </button>
              </div>

              {/* TAB 1: COURIER REFERRAL LINK & TRACKER */}
              {activeTab === 'my-link' && (
                <div className="mt-5 space-y-5">
                  {/* Toggle Request vs Lookup */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubMode('request');
                        setReferrerError('');
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                        subMode === 'request'
                          ? 'bg-[#0B1B2B] text-[#F8FAFC] dark:bg-[#0099C6]'
                          : 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#334155] dark:text-[#CBD5E1] border border-[#0099C6]/20'
                      }`}
                    >
                      Kuryer kimi link tələb et
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubMode('lookup');
                        setReferrerError('');
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                        subMode === 'lookup'
                          ? 'bg-[#0B1B2B] text-[#F8FAFC] dark:bg-[#0099C6]'
                          : 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#334155] dark:text-[#CBD5E1] border border-[#0099C6]/20'
                      }`}
                    >
                      Mövcud kod / status yoxla
                    </button>
                  </div>

                  {subMode === 'request' ? (
                    <form
                      onSubmit={handleReferrerRequest}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Ad və Soyadınız
                        </label>
                        <input
                          type="text"
                          value={reqName}
                          onChange={(e) => setReqName(e.target.value)}
                          placeholder="Məs: Orxan Əliyev"
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-3.5 py-2.5 text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Telefon nömrəniz
                        </label>
                        <input
                          type="tel"
                          value={reqPhone}
                          onChange={(e) => setReqPhone(e.target.value)}
                          placeholder="+994 50 123 45 67"
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-3.5 py-2.5 text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <button
                          type="submit"
                          disabled={referrerLoading}
                          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-4 py-2.5 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                        >
                          {referrerLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                          )}
                          <span>Dəvət Linkimi Al / Yoxla</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleReferrerLookup}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end"
                    >
                      <div className="sm:col-span-8">
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Telefon nömrəsi və ya Kuryer Kodu (məs: FF-XXXXXX)
                        </label>
                        <input
                          type="text"
                          value={lookupQuery}
                          onChange={(e) => setLookupQuery(e.target.value)}
                          placeholder="+994 50 ... və ya FF-XXXXXX"
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-3.5 py-2.5 text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <button
                          type="submit"
                          disabled={referrerLoading}
                          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-4 py-2.5 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                        >
                          {referrerLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                          )}
                          <span>Statusu Göstər</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {referrerError && (
                    <div className="rounded-xl border border-[#DC2626]/35 bg-[#FEE2E2] dark:bg-[#450A0A] px-4 py-2.5 text-xs font-bold text-[#991B1B] dark:text-[#FECACA]">
                      {referrerError}
                    </div>
                  )}

                  {/* Result Panel */}
                  {referrerResult && (
                    <div className="rounded-2xl border border-[#0099C6]/35 bg-[#F8FAFC] dark:bg-[#1E293B] p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#0099C6]">
                            Kuryer Profili
                          </p>
                          <h3 className="font-[var(--font-display)] text-base sm:text-lg font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0]">
                            {referrerResult.name}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                            referrerResult.approved
                              ? 'bg-[#DCFCE7] text-[#166534] dark:bg-[#052E16] dark:text-[#86EFAC]'
                              : 'bg-[#FEF3C7] text-[#92400E] dark:bg-[#451A03] dark:text-[#FDE68A]'
                          }`}
                        >
                          {referrerResult.approved ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Təsdiqlənmiş Kuryer</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Admin Təsdiqi Gözlənilir</span>
                            </>
                          )}
                        </span>
                      </div>

                      {!referrerResult.approved ? (
                        <div className="rounded-xl border border-[#0099C6]/25 bg-[#E4F4FA] dark:bg-[#0F172A] p-4 text-xs sm:text-sm text-[#0B1B2B] dark:text-[#E2E8F0] leading-relaxed">
                          Müraciətiniz qeydə alınıb. Təhlükəsizlik məqsədilə unikal dəvət linki və kodu yalnız admin tərəfindən təsdiqlənmiş kuryerlərə verilir. Təsdiq olunduqdan sonra buradan nömrənizi yoxlayaraq linkinizi əldə edə bilərsiniz.
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                            <div className="sm:col-span-4 rounded-xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-3.5 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#64748B]">
                                  Unikal Dəvət Kodunuz
                                </p>
                                <p className="font-[var(--font-display)] text-base font-extrabold text-[#0099C6] tracking-wider">
                                  {referrerResult.code}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  void copyText(referrerResult.code || '', 'code')
                                }
                                aria-label="Kodu kopyala"
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#0099C6]/30 text-[#0099C6] hover:bg-[#0099C6] hover:text-[#F8FAFC] transition-colors"
                              >
                                {copiedType === 'code' ? (
                                  <Check className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <Copy className="h-4 w-4" aria-hidden="true" />
                                )}
                              </button>
                            </div>

                            <div className="sm:col-span-8 rounded-xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-3.5 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#64748B]">
                                  Şəxsi Dəvət Linkiniz
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-[#0B1B2B] dark:text-[#E2E8F0] truncate">
                                  {personalReferralLink}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => void copyText(personalReferralLink, 'link')}
                              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-5 py-3 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] transition-all"
                            >
                              {copiedType === 'link' ? (
                                <>
                                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                                  <span>Dəvət Linki Kopyalandı!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                                  <span>Unikal Linki Kopyala</span>
                                </>
                              )}
                            </button>

                            <a
                              href={whatsappShareUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-[#0B1B2B] shadow-sm hover:bg-[#20bd5a] transition-all"
                            >
                              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                              <span>WhatsApp-da Dostuna Göndər</span>
                            </a>
                          </div>

                          {/* Invited Couriers Status Table */}
                          <div className="border-t border-[#0099C6]/20 pt-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <h4 className="font-[var(--font-display)] text-sm font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0]">
                                Dəvət Etdiyiniz Kuryerlər ({invitedList.length})
                              </h4>
                              <span className="text-xs font-semibold text-[#0099C6]">
                                Cari bonus şərti: {bonusLabel}
                              </span>
                            </div>

                            {invitedList.length === 0 ? (
                              <p className="rounded-xl bg-[#EEF2F6] dark:bg-[#0F172A] p-4 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] text-center">
                                Hələ bu dəvət linki ilə qeydiyyatdan keçən dostunuz yoxdur. Linkinizi paylaşın!
                              </p>
                            ) : (
                              <div className="space-y-2.5">
                                {invitedList.map((item) => {
                                  const regBadge =
                                    REG_STATUS_LABELS[item.registrationStatus];
                                  const bonusBadge =
                                    BONUS_STATUS_LABELS[item.bonusStatus];
                                  const displayBonus =
                                    item.bonusAmountSnapshot ||
                                    referralSettings.bonusAmount ||
                                    'Admin təyin edəcək';
                                  return (
                                    <div
                                      key={item.id}
                                      className="rounded-xl border border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                      <div>
                                        <p className="font-[var(--font-display)] text-sm font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                                          {item.referredName}{' '}
                                          <span className="text-xs font-medium text-[#64748B]">
                                            ({item.referredPhoneMasked} · {item.vehicleType})
                                          </span>
                                        </p>
                                        <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1]">
                                          Bonus məbləği:{' '}
                                          <span className="font-bold text-[#0099C6]">
                                            {displayBonus}
                                          </span>
                                        </p>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2">
                                        <span
                                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${regBadge.badgeClass}`}
                                        >
                                          {regBadge.label}
                                        </span>
                                        <span
                                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${bonusBadge.badgeClass}`}
                                        >
                                          {bonusBadge.label}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REGISTER AS INVITED COURIER */}
              {activeTab === 'register-invited' && (
                <div className="mt-5">
                  {invSuccess ? (
                    <div className="rounded-2xl border border-[#0099C6]/35 bg-[#F8FAFC] dark:bg-[#1E293B] p-6 text-center space-y-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#DCFCE7] text-[#166534] mx-auto">
                        <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-[var(--font-display)] text-lg font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0]">
                          Dəvət Qeydiyyatınız Qeydə Alındı!
                        </h3>
                        <p className="mt-1.5 text-sm text-[#334155] dark:text-[#CBD5E1]">
                          Dəvət edən kuryer:{' '}
                          <span className="font-bold text-[#0099C6]">
                            {invSuccess.referrerName} ({invSuccess.referrerCode})
                          </span>
                          . İndi rəsmi Wolt kuryer qeydiyyat formasını tamamlayın. Sənədləriniz və qeydiyyatınız təsdiqləndikdə bonus aktivləşəcək.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openRegistrationModal}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-6 py-3 text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors"
                      >
                        <span>Wolt Qeydiyyat Formasına Keç</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleInvitedRegister}
                      className="rounded-2xl border border-[#0099C6]/25 bg-[#F8FAFC] dark:bg-[#1E293B] p-5 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-[var(--font-display)] text-base font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0]">
                            Dostunun Dəvəti İlə Qeydiyyatdan Keç
                          </h3>
                          <p className="text-xs text-[#334155] dark:text-[#CBD5E1]">
                            Təkrar nömrələrə və saxta müraciətlərə sistem tərəfindən icazə verilmir.
                          </p>
                        </div>
                        {validatedReferrerName && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] dark:bg-[#052E16] px-3 py-1 text-xs font-bold text-[#166534] dark:text-[#86EFAC]">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Dəvətçi: {validatedReferrerName}</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                            Dəvət Kodu
                          </label>
                          <input
                            type="text"
                            value={invCode}
                            onChange={(e) => setInvCode(e.target.value.toUpperCase())}
                            placeholder="FF-XXXXXX"
                            className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm font-bold tracking-wider text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                            Nəqliyyat Növü
                          </label>
                          <select
                            value={invVehicle}
                            onChange={(e) => setInvVehicle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                          >
                            {VEHICLE_OPTIONS.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                            Ad və Soyadınız
                          </label>
                          <input
                            type="text"
                            value={invName}
                            onChange={(e) => setInvName(e.target.value)}
                            placeholder="Adınız və soyadınız"
                            className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                            Telefon Nömrəniz
                          </label>
                          <input
                            type="tel"
                            value={invPhone}
                            onChange={(e) => setInvPhone(e.target.value)}
                            placeholder="+994 50 123 45 67"
                            className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                          />
                        </div>
                      </div>

                      {invError && (
                        <div className="flex items-start gap-2 rounded-xl border border-[#DC2626]/35 bg-[#FEE2E2] dark:bg-[#450A0A] px-4 py-2.5 text-xs font-bold text-[#991B1B] dark:text-[#FECACA]">
                          <XCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{invError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={invSubmitting}
                        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-5 py-3 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                      >
                        {invSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                        )}
                        <span>Dəvət Qeydiyyatını Təsdiqlə</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bottom Soft Light-Blue Bonus Box */}
          <div className="mt-6 rounded-2xl border-2 border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A] px-4 py-4 sm:px-6 sm:py-5 text-center">
            <p className="inline-flex items-center justify-center gap-2 font-[var(--font-display)] text-sm sm:text-base font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug">
              <Gift className="h-5 w-5 shrink-0 text-[#0099C6]" aria-hidden="true" />
              <span>
                {referralSettings.bonusAmount
                  ? `Hər təsdiqlənən dost üçün ${referralSettings.bonusAmount} BONUS! Şərtlər tamamlandıqda və admin təsdiqlədikdə bonus aktivləşir.`
                  : 'Hər təsdiqlənən dost üçün sənə BONUS düşür! Bonus məbləği admin tərəfindən təyin edilir və şərtlər tamamlandıqda aktivləşir.'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
