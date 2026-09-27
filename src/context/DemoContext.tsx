import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Booking,
  Transaction,
  Review,
  Notification,
  AuditLog,
  ChatReport,
  PlatformSettings,
  DemoStoreState,
  Role,
  PaymentMethod,
  WeeklyAvailabilitySlot,
} from '../types';
import { createSeedData } from '../data/seedData';
import { calculateEndTime, isPastDateTime } from '../utils/date';

interface DemoContextType {
  state: DemoStoreState;
  currentUser: User | null;
  currentRole: Role | null;
  studentBalance: number; // In minor units for current user if student
  getStudentBalance: (studentId: string) => number;
  
  // Auth
  login: (username: string, password?: string) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  switchUser: (role: Role) => void;
  resetDemoData: () => void;
  registerStudent: (data: { name: string; email: string; username: string; password?: string; learningGoals?: string; preferredSubjects?: string[] }) => { success: boolean; error?: string; user?: User };
  submitTutorApplication: (data: { name: string; email: string; username: string; headline: string; bio: string; hourlyRateMinorUnits: number; subjects: string[]; documents: { name: string; type: string; fileName: string; fileSize: string }[] }) => { success: boolean; error?: string; user?: User };

  // Profile
  updateStudentProfile: (studentId: string, updates: Partial<User>) => void;
  updateTutorProfile: (tutorId: string, updates: Partial<User>) => void;
  updateTutorAvailability: (tutorId: string, weeklyAvailability: WeeklyAvailabilitySlot[]) => void;

  // Bookings
  createBooking: (params: {
    studentId: string;
    tutorId: string;
    subject: string;
    date: string;
    startTime: string;
    paymentMethod: PaymentMethod;
    paymobReference?: string;
  }) => { success: boolean; error?: string; booking?: Booking };
  cancelBooking: (bookingId: string, actorId: string, reason: string) => { success: boolean; error?: string };
  rescheduleBooking: (bookingId: string, newDate: string, newStartTime: string) => { success: boolean; error?: string };
  completeBooking: (bookingId: string, actorId?: string) => { success: boolean; error?: string };
  
  // Reviews
  addReview: (params: { bookingId: string; tutorId: string; studentId: string; rating: number; comment: string }) => { success: boolean; error?: string };

  // Financial
  addCredit: (studentId: string, amountMinorUnits: number, paymentReference: string) => { success: boolean; error?: string };
  adminAdjustCredit: (studentId: string, amountMinorUnits: number, reason: string) => { success: boolean; error?: string };

  // Admin Actions
  adminReviewApplication: (tutorId: string, action: 'approve' | 'reject', reason: string) => { success: boolean; error?: string };
  adminRestrictTutorBooking: (tutorId: string, isRestricted: boolean, reason: string) => { success: boolean; error?: string };
  adminUpdateUserStatus: (userId: string, status: 'active' | 'suspended', reason: string) => { success: boolean; error?: string };
  adminModerateReview: (reviewId: string, status: 'visible' | 'hidden') => { success: boolean; error?: string };
  adminResolveChatReport: (reportId: string, action: 'resolve' | 'dismiss', adminNote?: string) => { success: boolean; error?: string };
  adminUpdateSettings: (settings: Partial<PlatformSettings>) => { success: boolean; error?: string };

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
}

const STORAGE_KEY = 'tutorconnect_demo_data_v2';
const SESSION_USER_KEY = 'tutorconnect_current_user_id';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or seed
  const [state, setState] = useState<DemoStoreState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved demo data from localStorage', e);
    }
    const seed = createSeedData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch (e) {
      console.error('Failed to save seed data to localStorage', e);
    }
    return seed;
  });

  // Track active demo user in sessionStorage
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(SESSION_USER_KEY) || 'user-student-1'; // default to student for convenience
    } catch {
      return 'user-student-1';
    }
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Sync session user
  useEffect(() => {
    try {
      if (currentUserId) {
        sessionStorage.setItem(SESSION_USER_KEY, currentUserId);
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save current user to sessionStorage', e);
    }
  }, [currentUserId]);

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return state.users.find((u) => u.id === currentUserId) || null;
  }, [currentUserId, state.users]);

  const currentRole = currentUser?.role || null;

  // Calculate platform credit balance strictly from transaction ledger
  const getStudentBalance = useCallback(
    (studentId: string): number => {
      return state.transactions
        .filter((t) => t.userId === studentId)
        .reduce((sum, t) => sum + t.amountMinorUnits, 0);
    },
    [state.transactions]
  );

  const studentBalance = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') return 0;
    return getStudentBalance(currentUser.id);
  }, [currentUser, getStudentBalance]);

  // Auth: Login
  const login = useCallback(
    (username: string, password?: string) => {
      const cleanUsername = username.trim().toLowerCase();
      const user = state.users.find((u) => u.username.toLowerCase() === cleanUsername);

      if (!user) {
        return { success: false, error: 'User not found. Check demo credentials below.' };
      }

      if (user.password && password && user.password !== password) {
        return { success: false, error: 'Invalid password. Check demo credentials below.' };
      }

      if (user.status === 'suspended') {
        return { success: false, error: 'This account has been suspended by an administrator.' };
      }

      setCurrentUserId(user.id);
      return { success: true, user };
    },
    [state.users]
  );

  // Auth: Logout
  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, []);

  // Quick switch between demo roles
  const switchUser = useCallback(
    (role: Role) => {
      let targetUser: User | undefined;
      if (role === 'admin') {
        targetUser = state.users.find((u) => u.username === 'admin');
      } else if (role === 'student') {
        targetUser = state.users.find((u) => u.username === 'user');
      } else if (role === 'tutor') {
        targetUser = state.users.find((u) => u.username === 'tutor');
      }

      if (targetUser) {
        setCurrentUserId(targetUser.id);
      }
    },
    [state.users]
  );

  // Reset demo data to initial seed
  const resetDemoData = useCallback(() => {
    const fresh = createSeedData();
    setState(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.error(e);
    }
    // Retain matching user or fallback to student
    if (currentUser) {
      const match = fresh.users.find((u) => u.username === currentUser.username);
      if (match) {
        setCurrentUserId(match.id);
      } else {
        setCurrentUserId('user-student-1');
      }
    } else {
      setCurrentUserId('user-student-1');
    }
  }, [currentUser]);

  // Register student locally
  const registerStudent = useCallback(
    (data: { name: string; email: string; username: string; password?: string; learningGoals?: string; preferredSubjects?: string[] }) => {
      const existing = state.users.find((u) => u.username.toLowerCase() === data.username.toLowerCase());
      if (existing) {
        return { success: false, error: 'Username already taken.' };
      }

      const newId = `user-student-${Date.now()}`;
      const newUser: User = {
        id: newId,
        username: data.username.trim(),
        password: data.password || 'student',
        role: 'student',
        name: data.name.trim(),
        email: data.email.trim(),
        avatarColor: 'bg-indigo-600 text-white',
        status: 'active',
        learningGoals: data.learningGoals || 'Explore subjects with top tutors.',
        preferredSubjects: data.preferredSubjects || ['Mathematics'],
        createdAt: new Date().toISOString(),
      };

      // Starting credit transaction: +500 EGP for new signups
      const initialTxn: Transaction = {
        id: `txn-welcome-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'opening_credit',
        userId: newId,
        userName: newUser.name,
        amountMinorUnits: 50000,
        balanceAfterMinorUnits: 50000,
        description: 'New student welcome credit bonus',
        reason: 'Signup bonus',
      };

      setState((prev) => ({
        ...prev,
        users: [...prev.users, newUser],
        transactions: [...prev.transactions, initialTxn],
        notifications: [
          ...prev.notifications,
          {
            id: `notif-${Date.now()}`,
            userId: newId,
            title: 'Welcome to TutorConnect!',
            message: 'Your account is ready and EGP 500 in demo credit was added to your wallet.',
            type: 'system',
            read: false,
            createdAt: new Date().toISOString(),
            link: '/student/credit',
          },
        ],
      }));

      setCurrentUserId(newId);
      return { success: true, user: newUser };
    },
    [state.users]
  );

  // Submit tutor application locally
  const submitTutorApplication = useCallback(
    (data: {
      name: string;
      email: string;
      username: string;
      headline: string;
      bio: string;
      hourlyRateMinorUnits: number;
      subjects: string[];
      documents: { name: string; type: string; fileName: string; fileSize: string }[];
    }) => {
      const existing = state.users.find((u) => u.username.toLowerCase() === data.username.toLowerCase());
      if (existing) {
        return { success: false, error: 'Username already taken.' };
      }

      const newId = `user-tutor-${Date.now()}`;
      const docRecords = data.documents.map((d, idx) => ({
        id: `doc-${Date.now()}-${idx}`,
        name: d.name,
        type: d.type,
        fileName: d.fileName,
        fileSize: d.fileSize,
        uploadedAt: new Date().toISOString(),
      }));

      const newTutor: User = {
        id: newId,
        username: data.username.trim(),
        password: 'tutor',
        role: 'tutor',
        name: data.name.trim(),
        email: data.email.trim(),
        avatarColor: 'bg-emerald-600 text-white',
        status: 'active',
        headline: data.headline,
        bio: data.bio,
        hourlyRateMinorUnits: data.hourlyRateMinorUnits,
        subjects: data.subjects,
        rating: 0,
        reviewCount: 0,
        applicationStatus: 'pending',
        isBookingRestricted: false,
        documents: docRecords,
        weeklyAvailability: [
          { dayOfWeek: 0, dayName: 'Sunday', slots: ['10:00', '14:00', '16:00'] },
          { dayOfWeek: 1, dayName: 'Monday', slots: ['10:00', '14:00', '16:00'] },
          { dayOfWeek: 2, dayName: 'Tuesday', slots: ['10:00', '14:00', '16:00'] },
          { dayOfWeek: 3, dayName: 'Wednesday', slots: ['10:00', '14:00', '16:00'] },
          { dayOfWeek: 4, dayName: 'Thursday', slots: ['10:00', '14:00', '16:00'] },
        ],
        createdAt: new Date().toISOString(),
      };

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: newId,
        actorName: newTutor.name,
        actorRole: 'tutor',
        action: 'SUBMIT_TUTOR_APPLICATION',
        targetType: 'user',
        targetId: newId,
        details: `New tutor application submitted by ${newTutor.name} (${(newTutor.subjects || []).join(', ')}).`,
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        users: [...prev.users, newTutor],
        auditLogs: [audit, ...prev.auditLogs],
        notifications: [
          ...prev.notifications,
          {
            id: `notif-${Date.now()}`,
            userId: 'user-admin-1',
            title: 'New Tutor Application Pending',
            message: `${newTutor.name} applied to teach ${(newTutor.subjects || []).join(', ')}. Review documents now.`,
            type: 'system',
            read: false,
            createdAt: new Date().toISOString(),
            link: '/admin/applications',
          },
        ],
      }));

      setCurrentUserId(newId);
      return { success: true, user: newTutor };
    },
    [state.users]
  );

  // Student Profile Updates
  const updateStudentProfile = useCallback((studentId: string, updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === studentId ? { ...u, ...updates } : u)),
    }));
  }, []);

  // Tutor Profile Updates
  const updateTutorProfile = useCallback((tutorId: string, updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === tutorId ? { ...u, ...updates } : u)),
    }));
  }, []);

  // Tutor Availability Updates
  const updateTutorAvailability = useCallback((tutorId: string, weeklyAvailability: WeeklyAvailabilitySlot[]) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === tutorId ? { ...u, weeklyAvailability } : u)),
    }));
  }, []);

  // Create Booking
  const createBooking = useCallback(
    (params: {
      studentId: string;
      tutorId: string;
      subject: string;
      date: string;
      startTime: string;
      paymentMethod: PaymentMethod;
      paymobReference?: string;
    }) => {
      const student = state.users.find((u) => u.id === params.studentId);
      const tutor = state.users.find((u) => u.id === params.tutorId);

      if (!student || !tutor) {
        return { success: false, error: 'Student or Tutor profile not found.' };
      }

      // Check tutor status & restrictions
      if (tutor.status !== 'active') {
        return { success: false, error: 'This tutor account is currently inactive.' };
      }
      if (tutor.applicationStatus !== 'approved') {
        return { success: false, error: 'This tutor application is still pending or not approved.' };
      }
      if (tutor.isBookingRestricted) {
        return {
          success: false,
          error: `Tutor bookings are temporarily restricted: ${tutor.bookingRestrictedReason || 'Administrative restriction'}`,
        };
      }

      // Check double-booking / slot conflicts
      const existingTutorBooking = state.bookings.find(
        (b) =>
          b.tutorId === params.tutorId &&
          b.date === params.date &&
          b.startTime === params.startTime &&
          b.status === 'confirmed'
      );
      if (existingTutorBooking) {
        return {
          success: false,
          error: 'This tutor slot has just been reserved. Please pick another time slot.',
        };
      }

      const existingStudentBooking = state.bookings.find(
        (b) =>
          b.studentId === params.studentId &&
          b.date === params.date &&
          b.startTime === params.startTime &&
          b.status === 'confirmed'
      );
      if (existingStudentBooking) {
        return {
          success: false,
          error: 'You already have another confirmed lesson at this exact time.',
        };
      }

      const priceMinorUnits = tutor.hourlyRateMinorUnits || 30000;
      const commissionRate = state.settings.commissionRatePercent;
      const commissionMinorUnits = Math.round((priceMinorUnits * commissionRate) / 100);
      const tutorEarningsMinorUnits = priceMinorUnits - commissionMinorUnits;

      // Handle credit balance check
      const currentBal = getStudentBalance(params.studentId);
      if (params.paymentMethod === 'credit' && currentBal < priceMinorUnits) {
        return {
          success: false,
          error: `Insufficient platform credit. Session price is EGP ${(priceMinorUnits / 100).toFixed(2)}, but your balance is EGP ${(currentBal / 100).toFixed(2)}. Please add credit or pay via Paymob.`,
        };
      }

      const bookingId = `booking-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const endTime = calculateEndTime(params.startTime, state.settings.sessionDurationMinutes);

      const newBooking: Booking = {
        id: bookingId,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorEmail: tutor.email,
        subject: params.subject,
        date: params.date,
        startTime: params.startTime,
        endTime,
        timezone: state.settings.timezone,
        status: 'confirmed',
        paymentMethod: params.paymentMethod,
        priceMinorUnits,
        commissionRatePercent: commissionRate,
        commissionMinorUnits,
        tutorEarningsMinorUnits,
        createdAt: nowIso,
        zoomMeetingId: `${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        zoomPasscode: `TC${Math.floor(1000 + Math.random() * 9000)}`,
        zoomJoinUrl: `https://zoom.us/j/demo${Date.now()}?pwd=tutorconnect`,
        reviewed: false,
      };

      // Create ledger transactions if credit payment
      const newTransactions: Transaction[] = [];
      if (params.paymentMethod === 'credit') {
        const newBal = currentBal - priceMinorUnits;
        newTransactions.push({
          id: `txn-${Date.now()}`,
          timestamp: nowIso,
          type: 'booking_deduction',
          userId: student.id,
          userName: student.name,
          amountMinorUnits: -priceMinorUnits,
          balanceAfterMinorUnits: newBal,
          referenceId: bookingId,
          description: `Session payment: ${params.subject} with ${tutor.name}`,
          reason: `Booking #${bookingId}`,
        });
      }

      // Notifications
      const studentNotif: Notification = {
        id: `notif-${Date.now()}-1`,
        userId: student.id,
        title: 'Booking Confirmed!',
        message: `Your ${params.subject} session with ${tutor.name} on ${params.date} at ${params.startTime} is confirmed.`,
        type: 'booking',
        read: false,
        createdAt: nowIso,
        link: '/student/sessions',
      };

      const tutorNotif: Notification = {
        id: `notif-${Date.now()}-2`,
        userId: tutor.id,
        title: 'New Student Booking',
        message: `${student.name} booked a session in ${params.subject} on ${params.date} at ${params.startTime}.`,
        type: 'booking',
        read: false,
        createdAt: nowIso,
        link: '/tutor/bookings',
      };

      setState((prev) => ({
        ...prev,
        bookings: [newBooking, ...prev.bookings],
        transactions: [...prev.transactions, ...newTransactions],
        notifications: [studentNotif, tutorNotif, ...prev.notifications],
      }));

      return { success: true, booking: newBooking };
    },
    [state.users, state.bookings, state.settings, getStudentBalance]
  );

  // Cancel Booking
  const cancelBooking = useCallback(
    (bookingId: string, actorId: string, reason: string) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found.' };
      }

      if (booking.status === 'cancelled') {
        return { success: false, error: 'Booking is already cancelled.' };
      }

      if (booking.status === 'completed') {
        return { success: false, error: 'Cannot cancel a completed session.' };
      }

      // Check if start time has already passed
      if (isPastDateTime(booking.date, booking.startTime)) {
        return { success: false, error: 'Cannot cancel a session after its scheduled start time.' };
      }

      const nowIso = new Date().toISOString();
      const refundAmount = booking.priceMinorUnits;
      const currentBal = getStudentBalance(booking.studentId);
      const balanceAfter = currentBal + refundAmount;

      // Immutable refund transaction in ledger
      const refundTxn: Transaction = {
        id: `txn-refund-${Date.now()}`,
        timestamp: nowIso,
        type: 'booking_refund',
        userId: booking.studentId,
        userName: booking.studentName,
        amountMinorUnits: refundAmount,
        balanceAfterMinorUnits: balanceAfter,
        referenceId: booking.id,
        description: `Refund for cancelled ${booking.subject} session with ${booking.tutorName}`,
        reason: reason.trim() || 'Session cancelled before start time',
      };

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId,
        actorName: state.users.find((u) => u.id === actorId)?.name || 'User',
        actorRole: state.users.find((u) => u.id === actorId)?.role || 'student',
        action: 'CANCEL_BOOKING',
        targetType: 'booking',
        targetId: booking.id,
        details: `Cancelled booking #${booking.id} (${booking.subject}). Refunded EGP ${(refundAmount / 100).toFixed(2)} to student credit. Reason: ${reason}`,
        timestamp: nowIso,
      };

      const studentNotif: Notification = {
        id: `notif-${Date.now()}-c1`,
        userId: booking.studentId,
        title: 'Session Cancelled & Refunded',
        message: `Your booking with ${booking.tutorName} on ${booking.date} was cancelled. EGP ${(refundAmount / 100).toFixed(2)} has been refunded to your wallet.`,
        type: 'booking',
        read: false,
        createdAt: nowIso,
        link: '/student/credit',
      };

      const tutorNotif: Notification = {
        id: `notif-${Date.now()}-c2`,
        userId: booking.tutorId,
        title: 'Session Cancelled',
        message: `The ${booking.subject} session on ${booking.date} at ${booking.startTime} with ${booking.studentName} was cancelled.`,
        type: 'booking',
        read: false,
        createdAt: nowIso,
        link: '/tutor/bookings',
      };

      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: 'cancelled',
                cancellationReason: reason,
                cancelledAt: nowIso,
              }
            : b
        ),
        transactions: [...prev.transactions, refundTxn],
        auditLogs: [audit, ...prev.auditLogs],
        notifications: [studentNotif, tutorNotif, ...prev.notifications],
      }));

      return { success: true };
    },
    [state.bookings, state.users, getStudentBalance]
  );

  // Reschedule Booking
  const rescheduleBooking = useCallback(
    (bookingId: string, newDate: string, newStartTime: string) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found.' };
      }

      if (booking.status !== 'confirmed') {
        return { success: false, error: 'Only confirmed upcoming sessions can be rescheduled.' };
      }

      // Check conflicts on new slot
      const tutorConflict = state.bookings.find(
        (b) =>
          b.id !== bookingId &&
          b.tutorId === booking.tutorId &&
          b.date === newDate &&
          b.startTime === newStartTime &&
          b.status === 'confirmed'
      );
      if (tutorConflict) {
        return { success: false, error: 'Tutor is already booked at that new time.' };
      }

      const studentConflict = state.bookings.find(
        (b) =>
          b.id !== bookingId &&
          b.studentId === booking.studentId &&
          b.date === newDate &&
          b.startTime === newStartTime &&
          b.status === 'confirmed'
      );
      if (studentConflict) {
        return { success: false, error: 'You already have another session at that new time.' };
      }

      const oldSlot = `${booking.date} at ${booking.startTime}`;
      const newEndTime = calculateEndTime(newStartTime, state.settings.sessionDurationMinutes);
      const nowIso = new Date().toISOString();

      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                date: newDate,
                startTime: newStartTime,
                endTime: newEndTime,
                rescheduledFrom: oldSlot,
              }
            : b
        ),
        notifications: [
          {
            id: `notif-${Date.now()}-r1`,
            userId: booking.studentId,
            title: 'Session Rescheduled',
            message: `Your ${booking.subject} session was rescheduled to ${newDate} at ${newStartTime} with no additional fee.`,
            type: 'booking',
            read: false,
            createdAt: nowIso,
            link: '/student/sessions',
          },
          {
            id: `notif-${Date.now()}-r2`,
            userId: booking.tutorId,
            title: 'Session Rescheduled by Student',
            message: `${booking.studentName} rescheduled their ${booking.subject} lesson to ${newDate} at ${newStartTime}.`,
            type: 'booking',
            read: false,
            createdAt: nowIso,
            link: '/tutor/bookings',
          },
          ...prev.notifications,
        ],
      }));

      return { success: true };
    },
    [state.bookings, state.settings]
  );

  // Complete Booking (Tutor or Admin action)
  const completeBooking = useCallback(
    (bookingId: string, actorId?: string) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found.' };
      }

      if (booking.status === 'completed') {
        return { success: false, error: 'Session is already marked as completed.' };
      }

      if (booking.status === 'cancelled') {
        return { success: false, error: 'Cannot complete a cancelled session.' };
      }

      const nowIso = new Date().toISOString();

      const notif: Notification = {
        id: `notif-${Date.now()}-comp`,
        userId: booking.studentId,
        title: 'Session Completed — Leave a Review!',
        message: `Your ${booking.subject} session with ${booking.tutorName} has concluded. Rate your experience!`,
        type: 'booking',
        read: false,
        createdAt: nowIso,
        link: '/student/sessions',
      };

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: actorId || booking.tutorId,
        actorName: state.users.find((u) => u.id === (actorId || booking.tutorId))?.name || 'Tutor',
        actorRole: 'tutor',
        action: 'COMPLETE_BOOKING',
        targetType: 'booking',
        targetId: booking.id,
        details: `Marked session #${booking.id} completed. Tutor net earnings: EGP ${(booking.tutorEarningsMinorUnits / 100).toFixed(2)}.`,
        timestamp: nowIso,
      };

      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'completed' } : b)),
        auditLogs: [audit, ...prev.auditLogs],
        notifications: [notif, ...prev.notifications],
      }));

      return { success: true };
    },
    [state.bookings, state.users]
  );

  // Add Review
  const addReview = useCallback(
    (params: { bookingId: string; tutorId: string; studentId: string; rating: number; comment: string }) => {
      const booking = state.bookings.find((b) => b.id === params.bookingId);
      if (!booking) {
        return { success: false, error: 'Booking record not found.' };
      }

      if (booking.studentId !== params.studentId) {
        return { success: false, error: 'You can only review sessions you attended.' };
      }

      if (booking.status !== 'completed') {
        return { success: false, error: 'You can only review completed sessions.' };
      }

      if (booking.reviewed) {
        return { success: false, error: 'You have already submitted a review for this session.' };
      }

      const reviewId = `rev-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const student = state.users.find((u) => u.id === params.studentId);

      const newReview: Review = {
        id: reviewId,
        bookingId: params.bookingId,
        tutorId: params.tutorId,
        studentId: params.studentId,
        studentName: student?.name || 'Student',
        rating: Math.max(1, Math.min(5, params.rating)),
        comment: params.comment.trim(),
        createdAt: nowIso,
        status: 'visible',
      };

      // Recalculate tutor's rating from all visible reviews
      const existingTutorReviews = state.reviews.filter((r) => r.tutorId === params.tutorId && r.status === 'visible');
      const allRatings = [...existingTutorReviews.map((r) => r.rating), newReview.rating];
      const avgRating = Number((allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(1));

      setState((prev) => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        bookings: prev.bookings.map((b) => (b.id === params.bookingId ? { ...b, reviewed: true } : b)),
        users: prev.users.map((u) =>
          u.id === params.tutorId
            ? {
                ...u,
                rating: avgRating,
                reviewCount: allRatings.length,
              }
            : u
        ),
        notifications: [
          {
            id: `notif-${Date.now()}-rev`,
            userId: params.tutorId,
            title: 'New Student Review Received',
            message: `${student?.name || 'A student'} gave you a ${newReview.rating}-star review: "${newReview.comment.slice(0, 60)}..."`,
            type: 'review',
            read: false,
            createdAt: nowIso,
            link: '/tutor/reviews',
          },
          ...prev.notifications,
        ],
      }));

      return { success: true };
    },
    [state.bookings, state.users, state.reviews]
  );

  // Add Platform Credit (Top-up)
  const addCredit = useCallback(
    (studentId: string, amountMinorUnits: number, paymentReference: string) => {
      if (amountMinorUnits <= 0) {
        return { success: false, error: 'Amount must be greater than zero.' };
      }

      const student = state.users.find((u) => u.id === studentId);
      if (!student) {
        return { success: false, error: 'Student profile not found.' };
      }

      const nowIso = new Date().toISOString();
      const currentBal = getStudentBalance(studentId);
      const balanceAfter = currentBal + amountMinorUnits;

      const topupTxn: Transaction = {
        id: `txn-topup-${Date.now()}`,
        timestamp: nowIso,
        type: 'top_up',
        userId: student.id,
        userName: student.name,
        amountMinorUnits,
        balanceAfterMinorUnits: balanceAfter,
        referenceId: paymentReference,
        description: `Wallet top-up via Paymob Card Payment`,
        reason: `Payment reference #${paymentReference}`,
      };

      setState((prev) => ({
        ...prev,
        transactions: [...prev.transactions, topupTxn],
        notifications: [
          {
            id: `notif-${Date.now()}-topup`,
            userId: studentId,
            title: 'Platform Credit Added',
            message: `EGP ${(amountMinorUnits / 100).toFixed(2)} was successfully credited to your wallet.`,
            type: 'payment',
            read: false,
            createdAt: nowIso,
            link: '/student/credit',
          },
          ...prev.notifications,
        ],
      }));

      return { success: true };
    },
    [state.users, getStudentBalance]
  );

  // Admin Credit Adjustment
  const adminAdjustCredit = useCallback(
    (studentId: string, amountMinorUnits: number, reason: string) => {
      if (!reason.trim()) {
        return { success: false, error: 'A mandatory reason is required for admin financial adjustments.' };
      }
      if (amountMinorUnits === 0) {
        return { success: false, error: 'Adjustment amount cannot be zero.' };
      }

      const student = state.users.find((u) => u.id === studentId);
      if (!student) {
        return { success: false, error: 'Student profile not found.' };
      }

      const currentBal = getStudentBalance(studentId);
      const balanceAfter = currentBal + amountMinorUnits;

      if (balanceAfter < 0) {
        return {
          success: false,
          error: `Adjustment would result in negative balance (Current: EGP ${(currentBal / 100).toFixed(2)}).`,
        };
      }

      const nowIso = new Date().toISOString();
      const adminName = currentUser?.name || 'Administrator';

      const adjTxn: Transaction = {
        id: `txn-adj-${Date.now()}`,
        timestamp: nowIso,
        type: 'admin_adjustment',
        userId: student.id,
        userName: student.name,
        amountMinorUnits,
        balanceAfterMinorUnits: balanceAfter,
        referenceId: `admin_adj_${Date.now()}`,
        description: `Manual admin balance adjustment by ${adminName}`,
        reason: reason.trim(),
      };

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: adminName,
        actorRole: 'admin',
        action: 'ADMIN_CREDIT_ADJUSTMENT',
        targetType: 'wallet',
        targetId: student.id,
        details: `Adjusted balance of ${student.name} by ${amountMinorUnits > 0 ? '+' : ''}EGP ${(amountMinorUnits / 100).toFixed(2)}. Reason: ${reason}`,
        timestamp: nowIso,
      };

      setState((prev) => ({
        ...prev,
        transactions: [...prev.transactions, adjTxn],
        auditLogs: [audit, ...prev.auditLogs],
        notifications: [
          {
            id: `notif-${Date.now()}-adj`,
            userId: student.id,
            title: 'Account Balance Adjustment',
            message: `An admin adjusted your credit by ${amountMinorUnits > 0 ? '+' : ''}EGP ${(amountMinorUnits / 100).toFixed(2)}. Reason: ${reason}`,
            type: 'payment',
            read: false,
            createdAt: nowIso,
            link: '/student/credit',
          },
          ...prev.notifications,
        ],
      }));

      return { success: true };
    },
    [state.users, currentUser, getStudentBalance]
  );

  // Admin Tutor Application Review
  const adminReviewApplication = useCallback(
    (tutorId: string, action: 'approve' | 'reject', reason: string) => {
      const tutor = state.users.find((u) => u.id === tutorId);
      if (!tutor) return { success: false, error: 'Tutor not found.' };

      const nowIso = new Date().toISOString();
      const adminName = currentUser?.name || 'Admin';

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: adminName,
        actorRole: 'admin',
        action: action === 'approve' ? 'APPROVE_TUTOR_APPLICATION' : 'REJECT_TUTOR_APPLICATION',
        targetType: 'user',
        targetId: tutor.id,
        details: `${action === 'approve' ? 'Approved' : 'Rejected'} application for ${tutor.name}. Reason/Notes: ${reason || 'N/A'}`,
        timestamp: nowIso,
      };

      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === tutorId
            ? {
                ...u,
                applicationStatus: action === 'approve' ? 'approved' : 'rejected',
                rejectionReason: action === 'reject' ? reason : undefined,
              }
            : u
        ),
        auditLogs: [audit, ...prev.auditLogs],
        notifications: [
          {
            id: `notif-${Date.now()}-tapp`,
            userId: tutor.id,
            title: action === 'approve' ? 'Tutor Application Approved! 🎉' : 'Tutor Application Update',
            message:
              action === 'approve'
                ? 'Congratulations! Your profile is verified and active for bookings on TutorConnect.'
                : `Your tutor application was not approved. Note: ${reason || 'Incomplete verification documents.'}`,
            type: 'system',
            read: false,
            createdAt: nowIso,
            link: '/tutor/profile',
          },
          ...prev.notifications,
        ],
      }));

      return { success: true };
    },
    [state.users, currentUser]
  );

  // Admin Restrict Tutor Booking
  const adminRestrictTutorBooking = useCallback(
    (tutorId: string, isRestricted: boolean, reason: string) => {
      const tutor = state.users.find((u) => u.id === tutorId);
      if (!tutor) return { success: false, error: 'Tutor not found.' };

      if (isRestricted && !reason.trim()) {
        return { success: false, error: 'A mandatory reason is required to restrict bookings.' };
      }

      const nowIso = new Date().toISOString();
      const adminName = currentUser?.name || 'Admin';

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: adminName,
        actorRole: 'admin',
        action: isRestricted ? 'RESTRICT_TUTOR_BOOKINGS' : 'LIFT_TUTOR_BOOKING_RESTRICTION',
        targetType: 'user',
        targetId: tutor.id,
        details: isRestricted
          ? `Restricted bookings for ${tutor.name}. Reason: ${reason}`
          : `Lifted booking restriction for ${tutor.name}.`,
        timestamp: nowIso,
      };

      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === tutorId
            ? {
                ...u,
                isBookingRestricted: isRestricted,
                bookingRestrictedReason: isRestricted ? reason : undefined,
              }
            : u
        ),
        auditLogs: [audit, ...prev.auditLogs],
      }));

      return { success: true };
    },
    [state.users, currentUser]
  );

  // Admin User Status (Active / Suspended)
  const adminUpdateUserStatus = useCallback(
    (userId: string, status: 'active' | 'suspended', reason: string) => {
      const target = state.users.find((u) => u.id === userId);
      if (!target) return { success: false, error: 'User not found.' };

      const nowIso = new Date().toISOString();
      const adminName = currentUser?.name || 'Admin';

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: adminName,
        actorRole: 'admin',
        action: status === 'suspended' ? 'SUSPEND_USER' : 'ACTIVATE_USER',
        targetType: 'user',
        targetId: target.id,
        details: `${status === 'suspended' ? 'Suspended' : 'Activated'} account of ${target.name} (${target.role}). Reason: ${reason || 'Administrative action'}`,
        timestamp: nowIso,
      };

      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === userId ? { ...u, status } : u)),
        auditLogs: [audit, ...prev.auditLogs],
      }));

      return { success: true };
    },
    [state.users, currentUser]
  );

  // Admin Moderate Review
  const adminModerateReview = useCallback(
    (reviewId: string, status: 'visible' | 'hidden') => {
      const rev = state.reviews.find((r) => r.id === reviewId);
      if (!rev) return { success: false, error: 'Review not found.' };

      const nowIso = new Date().toISOString();
      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser?.name || 'Admin',
        actorRole: 'admin',
        action: status === 'hidden' ? 'HIDE_REVIEW' : 'RESTORE_REVIEW',
        targetType: 'review',
        targetId: reviewId,
        details: `${status === 'hidden' ? 'Hidden' : 'Restored'} review by ${rev.studentName} for tutor #${rev.tutorId}.`,
        timestamp: nowIso,
      };

      // Update review and recalculate tutor rating
      const updatedReviews = state.reviews.map((r) => (r.id === reviewId ? { ...r, status } : r));
      const visibleTutorReviews = updatedReviews.filter((r) => r.tutorId === rev.tutorId && r.status === 'visible');
      const newAvg =
        visibleTutorReviews.length > 0
          ? Number((visibleTutorReviews.reduce((sum, r) => sum + r.rating, 0) / visibleTutorReviews.length).toFixed(1))
          : 0;

      setState((prev) => ({
        ...prev,
        reviews: updatedReviews,
        users: prev.users.map((u) =>
          u.id === rev.tutorId
            ? {
                ...u,
                rating: newAvg,
                reviewCount: visibleTutorReviews.length,
              }
            : u
        ),
        auditLogs: [audit, ...prev.auditLogs],
      }));

      return { success: true };
    },
    [state.reviews, currentUser]
  );

  // Admin Resolve Chat Report
  const adminResolveChatReport = useCallback(
    (reportId: string, action: 'resolve' | 'dismiss', adminNote?: string) => {
      const rep = state.chatReports.find((r) => r.id === reportId);
      if (!rep) return { success: false, error: 'Report not found.' };

      const nowIso = new Date().toISOString();
      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser?.name || 'Admin',
        actorRole: 'admin',
        action: action === 'resolve' ? 'RESOLVE_CHAT_REPORT' : 'DISMISS_CHAT_REPORT',
        targetType: 'report',
        targetId: reportId,
        details: `${action === 'resolve' ? 'Resolved' : 'Dismissed'} chat report against ${rep.reportedUserName}. Note: ${adminNote || 'No notes'}`,
        timestamp: nowIso,
      };

      setState((prev) => ({
        ...prev,
        chatReports: prev.chatReports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: action === 'resolve' ? 'resolved' : 'dismissed',
                adminNote: adminNote || r.adminNote,
              }
            : r
        ),
        auditLogs: [audit, ...prev.auditLogs],
      }));

      return { success: true };
    },
    [state.chatReports, currentUser]
  );

  // Admin Settings
  const adminUpdateSettings = useCallback(
    (settingsUpdate: Partial<PlatformSettings>) => {
      const nowIso = new Date().toISOString();
      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser?.name || 'Admin',
        actorRole: 'admin',
        action: 'UPDATE_PLATFORM_SETTINGS',
        targetType: 'settings',
        targetId: 'platform_settings',
        details: `Updated settings: ${JSON.stringify(settingsUpdate)}`,
        timestamp: nowIso,
      };

      setState((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...settingsUpdate },
        auditLogs: [audit, ...prev.auditLogs],
      }));

      return { success: true };
    },
    [currentUser]
  );

  // Notifications
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsAsRead = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      currentUser,
      currentRole,
      studentBalance,
      getStudentBalance,
      login,
      logout,
      switchUser,
      resetDemoData,
      registerStudent,
      submitTutorApplication,
      updateStudentProfile,
      updateTutorProfile,
      updateTutorAvailability,
      createBooking,
      cancelBooking,
      rescheduleBooking,
      completeBooking,
      addReview,
      addCredit,
      adminAdjustCredit,
      adminReviewApplication,
      adminRestrictTutorBooking,
      adminUpdateUserStatus,
      adminModerateReview,
      adminResolveChatReport,
      adminUpdateSettings,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    }),
    [
      state,
      currentUser,
      currentRole,
      studentBalance,
      getStudentBalance,
      login,
      logout,
      switchUser,
      resetDemoData,
      registerStudent,
      submitTutorApplication,
      updateStudentProfile,
      updateTutorProfile,
      updateTutorAvailability,
      createBooking,
      cancelBooking,
      rescheduleBooking,
      completeBooking,
      addReview,
      addCredit,
      adminAdjustCredit,
      adminReviewApplication,
      adminRestrictTutorBooking,
      adminUpdateUserStatus,
      adminModerateReview,
      adminResolveChatReport,
      adminUpdateSettings,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    ]
  );

  return <DemoContext.Provider value={contextValue}>{children}</DemoContext.Provider>;
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
