import React from 'react';
import { Sparkles, HeartHandshake, Shield, Clock } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-28 px-4 bg-[#0B0A09] relative border-t border-[#B99A5B]/15">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase: Editorial Dual Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Ambient Image */}
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-[#B99A5B]/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop"
                  alt="أجواء ستايل سيتي بغداد"
                  className="w-full h-full object-cover grayscale-[15%] hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-transparent to-transparent opacity-60" />
              </div>

              {/* Offset Accent Card */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-[#141210] border border-[#B99A5B]/40 p-5 rounded-sm shadow-2xl max-w-[240px]">
                <div className="flex items-center gap-2 text-[#B99A5B] mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest font-serif-luxury font-bold">THE EXPERIENCE</span>
                </div>
                <p className="text-xs text-[#D8D0C4] leading-relaxed">
                  تفاصيل راقية، خصوصية تامة، وأجواء صممت خصيصاً لراحتكِ واسترخائكِ في قلب المنصور.
                </p>
              </div>
            </div>
          </div>

          {/* Text & Philosophy */}
          <div className="lg:col-span-6 text-right">
            <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
              <span className="w-8 h-[1px] bg-[#B99A5B]" />
              <span>فلسفة STYLE CITY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury text-[#F5F1EA] mb-6 font-normal tracking-wide">
              أكثر من مجرد صالون
            </h2>

            <p className="text-base sm:text-lg text-[#D8D0C4] leading-relaxed mb-6 font-light">
              Style City هو عالم متكامل للجمال، يجمع مجموعة من خدمات العناية والجمال في مكان واحد، مع تجربة مصممة لتكون مريحة، أنيقة، ومميزة من لحظة وصولج.
            </p>

            <p className="text-sm sm:text-base text-[#D8D0C4]/80 leading-relaxed mb-10 font-light">
              حرصنا على توفير أقسام متخصصة ومستقلة، لكل منها طاقمه الخبير وأدواته المعقمة بأعلى المعايير، لتستمتعوا برحلة عناية متكاملة تحت سقف واحد في شارع الأميرات.
            </p>

            {/* Unboxed Editorial Pillars (No generic pills) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#B99A5B]/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-sm bg-white/5 border border-[#B99A5B]/25 text-[#B99A5B] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F1EA] mb-1">تعقيم وعناية فائقة</h4>
                  <p className="text-xs text-[#D8D0C4]/70 leading-normal">
                    أعلى معايير النظافة والتعقيم الطبي لكل جلسة لضمان أمانكم التام.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-sm bg-white/5 border border-[#B99A5B]/25 text-[#B99A5B] shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F1EA] mb-1">استشارة شخصية وتخصيص دقيق</h4>
                  <p className="text-xs text-[#D8D0C4]/70 leading-normal">
                    دراسة الملامح واحتياج البشرة بدقة قبل البدء بأي خطوة.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-sm bg-white/5 border border-[#B99A5B]/25 text-[#B99A5B] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F1EA] mb-1">احترام دقيق للمواعيد</h4>
                  <p className="text-xs text-[#D8D0C4]/70 leading-normal">
                    نظام حجز منظم يضمن خصوصيتكم ووقتكم الثمين بدون انتظار.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-sm bg-white/5 border border-[#B99A5B]/25 text-[#B99A5B] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F1EA] mb-1">أجواء هادئة وفاخرة</h4>
                  <p className="text-xs text-[#D8D0C4]/70 leading-normal">
                    تصميم داخلي مريح وموسيقى هادئة لتجربة استرخاء لا تُنسى.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
