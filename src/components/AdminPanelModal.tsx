import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Gift,
  Inbox,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import {
  PublicSiteConfig,
  useSiteConfig,
} from '../context/SiteConfigContext';

interface KnowledgeEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  updatedAt: string;
}

interface ChatLogEntry {
  id: string;
  sessionId: string;
  userQuestion: string;
  botReply: string;
  status: 'ANSWERED' | 'UNKNOWN';
  matchedCategories: string[];
  createdAt: string;
}

interface UserInquiryEntry {
  id: string;
  name: string;
  phone: string;
  message: string;
  sourceQuestion?: string;
  status: 'new' | 'reviewed';
  createdAt: string;
}

interface CourierReferrer {
  id: string;
  name: string;
  phone: string;
  normalizedPhone: string;
  code: string;
  approved: boolean;
  createdAt: string;
}

type ReferralRegistrationStatus =
  | 'pending_docs'
  | 'under_review'
  | 'approved'
  | 'rejected';

type ReferralBonusStatus = 'pending' | 'approved' | 'rejected';

interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerCode: string;
  referrerName: string;
  referredName: string;
  referredPhone: string;
  normalizedReferredPhone: string;
  vehicleType: string;
  registrationStatus: ReferralRegistrationStatus;
  bonusStatus: ReferralBonusStatus;
  bonusAmountSnapshot: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  kbCount: number;
  answeredCount: number;
  unansweredCount: number;
  inquiriesCount: number;
  newInquiriesCount: number;
  referrersCount: number;
  referralsCount: number;
  pendingBonusesCount: number;
  approvedBonusesCount: number;
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab =
  | 'kb'
  | 'answered'
  | 'unanswered'
  | 'inquiries'
  | 'referrals'
  | 'settings';

const TOKEN_STORAGE_KEY = 'flashly_admin_token';

function formatAzDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('az-AZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { config, refreshConfig } = useSiteConfig();

  const [token, setToken] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('kb');
  const [loadingData, setLoadingData] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLogEntry[]>([]);
  const [inquiries, setInquiries] = useState<UserInquiryEntry[]>([]);
  const [referrers, setReferrers] = useState<CourierReferrer[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    kbCount: 0,
    answeredCount: 0,
    unansweredCount: 0,
    inquiriesCount: 0,
    newInquiriesCount: 0,
    referrersCount: 0,
    referralsCount: 0,
    pendingBonusesCount: 0,
    approvedBonusesCount: 0,
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<PublicSiteConfig>(config);
  const [savingSettings, setSavingSettings] = useState(false);

  // Referrer Add Form State
  const [newRefName, setNewRefName] = useState('');
  const [newRefPhone, setNewRefPhone] = useState('');
  const [addingReferrer, setAddingReferrer] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [referralFilter, setReferralFilter] = useState<'all' | 'pending' | 'approved'>(
    'all'
  );

  // KB Form & Filter State
  const [kbSearch, setKbSearch] = useState('');
  const [editingKbId, setEditingKbId] = useState<string | null>(null);
  const [showKbForm, setShowKbForm] = useState(false);
  const [kbCategory, setKbCategory] = useState('Qeydiyyat');
  const [kbQuestion, setKbQuestion] = useState('');
  const [kbAnswer, setKbAnswer] = useState('');
  const [savingKb, setSavingKb] = useState(false);

  const handleLogout = useCallback(() => {
    setToken('');
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const fetchDashboard = useCallback(
    async (activeToken: string) => {
      if (!activeToken) return;
      setLoadingData(true);
      setActionError('');
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.status === 401) {
          handleLogout();
          return;
        }
        const data = (await res.json()) as {
          knowledgeBase?: KnowledgeEntry[];
          chatLogs?: ChatLogEntry[];
          inquiries?: UserInquiryEntry[];
          settings?: PublicSiteConfig;
          referrers?: CourierReferrer[];
          referrals?: ReferralRecord[];
          stats?: DashboardStats;
          error?: string;
        };
        if (!res.ok) {
          setActionError(data.error || 'Məlumatlar yüklənmədi.');
          return;
        }
        setKnowledgeBase(data.knowledgeBase || []);
        setChatLogs(data.chatLogs || []);
        setInquiries(data.inquiries || []);
        setReferrers(data.referrers || []);
        setReferrals(data.referrals || []);
        if (data.settings) setSettingsForm(data.settings);
        if (data.stats) setStats(data.stats);
      } catch {
        setActionError('Serverlə əlaqə xətası baş verdi.');
      } finally {
        setLoadingData(false);
      }
    },
    [handleLogout]
  );

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    if (token) {
      void fetchDashboard(token);
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, token, fetchDashboard, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoggingIn(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Giriş uğursuz oldu.');
        return;
      }
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setPassword('');
    } catch {
      setAuthError('Serverlə əlaqə qurula bilmədi.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });
      const data = (await res.json()) as {
        settings?: PublicSiteConfig;
        error?: string;
      };
      if (!res.ok) {
        setActionError(data.error || 'Ayarlar yadda saxlanılmadı.');
        return;
      }
      if (data.settings) setSettingsForm(data.settings);
      await refreshConfig();
      setActionSuccess('Sayt və reklam ayarları uğurla yadda saxlanıldı!');
    } catch {
      setActionError('Server xətası baş verdi.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddReferrer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefName.trim() || !newRefPhone.trim()) {
      setActionError('Kuryer adı və telefon nömrəsi daxil edilməlidir.');
      return;
    }
    setAddingReferrer(true);
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch('/api/admin/referrers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRefName.trim(),
          phone: newRefPhone.trim(),
          approved: true,
        }),
      });
      const data = (await res.json()) as {
        referrer?: CourierReferrer;
        error?: string;
      };
      if (!res.ok || !data.referrer) {
        setActionError(data.error || 'Kuryer əlavə edilmədi.');
        return;
      }
      setNewRefName('');
      setNewRefPhone('');
      setActionSuccess(
        `Təsdiqlənmiş kuryer əlavə olundu! Unikal kod: ${data.referrer.code}`
      );
      await fetchDashboard(token);
    } catch {
      setActionError('Server xətası baş verdi.');
    } finally {
      setAddingReferrer(false);
    }
  };

  const handleToggleReferrerApproval = async (item: CourierReferrer) => {
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch(`/api/admin/referrers/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved: !item.approved }),
      });
      if (!res.ok) {
        setActionError('Kuryer statusu yenilənmədi.');
        return;
      }
      setActionSuccess(
        !item.approved
          ? `${item.name} təsdiqləndi — kodu (${item.code}) aktivdir.`
          : `${item.name} üçün dəvət kodu deaktiv edildi.`
      );
      await fetchDashboard(token);
    } catch {
      setActionError('Server xətası baş verdi.');
    }
  };

  const handleDeleteReferrer = async (id: string) => {
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch(`/api/admin/referrers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchDashboard(token);
      }
    } catch {
      setActionError('Kuryer silinmədi.');
    }
  };

  const handleUpdateReferral = async (
    id: string,
    payload: {
      registrationStatus?: ReferralRegistrationStatus;
      bonusStatus?: ReferralBonusStatus;
    }
  ) => {
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch(`/api/admin/referrals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setActionError(data.error || 'Dəvət qeydi yenilənmədi.');
        return;
      }
      setActionSuccess('Dəvət qeydi və bonus statusu yeniləndi.');
      await fetchDashboard(token);
    } catch {
      setActionError('Server xətası baş verdi.');
    }
  };

  const handleDeleteReferral = async (id: string) => {
    setActionError('');
    try {
      const res = await fetch(`/api/admin/referrals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchDashboard(token);
      }
    } catch {
      setActionError('Qeyd silinmədi.');
    }
  };

  const copyReferrerLink = async (code: string) => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/?ref=${encodeURIComponent(code)}`
        : code;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      setCopiedCode(null);
    }
  };

  const openAddKb = (prefillQuestion = '') => {
    setEditingKbId(null);
    setKbCategory('Ümumi');
    setKbQuestion(prefillQuestion);
    setKbAnswer('');
    setShowKbForm(true);
    setActiveTab('kb');
    setActionError('');
    setActionSuccess('');
  };

  const openEditKb = (item: KnowledgeEntry) => {
    setEditingKbId(item.id);
    setKbCategory(item.category);
    setKbQuestion(item.question);
    setKbAnswer(item.answer);
    setShowKbForm(true);
    setActionError('');
    setActionSuccess('');
  };

  const handleSaveKb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbQuestion.trim() || !kbAnswer.trim()) {
      setActionError('Sual və təsdiqlənmiş cavab daxil edilməlidir.');
      return;
    }

    setSavingKb(true);
    setActionError('');
    setActionSuccess('');

    try {
      const isEditing = Boolean(editingKbId);
      const url = isEditing ? `/api/admin/kb/${editingKbId}` : '/api/admin/kb';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: kbCategory.trim() || 'Ümumi',
          question: kbQuestion.trim(),
          answer: kbAnswer.trim(),
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setActionError(data.error || 'Yadda saxlanarkən xəta baş verdi.');
        return;
      }

      setShowKbForm(false);
      setEditingKbId(null);
      setKbQuestion('');
      setKbAnswer('');
      setActionSuccess(
        isEditing
          ? 'Məlumat yeniləndi — chatbot dərhal yeni cavabdan istifadə edəcək.'
          : 'Yeni təsdiqlənmiş məlumat bazaya əlavə olundu.'
      );
      await fetchDashboard(token);
    } catch {
      setActionError('Server xətası baş verdi.');
    } finally {
      setSavingKb(false);
    }
  };

  const handleDeleteKb = async (id: string) => {
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch(`/api/admin/kb/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setActionError('Silinmə zamanı xəta baş verdi.');
        return;
      }
      setActionSuccess('Qeyd bazadan silindi.');
      await fetchDashboard(token);
    } catch {
      setActionError('Server xətası baş verdi.');
    }
  };

  const handleToggleInquiryStatus = async (item: UserInquiryEntry) => {
    const nextStatus = item.status === 'new' ? 'reviewed' : 'new';
    try {
      const res = await fetch(`/api/admin/inquiries/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await fetchDashboard(token);
      }
    } catch {
      setActionError('Müraciət statusu yenilənmədi.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchDashboard(token);
      }
    } catch {
      setActionError('Müraciət silinmədi.');
    }
  };

  const answeredLogs = chatLogs.filter((l) => l.status === 'ANSWERED');
  const unansweredLogs = chatLogs.filter((l) => l.status === 'UNKNOWN');
  const filteredKb = knowledgeBase.filter((item) => {
    const q = kbSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      item.category.toLowerCase().includes(q) ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
    );
  });

  const filteredReferrals = referrals.filter((r) => {
    if (referralFilter === 'pending') return r.bonusStatus === 'pending';
    if (referralFilter === 'approved') return r.bonusStatus === 'approved';
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1B2B]/75 p-3 sm:p-6 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="FLASHLY FLEET Admin Paneli"
      onClick={onClose}
    >
      <div
        className="flex h-[min(92vh,840px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#0099C6]/35 bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0B1B2B] dark:text-[#E2E8F0] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#0B1B2B] to-[#0E2A44] px-5 py-4 text-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0099C6] text-[#F8FAFC]">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7DD3FC]">
                FLASHLY FLEET İdarəetmə
              </p>
              <h2 className="font-[var(--font-display)] text-base sm:text-lg font-extrabold text-[#F8FAFC]">
                Admin Paneli · Chatbot, Referral və Instagram
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <>
                <button
                  type="button"
                  onClick={() => void fetchDashboard(token)}
                  disabled={loadingData}
                  title="Məlumatları yenilə"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#F8FAFC]/10 px-3 text-xs font-bold text-[#F8FAFC] hover:bg-[#0099C6] transition-colors"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loadingData ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Yenilə</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Çıxış"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#F8FAFC]/10 px-3 text-xs font-bold text-[#F8FAFC] hover:bg-[#0099C6] transition-colors"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Çıxış</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Admin paneli bağla"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FAFC]/10 text-[#F8FAFC] hover:bg-[#0099C6] transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Auth Gate vs Dashboard Body */}
        {!token ? (
          <div className="flex flex-1 items-center justify-center bg-[#EEF2F6] dark:bg-[#0F172A] p-5">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md rounded-2xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] p-6 sm:p-8 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0099C6]">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-[var(--font-display)] text-lg font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0]">
                    Admin Girişi
                  </h3>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1]">
                    Sistem ayarlarını, referral bonuslarını və chatbot bazasını idarə etmək üçün şifrəni daxil edin.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="admin-passcode-input"
                  className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]"
                >
                  Admin Şifrəsi
                </label>
                <input
                  id="admin-passcode-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrəni daxil edin"
                  className="mt-1.5 w-full rounded-xl border border-[#0099C6]/35 bg-[#EEF2F6] dark:bg-[#0F172A] px-4 py-3 text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                />
              </div>

              {authError && (
                <p className="mt-3 text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5]">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={loggingIn || !password.trim()}
                className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-[#0099C6] px-5 py-3 text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
              >
                {loggingIn ? 'Yoxlanılır...' : 'Daxil Ol'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden bg-[#EEF2F6] dark:bg-[#0F172A]">
            {/* Summary Metrics + Tabs */}
            <div className="border-b border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] px-4 py-3 sm:px-6">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('kb')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                    activeTab === 'kb'
                      ? 'border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A]'
                      : 'border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A]/60 hover:border-[#0099C6]/60'
                  }`}
                >
                  <BookOpen className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold tabular-nums">{stats.kbCount}</div>
                    <div className="text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1] truncate">
                      Məlumat Bazası
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('referrals')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                    activeTab === 'referrals'
                      ? 'border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A]'
                      : 'border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A]/60 hover:border-[#0099C6]/60'
                  }`}
                >
                  <Gift className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-extrabold tabular-nums">
                        {stats.referralsCount}
                      </span>
                      {stats.pendingBonusesCount > 0 && (
                        <span className="rounded-full bg-[#D97706] px-1.5 py-0.5 text-[9px] font-bold text-[#F8FAFC]">
                          {stats.pendingBonusesCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1] truncate">
                      Referral & Bonus
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A]'
                      : 'border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A]/60 hover:border-[#0099C6]/60'
                  }`}
                >
                  <Settings className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-[#0099C6] truncate">
                      {settingsForm.instagramPromo.enabled ? 'IG Aktiv' : 'IG Bağlı'} ·{' '}
                      {settingsForm.chatbotSettings.enabled ? 'Bot Aktiv' : 'Bot Bağlı'}
                    </div>
                    <div className="text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1] truncate">
                      IG & Chatbot
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('answered')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                    activeTab === 'answered'
                      ? 'border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A]'
                      : 'border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A]/60 hover:border-[#0099C6]/60'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold tabular-nums">
                      {stats.answeredCount}
                    </div>
                    <div className="text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1] truncate">
                      Cavablandırılan
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('unanswered')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                    activeTab === 'unanswered'
                      ? 'border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A]'
                      : 'border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A]/60 hover:border-[#0099C6]/60'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[#D97706]" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold tabular-nums">
                      {stats.unansweredCount}
                    </div>
                    <div className="text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1] truncate">
                      Cavabsız
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                    activeTab === 'inquiries'
                      ? 'border-[#0099C6] bg-[#E4F4FA] dark:bg-[#0F172A]'
                      : 'border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A]/60 hover:border-[#0099C6]/60'
                  }`}
                >
                  <Inbox className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-extrabold tabular-nums">
                        {stats.inquiriesCount}
                      </span>
                      {stats.newInquiriesCount > 0 && (
                        <span className="rounded-full bg-[#0099C6] px-1.5 py-0.5 text-[9px] font-bold text-[#F8FAFC]">
                          {stats.newInquiriesCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1] truncate">
                      Müraciətlər
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Alerts */}
            {(actionError || actionSuccess) && (
              <div className="px-4 pt-3 sm:px-6">
                {actionError && (
                  <div className="rounded-xl border border-[#DC2626]/35 bg-[#FEE2E2] dark:bg-[#450A0A] px-4 py-2.5 text-xs font-bold text-[#991B1B] dark:text-[#FECACA]">
                    {actionError}
                  </div>
                )}
                {actionSuccess && (
                  <div className="rounded-xl border border-[#0099C6]/35 bg-[#E4F4FA] dark:bg-[#1E293B] px-4 py-2.5 text-xs font-bold text-[#0B1B2B] dark:text-[#E2E8F0]">
                    {actionSuccess}
                  </div>
                )}
              </div>
            )}

            {/* Main Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* TAB 1: KNOWLEDGE BASE */}
              {activeTab === 'kb' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
                        aria-hidden="true"
                      />
                      <input
                        type="text"
                        value={kbSearch}
                        onChange={(e) => setKbSearch(e.target.value)}
                        placeholder="Bazadan axtar (sual, cavab, kateqoriya)..."
                        className="w-full rounded-xl border border-[#0099C6]/25 bg-[#F8FAFC] dark:bg-[#1E293B] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#0B1B2B] dark:text-[#E2E8F0] focus:border-[#0099C6] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openAddKb()}
                      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors shrink-0"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      <span>Yeni Sual-Cavab Əlavə Et</span>
                    </button>
                  </div>

                  {showKbForm && (
                    <form
                      onSubmit={handleSaveKb}
                      className="rounded-2xl border-2 border-[#0099C6] bg-[#F8FAFC] dark:bg-[#1E293B] p-4 sm:p-5 space-y-3.5 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-[var(--font-display)] text-sm sm:text-base font-extrabold">
                          {editingKbId
                            ? 'Təsdiqlənmiş Məlumatı Redaktə Et'
                            : 'Yeni Təsdiqlənmiş Sual-Cavab'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowKbForm(false)}
                          className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1] hover:text-[#0099C6]"
                        >
                          Ləğv et
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                            Kateqoriya
                          </label>
                          <input
                            type="text"
                            value={kbCategory}
                            onChange={(e) => setKbCategory(e.target.value)}
                            placeholder="Məs: Qeydiyyat, Sənədlər"
                            className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3 py-2 text-xs sm:text-sm focus:border-[#0099C6] focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                            Sual
                          </label>
                          <input
                            type="text"
                            value={kbQuestion}
                            onChange={(e) => setKbQuestion(e.target.value)}
                            placeholder="İstifadəçinin verə biləcəyi sual"
                            className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3 py-2 text-xs sm:text-sm focus:border-[#0099C6] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Təsdiqlənmiş Rəsmi Cavab
                        </label>
                        <textarea
                          rows={3}
                          value={kbAnswer}
                          onChange={(e) => setKbAnswer(e.target.value)}
                          placeholder="Chatbotun yalnız əsaslanacağı dəqiq məlumat..."
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3 py-2 text-xs sm:text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={savingKb}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#0099C6] px-5 py-2 text-xs sm:text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                          <span>{savingKb ? 'Saxlanır...' : 'Yadda Saxla'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {filteredKb.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#0099C6]/25 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 sm:p-5 shadow-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <span className="inline-block rounded-lg bg-[#E4F4FA] dark:bg-[#0F172A] px-2.5 py-1 text-[11px] font-bold text-[#0099C6]">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditKb(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#0099C6]/30 px-2.5 py-1 text-xs font-bold text-[#0B1B2B] dark:text-[#E2E8F0] hover:border-[#0099C6]"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-[#0099C6]" aria-hidden="true" />
                              <span>Redaktə et</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteKb(item.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#DC2626]/30 px-2.5 py-1 text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5] hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A]"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Sil</span>
                            </button>
                          </div>
                        </div>

                        <h4 className="mt-2.5 font-[var(--font-display)] text-sm sm:text-base font-bold">
                          {item.question}
                        </h4>
                        <p className="mt-1.5 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* TAB 2: REFERRAL & BONUS MANAGEMENT */}
              {activeTab === 'referrals' && (
                <div className="space-y-6">
                  {/* Referral Program Settings */}
                  <form
                    onSubmit={handleSaveSettings}
                    className="rounded-2xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Gift className="h-5 w-5 text-[#0099C6]" aria-hidden="true" />
                        <div>
                          <h3 className="font-[var(--font-display)] text-sm sm:text-base font-extrabold">
                            Referral Proqramı və Bonus Məbləği
                          </h3>
                          <p className="text-xs text-[#334155] dark:text-[#CBD5E1]">
                            Bonus məbləğini buradan təyin edib dəyişə bilərsiniz (boş qalarsa &quot;Admin tərəfindən təyin ediləcək&quot; göstərilir).
                          </p>
                        </div>
                      </div>
                      <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsForm.referralSettings.enabled}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              referralSettings: {
                                ...prev.referralSettings,
                                enabled: e.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 accent-[#0099C6]"
                        />
                        <span>Referral Aktivdir</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-8">
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Bonus Məbləği (məs: 25 AZN — sonra da təyin edilə bilər)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.referralSettings.bonusAmount}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              referralSettings: {
                                ...prev.referralSettings,
                                bonusAmount: e.target.value,
                              },
                            }))
                          }
                          placeholder="Hələ təyin edilməyib (məs: 20 AZN)"
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <button
                          type="submit"
                          disabled={savingSettings}
                          className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#F8FAFC] hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                        >
                          <Save className="h-4 w-4" aria-hidden="true" />
                          <span>{savingSettings ? 'Saxlanır...' : 'Bonus Ayarını Saxla'}</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Courier Referrers Section */}
                  <div className="rounded-2xl border border-[#0099C6]/25 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 sm:p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-[#0099C6]" aria-hidden="true" />
                      <h3 className="font-[var(--font-display)] text-sm sm:text-base font-extrabold">
                        Təsdiqlənmiş Kuryerlər və Dəvət Kodları ({referrers.length})
                      </h3>
                    </div>

                    <form
                      onSubmit={handleAddReferrer}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end rounded-xl border border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A] p-3.5"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Kuryer Adı və Soyadı
                        </label>
                        <input
                          type="text"
                          value={newRefName}
                          onChange={(e) => setNewRefName(e.target.value)}
                          placeholder="Məs: Murad Həsənov"
                          className="mt-1 w-full rounded-lg border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-3 py-2 text-xs sm:text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Telefon Nömrəsi
                        </label>
                        <input
                          type="tel"
                          value={newRefPhone}
                          onChange={(e) => setNewRefPhone(e.target.value)}
                          placeholder="+994 50 123 45 67"
                          className="mt-1 w-full rounded-lg border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-3 py-2 text-xs sm:text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <button
                          type="submit"
                          disabled={addingReferrer}
                          className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-lg bg-[#0099C6] px-3.5 py-2 text-xs font-bold text-[#F8FAFC] hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                        >
                          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {addingReferrer
                              ? 'Yaradılır...'
                              : 'Təsdiqlənmiş Kuryer Əlavə Et'}
                          </span>
                        </button>
                      </div>
                    </form>

                    {referrers.length === 0 ? (
                      <p className="text-xs sm:text-sm text-[#64748B] text-center py-4">
                        Hələ kuryer dəvət kodu yaradılmayıb.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {referrers.map((refp) => {
                          const count = referrals.filter(
                            (r) => r.referrerId === refp.id
                          ).length;
                          return (
                            <div
                              key={refp.id}
                              className="rounded-xl border border-[#0099C6]/20 bg-[#EEF2F6] dark:bg-[#0F172A] p-3.5 flex flex-wrap items-center justify-between gap-3"
                            >
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-[var(--font-display)] text-sm font-extrabold">
                                    {refp.name}
                                  </span>
                                  <span className="rounded-md bg-[#E4F4FA] dark:bg-[#1E293B] px-2 py-0.5 text-xs font-extrabold text-[#0099C6]">
                                    {refp.code}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                      refp.approved
                                        ? 'bg-[#DCFCE7] text-[#166534]'
                                        : 'bg-[#FEF3C7] text-[#92400E]'
                                    }`}
                                  >
                                    {refp.approved ? 'Təsdiqlənib' : 'Gözləmədə'}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1] tabular-nums">
                                  {refp.phone} · Dəvət sayı: {count}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => void copyReferrerLink(refp.code)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] px-2.5 py-1.5 text-xs font-bold text-[#0099C6] hover:border-[#0099C6]"
                                >
                                  {copiedCode === refp.code ? (
                                    <>
                                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                      <span>Kopyalandı</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                      <span>Linki Kopyala</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => void handleToggleReferrerApproval(refp)}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                    refp.approved
                                      ? 'border border-[#D97706]/40 text-[#B45309] dark:text-[#FCD34D] hover:bg-[#FEF3C7]'
                                      : 'bg-[#16A34A] text-[#F8FAFC] hover:bg-[#15803D]'
                                  }`}
                                >
                                  {refp.approved ? 'Deaktiv Et' : 'Təsdiqlə'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => void handleDeleteReferrer(refp.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#DC2626]/30 px-2.5 py-1.5 text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5] hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Invited Couriers & Bonus Approvals */}
                  <div className="rounded-2xl border border-[#0099C6]/25 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 sm:p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-[var(--font-display)] text-sm sm:text-base font-extrabold">
                        Dəvət Edilən Qeydiyyatlar və Bonus Təsdiqi ({referrals.length})
                      </h3>

                      <div className="flex items-center gap-1.5">
                        {(
                          [
                            ['all', 'Hamısı'],
                            ['pending', 'Bonus Gözləyənlər'],
                            ['approved', 'Təsdiqlənənlər'],
                          ] as const
                        ).map(([key, label]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setReferralFilter(key)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                              referralFilter === key
                                ? 'bg-[#0099C6] text-[#F8FAFC]'
                                : 'bg-[#EEF2F6] dark:bg-[#0F172A] text-[#334155] dark:text-[#CBD5E1]'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredReferrals.length === 0 ? (
                      <p className="text-xs sm:text-sm text-[#64748B] text-center py-6">
                        Bu filtr üzrə dəvət qeydiyyatı yoxdur.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredReferrals.map((rec) => (
                          <div
                            key={rec.id}
                            className="rounded-xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] p-4 space-y-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-[var(--font-display)] text-sm sm:text-base font-extrabold">
                                    {rec.referredName}
                                  </span>
                                  <span className="text-xs font-bold text-[#0099C6] tabular-nums">
                                    {rec.referredPhone}
                                  </span>
                                  <span className="rounded-md bg-[#F8FAFC] dark:bg-[#1E293B] px-2 py-0.5 text-[11px] font-bold">
                                    {rec.vehicleType}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1]">
                                  Dəvət edən:{' '}
                                  <span className="font-bold">
                                    {rec.referrerName} ({rec.referrerCode})
                                  </span>{' '}
                                  · Tarix: {formatAzDate(rec.createdAt)}
                                </p>
                              </div>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                                  rec.bonusStatus === 'approved'
                                    ? 'bg-[#DCFCE7] text-[#166534]'
                                    : rec.bonusStatus === 'rejected'
                                    ? 'bg-[#FEE2E2] text-[#991B1B]'
                                    : 'bg-[#FEF3C7] text-[#92400E]'
                                }`}
                              >
                                {rec.bonusStatus === 'approved'
                                  ? 'Bonus Təsdiqləndi'
                                  : rec.bonusStatus === 'rejected'
                                  ? 'Bonus Rədd Edildi'
                                  : 'Bonus Gözləmədə'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#0099C6]/15 pt-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <label className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                                  Qeydiyyat & Sənəd Statusu:
                                </label>
                                <select
                                  value={rec.registrationStatus}
                                  onChange={(e) =>
                                    void handleUpdateReferral(rec.id, {
                                      registrationStatus: e.target
                                        .value as ReferralRegistrationStatus,
                                    })
                                  }
                                  className="rounded-lg border border-[#0099C6]/35 bg-[#F8FAFC] dark:bg-[#1E293B] px-2.5 py-1.5 text-xs font-bold focus:border-[#0099C6] focus:outline-none"
                                >
                                  <option value="pending_docs">Sənəd gözlənilir</option>
                                  <option value="under_review">Sənəd yoxlanılır</option>
                                  <option value="approved">Təsdiqlənib</option>
                                  <option value="rejected">Rədd edilib</option>
                                </select>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleUpdateReferral(rec.id, {
                                      bonusStatus: 'approved',
                                    })
                                  }
                                  disabled={rec.bonusStatus === 'approved'}
                                  className="inline-flex items-center gap-1 rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-bold text-[#F8FAFC] hover:bg-[#15803D] disabled:opacity-50 transition-colors"
                                >
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span>Bonusu Təsdiqlə</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleUpdateReferral(rec.id, {
                                      bonusStatus: 'rejected',
                                    })
                                  }
                                  disabled={rec.bonusStatus === 'rejected'}
                                  className="rounded-lg border border-[#DC2626]/35 px-2.5 py-1.5 text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5] hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A] disabled:opacity-50"
                                >
                                  Rədd Et
                                </button>

                                <button
                                  type="button"
                                  onClick={() => void handleDeleteReferral(rec.id)}
                                  aria-label="Qeydi sil"
                                  className="inline-flex items-center justify-center rounded-lg border border-[#DC2626]/30 p-1.5 text-[#B91C1C] dark:text-[#FCA5A5] hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: INSTAGRAM POPUP & CHATBOT SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  {/* Instagram Promo Controls */}
                  <div className="rounded-2xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-[var(--font-display)] text-base font-extrabold">
                          Instagram Reklam Popup-u İdarəetməsi
                        </h3>
                        <p className="text-xs text-[#334155] dark:text-[#CBD5E1]">
                          Sayta ilk dəfə daxil olan ziyarətçilərə göstərilən Instagram dəvət pəncərəsini buradan idarə edin.
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-[#0099C6]/30 bg-[#E4F4FA] dark:bg-[#0F172A] px-3.5 py-2 text-xs font-extrabold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsForm.instagramPromo.enabled}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              instagramPromo: {
                                ...prev.instagramPromo,
                                enabled: e.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 accent-[#0099C6]"
                        />
                        <span>Popup Aktivdir</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Instagram Səhifə Linki
                        </label>
                        <input
                          type="url"
                          value={settingsForm.instagramPromo.instagramUrl}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              instagramPromo: {
                                ...prev.instagramPromo,
                                instagramUrl: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Instagram İstifadəçi Adı
                        </label>
                        <input
                          type="text"
                          value={settingsForm.instagramPromo.instagramHandle}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              instagramPromo: {
                                ...prev.instagramPromo,
                                instagramHandle: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Popup Başlığı
                        </label>
                        <input
                          type="text"
                          value={settingsForm.instagramPromo.title}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              instagramPromo: {
                                ...prev.instagramPromo,
                                title: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                          Düymə Yazısı
                        </label>
                        <input
                          type="text"
                          value={settingsForm.instagramPromo.buttonText}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              instagramPromo: {
                                ...prev.instagramPromo,
                                buttonText: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm focus:border-[#0099C6] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                        Popup Açıqlama Mətni
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.instagramPromo.description}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({
                            ...prev,
                            instagramPromo: {
                              ...prev.instagramPromo,
                              description: e.target.value,
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm focus:border-[#0099C6] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Chatbot Status & Greeting Controls */}
                  <div className="rounded-2xl border border-[#0099C6]/30 bg-[#F8FAFC] dark:bg-[#1E293B] p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Bot className="h-5 w-5 text-[#0099C6]" aria-hidden="true" />
                        <div>
                          <h3 className="font-[var(--font-display)] text-base font-extrabold">
                            FLASHLY FLEET KÖMƏKÇİSİ (Chatbot)
                          </h3>
                          <p className="text-xs text-[#334155] dark:text-[#CBD5E1]">
                            Chatbot-u aktiv/deaktiv edin və ilk avtomatik salamlama mətnini redaktə edin.
                          </p>
                        </div>
                      </div>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-[#0099C6]/30 bg-[#E4F4FA] dark:bg-[#0F172A] px-3.5 py-2 text-xs font-extrabold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsForm.chatbotSettings.enabled}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              chatbotSettings: {
                                ...prev.chatbotSettings,
                                enabled: e.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 accent-[#0099C6]"
                        />
                        <span>Chatbot Aktivdir</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
                        Avtomatik İlk Salamlama Mesajı
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.chatbotSettings.greetingText}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({
                            ...prev,
                            chatbotSettings: {
                              ...prev.chatbotSettings,
                              greetingText: e.target.value,
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-[#0099C6]/30 bg-[#EEF2F6] dark:bg-[#0F172A] px-3.5 py-2.5 text-sm focus:border-[#0099C6] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0099C6] px-6 py-3 text-sm font-bold text-[#F8FAFC] shadow-sm hover:bg-[#007FA6] disabled:opacity-60 transition-colors"
                    >
                      <Save className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {savingSettings
                          ? 'Saxlanır...'
                          : 'Bütün Ayarları Yadda Saxla'}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: ANSWERED LOGS */}
              {activeTab === 'answered' && (
                <div className="space-y-3">
                  {answeredLogs.length === 0 ? (
                    <div className="rounded-2xl border border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] p-8 text-center text-sm text-[#334155] dark:text-[#CBD5E1]">
                      Hələ cavablandırılmış chatbot sualı yoxdur.
                    </div>
                  ) : (
                    answeredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                          <span className="font-bold text-[#16A34A]">Cavablandırıldı</span>
                          <span>{formatAzDate(log.createdAt)}</span>
                        </div>
                        <p className="text-sm font-bold">Sual: {log.userQuestion}</p>
                        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] rounded-xl bg-[#EEF2F6] dark:bg-[#0F172A] p-3">
                          {log.botReply}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: UNANSWERED LOGS */}
              {activeTab === 'unanswered' && (
                <div className="space-y-3">
                  {unansweredLogs.length === 0 ? (
                    <div className="rounded-2xl border border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] p-8 text-center text-sm text-[#334155] dark:text-[#CBD5E1]">
                      Cavablandırılmayan sual qeydə alınmayıb.
                    </div>
                  ) : (
                    unansweredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-[#D97706]/35 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span className="font-bold text-[#D97706]">
                            Bazadan kənar / Cavablandırılmadı
                          </span>
                          <span className="text-[#64748B]">{formatAzDate(log.createdAt)}</span>
                        </div>
                        <p className="text-sm font-bold">{log.userQuestion}</p>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => openAddKb(log.userQuestion)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0099C6] px-3.5 py-2 text-xs font-bold text-[#F8FAFC] hover:bg-[#007FA6] transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Bu Suala Bazada Cavab Əlavə Et</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 6: USER INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-3">
                  {inquiries.length === 0 ? (
                    <div className="rounded-2xl border border-[#0099C6]/20 bg-[#F8FAFC] dark:bg-[#1E293B] p-8 text-center text-sm text-[#334155] dark:text-[#CBD5E1]">
                      Hələ istifadəçi müraciəti daxil olmayıb.
                    </div>
                  ) : (
                    inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="rounded-2xl border border-[#0099C6]/25 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                                inq.status === 'new'
                                  ? 'bg-[#0099C6] text-[#F8FAFC]'
                                  : 'bg-[#E4F4FA] dark:bg-[#0F172A] text-[#0099C6]'
                              }`}
                            >
                              {inq.status === 'new' ? 'Yeni' : 'Baxılıb'}
                            </span>
                            <span className="font-[var(--font-display)] text-sm font-bold">
                              {inq.name}
                            </span>
                            <span className="text-xs font-semibold text-[#0099C6] tabular-nums">
                              {inq.phone}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#64748B]">
                            {formatAzDate(inq.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] rounded-xl bg-[#EEF2F6] dark:bg-[#0F172A] p-3">
                          {inq.message}
                        </p>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void handleToggleInquiryStatus(inq)}
                            className="rounded-lg border border-[#0099C6]/30 px-3 py-1 text-xs font-bold hover:border-[#0099C6]"
                          >
                            {inq.status === 'new' ? 'Baxıldı kimi işarələ' : 'Yeni kimi işarələ'}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteInquiry(inq.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#DC2626]/30 px-2.5 py-1 text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5] hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A]"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Sil</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
