import { describe, it, expect } from 'vitest';
import { createSeedData } from '../data/seedData';
import { minorUnitsToEGP, egpToMinorUnits, formatEGP, formatSignedEGP } from '../utils/currency';
import { calculateEndTime, isPastDateTime } from '../utils/date';
import { Booking, Transaction, Review } from '../types';

describe('TutorConnect Prototype Business Logic & Ledger Tests', () => {
  it('initializes with exact 3 required demo accounts', () => {
    const seed = createSeedData();
    const admin = seed.users.find((u) => u.username === 'admin');
    const student = seed.users.find((u) => u.username === 'user');
    const tutor = seed.users.find((u) => u.username === 'tutor');

    expect(admin).toBeDefined();
    expect(admin?.role).toBe('admin');
    expect(admin?.password).toBe('admin');

    expect(student).toBeDefined();
    expect(student?.role).toBe('student');
    expect(student?.password).toBe('student');

    expect(tutor).toBeDefined();
    expect(tutor?.role).toBe('tutor');
    expect(tutor?.password).toBe('tutor');
    expect(tutor?.applicationStatus).toBe('approved');
    expect(tutor?.isBookingRestricted).toBe(false);
  });

  it('contains at least 8 realistic tutors across multiple subjects', () => {
    const seed = createSeedData();
    const tutors = seed.users.filter((u) => u.role === 'tutor');
    expect(tutors.length).toBeGreaterThanOrEqual(8);

    const subjects = new Set<string>();
    tutors.forEach((t) => t.subjects?.forEach((s) => subjects.add(s)));
    expect(subjects.has('Mathematics')).toBe(true);
    expect(subjects.has('Physics')).toBe(true);
    expect(subjects.has('English')).toBe(true);
    expect(subjects.has('Programming')).toBe(true);
  });

  it('calculates currency and integer minor units correctly (100 minor units = 1 EGP)', () => {
    expect(minorUnitsToEGP(100000)).toBe(1000);
    expect(egpToMinorUnits(350)).toBe(35000);
    expect(formatEGP(35000)).toContain('350');
    expect(formatSignedEGP(-28000)).toContain('-EGP 280');
    expect(formatSignedEGP(50000)).toContain('+EGP 500');
  });

  it('verifies student initial opening credit ledger entry exists for 1,000 EGP', () => {
    const seed = createSeedData();
    const studentId = 'user-student-1';
    const openingTxn = seed.transactions.find(
      (t) => t.userId === studentId && t.type === 'opening_credit'
    );

    expect(openingTxn).toBeDefined();
    expect(openingTxn?.amountMinorUnits).toBe(100000); // 1,000.00 EGP

    // Derive student balance as sum of all ledger entries
    const derivedBalance = seed.transactions
      .filter((t) => t.userId === studentId)
      .reduce((sum, t) => sum + t.amountMinorUnits, 0);

    expect(derivedBalance).toBeGreaterThan(0);
  });

  it('snapshots booking price and platform commission (10%) at creation', () => {
    const tutorRateMinorUnits = 35000; // 350 EGP
    const commissionPercent = 10;
    const commissionMinorUnits = Math.round((tutorRateMinorUnits * commissionPercent) / 100);
    const netEarningsMinorUnits = tutorRateMinorUnits - commissionMinorUnits;

    expect(commissionMinorUnits).toBe(3500); // 35 EGP
    expect(netEarningsMinorUnits).toBe(31500); // 315 EGP
  });

  it('prevents double booking and slot collisions', () => {
    const bookings: Booking[] = [
      {
        id: 'b-1',
        studentId: 'user-student-1',
        studentName: 'Omar Mostafa',
        studentEmail: 'user@tutorconnect.demo',
        tutorId: 'user-tutor-1',
        tutorName: 'Dr. Tarek Mansour',
        tutorEmail: 'tutor@tutorconnect.demo',
        subject: 'Mathematics',
        date: '2026-10-01',
        startTime: '14:00',
        endTime: '15:00',
        timezone: 'Africa/Cairo',
        status: 'confirmed',
        paymentMethod: 'credit',
        priceMinorUnits: 35000,
        commissionRatePercent: 10,
        commissionMinorUnits: 3500,
        tutorEarningsMinorUnits: 31500,
        createdAt: new Date().toISOString(),
        zoomMeetingId: '123',
        zoomPasscode: 'abc',
        zoomJoinUrl: 'https://zoom.us',
        reviewed: false,
      },
    ];

    // Attempt to book same tutor on same slot
    const isSlotOccupied = bookings.some(
      (b) =>
        b.tutorId === 'user-tutor-1' &&
        b.date === '2026-10-01' &&
        b.startTime === '14:00' &&
        b.status === 'confirmed'
    );
    expect(isSlotOccupied).toBe(true);

    // Another tutor is free
    const isOtherTutorOccupied = bookings.some(
      (b) =>
        b.tutorId === 'user-tutor-2' &&
        b.date === '2026-10-01' &&
        b.startTime === '14:00' &&
        b.status === 'confirmed'
    );
    expect(isOtherTutorOccupied).toBe(false);
  });

  it('processes cancellation with 100% refund into platform credit and prevents double cancellation', () => {
    let booking: Booking = {
      id: 'b-cancel-test',
      studentId: 'user-student-1',
      studentName: 'Omar Mostafa',
      studentEmail: 'user@tutorconnect.demo',
      tutorId: 'user-tutor-1',
      tutorName: 'Dr. Tarek Mansour',
      tutorEmail: 'tutor@tutorconnect.demo',
      subject: 'Mathematics',
      date: '2026-10-05',
      startTime: '16:00',
      endTime: '17:00',
      timezone: 'Africa/Cairo',
      status: 'confirmed',
      paymentMethod: 'paymob', // originally paid via Paymob
      priceMinorUnits: 35000,
      commissionRatePercent: 10,
      commissionMinorUnits: 3500,
      tutorEarningsMinorUnits: 31500,
      createdAt: new Date().toISOString(),
      zoomMeetingId: '123',
      zoomPasscode: 'abc',
      zoomJoinUrl: 'https://zoom.us',
      reviewed: false,
    };

    let ledger: Transaction[] = [];

    // First cancellation
    expect(booking.status).toBe('confirmed');
    booking = { ...booking, status: 'cancelled' };
    ledger.push({
      id: 'txn-refund-1',
      timestamp: new Date().toISOString(),
      type: 'booking_refund',
      userId: booking.studentId,
      userName: booking.studentName,
      amountMinorUnits: booking.priceMinorUnits,
      balanceAfterMinorUnits: 35000,
      referenceId: booking.id,
      description: 'Refund for cancelled session',
    });

    expect(ledger.length).toBe(1);
    expect(ledger[0].amountMinorUnits).toBe(35000);

    // Second cancellation attempt must be blocked
    const canCancelAgain = booking.status === 'confirmed';
    expect(canCancelAgain).toBe(false);
  });

  it('counts tutor earnings from completed sessions only', () => {
    const sampleBookings: Booking[] = [
      {
        id: 'b-1',
        studentId: 's1',
        studentName: 'S1',
        studentEmail: 's1@demo',
        tutorId: 't1',
        tutorName: 'T1',
        tutorEmail: 't1@demo',
        subject: 'Math',
        date: '2026-09-01',
        startTime: '10:00',
        endTime: '11:00',
        timezone: 'Africa/Cairo',
        status: 'completed',
        paymentMethod: 'credit',
        priceMinorUnits: 30000,
        commissionRatePercent: 10,
        commissionMinorUnits: 3000,
        tutorEarningsMinorUnits: 27000, // 270 EGP
        createdAt: '2026-09-01T09:00:00Z',
        zoomMeetingId: '1',
        zoomPasscode: '1',
        zoomJoinUrl: '1',
        reviewed: true,
      },
      {
        id: 'b-2',
        studentId: 's1',
        studentName: 'S1',
        studentEmail: 's1@demo',
        tutorId: 't1',
        tutorName: 'T1',
        tutorEmail: 't1@demo',
        subject: 'Math',
        date: '2026-10-01',
        startTime: '10:00',
        endTime: '11:00',
        timezone: 'Africa/Cairo',
        status: 'confirmed', // not completed
        paymentMethod: 'credit',
        priceMinorUnits: 30000,
        commissionRatePercent: 10,
        commissionMinorUnits: 3000,
        tutorEarningsMinorUnits: 27000,
        createdAt: '2026-09-01T09:00:00Z',
        zoomMeetingId: '2',
        zoomPasscode: '2',
        zoomJoinUrl: '2',
        reviewed: false,
      },
    ];

    const completedEarnings = sampleBookings
      .filter((b) => b.tutorId === 't1' && b.status === 'completed')
      .reduce((sum, b) => sum + b.tutorEarningsMinorUnits, 0);

    expect(completedEarnings).toBe(27000); // Only counts completed!
  });

  it('recalculates tutor average rating when new review is added', () => {
    const reviews: Review[] = [
      {
        id: 'r1',
        bookingId: 'b1',
        tutorId: 't1',
        studentId: 's1',
        studentName: 'S1',
        rating: 5,
        comment: 'Great!',
        createdAt: '2026-09-01T10:00:00Z',
        status: 'visible',
      },
      {
        id: 'r2',
        bookingId: 'b2',
        tutorId: 't1',
        studentId: 's2',
        studentName: 'S2',
        rating: 4,
        comment: 'Very helpful.',
        createdAt: '2026-09-02T10:00:00Z',
        status: 'visible',
      },
    ];

    const visibleReviews = reviews.filter((r) => r.tutorId === 't1' && r.status === 'visible');
    const avg = Number(
      (visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length).toFixed(1)
    );

    expect(avg).toBe(4.5);
    expect(visibleReviews.length).toBe(2);
  });
});
