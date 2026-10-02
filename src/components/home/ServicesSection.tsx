import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ServicesSection: React.FC = () => {
  const { departments, services, startBookingFor } = useApp();
  const [activeTab, setActiveTab] = useState<string>('all');

  const activeDepartments = departments.filter((d) => d.is_active);
  const activeServices = services.filter((s) => s.is_active);

  const filteredServices =
    activeTab === 'all'
      ? activeServices
      : activeServices.filter((s) => s.department_id === activeTab);

  return (
    <section id="services" className="py-24 sm:py-32 px-4 bg-[#0E0C0A] relative border-t border-[#B99A5B]/15">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
            <span>عناية فائقة ونتائج استثنائية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-[#F5F1EA] mb-4 font-normal tracking-wide">
            خدماتنا
          </h2>
          <p className="text-sm sm:text-base text-[#D8D0C4]/80 font-light max-w-xl mx-auto">
            باقات وخدمات متخصصة لكل قسم، منفذة بأيدي خبيرات معتمدات وباستخدام أجود المستحضرات العالمية.
          </p>
        </div>

        {/* Department Filter Tabs (Interactive Segmented Control - Buttons) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#B99A5B] text-[#0B0A09] font-bold shadow-[0_0_15px_rgba(185,154,91,0.3)]'
                : 'bg-white/5 text-[#D8D0C4] hover:text-[#F5F1EA] hover:bg-white/10 border border-white/10'
            }`}
          >
            جميع الخدمات
          </button>
          {activeDepartments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveTab(dept.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeTab === dept.id
                  ? 'bg-[#B99A5B] text-[#0B0A09] font-bold shadow-[0_0_15px_rgba(185,154,91,0.3)]'
                  : 'bg-white/5 text-[#D8D0C4] hover:text-[#F5F1EA] hover:bg-white/10 border border-white/10'
              }`}
            >
              {dept.name_ar}
            </button>
          ))}
        </div>

        {/* Services List / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => {
            const parentDept = departments.find((d) => d.id === service.department_id);

            return (
              <div
                key={service.id}
                className="group relative bg-[#141210] border border-[#B99A5B]/20 hover:border-[#B99A5B]/60 p-6 sm:p-7 rounded-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Department Name Indicator (Unboxed quiet text) */}
                  <div className="flex items-center justify-between text-xs text-[#B99A5B] mb-2 font-medium">
                    <span>{parentDept?.name_ar || 'قسم متخصص'}</span>
                    {service.duration && (
                      <span className="flex items-center gap-1 text-[#D8D0C4]/70">
                        <Clock className="w-3.5 h-3.5 text-[#B99A5B]" />
                        <span>{service.duration}</span>
                      </span>
                    )}
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg sm:text-xl font-serif-luxury font-semibold text-[#F5F1EA] group-hover:text-[#D4BD86] transition-colors mb-2.5">
                    {service.name_ar}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#D8D0C4]/80 font-light leading-relaxed mb-6">
                    {service.description_ar}
                  </p>
                </div>

                {/* Price and Action Footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4 mt-auto">
                  {/* Price Handling: No fake prices */}
                  <div className="text-xs">
                    {service.show_price && service.price ? (
                      <div>
                        <span className="text-base sm:text-lg font-bold text-[#F5F1EA]">
                          {typeof service.price === 'number'
                            ? `${service.price.toLocaleString()} د.ع`
                            : service.price}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[#D8D0C4]/60 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A5B]/60" />
                        <span>الاستشارة والتقييم عند الحضور</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => startBookingFor(service.department_id, service.id)}
                    className="px-5 py-2 rounded-sm bg-white/5 hover:bg-[#B99A5B] text-[#F5F1EA] hover:text-[#0B0A09] border border-[#B99A5B]/30 text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>احجز الآن</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-[#D8D0C4]/60 text-sm">
            لا توجد خدمات متاحة حالياً في هذا القسم.
          </div>
        )}
      </div>
    </section>
  );
};
