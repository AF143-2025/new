import React from 'react';
import { Instagram, ArrowUpLeft, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InstagramSection: React.FC = () => {
  const { settings, gallery, openLightbox } = useApp();

  // Take the first 6 featured images for the Instagram preview
  const previewImages = gallery.slice(0, 6);

  return (
    <section className="py-24 sm:py-32 px-4 bg-[#0E0C0A] relative border-t border-[#B99A5B]/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
            <Instagram className="w-3.5 h-3.5" />
            <span>مجتمع STYLE CITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-[#F5F1EA] mb-4 font-normal tracking-wide">
            تابعينا على Instagram
          </h2>
          <p className="text-sm sm:text-base text-[#D8D0C4]/80 font-light max-w-xl mx-auto mb-8">
            كوني على اطلاع دائم بآخر أعمالنا، جلساتنا الحصرية وتفاصيل الإطلالات اليومية عبر منصاتنا الرسمية.
          </p>

          {/* Dual Account Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Main Account */}
            <div className="p-5 rounded-sm bg-[#141210] border border-[#B99A5B]/30 flex items-center justify-between">
              <div className="text-right">
                <span className="text-[11px] text-[#B99A5B] block font-medium">الحساب الرئيسي</span>
                <span className="font-serif-luxury text-lg text-[#F5F1EA] font-semibold" dir="ltr">
                  {settings.instagram_main_handle}
                </span>
              </div>
              <a
                href={settings.instagram_main}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-[#D4BD86] to-[#B99A5B] text-[#0B0A09] text-xs font-bold rounded-sm transition-all hover:shadow-[0_0_15px_rgba(185,154,91,0.3)] flex items-center gap-1.5"
              >
                <span>تابعينا</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Beauty & Clinic Account */}
            <div className="p-5 rounded-sm bg-[#141210] border border-[#B99A5B]/30 flex items-center justify-between">
              <div className="text-right">
                <span className="text-[11px] text-[#B99A5B] block font-medium">قسم التجميل والعيادة</span>
                <span className="font-serif-luxury text-lg text-[#F5F1EA] font-semibold" dir="ltr">
                  {settings.instagram_beauty_handle}
                </span>
              </div>
              <a
                href={settings.instagram_beauty}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-[#B99A5B] text-[#F5F1EA] hover:text-[#0B0A09] border border-[#B99A5B]/30 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5"
              >
                <span>تابعينا</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Visual Instagram Feed Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {previewImages.map((img) => (
            <div
              key={img.id}
              onClick={() => openLightbox(img)}
              className="group relative aspect-square bg-[#12100E] rounded-sm overflow-hidden cursor-pointer border border-white/5 hover:border-[#B99A5B]/50 transition-all duration-300"
            >
              <img
                src={img.image}
                alt={img.alt || img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-[#B99A5B]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
