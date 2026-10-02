import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Camera,
  Compass,
  ArrowLeft,
  Phone,
  Clock,
  Shield,
  HeartHandshake,
  Search,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';

export const Hero: React.FC = () => {
  const { navigateTo, settings, myBookings, setIsMyBookingsOpen, lookupBookings } = useApp();
  const [heroSearchId, setHeroSearchId] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchId.trim()) {
      lookupBookings(heroSearchId.trim());
      setIsMyBookingsOpen(true);
    }
  };

  const portalCards: {
    id: ActiveView;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'departments',
      title: 'أقسام ستايل سيتي',
      subtitle: '6 أقسام متخصصة',
      description: 'قسم الرموش، قسم الأظافر، قسم التجميل، تاتو فيبروز، زراعة الحاجب، دكتورة كارما.',
      icon: <Layers className="w-5 h-5 text-[#B99A5B]" />,
      badge: 'عالم متكامل',
    },
    {
      id: 'services',
      title: 'دليل الخدمات',
      subtitle: 'عناية متقنة',
      description: 'استكشف تفاصيل الجلسات والتقنيات المعتمدة ومدة كل خدمة.',
      icon: <Sparkles className="w-5 h-5 text-[#B99A5B]" />,
    },
    {
      id: 'booking',
      title: 'احجز موعدك',
      subtitle: 'حجز ذكي وسريع',
      description: 'اختر القسم والخدمة والتاريخ المناسب مع تأكيد فوري عبر الواتساب.',
      icon: <Calendar className="w-5 h-5 text-[#B99A5B]" />,
      badge: 'متاح الآن',
    },
    {
      id: 'gallery',
      title: 'معرض أعمالنا',
      subtitle: 'دقة التفاصيل',
      description: 'شاهد أعمالنا الحقيقية ومقتطفات من إبداعات خبراء ستايل سيتي.',
      icon: <Camera className="w-5 h-5 text-[#B99A5B]" />,
    },
    {
      id: 'contact',
      title: 'الموقع وأوقات العمل',
      subtitle: 'المنصور – شارع الأميرات',
      description: 'الاتصال المباشر، محادثة الواتساب، ساعات الاستقبال وخريطة الوصول.',
      icon: <Compass className="w-5 h-5 text-[#B99A5B]" />,
    },
    {
      id: 'about',
      title: 'عن Style City',
      subtitle: 'أكثر من مجرد صالون',
      description: 'فلسفتنا في الجمع بين أعلى معايير التعقيم الطبي والراحة والخصوصية التامة.',
      icon: <Shield className="w-5 h-5 text-[#B99A5B]" />,
    },
  ];

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 overflow-hidden bg-[#0B0A09]">
      {/* Editorial Luxury Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft luxury gold ambient aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] bg-gradient-to-b from-[#B99A5B]/15 via-[#B99A5B]/5 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/90 to-transparent" />
        {/* Subtle geometric luxury pattern watermark */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #B99A5B 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        {/* Location Banner */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#D8D0C4] mb-6 px-4 py-1.5 rounded-full border border-[#B99A5B]/30 bg-black/40 backdrop-blur-sm">
          <MapPin className="w-3.5 h-3.5 text-[#B99A5B]" />
          <span>المنصور – شارع الأميرات – بغداد</span>
        </div>

        {/* Official Style City Crest Logo */}
        <div className="mb-6 transform transition-transform duration-500 hover:scale-[1.01]">
          <Logo variant="full" />
        </div>

        {/* Arabic Tagline with Sparkle */}
        <p className="font-arabic-luxury text-xl sm:text-2xl md:text-3xl text-[#F5F1EA] font-light max-w-2xl leading-relaxed mb-4">
          لكل تفصيلة بجمالك اكو قسم يعتني بيها <span className="text-[#B99A5B]">✨</span>
        </p>

        {/* Subtitle / Promise */}
        <p className="text-xs sm:text-sm text-[#D8D0C4]/80 max-w-lg mb-8 font-light leading-relaxed">
          عالم متكامل للعناية والجمال في أرقى أحياء بغداد. اضغط على أي قسم أو خدمة بالأسفل للاستعراض والتفاصيل.
        </p>

        {/* Customer My Bookings Notification Banner (Shows when user has bookings) */}
        {myBookings.length > 0 && (
          <button
            onClick={() => setIsMyBookingsOpen(true)}
            className="mb-8 inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-[#161411] border border-[#B99A5B]/60 hover:border-[#B99A5B] transition-all cursor-pointer shadow-[0_0_20px_rgba(185,154,91,0.2)] group max-w-[94vw]"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B99A5B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B99A5B]" />
            </span>
            <span className="text-xs text-[#F5F1EA] font-medium text-right leading-tight">
              حجوزاتي: لديكِ <strong className="text-[#D4BD86] font-bold">{myBookings.length}</strong> {myBookings.length === 1 ? 'حجز مسجل' : 'حجوزات مسجلة'} — اضغطي لعرض حالتها
            </span>
            <span className="text-xs text-[#B99A5B] group-hover:translate-x-[-3px] transition-transform shrink-0">
              ←
            </span>
          </button>
        )}

        {/* Main Immediate Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6">
          <button
            onClick={() => navigateTo('booking')}
            className="w-full sm:w-auto min-w-[200px] px-9 py-3.5 bg-gradient-to-r from-[#D4BD86] via-[#B99A5B] to-[#9E8043] text-[#0B0A09] font-bold text-sm tracking-wide rounded-sm shadow-[0_0_25px_rgba(185,154,91,0.4)] hover:shadow-[0_0_35px_rgba(185,154,91,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>احجز الآن</span>
          </button>

          <button
            onClick={() => navigateTo('departments')}
            className="w-full sm:w-auto min-w-[200px] px-9 py-3.5 bg-white/5 hover:bg-white/10 text-[#F5F1EA] border border-[#B99A5B]/40 hover:border-[#B99A5B] text-sm tracking-wide rounded-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-[#B99A5B]" />
            <span>اكتشف اقسامنا</span>
          </button>
        </div>

        {/* Quick Cross-Device Order ID Lookup Form on Hero */}
        <div className="w-full max-w-md mx-auto mb-14">
          <form
            onSubmit={handleHeroSearch}
            className="flex items-center gap-2 p-1.5 bg-[#14120F]/90 border border-[#B99A5B]/40 hover:border-[#B99A5B] rounded-sm shadow-xl transition-all backdrop-blur-md"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#B99A5B] absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={heroSearchId}
                onChange={(e) => setHeroSearchId(e.target.value)}
                placeholder="تتبع طلبك بالآيدي (مثال: SC-8421 أو 8421)..."
                className="w-full pl-3 pr-9 py-2 bg-transparent text-xs text-[#F5F1EA] placeholder-[#D8D0C4]/50 focus:outline-none"
                dir="rtl"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs rounded-sm transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
            >
              <span>استعلام فوري</span>
            </button>
          </form>
        </div>

        {/* Editorial Luxury Platform Portal Directory Grid */}
        <div className="w-full text-right mt-2">
          <div className="flex items-center justify-between mb-4 border-b border-[#B99A5B]/20 pb-3">
            <span className="text-xs font-serif-luxury uppercase tracking-widest text-[#B99A5B] font-semibold">
              EXPLORE THE CITY OF BEAUTY
            </span>
            <span className="text-xs text-[#D8D0C4]/70">
              بوابة الوصول السريع لكافة أقسام المنصة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portalCards.map((portal) => (
              <button
                key={portal.id}
                onClick={() => navigateTo(portal.id)}
                className="group p-5 bg-[#141210] hover:bg-[#191613] border border-[#B99A5B]/20 hover:border-[#B99A5B]/70 rounded-sm text-right transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(185,154,91,0.2)] flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                {/* Glow accent in top corner on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#B99A5B]/5 rounded-bl-full pointer-events-none group-hover:bg-[#B99A5B]/15 transition-colors" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-sm bg-black/40 border border-white/10 group-hover:border-[#B99A5B]/40 transition-colors">
                      {portal.icon}
                    </div>
                    {portal.badge && (
                      <span className="text-[10px] text-[#F5F1EA] bg-[#B99A5B]/20 border border-[#B99A5B]/40 px-2 py-0.5 rounded-sm font-medium">
                        {portal.badge}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-[#B99A5B] block font-medium mb-1">
                    {portal.subtitle}
                  </span>

                  <h3 className="text-base font-serif-luxury font-semibold text-[#F5F1EA] group-hover:text-[#D4BD86] transition-colors mb-2">
                    {portal.title}
                  </h3>

                  <p className="text-xs text-[#D8D0C4]/75 font-light leading-relaxed line-clamp-2">
                    {portal.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#D8D0C4]/60 group-hover:text-[#B99A5B] transition-colors">
                  <span className="text-[11px]">انتقال للقسم</span>
                  <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Contact & Working Hours Bar at bottom of facade */}
        <div className="w-full mt-10 p-4 rounded-sm bg-black/40 border border-white/10 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8D0C4]/80">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#B99A5B]" />
            <span>للاستفسار المباشر:</span>
            <a href={`tel:${settings.phone}`} className="text-[#F5F1EA] font-semibold hover:text-[#B99A5B]" dir="ltr">
              {settings.phone}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B99A5B]" />
            <span>نستقبلكم يومياً في المنصور شارع الأميرات</span>
          </div>
        </div>
      </div>
    </section>
  );
};
