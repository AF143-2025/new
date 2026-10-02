import React from 'react';
import { ArrowLeft, Instagram, Sparkles, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Department } from '../../types';

export const DepartmentsSection: React.FC = () => {
  const { departments, startBookingFor } = useApp();

  const activeDepartments = departments
    .filter((d) => d.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleExplore = (dept: Department) => {
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="departments" className="py-24 sm:py-32 px-4 bg-[#0B0A09] relative border-t border-[#B99A5B]/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>عالم الجمال المتكامل</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-[#F5F1EA] mb-4 font-normal tracking-wide">
            اكتشف عالم Style City
          </h2>
          <p className="text-base sm:text-lg text-[#D8D0C4]/90 font-light">
            لكل تفصيلة بجمالك اكو قسم يعتني بيها <span className="text-[#B99A5B]">✨</span>
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {activeDepartments.map((dept, idx) => {
            // Asymmetrical layout spans for dynamic editorial feel
            // item 0: col-span-7, item 1: col-span-5
            // item 2: col-span-4, item 3: col-span-4, item 4: col-span-4
            // item 5: col-span-12 or col-span-8
            let colSpan = 'md:col-span-6 lg:col-span-4';
            if (idx === 0) colSpan = 'md:col-span-7 lg:col-span-7';
            else if (idx === 1) colSpan = 'md:col-span-5 lg:col-span-5';
            else if (idx === 2) colSpan = 'md:col-span-6 lg:col-span-4';
            else if (idx === 3) colSpan = 'md:col-span-6 lg:col-span-4';
            else if (idx === 4) colSpan = 'md:col-span-6 lg:col-span-4';
            else if (idx === 5) colSpan = 'md:col-span-12 lg:col-span-12';

            const isHeroCard = idx === 0 || idx === 5;

            return (
              <div
                key={dept.id}
                className={`${colSpan} group relative rounded-sm overflow-hidden bg-[#12100E] border border-[#B99A5B]/20 hover:border-[#B99A5B]/60 transition-all duration-500 flex flex-col justify-end min-h-[380px] sm:min-h-[440px] ${
                  isHeroCard ? 'lg:min-h-[500px]' : ''
                }`}
              >
                {/* Background Image with smooth zoom */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={dept.image}
                    alt={dept.name_ar}
                    className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle multi-layer gradient overlays for readability and luxury tone */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/60 to-black/20" />
                  <div className="absolute inset-0 bg-[#0B0A09]/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Top Corner Details (Instagram / Tag) */}
                <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between text-xs">
                  {dept.highlight ? (
                    <span className="text-[#F5F1EA] text-[11px] font-medium tracking-wide bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm border border-[#B99A5B]/30">
                      {dept.highlight}
                    </span>
                  ) : <span />}

                  {dept.instagram_url && (
                    <a
                      href={dept.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#D8D0C4] hover:text-[#B99A5B] transition-colors border border-white/10"
                      title="حساب Instagram"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Content at Bottom */}
                <div className="relative z-10 p-6 sm:p-8 text-right bg-gradient-to-t from-[#0B0A09] to-transparent pt-12">
                  <span className="text-[11px] font-sans tracking-[0.2em] text-[#B99A5B] uppercase block mb-1">
                    {dept.name_en}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#F5F1EA] font-semibold mb-2 group-hover:text-[#D4BD86] transition-colors">
                    {dept.name_ar}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#D8D0C4]/85 font-light leading-relaxed mb-6 line-clamp-3">
                    {dept.description_ar}
                  </p>

                  {/* Actions: "اكتشف القسم" & "احجز موعدك" */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleExplore(dept)}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#F5F1EA] hover:text-[#B99A5B] transition-colors py-1 cursor-pointer group/btn"
                    >
                      <span>اكتشف القسم</span>
                      <ArrowLeft className="w-4 h-4 transform group-hover/btn:-translate-x-1 transition-transform text-[#B99A5B]" />
                    </button>

                    <button
                      onClick={() => startBookingFor(dept.id)}
                      className="mr-auto px-4 py-2 bg-white/10 hover:bg-[#B99A5B] text-[#F5F1EA] hover:text-[#0B0A09] text-xs font-semibold rounded-sm border border-[#B99A5B]/40 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>احجز موعدك</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
