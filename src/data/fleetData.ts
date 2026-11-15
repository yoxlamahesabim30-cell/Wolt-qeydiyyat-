export const LINKS = {
  registration: 'https://forms.gle/jmeGxgsDB4GYj4t48',
  video: 'https://youtu.be/Q3ZB9hiLd6g',
  whatsapp: 'https://wa.me/994998007565',
  phone2Whatsapp: 'https://wa.me/994604466404',
  phoneHref: 'tel:+994604466404',
  whatsappPhoneHref: 'tel:+994998007565',
  instagram: 'https://www.instagram.com/woltqeydiyyati',
  instagramHandle: '@woltqeydiyyati',
} as const;

export const CAMPAIGN_TEXT =
  '30 NOYABR 2026 TARİXİNƏDƏK QEYDİYYAT TAMAMİLƏ ÖDƏNİŞSİZDİR!';

export const NAV_ITEMS = [
  { label: 'İş Haqqında', href: '#is-haqqinda' },
  { label: 'Qazanc', href: '#qazanc' },
  { label: 'Tələblər', href: '#telebler' },
  { label: 'Suallar', href: '#suallar' },
  { label: 'Əlaqə', href: '#elaqe' },
] as const;

export const HERO_STATS = [
  {
    value: '80%',
    label: 'Kuryer Payı',
    detail: '40 AZN-dən yuxarı və 15 günlük sistemdə',
  },
  {
    value: '0 AZN',
    label: 'Qeydiyyat Ödənişi',
    detail: '30 Noyabr 2026 tarixinədək',
  },
  {
    value: 'Gündəlik / 15 Gün',
    label: 'Ödəniş Seçimi',
    detail: 'M10 nömrəsinə birbaşa köçürmə',
  },
  {
    value: '4 Nəqliyyat Növü',
    label: 'Velosiped · Skuter · Motosiklet · Avtomobil',
    detail: 'Özünüzə uyğun formanı seçin',
  },
] as const;

export const WORK_FEATURES = [
  {
    id: '01',
    title: 'Wolt Sifarişlərinin Çatdırılması',
    description:
      'Wolt platformasında restoran sifarişlərini müştərilərə təhlükəsiz və vaxtında çatdırmaq.',
  },
  {
    id: '02',
    title: 'Sərbəst İş Qrafiki',
    description:
      'İş saatlarınızı özünüz müəyyən edirsiniz. İstədiyiniz gün və saatda xəttə qoşulub işləyə bilərsiniz.',
  },
  {
    id: '03',
    title: 'Əlavə İş İmkanı',
    description:
      'Əsas işinizin və ya təhsilinizin yanında boş vaxtlarınızı dəyərləndirərək əlavə iş kimi çalışmaq imkanı.',
  },
  {
    id: '04',
    title: 'Velosiped, Skuter, Motosiklet və Avtomobil',
    description:
      'Şəxsi nəqliyyat vasitənizə uyğun olaraq velosiped, skuter, motosiklet və ya avtomobil ilə işləmək mümkündür.',
  },
  {
    id: '05',
    title: 'Gündəlik və 15 Günlük Qazanc Sistemi',
    description:
      'Sizə uyğun ödəniş dövrünü seçin: qazancınızı hər gün və ya 15 gündən bir şəffaf faizlə əldə edin.',
  },
] as const;

export const DEPOSIT_DETAILS = [
  {
    title: '40 AZN Mənfi Depozit',
    description: 'Qeydiyyat zamanı hesabınızda 40 AZN mənfi depozit açılır.',
  },
  {
    title: 'Qazancdan Hissə-Hissə Çıxılır',
    description:
      'Depozit məbləği ilkin ödənişsiz, işlədikcə əldə etdiyiniz qazancdan tədricən tutulur.',
  },
  {
    title: '1 Ədəd Wolt Termal Çantası Daxildir',
    description:
      'Çatdırılma üçün 1 ədəd rəsmi Wolt termal çantası təqdim olunur.',
  },
  {
    title: 'Çanta Qaytarıldıqda 80% Geri Ödəniş',
    description:
      'Çanta geri qaytarıldıqda 80% (32 AZN) geri ödənilir, 20% (8 AZN) isə istifadə və amortizasiya haqqı olaraq saxlanılır.',
  },
] as const;

export const REGISTRATION_REQUIREMENTS = [
  {
    id: 'id-card',
    number: '01',
    title: 'Şəxsiyyət vəsiqəsinin fotoları (ön və arxa)',
    detail: 'Məlumatların aydın oxunduğu yüksək keyfiyyətli foto.',
    spokenText:
      'Birinci tələb: Şəxsiyyət vəsiqəsinin ön və arxa tərəfinin fotoları. Məlumatların aydın oxunduğu yüksək keyfiyyətli foto tələb olunur.',
  },
  {
    id: 'selfie',
    number: '02',
    title: 'Selfi fotoşəkli',
    detail: 'Üzünüzün aydın göründüyü yeni çəkilmiş selfi.',
    spokenText:
      'İkinci tələb: Üz fotoşəkli. Üzünüzün aydın göründüyü yeni çəkilmiş fotoşəkil tələb olunur.',
  },
  {
    id: 'phone',
    number: '03',
    title: 'Aktiv telefon nömrəsi',
    detail: 'Əlaqə və tətbiq bildirişləri üçün daim aktiv olan nömrə.',
    spokenText:
      'Üçüncü tələb: Aktiv telefon nömrəsi. Əlaqə və tətbiq bildirişləri üçün daim aktiv olan nömrə tələb olunur.',
  },
  {
    id: 'gmail',
    number: '04',
    title: 'Aktiv Gmail hesabı',
    detail: 'Wolt kuryer hesabının bağlanması üçün işlək Gmail ünvanı.',
    spokenText:
      'Dördüncü tələb: Aktiv elektron poçt hesabı. Volt kuryer hesabının bağlanması üçün işlək elektron poçt ünvanı tələb olunur.',
  },
  {
    id: 'no-previous',
    number: '05',
    title: 'Əvvəllər Wolt-da qeydiyyatdan keçməmiş olmaq',
    detail: 'Namizədin adına daha öncə Wolt kuryer hesabı olmamalıdır.',
    spokenText:
      'Beşinci tələb: Əvvəllər Volt platformasında qeydiyyatdan keçməmiş olmaq. Namizədin adına daha öncə Volt kuryer hesabı olmamalıdır.',
  },
  {
    id: 'm10',
    number: '06',
    title: 'Maaş ödənişləri üçün aktiv M10 nömrəsi',
    detail: 'Qazancınızın köçürülməsi üçün aktiv M10 hesabı.',
    spokenText:
      'Altıncı tələb: Maaş ödənişləri üçün aktiv M on nömrəsi. Qazancınızın köçürülməsi üçün aktiv ödəniş hesabı tələb olunur.',
  },
] as const;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-new-1',
    question: 'Sənədim yoxdur, nə edim?',
    answer: 'Problem deyil, qeydiyyatdan keçin, sənəd almaqda Sizə kömək edəcəyik.',
  },
  {
    id: 'faq-new-2',
    question: 'Pulu nə vaxt alıram?',
    answer: 'Həftədə 1 dəfə, bank kartınıza köçürülür.',
  },
  {
    id: 'faq-new-3',
    question: 'Velosipedim yoxdur, işləyə bilərəm?',
    answer: 'Bəli, icarə variantları da var, qeydiyyatda qeyd edin.',
  },
  {
    id: 'faq-new-4',
    question: 'Nə vaxt başlaya bilərəm?',
    answer: 'Sənədlər hazırdırsa, 1-2 gün ərzində aktivləşdirilirsiniz.',
  },
  {
    id: 'faq-new-5',
    question: 'Yaş həddi var?',
    answer: '18 yaşdan yuxarı hər kəs qoşula bilər.',
  },
  {
    id: 'faq-1',
    question: 'Qeydiyyat üçün hansı sənədlər və məlumatlar tələb olunur?',
    answer:
      'Qeydiyyat üçün şəxsiyyət vəsiqəsinin ön və arxa tərəfinin fotosu, selfi, aktiv telefon nömrəsi, aktiv Gmail hesabı və maaş ödənişləri üçün aktiv M10 nömrəsi tələb olunur. Həmçinin əvvəllər Wolt platformasında qeydiyyatdan keçməmiş olmalısınız.',
  },
  {
    id: 'faq-2',
    question: 'Qeydiyyat üçün ilkin ödəniş tələb olunurmu?',
    answer:
      'Xeyr. 30 Noyabr 2026 tarixinədək qeydiyyat tamamilə ödənişsizdir. Hesabınızda açılan 40 AZN mənfi depozit də əvvəlcədən nağd ödənilmir, işlədikcə qazancınızdan hissə-hissə çıxılır.',
  },
  {
    id: 'faq-3',
    question: 'Gündəlik və 15 günlük qazanc sistemi necə işləyir?',
    answer:
      'Gündəlik ödəniş sistemində qazanc 40 AZN-ə qədər olduqda kuryer 75%, şirkət 25% pay alır; 40 AZN-dən yuxarı olduqda isə kuryer 80%, şirkət 20% pay alır. 15 günlük ödəniş sistemində isə kuryer 80%, şirkət 20% pay alır.',
  },
  {
    id: 'faq-4',
    question: '40 AZN depozit və Wolt termal çantası qaydası necədir?',
    answer:
      'Hesabınıza 40 AZN mənfi depozit tətbiq olunur və qazancınızdan tədricən tutulur. Bu məbləğə 1 ədəd Wolt termal çantası daxildir. İşdən ayrılıb çantanı geri qaytardığınız zaman məbləğin 80%-i (32 AZN) sizə geri ödənilir, 20%-i (8 AZN) istifadə və amortizasiya üçün saxlanılır.',
  },
  {
    id: 'faq-5',
    question: 'Hansı nəqliyyat vasitələri ilə işləyə bilərəm?',
    answer:
      'Bəli, FLASHLY FLEET ilə Wolt platformasında velosiped, skuter, motosiklet və ya avtomobil ilə sərbəst iş qrafiki əsasında çalışa bilərsiniz. İş saatlarınızı özünüz planlaşdırırsınız.',
  },
  {
    id: 'faq-6',
    question: 'Ofisiniz harada yerləşir və necə əlaqə saxlaya bilərəm?',
    answer:
      'Ofisimiz Məmməd Araz 25A ünvanında (Avropa qapıları / English Yard ilə üzbəüz), 2-ci mərtəbə, ofis 7, soldan üçüncü otaqda yerləşir. Suallarınız üçün +994 99 800 75 65 (WhatsApp) və ya +994 60 446 64 04 nömrəsi ilə əlaqə saxlaya bilərsiniz.',
  },
];

export const OFFICE_INFO = {
  street: 'Məmməd Araz 25A',
  landmark: 'Avropa qapıları / English Yard ilə üzbəüz',
  floorRoom: '2-ci mərtəbə, ofis 7, soldan üçüncü otaq',
  whatsappDisplay: '+994 99 800 75 65',
  phoneDisplay: '+994 60 446 64 04',
} as const;
