// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 영어 번역
const enTranslations = {
  common: {
    title: 'Language Learning Chat',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    chat: 'Chat',
    writing: 'Writing',
    loading: 'Loading...',
    loginRequired: 'Please log in to use this service.',
    generating: 'Generating...',
    admin: 'Admin',
    inquiry: 'Inquiries',
    yes: 'Yes', // 추가: 확인 버튼
    no: 'No', // 추가: 취소 버튼
    
  },
  chat: {
    topic: 'Topic',
    level: 'Level',
    learningLanguage: 'Learning Language',
    translationLanguage: 'Translation Language',
    conversationLength: 'Conversation Length',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    short: 'Short',
    medium: 'Medium',
    long: 'Long',
    generateChat: 'Generate Chat',
    generateAudio: 'Generate Audio',
    downloadPDF: 'Download PDF',
    dailyUsage: 'Daily usage',
    premiumUser: 'Premium User',
    freeUser: 'Free User',
    generateFirst: 'Please generate a conversation first.',
    audioError: 'An error occurred while generating audio.',
    pdfError: 'An error occurred while generating the PDF.',
    fetchError: 'An error occurred while fetching data.',
    conversation: 'Conversation',
    translation: 'Translation',
    vocabulary: 'Vocabulary',
    generatedContent: 'Generated Content',
    topicPlaceholder: 'Enter a topic (e.g., soccer)',
    voice: 'Voice Selection', // 추가: 성우 선택 라벨
  },
  voices: {
  alloy: 'Alloy - Neutral voice',
  echo: 'Echo - Deep and calm voice', 
  fable: 'Fable - Soft and warm voice',
  onyx: 'Onyx - Strong and authoritative voice',
  nova: 'Nova - Clear and professional voice',
  shimmer: 'Shimmer - Bright and cheerful voice'
},
  languages: {
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    japanese: 'Japanese',
    korean: 'Korean',
    chinese: 'Chinese',
    arabic: 'Arabic',
    indonesian: 'Indonesian',
    malaysian: 'Malaysian',
    thai: 'Thai',
    portuguese: 'Portuguese (Brazil)',
  },
  home: {
    welcome: 'Welcome to LingEdge',
    subtitle: 'Embark on a personalized journey with AI-assisted language mastery',
    startJourney: 'Start Your Journey',
    continueLearning: 'Continue Learning',
  },
};

// 한국어 번역
const koTranslations = {
  common: {
    title: '언어 학습 채팅',
    login: '로그인',
    signup: '회원가입',
    logout: '로그아웃',
    profile: '프로필',
    chat: '대화',
    writing: '작문',
    loading: '로딩 중...',
    loginRequired: '서비스를 이용하려면 로그인해주세요.',
    generating: '생성 중...',
    admin: '관리자',
    inquiry: '문의하기',
    yes: '예', // 추가: 확인 버튼
    no: '아니오' // 추가: 취소 버튼
    
  },
  chat: {
    topic: '주제',
    level: '난이도',
    learningLanguage: '학습 언어',
    translationLanguage: '번역 언어',
    conversationLength: '대화 길이',
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
    short: '짧게',
    medium: '보통',
    long: '길게',
    generateChat: '대화 생성',
    generateAudio: '오디오 생성',
    downloadPDF: 'PDF 다운로드',
    dailyUsage: '일일 사용량',
    premiumUser: '프리미엄 회원',
    freeUser: '일반 회원',
    generateFirst: '대화를 먼저 생성해주세요.',
    audioError: '오디오 생성 중 오류가 발생했습니다.',
    pdfError: 'PDF 생성 중 오류가 발생했습니다.',
    fetchError: '데이터를 가져오는 중 오류가 발생했습니다.',
    conversation: '대화',
    translation: '번역',
    vocabulary: '어휘',
    generatedContent: '생성된 내용',
    topicPlaceholder: '주제를 입력하세요 (예: 축구)',
    voice: '성우 선택',
  },
  voices: {
  alloy: 'Alloy - 중립적인 음성',
  echo: 'Echo - 깊고 차분한 음성',
  fable: 'Fable - 부드럽고 따뜻한 음성',
  onyx: 'Onyx - 강하고 권위있는 음성',
  nova: 'Nova - 명확하고 전문적인 음성',
  shimmer: 'Shimmer - 밝고 활기찬 음성'
},
  languages: {
    english: '영어',
    spanish: '스페인어',
    french: '프랑스어',
    german: '독일어',
    japanese: '일본어',
    korean: '한국어',
    chinese: '중국어',
    arabic: '아랍어',
    indonesian: '인도네시아어',
    malaysian: '말레이시아어',
    thai: '태국어',
    portuguese: '포르투갈어(브라질)',
  },
  home: {
    welcome: 'LingEdge 오신 것을 환영합니다',
    subtitle: 'AI 기반 언어 학습으로 맞춤형 학습 여정을 시작하세요',
    startJourney: '학습 시작하기',
    continueLearning: '계속 학습하기',
  },
};

// 아랍어 번역
const arTranslations = {
  common: {
    title: 'محادثة تعلم اللغة',
    login: 'تسجيل الدخول',
    signup: 'التسجيل',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    chat: 'محادثة',
    writing: 'كتابة',
    loading: 'جاري التحميل...',
    loginRequired: 'يرجى تسجيل الدخول لاستخدام هذه الخدمة.',
    generating: 'جاري الإنشاء...',
    admin: 'المسؤول',
    inquiry: 'استفسارات',
    yes: 'نعم', // 추가: 확인 버튼
    no: 'لا' // 추가: 취소 버튼
  },
  chat: {
    topic: 'الموضوع',
    level: 'المستوى',
    learningLanguage: 'لغة التعلم',
    translationLanguage: 'لغة الترجمة',
    conversationLength: 'طول المحادثة',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    short: 'قصير',
    medium: 'متوسط',
    long: 'طويل',
    generateChat: 'إنشاء محادثة',
    generateAudio: 'إنشاء صوت',
    downloadPDF: 'تنزيل PDF',
    dailyUsage: 'الاستخدام اليومي',
    premiumUser: 'مستخدم مميز',
    freeUser: 'مستخدم مجاني',
    generateFirst: 'يرجى إنشاء محادثة أولاً.',
    audioError: 'حدث خطأ أثناء إنشاء الصوت.',
    pdfError: 'حدث خطأ أثناء إنشاء ملف PDF.',
    fetchError: 'حدث خطأ أثناء جلب البيانات.',
    conversation: 'المحادثة',
    translation: 'الترجمة',
    vocabulary: 'المفردات',
    generatedContent: 'المحتوى المنشأ',
    topicPlaceholder: 'أدخل موضوعًا (مثال: كرة القدم)',
    voice: 'اختيار الصوت',
  },
  voices: {
  alloy: 'Alloy - صوت محايد',
  echo: 'Echo - صوت عميق وهادئ',
  fable: 'Fable - صوت ناعم ودافئ',
  onyx: 'Onyx - صوت قوي وموثوق',
  nova: 'Nova - صوت واضح ومهني',
  shimmer: 'Shimmer - صوت مشرق ومبهج'
},
  languages: {
    english: 'الإنجليزية',
    spanish: 'الإسبانية',
    french: 'الفرنسية',
    german: 'الألمانية',
    japanese: 'اليابانية',
    korean: 'الكورية',
    chinese: 'الصينية',
    arabic: 'العربية',
    indonesian: 'الإندونيسية',
    malaysian: 'الماليزية',
    thai: 'التايلاندية',
    portuguese: 'البرتغالية (البرازيل)',
  },
  home: {
    welcome: 'مرحبًا بك في LingEdge',
    subtitle: 'ابدأ رحلة تعلم اللغة المخصصة بمساعدة الذكاء الاصطناعي',
    startJourney: 'ابدأ رحلتك',
    continueLearning: 'مواصلة التعلم',
  },
};

// 인도네시아어 번역
const idTranslations = {
  common: {
    title: 'Obrolan Pembelajaran Bahasa',
    login: 'Masuk',
    signup: 'Daftar',
    logout: 'Keluar',
    profile: 'Profil',
    chat: 'Obrolan',
    writing: 'Menulis',
    loading: 'Memuat...',
    loginRequired: 'Silakan masuk untuk menggunakan layanan ini.',
    generating: 'Menghasilkan...',
    admin: 'Admin',
    inquiry: 'Pertanyaan',
    yes: 'Ya', // 추가: 확인 버튼
    no: 'Tidak' // 추가: 취소 버튼

  },
  chat: {
    topic: 'Topik',
    level: 'Tingkat',
    learningLanguage: 'Bahasa yang Dipelajari',
    translationLanguage: 'Bahasa Terjemahan',
    conversationLength: 'Panjang Percakapan',
    beginner: 'Pemula',
    intermediate: 'Menengah',
    advanced: 'Mahir',
    short: 'Pendek',
    medium: 'Sedang',
    long: 'Panjang',
    generateChat: 'Hasilkan Obrolan',
    generateAudio: 'Hasilkan Audio',
    downloadPDF: 'Unduh PDF',
    dailyUsage: 'Penggunaan harian',
    premiumUser: 'Pengguna Premium',
    freeUser: 'Pengguna Gratis',
    generateFirst: 'Hasilkan percakapan terlebih dahulu.',
    audioError: 'Terjadi kesalahan saat menghasilkan audio.',
    pdfError: 'Terjadi kesalahan saat menghasilkan PDF.',
    fetchError: 'Terjadi kesalahan saat mengambil data.',
    conversation: 'Percakapan',
    translation: 'Terjemahan',
    vocabulary: 'Kosakata',
    generatedContent: 'Konten yang Dihasilkan',
    topicPlaceholder: 'Masukkan topik (misalnya, sepak bola)',
    voice: 'Pilihan Suara',
  },
  voices: {
  alloy: 'Alloy - Suara netral',
  echo: 'Echo - Suara dalam dan tenang',
  fable: 'Fable - Suara lembut dan hangat',
  onyx: 'Onyx - Suara kuat dan otoritatif',
  nova: 'Nova - Suara jelas dan profesional',
  shimmer: 'Shimmer - Suara cerah dan ceria'
},
  languages: {
    english: 'Bahasa Inggris',
    spanish: 'Bahasa Spanyol',
    french: 'Bahasa Prancis',
    german: 'Bahasa Jerman',
    japanese: 'Bahasa Jepang',
    korean: 'Bahasa Korea',
    chinese: 'Bahasa Mandarin',
    arabic: 'Bahasa Arab',
    indonesian: 'Bahasa Indonesia',
    malaysian: 'Bahasa Melayu',
    thai: 'Bahasa Thai',
    portuguese: 'Bahasa Portugis (Brasil)',
  },
  home: {
    welcome: 'Selamat Datang di LingEdge',
    subtitle: 'Mulailah perjalanan pembelajaran bahasa yang dipersonalisasi dengan bantuan AI',
    startJourney: 'Mulai Perjalanan Anda',
    continueLearning: 'Lanjutkan Pembelajaran',
  },
};

// 말레이시아어 번역
const msTranslations = {
  common: {
    title: 'Sembang Pembelajaran Bahasa',
    login: 'Log Masuk',
    signup: 'Daftar',
    logout: 'Log Keluar',
    profile: 'Profil',
    chat: 'Sembang',
    writing: 'Menulis',
    loading: 'Memuatkan...',
    loginRequired: 'Sila log masuk untuk menggunakan perkhidmatan ini.',
    generating: 'Menjana...',
    admin: 'Admin',
    inquiry: 'Pertanyaan',
    yes: 'Ya', // 추가: 확인 버튼
    no: 'Tidak' // 추가: 취소 버튼
  },
  chat: {
    topic: 'Topik',
    level: 'Tahap',
    learningLanguage: 'Bahasa Pembelajaran',
    translationLanguage: 'Bahasa Terjemahan',
    conversationLength: 'Panjang Perbualan',
    beginner: 'Pemula',
    intermediate: 'Pertengahan',
    advanced: 'Lanjutan',
    short: 'Pendek',
    medium: 'Sederhana',
    long: 'Panjang',
    generateChat: 'Jana Perbualan',
    generateAudio: 'Jana Audio',
    downloadPDF: 'Muat Turun PDF',
    dailyUsage: 'Penggunaan harian',
    premiumUser: 'Pengguna Premium',
    freeUser: 'Pengguna Percuma',
    generateFirst: 'Sila jana perbualan terlebih dahulu.',
    audioError: 'Ralat berlaku semasa menjana audio.',
    pdfError: 'Ralat berlaku semasa menjana PDF.',
    fetchError: 'Ralat berlaku semasa mengambil data.',
    conversation: 'Perbualan',
    translation: 'Terjemahan',
    vocabulary: 'Perbendaharaan Kata',
    generatedContent: 'Kandungan yang Dijana',
    topicPlaceholder: 'Masukkan topik (contohnya, bola sepak)',
    voice: 'Pilihan Suara',
  },
  voices: {
  alloy: 'Alloy - Suara neutral',
  echo: 'Echo - Suara dalam dan tenang',
  fable: 'Fable - Suara lembut dan hangat',
  onyx: 'Onyx - Suara kuat dan berwibawa',
  nova: 'Nova - Suara jelas dan profesional',
  shimmer: 'Shimmer - Suara cerah dan ceria'
},
  languages: {
    english: 'Bahasa Inggeris',
    spanish: 'Bahasa Sepanyol',
    french: 'Bahasa Perancis',
    german: 'Bahasa Jerman',
    japanese: 'Bahasa Jepun',
    korean: 'Bahasa Korea',
    chinese: 'Bahasa Cina',
    arabic: 'Bahasa Arab',
    indonesian: 'Bahasa Indonesia',
    malaysian: 'Bahasa Melayu',
    thai: 'Bahasa Thai',
    portuguese: 'Bahasa Portugis (Brazil)',
  },
  home: {
    welcome: 'Selamat Datang ke LingEdge',
    subtitle: 'Mulakan perjalanan pembelajaran bahasa tersuai dengan bantuan AI',
    startJourney: 'Mulakan Perjalanan Anda',
    continueLearning: 'Teruskan Pembelajaran',
  },
};

// 태국어 번역
const thTranslations = {
  common: {
    title: 'แชทเรียนภาษา',
    login: 'เข้าสู่ระบบ',
    signup: 'ลงทะเบียน',
    logout: 'ออกจากระบบ',
    profile: 'โปรไฟล์',
    chat: 'แชท',
    writing: 'การเขียน',
    loading: 'กำลังโหลด...',
    loginRequired: 'กรุณาเข้าสู่ระบบเพื่อใช้บริการนี้',
    generating: 'กำลังสร้าง...',
    admin: 'ผู้ดูแลระบบ',
    inquiry: 'สอบถาม',
    yes: 'ใช่', // 추가: 확인 버튼
    no: 'ไม่' // 추가: 취소 버튼
  },
  chat: {
    topic: 'หัวข้อ',
    level: 'ระดับ',
    learningLanguage: 'ภาษาที่เรียน',
    translationLanguage: 'ภาษาแปล',
    conversationLength: 'ความยาวบทสนทนา',
    beginner: 'เริ่มต้น',
    intermediate: 'ปานกลาง',
    advanced: 'ขั้นสูง',
    short: 'สั้น',
    medium: 'ปานกลาง',
    long: 'ยาว',
    generateChat: 'สร้างบทสนทนา',
    generateAudio: 'สร้างเสียง',
    downloadPDF: 'ดาวน์โหลด PDF',
    dailyUsage: 'การใช้งานประจำวัน',
    premiumUser: 'ผู้ใช้พรีเมียม',
    freeUser: 'ผู้ใช้ฟรี',
    generateFirst: 'กรุณาสร้างบทสนทนาก่อน',
    audioError: 'เกิดข้อผิดพลาดขณะสร้างเสียง',
    pdfError: 'เกิดข้อผิดพลาดขณะสร้าง PDF',
    fetchError: 'เกิดข้อผิดพลาดขณะดึงข้อมูล',
    conversation: 'บทสนทนา',
    translation: 'การแปล',
    vocabulary: 'คำศัพท์',
    generatedContent: 'เนื้อหาที่สร้าง',
    topicPlaceholder: 'ป้อนหัวข้อ (เช่น ฟุตบอล)',
    voice: 'เลือกเสียง', 
  },
  voices: {
  alloy: 'Alloy - เสียงกลาง',
  echo: 'Echo - เสียงลึกและสงบ',
  fable: 'Fable - เสียงนุ่มและอบอุ่น',
  onyx: 'Onyx - เสียงแข็งแรงและมีอำนาจ',
  nova: 'Nova - เสียงชัดเจนและเป็นมืออาชีพ',
  shimmer: 'Shimmer - เสียงสดใสและร่าเริง'
},
  languages: {
    english: 'ภาษาอังกฤษ',
    spanish: 'ภาษาสเปน',
    french: 'ภาษาฝรั่งเศส',
    german: 'ภาษาเยอรมัน',
    japanese: 'ภาษาญี่ปุ่น',
    korean: 'ภาษาเกาหลี',
    chinese: 'ภาษาจีน',
    arabic: 'ภาษาอาหรับ',
    indonesian: 'ภาษาอินโดนีเซีย',
    malaysian: 'ภาษามาเลเซีย',
    thai: 'ภาษาไทย',
    portuguese: 'ภาษาโปรตุเกส (บราซิล)',
  },
  home: {
    welcome: 'ยินดีต้อนรับสู่ LingEdge',
    subtitle: 'เริ่มต้นการเรียนรู้ภาษาที่ปรับแต่งเฉพาะบุคคลด้วย AI',
    startJourney: 'เริ่มต้นการเดินทาง',
    continueLearning: 'เรียนต่อ',
  },
};

// 스페인어(남미) 번역
const esTranslations = {
  common: {
    title: 'Chat de Aprendizaje de Idiomas',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    logout: 'Cerrar sesión',
    profile: 'Perfil',
    chat: 'Chat',
    writing: 'Escritura',
    loading: 'Cargando...',
    loginRequired: 'Por favor inicie sesión para usar este servicio.',
    generating: 'Generando...',
    admin: 'Administrador',
    inquiry: 'Consultas',
    yes: 'Sí', // 추가: 확인 버튼
    no: 'No' // 추가: 취소 버튼
  },
  chat: {
    topic: 'Tema',
    level: 'Nivel',
    learningLanguage: 'Idioma de aprendizaje',
    translationLanguage: 'Idioma de traducción',
    conversationLength: 'Duración de la conversación',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    short: 'Corto',
    medium: 'Medio',
    long: 'Largo',
    generateChat: 'Generar conversación',
    generateAudio: 'Generar audio',
    downloadPDF: 'Descargar PDF',
    dailyUsage: 'Uso diario',
    premiumUser: 'Usuario Premium',
    freeUser: 'Usuario Gratuito',
    generateFirst: 'Por favor genere una conversación primero.',
    audioError: 'Ocurrió un error al generar el audio.',
    pdfError: 'Ocurrió un error al generar el PDF.',
    fetchError: 'Ocurrió un error al obtener los datos.',
    conversation: 'Conversación',
    translation: 'Traducción',
    vocabulary: 'Vocabulario',
    generatedContent: 'Contenido generado',
    topicPlaceholder: 'Ingrese un tema (ej: fútbol)',
    voice: 'Selección de Voz',
  },
    voices: {
    alloy: 'Alloy - Voz neutral',
    echo: 'Echo - Voz profunda y calmada',
    fable: 'Fable - Voz suave y cálida',
    onyx: 'Onyx - Voz fuerte y autoritaria',
    nova: 'Nova - Voz clara y profesional',
    shimmer: 'Shimmer - Voz brillante y alegre'
  },
  languages: {
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
    german: 'Alemán',
    japanese: 'Japonés',
    korean: 'Coreano',
    chinese: 'Chino',
    arabic: 'Árabe',
    indonesian: 'Indonesio',
    malaysian: 'Malayo',
    thai: 'Tailandés',
    portuguese: 'Portugués (Brasil)',
  },
  home: {
    welcome: 'Bienvenido a LingEdge',
    subtitle: 'Comienza un viaje personalizado de aprendizaje de idiomas con asistencia de IA',
    startJourney: 'Comenzar tu viaje',
    continueLearning: 'Continuar aprendiendo',
  },
};

// 포르투갈어(브라질) 번역
const ptBrTranslations = {
  common: {
    title: 'Chat de Aprendizado de Idiomas',
    login: 'Entrar',
    signup: 'Cadastrar',
    logout: 'Sair',
    profile: 'Perfil',
    chat: 'Chat',
    writing: 'Escrita',
    loading: 'Carregando...',
    loginRequired: 'Por favor, faça login para usar este serviço.',
    generating: 'Gerando...',
    admin: 'Administrador',
    inquiry: 'Perguntas',
    yes: 'Sim', // 추가: 확인 버튼
    no: 'Não' // 추가: 취소 버튼

  },
  chat: {
    topic: 'Tópico',
    level: 'Nível',
    learningLanguage: 'Idioma de aprendizado',
    translationLanguage: 'Idioma de tradução',
    conversationLength: 'Comprimento da conversa',
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    short: 'Curto',
    medium: 'Médio',
    long: 'Longo',
    generateChat: 'Gerar conversa',
    generateAudio: 'Gerar áudio',
    downloadPDF: 'Baixar PDF',
    dailyUsage: 'Uso diário',
    premiumUser: 'Usuário Premium',
    freeUser: 'Usuário Gratuito',
    generateFirst: 'Por favor, gere uma conversa primeiro.',
    audioError: 'Ocorreu um erro ao gerar o áudio.',
    pdfError: 'Ocorreu um erro ao gerar o PDF.',
    fetchError: 'Ocorreu um erro ao buscar os dados.',
    conversation: 'Conversa',
    translation: 'Tradução',
    vocabulary: 'Vocabulário',
    generatedContent: 'Conteúdo Gerado',
    topicPlaceholder: 'Digite um tópico (ex: futebol)',
    voice: 'Seleção de Voz',
  },
    voices: {
    alloy: 'Alloy - Voz neutra',
    echo: 'Echo - Voz profunda e calma',
    fable: 'Fable - Voz suave e calorosa',
    onyx: 'Onyx - Voz forte e autoritária',
    nova: 'Nova - Voz clara e profissional',
    shimmer: 'Shimmer - Voz brilhante e alegre'
  },
  languages: {
    english: 'Inglês',
    spanish: 'Espanhol',
    french: 'Francês',
    german: 'Alemão',
    japanese: 'Japonês',
    korean: 'Coreano',
    chinese: 'Chinês',
    arabic: 'Árabe',
    indonesian: 'Indonésio',
    malaysian: 'Malaio',
    thai: 'Tailandês',
    portuguese: 'Português (Brasil)',
  },
  home: {
    welcome: 'Bem-vindo ao LingEdge',
    subtitle: 'Embarque em uma jornada personalizada de aprendizado de idiomas com assistência de IA',
    startJourney: 'Iniciar sua jornada',
    continueLearning: 'Continuar aprendendo',
  },
};

// i18n 초기화
i18n
  .use(LanguageDetector) // 브라우저 언어 감지
  .use(initReactI18next) // react-i18next 초기화
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ko: {
        translation: koTranslations
      },
      ar: {
        translation: arTranslations
      },
      id: {
        translation: idTranslations
      },
      ms: {
        translation: msTranslations
      },
      th: {
        translation: thTranslations
      },
      es: {
        translation: esTranslations
      },
      'pt-BR': {
        translation: ptBrTranslations
      }
    },
    fallbackLng: 'en', // 기본 언어
    debug: true,
    interpolation: {
      escapeValue: false, // React에서는 이미 XSS 방지가 되어 있음
    }
  });
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

  // 언어 변경 시 HTML dir 속성 업데이트 함수
  const updateDocumentDirection = (language) => {
    // HTML 태그 찾기
    const htmlTag = document.querySelector('html');
    
    // 언어 설정
    htmlTag.setAttribute('lang', language);
    
    // RTL 언어인 경우 dir 속성을 rtl로 설정
    if (rtlLanguages.includes(language)) {
      htmlTag.setAttribute('dir', 'rtl');
    } else {
      // 그 외에는 ltr로 설정
      htmlTag.setAttribute('dir', 'ltr');
    }
  };
  
  // 언어 변경 이벤트 감지
  i18n.on('languageChanged', (lng) => {
    updateDocumentDirection(lng);
  });
  
  // 페이지 로드 시 초기 방향 설정
  updateDocumentDirection(i18n.language);


// 영어 번역에 추가
enTranslations.writing = {
    title: 'Writing Practice',
    enterText: 'Enter text',
    fontSize: 'Font size',
    rows: 'Number of rows',
    savePDF: 'Save as PDF',
    loginRequired: 'Please log in to use this feature.',
    waitLoading: 'Please wait while we load your information.',
    errorTryAgain: 'An error occurred. Please try again later.',
    usageLimitReached: 'You\'ve reached your daily limit of {{limit}} uses. {{premium}}',
    upgradeMessage: 'Please upgrade to premium for more uses.',
    pdfError: 'An error occurred while generating the PDF. Please try again.',
    dailyUsage: 'Daily usage'
  };
  
  // 한국어 번역에 추가
  koTranslations.writing = {
    title: '글쓰기 연습',
    enterText: '글자를 입력하세요',
    fontSize: '글자 크기',
    rows: '줄 수',
    savePDF: 'PDF로 저장',
    loginRequired: '이 기능을 사용하려면 로그인하세요.',
    waitLoading: '정보를 로드하는 동안 기다려주세요.',
    errorTryAgain: '오류가 발생했습니다. 나중에 다시 시도해주세요.',
    usageLimitReached: '일일 사용 한도 {{limit}}회를 초과했습니다. {{premium}}',
    upgradeMessage: '더 많은 사용을 위해 프리미엄으로 업그레이드하세요.',
    pdfError: 'PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
    dailyUsage: '일일 사용량'
  };
  
  // 아랍어 번역에 추가
  arTranslations.writing = {
    title: 'تدريب الكتابة',
    enterText: 'أدخل النص',
    fontSize: 'حجم الخط',
    rows: 'عدد الصفوف',
    savePDF: 'حفظ كملف PDF',
    loginRequired: 'يرجى تسجيل الدخول لاستخدام هذه الميزة.',
    waitLoading: 'يرجى الانتظار أثناء تحميل المعلومات الخاصة بك.',
    errorTryAgain: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.',
    usageLimitReached: 'لقد وصلت إلى الحد اليومي البالغ {{limit}} استخدامًا. {{premium}}',
    upgradeMessage: 'يرجى الترقية إلى النسخة المميزة للمزيد من الاستخدامات.',
    pdfError: 'حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.',
    dailyUsage: 'الاستخدام اليومي'
  };
  
  // 인도네시아어 번역에 추가
  idTranslations.writing = {
    title: 'Latihan Menulis',
    enterText: 'Masukkan teks',
    fontSize: 'Ukuran font',
    rows: 'Jumlah baris',
    savePDF: 'Simpan sebagai PDF',
    loginRequired: 'Silakan masuk untuk menggunakan fitur ini.',
    waitLoading: 'Harap tunggu sementara kami memuat informasi Anda.',
    errorTryAgain: 'Terjadi kesalahan. Silakan coba lagi nanti.',
    usageLimitReached: 'Anda telah mencapai batas harian {{limit}} penggunaan. {{premium}}',
    upgradeMessage: 'Silakan tingkatkan ke premium untuk penggunaan lebih banyak.',
    pdfError: 'Terjadi kesalahan saat menghasilkan PDF. Silakan coba lagi.',
    dailyUsage: 'Penggunaan harian'
  };
  
  // 말레이시아어 번역에 추가
  msTranslations.writing = {
    title: 'Latihan Menulis',
    enterText: 'Masukkan teks',
    fontSize: 'Saiz fon',
    rows: 'Bilangan baris',
    savePDF: 'Simpan sebagai PDF',
    loginRequired: 'Sila log masuk untuk menggunakan ciri ini.',
    waitLoading: 'Sila tunggu semasa kami memuatkan maklumat anda.',
    errorTryAgain: 'Ralat berlaku. Sila cuba lagi kemudian.',
    usageLimitReached: 'Anda telah mencapai had harian {{limit}} penggunaan. {{premium}}',
    upgradeMessage: 'Sila naik taraf ke premium untuk lebih banyak penggunaan.',
    pdfError: 'Ralat berlaku semasa menjana PDF. Sila cuba lagi.',
    dailyUsage: 'Penggunaan harian'
  };
  
  // 태국어 번역에 추가
  thTranslations.writing = {
    title: 'ฝึกการเขียน',
    enterText: 'ป้อนข้อความ',
    fontSize: 'ขนาดตัวอักษร',
    rows: 'จำนวนแถว',
    savePDF: 'บันทึกเป็น PDF',
    loginRequired: 'กรุณาเข้าสู่ระบบเพื่อใช้คุณสมบัตินี้',
    waitLoading: 'โปรดรอขณะที่เราโหลดข้อมูลของคุณ',
    errorTryAgain: 'เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลัง',
    usageLimitReached: 'คุณได้ถึงขีดจำกัดรายวันของการใช้งาน {{limit}} ครั้งแล้ว {{premium}}',
    upgradeMessage: 'โปรดอัพเกรดเป็นพรีเมียมสำหรับการใช้งานเพิ่มเติม',
    pdfError: 'เกิดข้อผิดพลาดขณะสร้าง PDF โปรดลองอีกครั้ง',
    dailyUsage: 'การใช้งานประจำวัน'
  };
  
  // 스페인어(남미) 번역에 추가
  esTranslations.writing = {
    title: 'Práctica de Escritura',
    enterText: 'Ingresar texto',
    fontSize: 'Tamaño de fuente',
    rows: 'Número de filas',
    savePDF: 'Guardar como PDF',
    loginRequired: 'Por favor inicie sesión para usar esta función.',
    waitLoading: 'Por favor espere mientras cargamos su información.',
    errorTryAgain: 'Ha ocurrido un error. Por favor intente más tarde.',
    usageLimitReached: 'Ha alcanzado su límite diario de {{limit}} usos. {{premium}}',
    upgradeMessage: 'Por favor actualice a premium para más usos.',
    pdfError: 'Ocurrió un error al generar el PDF. Por favor intente nuevamente.',
    dailyUsage: 'Uso diario'
  };
  
  // 포르투갈어(브라질) 번역에 추가
  ptBrTranslations.writing = {
    title: 'Prática de Escrita',
    enterText: 'Digite o texto',
    fontSize: 'Tamanho da fonte',
    rows: 'Número de linhas',
    savePDF: 'Salvar como PDF',
    loginRequired: 'Por favor, faça login para usar este recurso.',
    waitLoading: 'Por favor, aguarde enquanto carregamos suas informações.',
    errorTryAgain: 'Ocorreu um erro. Por favor, tente novamente mais tarde.',
    usageLimitReached: 'Você atingiu seu limite diário de {{limit}} usos. {{premium}}',
    upgradeMessage: 'Por favor, atualize para o premium para mais usos.',
    pdfError: 'Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.',
    dailyUsage: 'Uso diário'
  };

  // 영어 번역에 추가
enTranslations.profile = {
    title: 'User Profile',
    premiumUser: 'Premium User',
    freeUser: 'Free User',
    subscriptionStatus: 'Subscription Status',
    notSubscribed: 'Not subscribed',
    subscriptionExpires: 'Subscription Expires',
    changePassword: 'Change Password',
    cancelSubscription: 'Cancel Subscription',
    subscribe: 'Subscribe',
    enterCurrentPassword: 'Enter current password',
    verifyAndChange: 'Verify & Change',
    fetchError: 'Failed to fetch user data',
    incorrectPassword: 'Current password is incorrect',
    genericError: 'An error occurred. Please try again.',
    subscriptionCancelError: 'Failed to cancel subscription. Please try again.',
    logout: 'Logout',
    dangerZone: 'Danger Zone',
    deleteAccountWarning: 'Once you delete your account, there is no going back. Please be certain.',
    deleteAccount: 'Delete Account',
    cancelConfirmTitle: 'Confirm Subscription Cancellation',
    cancelConfirmMessage: 'Are you sure you want to cancel your subscription? Premium benefits will end immediately.'
  };
  
  // 한국어 번역에 추가
  koTranslations.profile = {
    title: '사용자 프로필',
    premiumUser: '프리미엄 회원',
    freeUser: '일반 회원',
    subscriptionStatus: '구독 상태',
    notSubscribed: '구독하지 않음',
    subscriptionExpires: '구독 만료일',
    changePassword: '비밀번호 변경',
    cancelSubscription: '구독 취소',
    subscribe: '구독하기',
    enterCurrentPassword: '현재 비밀번호 입력',
    verifyAndChange: '확인 및 변경',
    fetchError: '사용자 데이터를 가져오는데 실패했습니다.',
    incorrectPassword: '현재 비밀번호가 올바르지 않습니다.',
    genericError: '오류가 발생했습니다. 다시 시도해주세요.',
    subscriptionCancelError: '구독 취소에 실패했습니다. 다시 시도해주세요.',
    logout: '로그아웃',
    dangerZone: '위험 구역',
    deleteAccountWarning: '계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다.',
    deleteAccount: '계정 삭제',
    cancelConfirmTitle: '구독 취소 확인',
    cancelConfirmMessage: '정말로 구독을 취소하시겠습니까? 취소 시 프리미엄 혜택이 즉시 중단됩니다.'
  };
  
  // 아랍어 번역에 추가
  arTranslations.profile = {
    title: 'الملف الشخصي للمستخدم',
    premiumUser: 'مستخدم مميز',
    freeUser: 'مستخدم مجاني',
    subscriptionStatus: 'حالة الاشتراك',
    notSubscribed: 'غير مشترك',
    subscriptionExpires: 'ينتهي الاشتراك',
    changePassword: 'تغيير كلمة المرور',
    cancelSubscription: 'إلغاء الاشتراك',
    subscribe: 'اشترك',
    enterCurrentPassword: 'أدخل كلمة المرور الحالية',
    verifyAndChange: 'تحقق وتغيير',
    fetchError: 'فشل في جلب بيانات المستخدم',
    incorrectPassword: 'كلمة المرور الحالية غير صحيحة',
    genericError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    subscriptionCancelError: 'فشل في إلغاء الاشتراك. يرجى المحاولة مرة أخرى.',
    logout: 'تسجيل الخروج',
    dangerZone: 'منطقة خطرة',
    deleteAccountWarning: 'سيؤدي حذف الحساب إلى إزالة جميع البيانات بشكل دائم.',
    deleteAccount: 'حذف الحساب',
    cancelConfirmTitle: 'تأكيد إلغاء الاشتراك',
    cancelConfirmMessage: 'هل أنت متأكد أنك تريد إلغاء اشتراكك؟ ستنتهي المزايا المميزة على الفور.'
  };
  
  // 인도네시아어 번역에 추가
  idTranslations.profile = {
    title: 'Profil Pengguna',
    premiumUser: 'Pengguna Premium',
    freeUser: 'Pengguna Gratis',
    subscriptionStatus: 'Status Langganan',
    notSubscribed: 'Tidak berlangganan',
    subscriptionExpires: 'Langganan Berakhir',
    changePassword: 'Ubah Kata Sandi',
    cancelSubscription: 'Batalkan Langganan',
    subscribe: 'Berlangganan',
    enterCurrentPassword: 'Masukkan kata sandi saat ini',
    verifyAndChange: 'Verifikasi & Ubah',
    fetchError: 'Gagal mengambil data pengguna',
    incorrectPassword: 'Kata sandi saat ini salah',
    genericError: 'Terjadi kesalahan. Silakan coba lagi.',
    subscriptionCancelError: 'Gagal membatalkan langganan. Silakan coba lagi.',
    logout: 'Keluar',
    dangerZone: 'Zona Berbahaya',
    deleteAccountWarning: 'Menghapus akun akan menghapus semua data secara permanen.',
    deleteAccount: 'Hapus Akun',
    cancelConfirmTitle: 'Konfirmasi Pembatalan Langganan',
    cancelConfirmMessage: 'Apakah Anda yakin ingin membatalkan langganan Anda? Manfaat premium akan berakhir segera.'
  };

  msTranslations.profile={
    title: 'Profil Pengguna',
    premiumUser: 'Pengguna Premium',
    freeUser: 'Pengguna Percuma',
    subscriptionStatus: 'Status Langganan',
    notSubscribed: 'Tidak berlanggan',
    subscriptionExpires: 'Langganan Tamat',
    changePassword: 'Tukar Kata Laluan',
    cancelSubscription: 'Batalkan Langganan',
    subscribe: 'Langgan',
    enterCurrentPassword: 'Masukkan kata laluan semasa',
    verifyAndChange: 'Sahkan & Tukar',
    fetchError: 'Gagal mendapatkan data pengguna',
    incorrectPassword: 'Kata laluan semasa tidak betul',
    genericError: 'Ralat berlaku. Sila cuba lagi.',
    subscriptionCancelError: 'Gagal membatalkan langganan. Sila cuba lagi.',
    logout: 'Log Keluar',
    dangerZone: 'Zon Berbahaya',
    deleteAccountWarning: 'Apabila anda memadam akaun, tiada jalan kembali. Sila pastikan.',
    deleteAccount: 'Padam Akaun',
    cancelConfirmTitle: 'Sahkan Pembatalan Langganan',
    cancelConfirmMessage: 'Adakah anda pasti mahu membatalkan langganan anda? Faedah premium akan tamat dengan serta-merta.'
  };

  thTranslations.profile ={
    title: 'โปรไฟล์ผู้ใช้',
    premiumUser: 'ผู้ใช้พรีเมียม',
    freeUser: 'ผู้ใช้ฟรี',
    subscriptionStatus: 'สถานะการสมัครสมาชิก',
    notSubscribed: 'ไม่ได้สมัครสมาชิก',
    subscriptionExpires: 'การสมัครสมาชิกหมดอายุ',
    changePassword: 'เปลี่ยนรหัสผ่าน',
    cancelSubscription: 'ยกเลิกการสมัครสมาชิก',
    subscribe: 'สมัครสมาชิก',
    enterCurrentPassword: 'ใส่รหัสผ่านปัจจุบัน',
    verifyAndChange: 'ยืนยันและเปลี่ยน',
    fetchError: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้',
    incorrectPassword: 'รหัสผ่านปัจจุบันไม่ถูกต้อง',
    genericError: 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง',
    subscriptionCancelError: 'ไม่สามารถยกเลิกการสมัครสมาชิกได้ โปรดลองอีกครั้ง',
    logout: 'ออกจากระบบ',
    dangerZone: 'โซนอันตราย',
    deleteAccountWarning: 'เมื่อคุณลบบัญชีแล้ว จะไม่สามารถย้อนกลับได้ โปรดแน่ใจ',
    deleteAccount: 'ลบบัญชี',
    cancelConfirmTitle: 'ยืนยันการยกเลิกการสมัครสมาชิก',
    cancelConfirmMessage: 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการสมัครสมาชิก? สิทธิประโยชน์พรีเมียมจะสิ้นสุดทันที'
  };

  esTranslations.profile ={
    title: 'Perfil de Usuario',
    premiumUser: 'Usuario Premium',
    freeUser: 'Usuario Gratuito',
    subscriptionStatus: 'Estado de Suscripción',
    notSubscribed: 'No suscrito',
    subscriptionExpires: 'La Suscripción Expira',
    changePassword: 'Cambiar Contraseña',
    cancelSubscription: 'Cancelar Suscripción',
    subscribe: 'Suscribirse',
    enterCurrentPassword: 'Ingrese la contraseña actual',
    verifyAndChange: 'Verificar y Cambiar',
    fetchError: 'Error al obtener datos del usuario',
    incorrectPassword: 'La contraseña actual es incorrecta',
    genericError: 'Ha ocurrido un error. Por favor, inténtelo de nuevo.',
    subscriptionCancelError: 'Error al cancelar la suscripción. Por favor, inténtelo de nuevo.',
    logout: 'Cerrar Sesión',
    dangerZone: 'Zona de Peligro',
    deleteAccountWarning: 'Una vez que elimine su cuenta, no hay vuelta atrás. Por favor, esté seguro.',
    deleteAccount: 'Eliminar Cuenta',
    cancelConfirmTitle: 'Confirmar Cancelación de Suscripción',
    cancelConfirmMessage: '¿Está seguro de que desea cancelar su suscripción? Los beneficios premium finalizarán inmediatamente.'
  };

  ptBrTranslations.profile ={
    title: 'Perfil do Usuário',
    premiumUser: 'Usuário Premium',
    freeUser: 'Usuário Gratuito',
    subscriptionStatus: 'Status da Assinatura',
    notSubscribed: 'Não assinado',
    subscriptionExpires: 'Assinatura Expira',
    changePassword: 'Alterar Senha',
    cancelSubscription: 'Cancelar Assinatura',
    subscribe: 'Assinar',
    enterCurrentPassword: 'Digite a senha atual',
    verifyAndChange: 'Verificar e Alterar',
    fetchError: 'Falha ao buscar dados do usuário',
    incorrectPassword: 'A senha atual está incorreta',
    genericError: 'Ocorreu um erro. Por favor, tente novamente.',
    subscriptionCancelError: 'Falha ao cancelar a assinatura. Por favor, tente novamente.',
    logout: 'Sair',
    dangerZone: 'Zona de Perigo',
    deleteAccountWarning: 'Depois de excluir sua conta, não há como voltar atrás. Por favor, tenha certeza.',
    deleteAccount: 'Excluir Conta',
    cancelConfirmTitle: 'Confirmar Cancelamento de Assinatura',
    cancelConfirmMessage: 'Tem certeza de que deseja cancelar sua assinatura? Os benefícios premium terminarão imediatamente.'
  };

  enTranslations.home = {
    ...enTranslations.home,
    featureChat: "Chat Practice",
    featureChatDesc: "Practice conversations in your target language with AI assistance.",
    featureWriting: "Writing Practice",
    featureWritingDesc: "Improve your writing skills with guided exercises and feedback.",
    featureLearning: "Progress Tracking",
    featureLearningDesc: "Track your learning progress and see how far you've come."
  };
  
  // 한국어 번역에 추가
  koTranslations.home = {
    ...koTranslations.home,
    featureChat: "대화 연습",
    featureChatDesc: "AI 도움을 받아 목표 언어로 대화를 연습하세요.",
    featureWriting: "쓰기 연습",
    featureWritingDesc: "안내된 연습과 피드백으로 쓰기 능력을 향상시키세요.",
    featureLearning: "학습 진행 상황",
    featureLearningDesc: "학습 진행 상황을 추적하고 얼마나 발전했는지 확인하세요."
  };

  // 아랍어 번역에 추가
arTranslations.home = { 
    ...arTranslations.home, 
    featureChat: "ممارسة المحادثة",
    featureChatDesc: "ممارسة المحادثات بلغتك المستهدفة بمساعدة الذكاء الاصطناعي.",
    featureWriting: "ممارسة الكتابة",
    featureWritingDesc: "حسّن مهارات الكتابة لديك من خلال التمارين الموجهة والتعليقات.",
    featureLearning: "تتبع التقدم",
    featureLearningDesc: "تتبع تقدم التعلم الخاص بك ورؤية مدى تطورك."
  };
  
  // 인도네시아어 번역에 추가
  idTranslations.home = { 
    ...idTranslations.home, 
    featureChat: "Latihan Percakapan",
    featureChatDesc: "Berlatih percakapan dalam bahasa target Anda dengan bantuan AI.",
    featureWriting: "Latihan Menulis",
    featureWritingDesc: "Tingkatkan keterampilan menulis Anda dengan latihan terpandu dan umpan balik.",
    featureLearning: "Pelacakan Kemajuan",
    featureLearningDesc: "Lacak kemajuan belajar Anda dan lihat sejauh mana Anda telah berkembang."
  };
  
  // 말레이시아어 번역에 추가
  msTranslations.home = { 
    ...msTranslations.home, 
    featureChat: "Latihan Perbualan",
    featureChatDesc: "Berlatih perbualan dalam bahasa sasaran anda dengan bantuan AI.",
    featureWriting: "Latihan Penulisan",
    featureWritingDesc: "Tingkatkan kemahiran penulisan anda dengan latihan berpandu dan maklum balas.",
    featureLearning: "Penjejakan Kemajuan",
    featureLearningDesc: "Jejaki kemajuan pembelajaran anda dan lihat sejauh mana anda telah maju."
  };
  
  // 태국어 번역에 추가
  thTranslations.home = { 
    ...thTranslations.home, 
    featureChat: "ฝึกการสนทนา",
    featureChatDesc: "ฝึกสนทนาในภาษาเป้าหมายของคุณด้วยความช่วยเหลือจาก AI",
    featureWriting: "ฝึกการเขียน",
    featureWritingDesc: "พัฒนาทักษะการเขียนของคุณด้วยแบบฝึกหัดที่มีการแนะนำและคำติชม",
    featureLearning: "ติดตามความก้าวหน้า",
    featureLearningDesc: "ติดตามความก้าวหน้าในการเรียนรู้ของคุณและดูว่าคุณมาไกลแค่ไหน"
  };
  
  // 스페인어 번역에 추가
  esTranslations.home = { 
    ...esTranslations.home, 
    featureChat: "Práctica de Conversación",
    featureChatDesc: "Practica conversaciones en tu idioma objetivo con asistencia de IA.",
    featureWriting: "Práctica de Escritura",
    featureWritingDesc: "Mejora tus habilidades de escritura con ejercicios guiados y retroalimentación.",
    featureLearning: "Seguimiento de Progreso",
    featureLearningDesc: "Sigue tu progreso de aprendizaje y observa cuánto has avanzado."
  };
  
  // 포르투갈어(브라질) 번역에 추가
  ptBrTranslations.home = { 
    ...ptBrTranslations.home, 
    featureChat: "Prática de Conversação",
    featureChatDesc: "Pratique conversações em seu idioma-alvo com assistência de IA.",
    featureWriting: "Prática de Escrita",
    featureWritingDesc: "Melhore suas habilidades de escrita com exercícios guiados e feedback.",
    featureLearning: "Acompanhamento de Progresso",
    featureLearningDesc: "Acompanhe seu progresso de aprendizado e veja o quanto você evoluiu."
  };

// 영어 번역에 추가
enTranslations.login = {
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    or: "OR",
    signInWithGoogle: "Sign in with Google",
    forgotCredentials: "Forgot username or password?",
    noAccount: "Don't have an account?",
    signupHere: "Sign up here",
    googleLoginFailed: "Google login failed. Please try again.",
    invalidResponse: "Invalid response from server"
  };
  
  // 한국어 번역에 추가
  koTranslations.login = {
    emailPlaceholder: "이메일",
    passwordPlaceholder: "비밀번호",
    or: "또는",
    signInWithGoogle: "Google로 로그인",
    forgotCredentials: "아이디 또는 비밀번호를 잊으셨나요?",
    noAccount: "계정이 없으신가요?",
    signupHere: "여기서 가입하세요",
    googleLoginFailed: "Google 로그인에 실패했습니다. 다시 시도해주세요.",
    invalidResponse: "서버로부터 유효하지 않은 응답"
  };
  
  // 아랍어 번역에 추가
  arTranslations.login = {
    emailPlaceholder: "البريد الإلكتروني",
    passwordPlaceholder: "كلمة المرور",
    or: "أو",
    signInWithGoogle: "تسجيل الدخول باستخدام Google",
    forgotCredentials: "نسيت اسم المستخدم أو كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    signupHere: "سجل هنا",
    googleLoginFailed: "فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.",
    invalidResponse: "استجابة غير صالحة من الخادم"
  };
  
  // 인도네시아어 번역에 추가
  idTranslations.login = {
    emailPlaceholder: "Email",
    passwordPlaceholder: "Kata Sandi",
    or: "ATAU",
    signInWithGoogle: "Masuk dengan Google",
    forgotCredentials: "Lupa nama pengguna atau kata sandi?",
    noAccount: "Belum punya akun?",
    signupHere: "Daftar di sini",
    googleLoginFailed: "Gagal masuk dengan Google. Silakan coba lagi.",
    invalidResponse: "Respons tidak valid dari server"
  };
  
  // 말레이시아어 번역에 추가
  msTranslations.login = {
    emailPlaceholder: "E-mel",
    passwordPlaceholder: "Kata Laluan",
    or: "ATAU",
    signInWithGoogle: "Log Masuk dengan Google",
    forgotCredentials: "Lupa nama pengguna atau kata laluan?",
    noAccount: "Belum mempunyai akaun?",
    signupHere: "Daftar di sini",
    googleLoginFailed: "Log masuk dengan Google gagal. Sila cuba lagi.",
    invalidResponse: "Respons tidak sah dari pelayan"
  };
  
  // 태국어 번역에 추가
  thTranslations.login = {
    emailPlaceholder: "อีเมล",
    passwordPlaceholder: "รหัสผ่าน",
    or: "หรือ",
    signInWithGoogle: "เข้าสู่ระบบด้วย Google",
    forgotCredentials: "ลืมชื่อผู้ใช้หรือรหัสผ่าน?",
    noAccount: "ยังไม่มีบัญชี?",
    signupHere: "ลงทะเบียนที่นี่",
    googleLoginFailed: "การเข้าสู่ระบบด้วย Google ล้มเหลว โปรดลองอีกครั้ง",
    invalidResponse: "การตอบสนองที่ไม่ถูกต้องจากเซิร์ฟเวอร์"
  };
  
  // 스페인어 번역에 추가
  esTranslations.login = {
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    or: "O",
    signInWithGoogle: "Iniciar sesión con Google",
    forgotCredentials: "¿Olvidó su nombre de usuario o contraseña?",
    noAccount: "¿No tiene una cuenta?",
    signupHere: "Regístrese aquí",
    googleLoginFailed: "Error al iniciar sesión con Google. Por favor, inténtelo de nuevo.",
    invalidResponse: "Respuesta inválida del servidor"
  };
  
  // 포르투갈어(브라질) 번역에 추가
  ptBrTranslations.login = {
    emailPlaceholder: "Email",
    passwordPlaceholder: "Senha",
    or: "OU",
    signInWithGoogle: "Entrar com Google",
    forgotCredentials: "Esqueceu o nome de usuário ou senha?",
    noAccount: "Não tem uma conta?",
    signupHere: "Cadastre-se aqui",
    googleLoginFailed: "Falha ao entrar com Google. Por favor, tente novamente.",
    invalidResponse: "Resposta inválida do servidor"
  };

  // 영어 번역에 추가
enTranslations.signup = {
    usernamePlaceholder: "Username (3-20 characters)",
    confirmPasswordPlaceholder: "Confirm password",
    emailAvailable: "Email is available",
    emailInUse: "Email is already in use",
    emailInvalid: "Please enter a valid email address",
    emailCheckNeeded: "Please verify email availability",
    usernameInvalid: "Username must be 3-20 characters (letters, numbers, Korean characters only)",
    passwordMatch: "Passwords match",
    passwordMismatch: "Passwords do not match",
    password: {
      length: "❌ At least 8 characters",
      lengthValid: "✅ At least 8 characters",
      lowercase: "❌ At least one lowercase letter",
      lowercaseValid: "✅ At least one lowercase letter",
      uppercase: "❌ At least one uppercase letter",
      uppercaseValid: "✅ At least one uppercase letter",
      number: "❌ At least one number",
      numberValid: "✅ At least one number",
      special: "❌ At least one special character",
      specialValid: "✅ At least one special character"
    },
    checking: "Checking...",
    checked: "Verified",
    check: "Verify",
    fillAllFields: "Please fill all fields correctly",
    registrationError: "Registration failed. Please try again.",
    success: "Registration Successful!",
    redirectingToVerification: "Redirecting to email verification...",
    signUpWithGoogle: "Sign up with Google",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here"
  };
  
  // 한국어 번역에 추가
  koTranslations.signup = {
    usernamePlaceholder: "사용자명 (3-20자)",
    confirmPasswordPlaceholder: "비밀번호 확인",
    emailAvailable: "사용 가능한 이메일입니다",
    emailInUse: "이미 사용 중인 이메일입니다",
    emailInvalid: "유효한 이메일 주소를 입력해주세요",
    emailCheckNeeded: "이메일 중복 확인이 필요합니다",
    usernameInvalid: "사용자명은 3-20자(영문, 숫자, 한글만 가능)여야 합니다",
    passwordMatch: "비밀번호가 일치합니다",
    passwordMismatch: "비밀번호가 일치하지 않습니다",
    password: {
      length: "❌ 최소 8자 이상",
      lengthValid: "✅ 최소 8자 이상",
      lowercase: "❌ 최소 1개의 소문자",
      lowercaseValid: "✅ 최소 1개의 소문자",
      uppercase: "❌ 최소 1개의 대문자",
      uppercaseValid: "✅ 최소 1개의 대문자",
      number: "❌ 최소 1개의 숫자",
      numberValid: "✅ 최소 1개의 숫자",
      special: "❌ 최소 1개의 특수문자",
      specialValid: "✅ 최소 1개의 특수문자"
    },
    checking: "확인 중...",
    checked: "확인됨",
    check: "확인",
    fillAllFields: "모든 필드를 올바르게 입력해주세요",
    registrationError: "등록에 실패했습니다. 다시 시도해주세요.",
    success: "등록 성공!",
    redirectingToVerification: "이메일 인증 페이지로 이동 중...",
    signUpWithGoogle: "Google로 가입하기",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    loginHere: "여기서 로그인하세요"
  };
  
  // 아랍어 번역에 추가
  arTranslations.signup = {
    usernamePlaceholder: "اسم المستخدم (3-20 حرفًا)",
    confirmPasswordPlaceholder: "تأكيد كلمة المرور",
    emailAvailable: "البريد الإلكتروني متاح",
    emailInUse: "البريد الإلكتروني قيد الاستخدام بالفعل",
    emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صالح",
    emailCheckNeeded: "يرجى التحقق من توفر البريد الإلكتروني",
    usernameInvalid: "يجب أن يكون اسم المستخدم 3-20 حرفًا (أحرف، أرقام فقط)",
    passwordMatch: "كلمات المرور متطابقة",
    passwordMismatch: "كلمات المرور غير متطابقة",
    password: {
      length: "❌ 8 أحرف على الأقل",
      lengthValid: "✅ 8 أحرف على الأقل",
      lowercase: "❌ حرف صغير واحد على الأقل",
      lowercaseValid: "✅ حرف صغير واحد على الأقل",
      uppercase: "❌ حرف كبير واحد على الأقل",
      uppercaseValid: "✅ حرف كبير واحد على الأقل",
      number: "❌ رقم واحد على الأقل",
      numberValid: "✅ رقم واحد على الأقل",
      special: "❌ رمز خاص واحد على الأقل",
      specialValid: "✅ رمز خاص واحد على الأقل"
    },
    checking: "جاري التحقق...",
    checked: "تم التحقق",
    check: "تحقق",
    fillAllFields: "يرجى ملء جميع الحقول بشكل صحيح",
    registrationError: "فشل التسجيل. يرجى المحاولة مرة أخرى.",
    success: "تم التسجيل بنجاح!",
    redirectingToVerification: "جاري التحويل إلى التحقق من البريد الإلكتروني...",
    signUpWithGoogle: "التسجيل باستخدام Google",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    loginHere: "تسجيل الدخول هنا"
  };
  
  // 인도네시아어 번역에 추가
  idTranslations.signup = {
    usernamePlaceholder: "Nama pengguna (3-20 karakter)",
    confirmPasswordPlaceholder: "Konfirmasi kata sandi",
    emailAvailable: "Email tersedia",
    emailInUse: "Email sudah digunakan",
    emailInvalid: "Silakan masukkan alamat email yang valid",
    emailCheckNeeded: "Silakan verifikasi ketersediaan email",
    usernameInvalid: "Nama pengguna harus 3-20 karakter (huruf, angka saja)",
    passwordMatch: "Kata sandi cocok",
    passwordMismatch: "Kata sandi tidak cocok",
    password: {
      length: "❌ Minimal 8 karakter",
      lengthValid: "✅ Minimal 8 karakter",
      lowercase: "❌ Minimal satu huruf kecil",
      lowercaseValid: "✅ Minimal satu huruf kecil",
      uppercase: "❌ Minimal satu huruf besar",
      uppercaseValid: "✅ Minimal satu huruf besar",
      number: "❌ Minimal satu angka",
      numberValid: "✅ Minimal satu angka",
      special: "❌ Minimal satu karakter khusus",
      specialValid: "✅ Minimal satu karakter khusus"
    },
    checking: "Memeriksa...",
    checked: "Terverifikasi",
    check: "Verifikasi",
    fillAllFields: "Silakan isi semua kolom dengan benar",
    registrationError: "Pendaftaran gagal. Silakan coba lagi.",
    success: "Pendaftaran Berhasil!",
    redirectingToVerification: "Mengalihkan ke verifikasi email...",
    signUpWithGoogle: "Daftar dengan Google",
    alreadyHaveAccount: "Sudah memiliki akun?",
    loginHere: "Masuk di sini"
  };
  
  // 말레이시아어 번역에 추가
  msTranslations.signup = {
    usernamePlaceholder: "Nama pengguna (3-20 aksara)",
    confirmPasswordPlaceholder: "Sahkan kata laluan",
    emailAvailable: "E-mel tersedia",
    emailInUse: "E-mel sudah digunakan",
    emailInvalid: "Sila masukkan alamat e-mel yang sah",
    emailCheckNeeded: "Sila sahkan ketersediaan e-mel",
    usernameInvalid: "Nama pengguna mesti 3-20 aksara (huruf, nombor sahaja)",
    passwordMatch: "Kata laluan sepadan",
    passwordMismatch: "Kata laluan tidak sepadan",
    password: {
      length: "❌ Sekurang-kurangnya 8 aksara",
      lengthValid: "✅ Sekurang-kurangnya 8 aksara",
      lowercase: "❌ Sekurang-kurangnya satu huruf kecil",
      lowercaseValid: "✅ Sekurang-kurangnya satu huruf kecil",
      uppercase: "❌ Sekurang-kurangnya satu huruf besar",
      uppercaseValid: "✅ Sekurang-kurangnya satu huruf besar",
      number: "❌ Sekurang-kurangnya satu nombor",
      numberValid: "✅ Sekurang-kurangnya satu nombor",
      special: "❌ Sekurang-kurangnya satu aksara khas",
      specialValid: "✅ Sekurang-kurangnya satu aksara khas"
    },
    checking: "Memeriksa...",
    checked: "Disahkan",
    check: "Sahkan",
    fillAllFields: "Sila isi semua medan dengan betul",
    registrationError: "Pendaftaran gagal. Sila cuba lagi.",
    success: "Pendaftaran Berjaya!",
    redirectingToVerification: "Mengalihkan ke pengesahan e-mel...",
    signUpWithGoogle: "Daftar dengan Google",
    alreadyHaveAccount: "Sudah mempunyai akaun?",
    loginHere: "Log masuk di sini"
  };
  
  // 태국어 번역에 추가
  thTranslations.signup = {
    usernamePlaceholder: "ชื่อผู้ใช้ (3-20 อักขระ)",
    confirmPasswordPlaceholder: "ยืนยันรหัสผ่าน",
    emailAvailable: "อีเมลนี้สามารถใช้ได้",
    emailInUse: "อีเมลนี้ถูกใช้งานแล้ว",
    emailInvalid: "กรุณาใส่อีเมลที่ถูกต้อง",
    emailCheckNeeded: "กรุณาตรวจสอบความพร้อมใช้งานของอีเมล",
    usernameInvalid: "ชื่อผู้ใช้ต้องมี 3-20 อักขระ (ตัวอักษร, ตัวเลขเท่านั้น)",
    passwordMatch: "รหัสผ่านตรงกัน",
    passwordMismatch: "รหัสผ่านไม่ตรงกัน",
    password: {
      length: "❌ อย่างน้อย 8 อักขระ",
      lengthValid: "✅ อย่างน้อย 8 อักขระ",
      lowercase: "❌ อย่างน้อยหนึ่งตัวอักษรพิมพ์เล็ก",
      lowercaseValid: "✅ อย่างน้อยหนึ่งตัวอักษรพิมพ์เล็ก",
      uppercase: "❌ อย่างน้อยหนึ่งตัวอักษรพิมพ์ใหญ่",
      uppercaseValid: "✅ อย่างน้อยหนึ่งตัวอักษรพิมพ์ใหญ่",
      number: "❌ อย่างน้อยหนึ่งตัวเลข",
      numberValid: "✅ อย่างน้อยหนึ่งตัวเลข",
      special: "❌ อย่างน้อยหนึ่งอักขระพิเศษ",
      specialValid: "✅ อย่างน้อยหนึ่งอักขระพิเศษ"
    },
    checking: "กำลังตรวจสอบ...",
    checked: "ตรวจสอบแล้ว",
    check: "ตรวจสอบ",
    fillAllFields: "กรุณากรอกข้อมูลทุกช่องให้ถูกต้อง",
    registrationError: "การลงทะเบียนล้มเหลว กรุณาลองอีกครั้ง",
    success: "ลงทะเบียนสำเร็จ!",
    redirectingToVerification: "กำลังเปลี่ยนเส้นทางไปยังการยืนยันอีเมล...",
    // 태국어 번역 계속
  signUpWithGoogle: "ลงทะเบียนด้วย Google",
  alreadyHaveAccount: "มีบัญชีอยู่แล้ว?",
  loginHere: "เข้าสู่ระบบที่นี่"
};

// 스페인어 번역에 추가
esTranslations.signup = {
  usernamePlaceholder: "Nombre de usuario (3-20 caracteres)",
  confirmPasswordPlaceholder: "Confirmar contraseña",
  emailAvailable: "Email disponible",
  emailInUse: "Email ya está en uso",
  emailInvalid: "Por favor ingrese un email válido",
  emailCheckNeeded: "Por favor verifique la disponibilidad del email",
  usernameInvalid: "El nombre de usuario debe tener 3-20 caracteres (solo letras y números)",
  passwordMatch: "Las contraseñas coinciden",
  passwordMismatch: "Las contraseñas no coinciden",
  password: {
    length: "❌ Al menos 8 caracteres",
    lengthValid: "✅ Al menos 8 caracteres",
    lowercase: "❌ Al menos una letra minúscula",
    lowercaseValid: "✅ Al menos una letra minúscula",
    uppercase: "❌ Al menos una letra mayúscula",
    uppercaseValid: "✅ Al menos una letra mayúscula",
    number: "❌ Al menos un número",
    numberValid: "✅ Al menos un número",
    special: "❌ Al menos un carácter especial",
    specialValid: "✅ Al menos un carácter especial"
  },
  checking: "Verificando...",
  checked: "Verificado",
  check: "Verificar",
  fillAllFields: "Por favor complete todos los campos correctamente",
  registrationError: "Registro fallido. Por favor intente de nuevo.",
  success: "¡Registro exitoso!",
  redirectingToVerification: "Redirigiendo a verificación de email...",
  signUpWithGoogle: "Registrarse con Google",
  alreadyHaveAccount: "¿Ya tiene una cuenta?",
  loginHere: "Inicie sesión aquí"
};

// 포르투갈어(브라질) 번역에 추가
ptBrTranslations.signup = {
  usernamePlaceholder: "Nome de usuário (3-20 caracteres)",
  confirmPasswordPlaceholder: "Confirmar senha",
  emailAvailable: "Email disponível",
  emailInUse: "Email já está em uso",
  emailInvalid: "Por favor, insira um email válido",
  emailCheckNeeded: "Por favor, verifique a disponibilidade do email",
  usernameInvalid: "O nome de usuário deve ter 3-20 caracteres (apenas letras e números)",
  passwordMatch: "As senhas coincidem",
  passwordMismatch: "As senhas não coincidem",
  password: {
    length: "❌ Pelo menos 8 caracteres",
    lengthValid: "✅ Pelo menos 8 caracteres",
    lowercase: "❌ Pelo menos uma letra minúscula",
    lowercaseValid: "✅ Pelo menos uma letra minúscula",
    uppercase: "❌ Pelo menos uma letra maiúscula",
    uppercaseValid: "✅ Pelo menos uma letra maiúscula",
    number: "❌ Pelo menos um número",
    numberValid: "✅ Pelo menos um número",
    special: "❌ Pelo menos um caractere especial",
    specialValid: "✅ Pelo menos um caractere especial"
  },
  checking: "Verificando...",
  checked: "Verificado",
  check: "Verificar",
  fillAllFields: "Por favor, preencha todos os campos corretamente",
  registrationError: "Falha no registro. Por favor, tente novamente.",
  success: "Registro bem-sucedido!",
  redirectingToVerification: "Redirecionando para verificação de email...",
  signUpWithGoogle: "Cadastre-se com Google",
  alreadyHaveAccount: "Já tem uma conta?",
  loginHere: "Entre aqui"
};

// 약관 관련 다국어 번역 추가
// 영어 번역 약관 수정
enTranslations.agreements = {
    title: 'Sign Up',
    allAgree: 'I agree to all',
    termsOfUse: {
      title: '(Required) Terms of Use',
      header: 'Terms of Use',
      content: 'Article 1 (Purpose)\nThese terms and conditions aim to define the conditions of use, procedures, rights, obligations, responsibilities, and other necessary matters between the company and members regarding the services provided by LingEdge (hereinafter referred to as the "Company").\n\nArticle 2 (Definition of Terms)\n1. "Service" refers to all services provided by the company.\n2. "Member" refers to a person who has registered as a member by providing personal information to the company, continuously receives information from the company, and can continuously use the services provided by the company.\n\nArticle 3 (Effectiveness and Change of Terms)\n1. The company posts the contents of these terms and conditions on the initial screen of the service so that members can easily know them.\n2. If necessary, the company may revise these terms and conditions to the extent that they do not violate relevant laws.'
    },
    privacyPolicy: {
      title: '(Required) Privacy Policy Agreement',
      header: 'Privacy Policy Agreement',
      content: '1. Personal Information Items Collected\n- When signing up: email address, password, name (nickname)\n- When using social login: email address, name (nickname)\n- Information automatically generated and collected during service use: IP address, cookies, service usage records, device information\n\n2. Purpose of Collecting and Using Personal Information\n- Providing services and account management\n- Improving services and developing new services\n- Member management and identity verification\n- Handling complaints and inquiries\n\n3. Retention and Usage Period of Personal Information\n- Until membership withdrawal or retention period according to laws'
    },
    marketingAgree: {
      title: '(Optional) Marketing Information Receipt Agreement',
      header: 'Marketing Information Receipt Agreement',
      content: '1. Agreeing to receive marketing information is optional.\n2. If you agree, you can receive various news such as new features, events, and discount information.\n3. Marketing information is sent via email.\n4. You can change your agreement to receive marketing information at any time on the member information editing page.'
    },
    continueButton: 'Continue with Regular Sign Up',
    googleButton: 'Start with Google',
    requiredAgreement: 'You must agree to the required terms.',
    checking: 'Checking...',
    checked: 'Verified',
    check: 'Verify'
  };
  
  // 한국어 번역 약관 수정
  koTranslations.agreements = {
    title: '회원가입',
    allAgree: '전체 동의합니다',
    termsOfUse: {
      title: '(필수) 이용약관 동의',
      header: '이용약관',
      content: '제1조 (목적)\n이 약관은 LingEdge(이하 "회사"라 함)가 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n제2조 (용어의 정의)\n1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.\n2. "회원"이란 회사에 개인정보를 제공하고 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.\n\n제3조 (약관의 효력과 변경)\n1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.\n2. 회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.'
    },
    privacyPolicy: {
      title: '(필수) 개인정보 수집 및 이용 동의',
      header: '개인정보 수집 및 이용 동의',
      content: '1. 수집하는 개인정보 항목\n- 회원가입 시: 이메일 주소, 비밀번호, 이름(닉네임)\n- 소셜 로그인 시: 이메일 주소, 이름(닉네임)\n- 서비스 이용 과정에서 자동으로 생성되어 수집되는 정보: IP 주소, 쿠키, 서비스 이용 기록, 기기정보\n\n2. 개인정보의 수집 및 이용 목적\n- 서비스 제공 및 계정 관리\n- 서비스 개선 및 신규 서비스 개발\n- 회원 관리 및 본인 확인\n- 불만 처리 등 민원 처리\n\n3. 개인정보의 보유 및 이용 기간\n- 회원 탈퇴 시까지 또는 법령에 따른 보존기간'
    },
    marketingAgree: {
      title: '(선택) 마케팅 정보 수신 동의',
      header: '마케팅 정보 수신 동의',
      content: '1. 마케팅 정보 수신 동의는 선택사항입니다.\n2. 동의하시면 신규 기능, 이벤트, 할인 정보 등 다양한 소식을 받아보실 수 있습니다.\n3. 마케팅 정보는 이메일을 통해 전송됩니다.\n4. 마케팅 정보 수신 동의는 회원 정보 수정 페이지에서 언제든지 변경하실 수 있습니다.'
    },
    continueButton: '일반 회원가입으로 진행',
    googleButton: '구글로 시작하기',
    requiredAgreement: '필수 약관에 동의해야 합니다.',
    checking: '확인 중...',
    checked: '확인됨',
    check: '확인'
  };
  
  // 아랍어 번역 약관 수정
  arTranslations.agreements = {
    title: 'التسجيل',
    allAgree: 'أوافق على الكل',
    termsOfUse: {
      title: '(مطلوب) الموافقة على شروط الاستخدام',
      header: 'شروط الاستخدام',
      content: 'المادة 1 (الغرض)\nتهدف هذه الشروط والأحكام إلى تحديد شروط الاستخدام والإجراءات والحقوق والالتزامات والمسؤوليات وغيرها من المسائل الضرورية بين الشركة والأعضاء فيما يتعلق بالخدمات التي تقدمها LingEdge (المشار إليها فيما يلي باسم "الشركة").\n\nالمادة 2 (تعريف المصطلحات)\n1. "الخدمة" تشير إلى جميع الخدمات التي تقدمها الشركة.\n2. "العضو" يشير إلى الشخص الذي سجل كعضو من خلال تقديم معلومات شخصية للشركة، ويتلقى باستمرار معلومات من الشركة، ويمكنه استخدام الخدمات التي تقدمها الشركة باستمرار.\n\nالمادة 3 (فعالية وتغيير الشروط)\n1. تنشر الشركة محتويات هذه الشروط والأحكام على الشاشة الأولية للخدمة حتى يتمكن الأعضاء من معرفتها بسهولة.\n2. إذا لزم الأمر، يجوز للشركة مراجعة هذه الشروط والأحكام إلى الحد الذي لا تنتهك فيه القوانين ذات الصلة.'
    },
    privacyPolicy: {
      title: '(مطلوب) الموافقة على سياسة الخصوصية',
      header: 'الموافقة على سياسة الخصوصية',
      content: '1. عناصر المعلومات الشخصية التي يتم جمعها\n- عند التسجيل: عنوان البريد الإلكتروني، كلمة المرور، الاسم (الاسم المستعار)\n- عند استخدام تسجيل الدخول الاجتماعي: عنوان البريد الإلكتروني، الاسم (الاسم المستعار)\n- المعلومات التي يتم إنشاؤها وجمعها تلقائيًا أثناء استخدام الخدمة: عنوان IP، ملفات تعريف الارتباط، سجلات استخدام الخدمة، معلومات الجهاز\n\n2. الغرض من جمع واستخدام المعلومات الشخصية\n- تقديم الخدمات وإدارة الحساب\n- تحسين الخدمات وتطوير خدمات جديدة\n- إدارة الأعضاء والتحقق من الهوية\n- التعامل مع الشكاوى والاستفسارات\n\n3. فترة الاحتفاظ بالمعلومات الشخصية واستخدامها\n- حتى انسحاب العضوية أو فترة الاحتفاظ وفقًا للقوانين'
    },
    marketingAgree: {
      title: '(اختياري) الموافقة على استلام معلومات تسويقية',
      header: 'الموافقة على استلام معلومات تسويقية',
      content: '1. الموافقة على استلام المعلومات التسويقية اختيارية.\n2. إذا وافقت، يمكنك استلام أخبار متنوعة مثل الميزات الجديدة والأحداث ومعلومات الخصم.\n3. يتم إرسال المعلومات التسويقية عبر البريد الإلكتروني.\n4. يمكنك تغيير موافقتك على استلام المعلومات التسويقية في أي وقت على صفحة تحرير معلومات العضو.'
    },
    continueButton: 'المتابعة بالتسجيل العادي',
    googleButton: 'البدء باستخدام جوجل',
    requiredAgreement: 'يجب عليك الموافقة على الشروط المطلوبة.',
    checking: 'جاري التحقق...',
    checked: 'تم التحقق',
    check: 'تحقق'
  };
  
  // 인도네시아어 번역 약관 수정
  idTranslations.agreements = {
    title: 'Pendaftaran',
    allAgree: 'Saya setuju dengan semua',
    termsOfUse: {
      title: '(Wajib) Menyetujui Syarat Penggunaan',
      header: 'Syarat Penggunaan',
      content: 'Pasal 1 (Tujuan)\nSyarat dan ketentuan ini bertujuan untuk menentukan kondisi penggunaan, prosedur, hak, kewajiban, tanggung jawab, dan hal-hal lain yang diperlukan antara perusahaan dan anggota mengenai layanan yang disediakan oleh LingEdge (selanjutnya disebut "Perusahaan").\n\nPasal 2 (Definisi Istilah)\n1. "Layanan" mengacu pada semua layanan yang disediakan oleh perusahaan.\n2. "Anggota" mengacu pada seseorang yang telah mendaftar sebagai anggota dengan memberikan informasi pribadi kepada perusahaan, terus menerima informasi dari perusahaan, dan dapat terus menggunakan layanan yang disediakan oleh perusahaan.\n\nPasal 3 (Efektivitas dan Perubahan Syarat)\n1. Perusahaan memposting isi syarat dan ketentuan ini pada layar awal layanan sehingga anggota dapat dengan mudah mengetahuinya.\n2. Jika diperlukan, perusahaan dapat merevisi syarat dan ketentuan ini sejauh tidak melanggar undang-undang terkait.'
    },
    privacyPolicy: {
      title: '(Wajib) Persetujuan Kebijakan Privasi',
      header: 'Persetujuan Kebijakan Privasi',
      content: '1. Item Informasi Pribadi yang Dikumpulkan\n- Saat mendaftar: alamat email, kata sandi, nama (nama panggilan)\n- Saat menggunakan login sosial: alamat email, nama (nama panggilan)\n- Informasi yang secara otomatis dihasilkan dan dikumpulkan selama penggunaan layanan: alamat IP, cookie, catatan penggunaan layanan, informasi perangkat\n\n2. Tujuan Pengumpulan dan Penggunaan Informasi Pribadi\n- Penyediaan layanan dan pengelolaan akun\n- Meningkatkan layanan dan mengembangkan layanan baru\n- Pengelolaan anggota dan verifikasi identitas\n- Penanganan keluhan dan pertanyaan\n\n3. Periode Retensi dan Penggunaan Informasi Pribadi\n- Sampai penarikan keanggotaan atau periode retensi menurut undang-undang'
    },
    marketingAgree: {
      title: '(Opsional) Persetujuan Penerimaan Informasi Pemasaran',
      header: 'Persetujuan Penerimaan Informasi Pemasaran',
      content: '1. Menyetujui untuk menerima informasi pemasaran adalah opsional.\n2. Jika Anda setuju, Anda dapat menerima berbagai berita seperti fitur baru, acara, dan informasi diskon.\n3. Informasi pemasaran dikirim melalui email.\n4. Anda dapat mengubah persetujuan Anda untuk menerima informasi pemasaran kapan saja di halaman pengeditan informasi anggota.'
    },
    continueButton: 'Lanjutkan dengan Pendaftaran Biasa',
    googleButton: 'Mulai dengan Google',
    requiredAgreement: 'Anda harus menyetujui syarat yang diperlukan.',
    checking: 'Memeriksa...',
    checked: 'Terverifikasi',
    check: 'Verifikasi'
  };
  
  // 말레이시아어 번역 약관 수정
  msTranslations.agreements = {
    title: 'Pendaftaran',
    allAgree: 'Saya bersetuju dengan semua',
    termsOfUse: {
      title: '(Diperlukan) Persetujuan Terma Penggunaan',
      header: 'Terma Penggunaan',
      content: 'Artikel 1 (Tujuan)\nTerma dan syarat ini bertujuan untuk menentukan syarat penggunaan, prosedur, hak, kewajipan, tanggungjawab, dan perkara lain yang diperlukan antara syarikat dan ahli berkenaan perkhidmatan yang disediakan oleh LingEdge (selepas ini dirujuk sebagai "Syarikat").\n\nArtikel 2 (Definisi Istilah)\n1. "Perkhidmatan" merujuk kepada semua perkhidmatan yang disediakan oleh syarikat.\n2. "Ahli" merujuk kepada seseorang yang telah mendaftar sebagai ahli dengan memberikan maklumat peribadi kepada syarikat, terus menerima maklumat daripada syarikat, dan boleh terus menggunakan perkhidmatan yang disediakan oleh syarikat.\n\nArtikel 3 (Keberkesanan dan Perubahan Terma)\n1. Syarikat menyiarkan kandungan terma dan syarat ini pada skrin awal perkhidmatan supaya ahli dapat mengetahuinya dengan mudah.\n2. Jika perlu, syarikat boleh menyemak terma dan syarat ini setakat tidak melanggar undang-undang berkaitan.'
    },
    privacyPolicy: {
      title: '(Diperlukan) Persetujuan Dasar Privasi',
      header: 'Persetujuan Dasar Privasi',
      content: '1. Item Maklumat Peribadi yang Dikumpulkan\n- Semasa mendaftar: alamat e-mel, kata laluan, nama (nama samaran)\n- Semasa menggunakan log masuk sosial: alamat e-mel, nama (nama samaran)\n- Maklumat yang dihasilkan dan dikumpulkan secara automatik semasa penggunaan perkhidmatan: alamat IP, kuki, rekod penggunaan perkhidmatan, maklumat peranti\n\n2. Tujuan Pengumpulan dan Penggunaan Maklumat Peribadi\n- Penyediaan perkhidmatan dan pengurusan akaun\n- Menambah baik perkhidmatan dan membangunkan perkhidmatan baharu\n- Pengurusan ahli dan pengesahan identiti\n- Menangani aduan dan pertanyaan\n\n3. Tempoh Pengekalan dan Penggunaan Maklumat Peribadi\n- Sehingga penarikan keahlian atau tempoh pengekalan mengikut undang-undang'
    },
    marketingAgree: {
      title: '(Pilihan) Persetujuan Penerimaan Maklumat Pemasaran',
      header: 'Persetujuan Penerimaan Maklumat Pemasaran',
      content: '1. Bersetuju untuk menerima maklumat pemasaran adalah pilihan.\n2. Jika anda bersetuju, anda boleh menerima pelbagai berita seperti ciri baharu, acara, dan maklumat diskaun.\n3. Maklumat pemasaran dihantar melalui e-mel.\n4. Anda boleh mengubah persetujuan anda untuk menerima maklumat pemasaran pada bila-bila masa di halaman pengeditan maklumat ahli.'
    },
    continueButton: 'Teruskan dengan Pendaftaran Biasa',
    googleButton: 'Mulakan dengan Google',
    requiredAgreement: 'Anda mesti bersetuju dengan terma yang diperlukan.',
    checking: 'Memeriksa...',
    checked: 'Disahkan',
    check: 'Sahkan'
  };
  
  // 태국어 번역 약관 수정 (계속)
thTranslations.agreements = {
    title: 'ลงทะเบียน',
    allAgree: 'ฉันยอมรับทั้งหมด',
    termsOfUse: {
      title: '(จำเป็น) ยอมรับข้อกำหนดการใช้งาน',
      header: 'ข้อกำหนดการใช้งาน',
      content: 'มาตรา 1 (วัตถุประสงค์)\nข้อกำหนดและเงื่อนไขเหล่านี้มีวัตถุประสงค์เพื่อกำหนดเงื่อนไขการใช้งาน ขั้นตอน สิทธิ หน้าที่ ความรับผิดชอบ และเรื่องอื่นๆ ที่จำเป็นระหว่างบริษัทและสมาชิกเกี่ยวกับบริการที่จัดให้โดย LingEdge (ต่อไปนี้เรียกว่า "บริษัท")\n\nมาตรา 2 (คำจำกัดความของคำศัพท์)\n1. "บริการ" หมายถึงบริการทั้งหมดที่บริษัทจัดให้\n2. "สมาชิก" หมายถึงบุคคลที่ลงทะเบียนเป็นสมาชิกโดยให้ข้อมูลส่วนบุคคลแก่บริษัท รับข้อมูลจากบริษัทอย่างต่อเนื่อง และสามารถใช้บริการที่บริษัทจัดให้อย่างต่อเนื่อง\n\nมาตรา 3 (ประสิทธิภาพและการเปลี่ยนแปลงข้อกำหนด)\n1. บริษัทจะแสดงเนื้อหาของข้อกำหนดและเงื่อนไขเหล่านี้บนหน้าจอเริ่มต้นของบริการเพื่อให้สมาชิกสามารถทราบได้ง่าย\n2. หากจำเป็น บริษัทอาจแก้ไขข้อกำหนดและเงื่อนไขเหล่านี้เท่าที่ไม่ละเมิดกฎหมายที่เกี่ยวข้อง'
    },
    privacyPolicy: {
      title: '(จำเป็น) ข้อตกลงนโยบายความเป็นส่วนตัว',
      header: 'ข้อตกลงนโยบายความเป็นส่วนตัว',
      content: '1. รายการข้อมูลส่วนบุคคลที่เก็บรวบรวม\n- เมื่อลงทะเบียน: ที่อยู่อีเมล, รหัสผ่าน, ชื่อ (ชื่อเล่น)\n- เมื่อใช้การเข้าสู่ระบบทางสังคม: ที่อยู่อีเมล, ชื่อ (ชื่อเล่น)\n- ข้อมูลที่สร้างขึ้นและรวบรวมโดยอัตโนมัติระหว่างการใช้บริการ: ที่อยู่ IP, คุกกี้, บันทึกการใช้บริการ, ข้อมูลอุปกรณ์\n\n2. วัตถุประสงค์ของการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคล\n- การให้บริการและการจัดการบัญชี\n- การปรับปรุงบริการและพัฒนาบริการใหม่\n- การจัดการสมาชิกและการยืนยันตัวตน\n- การจัดการข้อร้องเรียนและข้อสงสัย\n\n3. ระยะเวลาการเก็บรักษาและการใช้ข้อมูลส่วนบุคคล\n- จนกว่าจะถอนสมาชิกหรือระยะเวลาการเก็บรักษาตามกฎหมาย'
    },
    marketingAgree: {
      title: '(ทางเลือก) ข้อตกลงการรับข้อมูลทางการตลาด',
      header: 'ข้อตกลงการรับข้อมูลทางการตลาด',
      content: '1. การยินยอมรับข้อมูลทางการตลาดเป็นทางเลือก\n2. หากคุณยินยอม คุณสามารถรับข่าวสารต่างๆ เช่น คุณสมบัติใหม่ กิจกรรม และข้อมูลส่วนลด\n3. ข้อมูลทางการตลาดจะส่งทางอีเมล\n4. คุณสามารถเปลี่ยนแปลงการยินยอมรับข้อมูลทางการตลาดได้ตลอดเวลาในหน้าแก้ไขข้อมูลสมาชิก'
    },
    continueButton: 'ดำเนินการต่อด้วยการลงทะเบียนปกติ',
    googleButton: 'เริ่มต้นด้วย Google',
    requiredAgreement: 'คุณต้องยอมรับข้อกำหนดที่จำเป็น',
    checking: 'กำลังตรวจสอบ...',
    checked: 'ตรวจสอบแล้ว',
    check: 'ตรวจสอบ'
  };
  
  // 스페인어 번역 약관 수정
  esTranslations.agreements = {
    title: 'Registro',
    allAgree: 'Acepto todo',
    termsOfUse: {
      title: '(Obligatorio) Aceptar Términos de Uso',
      header: 'Términos de Uso',
      content: 'Artículo 1 (Propósito)\nEstos términos y condiciones tienen como objetivo definir las condiciones de uso, procedimientos, derechos, obligaciones, responsabilidades y otros asuntos necesarios entre la empresa y los miembros con respecto a los servicios proporcionados por LingEdge (en adelante denominada la "Empresa").\n\nArtículo 2 (Definición de Términos)\n1. "Servicio" se refiere a todos los servicios proporcionados por la empresa.\n2. "Miembro" se refiere a una persona que se ha registrado como miembro proporcionando información personal a la empresa, recibe continuamente información de la empresa y puede utilizar continuamente los servicios proporcionados por la empresa.\n\nArtículo 3 (Efectividad y Cambio de Términos)\n1. La empresa publica el contenido de estos términos y condiciones en la pantalla inicial del servicio para que los miembros puedan conocerlos fácilmente.\n2. Si es necesario, la empresa puede revisar estos términos y condiciones en la medida en que no violen las leyes relevantes.'
    },
    privacyPolicy: {
      title: '(Obligatorio) Acuerdo de Política de Privacidad',
      header: 'Acuerdo de Política de Privacidad',
      content: '1. Elementos de Información Personal Recopilados\n- Al registrarse: dirección de correo electrónico, contraseña, nombre (apodo)\n- Al utilizar inicio de sesión social: dirección de correo electrónico, nombre (apodo)\n- Información generada automáticamente y recopilada durante el uso del servicio: dirección IP, cookies, registros de uso del servicio, información del dispositivo\n\n2. Propósito de Recopilar y Utilizar Información Personal\n- Proporcionar servicios y gestión de cuentas\n- Mejorar servicios y desarrollar nuevos servicios\n- Gestión de miembros y verificación de identidad\n- Manejo de quejas y consultas\n\n3. Período de Retención y Uso de Información Personal\n- Hasta la retirada de la membresía o período de retención de acuerdo con las leyes'
    },
    marketingAgree: {
      title: '(Opcional) Acuerdo de Recepción de Información de Marketing',
      header: 'Acuerdo de Recepción de Información de Marketing',
      content: '1. Aceptar recibir información de marketing es opcional.\n2. Si acepta, puede recibir diversas noticias como nuevas funciones, eventos e información de descuentos.\n3. La información de marketing se envía por correo electrónico.\n4. Puede cambiar su consentimiento para recibir información de marketing en cualquier momento en la página de edición de información de miembro.'
    },
    continueButton: 'Continuar con Registro Regular',
    googleButton: 'Comenzar con Google',
    requiredAgreement: 'Debe aceptar los términos obligatorios.',
    checking: 'Verificando...',
    checked: 'Verificado',
    check: 'Verificar'
  };
  
  // 포르투갈어(브라질) 번역 약관 수정
  ptBrTranslations.agreements = {
    title: 'Cadastro',
    allAgree: 'Concordo com tudo',
    termsOfUse: {
      title: '(Obrigatório) Concordar com os Termos de Uso',
      header: 'Termos de Uso',
      content: 'Artigo 1 (Objetivo)\nEstes termos e condições têm como objetivo definir as condições de uso, procedimentos, direitos, obrigações, responsabilidades e outros assuntos necessários entre a empresa e os membros em relação aos serviços fornecidos pela LingEdge (doravante denominada "Empresa").\n\nArtigo 2 (Definição de Termos)\n1. "Serviço" refere-se a todos os serviços fornecidos pela empresa.\n2. "Membro" refere-se a uma pessoa que se registrou como membro fornecendo informações pessoais à empresa, recebe continuamente informações da empresa e pode usar continuamente os serviços fornecidos pela empresa.\n\nArtigo 3 (Eficácia e Alteração dos Termos)\n1. A empresa publica o conteúdo destes termos e condições na tela inicial do serviço para que os membros possam conhecê-los facilmente.\n2. Se necessário, a empresa pode revisar estes termos e condições na medida em que não violem as leis relevantes.'
    },
    privacyPolicy: {
      title: '(Obrigatório) Acordo de Política de Privacidade',
      header: 'Acordo de Política de Privacidade',
      content: '1. Itens de Informações Pessoais Coletados\n- Ao se cadastrar: endereço de e-mail, senha, nome (apelido)\n- Ao usar login social: endereço de e-mail, nome (apelido)\n- Informações geradas automaticamente e coletadas durante o uso do serviço: endereço IP, cookies, registros de uso do serviço, informações do dispositivo\n\n2. Objetivo da Coleta e Uso de Informações Pessoais\n- Fornecimento de serviços e gerenciamento de contas\n- Melhoria de serviços e desenvolvimento de novos serviços\n- Gerenciamento de membros e verificação de identidade\n- Lidar com reclamações e consultas\n\n3. Período de Retenção e Uso de Informações Pessoais\n- Até a retirada da associação ou período de retenção de acordo com as leis'
    },
    marketingAgree: {
      title: '(Opcional) Acordo de Recebimento de Informações de Marketing',
      header: 'Acordo de Recebimento de Informações de Marketing',
      content: '1. Concordar em receber informações de marketing é opcional.\n2. Se você concordar, poderá receber várias notícias, como novos recursos, eventos e informações de desconto.\n3. As informações de marketing são enviadas por e-mail.\n4. Você pode alterar seu consentimento para receber informações de marketing a qualquer momento na página de edição de informações de membro.'
    },
    continueButton: 'Continuar com Cadastro Regular',
    googleButton: 'Começar com Google',
    requiredAgreement: 'Você deve concordar com os termos obrigatórios.',
    checking: 'Verificando...',
    checked: 'Verificado',
    check: 'Verificar'
  };

  // 영어 번역
enTranslations.signup.backToAgreements = 'Back to Terms of Agreement';

// 한국어 번역
koTranslations.signup.backToAgreements = '약관 동의 단계로 돌아가기';

// 아랍어 번역
arTranslations.signup.backToAgreements = 'العودة إلى شروط الاتفاقية';

// 인도네시아어 번역
idTranslations.signup.backToAgreements = 'Kembali ke Persyaratan Perjanjian';

// 말레이시아어 번역
msTranslations.signup.backToAgreements = 'Kembali ke Terma Perjanjian';

// 태국어 번역
thTranslations.signup.backToAgreements = 'กลับไปที่ข้อตกลงและเงื่อนไข';

// 스페인어 번역
esTranslations.signup.backToAgreements = 'Volver a Términos de Acuerdo';

// 포르투갈어(브라질) 번역
ptBrTranslations.signup.backToAgreements = 'Voltar para Termos de Acordo';


// 영어 번역 추가
enTranslations.signup.selectMethod = 'Choose Sign Up Method';
enTranslations.signup.selectMethodDescription = 'Please select how you would like to create your account';
enTranslations.signup.regularSignUp = 'Sign Up with Email';
enTranslations.signup.googleSignUp = 'Sign Up with Google';
enTranslations.agreements.googleEmail = 'Google Account';
enTranslations.agreements.completeGoogleSignUp = 'Complete Sign Up with Google';

// 한국어 번역 추가
koTranslations.signup.selectMethod = '회원가입 방식 선택';
koTranslations.signup.selectMethodDescription = '계정을 생성할 방법을 선택해주세요';
koTranslations.signup.regularSignUp = '이메일로 회원가입';
koTranslations.signup.googleSignUp = '구글로 회원가입';
koTranslations.agreements.googleEmail = '구글 계정';
koTranslations.agreements.completeGoogleSignUp = '구글 계정으로 가입 완료하기';

// 아랍어 번역 추가
arTranslations.signup.selectMethod = 'اختر طريقة التسجيل';
arTranslations.signup.selectMethodDescription = 'يرجى تحديد كيفية إنشاء حسابك';
arTranslations.signup.regularSignUp = 'التسجيل باستخدام البريد الإلكتروني';
arTranslations.signup.googleSignUp = 'التسجيل باستخدام جوجل';
arTranslations.agreements.googleEmail = 'حساب جوجل';
arTranslations.agreements.completeGoogleSignUp = 'إكمال التسجيل باستخدام جوجل';

// 인도네시아어 번역 추가
idTranslations.signup.selectMethod = 'Pilih Metode Pendaftaran';
idTranslations.signup.selectMethodDescription = 'Silakan pilih bagaimana Anda ingin membuat akun Anda';
idTranslations.signup.regularSignUp = 'Daftar dengan Email';
idTranslations.signup.googleSignUp = 'Daftar dengan Google';
idTranslations.agreements.googleEmail = 'Akun Google';
idTranslations.agreements.completeGoogleSignUp = 'Selesaikan Pendaftaran dengan Google';

// 말레이시아어 번역 추가
msTranslations.signup.selectMethod = 'Pilih Kaedah Pendaftaran';
msTranslations.signup.selectMethodDescription = 'Sila pilih bagaimana anda ingin membuat akaun anda';
msTranslations.signup.regularSignUp = 'Daftar dengan E-mel';
msTranslations.signup.googleSignUp = 'Daftar dengan Google';
msTranslations.agreements.googleEmail = 'Akaun Google';
msTranslations.agreements.completeGoogleSignUp = 'Lengkapkan Pendaftaran dengan Google';

// 태국어 번역 추가
thTranslations.signup.selectMethod = 'เลือกวิธีการลงทะเบียน';
thTranslations.signup.selectMethodDescription = 'โปรดเลือกวิธีที่คุณต้องการสร้างบัญชีของคุณ';
thTranslations.signup.regularSignUp = 'ลงทะเบียนด้วยอีเมล';
thTranslations.signup.googleSignUp = 'ลงทะเบียนด้วย Google';
thTranslations.agreements.googleEmail = 'บัญชี Google';
thTranslations.agreements.completeGoogleSignUp = 'ลงทะเบียนด้วย Google ให้เสร็จสมบูรณ์';

// 스페인어 번역 추가
esTranslations.signup.selectMethod = 'Elija el método de registro';
esTranslations.signup.selectMethodDescription = 'Por favor, seleccione cómo le gustaría crear su cuenta';
esTranslations.signup.regularSignUp = 'Registrarse con correo electrónico';
esTranslations.signup.googleSignUp = 'Registrarse con Google';
esTranslations.agreements.googleEmail = 'Cuenta de Google';
esTranslations.agreements.completeGoogleSignUp = 'Completar registro con Google';

// 포르투갈어(브라질) 번역 추가
ptBrTranslations.signup.selectMethod = 'Escolha o método de cadastro';
ptBrTranslations.signup.selectMethodDescription = 'Por favor, selecione como você gostaria de criar sua conta';
ptBrTranslations.signup.regularSignUp = 'Cadastrar com e-mail';
ptBrTranslations.signup.googleSignUp = 'Cadastrar com Google';
ptBrTranslations.agreements.googleEmail = 'Conta Google';
ptBrTranslations.agreements.completeGoogleSignUp = 'Completar cadastro com Google';

// 영어 번역 추가
enTranslations.signup.usernameValid = 'Valid username';

// 한국어 번역 추가
koTranslations.signup.usernameValid = '유효한 사용자명입니다';

// 아랍어 번역 추가
arTranslations.signup.usernameValid = 'اسم المستخدم صالح';

// 인도네시아어 번역 추가
idTranslations.signup.usernameValid = 'Nama pengguna valid';

// 말레이시아어 번역 추가
msTranslations.signup.usernameValid = 'Nama pengguna sah';

// 태국어 번역 추가
thTranslations.signup.usernameValid = 'ชื่อผู้ใช้ถูกต้อง';

// 스페인어 번역 추가
esTranslations.signup.usernameValid = 'Nombre de usuario válido';

// 포르투갈어(브라질) 번역 추가
ptBrTranslations.signup.usernameValid = 'Nome de usuário válido';

// 영어 번역에 추가
enTranslations.common = {
  ...enTranslations.common,
  admin: 'Admin',
  inquiry: 'Inquiries'
};

// 한국어 번역에 추가
koTranslations.common = {
  ...koTranslations.common,
  admin: '관리자',
  inquiry: '문의하기'
};

// 아랍어 번역에 추가
arTranslations.common = {
  ...arTranslations.common,
  admin: 'المسؤول',
  inquiry: 'استفسارات'
};

// 인도네시아어 번역에 추가
idTranslations.common = {
  ...idTranslations.common,
  admin: 'Admin',
  inquiry: 'Pertanyaan'
};

// 말레이시아어 번역에 추가
msTranslations.common = {
  ...msTranslations.common,
  admin: 'Admin',
  inquiry: 'Pertanyaan'
};

// 태국어 번역에 추가
thTranslations.common = {
  ...thTranslations.common,
  admin: 'ผู้ดูแลระบบ',
  inquiry: 'สอบถาม'
};

// 스페인어 번역에 추가
esTranslations.common = {
  ...esTranslations.common,
  admin: 'Administrador',
  inquiry: 'Consultas'
};

// 포르투갈어(브라질) 번역에 추가
ptBrTranslations.common = {
  ...ptBrTranslations.common,
  admin: 'Administrador',
  inquiry: 'Perguntas'
};

// 홈 캐러셀 번역 추가
// 영어 번역에 추가
enTranslations.home = {
  ...enTranslations.home,
  carouselKorean: "Practice Korean with native expressions and cultural insights.",
  carouselEnglish: "Improve your English skills through interactive conversations.",
  carouselJapanese: "Master Japanese with guidance on kanji and everyday phrases.",
  carouselChinese: "Learn Chinese characters and tones with personalized feedback.",
  carouselSpanish: "Enhance your Spanish vocabulary through engaging dialogues.",
  carouselFrench: "Develop your French with proper pronunciation and grammar."
};

// 한국어 번역에 추가
koTranslations.home = {
  ...koTranslations.home,
  carouselKorean: "원어민 표현과 문화적 통찰력으로 한국어를 연습하세요.",
  carouselEnglish: "대화형 대화를 통해 영어 실력을 향상시키세요.",
  carouselJapanese: "한자와 일상 표현에 대한 지침으로 일본어를 마스터하세요.",
  carouselChinese: "개인 맞춤형 피드백과 함께 중국어 문자와 성조를 배우세요.",
  carouselSpanish: "매력적인 대화를 통해 스페인어 어휘력을 향상시키세요.",
  carouselFrench: "올바른 발음과 문법으로 프랑스어를 개발하세요."
};

// 아랍어 번역에 추가
arTranslations.home = {
  ...arTranslations.home,
  carouselKorean: "تدرب على اللغة الكورية مع تعبيرات الناطقين الأصليين ورؤى ثقافية.",
  carouselEnglish: "حسن مهارات اللغة الإنجليزية من خلال المحادثات التفاعلية.",
  carouselJapanese: "أتقن اللغة اليابانية مع إرشادات حول الكانجي والعبارات اليومية.",
  carouselChinese: "تعلم الحروف الصينية والنغمات مع ملاحظات مخصصة.",
  carouselSpanish: "عزز مفردات اللغة الإسبانية من خلال حوارات جذابة.",
  carouselFrench: "طور لغتك الفرنسية مع النطق والقواعد الصحيحة."
};

// 인도네시아어 번역에 추가
idTranslations.home = {
  ...idTranslations.home,
  carouselKorean: "Latih bahasa Korea dengan ekspresi asli dan wawasan budaya.",
  carouselEnglish: "Tingkatkan kemampuan bahasa Inggris Anda melalui percakapan interaktif.",
  carouselJapanese: "Kuasai bahasa Jepang dengan panduan kanji dan frasa sehari-hari.",
  carouselChinese: "Pelajari karakter dan nada bahasa Mandarin dengan umpan balik personal.",
  carouselSpanish: "Tingkatkan kosakata bahasa Spanyol Anda melalui dialog yang menarik.",
  carouselFrench: "Kembangkan bahasa Prancis Anda dengan pengucapan dan tata bahasa yang tepat."
};

// 말레이시아어 번역에 추가
msTranslations.home = {
  ...msTranslations.home,
  carouselKorean: "Berlatih bahasa Korea dengan ungkapan asli dan wawasan budaya.",
  carouselEnglish: "Tingkatkan kemahiran bahasa Inggeris anda melalui perbualan interaktif.",
  carouselJapanese: "Kuasai bahasa Jepun dengan panduan kanji dan frasa harian.",
  carouselChinese: "Pelajari aksara dan nada Cina dengan maklum balas peribadi.",
  carouselSpanish: "Tingkatkan perbendaharaan kata bahasa Sepanyol anda melalui dialog menarik.",
  carouselFrench: "Kembangkan bahasa Perancis anda dengan sebutan dan tatabahasa yang betul."
};

// 태국어 번역에 추가
thTranslations.home = {
  ...thTranslations.home,
  carouselKorean: "ฝึกภาษาเกาหลีด้วยสำนวนพื้นเมืองและข้อมูลเชิงวัฒนธรรม",
  carouselEnglish: "พัฒนาทักษะภาษาอังกฤษของคุณผ่านการสนทนาแบบโต้ตอบ",
  carouselJapanese: "เรียนรู้ภาษาญี่ปุ่นด้วยคำแนะนำเกี่ยวกับคันจิและวลีประจำวัน",
  carouselChinese: "เรียนรู้อักษรจีนและโทนเสียงด้วยคำติชมส่วนตัว",
  carouselSpanish: "เพิ่มพูนคำศัพท์ภาษาสเปนของคุณผ่านบทสนทนาที่น่าสนใจ",
  carouselFrench: "พัฒนาภาษาฝรั่งเศสของคุณด้วยการออกเสียงและไวยากรณ์ที่ถูกต้อง"
};

// 스페인어 번역에 추가
esTranslations.home = {
  ...esTranslations.home,
  carouselKorean: "Practica coreano con expresiones nativas y conocimientos culturales.",
  carouselEnglish: "Mejora tus habilidades en inglés a través de conversaciones interactivas.",
  carouselJapanese: "Domina el japonés con orientación sobre kanji y frases cotidianas.",
  carouselChinese: "Aprende caracteres y tonos chinos con retroalimentación personalizada.",
  carouselSpanish: "Mejora tu vocabulario español a través de diálogos atractivos.",
  carouselFrench: "Desarrolla tu francés con pronunciación y gramática adecuadas."
};

// 포르투갈어(브라질) 번역에 추가
ptBrTranslations.home = {
  ...ptBrTranslations.home,
  carouselKorean: "Pratique coreano com expressões nativas e insights culturais.",
  carouselEnglish: "Melhore suas habilidades em inglês por meio de conversas interativas.",
  carouselJapanese: "Domine o japonês com orientações sobre kanji e frases do dia a dia.",
  carouselChinese: "Aprenda caracteres e tons chineses com feedback personalizado.",
  carouselSpanish: "Melhore seu vocabulário em espanhol por meio de diálogos envolventes.",
  carouselFrench: "Desenvolva seu francês com pronúncia e gramática adequadas."
};

// ---
enTranslations.pricing = {
  title: "A plan for every learner",
  subtitle: "Choose the perfect plan for your language learning journey",
  free: "Free",
  pro: "Pro",
  perMonth: "per month",
  getStarted: "Get Started",
  upgrade: "Upgrade",
  popular: "Popular",
  dailyLimit: "{{count}} uses per day",
  basicConversation: "Basic conversation (short length)",
  allConversations: "All conversation lengths",
  oneTemplate: "1 writing template",
  unlimitedTemplates: "Unlimited writing templates",
  limitedVocabulary: "{{count}} vocabulary items",
  unlimitedVocabulary: "Unlimited vocabulary items",
  oneUser: "1 user",
  fiveUsers: "5 collaborators"
};

// 한국어 번역에 추가
koTranslations.pricing = {
  title: "모든 학습자를 위한 플랜",
  subtitle: "언어 학습의 모든 단계를 위한 맞춤형 플랜을 제공합니다",
  free: "무료",
  pro: "프로",
  perMonth: "월",
  getStarted: "시작하기",
  upgrade: "업그레이드",
  popular: "인기",
  dailyLimit: "일 {{count}}회 사용",
  basicConversation: "기본 대화 생성 (짧은 길이)",
  allConversations: "모든 길이 대화 생성",
  oneTemplate: "1개 글쓰기 템플릿",
  unlimitedTemplates: "무제한 글쓰기 템플릿",
  limitedVocabulary: "단어장 {{count}}개 항목",
  unlimitedVocabulary: "무제한 단어장 항목",
  oneUser: "1명 사용자",
  fiveUsers: "5명 공동 사용자",
  subscriptionInfo: '구독 정보',
  premiumActive: '프리미엄 구독 활성화',
  alreadySubscribed: '현재 프리미엄 구독 중입니다. 추가 결제는 필요하지 않습니다.',
  status: '상태',
  active: '활성',
  languages: '{{count}}개 지원 언어'
};

// 아랍어 번역에 추가
arTranslations.pricing = {
  title: "خطة لكل متعلم",
  subtitle: "اختر الخطة المثالية لرحلة تعلم اللغة الخاصة بك",
  free: "مجاني",
  pro: "احترافي",
  perMonth: "شهريًا",
  getStarted: "ابدأ الآن",
  upgrade: "ترقية",
  popular: "شائع",
  dailyLimit: "{{count}} استخدامات يوميًا",
  basicConversation: "محادثة أساسية (طول قصير)",
  allConversations: "جميع أطوال المحادثة",
  oneTemplate: "قالب كتابة واحد",
  unlimitedTemplates: "قوالب كتابة غير محدودة",
  limitedVocabulary: "{{count}} مفردات",
  unlimitedVocabulary: "مفردات غير محدودة",
  oneUser: "مستخدم واحد",
  fiveUsers: "5 متعاونين",
  subscriptionInfo: 'معلومات الاشتراك',
  premiumActive: 'اشتراك بريميوم نشط',
  alreadySubscribed: 'لديك بالفعل اشتراك بريميوم نشط. لا يلزم دفع إضافي.',
  status: 'الحالة',
  active: 'نشط',
  languages: '{{count}} لغات مدعومة'
};

// 인도네시아어 번역에 추가
idTranslations.pricing = {
  title: "Paket untuk setiap pelajar",
  subtitle: "Pilih paket yang sempurna untuk perjalanan belajar bahasa Anda",
  free: "Gratis",
  pro: "Pro",
  perMonth: "per bulan",
  getStarted: "Mulai",
  upgrade: "Tingkatkan",
  popular: "Populer",
  dailyLimit: "{{count}} penggunaan per hari",
  basicConversation: "Percakapan dasar (panjang pendek)",
  allConversations: "Semua panjang percakapan",
  oneTemplate: "1 template penulisan",
  unlimitedTemplates: "Template penulisan tak terbatas",
  limitedVocabulary: "{{count}} item kosakata",
  unlimitedVocabulary: "Item kosakata tak terbatas",
  oneUser: "1 pengguna",
  fiveUsers: "5 kolaborator",
  subscriptionInfo: 'Informasi Langganan',
  premiumActive: 'Langganan Premium Aktif',
  alreadySubscribed: 'Saat ini Anda memiliki langganan premium yang aktif. Tidak diperlukan pembayaran tambahan.',
  status: 'Status',
  active: 'Aktif',
  languages: '{{count}} bahasa yang didukung'
};

// 말레이시아어 번역에 추가
msTranslations.pricing = {
  title: "Pelan untuk setiap pelajar",
  subtitle: "Pilih pelan yang sempurna untuk perjalanan pembelajaran bahasa anda",
  free: "Percuma",
  pro: "Pro",
  perMonth: "sebulan",
  getStarted: "Mulakan",
  upgrade: "Naik Taraf",
  popular: "Popular",
  dailyLimit: "{{count}} penggunaan sehari",
  basicConversation: "Perbualan asas (panjang pendek)",
  allConversations: "Semua panjang perbualan",
  oneTemplate: "1 templat penulisan",
  unlimitedTemplates: "Templat penulisan tanpa had",
  limitedVocabulary: "{{count}} item perbendaharaan kata",
  unlimitedVocabulary: "Item perbendaharaan kata tanpa had",
  oneUser: "1 pengguna",
  fiveUsers: "5 kolaborator",
  subscriptionInfo: 'Maklumat Langganan',
  premiumActive: 'Langganan Premium Aktif',
  alreadySubscribed: 'Anda kini mempunyai langganan premium yang aktif. Tiada bayaran tambahan diperlukan.',
  status: 'Status',
  active: 'Aktif',
  languages: '{{count}} bahasa yang disokong'
};

// 태국어 번역에 추가
thTranslations.pricing = {
  title: "แผนสำหรับผู้เรียนทุกคน",
  subtitle: "เลือกแผนที่เหมาะสมสำหรับการเรียนรู้ภาษาของคุณ",
  free: "ฟรี",
  pro: "โปร",
  perMonth: "ต่อเดือน",
  getStarted: "เริ่มต้น",
  upgrade: "อัพเกรด",
  popular: "ยอดนิยม",
  dailyLimit: "ใช้ได้ {{count}} ครั้งต่อวัน",
  basicConversation: "บทสนทนาพื้นฐาน (ความยาวสั้น)",
  allConversations: "บทสนทนาทุกความยาว",
  oneTemplate: "เทมเพลตการเขียน 1 แบบ",
  unlimitedTemplates: "เทมเพลตการเขียนไม่จำกัด",
  limitedVocabulary: "คำศัพท์ {{count}} รายการ",
  unlimitedVocabulary: "คำศัพท์ไม่จำกัด",
  oneUser: "ผู้ใช้ 1 คน",
  fiveUsers: "ผู้ร่วมงาน 5 คน",
  subscriptionInfo: 'ข้อมูลการสมัครสมาชิก',
  premiumActive: 'การสมัครสมาชิกระดับพรีเมียมใช้งานอยู่',
  alreadySubscribed: 'คุณมีการสมัครสมาชิกระดับพรีเมียมที่ใช้งานอยู่ ไม่จำเป็นต้องชำระเงินเพิ่มเติม',
  status: 'สถานะ',
  active: 'ใช้งานอยู่',
  languages: 'รองรับ {{count}} ภาษา'
};

// 스페인어 번역에 추가
esTranslations.pricing = {
  title: "Un plan para cada estudiante",
  subtitle: "Elige el plan perfecto para tu viaje de aprendizaje de idiomas",
  free: "Gratis",
  pro: "Pro",
  perMonth: "por mes",
  getStarted: "Comenzar",
  upgrade: "Actualizar",
  popular: "Popular",
  dailyLimit: "{{count}} usos por día",
  basicConversation: "Conversación básica (longitud corta)",
  allConversations: "Todas las longitudes de conversación",
  oneTemplate: "1 plantilla de escritura",
  unlimitedTemplates: "Plantillas de escritura ilimitadas",
  limitedVocabulary: "{{count}} elementos de vocabulario",
  unlimitedVocabulary: "Elementos de vocabulario ilimitados",
  oneUser: "1 usuario",
  fiveUsers: "5 colaboradores",
  subscriptionInfo: 'Información de Suscripción',
  premiumActive: 'Suscripción Premium Activa',
  alreadySubscribed: 'Actualmente tienes una suscripción premium activa. No se requiere pago adicional.',
  status: 'Estado',
  active: 'Activo',
  languages: '{{count}} idiomas soportados'
};

// 포르투갈어(브라질) 번역에 추가
ptBrTranslations.pricing = {
  title: "Um plano para cada estudante",
  subtitle: "Escolha o plano perfeito para sua jornada de aprendizado de idiomas",
  free: "Grátis",
  pro: "Pro",
  perMonth: "por mês",
  getStarted: "Começar",
  upgrade: "Atualizar",
  popular: "Popular",
  dailyLimit: "{{count}} usos por dia",
  basicConversation: "Conversação básica (tamanho curto)",
  allConversations: "Todos os tamanhos de conversação",
  oneTemplate: "1 modelo de escrita",
  unlimitedTemplates: "Modelos de escrita ilimitados",
  limitedVocabulary: "{{count}} itens de vocabulário",
  unlimitedVocabulary: "Itens de vocabulário ilimitados",
  oneUser: "1 usuário",
  fiveUsers: "5 colaboradores",
  subscriptionInfo: 'Informações de Assinatura',
  premiumActive: 'Assinatura Premium Ativa',
  alreadySubscribed: 'Você atualmente tem uma assinatura premium ativa. Nenhum pagamento adicional é necessário.',
  status: 'Status',
  active: 'Ativo',
  languages: '{{count}} idiomas suportados'
};

// 영어 번역에 추가
enTranslations.pricing = {
  ...enTranslations.pricing,
  premiumUser: 'Premium User',
  proPlanDescription: 'Pro Plan Subscription',
  paymentSuccessRedirect: 'Payment successfully completed! Thank you, {{name}}! Redirecting to profile page in 3 seconds...',
  subscriptionSaveError: 'Failed to save subscription information. Please contact administrator.',
  paymentError: 'Payment failed. Please try again.'
};

// 한국어 번역에 추가
koTranslations.pricing = {
  ...koTranslations.pricing,
  premiumUser: '프리미엄 회원',
  proPlanDescription: '프로 플랜 구독',
  paymentSuccessRedirect: '결제가 성공적으로 완료되었습니다! {{name}}님 감사합니다! 3초 후 프로필 페이지로 이동합니다...',
  subscriptionSaveError: '구독 정보 저장에 실패했습니다. 관리자에게 문의하세요.',
  paymentError: '결제에 실패했습니다. 다시 시도해주세요.'
};

// 아랍어 번역에 추가
arTranslations.pricing = {
  ...arTranslations.pricing,
  premiumUser: 'مستخدم مميز',
  proPlanDescription: 'اشتراك الخطة الاحترافية',
  paymentSuccessRedirect: 'تمت عملية الدفع بنجاح! شكرًا لك، {{name}}! جارٍ إعادة التوجيه إلى صفحة الملف الشخصي في غضون 3 ثوانٍ...',
  subscriptionSaveError: 'فشل حفظ معلومات الاشتراك. يرجى الاتصال بالمسؤول.',
  paymentError: 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.'
};

// 인도네시아어 번역에 추가
idTranslations.pricing = {
  ...idTranslations.pricing,
  premiumUser: 'Pengguna Premium',
  proPlanDescription: 'Langganan Paket Pro',
  paymentSuccessRedirect: 'Pembayaran berhasil diselesaikan! Terima kasih, {{name}}! Mengarahkan ke halaman profil dalam 3 detik...',
  subscriptionSaveError: 'Gagal menyimpan informasi langganan. Silakan hubungi administrator.',
  paymentError: 'Pembayaran gagal. Silakan coba lagi.'
};

// 말레이시아어 번역에 추가
msTranslations.pricing = {
  ...msTranslations.pricing,
  premiumUser: 'Pengguna Premium',
  proPlanDescription: 'Langganan Pelan Pro',
  paymentSuccessRedirect: 'Pembayaran berjaya diselesaikan! Terima kasih, {{name}}! Mengarahkan ke halaman profil dalam 3 saat...',
  subscriptionSaveError: 'Gagal menyimpan maklumat langganan. Sila hubungi pentadbir.',
  paymentError: 'Pembayaran gagal. Sila cuba lagi.'
};

// 태국어 번역에 추가
thTranslations.pricing = {
  ...thTranslations.pricing,
  premiumUser: 'ผู้ใช้พรีเมียม',
  proPlanDescription: 'การสมัครสมาชิกแผนโปร',
  paymentSuccessRedirect: 'การชำระเงินเสร็จสมบูรณ์! ขอบคุณ {{name}}! กำลังนำไปยังหน้าโปรไฟล์ใน 3 วินาที...',
  subscriptionSaveError: 'ไม่สามารถบันทึกข้อมูลการสมัครสมาชิก โปรดติดต่อผู้ดูแลระบบ',
  paymentError: 'การชำระเงินล้มเหลว โปรดลองอีกครั้ง'
};

// 스페인어 번역에 추가
esTranslations.pricing = {
  ...esTranslations.pricing,
  premiumUser: 'Usuario Premium',
  proPlanDescription: 'Suscripción al Plan Pro',
  paymentSuccessRedirect: '¡Pago completado con éxito! ¡Gracias, {{name}}! Redirigiendo a la página de perfil en 3 segundos...',
  subscriptionSaveError: 'Error al guardar la información de suscripción. Por favor, contacte al administrador.',
  paymentError: 'El pago ha fallado. Por favor, inténtelo de nuevo.'
};

// 포르투갈어(브라질) 번역에 추가
ptBrTranslations.pricing = {
  ...ptBrTranslations.pricing,
  premiumUser: 'Usuário Premium',
  proPlanDescription: 'Assinatura do Plano Pro',
  paymentSuccessRedirect: 'Pagamento concluído com sucesso! Obrigado, {{name}}! Redirecionando para a página de perfil em 3 segundos...',
  subscriptionSaveError: 'Falha ao salvar as informações da assinatura. Entre em contato com o administrador.',
  paymentError: 'O pagamento falhou. Por favor, tente novamente.'
};

// 영어 번역에 추가
enTranslations.common.selected = 'Selected';
enTranslations.common.prioritySupport = 'Priority Support';
enTranslations.common.access = 'Access';
enTranslations.pricing = {
  ...enTranslations.pricing,
  title: "A plan for every learner",
  subtitle: "Choose the perfect plan for your language learning journey",
  free: "Free",
  pro: "Pro",
  perMonth: "per month",
  getStarted: "Get Started",
  upgrade: "Upgrade",
  popular: "Popular",
  dailyLimit: "{{count}} uses per day",
  basicConversation: "Basic conversation (short length)",
  allConversations: "All conversation lengths",
  oneTemplate: "1 writing template",
  unlimitedTemplates: "Unlimited writing templates",
  limitedVocabulary: "{{count}} vocabulary items",
  unlimitedVocabulary: "Unlimited vocabulary items",
  oneUser: "1 user",
  fiveUsers: "5 collaborators",
  premiumUser: 'Premium User',
  selectPlan: 'Select this plan',
  paymentMethod: 'Payment Method',
  selectedPlan: 'Selected plan',
  pay: 'Pay',
  paymentDescription: 'You can securely pay with PayPal account or credit card.',
  processingPayment: 'Processing payment...'
};

// 한국어 번역에 추가
koTranslations.common.selected = '선택됨';
koTranslations.common.prioritySupport = '우선 지원';
koTranslations.common.access = '액세스';
koTranslations.pricing = {
  ...koTranslations.pricing,
  title: "모든 학습자를 위한 플랜",
  subtitle: "언어 학습의 모든 단계를 위한 맞춤형 플랜을 제공합니다",
  free: "무료",
  pro: "프로",
  perMonth: "월",
  getStarted: "시작하기",
  upgrade: "업그레이드",
  popular: "인기",
  dailyLimit: "일 {{count}}회 사용",
  basicConversation: "기본 대화 생성 (짧은 길이)",
  allConversations: "모든 길이 대화 생성",
  oneTemplate: "1개 글쓰기 템플릿",
  unlimitedTemplates: "무제한 글쓰기 템플릿",
  limitedVocabulary: "단어장 {{count}}개 항목",
  unlimitedVocabulary: "무제한 단어장 항목",
  oneUser: "1명 사용자",
  fiveUsers: "5명 공동 사용자",
  premiumUser: '프리미엄 회원',
  selectPlan: '이 플랜 선택',
  paymentMethod: '결제 수단',
  selectedPlan: '선택한 플랜',
  pay: '결제하기',
  paymentDescription: '페이팔 계정이나 신용카드로 안전하게 결제하실 수 있습니다.',
  processingPayment: '결제 처리 중...'
};

// 아랍어 번역에 추가
arTranslations.common.selected = 'تم الاختيار';
arTranslations.common.prioritySupport = 'دعم ذو أولوية';
arTranslations.common.access = 'وصول';
arTranslations.pricing = {
  ...arTranslations.pricing,
  title: "خطة لكل متعلم",
  subtitle: "اختر الخطة المثالية لرحلة تعلم اللغة الخاصة بك",
  free: "مجاني",
  pro: "احترافي",
  perMonth: "شهريًا",
  getStarted: "ابدأ الآن",
  upgrade: "ترقية",
  popular: "شائع",
  dailyLimit: "{{count}} استخدامات يوميًا",
  basicConversation: "محادثة أساسية (طول قصير)",
  allConversations: "جميع أطوال المحادثة",
  oneTemplate: "قالب كتابة واحد",
  unlimitedTemplates: "قوالب كتابة غير محدودة",
  limitedVocabulary: "{{count}} مفردات",
  unlimitedVocabulary: "مفردات غير محدودة",
  oneUser: "مستخدم واحد",
  fiveUsers: "5 متعاونين",
  premiumUser: 'مستخدم مميز',
  selectPlan: 'اختر هذه الخطة',
  paymentMethod: 'طريقة الدفع',
  selectedPlan: 'الخطة المختارة',
  pay: 'دفع',
  paymentDescription: 'يمكنك الدفع بأمان باستخدام حساب PayPal أو بطاقة الائتمان.',
  processingPayment: 'جارٍ معالجة الدفع...'
};

// 인도네시아어 번역에 추가
idTranslations.common.selected = 'Dipilih';
idTranslations.common.prioritySupport = 'Dukungan Prioritas';
idTranslations.common.access = 'Akses';
idTranslations.pricing = {
  ...idTranslations.pricing,
  title: "Paket untuk setiap pelajar",
  subtitle: "Pilih paket yang sempurna untuk perjalanan belajar bahasa Anda",
  free: "Gratis",
  pro: "Pro",
  perMonth: "per bulan",
  getStarted: "Mulai",
  upgrade: "Tingkatkan",
  popular: "Populer",
  dailyLimit: "{{count}} penggunaan per hari",
  basicConversation: "Percakapan dasar (panjang pendek)",
  allConversations: "Semua panjang percakapan",
  oneTemplate: "1 template penulisan",
  unlimitedTemplates: "Template penulisan tak terbatas",
  limitedVocabulary: "{{count}} item kosakata",
  unlimitedVocabulary: "Item kosakata tak terbatas",
  oneUser: "1 pengguna",
  fiveUsers: "5 kolaborator",
  premiumUser: 'Pengguna Premium',
  selectPlan: 'Pilih paket ini',
  paymentMethod: 'Metode Pembayaran',
  selectedPlan: 'Paket yang dipilih',
  pay: 'Bayar',
  paymentDescription: 'Anda dapat membayar dengan aman menggunakan akun PayPal atau kartu kredit.',
  processingPayment: 'Memproses pembayaran...'
};

// 말레이시아어 번역에 추가
msTranslations.common.selected = 'Dipilih';
msTranslations.common.prioritySupport = 'Sokongan Keutamaan';
msTranslations.common.access = 'Akses';
msTranslations.pricing = {
  ...msTranslations.pricing,
  title: "Pelan untuk setiap pelajar",
  subtitle: "Pilih pelan yang sempurna untuk perjalanan pembelajaran bahasa anda",
  free: "Percuma",
  pro: "Pro",
  perMonth: "sebulan",
  getStarted: "Mulakan",
  upgrade: "Naik Taraf",
  popular: "Popular",
  dailyLimit: "{{count}} penggunaan sehari",
  basicConversation: "Perbualan asas (panjang pendek)",
  allConversations: "Semua panjang perbualan",
  oneTemplate: "1 templat penulisan",
  unlimitedTemplates: "Templat penulisan tanpa had",
  limitedVocabulary: "{{count}} item perbendaharaan kata",
  unlimitedVocabulary: "Item perbendaharaan kata tanpa had",
  oneUser: "1 pengguna",
  fiveUsers: "5 kolaborator",
  premiumUser: 'Pengguna Premium',
  selectPlan: 'Pilih pelan ini',
  paymentMethod: 'Kaedah Pembayaran',
  selectedPlan: 'Pelan yang dipilih',
  pay: 'Bayar',
  paymentDescription: 'Anda boleh membayar dengan selamat menggunakan akaun PayPal atau kad kredit.',
  processingPayment: 'Memproses pembayaran...'
};

// 태국어 번역에 추가
thTranslations.common.selected = 'เลือกแล้ว';
thTranslations.common.prioritySupport = 'การสนับสนุนระดับพรีเมียม';
thTranslations.common.access = 'การเข้าถึง';
thTranslations.pricing = {
  ...thTranslations.pricing,
  title: "แผนสำหรับผู้เรียนทุกคน",
  subtitle: "เลือกแผนที่เหมาะสมสำหรับการเรียนรู้ภาษาของคุณ",
  free: "ฟรี",
  pro: "โปร",
  perMonth: "ต่อเดือน",
  getStarted: "เริ่มต้น",
  upgrade: "อัพเกรด",
  popular: "ยอดนิยม",
  dailyLimit: "ใช้ได้ {{count}} ครั้งต่อวัน",
  basicConversation: "บทสนทนาพื้นฐาน (ความยาวสั้น)",
  allConversations: "บทสนทนาทุกความยาว",
  oneTemplate: "เทมเพลตการเขียน 1 แบบ",
  unlimitedTemplates: "เทมเพลตการเขียนไม่จำกัด",
  limitedVocabulary: "คำศัพท์ {{count}} รายการ",
  unlimitedVocabulary: "คำศัพท์ไม่จำกัด",
  oneUser: "ผู้ใช้ 1 คน",
  fiveUsers: "ผู้ร่วมงาน 5 คน",
  premiumUser: 'ผู้ใช้พรีเมียม',
  selectPlan: 'เลือกแผนนี้',
  paymentMethod: 'วิธีการชำระเงิน',
  selectedPlan: 'แผนที่เลือก',
  pay: 'ชำระเงิน',
  paymentDescription: 'คุณสามารถชำระเงินได้อย่างปลอดภัยด้วยบัญชี PayPal หรือบัตรเครดิต',
  processingPayment: 'กำลังประมวลผลการชำระเงิน...'
};

// 스페인어 번역에 추가
esTranslations.common.selected = 'Seleccionado';
esTranslations.common.prioritySupport = 'Soporte Prioritario';
esTranslations.common.access = 'Acceso';
esTranslations.pricing = {
  ...esTranslations.pricing,
  title: "Un plan para cada estudiante",
  subtitle: "Elige el plan perfecto para tu viaje de aprendizaje de idiomas",
  free: "Gratis",
  pro: "Pro",
  perMonth: "por mes",
  getStarted: "Comenzar",
  upgrade: "Actualizar",
  popular: "Popular",
  dailyLimit: "{{count}} usos por día",
  basicConversation: "Conversación básica (longitud corta)",
  allConversations: "Todas las longitudes de conversación",
  oneTemplate: "1 plantilla de escritura",
  unlimitedTemplates: "Plantillas de escritura ilimitadas",
  limitedVocabulary: "{{count}} elementos de vocabulario",
  unlimitedVocabulary: "Elementos de vocabulario ilimitados",
  oneUser: "1 usuario",
  fiveUsers: "5 colaboradores",
  premiumUser: 'Usuario Premium',
  selectPlan: 'Seleccionar este plan',
  paymentMethod: 'Método de Pago',
  selectedPlan: 'Plan seleccionado',
  pay: 'Pagar',
  paymentDescription: 'Puede pagar de forma segura con cuenta PayPal o tarjeta de crédito.',
  processingPayment: 'Procesando pago...'
};

// 포르투갈어(브라질) 번역에 추가
ptBrTranslations.common.selected = 'Selecionado';
ptBrTranslations.common.prioritySupport = 'Suporte Prioritário';
ptBrTranslations.common.access = 'Acesso';
ptBrTranslations.pricing = {
  ...ptBrTranslations.pricing,
  title: "Um plano para cada estudante",
  subtitle: "Escolha o plano perfeito para sua jornada de aprendizado de idiomas",
  free: "Grátis",
  pro: "Pro",
  perMonth: "por mês",
  getStarted: "Começar",
  upgrade: "Atualizar",
  popular: "Popular",
  dailyLimit: "{{count}} usos por dia",
  basicConversation: "Conversação básica (tamanho curto)",
  allConversations: "Todos os tamanhos de conversação",
  oneTemplate: "1 modelo de escrita",
  unlimitedTemplates: "Modelos de escrita ilimitados",
  limitedVocabulary: "{{count}} itens de vocabulário",
  unlimitedVocabulary: "Itens de vocabulário ilimitados",
  oneUser: "1 usuário",
  fiveUsers: "5 colaboradores",
  premiumUser: 'Usuário Premium',
  selectPlan: 'Selecionar este plano',
  paymentMethod: 'Método de Pagamento',
  selectedPlan: 'Plano selecionado',
  pay: 'Pagar',
  paymentDescription: 'Você pode pagar com segurança usando conta PayPal ou cartão de crédito.',
  processingPayment: 'Processando pagamento...'
};

// 태국어 번역에 파일 관련 번역 추가
thTranslations.chat.savePDF = 'บันทึก PDF';
thTranslations.chat.saveAudio = 'บันทึกไฟล์เสียง';
thTranslations.chat.pdfSaved = 'บันทึก PDF สำเร็จ';
thTranslations.chat.audioSaved = 'บันทึกไฟล์เสียงสำเร็จ';
thTranslations.chat.saving = 'กำลังบันทึก...';
thTranslations.chat.downloadOptions = 'ตัวเลือกการดาวน์โหลด';
thTranslations.chat.downloadPDF = 'ดาวน์โหลด PDF';
thTranslations.chat.downloadAudio = 'ดาวน์โหลดไฟล์เสียง';
thTranslations.chat.saveToMyFiles = 'บันทึกไปยังไฟล์ของฉัน';
thTranslations.chat.savePDFToProfile = 'บันทึก PDF ไปยังโปรไฟล์';
thTranslations.chat.saveAudioToProfile = 'บันทึกไฟล์เสียงไปยังโปรไฟล์';
thTranslations.chat.fileLimitWarning = 'คุณมีไฟล์ {{type}} จำนวนสูงสุดที่ {{limit}} ไฟล์แล้ว หากบันทึกไฟล์ใหม่ ไฟล์เก่าที่สุดจะถูกลบ';
thTranslations.chat.fileSavedWithReplacement = 'บันทึกไฟล์ {{type}} แล้ว ไฟล์เก่าที่สุดถูกลบไปเนื่องจากถึงขีดจำกัดสูงสุด';
thTranslations.chat.pdfSaveError = 'เกิดข้อผิดพลาดในการบันทึก PDF โปรดลองอีกครั้ง';// 영어 번역에 파일 관련 번역 추가
enTranslations.chat.savePDF = 'Save PDF';
enTranslations.chat.saveAudio = 'Save Audio';
enTranslations.chat.pdfSaved = 'PDF Saved Successfully';
enTranslations.chat.audioSaved = 'Audio Saved Successfully';
enTranslations.chat.saving = 'Saving...';
enTranslations.chat.downloadOptions = 'Download Options';
enTranslations.chat.downloadPDF = 'Download PDF';
enTranslations.chat.downloadAudio = 'Download Audio';
enTranslations.chat.saveToMyFiles = 'Save to My Files';
enTranslations.chat.savePDFToProfile = 'Save PDF to Profile';
enTranslations.chat.saveAudioToProfile = 'Save Audio to Profile';
enTranslations.chat.fileLimitWarning = 'You have the maximum of {{limit}} {{type}} files stored. Saving a new file will delete the oldest file.';
enTranslations.chat.fileSavedWithReplacement = '{{type}} file saved. The oldest file was deleted due to the maximum limit.';
enTranslations.chat.pdfSaveError = 'Error saving PDF. Please try again.';

enTranslations.profile.myFiles = 'My Files';
enTranslations.files = {
  title: 'My Files',
  allFiles: 'All Files',
  pdfFiles: 'PDF Files',
  audioFiles: 'Audio Files',
  createdAt: 'Created at',
  expiresAt: 'Expires at',
  fileSize: 'File Size',
  download: 'Download',
  storageLimit: 'Storage Limit',
  expiryInfo: 'Files are automatically deleted 30 days after creation.',
  storageLimitDetailed: 'Only a maximum of {{limit}} files per type can be stored. When a new file is saved, the oldest file will be automatically deleted.',
  pdfLimit: 'PDF Files: {{current}}/{{max}}',
  audioLimit: 'Audio Files: {{current}}/{{max}}'
};

// 한국어 번역에 파일 관련 번역 추가
koTranslations.chat.savePDF = 'PDF 저장';
koTranslations.chat.saveAudio = '오디오 저장';
koTranslations.chat.pdfSaved = 'PDF 저장 완료';
koTranslations.chat.audioSaved = '오디오 저장 완료';
koTranslations.chat.saving = '저장 중...';
koTranslations.chat.downloadOptions = '다운로드 옵션';
koTranslations.chat.downloadPDF = 'PDF 다운로드';
koTranslations.chat.downloadAudio = '오디오 다운로드';
koTranslations.chat.saveToMyFiles = '내 파일에 저장';
koTranslations.chat.savePDFToProfile = 'PDF를 프로필에 저장';
koTranslations.chat.saveAudioToProfile = '오디오를 프로필에 저장';
koTranslations.chat.fileLimitWarning = '최대 {{limit}}개의 {{type}} 파일이 저장되어 있습니다. 새 파일을 저장하면 가장 오래된 파일이 삭제됩니다.';
koTranslations.chat.fileSavedWithReplacement = '{{type}} 파일이 저장되었습니다. 최대 개수 제한으로 인해 가장 오래된 파일이 삭제되었습니다.';
koTranslations.chat.pdfSaveError = 'PDF 저장 중 오류가 발생했습니다. 다시 시도해주세요.';

koTranslations.profile.myFiles = '내 파일';
koTranslations.files = {
  title: '내 파일',
  allFiles: '모든 파일',
  pdfFiles: 'PDF 파일',
  audioFiles: '오디오 파일',
  createdAt: '생성일',
  expiresAt: '만료일',
  fileSize: '파일 크기',
  download: '다운로드',
  storageLimit: '저장 용량 제한',
  expiryInfo: '파일은 생성 후 30일 후에 자동으로 삭제됩니다.',
  storageLimitDetailed: '각 유형별로 최대 {{limit}}개의 파일만 저장됩니다. 새 파일을 저장하면 가장 오래된 파일이 자동으로 삭제됩니다.',
  pdfLimit: 'PDF 파일: {{current}}/{{max}}',
  audioLimit: '오디오 파일: {{current}}/{{max}}'
};

// 아랍어 번역에 파일 관련 번역 추가
arTranslations.chat.savePDF = 'حفظ PDF';
arTranslations.chat.saveAudio = 'حفظ الصوت';
arTranslations.chat.pdfSaved = 'تم حفظ PDF بنجاح';
arTranslations.chat.audioSaved = 'تم حفظ الصوت بنجاح';
arTranslations.chat.saving = 'جاري الحفظ...';
arTranslations.chat.downloadOptions = 'خيارات التنزيل';
arTranslations.chat.downloadPDF = 'تنزيل PDF';
arTranslations.chat.downloadAudio = 'تنزيل الصوت';
arTranslations.chat.saveToMyFiles = 'حفظ في ملفاتي';
arTranslations.chat.savePDFToProfile = 'حفظ PDF في الملف الشخصي';
arTranslations.chat.saveAudioToProfile = 'حفظ الصوت في الملف الشخصي';
arTranslations.chat.fileLimitWarning = 'لديك الحد الأقصى من ملفات {{type}} وهو {{limit}}. حفظ ملف جديد سيؤدي إلى حذف الملف الأقدم.';
arTranslations.chat.fileSavedWithReplacement = 'تم حفظ ملف {{type}}. تم حذف الملف الأقدم بسبب الحد الأقصى.';
arTranslations.chat.pdfSaveError = 'خطأ في حفظ ملف PDF. يرجى المحاولة مرة أخرى.';

arTranslations.profile.myFiles = 'ملفاتي';
arTranslations.files = {
  title: 'ملفاتي',
  allFiles: 'جميع الملفات',
  pdfFiles: 'ملفات PDF',
  audioFiles: 'ملفات صوتية',
  createdAt: 'تم إنشاؤه في',
  expiresAt: 'ينتهي في',
  fileSize: 'حجم الملف',
  download: 'تنزيل',
  storageLimit: 'حد التخزين',
  expiryInfo: 'يتم حذف الملفات تلقائيًا بعد 30 يومًا من إنشائها.',
  storageLimitDetailed: 'يمكن تخزين {{limit}} ملفات كحد أقصى لكل نوع. عند حفظ ملف جديد، سيتم حذف الملف الأقدم تلقائيًا.',
  pdfLimit: 'ملفات PDF: {{current}}/{{max}}',
  audioLimit: 'ملفات صوتية: {{current}}/{{max}}'
};

// 인도네시아어 번역에 파일 관련 번역 추가
idTranslations.chat.savePDF = 'Simpan PDF';
idTranslations.chat.saveAudio = 'Simpan Audio';
idTranslations.chat.pdfSaved = 'PDF Berhasil Disimpan';
idTranslations.chat.audioSaved = 'Audio Berhasil Disimpan';
idTranslations.chat.saving = 'Menyimpan...';
idTranslations.chat.downloadOptions = 'Opsi Unduhan';
idTranslations.chat.downloadPDF = 'Unduh PDF';
idTranslations.chat.downloadAudio = 'Unduh Audio';
idTranslations.chat.saveToMyFiles = 'Simpan ke File Saya';
idTranslations.chat.savePDFToProfile = 'Simpan PDF ke Profil';
idTranslations.chat.saveAudioToProfile = 'Simpan Audio ke Profil';
idTranslations.chat.fileLimitWarning = 'Anda telah menyimpan jumlah maksimum {{limit}} file {{type}}. Menyimpan file baru akan menghapus file terlama.';
idTranslations.chat.fileSavedWithReplacement = 'File {{type}} disimpan. File terlama telah dihapus karena batas maksimum.';

idTranslations.profile.myFiles = 'File Saya';
idTranslations.files = {
  title: 'File Saya',
  allFiles: 'Semua File',
  pdfFiles: 'File PDF',
  audioFiles: 'File Audio',
  createdAt: 'Dibuat pada',
  expiresAt: 'Kedaluwarsa pada',
  fileSize: 'Ukuran File',
  download: 'Unduh',
  storageLimit: 'Batas Penyimpanan',
  expiryInfo: 'File dihapus secara otomatis 30 hari setelah pembuatan.',
  storageLimitDetailed: 'Hanya maksimal {{limit}} file per jenis yang dapat disimpan. Ketika file baru disimpan, file tertua akan dihapus secara otomatis.',
  pdfLimit: 'File PDF: {{current}}/{{max}}',
  audioLimit: 'File Audio: {{current}}/{{max}}'
};

// 말레이시아어 번역에 파일 관련 번역 추가
msTranslations.chat.savePDF = 'Simpan PDF';
msTranslations.chat.saveAudio = 'Simpan Audio';
msTranslations.chat.pdfSaved = 'PDF Berjaya Disimpan';
msTranslations.chat.audioSaved = 'Audio Berjaya Disimpan';
msTranslations.chat.saving = 'Menyimpan...';
msTranslations.chat.downloadOptions = 'Pilihan Muat Turun';
msTranslations.chat.downloadPDF = 'Muat Turun PDF';
msTranslations.chat.downloadAudio = 'Muat Turun Audio';
msTranslations.chat.saveToMyFiles = 'Simpan ke Fail Saya';
msTranslations.chat.savePDFToProfile = 'Simpan PDF ke Profil';
msTranslations.chat.saveAudioToProfile = 'Simpan Audio ke Profil';
msTranslations.chat.fileLimitWarning = 'Anda telah menyimpan jumlah maksimum {{limit}} fail {{type}}. Menyimpan fail baru akan memadam fail tertua.';
msTranslations.chat.fileSavedWithReplacement = 'Fail {{type}} disimpan. Fail tertua telah dipadamkan kerana had maksimum.';

msTranslations.profile.myFiles = 'Fail Saya';
msTranslations.files = {
  title: 'Fail Saya',
  allFiles: 'Semua Fail',
  pdfFiles: 'Fail PDF',
  audioFiles: 'Fail Audio',
  createdAt: 'Dicipta pada',
  expiresAt: 'Tamat tempoh pada',
  fileSize: 'Saiz Fail',
  download: 'Muat Turun',
  storageLimit: 'Had Storan',
  expiryInfo: 'Fail dipadamkan secara automatik 30 hari selepas dicipta.',
  storageLimitDetailed: 'Hanya maksimum {{limit}} fail setiap jenis boleh disimpan. Apabila fail baru disimpan, fail tertua akan dipadamkan secara automatik.',
  pdfLimit: 'Fail PDF: {{current}}/{{max}}',
  audioLimit: 'Fail Audio: {{current}}/{{max}}'
};

// 태국어 번역에 파일 관련 번역 추가
thTranslations.chat.savePDF = 'บันทึก PDF';
thTranslations.chat.saveAudio = 'บันทึกไฟล์เสียง';
thTranslations.chat.pdfSaved = 'บันทึก PDF สำเร็จ';
thTranslations.chat.audioSaved = 'บันทึกไฟล์เสียงสำเร็จ';
thTranslations.chat.saving = 'กำลังบันทึก...';
thTranslations.chat.downloadOptions = 'ตัวเลือกการดาวน์โหลด';
thTranslations.chat.downloadPDF = 'ดาวน์โหลด PDF';
thTranslations.chat.downloadAudio = 'ดาวน์โหลดไฟล์เสียง';
thTranslations.chat.saveToMyFiles = 'บันทึกไปยังไฟล์ของฉัน';
thTranslations.chat.savePDFToProfile = 'บันทึก PDF ไปยังโปรไฟล์';
thTranslations.chat.saveAudioToProfile = 'บันทึกไฟล์เสียงไปยังโปรไฟล์';

thTranslations.profile.myFiles = 'ไฟล์ของฉัน';
thTranslations.files = {
  title: 'ไฟล์ของฉัน',
  allFiles: 'ไฟล์ทั้งหมด',
  pdfFiles: 'ไฟล์ PDF',
  audioFiles: 'ไฟล์เสียง',
  createdAt: 'สร้างเมื่อ',
  expiresAt: 'หมดอายุเมื่อ',
  fileSize: 'ขนาดไฟล์',
  download: 'ดาวน์โหลด',
  storageLimit: 'ขีดจำกัดการจัดเก็บ',
  expiryInfo: 'ไฟล์จะถูกลบโดยอัตโนมัติ 30 วันหลังจากสร้าง',
  storageLimitDetailed: 'สามารถเก็บไฟล์ได้สูงสุด {{limit}} ไฟล์ต่อประเภท เมื่อบันทึกไฟล์ใหม่ ไฟล์เก่าที่สุดจะถูกลบโดยอัตโนมัติ',
  pdfLimit: 'ไฟล์ PDF: {{current}}/{{max}}',
  audioLimit: 'ไฟล์เสียง: {{current}}/{{max}}'
};

// 스페인어 번역에 파일 관련 번역 추가
esTranslations.chat.savePDF = 'Guardar PDF';
esTranslations.chat.saveAudio = 'Guardar Audio';
esTranslations.chat.pdfSaved = 'PDF Guardado Exitosamente';
esTranslations.chat.audioSaved = 'Audio Guardado Exitosamente';
esTranslations.chat.saving = 'Guardando...';
esTranslations.chat.downloadOptions = 'Opciones de Descarga';
esTranslations.chat.downloadPDF = 'Descargar PDF';
esTranslations.chat.downloadAudio = 'Descargar Audio';
esTranslations.chat.saveToMyFiles = 'Guardar en Mis Archivos';
esTranslations.chat.savePDFToProfile = 'Guardar PDF en Perfil';
esTranslations.chat.saveAudioToProfile = 'Guardar Audio en Perfil';
esTranslations.chat.fileLimitWarning = 'Ha almacenado el máximo de {{limit}} archivos de {{type}}. Al guardar un nuevo archivo se eliminará el archivo más antiguo.';
esTranslations.chat.fileSavedWithReplacement = 'Archivo de {{type}} guardado. El archivo más antiguo fue eliminado debido al límite máximo.';
esTranslations.chat.pdfSaveError = 'Error al guardar el PDF. Por favor, inténtelo de nuevo.';

esTranslations.profile.myFiles = 'Mis Archivos';
esTranslations.files = {
  title: 'Mis Archivos',
  allFiles: 'Todos los Archivos',
  pdfFiles: 'Archivos PDF',
  audioFiles: 'Archivos de Audio',
  createdAt: 'Creado el',
  expiresAt: 'Expira el',
  fileSize: 'Tamaño del Archivo',
  download: 'Descargar',
  storageLimit: 'Límite de Almacenamiento',
  expiryInfo: 'Los archivos se eliminan automáticamente 30 días después de su creación.',
  storageLimitDetailed: 'Solo se pueden almacenar un máximo de {{limit}} archivos por tipo. Cuando se guarda un nuevo archivo, el archivo más antiguo se eliminará automáticamente.',
  pdfLimit: 'Archivos PDF: {{current}}/{{max}}',
  audioLimit: 'Archivos de Audio: {{current}}/{{max}}'
};

// 포르투갈어(브라질) 번역에 파일 관련 번역 추가
ptBrTranslations.chat.savePDF = 'Salvar PDF';
ptBrTranslations.chat.saveAudio = 'Salvar Áudio';
ptBrTranslations.chat.pdfSaved = 'PDF Salvo com Sucesso';
ptBrTranslations.chat.audioSaved = 'Áudio Salvo com Sucesso';
ptBrTranslations.chat.saving = 'Salvando...';
ptBrTranslations.chat.downloadOptions = 'Opções de Download';
ptBrTranslations.chat.downloadPDF = 'Baixar PDF';
ptBrTranslations.chat.downloadAudio = 'Baixar Áudio';
ptBrTranslations.chat.saveToMyFiles = 'Salvar em Meus Arquivos';
ptBrTranslations.chat.savePDFToProfile = 'Salvar PDF no Perfil';
ptBrTranslations.chat.saveAudioToProfile = 'Salvar Áudio no Perfil';
ptBrTranslations.chat.fileLimitWarning = 'Você atingiu o máximo de {{limit}} arquivos de {{type}}. Salvar um novo arquivo excluirá o arquivo mais antigo.';
ptBrTranslations.chat.fileSavedWithReplacement = 'Arquivo de {{type}} salvo. O arquivo mais antigo foi excluído devido ao limite máximo.';
ptBrTranslations.chat.pdfSaveError = 'Erro ao salvar o PDF. Por favor, tente novamente.';

ptBrTranslations.profile.myFiles = 'Meus Arquivos';
ptBrTranslations.files = {
  title: 'Meus Arquivos',
  allFiles: 'Todos os Arquivos',
  pdfFiles: 'Arquivos PDF',
  audioFiles: 'Arquivos de Áudio',
  createdAt: 'Criado em',
  expiresAt: 'Expira em',
  fileSize: 'Tamanho do Arquivo',
  download: 'Baixar',
  storageLimit: 'Limite de Armazenamento',
  expiryInfo: 'Os arquivos são excluídos automaticamente 30 dias após a criação.',
  storageLimitDetailed: 'Apenas um máximo de {{limit}} arquivos por tipo podem ser armazenados. Quando um novo arquivo é salvo, o arquivo mais antigo será automaticamente excluído.',
  pdfLimit: 'Arquivos PDF: {{current}}/{{max}}',
  audioLimit: 'Arquivos de Áudio: {{current}}/{{max}}'
};

// src/i18n/index.js에 추가

// 영어 번역에 퀴즈 메뉴 추가
enTranslations.common = {
  ...enTranslations.common,
  quizzes: 'Quizzes'
};

// 한국어 번역에 퀴즈 메뉴 추가
koTranslations.common = {
  ...koTranslations.common,
  quizzes: '퀴즈'
};

// 아랍어 번역에 퀴즈 메뉴 추가 
arTranslations.common = {
  ...arTranslations.common,
  quizzes: 'الاختبارات'
};

// 인도네시아어 번역에 퀴즈 메뉴 추가
idTranslations.common = {
  ...idTranslations.common,
  quizzes: 'Kuis'
};

// 말레이시아어 번역에 퀴즈 메뉴 추가
msTranslations.common = {
  ...msTranslations.common,
  quizzes: 'Kuiz'
};

// 태국어 번역에 퀴즈 메뉴 추가
thTranslations.common = {
  ...thTranslations.common,
  quizzes: 'แบบทดสอบ'
};

// 스페인어 번역에 퀴즈 메뉴 추가
esTranslations.common = {
  ...esTranslations.common,
  quizzes: 'Cuestionarios'
};

// 포르투갈어(브라질) 번역에 퀴즈 메뉴 추가
ptBrTranslations.common = {
  ...ptBrTranslations.common,
  quizzes: 'Questionários'
};

// src/i18n/index.js에 추가할 퀴즈 관련 번역
// 각 언어별 quiz 객체 초기화 (먼저 정의)
enTranslations.quiz = enTranslations.quiz || {};
koTranslations.quiz = koTranslations.quiz || {};
arTranslations.quiz = arTranslations.quiz || {};
idTranslations.quiz = idTranslations.quiz || {};
msTranslations.quiz = msTranslations.quiz || {};
thTranslations.quiz = thTranslations.quiz || {};
esTranslations.quiz = esTranslations.quiz || {};
ptBrTranslations.quiz = ptBrTranslations.quiz || {};
// 영어 번역
enTranslations.quiz = {
  // 공통 및 메뉴
  myQuizzes: "My Quizzes",
  createNew: "Create New Quiz",
  createTitle: "Create Quiz",
  details: "Details",
  takeQuiz: "Take Quiz",
  download: "Download",
  downloadPdf: "Download PDF",
  back: "Back",
  questions: "Questions",
  created: "Created",
  sourceFile: "Source File",
  question: "Question",
  previous: "Previous",
  next: "Next",
  finish: "Finish",
  submitAnswer: "Submit Answer",
  finishQuiz: "Finish Quiz",
  correct: "Correct",
  incorrect: "Incorrect",
  multipleChoice: "Multiple Choice",
  shortAnswer: "Short Answer",
  correctAnswer: "Correct Answer!",
  incorrectAnswer: "Incorrect Answer",
  
  // 퀴즈 생성 페이지
  selectPdf: "Select PDF File",
  noFiles: "No PDF files found. Please upload a PDF file first.",
  title: "Quiz Title",
  titlePlaceholder: "Enter quiz title",
  titleRequiredError: "Quiz title is required",
  selectFileError: "Please select a PDF file",
  generate: "Generate Quiz",
  howItWorks: "How It Works",
  generatorExplanation: "The system will analyze the selected PDF file and automatically generate multiple-choice and short-answer questions based on its content. The generated quiz can be taken online or downloaded as a PDF.",
  generateError: "Failed to generate quiz. Please try again.",
  
  // 퀴즈 목록 페이지
  noQuizzes: "You haven't created any quizzes yet.",
  createQuizPrompt: "Select a PDF file to create your first quiz.",
  fetchError: "Failed to fetch quizzes. Please try again.",
  
  // 퀴즈 상세 페이지
  questionsPreview: "Questions Preview",
  fetchDetailError: "Failed to load quiz details. Please try again.",
  downloadError: "Failed to download PDF. Please try again.",
  notFound: "Quiz not found.",
  
  // 퀴즈 풀기 페이지
  enterAnswer: "Enter your answer...",
  answerRequired: "Please enter an answer",
  submitError: "Failed to submit answer. Please try again.",
  startError: "Failed to start quiz. Please try again.",
  completeError: "Failed to complete quiz. Please try again.",
  
  // 퀴즈 결과 페이지
  resultsTitle: "Quiz Results",
  correctAnswers: "correct answers",
  answersSummary: "Answers Summary",
  yourAnswer: "Your answer",
  resultsError: "Failed to load quiz results. Please try again.",
  resultsNotFound: "Results not found.",
  backToQuizzes: "Back to Quizzes",
  tryAgain: "Try Again"
};

// 한국어 번역
koTranslations.quiz = {
  // 공통 및 메뉴
  myQuizzes: "내 퀴즈 목록",
  createNew: "새 퀴즈 만들기",
  createTitle: "퀴즈 생성",
  details: "상세정보",
  takeQuiz: "퀴즈 풀기",
  download: "다운로드",
  downloadPdf: "PDF 다운로드",
  back: "돌아가기",
  questions: "문제 수",
  created: "생성일",
  sourceFile: "원본 파일",
  question: "문제",
  previous: "이전",
  next: "다음",
  finish: "완료",
  submitAnswer: "답변 제출",
  finishQuiz: "퀴즈 완료",
  correct: "정답",
  incorrect: "오답",
  multipleChoice: "객관식",
  shortAnswer: "주관식",
  correctAnswer: "정답입니다!",
  incorrectAnswer: "오답입니다",
  
  // 퀴즈 생성 페이지
  selectPdf: "PDF 파일 선택",
  noFiles: "PDF 파일이 없습니다. 먼저 PDF 파일을 업로드해주세요.",
  title: "퀴즈 제목",
  titlePlaceholder: "퀴즈 제목을 입력하세요",
  titleRequiredError: "퀴즈 제목을 입력해주세요",
  selectFileError: "PDF 파일을 선택해주세요",
  generate: "퀴즈 생성하기",
  howItWorks: "작동 방식",
  generatorExplanation: "선택한 PDF 파일의 내용을 분석하여 객관식 및 주관식 문제를 자동으로 생성합니다. 생성된 퀴즈는 온라인에서 풀거나 PDF로 다운로드할 수 있습니다.",
  generateError: "퀴즈 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
  
  // 퀴즈 목록 페이지
  noQuizzes: "아직 생성된 퀴즈가 없습니다.",
  createQuizPrompt: "PDF 파일을 선택하여 새로운 퀴즈를 만들어보세요.",
  fetchError: "퀴즈 목록을 불러오는데 실패했습니다.",
  
  // 퀴즈 상세 페이지
  questionsPreview: "문제 미리보기",
  fetchDetailError: "퀴즈 정보를 불러오는데 실패했습니다.",
  downloadError: "PDF 다운로드에 실패했습니다.",
  notFound: "퀴즈를 찾을 수 없습니다.",
  
  // 퀴즈 풀기 페이지
  enterAnswer: "답변을 입력하세요...",
  answerRequired: "답변을 입력해주세요",
  submitError: "답변 제출에 실패했습니다.",
  startError: "퀴즈를 시작하는데 실패했습니다.",
  completeError: "퀴즈 완료에 실패했습니다.",
  
  // 퀴즈 결과 페이지
  resultsTitle: "퀴즈 결과",
  correctAnswers: "정답",
  answersSummary: "답변 요약",
  yourAnswer: "내 답변",
  resultsError: "결과를 불러오는데 실패했습니다.",
  resultsNotFound: "결과를 찾을 수 없습니다.",
  backToQuizzes: "퀴즈 목록으로",
  tryAgain: "다시 시도"
};

// 아랍어 번역
arTranslations.quiz = {
  // 공통 및 메뉴
  myQuizzes: "الاختبارات الخاصة بي",
  createNew: "إنشاء اختبار جديد",
  createTitle: "إنشاء اختبار",
  details: "التفاصيل",
  takeQuiz: "بدء الاختبار",
  download: "تحميل",
  downloadPdf: "تحميل PDF",
  back: "رجوع",
  questions: "الأسئلة",
  created: "تاريخ الإنشاء",
  sourceFile: "الملف الأصلي",
  question: "السؤال",
  previous: "السابق",
  next: "التالي",
  finish: "إنهاء",
  submitAnswer: "إرسال الإجابة",
  finishQuiz: "إنهاء الاختبار",
  correct: "صحيح",
  incorrect: "خطأ",
  multipleChoice: "اختيار من متعدد",
  shortAnswer: "إجابة قصيرة",
  correctAnswer: "إجابة صحيحة!",
  incorrectAnswer: "إجابة خاطئة",
  
  // 퀴즈 생성 페이지
  selectPdf: "اختر ملف PDF",
  noFiles: "لم يتم العثور على ملفات PDF. يرجى تحميل ملف PDF أولاً.",
  title: "عنوان الاختبار",
  titlePlaceholder: "أدخل عنوان الاختبار",
  titleRequiredError: "عنوان الاختبار مطلوب",
  selectFileError: "يرجى اختيار ملف PDF",
  generate: "إنشاء الاختبار",
  howItWorks: "كيف يعمل",
  generatorExplanation: "سيقوم النظام بتحليل ملف PDF المحدد وإنشاء أسئلة اختيار من متعدد وأسئلة إجابة قصيرة تلقائيًا بناءً على محتواه. يمكن أخذ الاختبار المولد عبر الإنترنت أو تنزيله كملف PDF.",
  generateError: "فشل في إنشاء الاختبار. يرجى المحاولة مرة أخرى.",
  
  // 퀴즈 목록 페이지
  noQuizzes: "لم تقم بإنشاء أي اختبارات حتى الآن.",
  createQuizPrompt: "اختر ملف PDF لإنشاء اختبارك الأول.",
  fetchError: "فشل في جلب الاختبارات. يرجى المحاولة مرة أخرى.",
  
  // 퀴즈 상세 페이지
  questionsPreview: "معاينة الأسئلة",
  fetchDetailError: "فشل في تحميل تفاصيل الاختبار. يرجى المحاولة مرة أخرى.",
  downloadError: "فشل في تحميل PDF. يرجى المحاولة مرة أخرى.",
  notFound: "لم يتم العثور على الاختبار.",
  
  // 퀴즈 풀기 페이지
  enterAnswer: "أدخل إجابتك...",
  answerRequired: "يرجى إدخال إجابة",
  submitError: "فشل في إرسال الإجابة. يرجى المحاولة مرة أخرى.",
  startError: "فشل في بدء الاختبار. يرجى المحاولة مرة أخرى.",
  completeError: "فشل في إكمال الاختبار. يرجى المحاولة مرة أخرى.",
  
  // 퀴즈 결과 페이지
  resultsTitle: "نتائج الاختبار",
  correctAnswers: "إجابات صحيحة",
  answersSummary: "ملخص الإجابات",
  yourAnswer: "إجابتك",
  resultsError: "فشل في تحميل نتائج الاختبار. يرجى المحاولة مرة أخرى.",
  resultsNotFound: "لم يتم العثور على النتائج.",
  backToQuizzes: "العودة إلى الاختبارات",
  tryAgain: "المحاولة مرة أخرى"
};

// 인도네시아어 번역
idTranslations.quiz = {
  // 공통 및 메뉴
  myQuizzes: "Kuis Saya",
  createNew: "Buat Kuis Baru",
  createTitle: "Buat Kuis",
  details: "Detail",
  takeQuiz: "Mulai Kuis",
  download: "Unduh",
  downloadPdf: "Unduh PDF",
  back: "Kembali",
  questions: "Pertanyaan",
  created: "Dibuat pada",
  sourceFile: "File Sumber",
  question: "Pertanyaan",
  previous: "Sebelumnya",
  next: "Selanjutnya",
  finish: "Selesai",
  submitAnswer: "Kirim Jawaban",
  finishQuiz: "Selesaikan Kuis",
  correct: "Benar",
  incorrect: "Salah",
  multipleChoice: "Pilihan Ganda",
  shortAnswer: "Jawaban Singkat",
  correctAnswer: "Jawaban Benar!",
  incorrectAnswer: "Jawaban Salah",
  
  // 퀴즈 생성 페이지
  selectPdf: "Pilih File PDF",
  noFiles: "Tidak ada file PDF ditemukan. Silakan unggah file PDF terlebih dahulu.",
  title: "Judul Kuis",
  titlePlaceholder: "Masukkan judul kuis",
  titleRequiredError: "Judul kuis diperlukan",
  selectFileError: "Silakan pilih file PDF",
  generate: "Hasilkan Kuis",
  howItWorks: "Cara Kerjanya",
  generatorExplanation: "Sistem akan menganalisis file PDF yang dipilih dan secara otomatis menghasilkan pertanyaan pilihan ganda dan jawaban singkat berdasarkan kontennya. Kuis yang dihasilkan dapat diambil secara online atau diunduh sebagai PDF.",
  generateError: "Gagal menghasilkan kuis. Silakan coba lagi.",
  
  // 퀴즈 목록 페이지
  noQuizzes: "Anda belum membuat kuis apa pun.",
  createQuizPrompt: "Pilih file PDF untuk membuat kuis pertama Anda.",
  fetchError: "Gagal mengambil kuis. Silakan coba lagi.",
  
  // 퀴즈 상세 페이지
  questionsPreview: "Pratinjau Pertanyaan",
  fetchDetailError: "Gagal memuat detail kuis. Silakan coba lagi.",
  downloadError: "Gagal mengunduh PDF. Silakan coba lagi.",
  notFound: "Kuis tidak ditemukan.",
  
  // 퀴즈 풀기 페이지
  enterAnswer: "Masukkan jawaban Anda...",
  answerRequired: "Harap masukkan jawaban",
  submitError: "Gagal mengirim jawaban. Silakan coba lagi.",
  startError: "Gagal memulai kuis. Silakan coba lagi.",
  completeError: "Gagal menyelesaikan kuis. Silakan coba lagi.",
  
  // 퀴즈 결과 페이지
  resultsTitle: "Hasil Kuis",
  correctAnswers: "jawaban benar",
  answersSummary: "Ringkasan Jawaban",
  yourAnswer: "Jawaban Anda",
  resultsError: "Gagal memuat hasil kuis. Silakan coba lagi.",
  resultsNotFound: "Hasil tidak ditemukan.",
  backToQuizzes: "Kembali ke Kuis",
  tryAgain: "Coba Lagi"
};

// 말레이시아어 번역
msTranslations.quiz = {
  // 공통 및 메뉴
  myQuizzes: "Kuiz Saya",
  createNew: "Cipta Kuiz Baharu",
  createTitle: "Cipta Kuiz",
  details: "Butiran",
  takeQuiz: "Ambil Kuiz",
  download: "Muat Turun",
  downloadPdf: "Muat Turun PDF",
  back: "Kembali",
  questions: "Soalan",
  created: "Dicipta pada",
  sourceFile: "Fail Sumber",
  question: "Soalan",
  previous: "Sebelumnya",
  next: "Seterusnya",
  finish: "Selesai",
  submitAnswer: "Hantar Jawapan",
  finishQuiz: "Selesai Kuiz",
  correct: "Betul",
  incorrect: "Salah",
  multipleChoice: "Pilihan Pelbagai",
  shortAnswer: "Jawapan Pendek",
  correctAnswer: "Jawapan Betul!",
  incorrectAnswer: "Jawapan Salah",
  
  // 퀴즈 생성 페이지
  selectPdf: "Pilih Fail PDF",
  noFiles: "Tiada fail PDF dijumpai. Sila muat naik fail PDF terlebih dahulu.",
  title: "Tajuk Kuiz",
  titlePlaceholder: "Masukkan tajuk kuiz",
  titleRequiredError: "Tajuk kuiz diperlukan",
  selectFileError: "Sila pilih fail PDF",
  generate: "Jana Kuiz",
  howItWorks: "Bagaimana Ia Berfungsi",
  generatorExplanation: "Sistem akan menganalisis fail PDF yang dipilih dan secara automatik menjana soalan pilihan pelbagai dan jawapan pendek berdasarkan kandungannya. Kuiz yang dijana boleh diambil dalam talian atau dimuat turun sebagai PDF.",
  generateError: "Gagal menjana kuiz. Sila cuba lagi.",
  
  // 퀴즈 목록 페이지
  noQuizzes: "Anda belum mencipta sebarang kuiz.",
  createQuizPrompt: "Pilih fail PDF untuk mencipta kuiz pertama anda.",
  fetchError: "Gagal mendapatkan kuiz. Sila cuba lagi.",
  
  // 퀴즈 상세 페이지
  questionsPreview: "Pratonton Soalan",
  fetchDetailError: "Gagal memuat butiran kuiz. Sila cuba lagi.",
  downloadError: "Gagal memuat turun PDF. Sila cuba lagi.",
  notFound: "Kuiz tidak dijumpai.",
  
  // 퀴즈 풀기 페이지
  enterAnswer: "Masukkan jawapan anda...",
  answerRequired: "Sila masukkan jawapan",
  submitError: "Gagal menghantar jawapan. Sila cuba lagi.",
  startError: "Gagal memulakan kuiz. Sila cuba lagi.",
  completeError: "Gagal menyelesaikan kuiz. Sila cuba lagi.",
  
  // 퀴즈 결과 페이지
  resultsTitle: "Keputusan Kuiz",
  correctAnswers: "jawapan betul",
  answersSummary: "Ringkasan Jawapan",
  yourAnswer: "Jawapan anda",
  resultsError: "Gagal memuat keputusan kuiz. Sila cuba lagi.",
  resultsNotFound: "Keputusan tidak dijumpai.",
  backToQuizzes: "Kembali ke Kuiz",
  tryAgain: "Cuba Lagi"
};

// 태국어 번역
thTranslations.quiz = {
  // 공통 및 메뉴
  myQuizzes: "แบบทดสอบของฉัน",
  createNew: "สร้างแบบทดสอบใหม่",
  createTitle: "สร้างแบบทดสอบ",
  details: "รายละเอียด",
  takeQuiz: "ทำแบบทดสอบ",
  download: "ดาวน์โหลด",
  downloadPdf: "ดาวน์โหลด PDF",
  back: "กลับ",
  questions: "คำถาม",
  created: "สร้างเมื่อ",
  sourceFile: "ไฟล์ต้นฉบับ",
  question: "คำถาม",
  previous: "ก่อนหน้า",
  next: "ถัดไป",
  finish: "เสร็จสิ้น",
  submitAnswer: "ส่งคำตอบ",
  finishQuiz: "จบแบบทดสอบ",
  correct: "ถูกต้อง",
  incorrect: "ไม่ถูกต้อง",
  multipleChoice: "ปรนัย",
  shortAnswer: "อัตนัย",
  correctAnswer: "คำตอบถูกต้อง!",
  incorrectAnswer: "คำตอบไม่ถูกต้อง",
  
  // 퀴즈 생성 페이지
  selectPdf: "เลือกไฟล์ PDF",
  noFiles: "ไม่พบไฟล์ PDF โปรดอัปโหลดไฟล์ PDF ก่อน",
  title: "ชื่อแบบทดสอบ",
  titlePlaceholder: "ใส่ชื่อแบบทดสอบ",
  titleRequiredError: "จำเป็นต้องใส่ชื่อแบบทดสอบ",
  selectFileError: "กรุณาเลือกไฟล์ PDF",
  generate: "สร้างแบบทดสอบ",
  howItWorks: "วิธีการทำงาน",
  generatorExplanation: "ระบบจะวิเคราะห์ไฟล์ PDF ที่เลือกและสร้างคำถามปรนัยและอัตนัยโดยอัตโนมัติตามเนื้อหา คุณสามารถทำแบบทดสอบที่สร้างขึ้นออนไลน์หรือดาวน์โหลดเป็น PDF",
  generateError: "ไม่สามารถสร้างแบบทดสอบได้ โปรดลองอีกครั้ง",
  
  // 퀴즈 목록 페이지
  noQuizzes: "คุณยังไม่ได้สร้างแบบทดสอบใด ๆ",
  createQuizPrompt: "เลือกไฟล์ PDF เพื่อสร้างแบบทดสอบแรกของคุณ",
  fetchError: "ไม่สามารถดึงข้อมูลแบบทดสอบได้ โปรดลองอีกครั้ง",
  
  // 퀴즈 상세 페이지
  questionsPreview: "ตัวอย่างคำถาม",
  fetchDetailError: "ไม่สามารถโหลดรายละเอียดแบบทดสอบได้ โปรดลองอีกครั้ง",
  downloadError: "ไม่สามารถดาวน์โหลด PDF ได้ โปรดลองอีกครั้ง",
  notFound: "ไม่พบแบบทดสอบ",
  
  // 퀴즈 풀기 페이지
  enterAnswer: "ใส่คำตอบของคุณ...",
  answerRequired: "กรุณาใส่คำตอบ",
  submitError: "ไม่สามารถส่งคำตอบได้ โปรดลองอีกครั้ง",
  startError: "ไม่สามารถเริ่มแบบทดสอบได้ โปรดลองอีกครั้ง",
  completeError: "ไม่สามารถเสร็จสิ้นแบบทดสอบได้ โปรดลองอีกครั้ง",
  
  // 퀴즈 결과 페이지
  resultsTitle: "ผลการทดสอบ",
  correctAnswers: "คำตอบที่ถูกต้อง",
  answersSummary: "สรุปคำตอบ",
  yourAnswer: "คำตอบของคุณ",
  resultsError: "ไม่สามารถโหลดผลการทดสอบได้ โปรดลองอีกครั้ง",
  resultsNotFound: "ไม่พบผลลัพธ์",
  backToQuizzes: "กลับไปที่แบบทดสอบ",
  tryAgain: "ลองอีกครั้ง"
};

// 스페인어 번역
esTranslations.quiz = {
  // 공통 및 메뉴
  myQuizzes: "Mis Cuestionarios",
  createNew: "Crear Nuevo Cuestionario",
  createTitle: "Crear Cuestionario",
  details: "Detalles",
  takeQuiz: "Realizar Cuestionario",
  download: "Descargar",
  downloadPdf: "Descargar PDF",
  back: "Volver",
  questions: "Preguntas",
  created: "Creado",
  sourceFile: "Archivo Fuente",
  question: "Pregunta",
  previous: "Anterior",
  next: "Siguiente",
  finish: "Finalizar",
  submitAnswer: "Enviar Respuesta",
  finishQuiz: "Terminar Cuestionario",
  correct: "Correcto",
  incorrect: "Incorrecto",
  multipleChoice: "Opción Múltiple",
  shortAnswer: "Respuesta Corta",
  correctAnswer: "¡Respuesta Correcta!",
  incorrectAnswer: "Respuesta Incorrecta",
  
  // 퀴즈 생성 페이지
  selectPdf: "Seleccionar Archivo PDF",
  noFiles: "No se encontraron archivos PDF. Por favor, suba un archivo PDF primero.",
  title: "Título del Cuestionario",
  titlePlaceholder: "Introduzca el título del cuestionario",
  titleRequiredError: "El título del cuestionario es obligatorio",
  selectFileError: "Por favor, seleccione un archivo PDF",
  generate: "Generar Cuestionario",
  howItWorks: "Cómo Funciona",
  generatorExplanation: "El sistema analizará el archivo PDF seleccionado y generará automáticamente preguntas de opción múltiple y respuesta corta basadas en su contenido. El cuestionario generado puede realizarse en línea o descargarse como PDF.",
  generateError: "Error al generar el cuestionario. Por favor, inténtelo de nuevo.",
  
  // 퀴즈 목록 페이지
  noQuizzes: "Aún no ha creado ningún cuestionario.",
  createQuizPrompt: "Seleccione un archivo PDF para crear su primer cuestionario.",
  fetchError: "Error al obtener los cuestionarios. Por favor, inténtelo de nuevo.",
  
  // 퀴즈 상세 페이지
  questionsPreview: "Vista Previa de Preguntas",
  fetchDetailError: "Error al cargar los detalles del cuestionario. Por favor, inténtelo de nuevo.",
  downloadError: "Error al descargar el PDF. Por favor, inténtelo de nuevo.",
  notFound: "Cuestionario no encontrado.",
  
  // 퀴즈 풀기 페이지
  enterAnswer: "Introduzca su respuesta...",
  answerRequired: "Por favor, introduzca una respuesta",
  submitError: "Error al enviar la respuesta. Por favor, inténtelo de nuevo.",
  startError: "Error al iniciar el cuestionario. Por favor, inténtelo de nuevo.",
  completeError: "Error al completar el cuestionario. Por favor, inténtelo de nuevo.",
  
  // 퀴즈 결과 페이지
  resultsTitle: "Resultados del Cuestionario",
  correctAnswers: "respuestas correctas",
  answersSummary: "Resumen de Respuestas",
  yourAnswer: "Su respuesta",
  resultsError: "Error al cargar los resultados del cuestionario. Por favor, inténtelo de nuevo.",
  resultsNotFound: "Resultados no encontrados.",
  backToQuizzes: "Volver a Cuestionarios",
  tryAgain: "Intentar de Nuevo"
};

// 영어 번역에 파일 퀴즈 관련 번역 추가
enTranslations.files = {
  ...enTranslations.files,
  createQuiz: "Create Quiz"
};

// 한국어 번역에 파일 퀴즈 관련 번역 추가
koTranslations.files = {
  ...koTranslations.files,
  createQuiz: "퀴즈 생성"
};

// 아랍어 번역에 파일 퀴즈 관련 번역 추가
arTranslations.files = {
  ...arTranslations.files,
  createQuiz: "إنشاء اختبار"
};

// 인도네시아어 번역에 파일 퀴즈 관련 번역 추가
idTranslations.files = {
  ...idTranslations.files,
  createQuiz: "Buat Kuis"
};

// 말레이시아어 번역에 파일 퀴즈 관련 번역 추가
msTranslations.files = {
  ...msTranslations.files,
  createQuiz: "Cipta Kuiz"
};

// 태국어 번역에 파일 퀴즈 관련 번역 추가
thTranslations.files = {
  ...thTranslations.files,
  createQuiz: "สร้างแบบทดสอบ"
};

// 스페인어 번역에 파일 퀴즈 관련 번역 추가
esTranslations.files = {
  ...esTranslations.files,
  createQuiz: "Crear Cuestionario"
};

// 포르투갈어(브라질) 번역에 파일 퀴즈 관련 번역 추가
ptBrTranslations.files = {
  ...ptBrTranslations.files,
  createQuiz: "Criar Questionário"
};

// 영어 번역에 퀴즈 기능 설명 추가
enTranslations.home = {
  ...enTranslations.home,
  featureQuiz: "Quiz Learning",
  featureQuizDesc: "Automatically generate quizzes from your PDF materials to effectively review and evaluate your learning."
};

// 한국어 번역에 퀴즈 기능 설명 추가
koTranslations.home = {
  ...koTranslations.home,
  featureQuiz: "퀴즈 학습",
  featureQuizDesc: "PDF 자료에서 객관식 및 주관식 퀴즈를 자동 생성하여 학습 내용을 효과적으로 복습하고 평가할 수 있습니다."
};

// 아랍어 번역에 퀴즈 기능 설명 추가
arTranslations.home = {
  ...arTranslations.home,
  featureQuiz: "التعلم بالاختبارات",
  featureQuizDesc: "قم بإنشاء اختبارات تلقائيًا من ملفات PDF الخاصة بك لمراجعة وتقييم تعلمك بشكل فعال."
};

// 인도네시아어 번역에 퀴즈 기능 설명 추가
idTranslations.home = {
  ...idTranslations.home,
  featureQuiz: "Pembelajaran Kuis",
  featureQuizDesc: "Hasilkan kuis secara otomatis dari materi PDF Anda untuk meninjau dan mengevaluasi pembelajaran Anda secara efektif."
};

// 말레이시아어 번역에 퀴즈 기능 설명 추가
msTranslations.home = {
  ...msTranslations.home,
  featureQuiz: "Pembelajaran Kuiz",
  featureQuizDesc: "Jana kuiz secara automatik daripada bahan PDF anda untuk menyemak dan menilai pembelajaran anda dengan berkesan."
};

// 태국어 번역에 퀴즈 기능 설명 추가
thTranslations.home = {
  ...thTranslations.home,
  featureQuiz: "การเรียนรู้ด้วยแบบทดสอบ",
  featureQuizDesc: "สร้างแบบทดสอบโดยอัตโนมัติจากเอกสาร PDF ของคุณเพื่อทบทวนและประเมินการเรียนรู้ของคุณอย่างมีประสิทธิภาพ"
};

// 스페인어 번역에 퀴즈 기능 설명 추가
esTranslations.home = {
  ...esTranslations.home,
  featureQuiz: "Aprendizaje con Cuestionarios",
  featureQuizDesc: "Genere automáticamente cuestionarios a partir de sus materiales PDF para revisar y evaluar su aprendizaje de manera efectiva."
};

// 포르투갈어(브라질) 번역에 퀴즈 기능 설명 추가
ptBrTranslations.home = {
  ...ptBrTranslations.home,
  featureQuiz: "Aprendizado com Questionários",
  featureQuizDesc: "Gere automaticamente questionários a partir de seus materiais em PDF para revisar e avaliar seu aprendizado de forma eficaz."
};

// 영어 번역
enTranslations.common.writing = "Writing Practice";
enTranslations.writing.handwriting = "Handwriting";
enTranslations.writing.composition = "Composition";
enTranslations.writing.myExercises = "My Composition Exercises";
enTranslations.writing.createFirst = "Create your first composition exercise";
enTranslations.writing.createNew = "New Composition Exercise";
enTranslations.writing.createExercise = "Create Composition Exercise";
enTranslations.writing.selectFile = "Select Conversation PDF";
enTranslations.writing.selectPlaceholder = "Select a file";
enTranslations.writing.selectFileHelp = "Select a conversation PDF to create a composition exercise from";
enTranslations.writing.difficulty = "Difficulty";
enTranslations.writing.exerciseCount = "Number of questions";
enTranslations.writing.exerciseCountHelp = "Number of composition questions to generate (1-10)";
enTranslations.common.cancel = "Cancel";
enTranslations.writing.noExercises = "You have no composition exercises yet";
enTranslations.writing.createButton = "Create Composition Exercise";
enTranslations.writing.titlePlaceholder = "Title for your composition exercise";
enTranslations.writing.medium = "Medium";
enTranslations.writing.questions = "Questions";
enTranslations.writing.createdAt = "Created on";
enTranslations.writing.download = "Download";
enTranslations.common.delete = "Delete";
enTranslations.writing.deleteConfirmTitle = "Delete Composition Exercise";
enTranslations.writing.deleteConfirmMessage = "Are you sure you want to delete \"{{title}}\"? This action cannot be undone.";
enTranslations.writing.deleteError = "Error deleting composition exercise";
enTranslations.writing.downloadError = "Error downloading file";

// 한국어 번역
koTranslations.common.writing = "글쓰기 연습";
koTranslations.writing.handwriting = "필기 연습";
koTranslations.writing.composition = "영작 연습";
koTranslations.writing.myExercises = "내 영작 연습";
koTranslations.writing.createFirst = "첫 영작 연습 만들기";
koTranslations.writing.createNew = "새 영작 연습";
koTranslations.writing.createExercise = "영작 연습 생성";
koTranslations.writing.selectFile = "대화 PDF 선택";
koTranslations.writing.selectPlaceholder = "파일을 선택하세요";
koTranslations.writing.selectFileHelp = "영작 연습을 생성할 대화 PDF를 선택하세요";
koTranslations.writing.difficulty = "난이도";
koTranslations.writing.exerciseCount = "문제 수";
koTranslations.writing.exerciseCountHelp = "생성할 영작 문제의 개수 (1-10)";
koTranslations.common.cancel = "취소";
koTranslations.writing.noExercises = "영작 연습이 없습니다";
koTranslations.writing.createButton = "영작 연습 생성";
koTranslations.writing.titlePlaceholder = "영작 연습의 제목";
koTranslations.writing.medium = "중간";
koTranslations.writing.questions = "문제 수";
koTranslations.writing.createdAt = "생성일";
koTranslations.writing.download = "다운로드";
koTranslations.common.delete = "삭제";
koTranslations.writing.deleteConfirmTitle = "영작 연습 삭제";
koTranslations.writing.deleteConfirmMessage = "\"{{title}}\" 영작 연습을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.";
koTranslations.writing.deleteError = "영작 연습 삭제 중 오류가 발생했습니다";
koTranslations.writing.downloadError = "파일 다운로드 중 오류가 발생했습니다";

// 스페인어 번역
esTranslations.common.writing = "Práctica de escritura";
esTranslations.writing.handwriting = "Caligrafía";
esTranslations.writing.composition = "Composición en inglés";
esTranslations.writing.myExercises = "Mis ejercicios de composición";
esTranslations.writing.createFirst = "Crea tu primer ejercicio de composición";
esTranslations.writing.createNew = "Nuevo ejercicio de composición";
esTranslations.writing.createExercise = "Crear ejercicio de composición";
esTranslations.writing.selectFile = "Seleccionar PDF de conversación";
esTranslations.writing.selectPlaceholder = "Seleccionar un archivo";
esTranslations.writing.selectFileHelp = "Seleccione un PDF de conversación para crear un ejercicio de composición";
esTranslations.writing.difficulty = "Dificultad";
esTranslations.writing.exerciseCount = "Número de preguntas";
esTranslations.writing.exerciseCountHelp = "Número de preguntas de composición a generar (1-10)";
esTranslations.common.cancel = "Cancelar";
esTranslations.writing.noExercises = "No tienes ejercicios de composición aún";
esTranslations.writing.createButton = "Crear ejercicio de composición";
esTranslations.writing.titlePlaceholder = "Título para tu ejercicio de composición";
esTranslations.writing.medium = "Medio";
esTranslations.writing.questions = "Preguntas";
esTranslations.writing.createdAt = "Creado el";
esTranslations.writing.download = "Descargar";
esTranslations.common.delete = "Eliminar";
esTranslations.writing.deleteConfirmTitle = "Eliminar ejercicio de composición";
esTranslations.writing.deleteConfirmMessage = "¿Estás seguro de que quieres eliminar \"{{title}}\"? Esta acción no se puede deshacer.";
esTranslations.writing.deleteError = "Error al eliminar el ejercicio de composición";
esTranslations.writing.downloadError = "Error al descargar el archivo";

// 포르투갈어(브라질) 번역
ptBrTranslations.common.writing = "Prática de escrita";
ptBrTranslations.writing.handwriting = "Caligrafia";
ptBrTranslations.writing.composition = "Composição em inglês";
ptBrTranslations.writing.myExercises = "Meus exercícios de composição";
ptBrTranslations.writing.createFirst = "Crie seu primeiro exercício de composição";
ptBrTranslations.writing.createNew = "Novo exercício de composição";
ptBrTranslations.writing.createExercise = "Criar exercício de composição";
ptBrTranslations.writing.selectFile = "Selecionar PDF de conversação";
ptBrTranslations.writing.selectPlaceholder = "Selecione um arquivo";
ptBrTranslations.writing.selectFileHelp = "Selecione um PDF de conversação para criar um exercício de composição";
ptBrTranslations.writing.difficulty = "Dificuldade";
ptBrTranslations.writing.exerciseCount = "Número de questões";
ptBrTranslations.writing.exerciseCountHelp = "Número de questões de composição a serem geradas (1-10)";
ptBrTranslations.common.cancel = "Cancelar";
ptBrTranslations.writing.noExercises = "Você ainda não tem exercícios de composição";
ptBrTranslations.writing.createButton = "Criar exercício de composição";
ptBrTranslations.writing.titlePlaceholder = "Título para seu exercício de composição";
ptBrTranslations.writing.medium = "Médio";
ptBrTranslations.writing.questions = "Questões";
ptBrTranslations.writing.createdAt = "Criado em";
ptBrTranslations.writing.download = "Baixar";
ptBrTranslations.common.delete = "Excluir";
ptBrTranslations.writing.deleteConfirmTitle = "Excluir exercício de composição";
ptBrTranslations.writing.deleteConfirmMessage = "Tem certeza de que deseja excluir \"{{title}}\"? Esta ação não pode ser desfeita.";
ptBrTranslations.writing.deleteError = "Erro ao excluir o exercício de composição";
ptBrTranslations.writing.downloadError = "Erro ao baixar o arquivo";

// 태국어 번역
thTranslations.common.writing = "ฝึกการเขียน";
thTranslations.writing.handwriting = "การเขียนด้วยมือ";
thTranslations.writing.composition = "การเขียนภาษาอังกฤษ";
thTranslations.writing.myExercises = "แบบฝึกหัดการเขียนของฉัน";
thTranslations.writing.createFirst = "สร้างแบบฝึกหัดการเขียนแรกของคุณ";
thTranslations.writing.createNew = "สร้างแบบฝึกหัดการเขียนใหม่";
thTranslations.writing.createExercise = "สร้างแบบฝึกหัดการเขียน";
thTranslations.writing.selectFile = "เลือกไฟล์ PDF บทสนทนา";
thTranslations.writing.selectPlaceholder = "เลือกไฟล์";
thTranslations.writing.selectFileHelp = "เลือก PDF บทสนทนาเพื่อสร้างแบบฝึกหัดการเขียน";
thTranslations.writing.difficulty = "ระดับความยาก";
thTranslations.writing.exerciseCount = "จำนวนคำถาม";
thTranslations.writing.exerciseCountHelp = "จำนวนคำถามการเขียนที่จะสร้าง (1-10)";
thTranslations.common.cancel = "ยกเลิก";
thTranslations.writing.noExercises = "คุณยังไม่มีแบบฝึกหัดการเขียน";
thTranslations.writing.createButton = "สร้างแบบฝึกหัดการเขียน";
thTranslations.writing.titlePlaceholder = "ชื่อสำหรับแบบฝึกหัดการเขียนของคุณ";
thTranslations.writing.medium = "ปานกลาง";
thTranslations.writing.questions = "คำถาม";
thTranslations.writing.createdAt = "สร้างเมื่อ";
thTranslations.writing.download = "ดาวน์โหลด";
thTranslations.common.delete = "ลบ";
thTranslations.writing.deleteConfirmTitle = "ลบแบบฝึกหัดการเขียน";
thTranslations.writing.deleteConfirmMessage = "คุณแน่ใจหรือไม่ว่าต้องการลบ \"{{title}}\"? การกระทำนี้ไม่สามารถย้อนกลับได้";
thTranslations.writing.deleteError = "เกิดข้อผิดพลาดในการลบแบบฝึกหัดการเขียน";
thTranslations.writing.downloadError = "เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์";

// 말레이시아어 번역
msTranslations.common.writing = "Latihan Menulis";
msTranslations.writing.handwriting = "Tulisan Tangan";
msTranslations.writing.composition = "Komposisi Bahasa Inggeris";
msTranslations.writing.myExercises = "Latihan Komposisi Saya";
msTranslations.writing.createFirst = "Cipta latihan komposisi pertama anda";
msTranslations.writing.createNew = "Latihan Komposisi Baharu";
msTranslations.writing.createExercise = "Cipta Latihan Komposisi";
msTranslations.writing.selectFile = "Pilih PDF Perbualan";
msTranslations.writing.selectPlaceholder = "Pilih fail";
msTranslations.writing.selectFileHelp = "Pilih PDF perbualan untuk mencipta latihan komposisi";
msTranslations.writing.difficulty = "Tahap Kesukaran";
msTranslations.writing.exerciseCount = "Bilangan soalan";
msTranslations.writing.exerciseCountHelp = "Bilangan soalan komposisi untuk dijana (1-10)";
msTranslations.common.cancel = "Batal";
msTranslations.writing.noExercises = "Anda belum mempunyai latihan komposisi";
msTranslations.writing.createButton = "Cipta Latihan Komposisi";
msTranslations.writing.titlePlaceholder = "Tajuk untuk latihan komposisi anda";
msTranslations.writing.medium = "Sederhana";
msTranslations.writing.questions = "Soalan";
msTranslations.writing.createdAt = "Dicipta pada";
msTranslations.writing.download = "Muat Turun";
msTranslations.common.delete = "Padam";
msTranslations.writing.deleteConfirmTitle = "Padam Latihan Komposisi";
msTranslations.writing.deleteConfirmMessage = "Adakah anda pasti mahu memadam \"{{title}}\"? Tindakan ini tidak boleh dibatalkan.";
msTranslations.writing.deleteError = "Ralat memadam latihan komposisi";
msTranslations.writing.downloadError = "Ralat memuat turun fail";

// 인도네시아어 번역
idTranslations.common.writing = "Latihan Menulis";
idTranslations.writing.handwriting = "Tulisan Tangan";
idTranslations.writing.composition = "Komposisi Bahasa Inggris";
idTranslations.writing.myExercises = "Latihan Komposisi Saya";
idTranslations.writing.createFirst = "Buat latihan komposisi pertama Anda";
idTranslations.writing.createNew = "Latihan Komposisi Baru";
idTranslations.writing.createExercise = "Buat Latihan Komposisi";
idTranslations.writing.selectFile = "Pilih PDF Percakapan";
idTranslations.writing.selectPlaceholder = "Pilih file";
idTranslations.writing.selectFileHelp = "Pilih PDF percakapan untuk membuat latihan komposisi";
idTranslations.writing.difficulty = "Tingkat Kesulitan";
idTranslations.writing.exerciseCount = "Jumlah pertanyaan";
idTranslations.writing.exerciseCountHelp = "Jumlah pertanyaan komposisi yang akan dibuat (1-10)";
idTranslations.common.cancel = "Batal";
idTranslations.writing.noExercises = "Anda belum memiliki latihan komposisi";
idTranslations.writing.createButton = "Buat Latihan Komposisi";
idTranslations.writing.titlePlaceholder = "Judul untuk latihan komposisi Anda";
idTranslations.writing.medium = "Menengah";
idTranslations.writing.questions = "Pertanyaan";
idTranslations.writing.createdAt = "Dibuat pada";
idTranslations.writing.download = "Unduh";
idTranslations.common.delete = "Hapus";
idTranslations.writing.deleteConfirmTitle = "Hapus Latihan Komposisi";
idTranslations.writing.deleteConfirmMessage = "Apakah Anda yakin ingin menghapus \"{{title}}\"? Tindakan ini tidak dapat dibatalkan.";
idTranslations.writing.deleteError = "Kesalahan menghapus latihan komposisi";
idTranslations.writing.downloadError = "Kesalahan mengunduh file";

// 아랍어 번역
arTranslations.common.writing = "تدريب الكتابة";
arTranslations.writing.handwriting = "الكتابة اليدوية";
arTranslations.writing.composition = "الإنشاء باللغة الإنجليزية";
arTranslations.writing.myExercises = "تمارين الإنشاء الخاصة بي";
arTranslations.writing.createFirst = "إنشاء أول تمرين إنشاء لك";
arTranslations.writing.createNew = "تمرين إنشاء جديد";
arTranslations.writing.createExercise = "إنشاء تمرين إنشاء";
arTranslations.writing.selectFile = "اختر ملف PDF للمحادثة";
arTranslations.writing.selectPlaceholder = "اختر ملفًا";
arTranslations.writing.selectFileHelp = "اختر ملف PDF للمحادثة لإنشاء تمرين إنشاء منه";
arTranslations.writing.difficulty = "مستوى الصعوبة";
arTranslations.writing.exerciseCount = "عدد الأسئلة";
arTranslations.writing.exerciseCountHelp = "عدد أسئلة الإنشاء المراد إنشاؤها (1-10)";
arTranslations.common.cancel = "إلغاء";
arTranslations.writing.noExercises = "ليس لديك تمارين إنشاء بعد";
arTranslations.writing.createButton = "إنشاء تمرين إنشاء";
arTranslations.writing.titlePlaceholder = "عنوان لتمرين الإنشاء الخاص بك";
arTranslations.writing.medium = "متوسط";
arTranslations.writing.questions = "الأسئلة";
arTranslations.writing.createdAt = "تم الإنشاء في";
arTranslations.writing.download = "تنزيل";
arTranslations.common.delete = "حذف";
arTranslations.writing.deleteConfirmTitle = "حذف تمرين الإنشاء";
arTranslations.writing.deleteConfirmMessage = "هل أنت متأكد من رغبتك في حذف \"{{title}}\"؟ لا يمكن التراجع عن هذا الإجراء.";
arTranslations.writing.deleteError = "خطأ في حذف تمرين الإنشاء";
arTranslations.writing.downloadError = "خطأ في تنزيل الملف";

// 영어 번역
enTranslations.quiz.selectOption = "Select a file";

// 한국어 번역
koTranslations.quiz.selectOption = "파일을 선택하세요";

// 스페인어 번역
esTranslations.quiz.selectOption = "Seleccionar un archivo";

// 포르투갈어(브라질) 번역
ptBrTranslations.quiz.selectOption = "Selecione um arquivo";

// 태국어 번역
thTranslations.quiz.selectOption = "เลือกไฟล์";

// 말레이시아어 번역
msTranslations.quiz.selectOption = "Pilih fail";

// 인도네시아어 번역
idTranslations.quiz.selectOption = "Pilih file";

// 아랍어 번역
arTranslations.quiz.selectOption = "اختر ملفًا";
// 영어 번역에 스크립트 관련 번역 추가
enTranslations.script = {
  title: "Script Translator",
  enterScript: "Enter your script",
  translationLanguage: "Translation Language",
  translate: "Translate",
  howItWorks: "How It Works",
  feature1: "Upload or enter your script text",
  feature2: "Choose your target translation language",
  feature3: "Receive a professional translation with proper formatting",
  feature4: "Get a linguistic analysis with key vocabulary and pronunciation",
  feature5: "Access expected questions and answers for language practice",
  processing: "Processing your script...",
  analysisResult: "Translation Analysis Result",
  detectedLanguage: "Detected Language",
  playAudio: "Play Audio",
  downloadPdf: "Download PDF",
  paragraph: "Paragraph",
  original: "Original",
  translation: "Translation",
  summary: "Summary",
  vocabulary: "Vocabulary",
  word: "Word",
  meaning: "Meaning",
  pronunciation: "Pronunciation",
  example: "Example",
  expectedQuestions: "Expected Questions",
  expectedAnswers: "Expected Answers"
};

// 한국어 번역에 스크립트 관련 번역 추가
koTranslations.script = {
  title: "스크립트 번역기",
  enterScript: "스크립트를 입력하세요",
  translationLanguage: "번역 언어",
  translate: "번역하기",
  howItWorks: "작동 방식",
  feature1: "스크립트 텍스트를 업로드하거나 입력하세요",
  feature2: "목표 번역 언어를 선택하세요",
  feature3: "올바른 형식의 전문적인 번역을 받으세요",
  feature4: "주요 어휘 및 발음이 포함된 언어 분석을 받으세요",
  feature5: "언어 연습을 위한 예상 질문과 답변에 접근하세요",
  processing: "스크립트를 처리 중입니다...",
  analysisResult: "번역 분석 결과",
  detectedLanguage: "감지된 언어",
  playAudio: "오디오 재생",
  downloadPdf: "PDF 다운로드",
  paragraph: "단락",
  original: "원문",
  translation: "번역",
  summary: "요약",
  vocabulary: "어휘",
  word: "단어",
  meaning: "의미",
  pronunciation: "발음",
  example: "예문",
  expectedQuestions: "예상 질문",
  expectedAnswers: "예상 답변"
};

// 아랍어 번역에 스크립트 관련 번역 추가
arTranslations.script = {
  title: "مترجم النصوص",
  enterScript: "أدخل النص الخاص بك",
  translationLanguage: "لغة الترجمة",
  translate: "ترجم",
  howItWorks: "كيف يعمل",
  feature1: "قم بتحميل أو إدخال نص السكريبت الخاص بك",
  feature2: "اختر لغة الترجمة المستهدفة",
  feature3: "احصل على ترجمة احترافية بتنسيق مناسب",
  feature4: "احصل على تحليل لغوي مع المفردات الرئيسية والنطق",
  feature5: "الوصول إلى الأسئلة والأجوبة المتوقعة لممارسة اللغة",
  processing: "جاري معالجة النص الخاص بك...",
  analysisResult: "نتيجة تحليل الترجمة",
  detectedLanguage: "اللغة المكتشفة",
  playAudio: "تشغيل الصوت",
  downloadPdf: "تحميل PDF",
  paragraph: "فقرة",
  original: "النص الأصلي",
  translation: "الترجمة",
  summary: "ملخص",
  vocabulary: "المفردات",
  word: "كلمة",
  meaning: "المعنى",
  pronunciation: "النطق",
  example: "مثال",
  expectedQuestions: "الأسئلة المتوقعة",
  expectedAnswers: "الإجابات المتوقعة"
};

// 인도네시아어 번역에 스크립트 관련 번역 추가
idTranslations.script = {
  title: "Penerjemah Skrip",
  enterScript: "Masukkan skrip Anda",
  translationLanguage: "Bahasa Terjemahan",
  translate: "Terjemahkan",
  howItWorks: "Cara Kerjanya",
  feature1: "Unggah atau masukkan teks skrip Anda",
  feature2: "Pilih bahasa terjemahan target Anda",
  feature3: "Dapatkan terjemahan profesional dengan format yang tepat",
  feature4: "Dapatkan analisis linguistik dengan kosakata kunci dan pengucapan",
  feature5: "Akses pertanyaan dan jawaban yang diharapkan untuk latihan bahasa",
  processing: "Memproses skrip Anda...",
  analysisResult: "Hasil Analisis Terjemahan",
  detectedLanguage: "Bahasa Terdeteksi",
  playAudio: "Putar Audio",
  downloadPdf: "Unduh PDF",
  paragraph: "Paragraf",
  original: "Asli",
  translation: "Terjemahan",
  summary: "Ringkasan",
  vocabulary: "Kosakata",
  word: "Kata",
  meaning: "Arti",
  pronunciation: "Pengucapan",
  example: "Contoh",
  expectedQuestions: "Pertanyaan yang Diharapkan",
  expectedAnswers: "Jawaban yang Diharapkan"
};

// 말레이시아어 번역에 스크립트 관련 번역 추가
msTranslations.script = {
  title: "Penterjemah Skrip",
  enterScript: "Masukkan skrip anda",
  translationLanguage: "Bahasa Terjemahan",
  translate: "Terjemah",
  howItWorks: "Cara Ia Berfungsi",
  feature1: "Muat naik atau masukkan teks skrip anda",
  feature2: "Pilih bahasa terjemahan sasaran anda",
  feature3: "Terima terjemahan profesional dengan format yang betul",
  feature4: "Dapatkan analisis linguistik dengan kosa kata utama dan sebutan",
  feature5: "Akses soalan dan jawapan yang dijangkakan untuk latihan bahasa",
  processing: "Memproses skrip anda...",
  analysisResult: "Hasil Analisis Terjemahan",
  detectedLanguage: "Bahasa Dikesan",
  playAudio: "Main Audio",
  downloadPdf: "Muat Turun PDF",
  paragraph: "Perenggan",
  original: "Asal",
  translation: "Terjemahan",
  summary: "Ringkasan",
  vocabulary: "Kosa Kata",
  word: "Perkataan",
  meaning: "Maksud",
  pronunciation: "Sebutan",
  example: "Contoh",
  expectedQuestions: "Soalan Dijangka",
  expectedAnswers: "Jawapan Dijangka"
};

// 태국어 번역에 스크립트 관련 번역 추가
thTranslations.script = {
  title: "เครื่องแปลสคริปต์",
  enterScript: "ป้อนสคริปต์ของคุณ",
  translationLanguage: "ภาษาแปล",
  translate: "แปล",
  howItWorks: "วิธีการทำงาน",
  feature1: "อัปโหลดหรือป้อนข้อความสคริปต์ของคุณ",
  feature2: "เลือกภาษาเป้าหมายในการแปล",
  feature3: "รับการแปลระดับมืออาชีพด้วยรูปแบบที่ถูกต้อง",
  feature4: "รับการวิเคราะห์ทางภาษาศาสตร์พร้อมคำศัพท์สำคัญและการออกเสียง",
  feature5: "เข้าถึงคำถามและคำตอบที่คาดหวังสำหรับการฝึกภาษา",
  processing: "กำลังประมวลผลสคริปต์ของคุณ...",
  analysisResult: "ผลการวิเคราะห์การแปล",
  detectedLanguage: "ภาษาที่ตรวจพบ",
  playAudio: "เล่นเสียง",
  downloadPdf: "ดาวน์โหลด PDF",
  paragraph: "ย่อหน้า",
  original: "ต้นฉบับ",
  translation: "การแปล",
  summary: "สรุป",
  vocabulary: "คำศัพท์",
  word: "คำ",
  meaning: "ความหมาย",
  pronunciation: "การออกเสียง",
  example: "ตัวอย่าง",
  expectedQuestions: "คำถามที่คาดหวัง",
  expectedAnswers: "คำตอบที่คาดหวัง"
};

// 스페인어 번역에 스크립트 관련 번역 추가
esTranslations.script = {
  title: "Traductor de Guiones",
  enterScript: "Introduzca su guion",
  translationLanguage: "Idioma de traducción",
  translate: "Traducir",
  howItWorks: "Cómo funciona",
  feature1: "Suba o introduzca el texto de su guion",
  feature2: "Elija su idioma de traducción objetivo",
  feature3: "Reciba una traducción profesional con el formato adecuado",
  feature4: "Obtenga un análisis lingüístico con vocabulario clave y pronunciación",
  feature5: "Acceda a preguntas y respuestas esperadas para la práctica del idioma",
  processing: "Procesando su guion...",
  analysisResult: "Resultado del análisis de traducción",
  detectedLanguage: "Idioma detectado",
  playAudio: "Reproducir audio",
  downloadPdf: "Descargar PDF",
  paragraph: "Párrafo",
  original: "Original",
  translation: "Traducción",
  summary: "Resumen",
  vocabulary: "Vocabulario",
  word: "Palabra",
  meaning: "Significado",
  pronunciation: "Pronunciación",
  example: "Ejemplo",
  expectedQuestions: "Preguntas esperadas",
  expectedAnswers: "Respuestas esperadas"
};

// 포르투갈어(브라질) 번역에 스크립트 관련 번역 추가
ptBrTranslations.script = {
  title: "Tradutor de Scripts",
  enterScript: "Digite seu script",
  translationLanguage: "Idioma de tradução",
  translate: "Traduzir",
  howItWorks: "Como funciona",
  feature1: "Carregue ou digite o texto do seu script",
  feature2: "Escolha seu idioma de tradução alvo",
  feature3: "Receba uma tradução profissional com formatação adequada",
  feature4: "Obtenha uma análise linguística com vocabulário-chave e pronúncia",
  feature5: "Acesse perguntas e respostas esperadas para prática do idioma",
  processing: "Processando seu script...",
  analysisResult: "Resultado da análise de tradução",
  detectedLanguage: "Idioma detectado",
  playAudio: "Reproduzir áudio",
  downloadPdf: "Baixar PDF",
  paragraph: "Parágrafo",
  original: "Original",
  translation: "Tradução",
  summary: "Resumo",
  vocabulary: "Vocabulário",
  word: "Palavra",
  meaning: "Significado",
  pronunciation: "Pronúncia",
  example: "Exemplo",
  expectedQuestions: "Perguntas esperadas",
  expectedAnswers: "Respostas esperadas"
};

// 메뉴에 스크립트 번역기 추가
enTranslations.common.scriptTranslator = "Script Translator";
koTranslations.common.scriptTranslator = "스크립트 번역기";
arTranslations.common.scriptTranslator = "مترجم النصوص";
idTranslations.common.scriptTranslator = "Penerjemah Skrip";
msTranslations.common.scriptTranslator = "Penterjemah Skrip";
thTranslations.common.scriptTranslator = "เครื่องแปลสคริปต์";
esTranslations.common.scriptTranslator = "Traductor de Guiones";
ptBrTranslations.common.scriptTranslator = "Tradutor de Scripts";
// 영어 번역에 common.processing 추가
enTranslations.common = {
  ...enTranslations.common,
  processing: 'Processing...'
};

// 한국어 번역에 common.processing 추가
koTranslations.common = {
  ...koTranslations.common,
  processing: '처리 중...'
};

// 아랍어 번역에 common.processing 추가
arTranslations.common = {
  ...arTranslations.common,
  processing: 'جاري المعالجة...'
};

// 인도네시아어 번역에 common.processing 추가
idTranslations.common = {
  ...idTranslations.common,
  processing: 'Memproses...'
};

// 말레이시아어 번역에 common.processing 추가
msTranslations.common = {
  ...msTranslations.common,
  processing: 'Memproses...'
};

// 태국어 번역에 common.processing 추가
thTranslations.common = {
  ...thTranslations.common,
  processing: 'กำลังประมวลผล...'
};

// 스페인어 번역에 common.processing 추가
esTranslations.common = {
  ...esTranslations.common,
  processing: 'Procesando...'
};

// 포르투갈어(브라질) 번역에 common.processing 추가
ptBrTranslations.common = {
  ...ptBrTranslations.common,
  processing: 'Processando...'
};

// script.scriptPlaceholder 번역키 추가
enTranslations.script.scriptPlaceholder = "Enter your script here...";
koTranslations.script.scriptPlaceholder = "스크립트를 입력하세요...";
arTranslations.script.scriptPlaceholder = "أدخل النص الخاص بك هنا...";
idTranslations.script.scriptPlaceholder = "Masukkan skrip Anda di sini...";
msTranslations.script.scriptPlaceholder = "Masukkan skrip anda di sini...";
thTranslations.script.scriptPlaceholder = "ป้อนสคริปต์ของคุณที่นี่...";
esTranslations.script.scriptPlaceholder = "Introduzca su guion aquí...";
ptBrTranslations.script.scriptPlaceholder = "Digite seu script aqui...";

// chat.scriptTranslator 번역키 추가 (메뉴 항목용)
enTranslations.chat.scriptTranslator = "Script Translator";
koTranslations.chat.scriptTranslator = "스크립트 번역기";
arTranslations.chat.scriptTranslator = "مترجم النصوص";
idTranslations.chat.scriptTranslator = "Penerjemah Skrip";
msTranslations.chat.scriptTranslator = "Penterjemah Skrip";
thTranslations.chat.scriptTranslator = "เครื่องแปลสคริปต์";
esTranslations.chat.scriptTranslator = "Traductor de Guiones";
ptBrTranslations.chat.scriptTranslator = "Tradutor de Scripts";

// script.resultNotFound 번역키 추가
enTranslations.script.resultNotFound = "Script result not found";
koTranslations.script.resultNotFound = "스크립트 결과를 찾을 수 없습니다";
arTranslations.script.resultNotFound = "لم يتم العثور على نتيجة النص";
idTranslations.script.resultNotFound = "Hasil skrip tidak ditemukan";
msTranslations.script.resultNotFound = "Hasil skrip tidak dijumpai";
thTranslations.script.resultNotFound = "ไม่พบผลลัพธ์สคริปต์";
esTranslations.script.resultNotFound = "Resultado del guion no encontrado";
ptBrTranslations.script.resultNotFound = "Resultado do script não encontrado";

// script.fetchResultError 번역키 추가
enTranslations.script.fetchResultError = "Error fetching script result";
koTranslations.script.fetchResultError = "스크립트 결과를 가져오는 중 오류가 발생했습니다";
arTranslations.script.fetchResultError = "خطأ في جلب نتيجة النص";
idTranslations.script.fetchResultError = "Kesalahan mengambil hasil skrip";
msTranslations.script.fetchResultError = "Ralat mendapatkan hasil skrip";
thTranslations.script.fetchResultError = "เกิดข้อผิดพลาดในการดึงผลลัพธ์สคริปต์";
esTranslations.script.fetchResultError = "Error al obtener el resultado del guion";
ptBrTranslations.script.fetchResultError = "Erro ao buscar resultado do script";

// script.downloadError 번역키 추가
enTranslations.script.downloadError = "Error downloading file";
koTranslations.script.downloadError = "파일 다운로드 중 오류가 발생했습니다";
arTranslations.script.downloadError = "خطأ في تنزيل الملف";
idTranslations.script.downloadError = "Kesalahan mengunduh file";
msTranslations.script.downloadError = "Ralat memuat turun fail";
thTranslations.script.downloadError = "เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์";
esTranslations.script.downloadError = "Error al descargar el archivo";
ptBrTranslations.script.downloadError = "Erro ao baixar o arquivo";

// script.pauseAudio 번역키 추가
enTranslations.script.pauseAudio = "Pause Audio";
koTranslations.script.pauseAudio = "오디오 일시정지";
arTranslations.script.pauseAudio = "إيقاف الصوت مؤقتا";
idTranslations.script.pauseAudio = "Jeda Audio";
msTranslations.script.pauseAudio = "Jeda Audio";
thTranslations.script.pauseAudio = "หยุดเสียงชั่วคราว";
esTranslations.script.pauseAudio = "Pausar Audio";
ptBrTranslations.script.pauseAudio = "Pausar Áudio";

// script.noVocabulary 번역키 추가
enTranslations.script.noVocabulary = "No vocabulary items found";
koTranslations.script.noVocabulary = "어휘 항목이 없습니다";
arTranslations.script.noVocabulary = "لم يتم العثور على مفردات";
idTranslations.script.noVocabulary = "Tidak ada item kosakata ditemukan";
msTranslations.script.noVocabulary = "Tiada item perbendaharaan kata dijumpai";
thTranslations.script.noVocabulary = "ไม่พบรายการคำศัพท์";
esTranslations.script.noVocabulary = "No se encontraron elementos de vocabulario";
ptBrTranslations.script.noVocabulary = "Nenhum item de vocabulário encontrado";

// script.noQuestions 번역키 추가
enTranslations.script.noQuestions = "No expected questions found";
koTranslations.script.noQuestions = "예상 질문이 없습니다";
arTranslations.script.noQuestions = "لم يتم العثور على أسئلة متوقعة";
idTranslations.script.noQuestions = "Tidak ada pertanyaan yang diharapkan ditemukan";
msTranslations.script.noQuestions = "Tiada soalan dijangka dijumpai";
thTranslations.script.noQuestions = "ไม่พบคำถามที่คาดหวัง";
esTranslations.script.noQuestions = "No se encontraron preguntas esperadas";
ptBrTranslations.script.noQuestions = "Nenhuma pergunta esperada encontrada";

// script.noAnswers 번역키 추가
enTranslations.script.noAnswers = "No expected answers found";
koTranslations.script.noAnswers = "예상 답변이 없습니다";
arTranslations.script.noAnswers = "لم يتم العثور على إجابات متوقعة";
idTranslations.script.noAnswers = "Tidak ada jawaban yang diharapkan ditemukan";
msTranslations.script.noAnswers = "Tiada jawapan dijangka dijumpai";
thTranslations.script.noAnswers = "ไม่พบคำตอบที่คาดหวัง";
esTranslations.script.noAnswers = "No se encontraron respuestas esperadas";
ptBrTranslations.script.noAnswers = "Nenhuma resposta esperada encontrada";

// chat.title 번역키 추가
enTranslations.chat.title = "Language Learning Chat";
koTranslations.chat.title = "언어 학습 채팅";
arTranslations.chat.title = "محادثة تعلم اللغة";
idTranslations.chat.title = "Obrolan Pembelajaran Bahasa";
msTranslations.chat.title = "Sembang Pembelajaran Bahasa";
thTranslations.chat.title = "แชทเรียนภาษา";
esTranslations.chat.title = "Chat de Aprendizaje de Idiomas";
ptBrTranslations.chat.title = "Chat de Aprendizado de Idiomas";

// script.downloadAudio 번역키 추가
enTranslations.script.downloadAudio = "Download Audio";
koTranslations.script.downloadAudio = "오디오 다운로드";
arTranslations.script.downloadAudio = "تحميل الصوت";
idTranslations.script.downloadAudio = "Unduh Audio";
msTranslations.script.downloadAudio = "Muat Turun Audio";
thTranslations.script.downloadAudio = "ดาวน์โหลดไฟล์เสียง";
esTranslations.script.downloadAudio = "Descargar Audio";
ptBrTranslations.script.downloadAudio = "Baixar Áudio";

// script.saveToProfile 번역키 추가
enTranslations.script.saveToProfile = "Save to Profile";
koTranslations.script.saveToProfile = "프로필에 저장";
arTranslations.script.saveToProfile = "حفظ في الملف الشخصي";
idTranslations.script.saveToProfile = "Simpan ke Profil";
msTranslations.script.saveToProfile = "Simpan ke Profil";
thTranslations.script.saveToProfile = "บันทึกไปยังโปรไฟล์";
esTranslations.script.saveToProfile = "Guardar en Perfil";
ptBrTranslations.script.saveToProfile = "Salvar no Perfil";

// files.conversationFiles 번역키 추가
enTranslations.files.conversationFiles = "Conversation Files";
koTranslations.files.conversationFiles = "대화 파일";
arTranslations.files.conversationFiles = "ملفات المحادثة";
idTranslations.files.conversationFiles = "File Percakapan";
msTranslations.files.conversationFiles = "Fail Perbualan";
thTranslations.files.conversationFiles = "ไฟล์บทสนทนา";
esTranslations.files.conversationFiles = "Archivos de Conversación";
ptBrTranslations.files.conversationFiles = "Arquivos de Conversa";

// 영어 번역 추가
enTranslations.script.saved = "Script saved successfully";
enTranslations.files.noFiles = "No files found";
enTranslations.files.delete = "Delete";

// 한국어 번역 추가
koTranslations.script.saved = "스크립트가 성공적으로 저장되었습니다";
koTranslations.files.noFiles = "파일을 찾을 수 없습니다";
koTranslations.files.delete = "삭제";

// 아랍어 번역 추가
arTranslations.script.saved = "تم حفظ النص بنجاح";
arTranslations.files.noFiles = "لم يتم العثور على ملفات";
arTranslations.files.delete = "حذف";

// 인도네시아어 번역 추가
idTranslations.script.saved = "Skrip berhasil disimpan";
idTranslations.files.noFiles = "Tidak ada file ditemukan";
idTranslations.files.delete = "Hapus";

// 말레이시아어 번역 추가
msTranslations.script.saved = "Skrip berjaya disimpan";
msTranslations.files.noFiles = "Tiada fail dijumpai";
msTranslations.files.delete = "Padam";

// 태국어 번역 추가
thTranslations.script.saved = "บันทึกสคริปต์เรียบร้อยแล้ว";
thTranslations.files.noFiles = "ไม่พบไฟล์";
thTranslations.files.delete = "ลบ";

// 스페인어 번역 추가
esTranslations.script.saved = "Guión guardado con éxito";
esTranslations.files.noFiles = "No se encontraron archivos";
esTranslations.files.delete = "Eliminar";

// 포르투갈어(브라질) 번역 추가
ptBrTranslations.script.saved = "Script salvo com sucesso";
ptBrTranslations.files.noFiles = "Nenhum arquivo encontrado";
ptBrTranslations.files.delete = "Excluir";

// 영어 번역 추가
enTranslations.common.limitReached = "Limit Reached";
enTranslations.chat.audioLimitMessage = "You have reached the maximum number of audio files. Please delete some files before saving new ones.";
enTranslations.common.manageFiles = "Manage Files";

// 한국어 번역 추가
koTranslations.common.limitReached = "한도 도달";
koTranslations.chat.audioLimitMessage = "오디오 파일의 최대 개수에 도달했습니다. 새 파일을 저장하기 전에 일부 파일을 삭제해주세요.";
koTranslations.common.manageFiles = "파일 관리";

// 아랍어 번역 추가
arTranslations.common.limitReached = "تم الوصول إلى الحد";
arTranslations.chat.audioLimitMessage = "لقد وصلت إلى الحد الأقصى لعدد ملفات الصوت. يرجى حذف بعض الملفات قبل حفظ ملفات جديدة.";
arTranslations.common.manageFiles = "إدارة الملفات";

// 인도네시아어 번역 추가
idTranslations.common.limitReached = "Batas Tercapai";
idTranslations.chat.audioLimitMessage = "Anda telah mencapai jumlah maksimum file audio. Silakan hapus beberapa file sebelum menyimpan yang baru.";
idTranslations.common.manageFiles = "Kelola File";

// 말레이시아어 번역 추가
msTranslations.common.limitReached = "Had Dicapai";
msTranslations.chat.audioLimitMessage = "Anda telah mencapai jumlah maksimum fail audio. Sila padam beberapa fail sebelum menyimpan yang baru.";
msTranslations.common.manageFiles = "Urus Fail";

// 태국어 번역 추가
thTranslations.common.limitReached = "ถึงขีดจำกัดแล้ว";
thTranslations.chat.audioLimitMessage = "คุณมีไฟล์เสียงถึงจำนวนสูงสุดแล้ว โปรดลบไฟล์บางไฟล์ก่อนบันทึกไฟล์ใหม่";
thTranslations.common.manageFiles = "จัดการไฟล์";

// 스페인어 번역 추가
esTranslations.common.limitReached = "Límite Alcanzado";
esTranslations.chat.audioLimitMessage = "Ha alcanzado el número máximo de archivos de audio. Elimine algunos archivos antes de guardar otros nuevos.";
esTranslations.common.manageFiles = "Administrar Archivos";

// 포르투갈어(브라질) 번역 추가
ptBrTranslations.common.limitReached = "Limite Atingido";
ptBrTranslations.chat.audioLimitMessage = "Você atingiu o número máximo de arquivos de áudio. Exclua alguns arquivos antes de salvar novos.";
ptBrTranslations.common.manageFiles = "Gerenciar Arquivos";

// 영어 번역 추가
enTranslations.script.no = "No";

// 한국어 번역 추가
koTranslations.script.no = "번호";

// 아랍어 번역 추가
arTranslations.script.no = "رقم";

// 인도네시아어 번역 추가
idTranslations.script.no = "Nomor";

// 말레이시아어 번역 추가
msTranslations.script.no = "Nombor";

// 태국어 번역 추가
thTranslations.script.no = "หมายเลข";

// 스페인어 번역 추가
esTranslations.script.no = "Número";

// 포르투갈어(브라질) 번역 추가
ptBrTranslations.script.no = "Número";

// 모달 메시지에 대한 다국어 리소스 추가
const modalResources = {
  ko: {
    modal: {
      storageLimit: {
        title: "저장 한도 초과",
        message1: "오디오 파일은 최대 2개까지만 저장할 수 있습니다.",
        message2: "새로운 파일을 저장하려면 프로필에서 기존 파일을 삭제해주세요."
      }
    }
  },
  en: {
    modal: {
      storageLimit: {
        title: "Storage Limit Exceeded",
        message1: "You can only store up to 2 audio files.",
        message2: "To save a new file, please delete existing files from your profile."
      }
    }
  },
  ja: {
    modal: {
      storageLimit: {
        title: "ストレージ制限超過",
        message1: "音声ファイルは最大2つまでしか保存できません。",
        message2: "新しいファイルを保存するには、プロフィールから既存のファイルを削除してください。"
      }
    }
  },
  zh: {
    modal: {
      storageLimit: {
        title: "存储限制已达上限",
        message1: "您最多只能存储2个音频文件。",
        message2: "要保存新文件，请从您的个人资料中删除现有文件。"
      }
    }
  },
  es: {
    modal: {
      storageLimit: {
        title: "Límite de Almacenamiento Excedido",
        message1: "Solo puede almacenar hasta 2 archivos de audio.",
        message2: "Para guardar un nuevo archivo, elimine los archivos existentes de su perfil."
      }
    }
  },
  fr: {
    modal: {
      storageLimit: {
        title: "Limite de Stockage Dépassée",
        message1: "Vous ne pouvez stocker que 2 fichiers audio maximum.",
        message2: "Pour enregistrer un nouveau fichier, veuillez supprimer des fichiers existants de votre profil."
      }
    }
  },
  de: {
    modal: {
      storageLimit: {
        title: "Speicherlimit Überschritten",
        message1: "Sie können nur bis zu 2 Audiodateien speichern.",
        message2: "Um eine neue Datei zu speichern, löschen Sie bitte vorhandene Dateien aus Ihrem Profil."
      }
    }
  },
  id: {
    modal: {
      storageLimit: {
        title: "Batas Penyimpanan Terlampaui",
        message1: "Anda hanya dapat menyimpan hingga 2 file audio.",
        message2: "Untuk menyimpan file baru, hapus file yang ada dari profil Anda."
      }
    }
  },
  ms: {
    modal: {
      storageLimit: {
        title: "Had Simpanan Melebihi",
        message1: "Anda hanya boleh menyimpan sehingga 2 fail audio.",
        message2: "Untuk menyimpan fail baru, sila padamkan fail sedia ada dari profil anda."
      }
    }
  },
  th: {
    modal: {
      storageLimit: {
        title: "เกินขีดจำกัดการจัดเก็บ",
        message1: "คุณสามารถเก็บไฟล์เสียงได้สูงสุด 2 ไฟล์",
        message2: "หากต้องการบันทึกไฟล์ใหม่ โปรดลบไฟล์ที่มีอยู่จากโปรไฟล์ของคุณ"
      }
    }
  },
  'pt-BR': {
    modal: {
      storageLimit: {
        title: "Limite de Armazenamento Excedido",
        message1: "Você só pode armazenar até 2 arquivos de áudio.",
        message2: "Para salvar um novo arquivo, exclua os arquivos existentes do seu perfil."
      }
    }
  },
  ar: {
    modal: {
      storageLimit: {
        title: "تم تجاوز حد التخزين",
        message1: "يمكنك تخزين ملفين صوتيين كحد أقصى.",
        message2: "لحفظ ملف جديد، يرجى حذف الملفات الموجودة من ملفك الشخصي."
      }
    }
  }
};

// 영어 (English)
i18n.addResource('en', 'translation', 'writing.maxExercisesReached', 'You can only save up to 2 writing exercises. Please delete an existing exercise to create a new one.');

// 한국어 (Korean)
i18n.addResource('ko', 'translation', 'writing.maxExercisesReached', '최대 2개의 영작 연습만 저장할 수 있습니다. 새 영작 연습을 생성하려면 기존 영작 연습을 삭제해주세요.');

// 일본어 (Japanese)
i18n.addResource('ja', 'translation', 'writing.maxExercisesReached', 'ライティング練習は最大2つまで保存できます。新しい練習を作成するには、既存の練習を削除してください。');

// 중국어 (Chinese)
i18n.addResource('zh', 'translation', 'writing.maxExercisesReached', '您最多可以保存2个写作练习。要创建新的练习，请删除现有练习。');

// 스페인어 (Spanish)
i18n.addResource('es', 'translation', 'writing.maxExercisesReached', 'Solo puede guardar hasta 2 ejercicios de escritura. Elimine un ejercicio existente para crear uno nuevo.');

// 프랑스어 (French)
i18n.addResource('fr', 'translation', 'writing.maxExercisesReached', 'Vous ne pouvez enregistrer que 2 exercices d\'écriture maximum. Veuillez supprimer un exercice existant pour en créer un nouveau.');

// 독일어 (German)
i18n.addResource('de', 'translation', 'writing.maxExercisesReached', 'Sie können nur bis zu 2 Schreibübungen speichern. Bitte löschen Sie eine vorhandene Übung, um eine neue zu erstellen.');
// 영어 번역 추가
enTranslations.files.deleteError = "Error deleting file";

// 한국어 번역 추가
koTranslations.files.deleteError = "파일 삭제 중 오류가 발생했습니다";

// 아랍어 번역 추가
arTranslations.files.deleteError = "خطأ في حذف الملف";

// 인도네시아어 번역 추가
idTranslations.files.deleteError = "Kesalahan menghapus file";

// 말레이시아어 번역 추가
msTranslations.files.deleteError = "Ralat memadam fail";

// 태국어 번역 추가
thTranslations.files.deleteError = "เกิดข้อผิดพลาดในการลบไฟล์";

// 스페인어 번역 추가
esTranslations.files.deleteError = "Error al eliminar el archivo";

// 포르투갈어(브라질) 번역 추가
ptBrTranslations.files.deleteError = "Erro ao excluir o arquivo";
// 기존 i18n 리소스에 모달 리소스 추가
Object.keys(modalResources).forEach(lang => {
  i18n.addResourceBundle(lang, 'translation', modalResources[lang], true, true);
});
// 영어
enTranslations.common.downloading = "Downloading...";
enTranslations.common.deleting = "Deleting...";

// 한국어
koTranslations.common.downloading = "다운로드 중...";
koTranslations.common.deleting = "삭제 중...";

// 아랍어
arTranslations.common.downloading = "جاري التنزيل...";
arTranslations.common.deleting = "جاري الحذف...";

// 인도네시아어
idTranslations.common.downloading = "Mengunduh...";
idTranslations.common.deleting = "Menghapus...";

// 말레이시아어
msTranslations.common.downloading = "Memuat turun...";
msTranslations.common.deleting = "Memadam...";

// 태국어
thTranslations.common.downloading = "กำลังดาวน์โหลด...";
thTranslations.common.deleting = "กำลังลบ...";

// 스페인어
esTranslations.common.downloading = "Descargando...";
esTranslations.common.deleting = "Eliminando...";

// 포르투갈어(브라질)
ptBrTranslations.common.downloading = "Baixando...";
ptBrTranslations.common.deleting = "Excluindo...";



export default i18n;