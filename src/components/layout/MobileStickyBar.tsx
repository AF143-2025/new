import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileStickyBar: React.FC = () => {
  const { settings, startBookingFor, isAdminOpen, isMyBookingsOpen } = useApp();

  if (isAdminOpen || isMyBookingsOpen) return null;

  const cleanWhatsApp = settings.whatsapp_number.replace(/\D/g, '');
  const defaultWhatsAppText = encodeURIComponent(
    'مرحباً Style City، أريد الاستفسار عن حجز موعد.'
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${defaultWhatsAppText}`;

  return (
    <aside aria-label="شريط التواصل السريع" className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#0B0A09]/95 backdrop-blur-lg border-t border-[#B99A5B]/30 px-3 py-2 pb-safe shadow-[0_-8px_25px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          href={`tel:${settings.phone}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-sm bg-white/5 border border-white/10 active:scale-95 transition-all text-[#F5F1EA] hover:border-[#B99A5B]/50"
        >
          <Phone className="w-4 h-4 text-[#B99A5B] mb-0.5" />
          <span className="text-[11px] font-medium leading-none">اتصال</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-sm bg-[#25D366]/15 border border-[#25D366]/30 active:scale-95 transition-all text-[#F5F1EA] hover:bg-[#25D366]/25"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] mb-0.5" />
          <span className="text-[11px] font-medium leading-none">واتساب</span>
        </a>

        {/* Booking Button */}
        <button
          onClick={() => startBookingFor()}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-sm bg-gradient-to-r from-[#CBB279] via-[#B99A5B] to-[#9E8043] active:scale-95 transition-all text-[#0B0A09] font-bold shadow-[0_0_12px_rgba(185,154,91,0.3)]"
        >
          <Calendar className="w-4 h-4 text-[#0B0A09] mb-0.5" />
          <span className="text-[11px] font-bold leading-none">حجز</span>
        </button>
      </div>
    </aside>
  );
};
