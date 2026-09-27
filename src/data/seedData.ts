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
  WeeklyAvailabilitySlot,
} from '../types';
import { getRelativeDate } from '../utils/date';

const defaultWeeklyAvailability = (): WeeklyAvailabilitySlot[] => [
  { dayOfWeek: 0, dayName: 'Sunday', slots: ['10:00', '11:00', '15:00', '16:00', '18:00'] },
  { dayOfWeek: 1, dayName: 'Monday', slots: ['09:00', '10:00', '14:00', '16:00', '17:00'] },
  { dayOfWeek: 2, dayName: 'Tuesday', slots: ['11:00', '14:00', '15:00', '18:00', '19:00'] },
  { dayOfWeek: 3, dayName: 'Wednesday', slots: ['09:00', '10:00', '13:00', '15:00', '17:00'] },
  { dayOfWeek: 4, dayName: 'Thursday', slots: ['10:00', '11:00', '14:00', '16:00', '18:00'] },
  { dayOfWeek: 5, dayName: 'Friday', slots: ['14:00', '15:00', '16:00', '17:00'] },
  { dayOfWeek: 6, dayName: 'Saturday', slots: ['10:00', '11:00', '12:00', '15:00', '16:00'] },
];

export const INITIAL_SETTINGS: PlatformSettings = {
  platformName: 'TutorConnect',
  commissionRatePercent: 10,
  supportedSubjects: [
    'Mathematics',
    'Physics',
    'Chemistry',
    'English',
    'Arabic',
    'Programming',
    'Biology',
    'French',
  ],
  defaultCurrency: 'EGP',
  timezone: 'Africa/Cairo (EET / UTC+2)',
  sessionDurationMinutes: 60,
};

export const createSeedData = (): DemoStoreState => {
  const users: User[] = [
    // 1. Exact Admin Account
    {
      id: 'user-admin-1',
      username: 'admin',
      password: 'admin',
      role: 'admin',
      name: 'Sarah Jenkins (Admin)',
      email: 'admin@tutorconnect.demo',
      phone: '+20 100 000 0001',
      avatarColor: 'bg-slate-700 text-white',
      status: 'active',
      createdAt: '2026-01-10T08:00:00Z',
    },

    // 2. Exact Student Account
    {
      id: 'user-student-1',
      username: 'user',
      password: 'student',
      role: 'student',
      name: 'Omar Mostafa',
      email: 'user@tutorconnect.demo',
      phone: '+20 102 345 6789',
      avatarColor: 'bg-indigo-600 text-white',
      status: 'active',
      learningGoals: 'Master calculus and advance Python programming for university entrance exams.',
      preferredSubjects: ['Mathematics', 'Programming', 'Physics'],
      createdAt: '2026-02-01T10:00:00Z',
    },

    // Additional fictional student
    {
      id: 'user-student-2',
      username: 'yasmin',
      password: 'student',
      role: 'student',
      name: 'Yasmin Khaled',
      email: 'yasmin@tutorconnect.demo',
      phone: '+20 114 567 8901',
      avatarColor: 'bg-teal-600 text-white',
      status: 'active',
      learningGoals: 'Improve English fluency for IELTS exam and learn introductory Chemistry.',
      preferredSubjects: ['English', 'Chemistry'],
      createdAt: '2026-02-15T11:30:00Z',
    },

    // 3. Exact Tutor Account (Approved and ready for booking)
    {
      id: 'user-tutor-1',
      username: 'tutor',
      password: 'tutor',
      role: 'tutor',
      name: 'Dr. Tarek Mansour',
      email: 'tutor@tutorconnect.demo',
      phone: '+20 120 123 4567',
      avatarColor: 'bg-blue-600 text-white',
      status: 'active',
      headline: 'PhD in Applied Mathematics | 10+ Years Experience in IGCSE, SAT & University Math',
      bio: 'Former university assistant professor passionate about demystifying mathematics. I specialize in breaking down calculus, algebra, and physics into intuitive visual steps so students build lasting confidence.',
      hourlyRateMinorUnits: 35000, // 350 EGP
      subjects: ['Mathematics', 'Physics'],
      rating: 4.9,
      reviewCount: 19,
      applicationStatus: 'approved',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-1',
          name: 'PhD Degree Certificate in Applied Mathematics',
          type: 'Degree Certificate',
          fileName: 'tarek_mansour_phd_cairo_univ.pdf',
          fileSize: '2.4 MB',
          uploadedAt: '2026-01-12T09:15:00Z',
        },
        {
          id: 'doc-2',
          name: 'National ID Card (Verified)',
          type: 'Government ID',
          fileName: 'tarek_mansour_national_id.pdf',
          fileSize: '1.1 MB',
          uploadedAt: '2026-01-12T09:17:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-01-12T09:00:00Z',
    },

    // Tutor 2: English & Arabic Specialist
    {
      id: 'user-tutor-2',
      username: 'layla',
      password: 'password123',
      role: 'tutor',
      name: 'Layla El-Sayed',
      email: 'layla.elsayed@tutorconnect.demo',
      phone: '+20 101 987 6543',
      avatarColor: 'bg-purple-600 text-white',
      status: 'active',
      headline: 'Certified IELTS 8.5 & Cambridge English Instructor | Arabic Literature',
      bio: 'Master in Applied Linguistics with 8 years of tutoring high-school and adult learners. Customized lesson plans focused on speaking fluency, persuasive writing, and examination strategy.',
      hourlyRateMinorUnits: 30000, // 300 EGP
      subjects: ['English', 'Arabic'],
      rating: 4.8,
      reviewCount: 24,
      applicationStatus: 'approved',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-3',
          name: 'CELTA Certification',
          type: 'Teaching Certificate',
          fileName: 'celta_layla_elsayed.pdf',
          fileSize: '1.8 MB',
          uploadedAt: '2026-01-15T12:00:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-01-15T10:00:00Z',
    },

    // Tutor 3: Physics & Chemistry Specialist
    {
      id: 'user-tutor-3',
      username: 'kareem',
      password: 'password123',
      role: 'tutor',
      name: 'Eng. Kareem Hassan',
      email: 'kareem.hassan@tutorconnect.demo',
      phone: '+20 111 234 5678',
      avatarColor: 'bg-emerald-600 text-white',
      status: 'active',
      headline: 'Mechanical Engineer & STEM Mentor | Physics & Chemistry Specialist',
      bio: 'Graduated top of class in Engineering. I help students achieve A* in IGCSE/Thanaweya Amma Physics and Chemistry by linking theory to real-world engineering experiments and rigorous past-paper practice.',
      hourlyRateMinorUnits: 28000, // 280 EGP
      subjects: ['Physics', 'Chemistry'],
      rating: 4.7,
      reviewCount: 15,
      applicationStatus: 'approved',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-4',
          name: 'Engineering Degree Transcript',
          type: 'Degree Certificate',
          fileName: 'kareem_hassan_bsc_eng.pdf',
          fileSize: '3.1 MB',
          uploadedAt: '2026-01-20T14:00:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-01-20T11:00:00Z',
    },

    // Tutor 4: Programming & Computer Science
    {
      id: 'user-tutor-4',
      username: 'nour',
      password: 'password123',
      role: 'tutor',
      name: 'Nour El-Din Mahmoud',
      email: 'nour.eldin@tutorconnect.demo',
      phone: '+20 115 876 5432',
      avatarColor: 'bg-cyan-600 text-white',
      status: 'active',
      headline: 'Senior Software Engineer | Python, JavaScript & Data Structures Mentor',
      bio: 'Passionate coding tutor who has helped over 100 students build real-world applications and prepare for tech interviews. We write clean code and build projects from day one.',
      hourlyRateMinorUnits: 40000, // 400 EGP
      subjects: ['Programming'],
      rating: 5.0,
      reviewCount: 31,
      applicationStatus: 'approved',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-5',
          name: 'BSc Computer Science Ain Shams University',
          type: 'Degree Certificate',
          fileName: 'nour_cs_degree.pdf',
          fileSize: '1.9 MB',
          uploadedAt: '2026-01-22T08:30:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-01-22T08:00:00Z',
    },

    // Tutor 5: Biology & Chemistry
    {
      id: 'user-tutor-5',
      username: 'mona',
      password: 'password123',
      role: 'tutor',
      name: 'Dr. Mona Youssef',
      email: 'mona.youssef@tutorconnect.demo',
      phone: '+20 122 345 6789',
      avatarColor: 'bg-rose-600 text-white',
      status: 'active',
      headline: 'Medical Doctor & Biology Expert | Human Anatomy & Biochemistry',
      bio: 'Doctor with high honors. I simplify cell biology, genetics, and physiology with 3D models and mnemonics that make high-stakes medical entrance and A-Level exams manageable.',
      hourlyRateMinorUnits: 32000, // 320 EGP
      subjects: ['Biology', 'Chemistry'],
      rating: 4.9,
      reviewCount: 14,
      applicationStatus: 'approved',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-6',
          name: 'Faculty of Medicine Degree',
          type: 'Medical Degree',
          fileName: 'dr_mona_mb_chb.pdf',
          fileSize: '2.8 MB',
          uploadedAt: '2026-01-25T16:00:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-01-25T15:00:00Z',
    },

    // Tutor 6: French & Arabic
    {
      id: 'user-tutor-6',
      username: 'ahmed',
      password: 'password123',
      role: 'tutor',
      name: 'Ahmed Samir',
      email: 'ahmed.samir@tutorconnect.demo',
      phone: '+20 100 456 7890',
      avatarColor: 'bg-amber-600 text-white',
      status: 'active',
      headline: 'Sorbonne Alumnus | French DELF/DALF & Classical Arabic Tutor',
      bio: 'Trilingual educator with 7 years teaching French in international schools. Specializes in communicative French from beginner to advanced C1 levels, plus classical Arabic grammar.',
      hourlyRateMinorUnits: 25000, // 250 EGP
      subjects: ['French', 'Arabic'],
      rating: 4.8,
      reviewCount: 11,
      applicationStatus: 'approved',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-7',
          name: 'DALF C2 Certificate & Sorbonne Diploma',
          type: 'Language Proficiency',
          fileName: 'ahmed_samir_dalf_c2.pdf',
          fileSize: '1.5 MB',
          uploadedAt: '2026-01-28T10:00:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-01-28T09:30:00Z',
    },

    // Tutor 7: Mathematics & Statistics
    {
      id: 'user-tutor-7',
      username: 'dina',
      password: 'password123',
      role: 'tutor',
      name: 'Dina Adel',
      email: 'dina.adel@tutorconnect.demo',
      phone: '+20 112 987 6543',
      avatarColor: 'bg-violet-600 text-white',
      status: 'active',
      headline: 'Statistics & Pure Math Tutor | Actuarial Science Graduate',
      bio: 'Enthusiastic math tutor focusing on statistics, probability, and foundational algebra. Known for patient explanations, step-by-step homework help, and exam simulations.',
      hourlyRateMinorUnits: 38000, // 380 EGP
      subjects: ['Mathematics'],
      rating: 4.6,
      reviewCount: 8,
      applicationStatus: 'approved',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-8',
          name: 'Actuarial Science BSc Certificate',
          type: 'Degree Certificate',
          fileName: 'dina_adel_actuarial.pdf',
          fileSize: '2.1 MB',
          uploadedAt: '2026-02-05T13:00:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-02-05T12:00:00Z',
    },

    // Tutor 8: Pending Applicant (Shows up in Admin Applications review!)
    {
      id: 'user-tutor-8',
      username: 'hany',
      password: 'password123',
      role: 'tutor',
      name: 'Hany Mahmoud',
      email: 'hany.mahmoud@tutorconnect.demo',
      phone: '+20 106 555 4321',
      avatarColor: 'bg-orange-600 text-white',
      status: 'active',
      headline: 'Data Scientist & Machine Learning Instructor | Python, R, SQL',
      bio: 'Master of Science in Artificial Intelligence. Applied as a tutor to deliver practical data science and AI mentorship. Awaiting admin document verification.',
      hourlyRateMinorUnits: 45000, // 450 EGP
      subjects: ['Programming', 'Mathematics'],
      rating: 0,
      reviewCount: 0,
      applicationStatus: 'pending',
      isBookingRestricted: false,
      documents: [
        {
          id: 'doc-9',
          name: 'MSc Artificial Intelligence Degree',
          type: 'Master Degree',
          fileName: 'hany_mahmoud_msc_ai.pdf',
          fileSize: '3.6 MB',
          uploadedAt: '2026-02-18T14:20:00Z',
        },
        {
          id: 'doc-10',
          name: 'National ID & Background Verification',
          type: 'Government ID',
          fileName: 'hany_mahmoud_nid.pdf',
          fileSize: '1.4 MB',
          uploadedAt: '2026-02-18T14:22:00Z',
        },
      ],
      weeklyAvailability: defaultWeeklyAvailability(),
      createdAt: '2026-02-18T14:00:00Z',
    },
  ];

  // Seeded Bookings
  // Student: user-student-1 ('user')
  const tomorrow = getRelativeDate(1);
  const inThreeDays = getRelativeDate(3);
  const yesterday = getRelativeDate(-1);
  const fourDaysAgo = getRelativeDate(-4);
  const lastWeek = getRelativeDate(-7);

  const bookings: Booking[] = [
    // 1. Upcoming session with Dr. Tarek Mansour (Math)
    {
      id: 'booking-seed-1',
      studentId: 'user-student-1',
      studentName: 'Omar Mostafa',
      studentEmail: 'user@tutorconnect.demo',
      tutorId: 'user-tutor-1',
      tutorName: 'Dr. Tarek Mansour',
      tutorEmail: 'tutor@tutorconnect.demo',
      subject: 'Mathematics',
      date: tomorrow,
      startTime: '16:00',
      endTime: '17:00',
      timezone: 'Africa/Cairo (EET / UTC+2)',
      status: 'confirmed',
      paymentMethod: 'credit',
      priceMinorUnits: 35000,
      commissionRatePercent: 10,
      commissionMinorUnits: 3500,
      tutorEarningsMinorUnits: 31500,
      createdAt: `${getRelativeDate(-2)}T10:15:00Z`,
      zoomMeetingId: '984 2145 7701',
      zoomPasscode: 'TUTOR2026',
      zoomJoinUrl: 'https://zoom.us/j/98421457701?pwd=demo',
      reviewed: false,
    },

    // 2. Upcoming session with Nour El-Din (Programming)
    {
      id: 'booking-seed-2',
      studentId: 'user-student-1',
      studentName: 'Omar Mostafa',
      studentEmail: 'user@tutorconnect.demo',
      tutorId: 'user-tutor-4',
      tutorName: 'Nour El-Din Mahmoud',
      tutorEmail: 'nour.eldin@tutorconnect.demo',
      subject: 'Programming',
      date: inThreeDays,
      startTime: '15:00',
      endTime: '16:00',
      timezone: 'Africa/Cairo (EET / UTC+2)',
      status: 'confirmed',
      paymentMethod: 'paymob',
      priceMinorUnits: 40000,
      commissionRatePercent: 10,
      commissionMinorUnits: 4000,
      tutorEarningsMinorUnits: 36000,
      createdAt: `${getRelativeDate(-1)}T18:00:00Z`,
      zoomMeetingId: '812 6543 1190',
      zoomPasscode: 'CODE2026',
      zoomJoinUrl: 'https://zoom.us/j/81265431190?pwd=demo',
      reviewed: false,
    },

    // 3. Completed session with Dr. Tarek Mansour (Physics) - Reviewed
    {
      id: 'booking-seed-3',
      studentId: 'user-student-1',
      studentName: 'Omar Mostafa',
      studentEmail: 'user@tutorconnect.demo',
      tutorId: 'user-tutor-1',
      tutorName: 'Dr. Tarek Mansour',
      tutorEmail: 'tutor@tutorconnect.demo',
      subject: 'Physics',
      date: yesterday,
      startTime: '14:00',
      endTime: '15:00',
      timezone: 'Africa/Cairo (EET / UTC+2)',
      status: 'completed',
      paymentMethod: 'credit',
      priceMinorUnits: 35000,
      commissionRatePercent: 10,
      commissionMinorUnits: 3500,
      tutorEarningsMinorUnits: 31500,
      createdAt: `${getRelativeDate(-5)}T11:00:00Z`,
      zoomMeetingId: '984 2145 7701',
      zoomPasscode: 'TUTOR2026',
      zoomJoinUrl: 'https://zoom.us/j/98421457701?pwd=demo',
      reviewed: true,
    },

    // 4. Completed session with Layla El-Sayed (English) - Not yet reviewed! (Demonstrates review form)
    {
      id: 'booking-seed-4',
      studentId: 'user-student-1',
      studentName: 'Omar Mostafa',
      studentEmail: 'user@tutorconnect.demo',
      tutorId: 'user-tutor-2',
      tutorName: 'Layla El-Sayed',
      tutorEmail: 'layla.elsayed@tutorconnect.demo',
      subject: 'English',
      date: fourDaysAgo,
      startTime: '10:00',
      endTime: '11:00',
      timezone: 'Africa/Cairo (EET / UTC+2)',
      status: 'completed',
      paymentMethod: 'credit',
      priceMinorUnits: 30000,
      commissionRatePercent: 10,
      commissionMinorUnits: 3000,
      tutorEarningsMinorUnits: 27000,
      createdAt: `${getRelativeDate(-8)}T09:30:00Z`,
      zoomMeetingId: '755 9931 0022',
      zoomPasscode: 'ENG2026',
      zoomJoinUrl: 'https://zoom.us/j/75599310022?pwd=demo',
      reviewed: false, // Student can test leaving review!
    },

    // 5. Cancelled session with Eng. Kareem Hassan (Refunded to credit)
    {
      id: 'booking-seed-5',
      studentId: 'user-student-1',
      studentName: 'Omar Mostafa',
      studentEmail: 'user@tutorconnect.demo',
      tutorId: 'user-tutor-3',
      tutorName: 'Eng. Kareem Hassan',
      tutorEmail: 'kareem.hassan@tutorconnect.demo',
      subject: 'Chemistry',
      date: lastWeek,
      startTime: '16:00',
      endTime: '17:00',
      timezone: 'Africa/Cairo (EET / UTC+2)',
      status: 'cancelled',
      paymentMethod: 'credit',
      priceMinorUnits: 28000,
      commissionRatePercent: 10,
      commissionMinorUnits: 2800,
      tutorEarningsMinorUnits: 25200,
      createdAt: `${getRelativeDate(-12)}T14:00:00Z`,
      cancelledAt: `${getRelativeDate(-9)}T11:20:00Z`,
      cancellationReason: 'Schedule conflict with university exam review session',
      zoomMeetingId: '644 1120 4455',
      zoomPasscode: 'STEM2026',
      zoomJoinUrl: 'https://zoom.us/j/64411204455?pwd=demo',
      reviewed: false,
    },
  ];

  // Seeded Transactions Ledger
  // Prompt explicitly requests:
  // "A student opening credit balance of EGP 1,000, represented by a ledger entry."
  // And calculations in integer minor units (1,000 EGP = 100,000 minor units).
  // Balances are derived chronologically from ledger transactions!
  const transactions: Transaction[] = [
    // 1. Initial Opening Credit: +1,000 EGP
    {
      id: 'txn-seed-1',
      timestamp: `${getRelativeDate(-14)}T09:00:00Z`,
      type: 'opening_credit',
      userId: 'user-student-1',
      userName: 'Omar Mostafa',
      amountMinorUnits: 100000, // +1,000.00 EGP
      balanceAfterMinorUnits: 100000,
      description: 'Initial student promo credit balance for platform trial',
      reason: 'Platform welcome promotion',
    },
    // 2. Deduction for session with Kareem: -280 EGP
    {
      id: 'txn-seed-2',
      timestamp: `${getRelativeDate(-12)}T14:00:00Z`,
      type: 'booking_deduction',
      userId: 'user-student-1',
      userName: 'Omar Mostafa',
      amountMinorUnits: -28000, // -280.00 EGP
      balanceAfterMinorUnits: 72000,
      referenceId: 'booking-seed-5',
      description: 'Session payment: Chemistry with Eng. Kareem Hassan',
    },
    // 3. Refund for cancelled session with Kareem: +280 EGP
    {
      id: 'txn-seed-3',
      timestamp: `${getRelativeDate(-9)}T11:20:00Z`,
      type: 'booking_refund',
      userId: 'user-student-1',
      userName: 'Omar Mostafa',
      amountMinorUnits: 28000, // +280.00 EGP
      balanceAfterMinorUnits: 100000,
      referenceId: 'booking-seed-5',
      description: 'Refund for cancelled Chemistry session (before start time)',
      reason: 'Schedule conflict with university exam review session',
    },
    // 4. Deduction for session with Layla: -300 EGP
    {
      id: 'txn-seed-4',
      timestamp: `${getRelativeDate(-8)}T09:30:00Z`,
      type: 'booking_deduction',
      userId: 'user-student-1',
      userName: 'Omar Mostafa',
      amountMinorUnits: -30000, // -300.00 EGP
      balanceAfterMinorUnits: 70000,
      referenceId: 'booking-seed-4',
      description: 'Session payment: English with Layla El-Sayed',
    },
    // 5. Card top-up via Paymob: +500 EGP
    {
      id: 'txn-seed-5',
      timestamp: `${getRelativeDate(-6)}T15:45:00Z`,
      type: 'top_up',
      userId: 'user-student-1',
      userName: 'Omar Mostafa',
      amountMinorUnits: 50000, // +500.00 EGP
      balanceAfterMinorUnits: 120000,
      referenceId: 'paymob_txn_8849102',
      description: 'Wallet top-up via Paymob Card Payment',
      reason: 'Simulated payment transaction #8849102',
    },
    // 6. Deduction for session with Dr. Tarek Mansour (Physics): -350 EGP
    {
      id: 'txn-seed-6',
      timestamp: `${getRelativeDate(-5)}T11:00:00Z`,
      type: 'booking_deduction',
      userId: 'user-student-1',
      userName: 'Omar Mostafa',
      amountMinorUnits: -35000, // -350.00 EGP
      balanceAfterMinorUnits: 85000,
      referenceId: 'booking-seed-3',
      description: 'Session payment: Physics with Dr. Tarek Mansour',
    },
    // 7. Deduction for upcoming session with Dr. Tarek Mansour (Math): -350 EGP
    {
      id: 'txn-seed-7',
      timestamp: `${getRelativeDate(-2)}T10:15:00Z`,
      type: 'booking_deduction',
      userId: 'user-student-1',
      userName: 'Omar Mostafa',
      amountMinorUnits: -35000, // -350.00 EGP
      balanceAfterMinorUnits: 50000, // Current student balance: 500.00 EGP (or 1,000 opening + 500 top-up - 300 - 350 - 350 = 500 EGP)
      referenceId: 'booking-seed-1',
      description: 'Session payment: Mathematics with Dr. Tarek Mansour',
    },
  ];

  // Seeded Reviews
  const reviews: Review[] = [
    {
      id: 'rev-seed-1',
      bookingId: 'booking-seed-3',
      tutorId: 'user-tutor-1',
      studentId: 'user-student-1',
      studentName: 'Omar Mostafa',
      rating: 5,
      comment:
        'Dr. Tarek explained complex electromagnetic mechanics with such clarity and patience! He gave me great practice problems that showed up on my test.',
      createdAt: `${yesterday}T16:15:00Z`,
      status: 'visible',
    },
    {
      id: 'rev-seed-2',
      bookingId: 'booking-seed-other-1',
      tutorId: 'user-tutor-1',
      studentId: 'user-student-2',
      studentName: 'Yasmin Khaled',
      rating: 5,
      comment:
        'One of the best math teachers in Egypt. He genuinely cares about his students understanding the fundamentals.',
      createdAt: `${getRelativeDate(-10)}T14:30:00Z`,
      status: 'visible',
    },
    {
      id: 'rev-seed-3',
      bookingId: 'booking-seed-other-2',
      tutorId: 'user-tutor-4',
      studentId: 'user-student-2',
      studentName: 'Yasmin Khaled',
      rating: 5,
      comment:
        'Nour is incredible at teaching Python from scratch. Loved the interactive coding exercises and quick feedback.',
      createdAt: `${getRelativeDate(-12)}T18:00:00Z`,
      status: 'visible',
    },
  ];

  // Seeded Notifications
  const notifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'user-student-1',
      title: 'Upcoming Session Reminder',
      message: `Your Mathematics session with Dr. Tarek Mansour is scheduled for tomorrow at 16:00 EET.`,
      type: 'booking',
      read: false,
      createdAt: `${getRelativeDate(0)}T08:00:00Z`,
      link: '/student/sessions',
    },
    {
      id: 'notif-2',
      userId: 'user-student-1',
      title: 'Session Completed',
      message: `Your Physics session with Dr. Tarek Mansour was marked as completed. You can leave a review!`,
      type: 'booking',
      read: true,
      createdAt: `${yesterday}T15:30:00Z`,
      link: '/student/sessions',
    },
    {
      id: 'notif-3',
      userId: 'user-tutor-1',
      title: 'New Booking Confirmed',
      message: `Omar Mostafa booked a 60-minute Mathematics session with you for ${tomorrow} at 16:00.`,
      type: 'booking',
      read: false,
      createdAt: `${getRelativeDate(-2)}T10:15:00Z`,
      link: '/tutor/bookings',
    },
    {
      id: 'notif-4',
      userId: 'user-admin-1',
      title: 'New Tutor Application Pending',
      message: `Hany Mahmoud submitted a tutor application for Programming & Mathematics. Verification documents attached.`,
      type: 'system',
      read: false,
      createdAt: `${getRelativeDate(-3)}T14:25:00Z`,
      link: '/admin/applications',
    },
  ];

  // Seeded Audit Logs
  const auditLogs: AuditLog[] = [
    {
      id: 'audit-1',
      actorId: 'user-admin-1',
      actorName: 'Sarah Jenkins (Admin)',
      actorRole: 'admin',
      action: 'APPROVE_TUTOR_APPLICATION',
      targetType: 'user',
      targetId: 'user-tutor-1',
      details: 'Approved Dr. Tarek Mansour after verifying PhD degree certificate and ID card.',
      timestamp: '2026-01-12T10:00:00Z',
    },
    {
      id: 'audit-2',
      actorId: 'user-admin-1',
      actorName: 'Sarah Jenkins (Admin)',
      actorRole: 'admin',
      action: 'UPDATE_COMMISSION_RATE',
      targetType: 'settings',
      targetId: 'commission_rate',
      details: 'Platform commission set to default 10%.',
      timestamp: '2026-01-15T09:00:00Z',
    },
    {
      id: 'audit-3',
      actorId: 'user-student-1',
      actorName: 'Omar Mostafa',
      actorRole: 'student',
      action: 'CANCEL_BOOKING',
      targetType: 'booking',
      targetId: 'booking-seed-5',
      details: 'Student cancelled Chemistry booking before start time. Refunded 280 EGP to platform credit.',
      timestamp: `${getRelativeDate(-9)}T11:20:00Z`,
    },
  ];

  // Seeded Chat Reports (For admin moderation)
  const chatReports: ChatReport[] = [
    {
      id: 'report-1',
      reporterId: 'user-student-2',
      reporterName: 'Yasmin Khaled',
      reportedUserId: 'user-tutor-9',
      reportedUserName: 'Unverified External Inquirer',
      reason: 'Requested direct payment outside platform',
      snippet: 'Hey, if you pay me via Vodafone Cash directly I can give you a 20% discount instead of using the site.',
      status: 'pending',
      timestamp: `${getRelativeDate(-2)}T12:45:00Z`,
    },
    {
      id: 'report-2',
      reporterId: 'user-tutor-1',
      reporterName: 'Dr. Tarek Mansour',
      reportedUserId: 'user-student-99',
      reportedUserName: 'Test Inactive Account',
      reason: 'Spam messages requesting exam answer key',
      snippet: 'Can you take my final calculus exam for me online tomorrow? Will pay double.',
      status: 'resolved',
      adminNote: 'Warned user regarding academic honesty policy.',
      timestamp: `${getRelativeDate(-5)}T16:20:00Z`,
    },
  ];

  return {
    users,
    bookings,
    transactions,
    reviews,
    notifications,
    auditLogs,
    chatReports,
    settings: INITIAL_SETTINGS,
  };
};
