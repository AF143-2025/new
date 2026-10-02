import { Appointment, SiteSettings } from '../types';

export const generateBookingVoucherHtml = (
  appointment: Appointment,
  settings: SiteSettings
): string => {
  const statusLabel =
    appointment.status === 'confirmed'
      ? 'موافق عليه ومؤكد ✓'
      : appointment.status === 'pending'
      ? 'قيد الانتظار والمراجعة'
      : appointment.status === 'cancelled'
      ? 'ملغى'
      : 'مكتمل';

  const statusColor =
    appointment.status === 'confirmed'
      ? '#059669'
      : appointment.status === 'pending'
      ? '#d97706'
      : appointment.status === 'cancelled'
      ? '#dc2626'
      : '#7c3aed';

  const formattedCreatedDate = new Date(appointment.created_at).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تذكرة حجز - ${appointment.booking_number} - STYLE CITY BAGHDAD</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 12mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 24px;
      font-family: 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #ffffff;
      color: #1a1816;
      line-height: 1.5;
      direction: rtl;
    }

    .voucher-card {
      border: 2px solid #b99a5b;
      border-radius: 8px;
      padding: 32px;
      background: #faf8f5;
      position: relative;
      max-width: 720px;
      margin: 0 auto;
      box-shadow: 0 4px 20px rgba(185, 154, 91, 0.12);
    }

    .voucher-header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1.5px solid #d4c4a8;
      margin-bottom: 24px;
    }

    .crest {
      display: inline-block;
      width: 56px;
      height: 56px;
      border: 2px solid #b99a5b;
      border-radius: 50%;
      line-height: 52px;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 24px;
      font-weight: bold;
      color: #8c713b;
      background: #ffffff;
      margin-bottom: 8px;
    }

    .brand-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #0b0a09;
      margin: 4px 0 2px 0;
      text-transform: uppercase;
    }

    .brand-subtitle {
      font-size: 11px;
      letter-spacing: 0.25em;
      color: #8c713b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .voucher-badge {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 16px;
      background: #b99a5b;
      color: #0b0a09;
      font-size: 12px;
      font-weight: 700;
      border-radius: 20px;
    }

    .id-banner {
      background: #151310;
      color: #f5f1ea;
      padding: 16px 20px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border: 1px solid #b99a5b;
    }

    .id-banner .id-label {
      font-size: 13px;
      color: #d8d0c4;
    }

    .id-banner .id-val {
      font-family: monospace, sans-serif;
      font-size: 24px;
      font-weight: bold;
      color: #d4bd86;
      letter-spacing: 0.1em;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      color: #ffffff;
      background-color: ${statusColor};
    }

    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #e5dcce;
    }

    .details-table tr:not(:last-child) {
      border-bottom: 1px solid #ede7dc;
    }

    .details-table td {
      padding: 12px 16px;
      font-size: 13px;
    }

    .details-table td.label {
      width: 32%;
      color: #736b5e;
      font-weight: 500;
      background: #fbf9f6;
      border-left: 1px solid #ede7dc;
    }

    .details-table td.value {
      font-weight: 600;
      color: #1a1816;
    }

    .instructions-box {
      background: #f4efe6;
      border-right: 4px solid #b99a5b;
      padding: 14px 16px;
      border-radius: 4px;
      font-size: 11.5px;
      color: #595143;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .instructions-box strong {
      color: #0b0a09;
    }

    .voucher-footer {
      border-top: 1.5px solid #d4c4a8;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      color: #736b5e;
    }

    .footer-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stamp {
      display: inline-block;
      border: 1.5px dashed #b99a5b;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      color: #8c713b;
      text-transform: uppercase;
    }

    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .voucher-card {
        box-shadow: none;
        border-color: #b99a5b;
      }
    }
  </style>
</head>
<body>
  <div class="voucher-card">
    <div class="voucher-header">
      <div class="crest">SC</div>
      <div class="brand-title">STYLE CITY BAGHDAD</div>
      <div class="brand-subtitle">THE CITY OF BEAUTY · المنصور</div>
      <div class="voucher-badge">بطاقة حجز موعد رسمي | BOOKING VOUCHER</div>
    </div>

    <div class="id-banner">
      <div>
        <div class="id-label">آيدي الطلب / رقم الحجز الفريد:</div>
        <div class="id-val">${appointment.booking_number}</div>
      </div>
      <div>
        <span class="status-badge">${statusLabel}</span>
      </div>
    </div>

    <table class="details-table">
      <tr>
        <td class="label">اسم العميلة الكريم:</td>
        <td class="value">${appointment.customer_name}</td>
      </tr>
      <tr>
        <td class="label">رقم الهاتف المسجل:</td>
        <td class="value" dir="ltr" style="text-align: right;">${appointment.customer_phone}</td>
      </tr>
      <tr>
        <td class="label">القسم:</td>
        <td class="value">${appointment.department_name}</td>
      </tr>
      <tr>
        <td class="label">الخدمة المطلوبة:</td>
        <td class="value">${appointment.service_name}</td>
      </tr>
      ${
        appointment.staff_name
          ? `<tr>
              <td class="label">الأخصائية المختارة:</td>
              <td class="value">${appointment.staff_name}</td>
            </tr>`
          : ''
      }
      <tr>
        <td class="label">تاريخ الموعد:</td>
        <td class="value">${appointment.date}</td>
      </tr>
      <tr>
        <td class="label">توقيت الموعد:</td>
        <td class="value">الساعة ${appointment.time}</td>
      </tr>
      ${
        appointment.notes
          ? `<tr>
              <td class="label">ملاحظات العميلة:</td>
              <td class="value">${appointment.notes}</td>
            </tr>`
          : ''
      }
      <tr>
        <td class="label">تاريخ إنشاء الطلب:</td>
        <td class="value">${formattedCreatedDate}</td>
      </tr>
    </table>

    <div class="instructions-box">
      <strong>ملاحظات هامة للزيارة:</strong>
      <br>• يرجى الحضور قبل الموعد بـ 10 دقائق لضمان تقديم الخدمة بأعلى معايير الراحة والعناية.
      <br>• يمكنك في أي وقت استخدام <strong>آيدي الطلب (${appointment.booking_number})</strong> لمتابعة حالة الحجز عبر الموقع أو الاتصال بنا.
      <br>• في حال الرغبة بتأجيل أو تعديل الموعد، يرجى إبلاغنا قبل 3 ساعات على الأقل.
    </div>

    <div class="voucher-footer">
      <div>
        <div><strong>العنوان:</strong> المنصور – شارع الأميرات – بغداد – العراق</div>
        <div><strong>الهاتف:</strong> ${settings.phone} · <strong>واتساب:</strong> ${settings.whatsapp_number}</div>
      </div>
      <div style="text-align: left;">
        <div class="stamp">OFFICIAL VOUCHER</div>
        <div style="font-size: 10px; margin-top: 4px; color: #8c713b;">Style City Baghdad</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>
`;
};

/**
 * Triggers PDF printing without window.open (using an invisible iframe to comply with iframe/sandboxing rules)
 */
export const printBookingPdf = (appointment: Appointment, settings: SiteSettings): void => {
  const html = generateBookingVoucherHtml(appointment, settings);

  // Create temporary hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.title = `Booking Voucher ${appointment.booking_number}`;

  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Error invoking print:', e);
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 3000);
        }
      };
    }
  } catch (err) {
    console.error('Error writing voucher to print iframe:', err);
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
};
