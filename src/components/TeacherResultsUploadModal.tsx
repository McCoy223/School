import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Award,
  Users,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  FileText,
  Percent,
  RefreshCw
} from 'lucide-react';
import {
  FacultyMember,
  Course,
  StudentRecord,
  ClassStudentResult,
  TeacherResultUploadBatch
} from '../types';

interface TeacherResultsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  facultyList: FacultyMember[];
  initialFacultyId?: string;
  courses: Course[];
  students: StudentRecord[];
  onUploadBatch: (batch: TeacherResultUploadBatch) => void;
}

export const TeacherResultsUploadModal: React.FC<TeacherResultsUploadModalProps> = ({
  isOpen,
  onClose,
  facultyList,
  initialFacultyId,
  courses,
  students,
  onUploadBatch
}) => {
  // Selected Teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    initialFacultyId || facultyList[0]?.id || ''
  );

  useEffect(() => {
    if (initialFacultyId) {
      setSelectedTeacherId(initialFacultyId);
    } else if (facultyList.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(facultyList[0].id);
    }
  }, [initialFacultyId, facultyList]);

  const activeTeacher = useMemo(() => {
    return facultyList.find(f => f.id === selectedTeacherId) || facultyList[0];
  }, [facultyList, selectedTeacherId]);

  // Find courses assigned to or taught by this teacher
  const teacherCourses = useMemo(() => {
    if (!activeTeacher) return [];
    return courses.filter(
      c =>
        c.instructorId === activeTeacher.id ||
        c.instructor.toLowerCase().includes(activeTeacher.name.toLowerCase()) ||
        activeTeacher.coursesTaught.some(
          ct => c.code.includes(ct) || c.name.toLowerCase().includes(ct.toLowerCase())
        )
    );
  }, [courses, activeTeacher]);

  // Fallback to all courses if teacher has none mapped
  const availableCourses = teacherCourses.length > 0 ? teacherCourses : courses;

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    availableCourses[0]?.code || ''
  );

  // Sync course when teacher changes
  useEffect(() => {
    if (availableCourses.length > 0) {
      const match = availableCourses.find(c => c.code === selectedCourseCode);
      if (!match) {
        setSelectedCourseCode(availableCourses[0].code);
      }
    }
  }, [availableCourses, selectedCourseCode]);

  const activeCourse = useMemo(() => {
    return availableCourses.find(c => c.code === selectedCourseCode) || availableCourses[0];
  }, [availableCourses, selectedCourseCode]);

  // Find students enrolled in this course
  const enrolledStudents = useMemo(() => {
    if (!activeCourse) return [];
    const directMatches = students.filter(s =>
      s.enrolledCourses.includes(activeCourse.code)
    );
    // If none explicitly mapped, provide the upper/middle division scholars so teacher can grade immediately
    if (directMatches.length > 0) return directMatches;
    return students.slice(0, 4);
  }, [students, activeCourse]);

  // Assessment Details
  const [assessmentTitle, setAssessmentTitle] = useState('Term Examination I');
  const [assessmentType, setAssessmentType] = useState<TeacherResultUploadBatch['assessmentType']>('Term Assessment');
  const [academicTerm, setAcademicTerm] = useState('Fall Term 2026');
  const [inputMode, setInputMode] = useState<'interactive' | 'csv'>('interactive');

  // Grades entry matrix state
  const [rosterGrades, setRosterGrades] = useState<Record<string, { score: number; remarks: string }>>({});

  // Initialize or re-sync roster grades when course or students change
  useEffect(() => {
    const initialGrades: Record<string, { score: number; remarks: string }> = {};
    enrolledStudents.forEach(s => {
      // If student already has a grade or use reasonable baseline
      initialGrades[s.studentId] = {
        score: rosterGrades[s.studentId]?.score ?? 92,
        remarks: rosterGrades[s.studentId]?.remarks ?? 'Demonstrates solid mastery of core concepts.'
      };
    });
    setRosterGrades(initialGrades);
  }, [enrolledStudents]);

  // Helper: score to letter grade
  const scoreToLetterGrade = (score: number): string => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 65) return 'D';
    return 'F';
  };

  // CSV Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [parsedCsvRecords, setParsedCsvRecords] = useState<ClassStudentResult[]>([]);

  // Computed summary metrics
  const currentRecords: ClassStudentResult[] = useMemo(() => {
    if (inputMode === 'csv' && parsedCsvRecords.length > 0) {
      return parsedCsvRecords;
    }

    return enrolledStudents.map(s => {
      const g = rosterGrades[s.studentId] || { score: 90, remarks: '' };
      return {
        studentId: s.studentId,
        studentName: s.name,
        score: g.score,
        letterGrade: scoreToLetterGrade(g.score),
        remarks: g.remarks
      };
    });
  }, [inputMode, parsedCsvRecords, enrolledStudents, rosterGrades]);

  const metrics = useMemo(() => {
    if (currentRecords.length === 0) {
      return { avg: 0, high: 0, low: 0, passCount: 0 };
    }
    const scores = currentRecords.map(r => r.score);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = parseFloat((sum / scores.length).toFixed(1));
    const high = Math.max(...scores);
    const low = Math.min(...scores);
    const passCount = scores.filter(s => s >= 65).length;
    return { avg, high, low, passCount };
  }, [currentRecords]);

  // Download sample CSV template
  const handleDownloadCsvTemplate = () => {
    const headers = ['StudentID', 'StudentName', 'Score', 'Remarks'];
    const rows = enrolledStudents.map(s => [
      s.studentId,
      `"${s.name}"`,
      '95',
      `"Outstanding performance on ${assessmentTitle}."`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${activeCourse?.code || 'CLASS'}_Results_Template.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse uploaded CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setCsvError(null);

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File is empty.');

        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          throw new Error('CSV must contain a header row and at least one student result row.');
        }

        const dataRows = lines.slice(1);
        const parsed: ClassStudentResult[] = [];

        dataRows.forEach((row, idx) => {
          // split commas while preserving quoted strings
          const regex = /(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g;
          const cols: string[] = [];
          let match;
          while ((match = regex.exec(row)) !== null) {
            let val = match[1] || '';
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1).replace(/""/g, '"');
            }
            cols.push(val.trim());
          }

          if (cols.length >= 3) {
            const rawId = cols[0];
            const rawName = cols[1];
            const scoreNum = parseFloat(cols[2]) || 0;
            const remarks = cols[3] || 'Uploaded from teacher marksheet.';

            parsed.push({
              studentId: rawId,
              studentName: rawName || 'Scholar',
              score: Math.min(100, Math.max(0, scoreNum)),
              letterGrade: scoreToLetterGrade(scoreNum),
              remarks
            });
          }
        });

        if (parsed.length === 0) {
          throw new Error('No valid student result entries could be read from CSV.');
        }

        setParsedCsvRecords(parsed);
      } catch (err: any) {
        setCsvError(err.message || 'Failed to process CSV file.');
      }
    };
    reader.readAsText(file);
  };

  // Submit & Publish Batch
  const handlePublishBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher || !activeCourse || currentRecords.length === 0) return;

    const newBatch: TeacherResultUploadBatch = {
      id: `batch-${Date.now()}`,
      teacherId: activeTeacher.id,
      teacherName: activeTeacher.name,
      courseCode: activeCourse.code,
      courseName: activeCourse.name,
      term: academicTerm,
      assessmentTitle,
      assessmentType,
      uploadedAt: new Date().toISOString().split('T')[0],
      averageScore: metrics.avg,
      highestScore: metrics.high,
      lowestScore: metrics.low,
      passCount: metrics.passCount,
      totalStudents: currentRecords.length,
      status: 'Published',
      records: currentRecords
    };

    onUploadBatch(newBatch);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-900 text-white rounded-t-2xl flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-stone-950 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
                <span>Faculty Results Dispatch</span>
                <span>·</span>
                <span>Class Students Assessment</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">
                Teacher Class Student Results Upload Desk
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handlePublishBatch} className="p-6 space-y-6 flex-1 text-xs">
          
          {/* Step 1: Select Instructor & Assigned Course */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span>Step 1: Instructor & Class Selection</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Teacher / Instructor *
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-800 font-medium"
                >
                  {facultyList.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.department.split(' & ')[0]})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  Office: {activeTeacher?.officeRoom} · {activeTeacher?.email}
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Assigned Class / Course *
                </label>
                <select
                  value={selectedCourseCode}
                  onChange={e => setSelectedCourseCode(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-800 font-medium"
                >
                  {availableCourses.map(course => (
                    <option key={course.code} value={course.code}>
                      {course.code}: {course.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  Schedule: {activeCourse?.schedule} ({enrolledStudents.length} Enrolled Scholars)
                </p>
              </div>
            </div>

            {/* Assessment Meta Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-200">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  required
                  value={assessmentTitle}
                  onChange={e => setAssessmentTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination: Mechanics"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Assessment Category
                </label>
                <select
                  value={assessmentType}
                  onChange={e =>
                    setAssessmentType(
                      e.target.value as TeacherResultUploadBatch['assessmentType']
                    )
                  }
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                >
                  <option value="Term Assessment">Term Assessment</option>
                  <option value="Midterm Exam">Midterm Exam</option>
                  <option value="Final Exam">Final Exam</option>
                  <option value="Coursework Project">Coursework Project</option>
                  <option value="Laboratory Practical">Laboratory Practical</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Academic Term
                </label>
                <input
                  type="text"
                  value={academicTerm}
                  onChange={e => setAcademicTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Input Method Switcher */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-stone-500" />
              <span>Step 2: Enter Scores & Feedback</span>
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setInputMode('interactive')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  inputMode === 'interactive'
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Interactive Roster Matrix
              </button>
              <button
                type="button"
                onClick={() => setInputMode('csv')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  inputMode === 'csv'
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Upload CSV / Excel
              </button>
            </div>
          </div>

          {/* MODE A: Interactive Roster Matrix */}
          {inputMode === 'interactive' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-stone-500 text-[11px]">
                <span>
                  Enter individual scores (0-100) and teacher feedback for each enrolled scholar.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated: Record<string, { score: number; remarks: string }> = {};
                      enrolledStudents.forEach(s => {
                        updated[s.studentId] = {
                          score: 95,
                          remarks: 'Exemplary achievement on examination.'
                        };
                      });
                      setRosterGrades(updated);
                    }}
                    className="text-stone-700 hover:text-stone-950 font-medium underline cursor-pointer"
                  >
                    Set all to 95%
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download CSV Template</span>
                  </button>
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px]">
                      <th className="py-2.5 px-3">Student Name & ID</th>
                      <th className="py-2.5 px-3 w-28">Score (0-100)</th>
                      <th className="py-2.5 px-3 w-20 text-center">Grade</th>
                      <th className="py-2.5 px-3">Teacher Remarks / Academic Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {enrolledStudents.map(student => {
                      const cur = rosterGrades[student.studentId] || { score: 90, remarks: '' };
                      const letter = scoreToLetterGrade(cur.score);

                      return (
                        <tr key={student.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-stone-900">{student.name}</div>
                            <div className="text-[11px] font-mono text-stone-500">
                              {student.studentId} · {student.grade}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={cur.score}
                                onChange={e => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setRosterGrades(prev => ({
                                    ...prev,
                                    [student.studentId]: {
                                      ...cur,
                                      score: Math.min(100, Math.max(0, val))
                                    }
                                  }));
                                }}
                                className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs font-mono font-bold text-stone-900"
                              />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-[11px]">
                                %
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                cur.score >= 90
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : cur.score >= 80
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {letter}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={cur.remarks}
                              onChange={e => {
                                setRosterGrades(prev => ({
                                  ...prev,
                                  [student.studentId]: {
                                    ...cur,
                                    remarks: e.target.value
                                  }
                                }));
                              }}
                              placeholder="Add teacher evaluation comments..."
                              className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODE B: CSV Upload */}
          {inputMode === 'csv' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-stone-300 hover:border-amber-400 rounded-xl p-8 text-center transition-colors bg-stone-50/50">
                <FileSpreadsheet className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-stone-900 mb-1">
                  Upload Class Marks Spreadsheet (.csv)
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-4">
                  Drag and drop a formatted CSV marksheet, or download our tailored roster template containing enrolled students.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Browse Local File
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                    <span>Download Roster CSV Template</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {csvFileName && (
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Uploaded: {csvFileName} ({parsedCsvRecords.length} records parsed)</span>
                  </div>
                )}

                {csvError && (
                  <div className="mt-3 text-xs text-red-600 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{csvError}</span>
                  </div>
                )}
              </div>

              {parsedCsvRecords.length > 0 && (
                <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-stone-100 px-3 py-2 font-semibold text-stone-700 text-xs">
                    Parsed CSV Data Preview
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                        <th className="py-2 px-3">Student ID</th>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Score</th>
                        <th className="py-2 px-3">Grade</th>
                        <th className="py-2 px-3">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {parsedCsvRecords.map((r, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-mono">{r.studentId}</td>
                          <td className="py-2 px-3 font-semibold">{r.studentName}</td>
                          <td className="py-2 px-3 font-mono">{r.score}%</td>
                          <td className="py-2 px-3 font-mono font-bold text-amber-800">{r.letterGrade}</td>
                          <td className="py-2 px-3 text-stone-600">{r.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Real-time Summary Statistics Card */}
          <div className="bg-stone-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase font-semibold text-amber-300 tracking-wider">
                Batch Statistical Summary
              </div>
              <div className="text-sm font-semibold text-stone-200 mt-0.5">
                {activeCourse?.code} · {assessmentTitle}
              </div>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div>
                <div className="text-[10px] uppercase text-stone-400">Class Average</div>
                <div className="text-base font-bold font-mono text-amber-300">{metrics.avg}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-stone-400">Top Score</div>
                <div className="text-base font-bold font-mono text-emerald-400">{metrics.high}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-stone-400">Lowest Score</div>
                <div className="text-base font-bold font-mono text-stone-300">{metrics.low}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-stone-400">Passing Rate</div>
                <div className="text-base font-bold font-mono text-white">
                  {currentRecords.length > 0
                    ? Math.round((metrics.passCount / currentRecords.length) * 100)
                    : 100}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <Award className="w-4 h-4 text-stone-950" />
              <span>Publish & Commit Results to Gradebook</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
