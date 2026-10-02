/**
 * STYLE CITY BAGHDAD - The City of Beauty ✨
 * المنصور – شارع الأميرات – بغداد – العراق
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileStickyBar } from './components/layout/MobileStickyBar';
import { Hero } from './components/home/Hero';
import { IntroSection } from './components/home/IntroSection';
import { DepartmentsSection } from './components/home/DepartmentsSection';
import { ServicesSection } from './components/home/ServicesSection';
import { EditorialExperience } from './components/home/EditorialExperience';
import { GallerySection } from './components/home/GallerySection';
import { InstagramSection } from './components/home/InstagramSection';
import { BookingSection } from './components/home/BookingSection';
import { LocationContactSection } from './components/home/LocationContactSection';
import { BusinessHoursSection } from './components/home/BusinessHoursSection';
import { Footer } from './components/layout/Footer';
import { Lightbox } from './components/common/Lightbox';
import { Toast } from './components/common/Toast';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainLayout: React.FC = () => {
  const { activeLightboxItem, closeLightbox, activeView } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0A09] text-[#F5F1EA] selection:bg-[#B99A5B]/30 selection:text-white relative flex flex-col justify-between">
      {/* Toast Notification */}
      <Toast />

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* VIEW 1: HOME (الواجهة الرئيسية للمنصة فقط) */}
        {activeView === 'home' && <Hero />}

        {/* VIEW 2-N: DEDICATED SECTIONS (تظهر فقط عند الضغط عليها) */}
        {activeView !== 'home' && (
          <div className="pt-[68px]">
            {/* Content for the Selected Section */}
            <div>
              {activeView === 'departments' && <DepartmentsSection />}

              {activeView === 'services' && <ServicesSection />}

              {activeView === 'gallery' && (
                <>
                  <GallerySection />
                  <InstagramSection />
                </>
              )}

              {activeView === 'booking' && <BookingSection />}

              {activeView === 'contact' && (
                <>
                  <LocationContactSection />
                  <BusinessHoursSection />
                </>
              )}

              {activeView === 'about' && (
                <>
                  <IntroSection />
                  <EditorialExperience />
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Action Bar */}
      <MobileStickyBar />

      {/* Lightbox for Gallery */}
      {activeLightboxItem && (
        <Lightbox item={activeLightboxItem} onClose={closeLightbox} />
      )}

      {/* Admin Dashboard */}
      <AdminDashboard />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
