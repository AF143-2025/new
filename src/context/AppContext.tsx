import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Department,
  Service,
  Staff,
  GalleryItem,
  Appointment,
  Customer,
  BusinessDay,
  SiteSettings,
  AppointmentStatus,
  ActiveView,
} from '../types';
import {
  initialDepartments,
  initialServices,
  initialStaff,
  initialGallery,
  initialAppointments,
  initialCustomers,
  initialBusinessHours,
  initialSettings,
} from '../data/initialData';

interface AppContextType {
  // Active View (Single-page app routing / portal view)
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  navigateTo: (view: ActiveView, departmentId?: string, serviceId?: string) => void;

  // Settings & Business Hours
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  businessHours: BusinessDay[];
  updateBusinessDay: (dayId: string, updates: Partial<BusinessDay>) => void;

  // Departments
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Staff
  staffList: Staff[];
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at'>) => void;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  createAppointment: (
    data: Omit<Appointment, 'id' | 'booking_number' | 'created_at' | 'status'>
  ) => { appointment: Appointment; whatsappUrl: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointmentNotes: (id: string, internalNotes: string) => void;
  deleteAppointment: (id: string) => void;

  // Customer "حجوزاتي" (My Bookings)
  isMyBookingsOpen: boolean;
  setIsMyBookingsOpen: (open: boolean) => void;
  myBookings: Appointment[];
  cancelMyBooking: (id: string) => void;
  lookupBookingsByPhone: (phone: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;

  // Customers
  customers: Customer[];
  updateCustomerNotes: (id: string, notes: string) => void;

  // Navigation & Interactive UI state
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;

  // Booking Flow shortcuts
  selectedDepartmentForBooking: string | null;
  selectedServiceForBooking: string | null;
  startBookingFor: (departmentId?: string, serviceId?: string) => void;

  // Lightbox
  activeLightboxItem: GalleryItem | null;
  openLightbox: (item: GalleryItem) => void;
  closeLightbox: () => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Reset to initial
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helpers
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`stylecity_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const stored = loadStored<SiteSettings>('settings', initialSettings);
    if (stored.brand_arabic_tagline && stored.brand_arabic_tagline.includes('جمالج')) {
      stored.brand_arabic_tagline = initialSettings.brand_arabic_tagline;
    }
    if (stored.booking_notice && stored.booking_notice.includes('جمالج')) {
      stored.booking_notice = initialSettings.booking_notice;
    }
    return stored;
  });
  const [businessHours, setBusinessHours] = useState<BusinessDay[]>(() =>
    loadStored('business_hours', initialBusinessHours)
  );
  const [departments, setDepartments] = useState<Department[]>(() =>
    loadStored('departments', initialDepartments)
  );
  const [services, setServices] = useState<Service[]>(() =>
    loadStored('services', initialServices)
  );
  const [staffList, setStaffList] = useState<Staff[]>(() =>
    loadStored('staff', initialStaff)
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    loadStored('gallery', initialGallery)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadStored('appointments', initialAppointments)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadStored('customers', initialCustomers)
  );

  // Navigation / View State
  const [activeView, setActiveView] = useState<ActiveView>('home');

  const navigateTo = (view: ActiveView, departmentId?: string, serviceId?: string) => {
    setActiveView(view);
    if (departmentId) setSelectedDepartmentForBooking(departmentId);
    if (serviceId) setSelectedServiceForBooking(serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin authentication state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('stylecity_admin_auth') === 'true';
  });

  // Customer "حجوزاتي" (My Bookings) State
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [myBookingIds, setMyBookingIds] = useState<string[]>(() =>
    loadStored('my_booking_ids', [])
  );
  const [customerPhone, setCustomerPhoneState] = useState<string>(() => {
    return localStorage.getItem('stylecity_customer_phone') || '';
  });

  const setCustomerPhone = (phone: string) => {
    setCustomerPhoneState(phone);
    localStorage.setItem('stylecity_customer_phone', phone);
  };

  const myBookings = useMemo(() => {
    const cleanPhone = customerPhone.replace(/\D/g, '');
    return appointments.filter((apt) => {
      if (myBookingIds.includes(apt.id)) return true;
      if (cleanPhone && cleanPhone.length >= 7) {
        const aptPhoneDigits = apt.customer_phone.replace(/\D/g, '');
        if (aptPhoneDigits.includes(cleanPhone) || cleanPhone.includes(aptPhoneDigits)) {
          return true;
        }
      }
      return false;
    });
  }, [appointments, myBookingIds, customerPhone]);

  const lookupBookingsByPhone = (phone: string) => {
    const clean = phone.trim();
    setCustomerPhone(clean);
    const cleanDigits = clean.replace(/\D/g, '');
    const found = appointments.filter((a) => {
      const aptDigits = a.customer_phone.replace(/\D/g, '');
      return cleanDigits.length >= 7 && (aptDigits.includes(cleanDigits) || cleanDigits.includes(aptDigits));
    });
    if (found.length > 0) {
      setMyBookingIds((prev) => {
        const merged = Array.from(new Set([...prev, ...found.map((a) => a.id)]));
        localStorage.setItem('stylecity_my_booking_ids', JSON.stringify(merged));
        return merged;
      });
      showToast(`تم العثور على ${found.length} حجز`);
    } else {
      showToast('لم يتم العثور على حجوزات مسجلة بهذا الرقم');
    }
  };

  const cancelMyBooking = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
    showToast('تم إلغاء طلب الحجز');
  };

  // Booking target trigger
  const [selectedDepartmentForBooking, setSelectedDepartmentForBooking] = useState<string | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | null>(null);

  // Lightbox
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('stylecity_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('stylecity_business_hours', JSON.stringify(businessHours));
  }, [businessHours]);

  useEffect(() => {
    localStorage.setItem('stylecity_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('stylecity_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('stylecity_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('stylecity_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('stylecity_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('stylecity_customers', JSON.stringify(customers));
  }, [customers]);

  // Settings update
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('تم حفظ الإعدادات بنجاح');
  };

  const updateBusinessDay = (dayId: string, updates: Partial<BusinessDay>) => {
    setBusinessHours((prev) =>
      prev.map((day) => (day.day_id === dayId ? { ...day, ...updates } : day))
    );
    showToast('تم تحديث أوقات العمل');
  };

  // Departments CRUD
  const addDepartment = (dept: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDepartments((prev) => [...prev, newDept]);
    showToast('تمت إضافة القسم بنجاح');
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d))
    );
    showToast('تم تحديث بيانات القسم');
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    showToast('تم حذف القسم');
  };

  // Services CRUD
  const addService = (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    const newService: Service = {
      ...service,
      id: `srv-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setServices((prev) => [...prev, newService]);
    showToast('تمت إضافة الخدمة بنجاح');
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s))
    );
    showToast('تم تحديث الخدمة');
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('تم حذف الخدمة');
  };

  // Staff CRUD
  const addStaff = (staff: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staff,
      id: `staff-${Date.now()}`,
    };
    setStaffList((prev) => [...prev, newStaff]);
    showToast('تمت إضافة الموظفة بنجاح');
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaffList((prev) => prev.map((st) => (st.id === id ? { ...st, ...updates } : st)));
    showToast('تم تحديث بيانات الموظفة');
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((st) => st.id !== id));
    showToast('تم حذف الموظفة');
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setGallery((prev) => [newItem, ...prev]);
    showToast('تمت إضافة الصورة للمعرض');
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('تم تحديث عنصر المعرض');
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    showToast('تم حذف الصورة من المعرض');
  };

  // Appointment creation
  const createAppointment = (
    data: Omit<Appointment, 'id' | 'booking_number' | 'created_at' | 'status'>
  ) => {
    const bookingCode = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      booking_number: bookingCode,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Automatically record in customer's myBookings list
    setMyBookingIds((prev) => {
      const updated = Array.from(new Set([newAppointment.id, ...prev]));
      localStorage.setItem('stylecity_my_booking_ids', JSON.stringify(updated));
      return updated;
    });
    setCustomerPhone(data.customer_phone);

    // Update customer records
    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone.replace(/\s+/g, '') === data.customer_phone.replace(/\s+/g, ''));
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                name: data.customer_name,
                appointments_count: c.appointments_count + 1,
                last_visit: data.date,
              }
            : c
        );
      } else {
        return [
          {
            id: `cust-${Date.now()}`,
            name: data.customer_name,
            phone: data.customer_phone,
            appointments_count: 1,
            last_visit: data.date,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });

    // Generate formatted WhatsApp message
    const cleanWhatsAppPhone = settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      `مرحباً Style City ✨\nأريد طلب حجز موعد:\n• رقم الطلب: ${bookingCode}\n• الاسم: ${data.customer_name}\n• القسم: ${data.department_name}\n• الخدمة: ${data.service_name}${
        data.staff_name ? `\n• الموظفة: ${data.staff_name}` : ''
      }\n• التاريخ: ${data.date}\n• الوقت: ${data.time}${
        data.notes ? `\n• ملاحظات: ${data.notes}` : ''
      }\n\nيرجى تأكيد إمكانية الحجز. شكراً لكم.`
    );
    const whatsappUrl = `https://wa.me/${cleanWhatsAppPhone}?text=${message}`;

    showToast('تم استلام طلب الحجز بنجاح ✨');
    return { appointment: newAppointment, whatsappUrl };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    showToast(`تم تعديل حالة الحجز`);
  };

  const updateAppointmentNotes = (id: string, internalNotes: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, internal_notes: internalNotes } : a))
    );
    showToast('تم حفظ ملاحظات الحجز');
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('تم حذف الحجز');
  };

  const updateCustomerNotes = (id: string, notes: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
    showToast('تم حفظ ملاحظة العميل');
  };

  // Auth
  const loginAdmin = (passcode: string) => {
    // Default pass: stylecity2026 or admin
    if (passcode.trim() === 'stylecity2026' || passcode.trim() === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('stylecity_admin_auth', 'true');
      showToast('مرحباً بك في لوحة تحكم Style City');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('stylecity_admin_auth');
    showToast('تم تسجيل الخروج من لوحة التحكم');
  };

  const startBookingFor = (departmentId?: string, serviceId?: string) => {
    if (departmentId) setSelectedDepartmentForBooking(departmentId);
    if (serviceId) setSelectedServiceForBooking(serviceId);
    setActiveView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLightbox = (item: GalleryItem) => setActiveLightboxItem(item);
  const closeLightbox = () => setActiveLightboxItem(null);

  const resetToDefaults = () => {
    if (window.confirm('هل أنتِ متأكدة من رغبتكِ في استعادة البيانات الافتراضية الأصلية؟')) {
      localStorage.clear();
      setSettings(initialSettings);
      setBusinessHours(initialBusinessHours);
      setDepartments(initialDepartments);
      setServices(initialServices);
      setStaffList(initialStaff);
      setGallery(initialGallery);
      setAppointments(initialAppointments);
      setCustomers(initialCustomers);
      showToast('تمت استعادة البيانات الأصلية بنجاح');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        navigateTo,
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
        createAppointment,
        updateAppointmentStatus,
        updateAppointmentNotes,
        deleteAppointment,
        isMyBookingsOpen,
        setIsMyBookingsOpen,
        myBookings,
        cancelMyBooking,
        lookupBookingsByPhone,
        customerPhone,
        setCustomerPhone,
        customers,
        updateCustomerNotes,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        selectedDepartmentForBooking,
        selectedServiceForBooking,
        startBookingFor,
        activeLightboxItem,
        openLightbox,
        closeLightbox,
        toastMessage,
        showToast,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
