import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  Edit,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  AlertCircle,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { StudentRecord, Course, Assignment, TeacherResultUploadBatch } from '../types';
import { StudentIDCardModal } from './StudentIDCardModal';

interface StudentClassPageProps {
  students: StudentRecord[];
  courses: Course[];
  assignments?: Assignment[];
  resultBatches?: TeacherResultUploadBatch[];
  onAddStudent: (student: Omit<StudentRecord, 'id' | 'studentId' | 'attendanceRate' | 'gpa'>) => void;
  onUpdateStudent?: (student: StudentRecord) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddCourse: (course: Omit<Course, 'id' | 'currentGrade' | 'letterGrade' | 'announcementsCount'>) => void;
  onDeleteCourse?: (courseId: string) => void;
}

export const StudentClassPage: React.FC<StudentClassPageProps> = ({
  students,
  courses,
  assignments = [],
  resultBatches = [],
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddCourse,
  onDeleteCourse
}) => {
  const [activeSection, setActiveSection] = useState<'students' | 'classes' | 'assignments' | 'results'>('students');

  // Student Registry Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<StudentRecord | null>(null);
  const [selectedStudentForIDCard, setSelectedStudentForIDCard] = useState<StudentRecord | null>(null);

  // Student Enrollment Modal
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: 'Grade 10',
    division: 'Upper School' as StudentRecord['division'],
    dateOfBirth: '2010-06-15',
    advisor: 'Dr. Arthur Vance',
    parentGuardian: '',
    parentEmail: '',
    emergencyPhone: '',
    tuitionBalance: 19500,
    medicalNotes: 'No known allergies or chronic conditions.',
    enrolledCourses: ['PHYS-401', 'LIT-302']
  });

  // Course Catalog Filters & States
  const [courseSearch, setCourseSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [selectedCourseForRoster, setSelectedCourseForRoster] = useState<Course | null>(null);

  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: 'Sciences & Mathematics',
    instructor: 'Dr. Arthur Vance',
    instructorId: 'fac-1',
    room: 'Harkness Quad 204',
    schedule: 'Mon / Wed / Fri · 08:45 - 09:55',
    credits: 1.0,
    syllabusUrl: '#'
  });

  // Toast confirmation
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch =
        studentSearch === '' ||
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.parentGuardian.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.advisor.toLowerCase().includes(studentSearch.toLowerCase());

      const matchesDivision = divisionFilter === 'All' || s.division === divisionFilter;
      const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
      const matchesStatus = statusFilter === 'All' || s.enrollmentStatus === statusFilter;

      return matchesSearch && matchesDivision && matchesGrade && matchesStatus;
    });
  }, [students, studentSearch, divisionFilter, gradeFilter, statusFilter]);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch =
        courseSearch === '' ||
        c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.instructor.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.room.toLowerCase().includes(courseSearch.toLowerCase());

      const matchesDept = departmentFilter === 'All' || c.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [courses, courseSearch, departmentFilter]);

  // Departments list from courses
  const departments = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => set.add(c.department));
    return ['All', ...Array.from(set)];
  }, [courses]);

  // Handle Enroll Form Submit
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.parentGuardian || !newStudent.parentEmail) {
      triggerToast('Please complete all required student fields.');
      return;
    }

    onAddStudent({
      ...newStudent,
      enrollmentStatus: 'Active'
    });

    setIsEnrollModalOpen(false);
    triggerToast(`Scholar ${newStudent.name} successfully registered.`);
    setNewStudent({
      name: '',
      grade: 'Grade 10',
      division: 'Upper School',
      dateOfBirth: '2010-06-15',
      advisor: 'Dr. Arthur Vance',
      parentGuardian: '',
      parentEmail: '',
      emergencyPhone: '',
      tuitionBalance: 19500,
      medicalNotes: 'No known allergies or chronic conditions.',
      enrolledCourses: ['PHYS-401', 'LIT-302']
    });
  };

  // Handle Add Course Submit
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name || !newCourse.instructor) {
      triggerToast('Please complete course code, name, and instructor.');
      return;
    }

    onAddCourse({
      ...newCourse
    });

    setIsAddCourseModalOpen(false);
    triggerToast(`Course ${newCourse.code} (${newCourse.name}) added to catalog.`);
    setNewCourse({
      code: '',
      name: '',
      department: 'Sciences & Mathematics',
      instructor: 'Dr. Arthur Vance',
      instructorId: 'fac-1',
      room: 'Harkness Quad 204',
      schedule: 'Mon / Wed / Fri · 08:45 - 09:55',
      credits: 1.0,
      syllabusUrl: '#'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-lg shadow-xl border border-amber-300/40 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 shadow-sm border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Registrar & Academic Division Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Student Class Management & Course Registry
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Comprehensive scholar database, course scheduling catalog, class rosters, and coursework administration across Lower, Middle, and Upper School divisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Scholar</span>
            </button>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation switcher */}
        <div className="mt-8 pt-4 border-t border-stone-800 flex items-center gap-3 sm:gap-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveSection('students')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'students'
                ? 'bg-amber-400/20 text-amber-200 font-semibold border border-amber-300/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Registry ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('classes')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'classes'
                ? 'bg-amber-400/20 text-amber-200 font-semibold border border-amber-300/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Class Courses Catalog ({courses.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('assignments')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'assignments'
                ? 'bg-amber-400/20 text-amber-200 font-semibold border border-amber-300/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Coursework & Assignments ({assignments.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('results')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeSection === 'results'
                ? 'bg-amber-400/20 text-amber-200 font-semibold border border-amber-300/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Teacher Marksheets ({resultBatches.length})</span>
          </button>
        </div>
      </div>

      {/* ===================== SECTION 1: STUDENTS REGISTRY ===================== */}
      {activeSection === 'students' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search scholars by name, Student ID, guardian, advisor..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Division:</span>
              </div>
              <select
                value={divisionFilter}
                onChange={e => setDivisionFilter(e.target.value)}
                className="border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 bg-white"
              >
                <option value="All">All Divisions</option>
                <option value="Lower School">Lower School (K-5)</option>
                <option value="Middle School">Middle School (6-8)</option>
                <option value="Upper School">Upper School (9-12)</option>
              </select>

              <select
                value={gradeFilter}
                onChange={e => setGradeFilter(e.target.value)}
                className="border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 bg-white"
              >
                <option value="All">All Grades</option>
                <option value="Grade 9">Grade 9 (Freshman)</option>
                <option value="Grade 10">Grade 10 (Sophomore)</option>
                <option value="Grade 11">Grade 11 (Junior)</option>
                <option value="Grade 12">Grade 12 (Senior)</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 5">Grade 5</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
              <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Total Scholars</div>
              <div className="text-xl font-bold font-serif text-stone-900 mt-1">{students.length}</div>
              <div className="text-[11px] text-emerald-600 mt-0.5">Enrolled for current term</div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
              <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Avg. Cumulative GPA</div>
              <div className="text-xl font-bold font-serif text-stone-900 mt-1">
                {(students.reduce((acc, s) => acc + s.gpa, 0) / (students.length || 1)).toFixed(2)}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Scale: 4.0 weighted</div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
              <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Attendance Rate</div>
              <div className="text-xl font-bold font-serif text-stone-900 mt-1">
                {(students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)).toFixed(1)}%
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Campus benchmark 95%</div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
              <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Filtered Matches</div>
              <div className="text-xl font-bold font-serif text-amber-700 mt-1">{filteredStudents.length}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Current table view</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[11px]">
                    <th className="py-3.5 px-4">Scholar Name & ID</th>
                    <th className="py-3.5 px-4">Grade & Division</th>
                    <th className="py-3.5 px-4">Academic Advisor</th>
                    <th className="py-3.5 px-4 text-center">GPA</th>
                    <th className="py-3.5 px-4 text-center">Attendance</th>
                    <th className="py-3.5 px-4">Parent / Guardian Contact</th>
                    <th className="py-3.5 px-4 text-center">Enrollment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                        No scholars match the specified search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr key={student.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900">{student.name}</div>
                          <div className="text-[11px] font-mono text-stone-500">{student.studentId}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-stone-800">{student.grade}</div>
                          <div className="text-[11px] text-stone-500">{student.division}</div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 font-medium">
                          {student.advisor}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-stone-900">
                          {student.gpa.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                              student.attendanceRate >= 96
                                ? 'bg-emerald-50 text-emerald-700'
                                : student.attendanceRate >= 90
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {student.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-stone-800 font-medium">{student.parentGuardian}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-stone-400" />
                            <span>{student.parentEmail}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              student.enrollmentStatus === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : student.enrollmentStatus === 'On Leave'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {student.enrollmentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStudentForIDCard(student)}
                              className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded transition-colors cursor-pointer"
                              title="Generate / View Student ID Card Mockup"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedStudentForDossier(student)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                              title="Inspect Full Student Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove scholar ${student.name} from the student registry?`)) {
                                  onDeleteStudent(student.id);
                                  triggerToast(`Scholar ${student.name} deleted.`);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Scholar Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SECTION 2: CLASS COURSES CATALOG ===================== */}
      {activeSection === 'classes' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search courses by code, title, instructor, room..."
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-stone-500 font-medium">Department:</span>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 bg-white"
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map(course => {
              // Count enrolled scholars
              const enrolledList = students.filter(s =>
                s.enrolledCourses.includes(course.code)
              );

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-amber-400/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {course.credits.toFixed(1)} Credits
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                      {course.name}
                    </h3>
                    <div className="text-[11px] text-stone-500 font-medium mb-3">
                      {course.department}
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-medium text-stone-800">Faculty:</span>
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-medium text-stone-800">Room:</span>
                        <span>{course.room}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-medium text-stone-800">Schedule:</span>
                        <span>{course.schedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-stone-500">Roster: </span>
                      <span className="font-semibold text-stone-900">{enrolledList.length} Scholars</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCourseForRoster(course)}
                        className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>View Roster</span>
                      </button>
                      {onDeleteCourse && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove course ${course.code} from catalog?`)) {
                              onDeleteCourse(course.id);
                              triggerToast(`Course ${course.code} removed.`);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== SECTION 3: COURSEWORK & ASSIGNMENTS ===================== */}
      {activeSection === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Active Academic Coursework & Problem Sets</h3>
              <p className="text-xs text-stone-500 mt-0.5">Centralized oversight of assigned laboratory reports, problem sets, and term examinations.</p>
            </div>
            <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg">
              Term: Fall 2026 Academic Term
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map(assn => (
              <div key={assn.id} className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {assn.courseCode} · {assn.courseName}
                    </span>
                    <h4 className="text-base font-serif font-bold text-stone-900 mt-2">{assn.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      assn.status === 'graded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : assn.status === 'submitted'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {assn.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                  {assn.instructions}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due Date: {assn.dueDate}</span>
                  </div>
                  <div className="font-mono font-semibold text-stone-800">
                    {assn.earnedPoints !== undefined
                      ? `${assn.earnedPoints} / ${assn.totalPoints} pts`
                      : `${assn.totalPoints} pts total`}
                  </div>
                </div>

                {assn.feedback && (
                  <div className="text-[11px] text-stone-700 bg-emerald-50/60 border border-emerald-200/60 p-2.5 rounded text-left">
                    <span className="font-semibold text-emerald-800">Faculty Remarks: </span>
                    {assn.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== SECTION 4: TEACHER RESULTS & MARKSHEETS ===================== */}
      {activeSection === 'results' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Official Teacher Examination Results & Class Marksheets
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Evaluations and marksheets uploaded by course teachers for enrolled class scholars.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg">
              {resultBatches.length} Official Marksheets Published
            </div>
          </div>

          {resultBatches.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
              <Award className="w-10 h-10 mx-auto mb-2 text-stone-300" />
              <p className="text-xs">No exam marksheets uploaded yet by teachers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {resultBatches.map(batch => (
                <div key={batch.id} className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                          {batch.courseCode}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          {batch.assessmentType}
                        </span>
                        <span className="text-[11px] text-stone-500">{batch.term}</span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-stone-900">{batch.assessmentTitle}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Evaluating Faculty: <span className="font-semibold text-stone-800">{batch.teacherName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-center shrink-0">
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase">Class Avg</div>
                        <div className="text-sm font-mono font-bold text-stone-900">{batch.averageScore}%</div>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase">Top Score</div>
                        <div className="text-sm font-mono font-bold text-emerald-600">{batch.highestScore}%</div>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase">Scholars</div>
                        <div className="text-sm font-mono font-bold text-stone-900">{batch.records.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Student Marksheet Table */}
                  <div className="border border-stone-100 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] border-b border-stone-100">
                          <th className="py-2 px-3">Scholar Name</th>
                          <th className="py-2 px-3">Student ID</th>
                          <th className="py-2 px-3 text-center">Score</th>
                          <th className="py-2 px-3 text-center">Grade</th>
                          <th className="py-2 px-3">Teacher Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {batch.records.map((r, i) => (
                          <tr key={i} className="hover:bg-amber-50/20">
                            <td className="py-2 px-3 font-semibold text-stone-900">{r.studentName}</td>
                            <td className="py-2 px-3 font-mono text-stone-500">{r.studentId}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-stone-900">{r.score}%</td>
                            <td className="py-2 px-3 text-center">
                              <span className="font-mono font-bold text-[11px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                {r.letterGrade}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-stone-600">{r.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== MODAL 1: STUDENT DOSSIER ===================== */}
      {selectedStudentForDossier && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-stone-900 text-amber-200 font-serif font-bold text-lg flex items-center justify-center">
                  {selectedStudentForDossier.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    {selectedStudentForDossier.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span>ID: {selectedStudentForDossier.studentId}</span>
                    <span>·</span>
                    <span>{selectedStudentForDossier.grade} ({selectedStudentForDossier.division})</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForDossier(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-500">Cumulative GPA</div>
                <div className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                  {selectedStudentForDossier.gpa.toFixed(2)}
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-500">Attendance Rate</div>
                <div className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                  {selectedStudentForDossier.attendanceRate}%
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-500">Tuition Balance</div>
                <div className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                  ${selectedStudentForDossier.tuitionBalance.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Dossier sections */}
            <div className="space-y-4 text-xs text-stone-700">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">Academic & Administrative Details</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500">Faculty Advisor: </span>
                    <span className="font-medium text-stone-800">{selectedStudentForDossier.advisor}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Date of Birth: </span>
                    <span className="font-mono text-stone-800">{selectedStudentForDossier.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Enrollment Status: </span>
                    <span className="font-semibold text-stone-900">{selectedStudentForDossier.enrollmentStatus}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Active Courses: </span>
                    <span className="font-mono font-medium text-stone-800">
                      {selectedStudentForDossier.enrolledCourses.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">Parent & Guardian Contacts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500">Primary Guardian: </span>
                    <span className="font-medium text-stone-800">{selectedStudentForDossier.parentGuardian}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Parent Email: </span>
                    <span className="text-stone-800 font-mono">{selectedStudentForDossier.parentEmail}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Emergency Phone: </span>
                    <span className="text-stone-800 font-mono">{selectedStudentForDossier.emergencyPhone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 space-y-1">
                <h4 className="font-semibold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Confidential Health & Medical Notes</span>
                </h4>
                <p className="text-stone-700 leading-relaxed text-xs">
                  {selectedStudentForDossier.medicalNotes || 'No restrictions reported.'}
                </p>
              </div>

              {/* Student ID Card Badge Preview Banner */}
              <div className="bg-stone-900 text-white p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-200 text-stone-950 flex items-center justify-center font-bold shrink-0">
                    <CreditCard className="w-5 h-5 text-stone-950" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-amber-300 font-semibold">
                      Official Academy Smart ID Credential
                    </div>
                    <div className="text-xs font-semibold text-white mt-0.5">
                      Photorealistic 3D Smart Card Mockup Generated
                    </div>
                    <div className="text-[10px] text-stone-400">
                      RFID / Barcode: {selectedStudentForDossier.studentId} · Valid 2026–2027
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentForIDCard(selectedStudentForDossier)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  <span>View / Generate ID Card</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedStudentForIDCard(selectedStudentForDossier)}
                className="px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <CreditCard className="w-4 h-4 text-stone-950" />
                <span>Open ID Card Mockup</span>
              </button>

              <button
                onClick={() => setSelectedStudentForDossier(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 2: COURSE ROSTER ===================== */}
      {selectedCourseForRoster && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="text-xs font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block mb-1">
                  {selectedCourseForRoster.code}
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {selectedCourseForRoster.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Instructor: {selectedCourseForRoster.instructor} · Room: {selectedCourseForRoster.room}
                </p>
              </div>

              <button
                onClick={() => setSelectedCourseForRoster(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Roster list */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-3">
                Officially Enrolled Scholars ({students.filter(s => s.enrolledCourses.includes(selectedCourseForRoster.code)).length})
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {students
                  .filter(s => s.enrolledCourses.includes(selectedCourseForRoster.code))
                  .map(student => (
                    <div key={student.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-stone-50">
                      <div>
                        <div className="font-semibold text-stone-900">{student.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {student.studentId} · {student.grade}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-stone-700">GPA: {student.gpa.toFixed(2)}</div>
                        <div className="text-[11px] text-emerald-600 font-medium">Attn: {student.attendanceRate}%</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-stone-200">
              <button
                onClick={() => setSelectedCourseForRoster(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 3: ENROLL STUDENT FORM ===================== */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-700" />
                <span>Enroll New Scholar Record</span>
              </h3>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Scholar Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. Cordelia Sterling"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newStudent.dateOfBirth}
                    onChange={e => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Division</label>
                  <select
                    value={newStudent.division}
                    onChange={e =>
                      setNewStudent({
                        ...newStudent,
                        division: e.target.value as StudentRecord['division']
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  >
                    <option value="Upper School">Upper School (9-12)</option>
                    <option value="Middle School">Middle School (6-8)</option>
                    <option value="Lower School">Lower School (K-5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Grade Level</label>
                  <select
                    value={newStudent.grade}
                    onChange={e => setNewStudent({ ...newStudent, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  >
                    <option value="Grade 12">Grade 12</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Assigned Faculty Advisor</label>
                  <input
                    type="text"
                    value={newStudent.advisor}
                    onChange={e => setNewStudent({ ...newStudent, advisor: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Parent / Guardian Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.parentGuardian}
                    onChange={e => setNewStudent({ ...newStudent, parentGuardian: e.target.value })}
                    placeholder="e.g. Katherine Sterling"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Parent Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newStudent.parentEmail}
                    onChange={e => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Emergency Phone Contact</label>
                  <input
                    type="tel"
                    value={newStudent.emergencyPhone}
                    onChange={e => setNewStudent({ ...newStudent, emergencyPhone: e.target.value })}
                    placeholder="(555) 234-5678"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Medical & Dietary Considerations</label>
                <textarea
                  rows={2}
                  value={newStudent.medicalNotes}
                  onChange={e => setNewStudent({ ...newStudent, medicalNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                >
                  Complete Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL 4: ADD COURSE FORM ===================== */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>Create New Class Course</span>
              </h3>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.code}
                    onChange={e => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BIO-301"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.name}
                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                    placeholder="e.g. AP Molecular Biology"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Department</label>
                  <select
                    value={newCourse.department}
                    onChange={e => setNewCourse({ ...newCourse, department: e.target.value })}
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
                  <label className="block text-stone-700 font-medium mb-1">Assigned Instructor *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.instructor}
                    onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    placeholder="e.g. Dr. Arthur Vance"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Classroom / Hall</label>
                  <input
                    type="text"
                    value={newCourse.room}
                    onChange={e => setNewCourse({ ...newCourse, room: e.target.value })}
                    placeholder="e.g. Science Wing Lab 3"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Schedule Slot</label>
                  <input
                    type="text"
                    value={newCourse.schedule}
                    onChange={e => setNewCourse({ ...newCourse, schedule: e.target.value })}
                    placeholder="e.g. Tue / Thu · 10:10 - 11:20"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Academic Credit Units</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="4.0"
                  value={newCourse.credits}
                  onChange={e => setNewCourse({ ...newCourse, credits: parseFloat(e.target.value) || 1.0 })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                >
                  Publish Course to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL 4: STUDENT ID CARD CREDENTIAL MOCKUP ===================== */}
      {selectedStudentForIDCard && (
        <StudentIDCardModal
          isOpen={!!selectedStudentForIDCard}
          onClose={() => setSelectedStudentForIDCard(null)}
          student={selectedStudentForIDCard}
        />
      )}
    </div>
  );
};
