import React, { useState, useMemo } from 'react';
import {
  X,
  LayoutDashboard,
  Calendar,
  Layers,
  Sparkles,
  Users,
  Camera,
  UserCheck,
  Clock,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock4,
  MessageCircle,
  Phone,
  Save,
  RotateCcw,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, Department, Service, Staff, GalleryItem } from '../../types';
import { Logo } from '../common/Logo';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    updateSettings,
    businessHours,
    updateBusinessDay,
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    services,
    addService,
    updateService,
    deleteService,
    staffList,
    addStaff,
    updateStaff,
    deleteStaff,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    appointments,
    updateAppointmentStatus,
    updateAppointmentNotes,
    deleteAppointment,
    customers,
    updateCustomerNotes,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    resetToDefaults,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'appointments'
    | 'departments'
    | 'services'
    | 'staff'
    | 'gallery'
    | 'customers'
    | 'hours'
    | 'settings'
  >('dashboard');

  // Login form state
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search & Filters for Appointments
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>('all');

  // Modal / Form states for CRUD
  const [editingDepartment, setEditingDepartment] = useState<Partial<Department> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<Staff> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);

  // Settings form state
  const [tempSettings, setTempSettings] = useState(settings);

  // Sync settings when loaded
  React.useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  if (!isAdminOpen) return null;

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setLoginError('');
      setPasscode('');
    } else {
      setLoginError('رمز المرور غير صحيح. (الرمز الافتراضي: stylecity2026)');
    }
  };

  // KPIs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus =
      appointmentStatusFilter === 'all' || apt.status === appointmentStatusFilter;
    const matchesSearch =
      apt.customer_name.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.customer_phone.includes(appointmentSearch) ||
      apt.booking_number.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.service_name.toLowerCase().includes(appointmentSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <Clock4 className="w-3 h-3" /> معلق
          </span>
        );
      case 'confirmed':
        return (
          <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> مؤكد
          </span>
        );
      case 'completed':
        return (
          <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> مكتمل
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-rose-400 bg-rose-950/40 border border-rose-800/60 px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <XCircle className="w-3 h-3" /> ملغي
          </span>
        );
      case 'no_show':
        return (
          <span className="text-zinc-400 bg-zinc-800/60 border border-zinc-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
            لم تحضر
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0A09] text-[#F5F1EA] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="bg-[#141210] border-b border-[#B99A5B]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo variant="compact" />
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B99A5B] hidden sm:inline">
            لوحة تحكم الإدارة
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAdminAuthenticated && (
            <button
              onClick={logoutAdmin}
              className="p-2 text-[#D8D0C4]/70 hover:text-rose-400 hover:bg-white/5 rounded transition-colors text-xs flex items-center gap-1"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          )}

          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-4 py-2 bg-white/10 hover:bg-[#B99A5B] text-[#F5F1EA] hover:text-[#0B0A09] text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى الموقع</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      {!isAdminAuthenticated ? (
        /* Login Screen */
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141210] border border-[#B99A5B]/40 rounded-sm p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-[#B99A5B]/15 border border-[#B99A5B] flex items-center justify-center mx-auto mb-5 text-[#B99A5B]">
              <Lock className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-serif-luxury font-semibold mb-2">تسجيل دخول الإدارة</h2>
            <p className="text-xs text-[#D8D0C4]/70 mb-6">
              أدخلي رمز المرور للوصول إلى بيانات الحجوزات وتعديل المحتوى.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-right">
              <div>
                <label className="block text-xs text-[#D8D0C4] mb-1.5">رمز المرور (Passcode)</label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="أدخلي رمز المرور..."
                  className="w-full bg-[#0B0A09] border border-white/15 focus:border-[#B99A5B] rounded px-4 py-2.5 text-sm focus:outline-none text-center tracking-widest"
                  autoFocus
                />
              </div>

              {loginError && <p className="text-xs text-rose-400 text-center">{loginError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs rounded transition-all shadow-md cursor-pointer"
              >
                دخول لوحة التحكم
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-[#D8D0C4]/40">
              الرمز الافتراضي للتجربة: <span className="text-[#B99A5B]">stylecity2026</span>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard View */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 bg-[#100E0C] border-b md:border-b-0 md:border-l border-[#B99A5B]/20 p-4 overflow-y-auto">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>نظرة عامة</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'appointments'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>الحجوزات</span>
                </div>
                {pendingAppointments.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                    {pendingAppointments.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('departments')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'departments'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>الأقسام ({departments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'services'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>الخدمات ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('staff')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'staff'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>الموظفات ({staffList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span>معرض الأعمال ({gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'customers'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>العملاء ({customers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hours')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'hours'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>أوقات العمل</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium whitespace-nowrap text-right transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                    : 'text-[#D8D0C4] hover:bg-white/5 hover:text-[#F5F1EA]'
                }`}
              >
                <SettingsIcon className="w-4 h-4 shrink-0" />
                <span>روابط التواصل والإعدادات</span>
              </button>
            </nav>
          </aside>

          {/* Tab Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#0B0A09]">
            {/* 1. OVERVIEW DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif-luxury font-semibold mb-1">
                    لوحة الإحصائيات العامة
                  </h2>
                  <p className="text-xs text-[#D8D0C4]/70">
                    متابعة يومية لنشاط الحجوزات والخدمات في Style City Baghdad
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-[#141210] border border-[#B99A5B]/30 p-4 rounded-sm text-right">
                    <span className="text-[11px] text-[#D8D0C4]/70 block mb-1">حجوزات اليوم</span>
                    <span className="text-2xl font-bold text-[#F5F1EA]">
                      {todayAppointments.length}
                    </span>
                  </div>

                  <div className="bg-[#141210] border border-amber-500/30 p-4 rounded-sm text-right">
                    <span className="text-[11px] text-amber-400 block mb-1">طلبات معلقة</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {pendingAppointments.length}
                    </span>
                  </div>

                  <div className="bg-[#141210] border border-emerald-500/30 p-4 rounded-sm text-right">
                    <span className="text-[11px] text-emerald-400 block mb-1">حجوزات مؤكدة</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {confirmedAppointments.length}
                    </span>
                  </div>

                  <div className="bg-[#141210] border border-cyan-500/30 p-4 rounded-sm text-right">
                    <span className="text-[11px] text-cyan-400 block mb-1">مكتملة</span>
                    <span className="text-2xl font-bold text-cyan-400">
                      {completedAppointments.length}
                    </span>
                  </div>

                  <div className="bg-[#141210] border border-white/10 p-4 rounded-sm text-right">
                    <span className="text-[11px] text-[#D8D0C4]/70 block mb-1">عدد الأقسام</span>
                    <span className="text-2xl font-bold text-[#F5F1EA]">
                      {departments.length}
                    </span>
                  </div>

                  <div className="bg-[#141210] border border-white/10 p-4 rounded-sm text-right">
                    <span className="text-[11px] text-[#D8D0C4]/70 block mb-1">عدد الخدمات</span>
                    <span className="text-2xl font-bold text-[#F5F1EA]">
                      {services.length}
                    </span>
                  </div>
                </div>

                {/* Recent Bookings Queue */}
                <div className="bg-[#141210] border border-[#B99A5B]/20 rounded-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs text-[#B99A5B] hover:underline"
                    >
                      عرض جميع الحجوزات ←
                    </button>
                    <h3 className="text-base font-serif-luxury font-semibold">
                      أحدث طلبات الحجز المستلمة
                    </h3>
                  </div>

                  <div className="divide-y divide-white/5">
                    {appointments.slice(0, 5).map((apt) => (
                      <div
                        key={apt.id}
                        className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-[#F5F1EA]">
                              {apt.customer_name}
                            </span>
                            <span className="text-[11px] text-[#D8D0C4]/60 font-mono" dir="ltr">
                              ({apt.booking_number})
                            </span>
                            {getStatusBadge(apt.status)}
                          </div>
                          <p className="text-[#D8D0C4]/80">
                            {apt.department_name} — {apt.service_name}
                          </p>
                          <span className="text-[11px] text-[#B99A5B]">
                            {apt.date} الساعة {apt.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] transition-colors"
                            >
                              تأكيد
                            </button>
                          )}
                          <a
                            href={`https://wa.me/${apt.customer_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 rounded transition-colors"
                            title="مراسلة واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. APPOINTMENTS MANAGEMENT */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-serif-luxury font-semibold mb-1">إدارة الحجوزات</h2>
                    <p className="text-xs text-[#D8D0C4]/70">
                      متابعة حالات الحجز، البحث برقم الهاتف أو الاسم، والتواصل المباشر مع العميلات
                    </p>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[#B99A5B] absolute right-3 top-3" />
                    <input
                      type="text"
                      value={appointmentSearch}
                      onChange={(e) => setAppointmentSearch(e.target.value)}
                      placeholder="البحث بالاسم، رقم الهاتف، أو كود الحجز..."
                      className="w-full bg-[#141210] border border-white/10 rounded pr-9 pl-4 py-2 text-xs focus:outline-none focus:border-[#B99A5B]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => setAppointmentStatusFilter(st)}
                          className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
                            appointmentStatusFilter === st
                              ? 'bg-[#B99A5B] text-[#0B0A09] font-bold'
                              : 'bg-white/5 text-[#D8D0C4] hover:bg-white/10'
                          }`}
                        >
                          {st === 'all' && 'الكل'}
                          {st === 'pending' && 'معلقة'}
                          {st === 'confirmed' && 'مؤكدة'}
                          {st === 'completed' && 'مكتملة'}
                          {st === 'cancelled' && 'ملغية'}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Appointments Table */}
                <div className="bg-[#141210] border border-[#B99A5B]/20 rounded-sm overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#100E0C] text-[#B99A5B] border-b border-white/10">
                      <tr>
                        <th className="p-3">رقم الطلب</th>
                        <th className="p-3">العميلة</th>
                        <th className="p-3">القسم والخدمة</th>
                        <th className="p-3">الموعد</th>
                        <th className="p-3">الموظفة</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3">ملاحظات داخلية</th>
                        <th className="p-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-[#D4BD86]" dir="ltr">
                            {apt.booking_number}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold block">{apt.customer_name}</span>
                            <span className="text-[#D8D0C4]/60 text-[11px]" dir="ltr">
                              {apt.customer_phone}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-[#B99A5B] block">{apt.department_name}</span>
                            <span className="text-[#D8D0C4]/80">{apt.service_name}</span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="block">{apt.date}</span>
                            <span className="text-[#B99A5B]">{apt.time}</span>
                          </td>
                          <td className="p-3 text-[#D8D0C4]/80">
                            {apt.staff_name || 'غير محددة'}
                          </td>
                          <td className="p-3">
                            <select
                              value={apt.status}
                              onChange={(e) =>
                                updateAppointmentStatus(
                                  apt.id,
                                  e.target.value as AppointmentStatus
                                )
                              }
                              className={`border rounded px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${
                                apt.status === 'confirmed'
                                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                                  : apt.status === 'pending'
                                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                                  : apt.status === 'cancelled'
                                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                                  : 'bg-[#0B0A09] border-white/20 text-[#D8D0C4]'
                              }`}
                            >
                              <option value="pending" className="bg-[#0B0A09] text-amber-300">قيد الانتظار (انتظار)</option>
                              <option value="confirmed" className="bg-[#0B0A09] text-emerald-300">موافق عليه (مؤكد)</option>
                              <option value="cancelled" className="bg-[#0B0A09] text-rose-300">مرفوض (ملغي)</option>
                              <option value="completed" className="bg-[#0B0A09] text-[#B99A5B]">مكتمل بنجاح</option>
                              <option value="no_show" className="bg-[#0B0A09] text-gray-400">لم تحضر</option>
                            </select>
                          </td>
                          <td className="p-3 max-w-[200px]">
                            <input
                              type="text"
                              defaultValue={apt.internal_notes || ''}
                              onBlur={(e) => updateAppointmentNotes(apt.id, e.target.value)}
                              placeholder="أضيفي ملاحظة..."
                              className="w-full bg-[#0B0A09] border border-white/10 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-[#B99A5B]"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* WhatsApp Contact Button */}
                              <a
                                href={`https://wa.me/${apt.customer_phone.replace(
                                  /\D/g,
                                  ''
                                )}?text=${encodeURIComponent(
                                  `مرحباً ${apt.customer_name} من Style City بغداد ✨ بخصوص طلب حجزكم رقم ${apt.booking_number}...`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 rounded transition-colors"
                                title="مراسلة العميل عبر الواتساب"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  if (window.confirm('هل تريدين حذف هذا الحجز نهائياً؟')) {
                                    deleteAppointment(apt.id);
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                                title="حذف الحجز"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-8 text-xs text-[#D8D0C4]/60">
                      لا توجد حجوزات مطابقة للبحث أو الفلتر.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. DEPARTMENTS MANAGEMENT */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif-luxury font-semibold mb-1">إدارة الأقسام</h2>
                    <p className="text-xs text-[#D8D0C4]/70">
                      إضافة، تعديل، وترتيب أقسام Style City وتحديد الصور والوصف
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingDepartment({
                        name_ar: '',
                        name_en: '',
                        slug: '',
                        description_ar: '',
                        image:
                          'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
                        is_active: true,
                        sort_order: departments.length + 1,
                        highlight: '',
                      })
                    }
                    className="px-4 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة قسم جديد</span>
                  </button>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="bg-[#141210] border border-[#B99A5B]/25 rounded-sm p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-video rounded overflow-hidden mb-3 bg-black/40">
                          <img
                            src={dept.image}
                            alt={dept.name_ar}
                            className="w-full h-full object-cover"
                          />
                          {!dept.is_active && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-rose-400 font-semibold">
                              معطل
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#B99A5B] mb-1">
                          <span>الترتيب: {dept.sort_order}</span>
                          <span className="font-sans uppercase text-[10px]">{dept.name_en}</span>
                        </div>

                        <h3 className="text-lg font-serif-luxury font-semibold text-[#F5F1EA] mb-1">
                          {dept.name_ar}
                        </h3>

                        <p className="text-xs text-[#D8D0C4]/70 line-clamp-2 mb-4">
                          {dept.description_ar}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <button
                          onClick={() =>
                            updateDepartment(dept.id, { is_active: !dept.is_active })
                          }
                          className="text-[#D8D0C4] hover:text-[#B99A5B] flex items-center gap-1"
                        >
                          {dept.is_active ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>مفعل</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                              <span>معطل</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingDepartment(dept)}
                            className="p-1.5 text-[#B99A5B] hover:bg-white/5 rounded"
                            title="تعديل"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('هل أنتِ متأكدة من حذف هذا القسم؟')) {
                                deleteDepartment(dept.id);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:bg-white/5 rounded"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit / Add Department Modal */}
                {editingDepartment && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#141210] border border-[#B99A5B] rounded-sm max-w-lg w-full p-6 text-right max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <h3 className="text-lg font-serif-luxury font-semibold text-[#F5F1EA]">
                          {editingDepartment.id ? 'تعديل القسم' : 'إضافة قسم جديد'}
                        </h3>
                        <button
                          onClick={() => setEditingDepartment(null)}
                          className="p-1 text-[#D8D0C4] hover:text-[#B99A5B]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block text-[#D8D0C4] mb-1">اسم القسم (عربي)</label>
                          <input
                            type="text"
                            value={editingDepartment.name_ar || ''}
                            onChange={(e) =>
                              setEditingDepartment({
                                ...editingDepartment,
                                name_ar: e.target.value,
                              })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B99A5B]"
                            placeholder="مثال: قسم الرموش"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">الاسم بالإنجليزي</label>
                          <input
                            type="text"
                            value={editingDepartment.name_en || ''}
                            onChange={(e) =>
                              setEditingDepartment({
                                ...editingDepartment,
                                name_en: e.target.value,
                              })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B99A5B]"
                            placeholder="Eyelashes Lounge"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">الوصف</label>
                          <textarea
                            value={editingDepartment.description_ar || ''}
                            onChange={(e) =>
                              setEditingDepartment({
                                ...editingDepartment,
                                description_ar: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#B99A5B]"
                            placeholder="وصف الخدمات وتفاصيل العناية..."
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">رابط الصورة (URL)</label>
                          <input
                            type="url"
                            value={editingDepartment.image || ''}
                            onChange={(e) =>
                              setEditingDepartment({
                                ...editingDepartment,
                                image: e.target.value,
                              })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#B99A5B]"
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">ميزة خاصة (Highlight)</label>
                          <input
                            type="text"
                            value={editingDepartment.highlight || ''}
                            onChange={(e) =>
                              setEditingDepartment({
                                ...editingDepartment,
                                highlight: e.target.value,
                              })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#B99A5B]"
                            placeholder="مثال: دقة متناهية وشعرة شعرة"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#D8D0C4] mb-1">ترتيب الظهور</label>
                            <input
                              type="number"
                              value={editingDepartment.sort_order || 1}
                              onChange={(e) =>
                                setEditingDepartment({
                                  ...editingDepartment,
                                  sort_order: Number(e.target.value),
                                })
                              }
                              className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#B99A5B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#D8D0C4] mb-1">الحالة</label>
                            <select
                              value={editingDepartment.is_active ? 'true' : 'false'}
                              onChange={(e) =>
                                setEditingDepartment({
                                  ...editingDepartment,
                                  is_active: e.target.value === 'true',
                                })
                              }
                              className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                            >
                              <option value="true">مفعل</option>
                              <option value="false">معطل</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDepartment(null)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#D8D0C4] rounded text-xs"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!editingDepartment.name_ar) return;
                              if (editingDepartment.id) {
                                updateDepartment(editingDepartment.id, editingDepartment);
                              } else {
                                addDepartment(
                                  editingDepartment as Omit<
                                    Department,
                                    'id' | 'created_at' | 'updated_at'
                                  >
                                );
                              }
                              setEditingDepartment(null);
                            }}
                            className="px-5 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold rounded text-xs"
                          >
                            حفظ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. SERVICES MANAGEMENT */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif-luxury font-semibold mb-1">إدارة الخدمات</h2>
                    <p className="text-xs text-[#D8D0C4]/70">
                      إضافة الخدمات، ربطها بالأقسام، تحديد المدة، وإخفاء أو إظهار السعر
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingService({
                        department_id: departments[0]?.id || '',
                        name_ar: '',
                        slug: '',
                        description_ar: '',
                        duration: '60 دقيقة',
                        price: '',
                        show_price: false,
                        is_active: true,
                        sort_order: services.length + 1,
                      })
                    }
                    className="px-4 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة خدمة جديدة</span>
                  </button>
                </div>

                {/* Services Table */}
                <div className="bg-[#141210] border border-[#B99A5B]/20 rounded-sm overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#100E0C] text-[#B99A5B] border-b border-white/10">
                      <tr>
                        <th className="p-3">الخدمة</th>
                        <th className="p-3">القسم</th>
                        <th className="p-3">المدة</th>
                        <th className="p-3">السعر</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {services.map((svc) => {
                        const dept = departments.find((d) => d.id === svc.department_id);
                        return (
                          <tr key={svc.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3">
                              <span className="font-semibold block">{svc.name_ar}</span>
                              <span className="text-[11px] text-[#D8D0C4]/60 line-clamp-1">
                                {svc.description_ar}
                              </span>
                            </td>
                            <td className="p-3 text-[#B99A5B]">{dept?.name_ar}</td>
                            <td className="p-3 text-[#D8D0C4]/80">{svc.duration || '-'}</td>
                            <td className="p-3">
                              {svc.show_price && svc.price ? (
                                <span className="font-semibold text-emerald-400">
                                  {svc.price} د.ع
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#D8D0C4]/50">حسب الاستشارة</span>
                              )}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() =>
                                  updateService(svc.id, { is_active: !svc.is_active })
                                }
                                className="flex items-center gap-1"
                              >
                                {svc.is_active ? (
                                  <span className="text-emerald-400 text-[11px]">مفعلة</span>
                                ) : (
                                  <span className="text-rose-400 text-[11px]">معطلة</span>
                                )}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setEditingService(svc)}
                                  className="p-1 text-[#B99A5B] hover:bg-white/5 rounded"
                                  title="تعديل"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('هل تريدين حذف هذه الخدمة؟')) {
                                      deleteService(svc.id);
                                    }
                                  }}
                                  className="p-1 text-rose-400 hover:bg-white/5 rounded"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Edit Service Modal */}
                {editingService && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#141210] border border-[#B99A5B] rounded-sm max-w-lg w-full p-6 text-right max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <h3 className="text-lg font-serif-luxury font-semibold text-[#F5F1EA]">
                          {editingService.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                        </h3>
                        <button
                          onClick={() => setEditingService(null)}
                          className="p-1 text-[#D8D0C4] hover:text-[#B99A5B]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block text-[#D8D0C4] mb-1">القسم التابع له</label>
                          <select
                            value={editingService.department_id || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                department_id: e.target.value,
                              })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#B99A5B]"
                          >
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name_ar}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">اسم الخدمة</label>
                          <input
                            type="text"
                            value={editingService.name_ar || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                name_ar: e.target.value,
                              })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B99A5B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">الوصف</label>
                          <textarea
                            value={editingService.description_ar || ''}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                description_ar: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#B99A5B]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#D8D0C4] mb-1">المدة التقريبية</label>
                            <input
                              type="text"
                              value={editingService.duration || ''}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  duration: e.target.value,
                                })
                              }
                              placeholder="مثال: 60 دقيقة"
                              className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[#D8D0C4] mb-1">السعر (د.ع)</label>
                            <input
                              type="text"
                              value={editingService.price || ''}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  price: e.target.value,
                                })
                              }
                              placeholder="يترك فارغاً إذا كان حسب الاستشارة"
                              className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded border border-white/10">
                          <input
                            type="checkbox"
                            id="show_price_check"
                            checked={editingService.show_price || false}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                show_price: e.target.checked,
                              })
                            }
                            className="accent-[#B99A5B]"
                          />
                          <label htmlFor="show_price_check" className="text-xs text-[#F5F1EA]">
                            إظهار السعر للعملاء في الموقع (إن لم يتم تفعيله يظهر &quot;حسب الاستشارة&quot;)
                          </label>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingService(null)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#D8D0C4] rounded text-xs"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!editingService.name_ar) return;
                              if (editingService.id) {
                                updateService(editingService.id, editingService);
                              } else {
                                addService(
                                  editingService as Omit<
                                    Service,
                                    'id' | 'created_at' | 'updated_at'
                                  >
                                );
                              }
                              setEditingService(null);
                            }}
                            className="px-5 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold rounded text-xs"
                          >
                            حفظ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. STAFF MANAGEMENT */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif-luxury font-semibold mb-1">طاقم العمل والموظفات</h2>
                    <p className="text-xs text-[#D8D0C4]/70">
                      إدارة خبيرات وأطباء Style City (مثل دكتورة كارما وخبيرات الفيبروز والأظافر)
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingStaff({
                        name: '',
                        title: '',
                        department_id: departments[0]?.id || '',
                        photo:
                          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
                        bio: '',
                        is_active: true,
                      })
                    }
                    className="px-4 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة موظفة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {staffList.map((st) => {
                    const dept = departments.find((d) => d.id === st.department_id);
                    return (
                      <div
                        key={st.id}
                        className="bg-[#141210] border border-[#B99A5B]/20 rounded-sm p-4 text-right flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-square rounded-sm overflow-hidden bg-black/40 mb-3 border border-white/10">
                            {st.photo ? (
                              <img
                                src={st.photo}
                                alt={st.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl text-[#B99A5B]">
                                SC
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-[#B99A5B] block mb-1">
                            {dept?.name_ar}
                          </span>
                          <h4 className="text-base font-serif-luxury font-semibold text-[#F5F1EA]">
                            {st.name}
                          </h4>
                          <p className="text-xs text-[#D8D0C4]/70 mb-2">{st.title}</p>
                          {st.bio && (
                            <p className="text-[11px] text-[#D8D0C4]/60 line-clamp-2">{st.bio}</p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2 mt-4">
                          <button
                            onClick={() => setEditingStaff(st)}
                            className="p-1 text-[#B99A5B] hover:bg-white/5 rounded"
                            title="تعديل"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('هل تريدين حذف هذه الموظفة؟')) {
                                deleteStaff(st.id);
                              }
                            }}
                            className="p-1 text-rose-400 hover:bg-white/5 rounded"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Edit Staff Modal */}
                {editingStaff && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#141210] border border-[#B99A5B] rounded-sm max-w-md w-full p-6 text-right">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <h3 className="text-lg font-serif-luxury font-semibold text-[#F5F1EA]">
                          {editingStaff.id ? 'تعديل بيانات الموظفة' : 'إضافة موظفة جديدة'}
                        </h3>
                        <button
                          onClick={() => setEditingStaff(null)}
                          className="p-1 text-[#D8D0C4] hover:text-[#B99A5B]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[#D8D0C4] mb-1">الاسم الكامل</label>
                          <input
                            type="text"
                            value={editingStaff.name || ''}
                            onChange={(e) =>
                              setEditingStaff({ ...editingStaff, name: e.target.value })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">المسمى الوظيفي</label>
                          <input
                            type="text"
                            value={editingStaff.title || ''}
                            onChange={(e) =>
                              setEditingStaff({ ...editingStaff, title: e.target.value })
                            }
                            placeholder="مثال: أخصائية تاتو فيبروز معتمدة"
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">القسم</label>
                          <select
                            value={editingStaff.department_id || ''}
                            onChange={(e) =>
                              setEditingStaff({ ...editingStaff, department_id: e.target.value })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          >
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name_ar}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">رابط الصورة (URL)</label>
                          <input
                            type="url"
                            value={editingStaff.photo || ''}
                            onChange={(e) =>
                              setEditingStaff({ ...editingStaff, photo: e.target.value })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">نبذة مختصرة</label>
                          <textarea
                            value={editingStaff.bio || ''}
                            onChange={(e) =>
                              setEditingStaff({ ...editingStaff, bio: e.target.value })
                            }
                            rows={2}
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingStaff(null)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#D8D0C4] rounded text-xs"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!editingStaff.name) return;
                              if (editingStaff.id) {
                                updateStaff(editingStaff.id, editingStaff);
                              } else {
                                addStaff(editingStaff as Omit<Staff, 'id'>);
                              }
                              setEditingStaff(null);
                            }}
                            className="px-5 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold rounded text-xs"
                          >
                            حفظ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. GALLERY CMS */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif-luxury font-semibold mb-1">معرض الأعمال CMS</h2>
                    <p className="text-xs text-[#D8D0C4]/70">
                      إضافة وتعديل صور الأعمال مع Alt Text لمحركات البحث SEO
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingGallery({
                        title: '',
                        department_id: departments[0]?.id || '',
                        department_name_ar: departments[0]?.name_ar || '',
                        image:
                          'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop',
                        alt: 'أعمال ستايل سيتي بغداد في شارع الأميرات',
                        description: '',
                        is_featured: false,
                        is_published: true,
                        sort_order: gallery.length + 1,
                      })
                    }
                    className="px-4 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة صورة جديدة</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#141210] border border-[#B99A5B]/20 rounded-sm p-3 flex flex-col justify-between text-right"
                    >
                      <div>
                        <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-black/40">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] text-[#B99A5B] block mb-1">
                          {item.department_name_ar}
                        </span>
                        <h4 className="text-xs font-semibold text-[#F5F1EA] line-clamp-1 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-[#D8D0C4]/50 line-clamp-1 mb-2">
                          Alt: {item.alt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <button
                          onClick={() =>
                            updateGalleryItem(item.id, { is_published: !item.is_published })
                          }
                          className="text-[11px]"
                        >
                          {item.is_published ? (
                            <span className="text-emerald-400">منشور</span>
                          ) : (
                            <span className="text-rose-400">مخفي</span>
                          )}
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingGallery(item)}
                            className="p-1 text-[#B99A5B] hover:bg-white/5 rounded"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('هل تريدين حذف هذه الصورة؟')) {
                                deleteGalleryItem(item.id);
                              }
                            }}
                            className="p-1 text-rose-400 hover:bg-white/5 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Gallery Item Modal */}
                {editingGallery && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#141210] border border-[#B99A5B] rounded-sm max-w-md w-full p-6 text-right max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <h3 className="text-lg font-serif-luxury font-semibold text-[#F5F1EA]">
                          {editingGallery.id ? 'تعديل صورة المعرض' : 'إضافة صورة جديدة'}
                        </h3>
                        <button
                          onClick={() => setEditingGallery(null)}
                          className="p-1 text-[#D8D0C4] hover:text-[#B99A5B]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[#D8D0C4] mb-1">عنوان الصورة</label>
                          <input
                            type="text"
                            value={editingGallery.title || ''}
                            onChange={(e) =>
                              setEditingGallery({ ...editingGallery, title: e.target.value })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">القسم</label>
                          <select
                            value={editingGallery.department_id || ''}
                            onChange={(e) => {
                              const dept = departments.find((d) => d.id === e.target.value);
                              setEditingGallery({
                                ...editingGallery,
                                department_id: e.target.value,
                                department_name_ar: dept?.name_ar || '',
                              });
                            }}
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          >
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name_ar}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">رابط الصورة (URL)</label>
                          <input
                            type="url"
                            value={editingGallery.image || ''}
                            onChange={(e) =>
                              setEditingGallery({ ...editingGallery, image: e.target.value })
                            }
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">
                            النص البديل Alt Text (مهم جداً لمحركات البحث SEO)
                          </label>
                          <input
                            type="text"
                            value={editingGallery.alt || ''}
                            onChange={(e) =>
                              setEditingGallery({ ...editingGallery, alt: e.target.value })
                            }
                            placeholder="وصف دقيق للمحتوى..."
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D8D0C4] mb-1">الوصف التفصيلي</label>
                          <textarea
                            value={editingGallery.description || ''}
                            onChange={(e) =>
                              setEditingGallery({
                                ...editingGallery,
                                description: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingGallery(null)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#D8D0C4] rounded text-xs"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!editingGallery.title || !editingGallery.image) return;
                              if (editingGallery.id) {
                                updateGalleryItem(editingGallery.id, editingGallery);
                              } else {
                                addGalleryItem(
                                  editingGallery as Omit<GalleryItem, 'id' | 'created_at'>
                                );
                              }
                              setEditingGallery(null);
                            }}
                            className="px-5 py-2 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold rounded text-xs"
                          >
                            حفظ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. CUSTOMERS DIRECTORY */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif-luxury font-semibold mb-1">سجل العملاء</h2>
                  <p className="text-xs text-[#D8D0C4]/70">
                    قائمة العميلات المسجلات عبر الحجوزات مع تتبع عدد الزيارات والملاحظات
                  </p>
                </div>

                <div className="bg-[#141210] border border-[#B99A5B]/20 rounded-sm overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#100E0C] text-[#B99A5B] border-b border-white/10">
                      <tr>
                        <th className="p-3">اسم العميلة</th>
                        <th className="p-3">رقم الهاتف</th>
                        <th className="p-3">عدد الحجوزات</th>
                        <th className="p-3">آخر زيارة</th>
                        <th className="p-3">ملاحظات خاصة</th>
                        <th className="p-3 text-center">تواصل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-semibold text-[#F5F1EA]">{c.name}</td>
                          <td className="p-3 font-mono" dir="ltr">
                            {c.phone}
                          </td>
                          <td className="p-3">{c.appointments_count}</td>
                          <td className="p-3 text-[#D8D0C4]/70">{c.last_visit || '-'}</td>
                          <td className="p-3 max-w-[240px]">
                            <input
                              type="text"
                              defaultValue={c.notes || ''}
                              onBlur={(e) => updateCustomerNotes(c.id, e.target.value)}
                              placeholder="أضيفي ملاحظة..."
                              className="w-full bg-[#0B0A09] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#B99A5B]"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <a
                              href={`https://wa.me/${c.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 inline-flex bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 rounded transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. BUSINESS HOURS EDITOR */}
            {activeTab === 'hours' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="text-2xl font-serif-luxury font-semibold mb-1">
                    تعديل أوقات العمل
                  </h2>
                  <p className="text-xs text-[#D8D0C4]/70">
                    تحديد ساعات الفتح والإغلاق لكل يوم من أيام الأسبوع وتحديد أيام العطل
                  </p>
                </div>

                <div className="bg-[#141210] border border-[#B99A5B]/25 rounded-sm p-6 space-y-4">
                  {businessHours.map((day) => (
                    <div
                      key={day.day_id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/5 rounded border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`open-${day.day_id}`}
                          checked={day.is_open}
                          onChange={(e) =>
                            updateBusinessDay(day.day_id, { is_open: e.target.checked })
                          }
                          className="accent-[#B99A5B]"
                        />
                        <label
                          htmlFor={`open-${day.day_id}`}
                          className="font-semibold text-sm text-[#F5F1EA] w-24 cursor-pointer"
                        >
                          {day.day_name_ar}
                        </label>
                        <span className="text-[11px] text-[#D8D0C4]/50 hidden sm:inline">
                          ({day.day_name_en})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#D8D0C4]/70">وقت الفتح:</span>
                          <input
                            type="time"
                            value={day.open_time}
                            disabled={!day.is_open}
                            onChange={(e) =>
                              updateBusinessDay(day.day_id, { open_time: e.target.value })
                            }
                            className="bg-[#0B0A09] border border-white/15 rounded px-2 py-1 text-xs focus:outline-none disabled:opacity-30"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[#D8D0C4]/70">وقت الإغلاق:</span>
                          <input
                            type="time"
                            value={day.close_time}
                            disabled={!day.is_open}
                            onChange={(e) =>
                              updateBusinessDay(day.day_id, { close_time: e.target.value })
                            }
                            className="bg-[#0B0A09] border border-white/15 rounded px-2 py-1 text-xs focus:outline-none disabled:opacity-30"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. SETTINGS & CONTACTS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="text-2xl font-serif-luxury font-semibold mb-1">
                    روابط التواصل والإعدادات العامة
                  </h2>
                  <p className="text-xs text-[#D8D0C4]/70">
                    تعديل أرقام الهواتف، الواتساب، روابط انستغرام، والعنوان الرسمي
                  </p>
                </div>

                <div className="bg-[#141210] border border-[#B99A5B]/25 rounded-sm p-6 space-y-4 text-xs">
                  <div>
                    <label className="block text-[#D8D0C4] mb-1 font-medium">اسم العلامة</label>
                    <input
                      type="text"
                      value={tempSettings.brand_name}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, brand_name: e.target.value })
                      }
                      className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B99A5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D8D0C4] mb-1 font-medium">العبارة العربية</label>
                    <input
                      type="text"
                      value={tempSettings.brand_arabic_tagline}
                      onChange={(e) =>
                        setTempSettings({
                          ...tempSettings,
                          brand_arabic_tagline: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B99A5B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#D8D0C4] mb-1 font-medium">رقم الهاتف</label>
                      <input
                        type="text"
                        value={tempSettings.phone}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, phone: e.target.value })
                        }
                        className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-[#D8D0C4] mb-1 font-medium">رقم الواتساب</label>
                      <input
                        type="text"
                        value={tempSettings.whatsapp_number}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            whatsapp_number: e.target.value,
                          })
                        }
                        className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#D8D0C4] mb-1 font-medium">
                        Instagram الرئيسي (رابط)
                      </label>
                      <input
                        type="url"
                        value={tempSettings.instagram_main}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            instagram_main: e.target.value,
                          })
                        }
                        className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#D8D0C4] mb-1 font-medium">
                        Instagram قسم التجميل (رابط)
                      </label>
                      <input
                        type="url"
                        value={tempSettings.instagram_beauty}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            instagram_beauty: e.target.value,
                          })
                        }
                        className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#D8D0C4] mb-1 font-medium">العنوان</label>
                    <input
                      type="text"
                      value={tempSettings.address_ar}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, address_ar: e.target.value })
                      }
                      className="w-full bg-[#0B0A09] border border-white/15 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => updateSettings(tempSettings)}
                      className="px-6 py-2.5 bg-[#B99A5B] hover:bg-[#D4BD86] text-[#0B0A09] font-bold rounded text-xs flex items-center gap-1.5 shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديلات</span>
                    </button>

                    <button
                      type="button"
                      onClick={resetToDefaults}
                      className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded text-xs flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة البيانات الافتراضية الأصلية</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};
