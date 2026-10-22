import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Check,
  CheckCircle2,
  X,
  GraduationCap,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Upload,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Percent,
  Download,
  Printer
} from 'lucide-react';
import {
  FacultyMember,
  StaffRecord,
  Course,
  StudentRecord,
  TeacherResultUploadBatch
} from '../types';
import { TeacherResultsUploadModal } from './TeacherResultsUploadModal';

interface TeachersPageProps {
  facultyList: FacultyMember[];
  staffRecords?: StaffRecord[];
  courses?: Course[];
  students?: StudentRecord[];
  resultBatches?: TeacherResultUploadBatch[];
  onAddFaculty: (faculty: Omit<FacultyMember, 'id'>) => void;
  onBookOfficeHours?: (facultyId: string, consultationDetails: any) => void;
  onDeleteFaculty?: (facultyId: string) => void;
  onUploadResultsBatch?: (batch: TeacherResultUploadBatch) => void;
}

export const TeachersPage: React.FC<TeachersPageProps> = ({
  facultyList,
  staffRecords = [],
  courses = [],
  students = [],
  resultBatches = [],
  onAddFaculty,
  onBookOfficeHours,
  onDeleteFaculty,
  onUploadResultsBatch
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'results'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedFacultyForDetails, setSelectedFacultyForDetails] = useState<FacultyMember | null>(null);

  // Results Upload Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalTeacherId, setUploadModalTeacherId] = useState<string | undefined>(undefined);
  const [inspectedBatch, setInspectedBatch] = useState<TeacherResultUploadBatch | null>(null);

  // Modals
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [consultationFaculty, setConsultationFaculty] = useState<FacultyMember | null>(null);

  // Consultation Form
  const [studentName, setStudentName] = useState('Liam Montgomery');
  const [studentEmail, setStudentEmail] = useState('l.montgomery27@students.standrewsacademy.org');
  const [consultationDate, setConsultationDate] = useState('2026-10-28');
  const [consultationTime, setConsultationTime] = useState('14:30');
  const [consultationTopic, setConsultationTopic] = useState('');

  // Add Faculty Form
  const [newFaculty, setNewFaculty] = useState<Omit<FacultyMember, 'id'>>({
    name: '',
    title: 'Instructor in Mathematics',
    department: 'Sciences & Mathematics',
    email: '',
    phone: '(555) 843-2',
    officeRoom: 'Harkness Quad 201',
    officeHours: 'Mon / Wed 15:00 - 16:30',
    bio: 'Dedicated educator specializing in advanced inquiry-driven STEM pedagogy.',
    education: ['B.S. MIT', 'M.Ed. Harvard University'],
    coursesTaught: ['MATH-201', 'PHYS-101'],
    consultationAvailable: true,
    avatarColor: 'bg-emerald-800'
  });

  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const departments = [
    'All',
    'Sciences & Mathematics',
    'Humanities & Social Sciences',
    'World Languages',
    'Fine & Performing Arts',
    'Athletics & Physical Education'
  ];

  const filteredFaculty = useMemo(() => {
    return facultyList.filter(f => {
      const matchesDept = selectedDept === 'All' || f.department === selectedDept;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesDept;

      const matchesQ =
        f.name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.officeRoom.toLowerCase().includes(q) ||
        f.coursesTaught.some(c => c.toLowerCase().includes(q)) ||
        f.education.some(e => e.toLowerCase().includes(q));

      return matchesDept && matchesQ;
    });
  }, [facultyList, selectedDept, searchQuery]);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    triggerToast(`Email address copied: ${email}`);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleOpenUploadForTeacher = (teacherId?: string) => {
    setUploadModalTeacherId(teacherId);
    setIsUploadModalOpen(true);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationFaculty) return;

    if (onBookOfficeHours) {
      onBookOfficeHours(consultationFaculty.id, {
        studentName,
        studentEmail,
        date: consultationDate,
        time: consultationTime,
        topic: consultationTopic
      });
    }

    triggerToast(
      `Consultation with ${consultationFaculty.name} confirmed for ${consultationDate} at ${consultationTime}.`
    );
    setConsultationFaculty(null);
    setConsultationTopic('');
  };

  const handleAddFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.email) {
      triggerToast('Please provide faculty name and email.');
      return;
    }

    onAddFaculty(newFaculty);
    setIsAddTeacherOpen(false);
    triggerToast(`Faculty member ${newFaculty.name} welcomed to the roster.`);
    setNewFaculty({
      name: '',
      title: 'Instructor in Mathematics',
      department: 'Sciences & Mathematics',
      email: '',
      phone: '(555) 843-2',
      officeRoom: 'Harkness Quad 201',
      officeHours: 'Mon / Wed 15:00 - 16:30',
      bio: 'Dedicated educator specializing in advanced inquiry-driven STEM pedagogy.',
      education: ['B.S. MIT', 'M.Ed. Harvard University'],
      coursesTaught: ['MATH-201', 'PHYS-101'],
      consultationAvailable: true,
      avatarColor: 'bg-stone-800'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-lg shadow-xl border border-amber-300/40 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 shadow-sm border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2">
              <Users className="w-4 h-4" />
              <span>Academic Faculty & Results Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Teachers & Faculty Department Directory
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Distinguished instructors, department chairs, and academic advisors. Every teacher can upload, audit, and publish class student examination marks and term results.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenUploadForTeacher()}
              className="px-4 py-2.5 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer font-sans"
            >
              <Upload className="w-4 h-4 text-stone-950" />
              <span>Upload Class Student Results</span>
            </button>
            <button
              onClick={() => setIsAddTeacherOpen(true)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Teacher</span>
            </button>
          </div>
        </div>

        {/* Navigation Switcher */}
        <div className="mt-8 pt-4 border-t border-stone-800 flex items-center gap-3 sm:gap-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-amber-400/20 text-amber-200 font-semibold border border-amber-300/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Faculty Directory ({facultyList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'results'
                ? 'bg-amber-400/20 text-amber-200 font-semibold border border-amber-300/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Published Class Results & Marksheets ({resultBatches.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Faculty Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Total Faculty</div>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">{facultyList.length} Teachers</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">100% Terminal degree holders</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Published Results</div>
          <div className="text-xl font-bold font-serif text-amber-700 mt-1">{resultBatches.length} Marksheets</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Committed to official gradebook</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Student:Faculty Ratio</div>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">7 : 1</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Seminar table format</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Active Consultations</div>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">
            {facultyList.filter(f => f.consultationAvailable).length} Available
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Open office hours today</div>
        </div>
      </div>

      {/* TAB 1: FACULTY DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search teachers by name, course taught, office, or degree..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-stone-900 text-white font-medium'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {dept === 'All' ? 'All Departments' : dept.split(' & ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map(teacher => {
              // Count how many result batches this teacher uploaded
              const teacherBatches = resultBatches.filter(
                b => b.teacherId === teacher.id || b.teacherName.includes(teacher.name)
              );

              return (
                <div
                  key={teacher.id}
                  className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs hover:border-amber-400/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-xs ${
                          teacher.avatarColor || 'bg-stone-900'
                        }`}
                      >
                        {teacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-serif font-bold text-base text-stone-900 truncate">
                            {teacher.name}
                          </h3>
                        </div>
                        <p className="text-xs text-stone-600 font-medium truncate mt-0.5">
                          {teacher.title}
                        </p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/40">
                          {teacher.department}
                        </span>
                      </div>
                    </div>

                    {/* Bio summary */}
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {teacher.bio}
                    </p>

                    {/* Contact info list */}
                    <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-stone-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-stone-500">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          Office
                        </span>
                        <span className="font-medium text-stone-800">{teacher.officeRoom}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-stone-500">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          Office Hours
                        </span>
                        <span className="font-medium text-stone-800">{teacher.officeHours}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-stone-500">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          Email
                        </span>
                        <button
                          onClick={() => handleCopyEmail(teacher.email, teacher.id)}
                          className="font-mono text-[11px] text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{teacher.email.split('@')[0]}</span>
                          {copiedEmailId === teacher.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <span className="text-[10px] text-stone-400 hover:underline">(copy)</span>
                          )}
                        </button>
                      </div>

                      {teacherBatches.length > 0 && (
                        <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/70 px-2 py-1 rounded">
                          <span className="flex items-center gap-1 text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Results Published
                          </span>
                          <span className="font-mono font-bold text-[11px]">
                            {teacherBatches.length} Classes
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Courses Taught */}
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <div className="text-[11px] font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-stone-400" />
                        <span>Assigned Courses:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.coursesTaught.map(c => (
                          <span
                            key={c}
                            className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col gap-2">
                    {/* Primary Teacher Action: Upload Results for their class! */}
                    <button
                      onClick={() => handleOpenUploadForTeacher(teacher.id)}
                      className="w-full py-2 px-3 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                    >
                      <Upload className="w-3.5 h-3.5 text-stone-950" />
                      <span>Upload Class Results</span>
                    </button>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedFacultyForDetails(teacher)}
                        className="flex-1 py-1.5 px-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Full Dossier
                      </button>

                      <button
                        onClick={() => setConsultationFaculty(teacher)}
                        className="flex-1 py-1.5 px-2 text-xs font-semibold text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book Hours</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PUBLISHED CLASS RESULTS & MARKSHEETS */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Official Faculty Marksheets & Examination Results Registry
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Teacher-submitted assessment scores, class distributions, and official student transcript grades.
              </p>
            </div>

            <button
              onClick={() => handleOpenUploadForTeacher()}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Upload className="w-4 h-4 text-stone-950" />
              <span>Upload New Class Marks</span>
            </button>
          </div>

          {resultBatches.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
              <Award className="w-12 h-12 mx-auto mb-3 text-stone-300" />
              <p className="text-sm font-semibold text-stone-800">No examination marksheets published yet.</p>
              <p className="text-xs text-stone-500 mt-1">Teachers can upload class results using the button above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resultBatches.map(batch => (
                <div
                  key={batch.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-amber-400/60 transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                          {batch.courseCode}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          {batch.assessmentType}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {batch.term} · Uploaded: {batch.uploadedAt}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-stone-900">
                        {batch.assessmentTitle}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Evaluating Instructor: <span className="font-semibold text-stone-800">{batch.teacherName}</span>
                      </p>
                    </div>

                    {/* Key Stats Bar */}
                    <div className="flex items-center gap-4 bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-center shrink-0">
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase">Avg. Score</div>
                        <div className="text-sm font-mono font-bold text-stone-900">{batch.averageScore}%</div>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase">Top Mark</div>
                        <div className="text-sm font-mono font-bold text-emerald-600">{batch.highestScore}%</div>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase">Scholars</div>
                        <div className="text-sm font-mono font-bold text-stone-900">{batch.records.length}</div>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <button
                        onClick={() => setInspectedBatch(batch)}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-200 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                      >
                        Inspect Marksheet
                      </button>
                    </div>
                  </div>

                  {/* Scholars Mini Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {batch.records.map((r, i) => (
                      <div key={i} className="bg-stone-50/80 p-2.5 rounded-lg border border-stone-100 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-stone-900 truncate">{r.studentName}</div>
                          <div className="text-[10px] text-stone-500 font-mono truncate">{r.studentId}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-stone-900">{r.score}%</span>
                          <span className="ml-1.5 font-mono text-[11px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            {r.letterGrade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== MODAL 1: TEACHER DOSSIER ===================== */}
      {selectedFacultyForDetails && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-serif font-bold text-lg shrink-0 ${
                    selectedFacultyForDetails.avatarColor || 'bg-stone-900'
                  }`}
                >
                  {selectedFacultyForDetails.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    {selectedFacultyForDetails.name}
                  </h3>
                  <div className="text-xs text-stone-500 font-medium">
                    {selectedFacultyForDetails.title} · {selectedFacultyForDetails.department}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedFacultyForDetails(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Academic Biography & Pedagogy
                </h4>
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                  {selectedFacultyForDetails.bio}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Degrees & Terminal Credentials</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedFacultyForDetails.education.map((deg, i) => (
                    <div key={i} className="flex items-center gap-2 text-stone-700">
                      <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{deg}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="text-[10px] uppercase font-semibold text-stone-500">Office Room</div>
                  <div className="font-medium text-stone-800 mt-0.5">{selectedFacultyForDetails.officeRoom}</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="text-[10px] uppercase font-semibold text-stone-500">Office Consultation Hours</div>
                  <div className="font-medium text-stone-800 mt-0.5">{selectedFacultyForDetails.officeHours}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                onClick={() => setSelectedFacultyForDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  const target = selectedFacultyForDetails;
                  setSelectedFacultyForDetails(null);
                  handleOpenUploadForTeacher(target.id);
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-stone-950" />
                <span>Upload Class Results</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 2: INSPECT OFFICIAL MARKSHEET ===================== */}
      {inspectedBatch && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    {inspectedBatch.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-stone-700">
                    {inspectedBatch.courseName}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {inspectedBatch.assessmentTitle}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Instructor: {inspectedBatch.teacherName} · Term: {inspectedBatch.term} · Date: {inspectedBatch.uploadedAt}
                </p>
              </div>

              <button
                onClick={() => setInspectedBatch(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
              <div>
                <div className="text-[10px] uppercase font-semibold text-stone-500">Class Average</div>
                <div className="text-lg font-mono font-bold text-stone-900 mt-0.5">{inspectedBatch.averageScore}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-stone-500">Highest Score</div>
                <div className="text-lg font-mono font-bold text-emerald-600 mt-0.5">{inspectedBatch.highestScore}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-stone-500">Lowest Score</div>
                <div className="text-lg font-mono font-bold text-stone-700 mt-0.5">{inspectedBatch.lowestScore}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-stone-500">Total Graded</div>
                <div className="text-lg font-mono font-bold text-stone-900 mt-0.5">{inspectedBatch.records.length} Scholars</div>
              </div>
            </div>

            {/* Student Marksheet Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3 text-center">Score</th>
                    <th className="py-2.5 px-3 text-center">Letter Grade</th>
                    <th className="py-2.5 px-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {inspectedBatch.records.map((r, i) => (
                    <tr key={i} className="hover:bg-amber-50/30">
                      <td className="py-2.5 px-3 font-semibold text-stone-900">{r.studentName}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-500">{r.studentId}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-stone-900">{r.score}%</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {r.letterGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">{r.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Marksheet</span>
              </button>

              <button
                onClick={() => setInspectedBatch(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Close Marksheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 3: BOOK OFFICE HOURS ===================== */}
      {consultationFaculty && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Schedule Office Hours Consultation
                </h3>
                <p className="text-xs text-stone-500">
                  Meeting with {consultationFaculty.name} ({consultationFaculty.officeRoom})
                </p>
              </div>
              <button
                onClick={() => setConsultationFaculty(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConsultationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Scholar Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Student Academy Email</label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Consultation Date</label>
                  <input
                    type="date"
                    required
                    value={consultationDate}
                    onChange={e => setConsultationDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Selected Time Slot</label>
                  <select
                    value={consultationTime}
                    onChange={e => setConsultationTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  >
                    <option value="14:00">14:00 - 14:30</option>
                    <option value="14:30">14:30 - 15:00</option>
                    <option value="15:00">15:00 - 15:30</option>
                    <option value="15:30">15:30 - 16:00</option>
                    <option value="16:00">16:00 - 16:30</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Academic Focus / Topic of Discussion *
                </label>
                <textarea
                  required
                  rows={3}
                  value={consultationTopic}
                  onChange={e => setConsultationTopic(e.target.value)}
                  placeholder="e.g. Reviewing calculus problem set 4 and questions regarding midterm thesis proposal..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setConsultationFaculty(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL 4: ADD NEW TEACHER ===================== */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" />
                <span>Onboard New Faculty Member</span>
              </h3>
              <button
                onClick={() => setIsAddTeacherOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFacultySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Faculty Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newFaculty.name}
                    onChange={e => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    placeholder="e.g. Dr. Julian Croft"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Faculty Academic Title *</label>
                  <input
                    type="text"
                    required
                    value={newFaculty.title}
                    onChange={e => setNewFaculty({ ...newFaculty, title: e.target.value })}
                    placeholder="e.g. Senior Instructor in History"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Department</label>
                  <select
                    value={newFaculty.department}
                    onChange={e =>
                      setNewFaculty({
                        ...newFaculty,
                        department: e.target.value as FacultyMember['department']
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  >
                    <option value="Sciences & Mathematics">Sciences & Mathematics</option>
                    <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                    <option value="World Languages">World Languages</option>
                    <option value="Fine & Performing Arts">Fine & Performing Arts</option>
                    <option value="Athletics & Physical Education">Athletics & Physical Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Academy Email *</label>
                  <input
                    type="email"
                    required
                    value={newFaculty.email}
                    onChange={e => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    placeholder="j.croft@standrewsacademy.org"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Office Hall & Room</label>
                  <input
                    type="text"
                    value={newFaculty.officeRoom}
                    onChange={e => setNewFaculty({ ...newFaculty, officeRoom: e.target.value })}
                    placeholder="e.g. Harkness Quad 302"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Consultation Office Hours</label>
                  <input
                    type="text"
                    value={newFaculty.officeHours}
                    onChange={e => setNewFaculty({ ...newFaculty, officeHours: e.target.value })}
                    placeholder="e.g. Tue / Thu 14:00 - 16:00"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Pedagogical Biography</label>
                <textarea
                  rows={2}
                  value={newFaculty.bio}
                  onChange={e => setNewFaculty({ ...newFaculty, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                >
                  Onboard Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL 5: TEACHER RESULTS UPLOAD DESK ===================== */}
      <TeacherResultsUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        facultyList={facultyList}
        initialFacultyId={uploadModalTeacherId}
        courses={courses}
        students={students}
        onUploadBatch={batch => {
          if (onUploadResultsBatch) {
            onUploadResultsBatch(batch);
          }
          triggerToast(`Results published for ${batch.courseCode}: ${batch.assessmentTitle}`);
          setActiveTab('results');
        }}
      />
    </div>
  );
};
