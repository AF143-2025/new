import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Appointment } from '../types';

export function normalizeText(input: string): string {
  if (!input) return '';
  const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = input;
  arDigits.forEach((d, i) => {
    res = res.replaceAll(d, String(i));
  });
  return res.trim().toLowerCase();
}

export function matchesAppointment(apt: Appointment, rawQuery: string): boolean {
  if (!rawQuery) return false;
  const q = normalizeText(rawQuery);
  const qAlnum = q.replace(/[^a-z0-9\u0600-\u06FF]/gi, '');
  const qDigits = q.replace(/\D/g, '');

  // 1. Booking number matches (e.g. "SC-8421", "8421", "sc 8421")
  const aptNum = normalizeText(apt.booking_number);
  const aptNumAlnum = aptNum.replace(/[^a-z0-9]/gi, '');
  const aptDigits = aptNum.replace(/\D/g, '');

  if (aptNum === q) return true;
  if (aptNum.includes(q) || q.includes(aptNum)) return true;
  if (qAlnum && (aptNumAlnum.includes(qAlnum) || qAlnum.includes(aptNumAlnum))) return true;
  if (qDigits && aptDigits.includes(qDigits)) return true;

  // 2. Internal ID match
  if (apt.id.toLowerCase() === q || apt.id.toLowerCase().includes(q)) return true;

  // 3. Customer Name match
  const custName = normalizeText(apt.customer_name);
  if (custName.includes(q) || q.includes(custName)) return true;
  const nameParts = custName.split(/\s+/);
  if (nameParts.some((p) => p.length >= 2 && (q.includes(p) || p.includes(q)))) return true;

  // 4. Customer Phone match
  const phoneDigits = apt.customer_phone.replace(/\D/g, '');
  if (qDigits.length >= 3) {
    if (phoneDigits.includes(qDigits) || qDigits.includes(phoneDigits)) return true;
  }

  return false;
}

const APPOINTMENTS_COLLECTION = 'appointments';

/**
 * Save or update appointment in Cloud Firestore
 */
export async function saveAppointmentToCloud(appointment: Appointment): Promise<void> {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, appointment.id);
    await setDoc(docRef, appointment, { merge: true });
  } catch (error) {
    console.error('Error saving appointment to Cloud Firestore:', error);
    throw error;
  }
}

/**
 * Delete appointment from Cloud Firestore
 */
export async function deleteAppointmentFromCloud(appointmentId: string): Promise<void> {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting appointment from Cloud Firestore:', error);
    throw error;
  }
}

/**
 * Search appointment across all devices in Cloud Firestore
 */
export async function searchAppointmentInCloud(rawQuery: string): Promise<Appointment | null> {
  try {
    const queryNormalized = normalizeText(rawQuery);
    const upper = rawQuery.trim().toUpperCase();

    // 1. Try direct exact booking_number query first
    const qCol = collection(db, APPOINTMENTS_COLLECTION);
    const qExact = query(qCol, where('booking_number', '==', upper));
    const exactSnap = await getDocs(qExact);
    if (!exactSnap.empty) {
      return exactSnap.docs[0].data() as Appointment;
    }

    // 2. Query all appointments and run resilient matching (handles 8421, Arabic digits ٨٤٢١, name, phone)
    const allSnap = await getDocs(qCol);
    for (const d of allSnap.docs) {
      const apt = d.data() as Appointment;
      if (matchesAppointment(apt, queryNormalized)) {
        return apt;
      }
    }

    return null;
  } catch (error) {
    console.error('Error searching appointments in Cloud Firestore:', error);
    return null;
  }
}

/**
 * Real-time listener for appointments in Cloud Firestore
 */
export function listenToCloudAppointments(
  onUpdate: (appointments: Appointment[]) => void
): () => void {
  try {
    const qCol = collection(db, APPOINTMENTS_COLLECTION);
    return onSnapshot(
      qCol,
      (snapshot) => {
        const items: Appointment[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Appointment);
        });
        // Sort descending by date/time
        items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        onUpdate(items);
      },
      (error) => {
        console.warn('Firestore snapshot listener warning:', error);
      }
    );
  } catch (error) {
    console.warn('Could not establish Firestore snapshot listener:', error);
    return () => {};
  }
}

/**
 * Seed initial sample appointments if cloud collection is empty
 */
export async function seedInitialAppointmentsToCloud(initialApts: Appointment[]): Promise<void> {
  try {
    const qCol = collection(db, APPOINTMENTS_COLLECTION);
    const existing = await getDocs(qCol);
    if (existing.empty) {
      for (const apt of initialApts) {
        await setDoc(doc(db, APPOINTMENTS_COLLECTION, apt.id), apt);
      }
      console.log('Seeded initial appointments to Cloud Firestore');
    }
  } catch (error) {
    console.warn('Initial Firestore seed check error:', error);
  }
}
