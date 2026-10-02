import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  initialSettings,
  initialDepartments,
  initialServices,
  initialStaff,
  initialGallery,
  initialAppointments,
  initialCustomers,
  initialBusinessHours,
} from './src/data/initialData';
import { Appointment } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Persistent database path
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'server_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interface for server database
interface ServerDatabase {
  appointments: Appointment[];
  settings: typeof initialSettings;
  departments: typeof initialDepartments;
  services: typeof initialServices;
  staff: typeof initialStaff;
  gallery: typeof initialGallery;
  customers: typeof initialCustomers;
  businessHours: typeof initialBusinessHours;
}

// Load or initialize database
function getDatabase(): ServerDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading server_db.json, re-initializing:', err);
  }

  const initialDb: ServerDatabase = {
    appointments: initialAppointments,
    settings: initialSettings,
    departments: initialDepartments,
    services: initialServices,
    staff: initialStaff,
    gallery: initialGallery,
    customers: initialCustomers,
    businessHours: initialBusinessHours,
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: ServerDatabase): void {
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize DB
  getDatabase();

  // -------------------------------------------------------------
  // API ROUTES (SHARED ACROSS ALL DEVICES WORLDWIDE)
  // -------------------------------------------------------------

  // 1. Get all appointments (Admin & Sync)
  app.get('/api/appointments', (req: Request, res: Response) => {
    const db = getDatabase();
    res.json({ success: true, appointments: db.appointments });
  });

  // 2. Search appointment by Order ID or Phone (Cross-device instant lookup)
  app.get('/api/appointments/search', (req: Request, res: Response) => {
    const query = ((req.query.q as string) || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }

    const db = getDatabase();
    const upperQuery = query.toUpperCase();
    const cleanDigits = query.replace(/\D/g, '');

    const found = db.appointments.find((a) => {
      const aptUpper = a.booking_number.toUpperCase();
      // Match exact Order ID (e.g. "SC-8421" or "8421" or "SC8421")
      if (aptUpper === upperQuery || aptUpper.includes(upperQuery)) return true;
      if (cleanDigits.length >= 3 && aptUpper.replace(/\D/g, '').includes(cleanDigits)) return true;

      // Match internal id
      if (a.id.toLowerCase() === query.toLowerCase()) return true;

      // Match phone digits
      if (cleanDigits.length >= 7) {
        const aptPhoneDigits = a.customer_phone.replace(/\D/g, '');
        if (aptPhoneDigits.includes(cleanDigits) || cleanDigits.includes(aptPhoneDigits)) return true;
      }

      return false;
    });

    if (found) {
      return res.json({ success: true, appointment: found });
    } else {
      return res.status(404).json({
        success: false,
        message: `عذراً، لم يتم العثور على أي طلب مسجل بالآيدي "${query}"`,
      });
    }
  });

  // 3. Create a new appointment (Saved to shared server DB)
  app.post('/api/appointments', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.customer_name || !body.customer_phone) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields' });
    }

    const db = getDatabase();

    // Generate unique booking number
    let bookingNumber = '';
    let isUnique = false;
    while (!isUnique) {
      const code = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
      if (!db.appointments.some((a) => a.booking_number === code)) {
        bookingNumber = code;
        isUnique = true;
      }
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      booking_number: bookingNumber,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      department_id: body.department_id || '',
      department_name: body.department_name || '',
      service_id: body.service_id || '',
      service_name: body.service_name || '',
      staff_id: body.staff_id,
      staff_name: body.staff_name,
      date: body.date || '',
      time: body.time || '',
      notes: body.notes || '',
      internal_notes: '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    db.appointments.unshift(newAppointment);

    // Update or add customer count
    const existingCust = db.customers.find((c) => c.phone.replace(/\D/g, '') === newAppointment.customer_phone.replace(/\D/g, ''));
    if (existingCust) {
      existingCust.appointments_count += 1;
      existingCust.last_visit = newAppointment.date;
    } else {
      db.customers.push({
        id: `cust-${Date.now()}`,
        name: newAppointment.customer_name,
        phone: newAppointment.customer_phone,
        appointments_count: 1,
        last_visit: newAppointment.date,
        created_at: new Date().toISOString(),
      });
    }

    saveDatabase(db);

    console.log(`[Shared DB] New booking created: ${newAppointment.booking_number} by ${newAppointment.customer_name}`);
    return res.status(201).json({ success: true, appointment: newAppointment });
  });

  // 4. Update appointment status (Admin or customer cancellation)
  app.patch('/api/appointments/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, internal_notes } = req.body;

    const db = getDatabase();
    const aptIndex = db.appointments.findIndex((a) => a.id === id || a.booking_number.toUpperCase() === id.toUpperCase());

    if (aptIndex === -1) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status) {
      db.appointments[aptIndex].status = status;
    }
    if (internal_notes !== undefined) {
      db.appointments[aptIndex].internal_notes = internal_notes;
    }

    saveDatabase(db);
    return res.json({ success: true, appointment: db.appointments[aptIndex] });
  });

  // 5. Delete an appointment
  app.delete('/api/appointments/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const db = getDatabase();

    const beforeLength = db.appointments.length;
    db.appointments = db.appointments.filter((a) => a.id !== id && a.booking_number.toUpperCase() !== id.toUpperCase());

    if (db.appointments.length === beforeLength) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    saveDatabase(db);
    return res.json({ success: true, message: 'Appointment deleted successfully' });
  });

  // 6. Get entire shared site state
  app.get('/api/site-data', (req: Request, res: Response) => {
    const db = getDatabase();
    res.json({
      success: true,
      data: {
        appointments: db.appointments,
        settings: db.settings,
        departments: db.departments,
        services: db.services,
        staff: db.staff,
        gallery: db.gallery,
        customers: db.customers,
        businessHours: db.businessHours,
      },
    });
  });

  // 7. Update site data from admin
  app.post('/api/site-data', (req: Request, res: Response) => {
    const db = getDatabase();
    const { settings, departments, services, staff, gallery, businessHours } = req.body;

    if (settings) db.settings = settings;
    if (departments) db.departments = departments;
    if (services) db.services = services;
    if (staff) db.staff = staff;
    if (gallery) db.gallery = gallery;
    if (businessHours) db.businessHours = businessHours;

    saveDatabase(db);
    res.json({ success: true, message: 'Site data updated on server' });
  });

  // -------------------------------------------------------------
  // VITE / STATIC SERVING
  // -------------------------------------------------------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[STYLE CITY BAGHDAD] Server is running on http://0.0.0.0:${PORT} (Production: ${isProduction})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
