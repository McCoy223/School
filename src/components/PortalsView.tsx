import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Download,
  Upload,
  UserCheck,
  Send,
  Printer,
  ChevronRight,
  Shield,
  Layers,
  Award,
  Sparkles
} from 'lucide-react';
import {
  UserRole,
  StudentProfile,
  Course,
  Assignment,
  AttendanceItem,
  TuitionStatement
} from '../types';

interface PortalsViewProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  studentProfile: StudentProfile;
  courses: Course[];
  assignments: Assignment[];
  attendance: AttendanceItem[];
  tuition: TuitionStatement;
  onSubmitAssignment: (assignmentId: string, note: string) => void;
  onPostAssignment: (courseCode: string, title: string, dueDate: string, totalPoints: number, instructions: string) => void;
  onUpdateCourseGrade: (courseId: string, newGrade: number) => void;
}

export const PortalsView: React.FC<PortalsViewProps> = ({
  currentRole,
  onSelectRole,
  studentProfile,
  courses,
  assignments,
  attendance,
  tuition,
  onSubmitAssignment,
  onPostAssignment,
  onUpdateCourseGrade
}) => {
  // Student Portal Tabs
  const [studentTab, setStudentTab] = useState<'schedule' | 'assignments' | 'gradebook' | 'attendance'>('assignments');
  
  // Assignment submission modal
  const [activeSubmissionAssignment, setActiveSubmissionAssignment] = useState<Assignment | null>(null);
  const [submissionFile, setSubmissionFile] = useState<string>('');
  const [submissionNote, setSubmissionNote] = useState<string>('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Transcript modal
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

  // Tuition payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('4000');
  const [paymentDone, setPaymentDone] = useState(false);

  // Faculty state
  const [facultyTab, setFacultyTab] = useState<'roster' | 'new-assignment' | 'office-inbox'>('roster');
  const [newAsgCourse, setNewAsgCourse] = useState('PHYS-401');
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDue, setNewAsgDue] = useState('2026-11-08');
  const [newAsgPoints, setNewAsgPoints] = useState('100');
  const [newAsgInstructions, setNewAsgInstructions] = useState('');
  const [asgPostedNotice, setAsgPostedNotice] = useState(false);

  // Quick grade editor
  const [editingGradeCourseId, setEditingGradeCourseId] = useState<string | null>(null);
  const [tempGradeInput, setTempGradeInput] = useState<string>('');

  const handleTurnInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionAssignment) return;
    onSubmitAssignment(activeSubmissionAssignment.id, submissionNote || submissionFile || 'Document_Uploaded.pdf');
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setActiveSubmissionAssignment(null);
      setSubmissionNote('');
      setSubmissionFile('');
    }, 1600);
  };

  const handlePostAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle) return;
    onPostAssignment(newAsgCourse, newAsgTitle, newAsgDue, Number(newAsgPoints) || 100, newAsgInstructions);
    setAsgPostedNotice(true);
    setTimeout(() => {
      setAsgPostedNotice(false);
      setNewAsgTitle('');
      setNewAsgInstructions('');
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Portal Role Switcher Bar */}
      <div className="bg-stone-900 text-white rounded-xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1">
              Secure Academy Intranet & Information System
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              St. Andrew's Academy Portals
            </h2>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-800 rounded-lg border border-stone-700/80">
            <button
              onClick={() => onSelectRole('student')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-amber-100 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Student Portal (Liam M.)
            </button>
            <button
              onClick={() => onSelectRole('parent')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'parent'
                  ? 'bg-amber-100 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Parent Portal (Family)
            </button>
            <button
              onClick={() => onSelectRole('faculty')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'faculty'
                  ? 'bg-amber-100 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Faculty Portal (Dr. Vance)
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. STUDENT PORTAL VIEW */}
      {/* ======================================================== */}
      {currentRole === 'student' && (
        <div className="space-y-8">
          {/* Student Overview Header Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-amber-100 font-serif font-bold text-xl flex items-center justify-center shrink-0">
                  LM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-stone-950">
                      {studentProfile.name}
                    </h3>
                    <span className="text-xs text-stone-500 font-mono">({studentProfile.studentId})</span>
                  </div>
                  <p className="text-xs font-medium text-stone-600 mt-0.5">
                    {studentProfile.grade} · Upper School Scholar
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-2">
                    <span>Academic Advisor: <strong>{studentProfile.advisor}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>College Counselor: <strong>{studentProfile.counselor}</strong></span>
                  </div>
                </div>
              </div>

              {/* Student Quick KPI Metrics */}
              <div className="flex items-center gap-6 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Cumulative GPA
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                    {studentProfile.gpa.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">Top 5% Quintile</div>
                </div>

                <div className="w-px h-10 bg-stone-200" />

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Attendance Rate
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                    {studentProfile.attendanceRate}%
                  </div>
                  <div className="text-[10px] text-stone-500">Term I</div>
                </div>

                <div className="w-px h-10 bg-stone-200" />

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Graduation Credits
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                    {studentProfile.creditsEarned} <span className="text-xs text-stone-400 font-normal">/ {studentProfile.creditsRequired}</span>
                  </div>
                  <div className="text-[10px] text-stone-500">On Track</div>
                </div>
              </div>
            </div>

            {/* Student Navigation Sub-tabs */}
            <div className="flex items-center justify-between border-t border-stone-200 mt-6 pt-4 gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200/70">
                <button
                  onClick={() => setStudentTab('assignments')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studentTab === 'assignments'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Assignments & Work ({assignments.filter(a => a.status === 'pending').length} Due)
                </button>
                <button
                  onClick={() => setStudentTab('schedule')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studentTab === 'schedule'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Course Schedule
                </button>
                <button
                  onClick={() => setStudentTab('gradebook')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studentTab === 'gradebook'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Gradebook & Transcript
                </button>
                <button
                  onClick={() => setStudentTab('attendance')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studentTab === 'attendance'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Attendance Log
                </button>
              </div>

              <button
                onClick={() => setIsTranscriptModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                <span>Unofficial Transcript</span>
              </button>
            </div>
          </div>

          {/* Sub-tab 1: Assignments */}
          {studentTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1 border-b border-stone-200">
                <span className="font-semibold text-stone-800">Term I Coursework & Lab Practicums</span>
                <span>Sorted by due date</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {assignments.map(asg => (
                  <div
                    key={asg.id}
                    className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 hover:shadow-xs transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                          <span className="font-semibold text-stone-900">{asg.courseCode}</span>
                          <span aria-hidden="true">·</span>
                          <span>{asg.courseName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">Due {asg.dueDate}</span>
                        </div>

                        <h4 className="text-base font-serif font-bold text-stone-950">
                          {asg.title}
                        </h4>

                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                          {asg.instructions}
                        </p>

                        {/* If graded or submitted, show feedback/status */}
                        {asg.status === 'graded' && asg.feedback && (
                          <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                            <span className="font-semibold text-stone-900 block mb-0.5">
                              Instructor Feedback ({asg.earnedPoints} / {asg.totalPoints} pts):
                            </span>
                            <span className="text-stone-700 italic">"{asg.feedback}"</span>
                          </div>
                        )}

                        {asg.status === 'submitted' && (
                          <div className="mt-3 text-xs text-stone-500 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Submitted on {asg.submittedAt || 'Today'}: {asg.submittedNote || 'LabReport.pdf'}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Action */}
                      <div className="shrink-0 flex items-center sm:flex-col sm:items-end gap-2">
                        {asg.status === 'pending' && (
                          <button
                            onClick={() => {
                              setActiveSubmissionAssignment(asg);
                              setSubmissionNote('');
                            }}
                            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Turn In Work</span>
                          </button>
                        )}

                        {asg.status === 'submitted' && (
                          <span className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                            Awaiting Evaluation
                          </span>
                        )}

                        {asg.status === 'graded' && (
                          <div className="text-right">
                            <div className="text-base font-serif font-bold text-stone-900 tabular-nums">
                              {asg.earnedPoints} / {asg.totalPoints}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold">
                              {((asg.earnedPoints! / asg.totalPoints) * 100).toFixed(0)}% Completed
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 2: Course Schedule */}
          {studentTab === 'schedule' && (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-700">
                Weekly Class Timetable · Term I (2026–2027)
              </div>
              <div className="divide-y divide-stone-200">
                {courses.map(crs => (
                  <div key={crs.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                        <span className="font-semibold text-stone-900">{crs.code}</span>
                        <span aria-hidden="true">·</span>
                        <span>{crs.department}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{crs.credits} Credit</span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-stone-950">
                        {crs.name}
                      </h4>
                      <div className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-3">
                        <span>Instructor: <strong>{crs.instructor}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Room: <strong>{crs.room}</strong></span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-xs font-semibold text-stone-800">
                        {crs.schedule}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Current Term Standing: <strong className="text-stone-900">{crs.letterGrade} ({crs.currentGrade}%)</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Gradebook */}
          {studentTab === 'gradebook' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>Current Academic Standings</span>
                  <span>Semester Weighted GPA: 3.94</span>
                </div>
                <div className="divide-y divide-stone-200">
                  {courses.map(crs => (
                    <div key={crs.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-stone-500 font-mono mb-0.5">{crs.code}</div>
                        <h4 className="text-sm font-serif font-bold text-stone-900">{crs.name}</h4>
                        <div className="text-xs text-stone-500 mt-0.5">{crs.instructor}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-serif font-bold text-stone-900 tabular-nums">
                          {crs.letterGrade} <span className="text-xs font-normal text-stone-500">({crs.currentGrade}%)</span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {crs.credits} Credit Hours
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 4: Attendance Log */}
          {studentTab === 'attendance' && (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-700">
                <span>Period-by-Period Roll Record</span>
                <span className="text-emerald-800">Overall: 98.4% Present</span>
              </div>
              <div className="divide-y divide-stone-200">
                {attendance.map((rec, i) => (
                  <div key={i} className="p-3.5 sm:p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-900">{rec.date}</span>
                      <span aria-hidden="true" className="mx-2 text-stone-300">·</span>
                      <span className="text-stone-600">{rec.period}</span>
                      <span aria-hidden="true" className="mx-2 text-stone-300">·</span>
                      <span className="text-stone-800 font-medium">{rec.subject}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      rec.status === 'Present' ? 'text-emerald-800 bg-emerald-50' : 'text-amber-800 bg-amber-50'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PARENT PORTAL VIEW */}
      {/* ======================================================== */}
      {currentRole === 'parent' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Parent & Guardian Portal
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-950">
                  Eleanor & Robert Montgomery
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Associated Scholar: <strong>Liam Montgomery (Grade 11, ID: SA-2027-449)</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Tuition Statement & Pay</span>
                </button>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Academic Progress
                </div>
                <div className="text-2xl font-serif font-bold text-stone-950 mt-1">
                  3.94 GPA
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Enrolled in 6 honors & AP courses. Honor roll standing.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Attendance & Health
                </div>
                <div className="text-2xl font-serif font-bold text-stone-950 mt-1">
                  98.4%
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  1 excused absence (Oct 16). Health immunization record verified.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Account Balance
                </div>
                <div className="text-2xl font-serif font-bold text-stone-950 mt-1 tabular-nums">
                  ${tuition.balanceDue.toLocaleString()}
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Term II installment due {tuition.dueDate}.
                </p>
              </div>
            </div>
          </div>

          {/* Tuition Invoices and Statements */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h4 className="text-base font-serif font-bold text-stone-950">
                  Tuition & Academic Fees Breakdown
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">{tuition.term}</p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="text-xs font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
              >
                Make Payment / Download Receipt
              </button>
            </div>

            <div className="divide-y divide-stone-200 mt-4">
              {tuition.invoices.map(inv => (
                <div key={inv.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{inv.description}</span>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      Invoice #{inv.id} · Issued {inv.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-stone-950 tabular-nums">
                      ${inv.amount.toLocaleString()}
                    </span>
                    <div className="text-[11px] font-semibold text-stone-600">
                      {inv.status === 'Paid' ? (
                        <span className="text-emerald-700">Paid in Full</span>
                      ) : (
                        <span className="text-amber-800">Payment Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FACULTY PORTAL VIEW */}
      {/* ======================================================== */}
      {currentRole === 'faculty' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-900 text-white font-serif font-bold text-lg flex items-center justify-center">
                  AV
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-950">
                    Dr. Arthur Vance, Ph.D.
                  </h3>
                  <p className="text-xs text-stone-600">
                    Department Chair, Sciences & Mathematics · AP Physics C Faculty
                  </p>
                </div>
              </div>

              {/* Faculty sub-tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200/70">
                <button
                  onClick={() => setFacultyTab('roster')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    facultyTab === 'roster'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Course Roster & Grades
                </button>
                <button
                  onClick={() => setFacultyTab('new-assignment')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    facultyTab === 'new-assignment'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Post Assignment
                </button>
              </div>
            </div>

            {/* Tab 1: Faculty Course Roster */}
            {facultyTab === 'roster' && (
              <div className="pt-6">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                  <span className="font-semibold text-stone-800">AP Physics C: Mechanics (PHYS-401)</span>
                  <span>Active Enrollment: 18 scholars</span>
                </div>

                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-700">
                      <tr>
                        <th className="p-3">Student Scholar</th>
                        <th className="p-3">ID</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Term Standing</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="p-3 font-medium text-stone-900">Liam Montgomery</td>
                        <td className="p-3 font-mono text-stone-500">SA-2027-449</td>
                        <td className="p-3">11th</td>
                        <td className="p-3 font-semibold text-stone-900 tabular-nums">
                          {courses.find(c => c.code === 'PHYS-401')?.currentGrade || 96.2}% (A)
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              const crs = courses.find(c => c.code === 'PHYS-401');
                              if (crs) {
                                setEditingGradeCourseId(crs.id);
                                setTempGradeInput(String(crs.currentGrade));
                              }
                            }}
                            className="text-xs text-stone-700 hover:text-stone-950 font-semibold underline"
                          >
                            Adjust Grade
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-stone-900">Claire Kensington</td>
                        <td className="p-3 font-mono text-stone-500">SA-2027-104</td>
                        <td className="p-3">11th</td>
                        <td className="p-3 font-semibold text-stone-900 tabular-nums">94.5% (A)</td>
                        <td className="p-3 text-right text-stone-400">Recorded</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-stone-900">Marcus Sterling</td>
                        <td className="p-3 font-mono text-stone-500">SA-2027-319</td>
                        <td className="p-3">11th</td>
                        <td className="p-3 font-semibold text-stone-900 tabular-nums">91.0% (A-)</td>
                        <td className="p-3 text-right text-stone-400">Recorded</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Grade Edit Modal/Dialog */}
                {editingGradeCourseId && (
                  <div className="mt-4 p-4 bg-amber-50/50 rounded-lg border border-amber-200 flex items-center justify-between gap-4">
                    <div className="text-xs text-stone-800">
                      <strong>Adjust Grade for Liam Montgomery:</strong> Enter new percentage:
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={tempGradeInput}
                        onChange={(e) => setTempGradeInput(e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-stone-300 rounded bg-white text-stone-900"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(tempGradeInput);
                          if (!isNaN(val)) {
                            onUpdateCourseGrade(editingGradeCourseId, val);
                          }
                          setEditingGradeCourseId(null);
                        }}
                        className="px-3 py-1 bg-stone-900 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGradeCourseId(null)}
                        className="px-2 py-1 text-stone-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Post Assignment */}
            {facultyTab === 'new-assignment' && (
              <div className="pt-6 max-w-xl">
                {asgPostedNotice ? (
                  <div className="py-6 text-center bg-stone-50 rounded-lg border border-stone-200">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-stone-900">Assignment Published</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Enrolled scholars have received the notification on their portals.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePostAssignmentSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Target Course</label>
                      <select
                        value={newAsgCourse}
                        onChange={(e) => setNewAsgCourse(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white text-stone-900 text-xs"
                      >
                        <option value="PHYS-401">AP Physics C: Mechanics (PHYS-401)</option>
                        <option value="PHYS-402">AP Physics C: E&M (PHYS-402)</option>
                        <option value="PHYS-500">Advanced Quantum Seminar (PHYS-500)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Assignment Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Practicum 4: Angular Momentum Conservation"
                        value={newAsgTitle}
                        onChange={(e) => setNewAsgTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Due Date</label>
                        <input
                          type="date"
                          required
                          value={newAsgDue}
                          onChange={(e) => setNewAsgDue(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Total Points</label>
                        <input
                          type="number"
                          required
                          value={newAsgPoints}
                          onChange={(e) => setNewAsgPoints(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Instructions & Criteria</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detailed rubrics, laboratory guidelines, or reading questions..."
                        value={newAsgInstructions}
                        onChange={(e) => setNewAsgInstructions(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white rounded-md font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Publish Assignment
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SUBMIT ASSIGNMENT */}
      {/* ======================================================== */}
      {activeSubmissionAssignment && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-serif font-bold text-stone-950 pb-2 border-b border-stone-200">
              Submit Coursework
            </h3>
            
            {submissionSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-stone-900">Work Submitted Successfully</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Your submission has been cataloged and timestamped for {activeSubmissionAssignment.courseName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTurnInSubmit} className="py-4 space-y-4 text-xs">
                <div>
                  <div className="font-semibold text-stone-900 text-sm">
                    {activeSubmissionAssignment.title}
                  </div>
                  <div className="text-stone-500 mt-0.5">
                    Course: {activeSubmissionAssignment.courseName} ({activeSubmissionAssignment.courseCode})
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Document Attachment</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:bg-stone-50 transition-colors">
                    <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                    <p className="text-xs text-stone-700 font-medium">Click to select file or drag PDF/DOCX</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Max file size 25MB (PDF preferred)</p>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSubmissionFile(e.target.files[0].name);
                        }
                      }}
                      className="hidden"
                      id="assignment-file-input"
                    />
                    <label
                      htmlFor="assignment-file-input"
                      className="mt-2 inline-block px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium cursor-pointer"
                    >
                      Browse Device
                    </label>
                    {submissionFile && (
                      <p className="text-xs font-semibold text-emerald-700 mt-2">
                        Attached: {submissionFile}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Submission Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Notes for instructor regarding appendices or questions..."
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSubmissionAssignment(null)}
                    className="px-3 py-2 text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded font-semibold hover:bg-stone-800 cursor-pointer"
                  >
                    Confirm Submission
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: OFFICIAL TRANSCRIPT VIEW & PRINT */}
      {/* ======================================================== */}
      {isTranscriptModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-300 shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header with collegiate crest */}
            <div className="text-center pb-6 border-b-2 border-stone-900">
              <div className="text-2xl font-serif font-bold tracking-tight text-stone-950">
                ST. ANDREW'S ACADEMY
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-600 mt-0.5">
                Office of the Academic Dean & Registrar
              </div>
              <div className="text-[11px] text-stone-500 italic mt-1">
                Official Pre-Collegiate Academic Transcript & Scholastic Record
              </div>
            </div>

            {/* Student metadata block */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-stone-200 text-xs">
              <div>
                <p><strong>Student:</strong> {studentProfile.name}</p>
                <p><strong>Student ID:</strong> {studentProfile.studentId}</p>
                <p><strong>Academic Level:</strong> Grade 11 (Junior Year)</p>
              </div>
              <div>
                <p><strong>Cumulative GPA:</strong> {studentProfile.gpa.toFixed(2)} (Weighted 4.0 Scale)</p>
                <p><strong>Advisor:</strong> {studentProfile.advisor}</p>
                <p><strong>Date Issued:</strong> October 21, 2026</p>
              </div>
            </div>

            {/* Course Table */}
            <div className="py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Term I Coursework & Grade Record
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 font-semibold text-stone-800">
                  <tr>
                    <th className="p-2">Code</th>
                    <th className="p-2">Course Title</th>
                    <th className="p-2">Credits</th>
                    <th className="p-2 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td className="p-2 font-mono text-stone-600">{c.code}</td>
                      <td className="p-2 font-medium text-stone-900">{c.name}</td>
                      <td className="p-2 tabular-nums">{c.credits.toFixed(1)}</td>
                      <td className="p-2 text-right font-bold text-stone-950">{c.letterGrade} ({c.currentGrade}%)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stamp & Verification */}
            <div className="pt-6 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <div>
                <div className="font-serif italic text-stone-800 text-sm">Eleanor Sterling, M.A.</div>
                <div>Registrar & Dean of Academic Studies</div>
              </div>
              <div className="text-right text-[11px]">
                <div className="font-mono text-stone-400">SEAL VERIFIED: #TR-2026-9918</div>
                <div>St. Andrew's Academy Institutional Registrar</div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-6 border-t border-stone-200 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setIsTranscriptModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TUITION PAYMENT & RECEIPT */}
      {/* ======================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-serif font-bold text-stone-950 pb-2 border-b border-stone-200">
              Tuition Payment Gateway
            </h3>

            {paymentDone ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-stone-900">Payment Processed</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Electronic receipt #REC-2026-8812 has been issued to the family email on file.
                </p>
                <button
                  onClick={() => {
                    setPaymentDone(false);
                    setIsPaymentModalOpen(false);
                  }}
                  className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="text-stone-500">Total Outstanding Balance:</div>
                  <div className="text-xl font-serif font-bold text-stone-900 tabular-nums">
                    ${tuition.balanceDue.toLocaleString()}.00
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Due: {tuition.dueDate}</div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Payment Amount ($ USD)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Payment Method</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white">
                    <option>Automated Clearing House (ACH) Direct Bank Transfer (···9104)</option>
                    <option>Collegiate Tuition Wire Transfer</option>
                    <option>Corporate 529 College Savings Plan</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="px-3 py-2 text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setPaymentDone(true)}
                    className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-md hover:bg-stone-800 cursor-pointer"
                  >
                    Authorize Payment (${paymentAmount})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
