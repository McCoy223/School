export type UserRole = 'student' | 'parent' | 'faculty';
export type AppPage = 'dashboard' | 'admin' | 'sms' | 'students' | 'teachers';

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: 'Sciences & Mathematics' | 'Humanities & Social Sciences' | 'World Languages' | 'Fine & Performing Arts' | 'Athletics & Physical Education';
  email: string;
  officeRoom: string;
  officeHours: string;
  phone: string;
  bio: string;
  education: string[];
  coursesTaught: string[];
  consultationAvailable: boolean;
  avatarColor: string;
}

export type EventCategory = 'academic' | 'athletics' | 'arts' | 'community' | 'admissions' | 'pta';

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "18:00 - 20:30"
  location: string;
  building: string;
  organizer: string;
  rsvpCount: number;
  userRsvpd: boolean;
  isPublic: boolean;
  targetAudience: 'all' | 'students' | 'parents' | 'faculty';
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  instructor: string;
  instructorId: string;
  room: string;
  schedule: string;
  credits: number;
  currentGrade: number;
  letterGrade: string;
  syllabusUrl?: string;
  announcementsCount: number;
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  dueDate: string;
  totalPoints: number;
  earnedPoints?: number;
  status: 'pending' | 'submitted' | 'graded';
  instructions: string;
  submittedAt?: string;
  submittedNote?: string;
  feedback?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  gpa: number;
  advisor: string;
  attendanceRate: number;
  email: string;
  counselor: string;
  creditsEarned: number;
  creditsRequired: number;
}

export interface AttendanceItem {
  date: string;
  period: string;
  subject: string;
  status: 'Present' | 'Excused' | 'Late' | 'Absent';
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  date: string;
  category: 'Academics' | 'Campus Alert' | 'Student Life' | 'Arts & Athletics';
  urgent: boolean;
  author: string;
  content: string;
}

export interface TuitionStatement {
  term: string;
  tuitionTotal: number;
  scholarshipAid: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  status: 'Paid in Full' | 'Pending Installment' | 'Past Due';
  invoices: {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Open';
  }[];
}

export interface SiteSettings {
  schoolName: string;
  motto: string;
  foundedYear: number;
  heroHeadline: string;
  heroSubtitle: string;
  termName: string;
  admissionsDeadline: string;
  visitingHours: string;
  campusAddress: string;
  phone: string;
  emergencyPhone: string;
  topRibbonAlert: string;
  accreditationText: string;
}

export interface AdmissionsInquiry {
  id: string;
  applicantName: string;
  gradeLevel: string;
  parentName: string;
  parentEmail: string;
  inquiryNotes: string;
  status: 'new' | 'contacted' | 'tour-scheduled' | 'archived';
  submittedAt: string;
}

export interface QuickStat {
  label: string;
  value: string;
  detail: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  division: 'Lower School' | 'Middle School' | 'Upper School';
  dateOfBirth: string;
  enrollmentStatus: 'Active' | 'On Leave' | 'Pending Review' | 'Graduated';
  gpa: number;
  attendanceRate: number;
  advisor: string;
  parentGuardian: string;
  parentEmail: string;
  emergencyPhone: string;
  tuitionBalance: number;
  medicalNotes: string;
  enrolledCourses: string[];
}

export interface StaffRecord {
  id: string;
  name: string;
  staffId: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  assignedCourses: string[];
  teachingPeriodsPerWeek: number;
  status: 'Active' | 'On Sabbatical';
}

export interface AttendanceRollEntry {
  studentId: string;
  studentName: string;
  status: 'Present' | 'Late' | 'Excused' | 'Absent';
  note?: string;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  term: string;
  paidDate?: string;
}

export interface ReportCardGrade {
  courseCode: string;
  courseName: string;
  gradePercent: number;
  letterGrade: string;
  credits: number;
  instructor: string;
  comments: string;
}

export interface ReportCardData {
  studentId: string;
  studentName: string;
  grade: string;
  term: string;
  academicYear: string;
  grades: ReportCardGrade[];
  attendancePercent: number;
  termGPA: number;
  cumulativeGPA: number;
  honorsStatus: string;
  deanRemarks: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  room: string;
}

export interface ClassStudentResult {
  studentId: string;
  studentName: string;
  score: number; // 0 - 100
  letterGrade: string; // A+, A, A-, B+, etc.
  remarks: string;
}

export interface TeacherResultUploadBatch {
  id: string;
  teacherId: string;
  teacherName: string;
  courseCode: string;
  courseName: string;
  term: string;
  assessmentTitle: string;
  assessmentType: 'Midterm Exam' | 'Final Exam' | 'Term Assessment' | 'Coursework Project' | 'Laboratory Practical';
  uploadedAt: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  totalStudents: number;
  status: 'Published' | 'Pending Review';
  records: ClassStudentResult[];
}


