import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  Printer,
  X,
  Send,
  Building,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import {
  StudentRecord,
  StaffRecord,
  FeeInvoice,
  TimetableSlot,
  Course,
  ReportCardData,
  AttendanceRollEntry
} from '../types';

interface SchoolManagementSystemProps {
  students: StudentRecord[];
  onAddStudent: (student: Omit<StudentRecord, 'id' | 'studentId' | 'attendanceRate' | 'gpa'>) => void;
  onUpdateStudent: (student: StudentRecord) => void;
  onDeleteStudent: (studentId: string) => void;
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id' | 'currentGrade' | 'letterGrade' | 'announcementsCount'>) => void;
  staff: StaffRecord[];
  onAddStaff: (staff: Omit<StaffRecord, 'id' | 'staffId'>) => void;
  invoices: FeeInvoice[];
  onAddInvoice: (invoice: Omit<FeeInvoice, 'id' | 'status'>) => void;
  onRecordPayment: (invoiceId: string) => void;
  timetable: TimetableSlot[];
  onAddTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  onUpdateCourseGrade: (courseId: string, newGrade: number) => void;
  onExitToPublicSite: () => void;
}

export const SchoolManagementSystem: React.FC<SchoolManagementSystemProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  courses,
  onAddCourse,
  staff,
  onAddStaff,
  invoices,
  onAddInvoice,
  onRecordPayment,
  timetable,
  onAddTimetableSlot,
  onUpdateCourseGrade,
  onExitToPublicSite
}) => {
  // Navigation tabs in SMS
  const [smsTab, setSmsTab] = useState<'overview' | 'students' | 'attendance' | 'courses' | 'gradebook' | 'finance' | 'staff' | 'timetable' | 'broadcast'>('overview');

  // Search & filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<StudentRecord | null>(null);

  // Student Enrollment Modal
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    grade: 'Grade 9',
    division: 'Upper School' as StudentRecord['division'],
    dateOfBirth: '2011-05-14',
    advisor: 'Dr. Arthur Vance',
    parentGuardian: '',
    parentEmail: '',
    emergencyPhone: '',
    tuitionBalance: 18500,
    medicalNotes: 'No restrictions on file.',
    enrolledCourses: ['PHYS-401', 'ENG-320']
  });

  // Daily Attendance Roll Call State
  const [attendanceDate, setAttendanceDate] = useState('2026-10-21');
  const [attendancePeriod, setAttendancePeriod] = useState('Period 1 (08:45 - 09:55) · AP Physics C');
  const [rollEntries, setRollEntries] = useState<Record<string, 'Present' | 'Late' | 'Excused' | 'Absent'>>({
    'stu-101': 'Present',
    'stu-102': 'Present',
    'stu-103': 'Present',
    'stu-104': 'Present',
    'stu-105': 'Late',
    'stu-106': 'Present',
    'stu-107': 'Present',
    'stu-108': 'Present'
  });
  const [attendanceCommitted, setAttendanceCommitted] = useState(false);

  // Course creation modal
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    department: 'Sciences & Mathematics',
    instructor: 'Dr. Arthur Vance',
    instructorId: 'fac-1',
    room: 'Science Hall 304',
    schedule: 'Mon / Wed / Fri 08:45 - 09:55',
    credits: 1.0
  });
  const [selectedCourseRoster, setSelectedCourseRoster] = useState<Course | null>(null);

  // Report Card Generator Modal
  const [reportCardStudent, setReportCardStudent] = useState<StudentRecord | null>(null);

  // Fee Invoice Creation Modal
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: 'SA-2027-449',
    studentName: 'Liam Montgomery',
    description: '',
    amount: 1500,
    dueDate: '2026-11-20',
    term: 'Term II 2026'
  });

  // Printable Receipt Modal
  const [receiptInvoice, setReceiptInvoice] = useState<FeeInvoice | null>(null);

  // Broadcast Message State
  const [broadcastTarget, setBroadcastTarget] = useState('All Academy Families');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastSentNotice, setBroadcastSentNotice] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState<{ id: string; target: string; subject: string; time: string }[]>([
    {
      id: 'bc-1',
      target: 'Upper School Families',
      subject: 'Midterm Examination Schedule & Extended Library Hours',
      time: '2026-10-18 14:30'
    },
    {
      id: 'bc-2',
      target: 'All Academy Community',
      subject: 'Annual Candlelight Lessons and Carols Festival Registration',
      time: '2026-10-15 09:00'
    }
  ]);

  // Timetable day filter
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('All');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter || s.division === gradeFilter;
      const q = studentSearch.toLowerCase().trim();
      if (!q) return matchGrade;
      const matchQuery =
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.advisor.toLowerCase().includes(q) ||
        s.parentGuardian.toLowerCase().includes(q);
      return matchGrade && matchQuery;
    });
  }, [students, gradeFilter, studentSearch]);

  // Financial metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = totalBilled - totalPaid;
  const collectionEfficiency = totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : '100';

  // Handle Enrollment
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.parentEmail) return;

    onAddStudent({
      name: newStudentForm.name,
      grade: newStudentForm.grade,
      division: newStudentForm.division,
      dateOfBirth: newStudentForm.dateOfBirth,
      enrollmentStatus: 'Active',
      advisor: newStudentForm.advisor,
      parentGuardian: newStudentForm.parentGuardian,
      parentEmail: newStudentForm.parentEmail,
      emergencyPhone: newStudentForm.emergencyPhone,
      tuitionBalance: Number(newStudentForm.tuitionBalance) || 0,
      medicalNotes: newStudentForm.medicalNotes,
      enrolledCourses: newStudentForm.enrolledCourses
    });

    setIsEnrollModalOpen(false);
    setNewStudentForm({
      name: '',
      grade: 'Grade 9',
      division: 'Upper School',
      dateOfBirth: '2011-05-14',
      advisor: 'Dr. Arthur Vance',
      parentGuardian: '',
      parentEmail: '',
      emergencyPhone: '',
      tuitionBalance: 18500,
      medicalNotes: 'No restrictions on file.',
      enrolledCourses: ['PHYS-401', 'ENG-320']
    });
  };

  // Handle Attendance Commit
  const handleCommitRoll = () => {
    setAttendanceCommitted(true);
    setTimeout(() => setAttendanceCommitted(false), 2500);
  };

  // Handle Add Course
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.code || !courseForm.name) return;
    onAddCourse({
      code: courseForm.code,
      name: courseForm.name,
      department: courseForm.department,
      instructor: courseForm.instructor,
      instructorId: courseForm.instructorId,
      room: courseForm.room,
      schedule: courseForm.schedule,
      credits: Number(courseForm.credits) || 1.0
    });
    setIsAddCourseModalOpen(false);
    setCourseForm({
      code: '',
      name: '',
      department: 'Sciences & Mathematics',
      instructor: 'Dr. Arthur Vance',
      instructorId: 'fac-1',
      room: 'Science Hall 304',
      schedule: 'Mon / Wed / Fri 08:45 - 09:55',
      credits: 1.0
    });
  };

  // Handle Add Invoice
  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.description) return;
    onAddInvoice({
      studentId: invoiceForm.studentId,
      studentName: invoiceForm.studentName,
      description: invoiceForm.description,
      amount: Number(invoiceForm.amount) || 0,
      dueDate: invoiceForm.dueDate,
      term: invoiceForm.term
    });
    setIsAddInvoiceModalOpen(false);
    setInvoiceForm({
      studentId: 'SA-2027-449',
      studentName: 'Liam Montgomery',
      description: '',
      amount: 1500,
      dueDate: '2026-11-20',
      term: 'Term II 2026'
    });
  };

  // Handle Broadcast Dispatch
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastBody) return;
    const newEntry = {
      id: `bc-${Date.now()}`,
      target: broadcastTarget,
      subject: broadcastSubject,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setBroadcastLog([newEntry, ...broadcastLog]);
    setBroadcastSentNotice(true);
    setTimeout(() => {
      setBroadcastSentNotice(false);
      setBroadcastSubject('');
      setBroadcastBody('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 pb-16">
      
      {/* Enterprise System Top Bar */}
      <div className="bg-stone-950 text-white border-b border-stone-800 sticky top-18 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-sm shadow-sm">
                SIS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-serif font-bold text-white tracking-tight">
                    St. Andrew's Academy SIS & School Management System
                  </h1>
                  <span className="text-[10px] font-mono bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded border border-stone-700">
                    v4.2 Production
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Term I (2026–2027) · Academic Registrar & Chancellor Console
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onExitToPublicSite}
                className="px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Public Academy Site</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Module Nav Tabs (Single-line controls adhering to Section 1A) */}
          <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-800 text-xs">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
              { id: 'students', label: `Student Registry (${students.length})`, icon: GraduationCap },
              { id: 'attendance', label: 'Daily Roll Call', icon: UserCheck },
              { id: 'courses', label: `Course Catalog (${courses.length})`, icon: BookOpen },
              { id: 'gradebook', label: 'Gradebook & Transcripts', icon: Award },
              { id: 'finance', label: 'Finance & Billing', icon: DollarSign },
              { id: 'staff', label: `Staff HR (${staff.length})`, icon: Users },
              { id: 'timetable', label: 'Master Timetable', icon: Calendar },
              { id: 'broadcast', label: 'Communications Desk', icon: Send }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSmsTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    smsTab === tab.id
                      ? 'bg-amber-100 text-stone-950 font-bold shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-850'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ======================================================== */}
        {/* MODULE 1: EXECUTIVE DASHBOARD OVERVIEW */}
        {/* ======================================================== */}
        {smsTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Operational Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Enrolled Scholars</span>
                  <GraduationCap className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
                  {students.length * 85} <span className="text-xs font-normal text-stone-500">students</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  100% capacity · K–12 continuum
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Today's Attendance</span>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
                  98.4%
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-1">
                  Exceeds 97.5% accreditation benchmark
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Tuition Collection</span>
                  <DollarSign className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
                  {collectionEfficiency}%
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  ${totalPaid.toLocaleString()} collected of ${totalBilled.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Active Faculty Load</span>
                  <Users className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
                  8.1 : 1
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Avg 16.4 teaching periods / week
                </div>
              </div>
            </div>

            {/* Quick Actions & Live Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 cols): Today's Schedule & Quick Enrollment */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h3 className="text-base font-serif font-bold text-stone-950">
                      Master Period Schedule (Today · Wednesday)
                    </h3>
                    <button
                      onClick={() => setSmsTab('timetable')}
                      className="text-xs text-stone-600 hover:text-stone-900 font-medium underline"
                    >
                      Full Week View
                    </button>
                  </div>

                  <div className="divide-y divide-stone-200 mt-3 text-xs">
                    {timetable.slice(0, 5).map(slot => (
                      <div key={slot.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-semibold text-stone-900">{slot.courseName}</span>
                          <div className="text-stone-500 text-[11px] mt-0.5">
                            {slot.courseCode} · Instructor: {slot.instructor}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-stone-800">{slot.period}</span>
                          <div className="text-stone-500 text-[11px]">{slot.room}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
                  <h3 className="text-base font-serif font-bold text-stone-950 mb-1">
                    Quick Operational Workflows
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Fast access to key registrar, bursar, and instructional tasks.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <button
                      onClick={() => {
                        setSmsTab('students');
                        setIsEnrollModalOpen(true);
                      }}
                      className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-stone-700 mb-1.5" />
                      <div className="font-semibold text-stone-900">Enroll Student</div>
                      <div className="text-[11px] text-stone-500">New scholar admission</div>
                    </button>

                    <button
                      onClick={() => setSmsTab('attendance')}
                      className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-stone-700 mb-1.5" />
                      <div className="font-semibold text-stone-900">Take Roll Call</div>
                      <div className="text-[11px] text-stone-500">Period attendance</div>
                    </button>

                    <button
                      onClick={() => {
                        setSmsTab('finance');
                        setIsAddInvoiceModalOpen(true);
                      }}
                      className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 text-stone-700 mb-1.5" />
                      <div className="font-semibold text-stone-900">Issue Fee Invoice</div>
                      <div className="text-[11px] text-stone-500">Tuition & lab fees</div>
                    </button>

                    <button
                      onClick={() => setSmsTab('gradebook')}
                      className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-stone-700 mb-1.5" />
                      <div className="font-semibold text-stone-900">Issue Report Card</div>
                      <div className="text-[11px] text-stone-500">Term I grades & GPA</div>
                    </button>

                    <button
                      onClick={() => setSmsTab('broadcast')}
                      className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-stone-700 mb-1.5" />
                      <div className="font-semibold text-stone-900">Send Broadcast</div>
                      <div className="text-[11px] text-stone-500">Dispatch alerts</div>
                    </button>

                    <button
                      onClick={() => setSmsTab('courses')}
                      className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-stone-700 mb-1.5" />
                      <div className="font-semibold text-stone-900">Course Roster</div>
                      <div className="text-[11px] text-stone-500">Enrollment seats</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Critical Alerts & Financial Receivables */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h3 className="text-base font-serif font-bold text-stone-950">
                      Bursar Account Receivables
                    </h3>
                    <span className="text-xs font-semibold text-amber-800">
                      ${totalOutstanding.toLocaleString()} Outstanding
                    </span>
                  </div>

                  <div className="space-y-3 mt-4 text-xs">
                    {invoices.filter(i => i.status !== 'Paid').map(inv => (
                      <div key={inv.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-stone-900">{inv.studentName}</span>
                          <div className="text-stone-500 text-[11px]">{inv.description}</div>
                          <div className="text-[10px] text-stone-400">Due: {inv.dueDate}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-stone-950 tabular-nums">
                            ${inv.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => onRecordPayment(inv.id)}
                            className="block mt-1 px-2.5 py-0.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Collect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <div className="font-semibold text-amber-950 mb-1">
                    Accreditation & Census Reporting:
                  </div>
                  <div>
                    All student enrollment records, attendance logs, and academic transcripts generated in this system are validated according to NEASC and IB continuum reporting standards.
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 2: STUDENT INFORMATION SYSTEM (SIS) */}
        {/* ======================================================== */}
        {smsTab === 'students' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Student Information Registry (SIS)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Complete official student census, academic records, and emergency guardians.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll New Student</span>
                </button>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student by name, student ID, or advisor..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 text-[11px] font-semibold uppercase">Division / Grade:</span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-stone-200 rounded-md bg-white text-stone-800"
                >
                  <option value="All">All Divisions (K–12)</option>
                  <option value="Upper School">Upper School (9–12)</option>
                  <option value="Middle School">Middle School (6–8)</option>
                  <option value="Lower School">Lower School (K–5)</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                </select>
              </div>
            </div>

            {/* Student Table */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="p-3">Student Name & ID</th>
                    <th className="p-3">Grade Level</th>
                    <th className="p-3">Academic Advisor</th>
                    <th className="p-3">Cumulative GPA</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Tuition Balance</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-stone-50/50">
                      <td className="p-3">
                        <div className="font-semibold text-stone-900">{student.name}</div>
                        <div className="text-stone-500 text-[11px] font-mono">{student.studentId}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-stone-800">{student.grade}</span>
                        <div className="text-[11px] text-stone-500">{student.division}</div>
                      </td>
                      <td className="p-3 text-stone-700">
                        {student.advisor}
                      </td>
                      <td className="p-3 font-serif font-bold text-stone-950 tabular-nums">
                        {student.gpa.toFixed(2)}
                      </td>
                      <td className="p-3 text-stone-700 tabular-nums">
                        {student.attendanceRate}%
                      </td>
                      <td className="p-3 tabular-nums">
                        {student.tuitionBalance === 0 ? (
                          <span className="text-emerald-700 font-semibold">Paid in Full</span>
                        ) : (
                          <span className="text-amber-800 font-semibold">${student.tuitionBalance.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudentForDossier(student)}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium text-[11px] cursor-pointer"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={() => setReportCardStudent(student)}
                            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium text-[11px] cursor-pointer"
                          >
                            Report Card
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Student Dossier Modal */}
            {selectedStudentForDossier && (
              <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-xl w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-start justify-between pb-4 border-b border-stone-200">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Official Academic Dossier
                      </div>
                      <h3 className="text-xl font-serif font-bold text-stone-950 mt-0.5">
                        {selectedStudentForDossier.name}
                      </h3>
                      <div className="text-xs text-stone-600 mt-0.5 font-mono">
                        ID: {selectedStudentForDossier.studentId} · {selectedStudentForDossier.grade} ({selectedStudentForDossier.division})
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudentForDossier(null)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="py-4 space-y-4 text-xs text-stone-700">
                    <div className="grid grid-cols-2 gap-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div>
                        <span className="font-semibold text-stone-900 block mb-0.5">Date of Birth</span>
                        <span>{selectedStudentForDossier.dateOfBirth}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 block mb-0.5">Enrollment Status</span>
                        <span className="text-emerald-700 font-semibold">{selectedStudentForDossier.enrollmentStatus}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 block mb-0.5">Faculty Advisor</span>
                        <span>{selectedStudentForDossier.advisor}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 block mb-0.5">Academic Standing</span>
                        <span>{selectedStudentForDossier.gpa.toFixed(2)} GPA · {selectedStudentForDossier.attendanceRate}% Attd</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1">Guardian & Contact Information</h4>
                      <p><strong>Parents / Guardians:</strong> {selectedStudentForDossier.parentGuardian}</p>
                      <p><strong>Email:</strong> {selectedStudentForDossier.parentEmail}</p>
                      <p><strong>Emergency Telephone:</strong> {selectedStudentForDossier.emergencyPhone}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1">Medical & Dietary Records</h4>
                      <p className="p-2.5 bg-stone-50 rounded border border-stone-200">
                        {selectedStudentForDossier.medicalNotes}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1">Enrolled Academic Courses</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStudentForDossier.enrolledCourses.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-stone-100 rounded border border-stone-200 text-stone-800 font-mono text-[11px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedStudentForDossier(null)}
                      className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md"
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enroll New Student Modal */}
            {isEnrollModalOpen && (
              <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h4 className="text-base font-serif font-bold text-stone-950">
                      Enroll New Student Scholar
                    </h4>
                    <button
                      onClick={() => setIsEnrollModalOpen(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleEnrollSubmit} className="py-4 space-y-3.5 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Full Student Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Charlotte Davenport"
                        value={newStudentForm.name}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Grade Level</label>
                        <select
                          value={newStudentForm.grade}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, grade: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                        >
                          <option>Grade 9</option>
                          <option>Grade 10</option>
                          <option>Grade 11</option>
                          <option>Grade 12</option>
                          <option>Grade 8</option>
                          <option>Grade 7</option>
                          <option>Grade 6</option>
                          <option>Grade 5</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Academic Division</label>
                        <select
                          value={newStudentForm.division}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, division: e.target.value as any })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                        >
                          <option value="Upper School">Upper School (9–12)</option>
                          <option value="Middle School">Middle School (6–8)</option>
                          <option value="Lower School">Lower School (K–5)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          required
                          value={newStudentForm.dateOfBirth}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, dateOfBirth: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Faculty Advisor</label>
                        <input
                          type="text"
                          required
                          value={newStudentForm.advisor}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, advisor: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Parents / Guardians</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Richard & Sarah Davenport"
                          value={newStudentForm.parentGuardian}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, parentGuardian: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Parent Email</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. r.davenport@example.com"
                          value={newStudentForm.parentEmail}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, parentEmail: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Emergency Phone</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. (555) 714-9988"
                          value={newStudentForm.emergencyPhone}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, emergencyPhone: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Initial Tuition Balance ($)</label>
                        <input
                          type="number"
                          value={newStudentForm.tuitionBalance}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, tuitionBalance: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Health / Allergy Restrictions</label>
                      <input
                        type="text"
                        value={newStudentForm.medicalNotes}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, medicalNotes: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEnrollModalOpen(false)}
                        className="px-3 py-2 text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md cursor-pointer"
                      >
                        Confirm Enrollment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 3: DAILY ATTENDANCE & PERIOD ROLL CALL */}
        {/* ======================================================== */}
        {smsTab === 'attendance' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Daily Period Roll Call & Attendance System
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Record period-by-period class attendance and broadcast immediate absentee notifications.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const allP: Record<string, 'Present' | 'Late' | 'Excused' | 'Absent'> = {};
                    students.forEach(s => allP[s.id] = 'Present');
                    setRollEntries(allP);
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-md cursor-pointer"
                >
                  Mark All Present
                </button>
                <button
                  onClick={handleCommitRoll}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md shadow-xs cursor-pointer"
                >
                  Commit Attendance
                </button>
              </div>
            </div>

            {/* Attendance Session Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Session Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Period & Instructional Course</label>
                <select
                  value={attendancePeriod}
                  onChange={(e) => setAttendancePeriod(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs"
                >
                  <option>Period 1 (08:45 - 09:55) · AP Physics C: Mechanics</option>
                  <option>Period 2 (10:15 - 11:25) · AP English Literature</option>
                  <option>Period 3 (13:00 - 14:15) · Constitutional Law</option>
                  <option>Period 4 (14:30 - 15:45) · Symphony Orchestra Masterclass</option>
                </select>
              </div>
            </div>

            {attendanceCommitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Attendance roll call for <strong>{attendancePeriod}</strong> on {attendanceDate} has been committed to the central registrar.</span>
              </div>
            )}

            {/* Student Roll Table */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="p-3">Scholar</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Recorded Status</th>
                    <th className="p-3 text-right">Quick Marking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {students.map(s => {
                    const currentStatus = rollEntries[s.id] || 'Present';
                    return (
                      <tr key={s.id} className="hover:bg-stone-50/50">
                        <td className="p-3 font-semibold text-stone-900">
                          {s.name} <span className="font-mono font-normal text-stone-400">({s.studentId})</span>
                        </td>
                        <td className="p-3 text-stone-600">{s.grade}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            currentStatus === 'Present' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            currentStatus === 'Late' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            currentStatus === 'Excused' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                            'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {currentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex rounded-md shadow-xs" role="group">
                            {(['Present', 'Late', 'Excused', 'Absent'] as const).map(st => (
                              <button
                                key={st}
                                onClick={() => setRollEntries({ ...rollEntries, [s.id]: st })}
                                className={`px-2.5 py-1 text-[11px] font-medium border border-stone-200 first:rounded-l-md last:rounded-r-md transition-colors cursor-pointer ${
                                  currentStatus === st
                                    ? 'bg-stone-900 text-white font-semibold'
                                    : 'bg-white text-stone-700 hover:bg-stone-100'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 4: COURSE CATALOG & CLASS ROSTERS */}
        {/* ======================================================== */}
        {smsTab === 'courses' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Course Offerings & Curricular Catalog
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Academic course codes, room allocations, instructor load, and enrolled scholar rosters.
                </p>
              </div>

              <button
                onClick={() => setIsAddCourseModalOpen(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(crs => (
                <div key={crs.id} className="p-5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-mono font-bold text-stone-900">{crs.code}</span>
                      <span>{crs.credits} Credit</span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-stone-950">{crs.name}</h4>
                    <p className="text-xs text-stone-600 mt-0.5">{crs.department}</p>
                    
                    <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700 space-y-1">
                      <div><strong>Faculty:</strong> {crs.instructor}</div>
                      <div><strong>Room:</strong> {crs.room}</div>
                      <div><strong>Schedule:</strong> {crs.schedule}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-500">18 scholars enrolled</span>
                    <button
                      onClick={() => setSelectedCourseRoster(crs)}
                      className="text-xs text-stone-900 font-semibold underline hover:text-stone-700 cursor-pointer"
                    >
                      Class Roster →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Course Roster Modal */}
            {selectedCourseRoster && (
              <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <h4 className="text-base font-serif font-bold text-stone-950">
                        {selectedCourseRoster.name} ({selectedCourseRoster.code})
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Instructor: {selectedCourseRoster.instructor} · Room: {selectedCourseRoster.room}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedCourseRoster(null)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="py-4 space-y-2 max-h-80 overflow-y-auto text-xs">
                    {students.slice(0, 5).map(s => (
                      <div key={s.id} className="p-2.5 rounded bg-stone-50 border border-stone-200 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-stone-900">{s.name}</span>
                          <span className="text-stone-400 font-mono ml-2">({s.studentId})</span>
                        </div>
                        <span className="text-stone-600 font-medium">{s.grade}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end">
                    <button
                      onClick={() => setSelectedCourseRoster(null)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded"
                    >
                      Close Roster
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Course Modal */}
            {isAddCourseModalOpen && (
              <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h4 className="text-base font-serif font-bold text-stone-950">
                      Create Academic Course Offering
                    </h4>
                    <button
                      onClick={() => setIsAddCourseModalOpen(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddCourseSubmit} className="py-4 space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Course Code</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. BIO-410"
                          value={courseForm.code}
                          onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Academic Department</label>
                        <select
                          value={courseForm.department}
                          onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                        >
                          <option>Sciences & Mathematics</option>
                          <option>Humanities & Social Sciences</option>
                          <option>World Languages</option>
                          <option>Fine & Performing Arts</option>
                          <option>Athletics & Physical Education</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Course Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AP Biology & Molecular Genetics"
                        value={courseForm.name}
                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Lead Instructor</label>
                        <input
                          type="text"
                          required
                          value={courseForm.instructor}
                          onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Assigned Room</label>
                        <input
                          type="text"
                          required
                          value={courseForm.room}
                          onChange={(e) => setCourseForm({ ...courseForm, room: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Weekly Schedule</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tue / Thu 13:00 - 14:30"
                          value={courseForm.schedule}
                          onChange={(e) => setCourseForm({ ...courseForm, schedule: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Credits</label>
                        <input
                          type="number"
                          step="0.5"
                          value={courseForm.credits}
                          onChange={(e) => setCourseForm({ ...courseForm, credits: Number(e.target.value) || 1.0 })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddCourseModalOpen(false)}
                        className="px-3 py-2 text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md cursor-pointer"
                      >
                        Create Course
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 5: GRADEBOOK & REPORT CARD GENERATOR */}
        {/* ======================================================== */}
        {smsTab === 'gradebook' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Gradebook & Term Report Card Engine
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Term I GPA calculations, honors roll eligibility, and official transcript generation.
                </p>
              </div>
            </div>

            {/* Student selection for Report Cards */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="p-3">Scholar</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Term GPA</th>
                    <th className="p-3">Honor Standing</th>
                    <th className="p-3 text-right">Official Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {students.map(s => {
                    const honor = s.gpa >= 3.95 ? 'Summa Cum Laude' : s.gpa >= 3.85 ? 'Dean\'s Honor Roll' : 'Good Standing';
                    return (
                      <tr key={s.id} className="hover:bg-stone-50/50">
                        <td className="p-3">
                          <span className="font-semibold text-stone-900">{s.name}</span>
                          <span className="text-stone-400 font-mono ml-2">({s.studentId})</span>
                        </td>
                        <td className="p-3 text-stone-600">{s.grade}</td>
                        <td className="p-3 font-serif font-bold text-stone-950 tabular-nums">
                          {s.gpa.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            honor === 'Summa Cum Laude' ? 'bg-amber-100 text-amber-900' :
                            honor === 'Dean\'s Honor Roll' ? 'bg-emerald-50 text-emerald-900' :
                            'bg-stone-100 text-stone-700'
                          }`}>
                            {honor}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setReportCardStudent(s)}
                            className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Generate Report Card
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Official Report Card Modal */}
            {reportCardStudent && (
              <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-stone-300 shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Institutional Header */}
                  <div className="text-center pb-6 border-b-2 border-stone-900">
                    <div className="text-2xl font-serif font-bold text-stone-950 tracking-tight">
                      ST. ANDREW'S ACADEMY
                    </div>
                    <div className="text-xs uppercase tracking-widest text-stone-600 mt-0.5">
                      Term I Academic Performance & Scholastic Report Card
                    </div>
                    <div className="text-[11px] text-stone-500 italic mt-0.5">
                      Academic Session: Fall Term 2026–2027
                    </div>
                  </div>

                  {/* Scholar Info */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-b border-stone-200 text-xs">
                    <div>
                      <p><strong>Student:</strong> {reportCardStudent.name}</p>
                      <p><strong>Student ID:</strong> {reportCardStudent.studentId}</p>
                      <p><strong>Grade:</strong> {reportCardStudent.grade} ({reportCardStudent.division})</p>
                    </div>
                    <div>
                      <p><strong>Term GPA:</strong> {reportCardStudent.gpa.toFixed(2)}</p>
                      <p><strong>Attendance:</strong> {reportCardStudent.attendanceRate}%</p>
                      <p><strong>Faculty Advisor:</strong> {reportCardStudent.advisor}</p>
                    </div>
                  </div>

                  {/* Grades Table */}
                  <div className="py-4">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-100 font-semibold text-stone-800">
                        <tr>
                          <th className="p-2">Course Code & Name</th>
                          <th className="p-2">Instructor</th>
                          <th className="p-2">Score</th>
                          <th className="p-2 text-right">Letter Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {courses.map(c => (
                          <tr key={c.id}>
                            <td className="p-2 font-medium text-stone-900">{c.code}: {c.name}</td>
                            <td className="p-2 text-stone-600">{c.instructor}</td>
                            <td className="p-2 tabular-nums text-stone-800">{c.currentGrade}%</td>
                            <td className="p-2 text-right font-bold text-stone-950">{c.letterGrade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Dean's Remarks & Honors */}
                  <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-1 mt-2">
                    <div className="font-semibold text-stone-900">Academic Standing & Honors Status:</div>
                    <p>
                      {reportCardStudent.gpa >= 3.90
                        ? 'Dean\'s High Honors List. Outstanding mastery across Advanced Placement curricula, laboratory research, and Harkness dialogue.'
                        : 'Satisfactory Academic Progress in Good Standing.'}
                    </p>
                  </div>

                  {/* Signature line */}
                  <div className="pt-6 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                    <div>
                      <span className="font-serif italic font-bold text-stone-900 block">Dr. Elizabeth Harrington</span>
                      <span>Head of School</span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif italic font-bold text-stone-900 block">Eleanor Sterling, M.A.</span>
                      <span>Academic Dean</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-stone-200 flex justify-end gap-3 print:hidden">
                    <button
                      onClick={() => setReportCardStudent(null)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Official Report Card</span>
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 6: FINANCE & BURSAR BILLING */}
        {/* ======================================================== */}
        {smsTab === 'finance' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Bursar Office & Tuition Account Ledger
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track student accounts, generate fee statements, and record payments.
                </p>
              </div>

              <button
                onClick={() => setIsAddInvoiceModalOpen(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Fee Invoice</span>
              </button>
            </div>

            {/* Financial Overview KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-xs font-semibold uppercase text-stone-500">Total Billed</span>
                <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums mt-0.5">
                  ${totalBilled.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-xs font-semibold uppercase text-stone-500">Collected Revenue</span>
                <div className="text-2xl font-serif font-bold text-emerald-800 tabular-nums mt-0.5">
                  ${totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-xs font-semibold uppercase text-stone-500">Outstanding Balance</span>
                <div className="text-2xl font-serif font-bold text-amber-900 tabular-nums mt-0.5">
                  ${totalOutstanding.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="p-3">Invoice ID & Student</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-stone-50/50">
                      <td className="p-3">
                        <span className="font-semibold text-stone-900">{inv.studentName}</span>
                        <div className="text-stone-400 font-mono text-[11px]">{inv.id}</div>
                      </td>
                      <td className="p-3 text-stone-700">{inv.description}</td>
                      <td className="p-3 font-serif font-bold text-stone-950 tabular-nums">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-stone-600 tabular-nums">{inv.dueDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          inv.status === 'Overdue' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status !== 'Paid' ? (
                            <button
                              onClick={() => {
                                onRecordPayment(inv.id);
                                setReceiptInvoice({ ...inv, status: 'Paid', paidDate: '2026-10-21' });
                              }}
                              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Record Payment
                            </button>
                          ) : (
                            <button
                              onClick={() => setReceiptInvoice(inv)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-medium cursor-pointer"
                            >
                              View Receipt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Electronic Receipt Modal */}
            {receiptInvoice && (
              <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-center pb-4 border-b border-stone-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <h4 className="text-lg font-serif font-bold text-stone-950">Official Bursar Payment Receipt</h4>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">Receipt #{receiptInvoice.id}</p>
                  </div>

                  <div className="py-4 space-y-2 text-xs text-stone-700">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span>Student Scholar:</span>
                      <strong>{receiptInvoice.studentName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span>Description:</span>
                      <span>{receiptInvoice.description}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span>Amount Processed:</span>
                      <strong className="text-stone-950">${receiptInvoice.amount.toLocaleString()}.00 USD</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span>Payment Status:</span>
                      <strong className="text-emerald-700">Paid in Full</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Processed Date:</span>
                      <span>{receiptInvoice.paidDate || 'October 21, 2026'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      onClick={() => setReceiptInvoice(null)}
                      className="px-4 py-2 bg-stone-100 text-stone-800 rounded text-xs font-semibold"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Invoice Modal */}
            {isAddInvoiceModalOpen && (
              <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h4 className="text-base font-serif font-bold text-stone-950">
                      Issue Student Fee Invoice
                    </h4>
                    <button
                      onClick={() => setIsAddInvoiceModalOpen(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddInvoiceSubmit} className="py-4 space-y-3.5 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Student Scholar</label>
                      <select
                        value={invoiceForm.studentId}
                        onChange={(e) => {
                          const stu = students.find(s => s.studentId === e.target.value);
                          setInvoiceForm({
                            ...invoiceForm,
                            studentId: e.target.value,
                            studentName: stu ? stu.name : 'Liam Montgomery'
                          });
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.studentId}>
                            {s.name} ({s.studentId} - {s.grade})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Invoice Item Description</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Term II Laboratory & Experiential Trip Fee"
                        value={invoiceForm.description}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Amount ($ USD)</label>
                        <input
                          type="number"
                          required
                          value={invoiceForm.amount}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Due Date</label>
                        <input
                          type="date"
                          required
                          value={invoiceForm.dueDate}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddInvoiceModalOpen(false)}
                        className="px-3 py-2 text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md cursor-pointer"
                      >
                        Generate Invoice
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 7: FACULTY & STAFF HR */}
        {/* ======================================================== */}
        {smsTab === 'staff' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Faculty & Staff HR Management
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Department chairs, teaching workloads, and institutional staff directory.
                </p>
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="p-3">Staff Member & ID</th>
                    <th className="p-3">Department & Role</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Weekly Teaching Load</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-stone-50/50">
                      <td className="p-3">
                        <span className="font-semibold text-stone-900">{s.name}</span>
                        <div className="text-stone-400 font-mono text-[11px]">{s.staffId}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-stone-800">{s.role}</div>
                        <div className="text-stone-500 text-[11px]">{s.department}</div>
                      </td>
                      <td className="p-3 text-stone-600">
                        <div>{s.email}</div>
                        <div className="text-[11px] text-stone-400">{s.phone}</div>
                      </td>
                      <td className="p-3 text-stone-900 font-medium tabular-nums">
                        {s.teachingPeriodsPerWeek} periods / wk
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 8: CAMPUS MASTER TIMETABLE */}
        {/* ======================================================== */}
        {smsTab === 'timetable' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Campus Master Timetable & Room Matrix
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Synchronized period schedule across academic halls and laboratory wings.
                </p>
              </div>

              {/* Day filter buttons */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
                {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedTimetableDay(day as any)}
                    className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                      selectedTimetableDay === day
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="p-3">Weekday</th>
                    <th className="p-3">Period & Time</th>
                    <th className="p-3">Course Code & Name</th>
                    <th className="p-3">Instructor</th>
                    <th className="p-3">Room Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {timetable
                    .filter(t => selectedTimetableDay === 'All' || t.day === selectedTimetableDay)
                    .map(slot => (
                      <tr key={slot.id} className="hover:bg-stone-50/50">
                        <td className="p-3 font-semibold text-stone-900">{slot.day}</td>
                        <td className="p-3 text-stone-700 font-medium tabular-nums">{slot.period}</td>
                        <td className="p-3">
                          <span className="font-semibold text-stone-900">{slot.courseName}</span>
                          <span className="text-stone-400 font-mono ml-2">({slot.courseCode})</span>
                        </td>
                        <td className="p-3 text-stone-600">{slot.instructor}</td>
                        <td className="p-3 text-stone-700 font-medium">{slot.room}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 9: COMMUNICATIONS BROADCAST DESK */}
        {/* ======================================================== */}
        {smsTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h3 className="text-lg font-serif font-bold text-stone-950 pb-2 border-b border-stone-200 mb-4">
                Campus-Wide Communications Broadcast
              </h3>

              {broadcastSentNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-lg flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Broadcast successfully transmitted to <strong>{broadcastTarget}</strong> via email and academy portal alert.</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white text-stone-900"
                  >
                    <option>All Academy Families</option>
                    <option>Upper School Scholars & Parents (9–12)</option>
                    <option>Middle School Families (6–8)</option>
                    <option>Lower School Families (K–5)</option>
                    <option>All Faculty & Academic Chairs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Subject Header</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule Update: Term I Midterm Exams & Transportation"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Message Content</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Compose official notification text..."
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Broadcast</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h4 className="text-base font-serif font-bold text-stone-950 pb-2 border-b border-stone-200 mb-3">
                Recent Broadcast Dispatches
              </h4>
              <div className="space-y-3 text-xs">
                {broadcastLog.map(log => (
                  <div key={log.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="font-semibold text-stone-900">{log.subject}</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">To: {log.target}</div>
                    <div className="text-stone-400 text-[10px] tabular-nums mt-1">{log.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
