import React from 'react';
import {
  MapPin,
  Phone,
  Instagram,
  Facebook,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { settings, departments, setIsAdminOpen, navigateTo } = useApp();

  return (
    <footer className="bg-[#070605] border-t border-[#B99A5B]/25 text-[#D8D0C4] pt-12 pb-24 lg:pb-12 px-4 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B99A5B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top VIP Highlights Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-3.5 p-4 rounded-sm bg-white/[0.02] border border-[#B99A5B]/15">
            <div className="w-10 h-10 rounded-sm bg-[#B99A5B]/10 border border-[#B99A5B]/30 flex items-center justify-center text-[#B99A5B] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#B99A5B] block font-medium">
                ساعات الاستقبال اليومية
              </span>
              <p className="text-xs text-[#F5F1EA] font-semibold mt-0.5">
                يومياً من 10:00 صباحاً – 10:00 مساءً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-sm bg-white/[0.02] border border-[#B99A5B]/15">
            <div className="w-10 h-10 rounded-sm bg-[#B99A5B]/10 border border-[#B99A5B]/30 flex items-center justify-center text-[#B99A5B] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#B99A5B] block font-medium">
                الموقع الحصري
              </span>
              <p className="text-xs text-[#F5F1EA] font-semibold mt-0.5">
                المنصور – شارع الأميرات – بغداد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-sm bg-white/[0.02] border border-[#B99A5B]/15">
            <div className="w-10 h-10 rounded-sm bg-[#B99A5B]/10 border border-[#B99A5B]/30 flex items-center justify-center text-[#B99A5B] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#B99A5B] block font-medium">
                معايير فندقية وخصوصية
              </span>
              <p className="text-xs text-[#F5F1EA] font-semibold mt-0.5">
                أعلى معايير التعقيم والراحة والخصوصية
              </p>
            </div>
          </div>
        </div>

        {/* Main 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10 items-start text-right">
          {/* Column 1: Brand & Identity (Span 6) */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <button
              onClick={() => navigateTo('home')}
              className="text-right cursor-pointer group mb-3"
            >
              <span className="text-xl sm:text-2xl font-serif-luxury text-[#F5F1EA] font-semibold tracking-wide block group-hover:text-[#B99A5B] transition-colors">
                {settings.brand_name}
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#B99A5B] uppercase block">
                The City of Beauty
              </span>
            </button>
            <p className="text-sm text-[#F5F1EA] font-arabic-luxury mb-3 leading-relaxed">
              {settings.brand_arabic_tagline} <span className="text-[#B99A5B]">✨</span>
            </p>
            <p className="text-xs text-[#D8D0C4]/70 font-light leading-relaxed mb-5 max-w-md">
              عالم متكامل للعناية والجمال في المنصور، يجمع أرقى خدمات الرموش، الأظافر، التجميل، والفيبروز بمعايير فندقية وطبية فائقة الدقة.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#D8D0C4]/80 mb-6">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 hover:text-[#B99A5B] transition-colors"
                dir="ltr"
              >
                <Phone className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>{settings.phone}</span>
              </a>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>المنصور – شارع الأميرات</span>
              </div>
            </div>

            {/* Social channels with labels */}
            <div>
              <span className="text-[11px] text-[#B99A5B] font-medium block mb-2">تابعونا على:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={settings.instagram_main}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-[#B99A5B] hover:text-[#0B0A09] rounded-sm text-[#D8D0C4] transition-all border border-white/10"
                  title="حساب Instagram الرئيسي"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.instagram_beauty}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-[#B99A5B] hover:text-[#0B0A09] rounded-sm text-[#D8D0C4] transition-all border border-white/10"
                  title="حساب Instagram التجميلي"
                  aria-label="Instagram Beauty"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-[#B99A5B] hover:text-[#0B0A09] rounded-sm text-[#D8D0C4] transition-all border border-white/10"
                  title="صفحة Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: الأقسام المتخصصة (Span 3) - Only Arabic */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-[#B99A5B] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B99A5B]" />
              <span>الأقسام الرئيسية</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              {departments.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      navigateTo('departments');
                    }}
                    className="hover:text-[#B99A5B] transition-colors cursor-pointer flex items-center justify-between w-full group py-0.5"
                  >
                    <span className="text-[#D8D0C4]/85 group-hover:text-[#F5F1EA] transition-colors">
                      {dept.name_ar}
                    </span>
                    <span className="text-[#B99A5B]/40 group-hover:text-[#B99A5B] transition-colors text-xs">
                      ←
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: روابط سريعة (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-[#B99A5B] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B99A5B]" />
              <span>روابط الموقع</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D8D0C4]/85">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#B99A5B] transition-colors cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('departments')}
                  className="hover:text-[#B99A5B] transition-colors cursor-pointer"
                >
                  الأقسام
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('services')}
                  className="hover:text-[#B99A5B] transition-colors cursor-pointer"
                >
                  دليل الخدمات
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="hover:text-[#B99A5B] transition-colors cursor-pointer"
                >
                  معرض أعمالنا
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#B99A5B] transition-colors cursor-pointer"
                >
                  عن Style City
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#B99A5B] transition-colors cursor-pointer"
                >
                  الموقع وساعات العمل
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and admin entrance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8D0C4]/60 gap-4">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <span>© 2026 STYLE CITY BAGHDAD. جميع الحقوق محفوظة.</span>
            <span className="hidden sm:inline text-[#B99A5B]/40">|</span>
            <span className="hidden sm:inline text-[#B99A5B]">The City of Beauty</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#D8D0C4]/50">المنصور – شارع الأميرات</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#D8D0C4]/50 hover:text-[#B99A5B] transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة التحكم</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
