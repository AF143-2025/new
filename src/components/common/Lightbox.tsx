import React, { useEffect } from 'react';
import { X, Calendar, Share2, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ item, onClose }) => {
  const { startBookingFor, showToast } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط المعرض');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#12100E] border border-[#B99A5B]/30 rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/60 text-[#F5F1EA] hover:text-[#B99A5B] transition-colors border border-white/10"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Image View */}
        <div className="relative md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[450px]">
          <img
            src={item.image}
            alt={item.alt || item.title}
            className="w-full h-full object-contain max-h-[75vh]"
          />
        </div>

        {/* Metadata Details Sidebar */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-right bg-[#12100E]">
          <div>
            {/* Category / Department */}
            <div className="flex items-center justify-between text-xs text-[#B99A5B] font-medium mb-3">
              <span>{item.department_name_ar}</span>
              <button
                onClick={handleShare}
                className="text-[#D8D0C4]/60 hover:text-[#B99A5B] p-1 transition-colors"
                title="مشاركة"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-semibold text-[#F5F1EA] mb-3 leading-snug">
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p className="text-xs sm:text-sm text-[#D8D0C4]/80 font-light leading-relaxed mb-6">
                {item.description}
              </p>
            )}

            {/* Alt metadata */}
            <div className="py-3 px-3 bg-white/5 border border-white/5 rounded-sm text-[11px] text-[#D8D0C4]/60">
              <span className="text-[#B99A5B]/80 font-medium">القسم: </span>
              {item.department_name_ar}
            </div>
          </div>

          {/* Quick Action */}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-2 mt-6">
            <button
              onClick={() => {
                onClose();
                startBookingFor(item.department_id);
              }}
              className="w-full py-3 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز جلسة مماثلة</span>
            </button>
            <p className="text-[10px] text-[#D8D0C4]/50 text-center">
              يمكنكم طلب التصميم أو التقنية ذاتها عند موعدكم في ستايل سيتي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
