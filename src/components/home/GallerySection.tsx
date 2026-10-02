import React, { useState, useMemo } from 'react';
import { ZoomIn, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';

export const GallerySection: React.FC = () => {
  const { gallery, openLightbox } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter only published items
  const publishedItems = useMemo(
    () => gallery.filter((item) => item.is_published).sort((a, b) => a.sort_order - b.sort_order),
    [gallery]
  );

  // Extract ONLY categories that actually exist in the database items
  const availableCategories = useMemo(() => {
    const cats = new Map<string, string>();
    publishedItems.forEach((item) => {
      cats.set(item.department_id, item.department_name_ar);
    });
    return Array.from(cats.entries()).map(([id, name]) => ({ id, name }));
  }, [publishedItems]);

  const filteredGallery = useMemo(() => {
    if (selectedFilter === 'all') return publishedItems;
    return publishedItems.filter((item) => item.department_id === selectedFilter);
  }, [selectedFilter, publishedItems]);

  return (
    <section id="gallery" className="py-24 sm:py-32 px-4 bg-[#0B0A09] relative border-t border-[#B99A5B]/15">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>معرض أعمال STYLE CITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-[#F5F1EA] mb-4 font-normal tracking-wide">
            أعمالنا
          </h2>
          <p className="text-sm sm:text-base text-[#D8D0C4]/80 font-light max-w-xl mx-auto">
            مقتطفات من لمساتنا وعنايتنا بتفاصيل الجمال، تعكس دقة التنفيذ ورقي الذوق.
          </p>
        </div>

        {/* Dynamic Category Filters (Buttons / segmented controls) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#B99A5B] text-[#0B0A09] font-bold shadow-[0_0_15px_rgba(185,154,91,0.3)]'
                : 'bg-white/5 text-[#D8D0C4] hover:text-[#F5F1EA] hover:bg-white/10 border border-white/10'
            }`}
          >
            الكل ({publishedItems.length})
          </button>

          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-[#B99A5B] text-[#0B0A09] font-bold shadow-[0_0_15px_rgba(185,154,91,0.3)]'
                  : 'bg-white/5 text-[#D8D0C4] hover:text-[#F5F1EA] hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group relative aspect-[3/4] bg-[#141210] border border-[#B99A5B]/20 rounded-sm overflow-hidden cursor-pointer shadow-lg hover:border-[#B99A5B]/70 transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.alt || item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#B99A5B] font-medium block mb-1">
                  {item.department_name_ar}
                </span>
                <h4 className="text-sm sm:text-base font-serif-luxury font-semibold text-[#F5F1EA] line-clamp-2 mb-2">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-[#D8D0C4]/70">
                  <ZoomIn className="w-3.5 h-3.5 text-[#B99A5B]" />
                  <span>عرض التفاصيل</span>
                </div>
              </div>

              {/* Quiet unboxed category chip in corner when idle */}
              <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-0 transition-opacity">
                <span className="text-[10px] text-[#F5F1EA] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                  {item.department_name_ar}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-16 text-[#D8D0C4]/60 text-sm">
            لا توجد أعمال معروضة في هذا القسم حالياً.
          </div>
        )}
      </div>
    </section>
  );
};
