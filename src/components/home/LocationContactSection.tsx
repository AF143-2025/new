import React from 'react';
import { Phone, MessageCircle, MapPin, Instagram, Facebook, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LocationContactSection: React.FC = () => {
  const { settings } = useApp();

  const cleanPhone = settings.phone.replace(/\D/g, '');
  const cleanWhatsApp = settings.whatsapp_number.replace(/\D/g, '');
  const whatsAppGeneralMessage = encodeURIComponent(
    'مرحباً Style City، أريد الاستفسار عن الخدمات والمواعيد.'
  );
  const whatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${whatsAppGeneralMessage}`;

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 bg-[#0E0C0A] relative border-t border-[#B99A5B]/15">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contact Details Card */}
          <div className="lg:col-span-6 text-right">
            <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>الموقع والتواصل</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-[#F5F1EA] mb-6 font-normal tracking-wide">
              زورونا في Style City
            </h2>

            <p className="text-base text-[#D8D0C4] font-light leading-relaxed mb-8">
              يسعدنا استقبالكم في أرقى أحياء بغداد لتجربة عناية استثنائية. يمكنكم الاتصال بنا مباشرة أو مراسلتنا عبر الواتساب للاستفسار والحجز.
            </p>

            {/* Address & Phone */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-sm bg-[#141210] border border-[#B99A5B]/20">
                <div className="p-2.5 rounded-sm bg-black/40 border border-[#B99A5B]/40 text-[#B99A5B] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F1EA] mb-1">العنوان</h4>
                  <p className="text-sm text-[#D8D0C4]/80 font-light leading-normal">
                    {settings.address_ar}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-sm bg-[#141210] border border-[#B99A5B]/20">
                <div className="p-2.5 rounded-sm bg-black/40 border border-[#B99A5B]/40 text-[#B99A5B] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F1EA] mb-1">رقم الهاتف</h4>
                  <p className="text-sm text-[#D8D0C4]/80 font-light" dir="ltr">
                    {settings.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Explicit Action Buttons as requested */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {/* Call */}
              <a
                href={`tel:${cleanPhone}`}
                className="py-3 px-4 bg-white/5 hover:bg-white/10 text-[#F5F1EA] border border-[#B99A5B]/30 hover:border-[#B99A5B] rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-[#B99A5B]" />
                <span>اتصلي الآن</span>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#F5F1EA] border border-[#25D366]/40 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>واتساب</span>
              </a>

              {/* Directions */}
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] rounded-sm text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Compass className="w-4 h-4" />
                <span>احصلي على الاتجاهات</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-xs text-[#D8D0C4]">
              <span className="text-[#B99A5B] font-medium">تابعينا:</span>
              <a
                href={settings.instagram_main}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full hover:text-[#B99A5B] border border-white/10 transition-colors"
                title="Instagram Main"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.instagram_beauty}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full hover:text-[#B99A5B] border border-white/10 transition-colors"
                title="Instagram Beauty"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full hover:text-[#B99A5B] border border-white/10 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Aesthetic Location Visual & Map Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-sm overflow-hidden border border-[#B99A5B]/30 bg-[#141210] p-3 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-black/60">
                <img
                  src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop"
                  alt="Style City Location Baghdad"
                  className="w-full h-full object-cover grayscale-[20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-transparent to-black/30" />

                {/* Pin Card overlay */}
                <div className="absolute bottom-4 inset-x-4 p-4 bg-[#0B0A09]/90 backdrop-blur-md rounded-sm border border-[#B99A5B]/40 text-right">
                  <div className="flex items-center gap-2 text-[#B99A5B] text-xs font-semibold mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>STYLE CITY BAGHDAD</span>
                  </div>
                  <p className="text-xs text-[#F5F1EA]">
                    المنصور – شارع الأميرات – بالقرب من أرقى معالم بغداد
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
