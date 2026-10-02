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
  AlertTriangle,
  Trash2,
  Printer,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, Appointment } from '../../types';
import { printBookingPdf } from '../../utils/printPdf';

export const MyBookingsModal: React.FC = () => {
  const {
    isMyBookingsOpen,
    setIsMyBookingsOpen,
    myBookings,
    appointments,
    cancelMyBooking,
    deleteAppointment,
    lookupBookings,
    lookupBookingsByPhone,
    customerPhone,
    settings,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [phoneSearch, setPhoneSearch] = useState(customerPhone || '');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Search status state: If exists -> show order, if not exists -> reject
  const [searchState, setSearchState] = useState<{
    hasSearched: boolean;
    query: string;
    foundItem: Appointment | null;
    notFound: boolean;
  }>({
    hasSearched: false,
    query: '',
    foundItem: null,
    notFound: false,
  });

  if (!isMyBookingsOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = phoneSearch.trim();
    if (!query) {
      setSearchState({ hasSearched: false, query: '', foundItem: null, notFound: false });
      return;
    }

    setIsSearching(true);

    // 1. Direct cross-device search on centralized server
    try {
      const res = await fetch(`/api/appointments/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.appointment) {
          const remoteApt = json.appointment as Appointment;
          setSearchState({
            hasSearched: true,
            query,
            foundItem: remoteApt,
            notFound: false,
          });
          lookupBookings(query);
          setIsSearching(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Network server lookup failed, falling back to local list:', err);
    }

    // 2. Search locally in appointments state
    const upper = query.toUpperCase();
    const cleanDigits = query.replace(/\D/g, '');

    const match = appointments.find((a) => {
      const aptUpper = a.booking_number.toUpperCase();
      if (aptUpper === upper || aptUpper.includes(upper)) return true;
      if (cleanDigits.length >= 3 && aptUpper.replace(/\D/g, '').includes(cleanDigits)) return true;
      if (a.id.toLowerCase() === query.toLowerCase()) return true;
      if (cleanDigits.length >= 7) {
        const aptDigits = a.customer_phone.replace(/\D/g, '');
        if (aptDigits.includes(cleanDigits) || cleanDigits.includes(aptDigits)) return true;
      }
      return false;
    });

    if (match) {
      // 1. Order ID exists -> display the order immediately
      setSearchState({
        hasSearched: true,
        query,
        foundItem: match,
        notFound: false,
      });
      lookupBookings(query);
    } else {
      // 2. Order ID does NOT exist -> reject with explicit refusal banner
      setSearchState({
        hasSearched: true,
        query,
        foundItem: null,
        notFound: true,
      });
    }

    setIsSearching(false);
  };

  const handleResetSearch = () => {
    setPhoneSearch('');
    setSearchState({
      hasSearched: false,
      query: '',
      foundItem: null,
      notFound: false,
    });
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
            <span>قيد الانتظار (مراجعة الإدارة)</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>طلب ملغى / مرفوض</span>
          </div>
        );
      case 'completed':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>مكتمل</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusNotice = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="p-2.5 rounded-sm bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">طلبك قيد المراجعة:</strong>
              سيقوم فريق الاستقبال بمراجعة توفر الوقت وتأكيد موعدك هاتفياً أو عبر واتساب.
            </div>
          </div>
        );
      case 'confirmed':
        return (
          <div className="p-2.5 rounded-sm bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200/90 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">تمت الموافقة وتأكيد الحجز:</strong>
              نحن بانتظارك في الوقت المحدد في مقرنا بالمنصور – شارع الأميرات.
            </div>
          </div>
        );
      case 'cancelled':
        return (
          <div className="p-2.5 rounded-sm bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200/90 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">تم إلغاء أو رفض الحجز:</strong>
              يمكنك اختيار موعد جديد أو التواصل مع الإدارة للاستفسار.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const pendingCount = myBookings.filter((a) => a.status === 'pending').length;
  const confirmedCount = myBookings.filter((a) => a.status === 'confirmed').length;
  const cancelledCount = myBookings.filter((a) => a.status === 'cancelled').length;

  const renderBookingCard = (apt: Appointment) => {
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

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/10">
              <span className="text-[#D8D0C4]/60">آيدي الطلب:</span>
              <span className="font-mono font-bold text-[#D4BD86] text-xs sm:text-sm tracking-wider" dir="ltr">
                {apt.booking_number}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(apt.id, apt.booking_number)}
                className="text-[#D8D0C4]/50 hover:text-[#B99A5B] p-0.5 transition-colors cursor-pointer"
                title="نسخ آيدي الطلب"
              >
                {copiedId === apt.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => printBookingPdf(apt, settings)}
              title="طباعة وتنزيل تذكرة الحجز بصيغة PDF"
              aria-label="طباعة PDF"
              className="p-1.5 text-[#D8D0C4]/70 hover:text-[#B99A5B] hover:bg-[#B99A5B]/15 rounded border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5 text-[#B99A5B]" />
              <span className="hidden sm:inline text-[11px] font-medium">PDF</span>
            </button>

            <button
              type="button"
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
            {/* Print PDF Voucher button */}
            <button
              type="button"
              onClick={() => printBookingPdf(apt, settings)}
              className="px-3 py-1.5 bg-[#B99A5B]/15 hover:bg-[#B99A5B] text-[#D4BD86] hover:text-[#0B0A09] text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 border border-[#B99A5B]/30 cursor-pointer"
              title="طبع أو تحميل تذكرة الحجز بصيغة PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة تذكرة PDF</span>
            </button>

            {/* Delete permanently button */}
            {deletingId === apt.id ? (
              <div className="flex items-center gap-1.5 bg-rose-950/70 px-2 py-1 rounded-sm border border-rose-500/40 animate-fade-in">
                <span className="text-[11px] text-rose-200">حذف نهائياً؟</span>
                <button
                  type="button"
                  onClick={() => {
                    deleteAppointment(apt.id);
                    setDeletingId(null);
                  }}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-sm cursor-pointer"
                >
                  نعم، احذف
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-[#D8D0C4] text-[10px] rounded-sm cursor-pointer"
                >
                  تراجع
                </button>
              </div>
            ) : (
              <button
                type="button"
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
                      type="button"
                      onClick={() => handleCancelClick(apt.id)}
                      className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-[#0B0A09] text-[10px] font-bold rounded-sm cursor-pointer"
                    >
                      نعم، إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancellingId(null)}
                      className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-[#D8D0C4] text-[10px] rounded-sm cursor-pointer"
                    >
                      تراجع
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
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
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={() => setIsMyBookingsOpen(false)}
    >
      <div
        className="bg-[#0F0E0C] border border-[#B99A5B]/40 rounded-sm w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-[#14120F] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#B99A5B]/20 text-[#B99A5B] flex items-center justify-center border border-[#B99A5B]/40">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#F5F1EA]">
                  حجوزاتي ومتابعة الطلب
                </h3>
                {myBookings.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#B99A5B] text-[#0B0A09] text-[10px] font-bold">
                    {myBookings.length}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#D8D0C4]/60">
                استعلام فوري عن حالة الطلب بالآيدي (موافق عليه · قيد الانتظار · مرفوض)
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

        {/* Order ID or Phone Search & Filter Tabs */}
        <div className="p-4 sm:px-6 bg-[#13110E] border-b border-white/5 space-y-3 shrink-0">
          {/* Quick Order ID or Phone Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#B99A5B] absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                placeholder="ابحثي بآيدي الطلب (مثال: SC-8421) أو برقم الهاتف للاستعلام الفوري..."
                className="w-full pl-3 pr-9 py-2 bg-white/5 border border-white/10 focus:border-[#B99A5B] rounded-sm text-xs text-[#F5F1EA] placeholder-[#D8D0C4]/40 focus:outline-none transition-colors"
                dir="rtl"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] disabled:opacity-60 text-[#0B0A09] font-bold text-xs rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جارِ البحث...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>استعلام وبحث</span>
                </>
              )}
            </button>
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => {
                handleResetSearch();
                setActiveTab('all');
              }}
              className={`px-3 py-1.5 rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all' && !searchState.hasSearched
                  ? 'bg-[#B99A5B] text-[#0B0A09] font-bold shadow-sm'
                  : 'bg-white/5 text-[#D8D0C4]/80 hover:bg-white/10'
              }`}
            >
              الكل ({myBookings.length})
            </button>

            <button
              onClick={() => {
                handleResetSearch();
                setActiveTab('pending');
              }}
              className={`px-3 py-1.5 rounded-sm transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeTab === 'pending' && !searchState.hasSearched
                  ? 'bg-amber-500 text-[#0B0A09] font-bold shadow-sm'
                  : 'bg-white/5 text-amber-300 hover:bg-white/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>انتظار ({pendingCount})</span>
            </button>

            <button
              onClick={() => {
                handleResetSearch();
                setActiveTab('confirmed');
              }}
              className={`px-3 py-1.5 rounded-sm transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeTab === 'confirmed' && !searchState.hasSearched
                  ? 'bg-emerald-500 text-[#0B0A09] font-bold shadow-sm'
                  : 'bg-white/5 text-emerald-300 hover:bg-white/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>موافق عليه ({confirmedCount})</span>
            </button>

            <button
              onClick={() => {
                handleResetSearch();
                setActiveTab('cancelled');
              }}
              className={`px-3 py-1.5 rounded-sm transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeTab === 'cancelled' && !searchState.hasSearched
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
          {searchState.hasSearched && searchState.notFound ? (
            /* Explicit Rejection Screen: Order ID does not exist */
            <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-sm p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-fade-in my-2">
              <div className="w-16 h-16 rounded-full bg-rose-900/60 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-300 shadow-[0_0_25px_rgba(239,68,68,0.35)]">
                <XCircle className="w-9 h-9 text-rose-400" />
              </div>

              <div>
                <span className="text-[11px] font-sans tracking-[0.25em] text-rose-400 font-bold uppercase block mb-1">
                  طلب غير موجود · تم الرفض
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-luxury text-rose-200 font-bold">
                  عذراً، لم يتم العثور على هذا الطلب!
                </h3>
              </div>

              <div className="bg-black/50 border border-rose-500/30 p-3.5 rounded-sm max-w-md mx-auto">
                <p className="text-xs text-[#D8D0C4] leading-relaxed">
                  الآيدي المدخل: <strong className="font-mono text-rose-300 font-bold text-sm tracking-wider" dir="ltr">{searchState.query}</strong> غير مسجل لدينا أو قد تم حذفه أو كتابته بشكل غير دقيق.
                </p>
              </div>

              <p className="text-[11px] text-[#D8D0C4]/70 max-w-sm mx-auto">
                يرجى التأكد من كتابة آيدي الحجز بالشكل الصحيح (مثال: <span className="font-mono text-[#D4BD86]">SC-8421</span>) أو البحث برقم الهاتف.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-[#F5F1EA] text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-white/15"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة وعرض كافة الحجوزات</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً إدارة Style City ✨\nبحثت عن طلبي بالآيدي: (${searchState.query}) وظهر أنه غير مسجل، هل يمكنكم مساعدتي والتحقق من الحجز؟`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0A09] font-bold text-xs rounded-sm transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>استفسار فوري عبر واتساب</span>
                </a>
              </div>
            </div>
          ) : searchState.hasSearched && searchState.foundItem ? (
            /* Explicit Found Order Screen: Order ID exists */
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-sm flex items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    تم العثور على الطلب <strong className="font-mono text-emerald-200 font-bold" dir="ltr">{searchState.foundItem.booking_number}</strong> بنجاح!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="text-xs text-[#D4BD86] hover:underline cursor-pointer font-medium shrink-0 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>عرض الكل</span>
                </button>
              </div>

              {renderBookingCard(searchState.foundItem)}
            </div>
          ) : filteredBookings.length === 0 ? (
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
                type="button"
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
            filteredBookings.map(renderBookingCard)
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
