import React from 'react';

export const EditorialExperience: React.FC = () => {
  return (
    <section className="relative min-h-[600px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#070605] py-24 sm:py-32">
      {/* Background Cinematic Visual */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2000&auto=format&fit=crop"
          alt="Style City Luxury Experience"
          className="w-full h-full object-cover object-center opacity-30 grayscale-[30%]"
          loading="lazy"
        />
        {/* Multilayer gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-transparent to-[#0B0A09]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/90 via-[#0B0A09]/60 to-[#0B0A09]/90" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* English Editorial Stacked Headline */}
        <div className="mb-8 select-none">
          <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#E8D7B0] to-[#B99A5B]/40 block leading-[1.05] font-light">
            BEAUTY
          </span>
          <span className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl tracking-[0.3em] uppercase text-[#B99A5B] block my-2 font-normal">
            IS
          </span>
          <span className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#E8D7B0] via-[#B99A5B] to-[#6E5524] block leading-[1.05] font-light">
            AN EXPERIENCE
          </span>
        </div>

        {/* Golden Horizontal Accent Divider */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B99A5B] to-transparent mx-auto my-8" />

        {/* Arabic Poetic Statement */}
        <div className="max-w-xl mx-auto space-y-3">
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#F5F1EA] tracking-wide font-arabic-luxury leading-relaxed">
            الجمال مو بس نتيجة...
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-normal text-[#D4BD86] tracking-wide font-arabic-luxury leading-relaxed">
            الجمال تجربة تبدأ من التفاصيل.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-[#D8D0C4]/70 max-w-md mx-auto mt-6 font-light leading-relaxed">
          نحرص في Style City على أن تعيشوا كل لحظة باسترخاء ورقي، من دفء الاستقبال إلى أدق لمسة في إطلالتكم.
        </p>
      </div>
    </section>
  );
};
