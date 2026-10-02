import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Search,
  MessageCircle,
  Sparkles,
  Phone,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, Appointment } from '../../types';

export const MyBookingsModal: React.FC = () => {
  const {
    isMyBookingsOpen,
    setIsMyBookingsOpen,
    myBookings,
    cancelMyBooking,
    deleteAppointment,
    lookupBookingsByPhone,
    customerPhone,
    settings,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [phoneSearch, setPhoneSearch] = useState(customerPhone || '');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isMyBookingsOpen) return null;

  const handlePhoneLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneSearch.trim()) {
      lookupBookingsByPhone(phoneSearch.trim());
    }
  };

  const handleCancelClick = (id: string) => {
    cancelMyBooking(id);
    setCancellingId(null);
  };

  const filteredBookings = myBookings.filter((apt) => {
    if (activeTab === 'pending') return apt.status === 'pending';
    if (activeTab === 'confirmed') return apt.status === 'confirmed';
    if (activeTab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>موافق عليه (مؤكد)</span>
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span>قيد الانتظار</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>مرفوض / ملغي</span>
          </div>
        );
      case 'completed':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A5B]/20 border border-[#B99A5B]/50 text-[#F5F1EA] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B99A5B]" />
            <span>مكتمل بنجاح</span>
          </div>
        );
      case 'no_show':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-600 text-gray-300 text-xs font-medium">
            <span>لم تحضر</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusNotice = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <div className="p-3 rounded-sm bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>تمت الموافقة وتأكيد حجزك بنجاح ✨</strong> ننتظر تشريفكم لصالون Style City بالموعد المحدد.
            </span>
          </div>
        );
      case 'pending':
        return (
          <div className="p-3 rounded-sm bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>طلبك قيد المراجعة والتدقيق ⏳</strong> تقوم إدارة الصالون بالاطلاع على الموعد وسيتم تحديث الحالة فوراً.
            </span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="p-3 rounded-sm bg-rose-950/30 border border-rose-500/20 text-xs text-rose-200/90 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              <strong>تم رفض أو إلغاء هذا الحجز</strong> (الموعد غير متاح أو تم إلغاؤه). يمكنك اختيار موعد بديل في أي وقت.
            </span>
          </div>
        );
      case 'completed':
        return (
          <div className="p-3 rounded-sm bg-[#B99A5B]/10 border border-[#B99A5B]/20 text-xs text-[#D8D0C4] leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#B99A5B] shrink-0 mt-0.5" />
            <span>
              <strong>تمت الزيارة بنجاح ✨</strong> سعدنا جداً بخدمتك في Style City Baghdad ونتطلع لزيارتك القادمة.
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const pendingCount = myBookings.filter((a) => a.status === 'pending').length;
  const confirmedCount = myBookings.filter((a) => a.status === 'confirmed').length;
  const cancelledCount = myBookings.filter((a) => a.status === 'cancelled').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-right">
      <div className="relative w-full max-w-2xl bg-[#0F0E0C] border border-[#B99A5B]/40 rounded-sm shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#151310] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#B99A5B]/15 border border-[#B99A5B]/40 flex items-center justify-center text-[#B99A5B]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#F5F1EA]">
                  حجوزاتي في Style City
                </h3>
                {myBookings.length > 0 && (
                  <span className="px-2 py-0.5 bg-[#B99A5B] text-[#0B0A09] text-[10px] font-bold rounded-full">
                    {myBookings.length}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#D8D0C4]/60">
                متابعة فورية لحالة المواعيد (موافق عليه · قيد الانتظار · مرفوض)
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMyBookingsOpen(false)}
            className="p-2 text-[#D8D0C4]/70 hover:text-white hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phone Lookup & Filter Tabs */}
        <div className="p-4 sm:px-6 bg-[#13110E] border-b border-white/5 space-y-3 shrink-0">
          {/* Quick Phone Search */}
          <form onSubmit={handlePhoneLookup} className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="w-3.5 h-3.5 text-[#B99A5B] absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                placeholder="أدخلي رقم هاتفك لمزامنة كافة الحجوزات..."
                className="w-full pl-3 pr-9 py-2 bg-white/5 border border-white/10 focus:border-[#B99A5B] rounded-sm text-xs text-[#F5F1EA] placeholder-[#D8D0C4]/40 focus:outline-none transition-colors"
                dir="rtl"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B99A5B]/20 hover:bg-[#B99A5B] text-[#D4BD86] hover:text-[#0B0A09] border border-[#B99A5B]/40 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>مزامنة</span>
            </button>
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#B99A5B] text-[#0B0A09] font-bold shadow-sm'
                  : 'bg-white/5 text-[#D8D0C4]/80 hover:bg-white/10'
              }`}
            >
              الكل ({myBookings.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-sm transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-[#0B0A09] font-bold shadow-sm'
                  : 'bg-white/5 text-amber-300 hover:bg-white/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>انتظار ({pendingCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-3 py-1.5 rounded-sm transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeTab === 'confirmed'
                  ? 'bg-emerald-500 text-[#0B0A09] font-bold shadow-sm'
                  : 'bg-white/5 text-emerald-300 hover:bg-white/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>موافق عليه ({confirmedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3 py-1.5 rounded-sm transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeTab === 'cancelled'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'bg-white/5 text-rose-300 hover:bg-white/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>مرفوض ({cancelledCount})</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-[#B99A5B]/30 flex items-center justify-center mx-auto mb-4 text-[#B99A5B]">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif-luxury text-[#F5F1EA] font-semibold mb-1">
                {activeTab === 'all'
                  ? 'لا توجد حجوزات مسجلة حالياً'
                  : `لا توجد حجوزات بحالة "${
                      activeTab === 'pending'
                        ? 'قيد الانتظار'
                        : activeTab === 'confirmed'
                        ? 'موافق عليه'
                        : 'مرفوض'
                    }"`}
              </h4>
              <p className="text-xs text-[#D8D0C4]/70 max-w-sm mx-auto mb-6 font-light leading-relaxed">
                عند حجز أي موعد عبر الموقع سيظهر هنا مباشرة لمتابعة حالته والتواصل بخصوصه بسهولة.
              </p>
              <button
                onClick={() => {
                  setIsMyBookingsOpen(false);
                  navigateTo('booking');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4BD86] to-[#B99A5B] text-[#0B0A09] text-xs font-bold rounded-sm shadow-md transition-all hover:brightness-110 cursor-pointer"
              >
                احجز موعدك الآن
              </button>
            </div>
          ) : (
            filteredBookings.map((apt) => {
              const cleanWhatsAppPhone = settings.whatsapp_number.replace(/\D/g, '');
              const whatsappInquiryMessage = encodeURIComponent(
                `مرحباً Style City ✨\nأستفسر عن حالة طلبي:\n• رقم الحجز: ${apt.booking_number}\n• الاسم: ${apt.customer_name}\n• الخدمة: ${apt.service_name}\n• التاريخ: ${apt.date} الساعة ${apt.time}\n• الحالة الحالية: ${
                  apt.status === 'confirmed'
                    ? 'موافق عليه'
                    : apt.status === 'pending'
                    ? 'قيد الانتظار'
                    : 'مرفوض'
                }`
              );
              const whatsappInquiryUrl = `https://wa.me/${cleanWhatsAppPhone}?text=${whatsappInquiryMessage}`;

              return (
                <div
                  key={apt.id}
                  className="bg-[#14120F] border border-[#B99A5B]/30 rounded-sm p-4 sm:p-5 space-y-4 hover:border-[#B99A5B]/60 transition-all shadow-md relative"
                >
                  {/* Card Top: Status and Booking Code */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#D8D0C4]/60">رقم الحجز:</span>
                        <span className="font-mono font-bold text-[#D4BD86] text-sm tracking-wider" dir="ltr">
                          {apt.booking_number}
                        </span>
                      </div>
                      <button
                        onClick={() => setDeletingId(apt.id)}
                        title="حذف الحجز نهائياً"
                        aria-label="حذف الحجز نهائياً"
                        className="p-1.5 text-[#D8D0C4]/50 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status Explanation Banner */}
                  {getStatusNotice(apt.status)}

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/[0.02] p-2.5 rounded-sm border border-white/5 space-y-1">
                      <span className="text-[11px] text-[#B99A5B] block font-medium">القسم والخدمة</span>
                      <p className="text-[#F5F1EA] font-semibold">{apt.department_name}</p>
                      <p className="text-[#D8D0C4]/80 text-[11px]">{apt.service_name}</p>
                    </div>

                    <div className="bg-white/[0.02] p-2.5 rounded-sm border border-white/5 space-y-1">
                      <span className="text-[11px] text-[#B99A5B] block font-medium">توقيت الموعد</span>
                      <p className="text-[#F5F1EA] font-semibold">{apt.date}</p>
                      <p className="text-[#D8D0C4]/80 text-[11px]">الساعة: {apt.time}</p>
                    </div>

                    {apt.staff_name && (
                      <div className="bg-white/[0.02] p-2.5 rounded-sm border border-white/5 space-y-1">
                        <span className="text-[11px] text-[#B99A5B] block font-medium">الموظفة المفضلة</span>
                        <p className="text-[#F5F1EA]">{apt.staff_name}</p>
                      </div>
                    )}

                    <div className="bg-white/[0.02] p-2.5 rounded-sm border border-white/5 space-y-1">
                      <span className="text-[11px] text-[#B99A5B] block font-medium">صاحبة الحجز</span>
                      <p className="text-[#F5F1EA]">{apt.customer_name}</p>
                      <p className="text-[#D8D0C4]/70 text-[11px]" dir="ltr">
                        {apt.customer_phone}
                      </p>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {apt.notes && (
                    <div className="text-[11px] text-[#D8D0C4]/70 bg-white/[0.02] p-2.5 rounded-sm border border-white/5">
                      <span className="text-[#B99A5B] font-medium ml-1">ملاحظاتك:</span>
                      {apt.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-sm text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#25D366]/30 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>مراسلة الإدارة عبر واتساب</span>
                    </a>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Delete permanently button */}
                      {deletingId === apt.id ? (
                        <div className="flex items-center gap-1.5 bg-rose-950/70 px-2 py-1 rounded-sm border border-rose-500/40 animate-fade-in">
                          <span className="text-[11px] text-rose-200">حذف نهائياً؟</span>
                          <button
                            onClick={() => {
                              deleteAppointment(apt.id);
                              setDeletingId(null);
                            }}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-sm cursor-pointer"
                          >
                            نعم، احذف
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-[#D8D0C4] text-[10px] rounded-sm cursor-pointer"
                          >
                            تراجع
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(apt.id)}
                          className="px-2.5 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-xs rounded-sm transition-colors flex items-center gap-1 border border-rose-500/20 cursor-pointer"
                          title="حذف هذا الحجز نهائياً من القائمة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      )}

                      {/* Cancel request button */}
                      {(apt.status === 'pending' || apt.status === 'confirmed') && (
                        <div>
                          {cancellingId === apt.id ? (
                            <div className="flex items-center gap-1.5 bg-amber-950/70 px-2 py-1 rounded-sm border border-amber-500/40 animate-fade-in">
                              <span className="text-[11px] text-amber-200">طلب إلغاء؟</span>
                              <button
                                onClick={() => handleCancelClick(apt.id)}
                                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-[#0B0A09] text-[10px] font-bold rounded-sm cursor-pointer"
                              >
                                نعم، إلغاء
                              </button>
                              <button
                                onClick={() => setCancellingId(null)}
                                className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-[#D8D0C4] text-[10px] rounded-sm cursor-pointer"
                              >
                                تراجع
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancellingId(apt.id)}
                              className="px-2.5 py-1.5 text-amber-300/80 hover:text-amber-300 hover:bg-amber-950/30 text-xs rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>إلغاء الطلب</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 sm:px-6 bg-[#0B0A09] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#D8D0C4]/60 gap-2 shrink-0">
          <span>المنصور – شارع الأميرات · هاتف: {settings.phone}</span>
          <button
            onClick={() => {
              setIsMyBookingsOpen(false);
              navigateTo('booking');
            }}
            className="text-[#B99A5B] hover:underline cursor-pointer font-medium"
          >
            + إضافة حجز جديد
          </button>
        </div>
      </div>
    </div>
  );
};
