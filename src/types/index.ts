export type Role = 'admin' | 'student' | 'tutor';

export type UserStatus = 'active' | 'suspended';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export type PaymentMethod = 'credit' | 'paymob';

export type TransactionType =
  | 'opening_credit'
  | 'top_up'
  | 'booking_deduction'
  | 'booking_refund'
  | 'admin_adjustment';

export type ReviewStatus = 'visible' | 'hidden';

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface DocumentRecord {
  id: string;
  name: string;
  type: string; // e.g., 'ID Card', 'University Degree', 'Teaching Certificate'
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export interface WeeklyAvailabilitySlot {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayName: string;   // 'Sunday', 'Monday', etc.
  slots: string[];   // e.g. ["09:00", "10:00", "14:00", "16:00"]
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  name: string;
  email: string;
  phone?: string;
  avatarColor: string;
  status: UserStatus;
  createdAt: string;

  // Student specific
  learningGoals?: string;
  preferredSubjects?: string[];

  // Tutor specific
  headline?: string;
  bio?: string;
  hourlyRateMinorUnits?: number; // Integer minor units (piastres): 100 minor units = 1 EGP
  subjects?: string[];
  rating?: number;
  reviewCount?: number;
  applicationStatus?: ApplicationStatus;
  rejectionReason?: string;
  isBookingRestricted?: boolean;
  bookingRestrictedReason?: string;
  documents?: DocumentRecord[];
  weeklyAvailability?: WeeklyAvailabilitySlot[];
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  subject: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "14:00")
  endTime: string; // HH:mm (e.g. "15:00", 60 min session)
  timezone: string; // e.g. "Africa/Cairo (EET / UTC+2)"
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  priceMinorUnits: number; // Snapshotted at booking creation
  commissionRatePercent: number; // Snapshotted at booking creation (e.g. 10%)
  commissionMinorUnits: number; // Snapshotted
  tutorEarningsMinorUnits: number; // Snapshotted: priceMinorUnits - commissionMinorUnits
  createdAt: string;
  cancellationReason?: string;
  cancelledAt?: string;
  rescheduledFrom?: string;
  zoomMeetingId: string;
  zoomPasscode: string;
  zoomJoinUrl: string;
  reviewed: boolean;
}

export interface Transaction {
  id: string;
  timestamp: string;
  type: TransactionType;
  userId: string;
  userName: string;
  amountMinorUnits: number; // Positive = credit added, Negative = credit deducted
  balanceAfterMinorUnits: number;
  referenceId?: string; // bookingId or simulated payment tx ID
  description: string;
  reason?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  tutorId: string;
  studentId: string;
  studentName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  status: ReviewStatus;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system' | 'review';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  targetType: 'user' | 'booking' | 'wallet' | 'review' | 'report' | 'settings';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface ChatReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  snippet: string;
  status: ReportStatus;
  timestamp: string;
  adminNote?: string;
}

export interface PlatformSettings {
  platformName: string;
  commissionRatePercent: number;
  supportedSubjects: string[];
  defaultCurrency: string;
  timezone: string;
  sessionDurationMinutes: number;
}

export interface DemoStoreState {
  users: User[];
  bookings: Booking[];
  transactions: Transaction[];
  reviews: Review[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  chatReports: ChatReport[];
  settings: PlatformSettings;
}
