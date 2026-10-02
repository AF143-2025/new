import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { printBookingPdf } from '../../utils/printPdf';

export const BookingSection: React.FC = () => {
  const {
    departments,
    services,
    staffList,
    createAppointment,
    selectedDepartmentForBooking,
    selectedServiceForBooking,
    setIsMyBookingsOpen,
    settings,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Form selections
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Submission result state
  const [submittedAppointment, setSubmittedAppointment] = useState<Appointment | null>(null);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handle preselection from external buttons
  useEffect(() => {
    if (selectedDepartmentForBooking) {
      setSelectedDeptId(selectedDepartmentForBooking);
      if (selectedServiceForBooking) {
        setSelectedServiceId(selectedServiceForBooking);
        setCurrentStep(3); // jump to staff or date
      } else {
        setCurrentStep(2);
      }
    }
  }, [selectedDepartmentForBooking, selectedServiceForBooking]);

  // Filtered lists
  const activeDepartments = departments.filter((d) => d.is_active);
  const deptServices = services.filter(
    (s) => s.is_active && s.department_id === selectedDeptId
  );
  const deptStaff = staffList.filter(
    (st) => st.is_active && st.department_id === selectedDeptId
  );

  const selectedDept = departments.find((d) => d.id === selectedDeptId);
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedStaff = staffList.find((st) => st.id === selectedStaffId);

  // Generate available next 14 dates with Arabic labels
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayName = new Intl.DateTimeFormat('ar-IQ', { weekday: 'long' }).format(d);
      const formattedDate = d.toISOString().split('T')[0];
      const displayDate = `${d.getDate()} / ${d.getMonth() + 1}`;

      dates.push({
        iso: formattedDate,
        dayName,
        displayDate,
      });
    }
    return dates;
  }, []);

  // Standard elegant time slots
  const timeSlots = [
    '11:00 ص',
    '12:00 م',
    '01:00 م',
    '02:00 م',
    '03:30 م',
    '04:30 م',
    '05:30 م',
    '06:30 م',
    '07:30 م',
    '08:30 م',
  ];

  // Validation
  const validateStep = (step: number): boolean => {
    setErrorMsg('');
    if (step === 1 && !selectedDeptId) {
      setErrorMsg('يرجى اختيار القسم أولاً');
      return false;
    }
    if (step === 2 && !selectedServiceId) {
      setErrorMsg('يرجى اختيار الخدمة المطلوبة');
      return false;
    }
    if (step === 4 && !selectedDate) {
      setErrorMsg('يرجى اختيار تاريخ الموعد');
      return false;
    }
    if (step === 5 && !selectedTime) {
      setErrorMsg('يرجى اختيار الوقت المناسب');
      return false;
    }
    if (step === 6) {
      if (!customerName.trim()) {
        setErrorMsg('يرجى إدخال اسمكِ الكريم');
        return false;
      }
      if (!customerPhone.trim() || customerPhone.trim().length < 8) {
        setErrorMsg('يرجى إدخال رقم هاتف عراقي صحيح (مثال: 07731115599)');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(6)) return;

    if (!selectedDept || !selectedService) {
      setErrorMsg('يرجى إكمال جميع متطلبات الحجز');
      return;
    }

    const { appointment, whatsappUrl } = createAppointment({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      department_id: selectedDept.id,
      department_name: selectedDept.name_ar,
      service_id: selectedService.id,
      service_name: selectedService.name_ar,
      staff_id: selectedStaff?.id,
      staff_name: selectedStaff?.name,
      date: selectedDate,
      time: selectedTime,
      notes: customerNotes.trim(),
    });

    setSubmittedAppointment(appointment);
    setSubmittedWhatsAppUrl(whatsappUrl);
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedDeptId('');
    setSelectedServiceId('');
    setSelectedStaffId('');
    setSelectedDate('');
    setSelectedTime('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNotes('');
    setSubmittedAppointment(null);
    setSubmittedWhatsAppUrl('');
    setErrorMsg('');
  };

  return (
    <section id="booking" className="py-24 sm:py-32 px-4 bg-[#0B0A09] relative border-t border-[#B99A5B]/15">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#B99A5B] text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تجربة سلسة وخاصة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-[#F5F1EA] mb-3 font-normal tracking-wide">
            احجز موعدك
          </h2>
          <p className="text-xs sm:text-sm text-[#D8D0C4]/80 font-light">
            اختر خدماتك والوقت الذي يناسبك في خطوات بسيطة، وسيتواصل فريقنا لتأكيد استلام طلبك.
          </p>
        </div>

        {/* Success Screen after submission */}
        {submittedAppointment ? (
          <div className="bg-[#141210] border border-[#B99A5B]/50 p-6 sm:p-10 rounded-sm shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-[#B99A5B]/15 border border-[#B99A5B] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#B99A5B]" />
            </div>

            <span className="text-xs uppercase tracking-[0.2em] text-[#B99A5B] font-medium block mb-1">
              STYLE CITY BAGHDAD
            </span>

            {/* Crucial requirement: "تم استلام طلب الحجز ✨" */}
            <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#F5F1EA] font-semibold mb-3">
              تم استلام طلب الحجز <span className="text-[#B99A5B]">✨</span>
            </h3>

            <p className="text-sm text-[#D8D0C4]/80 max-w-md mx-auto mb-8 font-light leading-relaxed">
              شكراً لاختياركم Style City. تم تسجيل تفاصيل الموعد بنجاح، وسيقوم فريق الاستقبال بالتواصل معكم لتأكيد الموعد النهائي.
            </p>

            {/* Prominent Order ID Card */}
            <div className="bg-gradient-to-b from-[#181613] to-[#0F0D0B] border-2 border-[#B99A5B] p-5 sm:p-6 rounded-sm max-w-lg mx-auto text-center mb-6 shadow-[0_0_30px_rgba(185,154,91,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#B99A5B]/10 rounded-full blur-2xl pointer-events-none" />
              
              <span className="text-[11px] font-sans tracking-[0.25em] text-[#D8D0C4]/80 uppercase block mb-1">
                آيدي الطلب الرسمي · ORDER ID
              </span>

              <div className="flex items-center justify-center gap-3 my-2">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#D4BD86] tracking-widest selection:bg-[#B99A5B]/40" dir="ltr">
                  {submittedAppointment.booking_number}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submittedAppointment.booking_number);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2500);
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-[#B99A5B] text-[#F5F1EA] hover:text-[#0B0A09] rounded-sm text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer active:scale-95"
                  title="نسخ آيدي الطلب"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#B99A5B]" />
                      <span>نسخ الآيدي</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#D8D0C4]/90 font-light mt-2 max-w-sm mx-auto leading-relaxed">
                احتفظي بهذا الآيدي <strong className="text-[#D4BD86] font-mono font-bold">({submittedAppointment.booking_number})</strong> حيث يمكنكِ البحث به في أي وقت لمعرفة حالة طلبكِ عبر خانة "حجوزاتي".
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#0B0A09] border border-[#B99A5B]/30 p-5 rounded-sm max-w-lg mx-auto text-right space-y-3 mb-6 text-xs sm:text-sm shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[#D8D0C4]/70">آيدي / رقم الطلب:</span>
                <span className="font-mono font-bold text-[#D4BD86] text-base" dir="ltr">
                  {submittedAppointment.booking_number}
                </span>
              </div>

              {/* Status display */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[#D8D0C4]/70">حالة الحجز الحالية:</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                  <span>قيد الانتظار (انتظار مراجعة الإدارة)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#D8D0C4]/70">الاسم:</span>
                <span className="text-[#F5F1EA] font-medium">{submittedAppointment.customer_name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#D8D0C4]/70">رقم الهاتف:</span>
                <span className="text-[#F5F1EA] font-medium" dir="ltr">
                  {submittedAppointment.customer_phone}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#D8D0C4]/70">القسم:</span>
                <span className="text-[#B99A5B] font-medium">{submittedAppointment.department_name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#D8D0C4]/70">الخدمة:</span>
                <span className="text-[#F5F1EA] font-medium">{submittedAppointment.service_name}</span>
              </div>

              {submittedAppointment.staff_name && (
                <div className="flex items-center justify-between">
                  <span className="text-[#D8D0C4]/70">الموظفة المفضلة:</span>
                  <span className="text-[#F5F1EA]">{submittedAppointment.staff_name}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[#D8D0C4]/70">الموعد المطلوب:</span>
                <span className="text-[#F5F1EA] font-medium">
                  {submittedAppointment.date} — الساعة {submittedAppointment.time}
                </span>
              </div>
            </div>

            {/* Direct Actions: PDF Print, My Bookings, and WhatsApp */}
            <div className="flex flex-col gap-3 max-w-lg mx-auto">
              {/* PDF Printing Button */}
              <button
                type="button"
                onClick={() => printBookingPdf(submittedAppointment, settings)}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#D4BD86] via-[#B99A5B] to-[#9E8043] hover:brightness-110 text-[#0B0A09] font-bold text-xs sm:text-sm rounded-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(185,154,91,0.35)] cursor-pointer active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>طبع أو حفظ تذكرة الحجز بصيغة PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMyBookingsOpen(true)}
                className="w-full py-3 px-6 bg-[#B99A5B]/20 hover:bg-[#B99A5B] text-[#D4BD86] hover:text-[#0B0A09] border border-[#B99A5B]/60 font-bold text-xs rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Clock className="w-4 h-4" />
                <span>عرض ومتابعة حالة طلبك في "حجوزاتي"</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={submittedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0A09] font-bold text-xs rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تأكيد سريع عبر واتساب</span>
                </a>

                <button
                  type="button"
                  onClick={resetBooking}
                  className="w-full sm:w-auto py-3 px-6 bg-white/10 hover:bg-white/15 text-[#F5F1EA] text-xs font-medium rounded-sm border border-white/10 transition-colors cursor-pointer"
                >
                  حجز موعد آخر
                </button>
              </div>

              <p className="text-[11px] text-[#D8D0C4]/60 pt-2 text-center">
                💡 يمكنك في أي وقت استخدام آيدي الحجز <strong className="text-[#D4BD86] font-mono">({submittedAppointment.booking_number})</strong> في شريط "حجوزاتي" بأعلى الموقع لمعرفة حالة الطلب مباشرة.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#141210] border border-[#B99A5B]/30 rounded-sm p-6 sm:p-10 shadow-2xl">
            {/* Step Progress Indicators */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-[#D8D0C4]/70 mb-3 font-medium">
                <span>الخطوة {currentStep} من 7</span>
                <span className="text-[#B99A5B]">
                  {currentStep === 1 && 'اختر القسم'}
                  {currentStep === 2 && 'اختر الخدمة'}
                  {currentStep === 3 && 'اختر الأخصائي (اختياري)'}
                  {currentStep === 4 && 'اختر التاريخ'}
                  {currentStep === 5 && 'اختر الوقت'}
                  {currentStep === 6 && 'بيانات التواصل'}
                  {currentStep === 7 && 'تأكيد ومراجعة الطلب'}
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B99A5B] to-[#D4BD86] transition-all duration-300"
                  style={{ width: `${(currentStep / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded text-red-200 text-xs text-right">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: Choose Department */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-serif-luxury text-[#F5F1EA] mb-4 text-right">
                  الخطوة 1: اختر القسم المطلوب
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeDepartments.map((dept) => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        setSelectedServiceId('');
                      }}
                      className={`p-4 rounded-sm border text-right transition-all flex flex-col justify-between cursor-pointer ${
                        selectedDeptId === dept.id
                          ? 'bg-[#B99A5B]/15 border-[#B99A5B] shadow-[0_0_15px_rgba(185,154,91,0.2)]'
                          : 'bg-[#100E0C] border-white/10 hover:border-[#B99A5B]/40'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] text-[#B99A5B] uppercase block mb-1">
                          {dept.name_en}
                        </span>
                        <h4 className="text-base font-serif-luxury font-semibold text-[#F5F1EA]">
                          {dept.name_ar}
                        </h4>
                      </div>
                      <span className="text-xs text-[#D8D0C4]/60 mt-2 block">
                        {dept.highlight || 'قسم متخصص'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Choose Service */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#B99A5B]">القسم: {selectedDept?.name_ar}</span>
                  <h3 className="text-xl font-serif-luxury text-[#F5F1EA]">
                    الخطوة 2: اختر الخدمة
                  </h3>
                </div>

                {deptServices.length > 0 ? (
                  <div className="space-y-3">
                    {deptServices.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setSelectedServiceId(svc.id)}
                        className={`w-full p-4 rounded-sm border text-right transition-all flex items-start justify-between cursor-pointer ${
                          selectedServiceId === svc.id
                            ? 'bg-[#B99A5B]/15 border-[#B99A5B]'
                            : 'bg-[#100E0C] border-white/10 hover:border-[#B99A5B]/40'
                        }`}
                      >
                        <div className="max-w-md">
                          <h4 className="text-base font-serif-luxury font-semibold text-[#F5F1EA] mb-1">
                            {svc.name_ar}
                          </h4>
                          <p className="text-xs text-[#D8D0C4]/70 leading-relaxed font-light">
                            {svc.description_ar}
                          </p>
                        </div>
                        <div className="text-left shrink-0 mr-4">
                          {svc.duration && (
                            <span className="text-xs text-[#B99A5B] block">{svc.duration}</span>
                          )}
                          {svc.show_price && svc.price ? (
                            <span className="text-xs font-bold text-[#F5F1EA] block mt-1">
                              {svc.price} د.ع
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#D8D0C4]/50 block mt-1">
                              حسب الاستشارة
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-[#D8D0C4]/60">
                    لا توجد خدمات متاحة لهذا القسم حالياً.
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Choose Staff (Optional) */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#B99A5B]">اختياري</span>
                  <h3 className="text-xl font-serif-luxury text-[#F5F1EA]">
                    الخطوة 3: اختر الأخصائي / الموظف
                  </h3>
                </div>
                <p className="text-xs text-[#D8D0C4]/70 mb-4 text-right">
                  يمكنكم اختيار أخصائي محدد، أو ترك الاختيار لأقرب موظف متاح في وقت الموعد.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Default: Any Staff */}
                  <button
                    type="button"
                    onClick={() => setSelectedStaffId('')}
                    className={`p-4 rounded-sm border text-right transition-all cursor-pointer flex items-center gap-3 ${
                      selectedStaffId === ''
                        ? 'bg-[#B99A5B]/15 border-[#B99A5B]'
                        : 'bg-[#100E0C] border-white/10 hover:border-[#B99A5B]/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B99A5B]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#F5F1EA]">أي موظف متاح</h4>
                      <p className="text-[11px] text-[#D8D0C4]/60">أسرع وقت متاح مع خبرائنا</p>
                    </div>
                  </button>

                  {/* Department Staff Members */}
                  {deptStaff.map((staff) => (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => setSelectedStaffId(staff.id)}
                      className={`p-4 rounded-sm border text-right transition-all cursor-pointer flex items-center gap-3 ${
                        selectedStaffId === staff.id
                          ? 'bg-[#B99A5B]/15 border-[#B99A5B]'
                          : 'bg-[#100E0C] border-white/10 hover:border-[#B99A5B]/40'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B99A5B]/40 shrink-0">
                        {staff.photo ? (
                          <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-black/60 flex items-center justify-center text-xs text-[#B99A5B]">
                            SC
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#F5F1EA]">{staff.name}</h4>
                        <p className="text-[11px] text-[#D8D0C4]/60">{staff.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Choose Date */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-xl font-serif-luxury text-[#F5F1EA] mb-4 text-right">
                  الخطوة 4: اختر التاريخ
                </h3>
                <p className="text-xs text-[#D8D0C4]/70 mb-4 text-right">
                  الأيام المتاحة خلال الأسبوعين القادمين:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {availableDates.map((item) => (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => setSelectedDate(item.iso)}
                      className={`p-3 rounded-sm border text-center transition-all cursor-pointer ${
                        selectedDate === item.iso
                          ? 'bg-[#B99A5B] text-[#0B0A09] border-[#B99A5B] font-bold'
                          : 'bg-[#100E0C] text-[#F5F1EA] border-white/10 hover:border-[#B99A5B]/40'
                      }`}
                    >
                      <span className="text-[11px] block opacity-80">{item.dayName}</span>
                      <span className="text-sm font-semibold block mt-1" dir="ltr">
                        {item.displayDate}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Choose Time */}
            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#B99A5B]">التاريخ: {selectedDate}</span>
                  <h3 className="text-xl font-serif-luxury text-[#F5F1EA]">
                    الخطوة 5: اختر الوقت المناسب
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 px-2 rounded-sm border text-center text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        selectedTime === slot
                          ? 'bg-[#B99A5B] text-[#0B0A09] border-[#B99A5B] font-bold'
                          : 'bg-[#100E0C] text-[#F5F1EA] border-white/10 hover:border-[#B99A5B]/40'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 mx-auto mb-1 opacity-70" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: Customer Details */}
            {currentStep === 6 && (
              <div className="text-right">
                <h3 className="text-xl font-serif-luxury text-[#F5F1EA] mb-4">
                  الخطوة 6: بيانات التواصل
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#D8D0C4] mb-1.5 font-medium">
                      الاسم الكامل <span className="text-[#B99A5B]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: سارة محمد"
                        className="w-full bg-[#100E0C] border border-white/15 focus:border-[#B99A5B] text-[#F5F1EA] px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-colors"
                        required
                      />
                      <User className="w-4 h-4 text-[#B99A5B] absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#D8D0C4] mb-1.5 font-medium">
                      رقم الهاتف (العراق) <span className="text-[#B99A5B]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        dir="ltr"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="07731115599"
                        className="w-full bg-[#100E0C] border border-white/15 focus:border-[#B99A5B] text-[#F5F1EA] px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-colors text-right"
                        required
                      />
                      <Phone className="w-4 h-4 text-[#B99A5B] absolute left-3 top-3" />
                    </div>
                    <span className="text-[11px] text-[#D8D0C4]/50 mt-1 block">
                      سنتواصل معكم عبر هذا الرقم للتأكيد أو المتابعة.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs text-[#D8D0C4] mb-1.5 font-medium">
                      ملاحظات خاصة أو استفسارات (اختياري)
                    </label>
                    <textarea
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      rows={3}
                      placeholder="هل لديكم تفضيلات خاصة بالموعد، نوع بشرة، أو استفسار محدد؟"
                      className="w-full bg-[#100E0C] border border-white/15 focus:border-[#B99A5B] text-[#F5F1EA] px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Order Confirmation & Review */}
            {currentStep === 7 && (
              <div className="text-right">
                <h3 className="text-xl font-serif-luxury text-[#F5F1EA] mb-4">
                  الخطوة 7: مراجعة وتأكيد طلب الحجز
                </h3>

                <div className="bg-[#100E0C] border border-[#B99A5B]/30 p-5 rounded-sm space-y-3 text-xs sm:text-sm mb-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[#D8D0C4]/70">القسم:</span>
                    <span className="font-semibold text-[#B99A5B]">{selectedDept?.name_ar}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[#D8D0C4]/70">الخدمة:</span>
                    <span className="font-semibold text-[#F5F1EA]">{selectedService?.name_ar}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[#D8D0C4]/70">الموظفة:</span>
                    <span className="text-[#F5F1EA]">
                      {selectedStaff ? selectedStaff.name : 'أقرب أخصائية متاحة'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[#D8D0C4]/70">التاريخ والوقت:</span>
                    <span className="font-semibold text-[#F5F1EA]">
                      {selectedDate} — الساعة {selectedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[#D8D0C4]/70">اسم العميلة:</span>
                    <span className="text-[#F5F1EA]">{customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#D8D0C4]/70">رقم الهاتف:</span>
                    <span className="text-[#F5F1EA]" dir="ltr">
                      {customerPhone}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-xs text-[#D8D0C4]/80 flex items-start gap-2 mb-6">
                  <ShieldCheck className="w-4 h-4 text-[#B99A5B] shrink-0 mt-0.5" />
                  <span>
                    عند الضغط على إرسال، سيتم تسجيل طلب الحجز لدى الإدارة وسيتم الاتصال بكِ لتأكيده.
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-[#D8D0C4] text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>السابق</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 rounded-sm bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs transition-all shadow-[0_0_15px_rgba(185,154,91,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>متابعة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-sm bg-gradient-to-r from-[#D4BD86] via-[#B99A5B] to-[#9E8043] text-[#0B0A09] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(185,154,91,0.4)] flex items-center gap-2 cursor-pointer hover:shadow-[0_0_30px_rgba(185,154,91,0.6)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>إرسال طلب الحجز</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
