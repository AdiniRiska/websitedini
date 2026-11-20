import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Play,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ADINI_PORTRAIT,
  EXPERIENCES,
  PROFILE_INFO,
  PROJECTS,
  ProjectItem,
  SKILLS_SUMMARY,
  SKILL_FOCUS_TABS,
  TRAININGS,
} from '../data/portfolioData';

interface PortfolioViewProps {
  onNavigateCatalog: () => void;
  onNotify: (msg: string) => void;
}

const RevealSection: React.FC<{
  children: React.ReactNode;
  id?: string;
  className?: string;
}> = ({ children, id, className = '' }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </section>
  );
};

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onNavigateCatalog,
  onNotify,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expFilter, setExpFilter] = useState<'Semua' | 'IT & Akademik' | 'Sukarelawan'>('Semua');
  const [quickQuery, setQuickQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const activeSkill = SKILL_FOCUS_TABS[0];

  const filteredExperiences =
    expFilter === 'Semua'
      ? EXPERIENCES
      : EXPERIENCES.filter((item) => item.category === expFilter);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickJump = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim().toLowerCase();
    if (!q) {
      scrollToSection('tentang');
      return;
    }
    if (q.includes('katalog') || q.includes('produk') || q.includes('baju') || q.includes('fashion')) {
      onNavigateCatalog();
      return;
    }
    if (q.includes('pengalaman') || q.includes('volunteer') || q.includes('lepkom') || q.includes('semai')) {
      scrollToSection('pengalaman');
      return;
    }
    if (q.includes('proyek') || q.includes('project') || q.includes('mysql') || q.includes('java')) {
      scrollToSection('proyek');
      return;
    }
    if (q.includes('kontak') || q.includes('email') || q.includes('instagram')) {
      scrollToSection('kontak');
      return;
    }
    scrollToSection('tentang');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      onNotify('Mohon lengkapi nama, email, dan pesan terlebih dahulu.');
      return;
    }
    setContactSubmitted(true);
    onNotify('Pesan Anda telah terkirim ke Adini Riska Putri.');
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <div className="min-h-screen bg-pastel-grid text-[#2A2428] relative">
      {/* Soft transparent geometric shapes for visual depth */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#F8D2E0]/35 blur-2xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#C7E0DA]/40 blur-2xl" />
        <div className="absolute bottom-12 left-1/4 w-72 h-72 rounded-full bg-[#FAF0A1]/30 blur-2xl" />
      </div>

      {/* Top Navigation Bar — 3-Zone Contract matching the signature Rosy Pink bar */}
      <header className="sticky top-0 z-40 bg-[#CC5884] text-white border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <a
            href="#beranda"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('beranda');
            }}
            className="font-[Georgia] italic text-xl font-semibold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Adini&apos;s Corner
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Navigasi Portfolio"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-white/95"
          >
            <button
              type="button"
              onClick={() => scrollToSection('beranda')}
              className="hover:text-[#FAF0A1] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('tentang')}
              className="hover:text-[#FAF0A1] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tentang Saya
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pengalaman')}
              className="hover:text-[#FAF0A1] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Pengalaman
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('proyek')}
              className="hover:text-[#FAF0A1] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Proyek
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('kontak')}
              className="hover:text-[#FAF0A1] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kontak
            </button>
          </nav>

          {/* Zone 3: 1 Primary Special Tab ("Katalog Produk" -> katalog.php) */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/katalog.php"
              onClick={(e) => {
                e.preventDefault();
                onNavigateCatalog();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FAF0A1] text-[#2A2428] text-xs sm:text-sm font-semibold hover:bg-white transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#CC5884]" />
              <span>Katalog Produk</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Buka menu navigasi"
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#BD4B76] border-t border-white/15 px-4 py-3 flex flex-col gap-2">
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'tentang', label: 'Tentang Saya' },
              { id: 'pengalaman', label: 'Pengalaman' },
              { id: 'proyek', label: 'Proyek' },
              { id: 'kontak', label: 'Kontak' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="text-left py-2.5 px-3 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section id="beranda" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-14 md:pt-14 md:pb-20">
          <div className="max-w-3xl space-y-6 animate-fade-up">
            <h1 className="font-[Georgia] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2A2428] leading-[1.12]">
              Welcome to{' '}
              <span className="font-[Georgia] text-[#CC5884] italic font-semibold">Adini&apos;s</span>{' '}
              corner!
            </h1>

            <p className="text-sm sm:text-base text-[#6B5B63] max-w-xl leading-relaxed">
              Ruang digital untuk mengenal perjalanan akademik saya di Sistem Informasi Universitas Gunadarma, kontribusi sosial sebagai sukarelawan, serta karya desain dan pengembangan aplikasi.
            </p>

            {/* Signature PLAY-inspired CTA block from reference image */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('tentang')}
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#C7E0DA] border-2 border-[#A6CBC2] hover:bg-[#B8D7CF] transition-all duration-200 shadow-sm cursor-pointer"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#CC5884] text-white">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span className="font-bold tracking-wide text-sm text-[#2A2428]">
                  JELAJAHI PROFIL
                </span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('proyek')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/80 border border-[#E5DCE0] text-sm font-semibold text-[#2A2428] hover:border-[#CC5884] hover:text-[#CC5884] transition-colors cursor-pointer"
              >
                <span>Lihat Proyek Pilihan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SIGNATURE ROSY PINK SEARCH / DIVIDER BAR (Directly inspired by reference) */}
        <div className="bg-[#CC5884] py-4 border-y border-white/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <form
              onSubmit={handleQuickJump}
              className="w-full sm:max-w-md flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="cari profil, pengalaman, proyek, atau katalog..."
                  aria-label="Pencarian cepat bagian portfolio"
                  className="w-full bg-[#FAF0A1] text-[#2A2428] placeholder-[#6B5B63] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full border border-[#E6D97A] focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                aria-label="Cari bagian"
                className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="font-[Georgia] italic text-2xl font-semibold text-white tracking-wide">
              Adini&apos;s Corner
            </div>
          </div>
        </div>

        {/* ABOUT ME SECTION — PALE JADE GRID SHOWCASE */}
        <RevealSection id="tentang" className="bg-jade-grid py-14 md:py-20 border-b border-[#B2CFC8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Rosy Pink Interactive Bio Card (matching reference left card) */}
              <div className="lg:col-span-5 flex">
                <div className="w-full h-[500px] rounded-3xl bg-[#CC5884] p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium tracking-wider uppercase text-white/85">
                      Profil Singkat
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToSection('kontak')}
                      className="w-8 h-8 rounded-full bg-white text-[#CC5884] flex items-center justify-center hover:bg-[#FAF0A1] transition-colors cursor-pointer"
                      aria-label="Hubungi Adini"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative my-2 flex flex-col items-center">
                    <div className="max-w-full rounded-2xl overflow-hidden border-4 border-white/85 shadow-md bg-[#F8D2E0]">
                      <img
                        src={ADINI_PORTRAIT}
                        alt="Adini Riska Putri"
                        referrerPolicy="no-referrer"
                        className="w-[300px] max-w-full h-[320px] object-cover object-center"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="text-center">
                      <p className="font-[Georgia] text-xl font-semibold">{PROFILE_INFO.fullName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Tabs + 2 Engaging Paragraphs + Skill Highlights */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-5">
                <div>
                  <h2 className="font-[Georgia] text-3xl sm:text-4xl font-bold text-[#2A2428] mb-2">
                    Tentang Saya
                  </h2>
                  <p className="text-sm text-[#4F4349]">
                    Mengenal latar belakang akademik, minat teknologi informasi, dan dedikasi sosial saya.
                  </p>
                </div>

                {/* Clean Typographic Skill Labels (non-button) */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-semibold text-[#3D4E4A]">
                  {SKILL_FOCUS_TABS.map((tab, idx) => (
                    <React.Fragment key={tab.id}>
                      {idx > 0 && <span aria-hidden="true" className="text-[#CC5884]">·</span>}
                      <span>{tab.label}</span>
                    </React.Fragment>
                  ))}
                </div>

                {/* Glassmorphic Soft-Pink Card containing the 2 requested About Me paragraphs */}
                <div className="glass-pink-card rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
                  <p className="text-sm sm:text-[15px] leading-relaxed text-[#2A2428]">
                    {PROFILE_INFO.aboutParagraph1}
                  </p>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-[#2A2428]">
                    {PROFILE_INFO.aboutParagraph2}
                  </p>
                </div>

                {/* Interactive Skill Focus Detail Box (styled after the pink selection bars in reference) */}
                <div className="rounded-2xl bg-[#CC5884] text-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-[#FAF0A1]">
                      Fokus Keahlian Terpilih · {activeSkill.label}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">{activeSkill.roleTitle}</h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                      {activeSkill.summary}
                    </p>
                  </div>
                  <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#FAF0A1] text-[#2A2428] text-xs font-bold whitespace-nowrap">
                      {activeSkill.tools.join(' · ')}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#FAF0A1]/70 border border-[#E6D97A] p-4 text-xs sm:text-sm text-[#2A2428]">
                  <span className="font-semibold">Soft Skills Utama: </span>
                  <span>{SKILLS_SUMMARY.softSkills.join(' · ')}</span>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* EXPERIENCE & VOLUNTEER SECTION */}
        <RevealSection id="pengalaman" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#CC5884] mb-2">
                Perjalanan & Kontribusi
              </p>
              <h2 className="font-[Georgia] text-3xl sm:text-4xl font-bold text-[#2A2428]">
                Pengalaman & Sukarelawan
              </h2>
            </div>

            {/* Interactive Category Filter */}
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-xl bg-white/80 border border-[#E8DFE3] shadow-sm self-start">
              {(['Semua', 'IT & Akademik', 'Sukarelawan'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setExpFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    expFilter === tab
                      ? 'bg-[#CC5884] text-white'
                      : 'text-[#5C4F56] hover:text-[#2A2428]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Structured Experience List */}
          <div className="space-y-5">
            {filteredExperiences.map((exp, idx) => {
              const cardTint =
                idx % 3 === 0
                  ? 'bg-white/85'
                  : idx % 3 === 1
                  ? 'bg-[#F8D2E0]/30'
                  : 'bg-[#C7E0DA]/35';

              return (
                <article
                  key={exp.id}
                  className={`glass-card ${cardTint} rounded-3xl p-6 sm:p-8 transition-transform duration-200 hover:-translate-y-0.5`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-xs font-medium text-[#CC5884] mb-1">
                        <span>{exp.category}</span>
                        <span className="mx-2" aria-hidden="true">·</span>
                        <span>{exp.location}</span>
                      </div>
                      <h3
                        className={`text-xl font-bold text-[#2A2428] ${
                          idx === 0 ? "font-['Plus_Jakarta_Sans']" : ''
                        }`}
                      >
                        {exp.role}
                      </h3>
                      <p className="text-sm font-medium text-[#5C4F56] mt-0.5">
                        {exp.organization}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-medium text-[#2A2428] bg-[#FAF0A1]/80 px-3.5 py-1.5 rounded-xl self-start shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-[#CC5884]" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-sm sm:text-[15px] text-[#3F363B] leading-relaxed">
                    {exp.highlights.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#CC5884] shrink-0 mt-1" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          {/* Trainings Strip */}
          <div className="mt-10">
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-2.5 text-[#CC5884] font-semibold text-sm mb-4">
                <Award className="w-4 h-4" />
                <span>Pelatihan, Kursus & Workshop</span>
              </div>
              <div className="divide-y divide-[#2A2428]/10">
                {TRAININGS.map((t) => (
                  <div
                    key={t.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-[#2A2428]">
                        {t.title}
                      </p>
                      <p className="text-xs text-[#6B5B63]">{t.organizer}</p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#CC5884] tabular-nums">
                      {t.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* PROJECTS SECTION — ROSY HEADER BAR + GLASSMORPHISM GRID */}
        <RevealSection id="proyek" className="pb-16 md:pb-24">
          <div className="bg-[#CC5884] py-4 mb-12 border-y border-white/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              <h2 className="font-[Georgia] italic text-2xl sm:text-3xl font-semibold text-white">
                Proyek & Karya Pilihan
              </h2>
              <span className="text-xs sm:text-sm font-medium text-[#FAF0A1]">
                4 Karya Terkurasi
              </span>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {PROJECTS.map((project) => (
                <article
                  key={project.id}
                  className={`glass-card ${project.accentBg} rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div>
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[#F2ECEF] relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="p-6 sm:p-7 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#6B5B63]">
                        <span className="text-[#CC5884] font-semibold">{project.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{project.year}</span>
                      </div>

                      <h3 className="font-[Georgia] text-[21px] font-bold text-[#2A2428]">
                        {project.title}
                      </h3>

                      <p className="text-sm text-[#4F4349] leading-relaxed whitespace-pre-line">
                        {project.summary}
                      </p>

                      <div className="pt-1 text-xs font-medium text-[#5C4F56]">
                        Teknologi: {project.stack.join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 sm:px-7 pb-6 pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-xs sm:text-sm font-semibold text-[#2A2428] border border-[#E5DCE0] transition-colors cursor-pointer"
                    >
                      Detail Proyek
                    </button>

                    {project.linksToCatalog && (
                      <a
                        href="/katalog.php"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigateCatalog();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CC5884] hover:bg-[#B84772] text-xs sm:text-sm font-semibold text-white transition-colors"
                      >
                        <span>Buka Katalog Produk</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CONTACT SECTION */}
        <RevealSection id="kontak" className="bg-[#C7E0DA]/55 border-t border-[#B2CFC8] py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Info */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#CC5884] mb-2">
                    Mari Terhubung
                  </p>
                  <h2 className="font-[Georgia] text-3xl sm:text-4xl font-bold text-[#2A2428]">
                    Kontak & Kolaborasi
                  </h2>
                  <p className="text-sm sm:text-base text-[#4F4349] mt-3 leading-relaxed">
                    Terbuka untuk diskusi seputar pengolahan data, pengembangan aplikasi web, maupun kegiatan sukarelawan yang berdampak positif.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#CC5884] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B5B63]">Email Pribadi</p>
                      <a
                        href={`mailto:${PROFILE_INFO.email}`}
                        className="text-sm font-semibold text-[#2A2428] hover:text-[#CC5884] transition-colors"
                      >
                        {PROFILE_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Instagram className="w-5 h-5 text-[#CC5884] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B5B63]">Instagram</p>
                      <a
                        href={PROFILE_INFO.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-[#2A2428] hover:text-[#CC5884] transition-colors"
                      >
                        {PROFILE_INFO.instagramHandle}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#CC5884] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B5B63]">Domisili</p>
                      <p className="text-sm font-semibold text-[#2A2428]">
                        {PROFILE_INFO.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Contact Form */}
              <div className="lg:col-span-7">
                <div className="glass-card rounded-3xl p-6 sm:p-8">
                  {contactSubmitted ? (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-[#C7E0DA] text-[#2A2428] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6 text-[#CC5884]" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#2A2428]">
                        Terima Kasih Telah Menghubungi!
                      </h3>
                      <p className="text-sm text-[#4F4349] max-w-md mx-auto">
                        Pesan Anda sudah diterima. Saya akan membalas melalui email dalam waktu 1–2 hari kerja.
                      </p>
                      <button
                        type="button"
                        onClick={() => setContactSubmitted(false)}
                        className="px-5 py-2.5 rounded-xl bg-[#CC5884] text-white text-sm font-semibold hover:bg-[#B84772] transition-colors cursor-pointer"
                      >
                        Kirim Pesan Lainnya
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="portfolio-name"
                            className="block text-xs font-semibold text-[#4F4349] mb-1.5"
                          >
                            Nama Lengkap
                          </label>
                          <input
                            id="portfolio-name"
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Nama Anda"
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9DD] text-sm focus:outline-none focus:border-[#CC5884]"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="portfolio-email"
                            className="block text-xs font-semibold text-[#4F4349] mb-1.5"
                          >
                            Alamat Email
                          </label>
                          <input
                            id="portfolio-email"
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9DD] text-sm focus:outline-none focus:border-[#CC5884]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="portfolio-subject"
                          className="block text-xs font-semibold text-[#4F4349] mb-1.5"
                        >
                          Topik / Subjek
                        </label>
                        <input
                          id="portfolio-subject"
                          type="text"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="Misalnya: Kolaborasi Proyek atau Kegiatan Sukarelawan"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9DD] text-sm focus:outline-none focus:border-[#CC5884]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="portfolio-message"
                          className="block text-xs font-semibold text-[#4F4349] mb-1.5"
                        >
                          Pesan
                        </label>
                        <textarea
                          id="portfolio-message"
                          rows={4}
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Tuliskan pesan atau detail kebutuhan Anda di sini..."
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9DD] text-sm focus:outline-none focus:border-[#CC5884]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#CC5884] hover:bg-[#B84772] text-white text-sm font-semibold transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Kirim Pesan</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </main>

      {/* Clean Footer */}
      <footer className="bg-[#CC5884] text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p>© 2026 {PROFILE_INFO.fullName}</p>
          <div className="flex items-center gap-5">
            <a
              href={PROFILE_INFO.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FAF0A1] transition-colors"
            >
              Instagram
            </a>
            <a
              href="/katalog.php"
              onClick={(e) => {
                e.preventDefault();
                onNavigateCatalog();
              }}
              className="font-semibold text-[#FAF0A1] hover:underline"
            >
              Katalog Produk →
            </a>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#EDE3E7]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/9] w-full bg-[#F2ECEF] relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Tutup detail proyek"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-[#2A2428] flex items-center justify-center hover:bg-white shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="text-xs font-medium text-[#CC5884]">
                <span>{selectedProject.category}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span className="font-mono">{selectedProject.year}</span>
              </div>
              <h3 id="project-modal-title" className="font-serif text-2xl font-bold text-[#2A2428]">
                {selectedProject.title}
              </h3>
              <p className="text-sm sm:text-base text-[#4F4349] leading-relaxed">
                {selectedProject.description}
              </p>
              <div className="pt-2 border-t border-[#EEE6EA] text-xs sm:text-sm text-[#5C4F56]">
                <span className="font-semibold text-[#2A2428]">Perangkat & Teknologi: </span>
                <span>{selectedProject.stack.join(' · ')}</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                {selectedProject.linksToCatalog && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(null);
                      onNavigateCatalog();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#CC5884] text-white text-sm font-semibold hover:bg-[#B84772] transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Kunjungi Katalog Produk</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#F6F5F0] text-[#2A2428] text-sm font-semibold hover:bg-[#EAE7DF] transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
