export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type ActiveView = 'home' | 'departments' | 'services' | 'gallery' | 'booking' | 'contact' | 'about';

export interface Department {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en?: string;
  image: string;
  instagram_url?: string;
  is_active: boolean;
  sort_order: number;
  highlight?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  department_id: string;
  name_ar: string;
  name_en?: string;
  slug: string;
  description_ar: string;
  description_en?: string;
  duration?: string;
  price?: number | string;
  show_price: boolean;
  image?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  name: string;
  title: string;
  department_id: string;
  photo?: string;
  bio?: string;
  instagram?: string;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  department_id: string;
  department_name_ar: string;
  image: string;
  alt: string;
  description?: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  department_id: string;
  department_name: string;
  service_id: string;
  service_name: string;
  staff_id?: string;
  staff_name?: string;
  date: string;
  time: string;
  notes?: string;
  internal_notes?: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  appointments_count: number;
  last_visit?: string;
  created_at: string;
}

export interface BusinessDay {
  day_id: 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  day_name_ar: string;
  day_name_en: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export interface SiteSettings {
  brand_name: string;
  brand_slogan: string;
  brand_arabic_tagline: string;
  address_ar: string;
  phone: string;
  whatsapp_number: string;
  instagram_main: string;
  instagram_main_handle: string;
  instagram_beauty: string;
  instagram_beauty_handle: string;
  facebook_url: string;
  google_maps_url: string;
  booking_notice: string;
}
