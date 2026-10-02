import React, { useMemo } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BusinessHoursSection: React.FC = () => {
  const { businessHours } = useApp();

  // Determine current status based on Baghdad time
  const currentStatus = useMemo(() => {
    try {
      // Baghdad is UTC+3
      const now = new Date();
      // Map JS day (0=Sunday ... 6=Saturday) to our day_ids
      const jsDay = now.getDay();
      const dayMap: Record<number, string> = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
      };
      const currentDayId = dayMap[jsDay];
      const todaySchedule = businessHours.find((d) => d.day_id === currentDayId);

      if (!todaySchedule || !todaySchedule.is_open) {
        return { isOpen: false, text: 'مغلق الآن', sub: 'يرحب بكم فريقنا في أوقات العمل الرسمية' };
      }

      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeNum = currentHours * 60 + currentMinutes;

      const [openH, openM] = todaySchedule.open_time.split(':').map(Number);
      const [closeH, closeM] = todaySchedule.close_time.split(':').map(Number);

      const openNum = openH * 60 + (openM || 0);
      const closeNum = closeH * 60 + (closeM || 0);

      if (currentTimeNum >= openNum && currentTimeNum <= closeNum) {
        return {
          isOpen: true,
          text: 'مفتوح الآن',
          sub: `نستقبلكم حتى الساعة ${todaySchedule.close_time}`,
        };
      } else {
        return {
          isOpen: false,
          text: 'مغلق الآن',
          sub: `يفتح اليوم في تمام الساعة ${todaySchedule.open_time}`,
        };
      }
    } catch {
      return { isOpen: true, text: 'أوقات العمل المعتمدة', sub: 'نرحب بزيارتكم' };
    }
  }, [businessHours]);

  return (
    <section className="py-20 sm:py-24 px-4 bg-[#0B0A09] relative border-t border-[#B99A5B]/15">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>ساعات الاستقبال</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-luxury text-[#F5F1EA] mb-4 font-normal tracking-wide">
            أوقات العمل
          </h2>

          {/* Real-time Open/Closed Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-[#D8D0C4]">
            {currentStatus.isOpen ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
            <span className="font-semibold text-[#F5F1EA]">{currentStatus.text}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="text-[11px] opacity-80">{currentStatus.sub}</span>
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-[#141210] border border-[#B99A5B]/25 rounded-sm p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
          <div className="divide-y divide-white/5">
            {businessHours.map((day) => (
              <div
                key={day.day_id}
                className="py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-sm text-right"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#F5F1EA] w-20">{day.day_name_ar}</span>
                  <span className="text-[11px] font-sans text-[#D8D0C4]/40 hidden sm:inline">
                    {day.day_name_en}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {day.is_open ? (
                    <span className="text-[#D8D0C4] font-medium" dir="ltr">
                      {day.open_time} - {day.close_time}
                    </span>
                  ) : (
                    <span className="text-amber-400/80 font-medium">عطلة / مغلق</span>
                  )}

                  {day.is_open ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/80" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400/60" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#D8D0C4]/60 text-center mt-6 pt-4 border-t border-white/5 font-light">
            * للحصول على موعد خاص خارج أوقات العمل الرسمية للمناسبات والأعراس، يرجى التنسيق المسبق مع الإدارة.
          </p>
        </div>
      </div>
    </section>
  );
};
