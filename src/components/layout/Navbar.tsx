import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, ShieldCheck, Instagram, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';

export const Navbar: React.FC = () => {
  const { settings, setIsAdminOpen, startBookingFor, activeView, navigateTo, myBookings, setIsMyBookingsOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open without layout shift
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

  const navLinks: { label: string; view: ActiveView }[] = [
    { label: 'الرئيسية', view: 'home' },
    { label: 'الأقسام', view: 'departments' },
    { label: 'الخدمات', view: 'services' },
    { label: 'أعمالنا', view: 'gallery' },
    { label: 'عن Style City', view: 'about' },
    { label: 'تواصل معنا', view: 'contact' },
  ];

  const handleLinkClick = (view: ActiveView) => {
    setMobileMenuOpen(false);
    navigateTo(view);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-[#0B0A09]/95 backdrop-blur-md border-b border-[#B99A5B]/30 shadow-[0_4px_25px_rgba(0,0,0,0.7)] flex items-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Logo
                variant="compact"
                onClick={() => navigateTo('home')}
                className="cursor-pointer"
              />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
              {navLinks.map((link) => {
                const isActive = activeView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.view)}
                    className={`transition-all duration-200 cursor-pointer relative py-1 group ${
                      isActive ? 'text-[#F5F1EA] font-bold' : 'text-[#D8D0C4] hover:text-[#F5F1EA]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B99A5B] transition-transform duration-300 origin-center ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* My Bookings Button */}
              <button
                onClick={() => setIsMyBookingsOpen(true)}
                title="متابعة حالة حجوزاتي"
                aria-label="متابعة حالة حجوزاتي"
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-sm border text-xs font-semibold transition-all cursor-pointer ${
                  myBookings.length > 0
                    ? 'bg-[#B99A5B]/15 text-[#F5F1EA] border-[#B99A5B]/60 hover:bg-[#B99A5B]/25 hover:border-[#B99A5B] shadow-[0_0_15px_rgba(185,154,91,0.25)]'
                    : 'bg-white/5 text-[#D8D0C4]/80 border-white/10 hover:border-[#B99A5B]/40 hover:text-[#F5F1EA]'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>حجوزاتي</span>
                {myBookings.length > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#B99A5B] text-[#0B0A09] text-[10px] font-bold flex items-center justify-center">
                    {myBookings.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsAdminOpen(true)}
                title="لوحة تحكم الإدارة"
                aria-label="لوحة تحكم الإدارة"
                className="p-2 text-[#D8D0C4]/70 hover:text-[#B99A5B] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigateTo('booking')}
                className={`relative group overflow-hidden px-6 py-2.5 rounded-sm font-semibold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeView === 'booking'
                    ? 'bg-[#B99A5B] text-[#0B0A09] shadow-[0_0_20px_rgba(185,154,91,0.5)]'
                    : 'bg-gradient-to-r from-[#CBB279] via-[#B99A5B] to-[#9E8043] text-[#0B0A09] hover:shadow-[0_0_20px_rgba(185,154,91,0.4)]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  احجز الآن
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
              {/* 1. حجوزاتي */}
              <button
                onClick={() => setIsMyBookingsOpen(true)}
                title="حجوزاتي"
                aria-label="حجوزاتي"
                className={`h-9 px-2 sm:px-2.5 rounded-sm border transition-all flex items-center gap-1.5 text-xs cursor-pointer select-none active:scale-95 ${
                  myBookings.length > 0
                    ? 'bg-[#B99A5B]/20 text-[#F5F1EA] border-[#B99A5B]/60 shadow-[0_0_12px_rgba(185,154,91,0.25)]'
                    : 'bg-white/5 text-[#D8D0C4]/80 border-white/10 hover:border-[#B99A5B]/40'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#B99A5B] shrink-0" />
                <span className="text-[11px] font-semibold whitespace-nowrap">حجوزاتي</span>
                {myBookings.length > 0 && (
                  <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-[#B99A5B] text-[#0B0A09] text-[9px] font-bold flex items-center justify-center shrink-0">
                    {myBookings.length}
                  </span>
                )}
              </button>

              {/* 2. لوحة الإدارة */}
              <button
                onClick={() => setIsAdminOpen(true)}
                title="لوحة التحكم"
                aria-label="لوحة التحكم"
                className="w-9 h-9 rounded-sm flex items-center justify-center text-[#D8D0C4]/70 hover:text-[#B99A5B] bg-white/5 border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>

              {/* 3. القائمة (أيقونة الخطوط الثلاثة) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`w-9 h-9 rounded-sm flex items-center justify-center transition-all active:scale-95 border cursor-pointer ${
                  mobileMenuOpen
                    ? 'bg-[#B99A5B] text-[#0B0A09] border-[#B99A5B]'
                    : 'bg-white/5 text-[#F5F1EA] hover:text-[#B99A5B] border-white/10'
                }`}
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 transition-transform duration-200" /> : <Menu className="w-5 h-5 transition-transform duration-200" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu (Opens smoothly below fixed header with zero jump) */}
      {mobileMenuOpen && (
        <div
          className="fixed top-[68px] inset-x-0 bottom-0 z-45 lg:hidden bg-[#0B0A09]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto overscroll-contain animate-fade-in shadow-2xl"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Subtle luxury ambient lighting */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#B99A5B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#B99A5B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Drawer Central Navigation Links */}
          <div className="relative z-10 px-5 sm:px-8 py-5 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
            <div className="text-center mb-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#B99A5B] font-semibold block mb-1">
                STYLE CITY BAGHDAD
              </span>
              <p className="text-xs text-[#D8D0C4]/80 font-light">
                {settings.brand_arabic_tagline} <span className="text-[#B99A5B]">✨</span>
              </p>
            </div>

            {/* My Bookings Card in Drawer */}
            <div className="mb-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsMyBookingsOpen(true);
                }}
                className="w-full p-3 bg-[#151310] hover:bg-[#B99A5B]/15 border border-[#B99A5B]/40 hover:border-[#B99A5B] rounded-sm flex items-center justify-between text-right transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B99A5B]/20 text-[#B99A5B] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#F5F1EA] block">حجوزاتي</span>
                    <span className="text-[11px] text-[#D8D0C4]/70">
                      {myBookings.length > 0
                        ? `لديكِ ${myBookings.length} حجز (موافق عليه · انتظار)`
                        : 'متابعة حالة حجوزاتكِ السابقة'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {myBookings.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#B99A5B] text-[#0B0A09] text-xs font-bold">
                      {myBookings.length}
                    </span>
                  )}
                  <span className="text-[#B99A5B] text-sm">←</span>
                </div>
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = activeView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.view)}
                    className={`text-right py-3 px-4 rounded-sm transition-all flex items-center justify-between cursor-pointer active:scale-98 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#B99A5B]/25 to-transparent text-[#B99A5B] font-bold border-r-2 border-[#B99A5B]'
                        : 'text-[#F5F1EA] hover:text-[#B99A5B] hover:bg-white/5'
                    }`}
                  >
                    <span className="font-serif-luxury text-lg sm:text-xl">{link.label}</span>
                    <span className="text-[#B99A5B] text-base font-light">←</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer Actions */}
          <div className="relative z-10 px-5 sm:px-8 py-4 border-t border-[#B99A5B]/20 bg-[#0E0C0A] max-w-lg mx-auto w-full flex flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('booking');
              }}
              className="w-full py-3 bg-gradient-to-r from-[#D4BD86] via-[#B99A5B] to-[#9E8043] text-[#0B0A09] font-bold text-xs sm:text-sm rounded-sm text-center shadow-[0_0_20px_rgba(185,154,91,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز الآن</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-[#F5F1EA] text-xs rounded-sm border border-white/10 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>اتصال مباشر</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن خدمات Style City')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs rounded-sm border border-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب مباشر</span>
              </a>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#D8D0C4]/70 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>المنصور – شارع الأميرات</span>
              </div>
              <a
                href={settings.instagram_main}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#B99A5B] hover:underline"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{settings.instagram_main_handle}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
