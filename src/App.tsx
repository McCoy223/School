/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './components/DashboardPage';
import { StudentClassPage } from './components/StudentClassPage';
import { TeachersPage } from './components/TeachersPage';
import { SchoolManagementSystem } from './components/SchoolManagementSystem';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { SchoolAnnouncementsModal } from './components/SchoolAnnouncementsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import {
  INITIAL_FACULTY,
  INITIAL_EVENTS,
  STUDENT_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  DEFAULT_SITE_SETTINGS,
  INITIAL_INQUIRIES,
  QUICK_STATS,
  INITIAL_STUDENT_RECORDS,
  INITIAL_STAFF_RECORDS,
  INITIAL_FEE_INVOICES,
  INITIAL_TIMETABLE_SLOTS,
  INITIAL_RESULT_BATCHES
} from './data/mockData';
import {
  FacultyMember,
  SchoolEvent,
  Course,
  Assignment,
  SchoolAnnouncement,
  SiteSettings,
  AdmissionsInquiry,
  QuickStat,
  StudentRecord,
  StaffRecord,
  FeeInvoice,
  TimetableSlot,
  TeacherResultUploadBatch,
  AppPage
} from './types';

export default function App() {
  // Navigation: strictly 5 core pages as requested
  const [activePage, setActivePage] = useState<AppPage>('dashboard');

  // School Datasets & Operational State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [quickStats, setQuickStats] = useState<QuickStat[]>(QUICK_STATS);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(INITIAL_FACULTY);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENT_RECORDS);
  const [courses, setCourses] = useState<Course[]>(STUDENT_COURSES);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [staff, setStaff] = useState<StaffRecord[]>(INITIAL_STAFF_RECORDS);
  const [invoices, setInvoices] = useState<FeeInvoice[]>(INITIAL_FEE_INVOICES);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE_SLOTS);
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [inquiries, setInquiries] = useState<AdmissionsInquiry[]>(INITIAL_INQUIRIES);
  const [resultBatches, setResultBatches] = useState<TeacherResultUploadBatch[]>(INITIAL_RESULT_BATCHES);

  // Global Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Student Handlers
  const handleAddStudent = (
    newStudentData: Omit<StudentRecord, 'id' | 'studentId' | 'attendanceRate' | 'gpa'>
  ) => {
    const nextNum = students.length + 101;
    const studentRecord: StudentRecord = {
      ...newStudentData,
      id: `stu-${nextNum}`,
      studentId: `SA-2026-${nextNum}`,
      attendanceRate: 98.5,
      gpa: 3.85
    };
    setStudents(prev => [studentRecord, ...prev]);
    showToast(`Scholar ${studentRecord.name} enrolled with ID ${studentRecord.studentId}.`);
  };

  const handleUpdateStudent = (updatedStudent: StudentRecord) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
    showToast(`Record for ${updatedStudent.name} updated.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    showToast('Student record deleted from database.');
  };

  // Course Handlers
  const handleAddCourse = (
    newCourseData: Omit<Course, 'id' | 'currentGrade' | 'letterGrade' | 'announcementsCount'>
  ) => {
    const nextCourse: Course = {
      ...newCourseData,
      id: `crs-${Date.now()}`,
      currentGrade: 94.0,
      letterGrade: 'A',
      announcementsCount: 1
    };
    setCourses(prev => [...prev, nextCourse]);
    showToast(`Course ${nextCourse.code} added to academic catalog.`);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    showToast('Course removed from catalog.');
  };

  const handleUpdateCourseGrade = (courseId: string, newGrade: number) => {
    let letter = 'A';
    if (newGrade >= 93) letter = 'A';
    else if (newGrade >= 90) letter = 'A-';
    else if (newGrade >= 87) letter = 'B+';
    else if (newGrade >= 83) letter = 'B';
    else if (newGrade >= 80) letter = 'B-';
    else letter = 'C+';

    setCourses(prev =>
      prev.map(c =>
        c.id === courseId ? { ...c, currentGrade: newGrade, letterGrade: letter } : c
      )
    );
    showToast(`Course grade updated to ${newGrade}% (${letter}).`);
  };

  // Faculty Handlers
  const handleAddFaculty = (newFacultyData: Omit<FacultyMember, 'id'>) => {
    const faculty: FacultyMember = {
      ...newFacultyData,
      id: `fac-${Date.now()}`
    };
    setFacultyList(prev => [...prev, faculty]);
    showToast(`Faculty member ${faculty.name} added.`);
  };

  const handleUpdateFaculty = (updatedFaculty: FacultyMember) => {
    setFacultyList(prev => prev.map(f => (f.id === updatedFaculty.id ? updatedFaculty : f)));
    showToast(`Faculty record for ${updatedFaculty.name} updated.`);
  };

  const handleDeleteFaculty = (id: string) => {
    setFacultyList(prev => prev.filter(f => f.id !== id));
    showToast('Faculty member removed.');
  };

  const handleBookOfficeHours = (facultyId: string, details: any) => {
    const teacher = facultyList.find(f => f.id === facultyId);
    showToast(
      `Office hours booked with ${teacher?.name || 'Faculty'} on ${details.date} at ${details.time}.`
    );
  };

  // Teacher Class Results Upload Handler
  const handleUploadClassResults = (batch: TeacherResultUploadBatch) => {
    setResultBatches(prev => [batch, ...prev]);

    // Recalculate GPA for graded scholars
    setStudents(prev =>
      prev.map(s => {
        const studentResult = batch.records.find(r => r.studentId === s.studentId);
        if (studentResult) {
          let pts = 3.0;
          if (studentResult.score >= 95) pts = 4.0;
          else if (studentResult.score >= 90) pts = 3.85;
          else if (studentResult.score >= 85) pts = 3.5;
          else if (studentResult.score >= 80) pts = 3.0;
          else if (studentResult.score >= 70) pts = 2.5;
          else pts = 2.0;

          const updatedGpa = parseFloat(((s.gpa * 3 + pts) / 4).toFixed(2));
          return { ...s, gpa: updatedGpa };
        }
        return s;
      })
    );

    // Update Course Current Grade & Letter Grade
    setCourses(prev =>
      prev.map(c => {
        if (c.code === batch.courseCode) {
          let letter = 'A';
          if (batch.averageScore >= 97) letter = 'A+';
          else if (batch.averageScore >= 93) letter = 'A';
          else if (batch.averageScore >= 90) letter = 'A-';
          else if (batch.averageScore >= 85) letter = 'B+';
          else if (batch.averageScore >= 80) letter = 'B';
          else letter = 'C+';

          return {
            ...c,
            currentGrade: batch.averageScore,
            letterGrade: letter
          };
        }
        return c;
      })
    );

    showToast(
      `Results for ${batch.courseCode} (${batch.records.length} scholars) published by ${batch.teacherName}!`
    );
  };

  // Staff Handlers
  const handleAddStaff = (newStaffData: Omit<StaffRecord, 'id' | 'staffId'>) => {
    const nextStaff: StaffRecord = {
      ...newStaffData,
      id: `stf-${Date.now()}`,
      staffId: `STAFF-${staff.length + 201}`
    };
    setStaff(prev => [...prev, nextStaff]);
    showToast(`Staff record ${nextStaff.name} created.`);
  };

  // Billing / Invoice Handlers
  const handleAddInvoice = (newInvData: Omit<FeeInvoice, 'id' | 'status'>) => {
    const inv: FeeInvoice = {
      ...newInvData,
      id: `INV-2026-${invoices.length + 401}`,
      status: 'Unpaid'
    };
    setInvoices(prev => [inv, ...prev]);
    showToast(`Invoice ${inv.id} generated for ${inv.studentName}.`);
  };

  const handleRecordPayment = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'Paid',
              paidDate: new Date().toISOString().split('T')[0]
            }
          : inv
      )
    );
    showToast(`Payment recorded for invoice #${invoiceId}. Receipt issued.`);
  };

  // Timetable Handlers
  const handleAddTimetableSlot = (newSlotData: Omit<TimetableSlot, 'id'>) => {
    const slot: TimetableSlot = {
      ...newSlotData,
      id: `slot-${Date.now()}`
    };
    setTimetable(prev => [...prev, slot]);
    showToast(`Schedule period added for ${slot.courseCode}.`);
  };

  // Announcements Handlers
  const handleAddAnnouncement = (newAnn: Omit<SchoolAnnouncement, 'id'>) => {
    const ann: SchoolAnnouncement = {
      ...newAnn,
      id: `ann-${Date.now()}`
    };
    setAnnouncements(prev => [ann, ...prev]);
    showToast(`Bulletin "${ann.title}" broadcast to academy.`);
  };

  const handleUpdateAnnouncement = (updatedAnn: SchoolAnnouncement) => {
    setAnnouncements(prev => prev.map(a => (a.id === updatedAnn.id ? updatedAnn : a)));
    showToast('Bulletin updated.');
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Bulletin deleted.');
  };

  // Events Handlers
  const handleAddEvent = (newEventData: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'userRsvpd'>) => {
    const newEvt: SchoolEvent = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      rsvpCount: 1,
      userRsvpd: true
    };
    setEvents(prev => [newEvt, ...prev]);
    showToast(`Event "${newEvt.title}" added to calendar.`);
  };

  const handleUpdateEvent = (updatedEvt: SchoolEvent) => {
    setEvents(prev => prev.map(e => (e.id === updatedEvt.id ? updatedEvt : e)));
    showToast(`Event "${updatedEvt.title}" updated.`);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Event removed.');
  };

  // Inquiries Handlers
  const handleUpdateInquiryStatus = (id: string, status: AdmissionsInquiry['status']) => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
    showToast(`Inquiry status updated to ${status}.`);
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    showToast('Inquiry removed from ledger.');
  };

  // Settings & Defaults Handlers
  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    showToast('Academy system configuration updated successfully.');
  };

  const handleResetDefaults = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setFacultyList(INITIAL_FACULTY);
    setEvents(INITIAL_EVENTS);
    setCourses(STUDENT_COURSES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setInquiries(INITIAL_INQUIRIES);
    setQuickStats(QUICK_STATS);
    setStudents(INITIAL_STUDENT_RECORDS);
    setStaff(INITIAL_STAFF_RECORDS);
    setInvoices(INITIAL_FEE_INVOICES);
    setTimetable(INITIAL_TIMETABLE_SLOTS);
    showToast('All system configurations restored to baseline.');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 selection:bg-amber-200 selection:text-stone-900">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-amber-300/40 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation - Strictly the 5 pages */}
      <Navbar
        activePage={activePage}
        onSelectPage={page => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
        unreadAnnouncementsCount={announcements.filter(a => a.urgent).length}
        schoolName={siteSettings.schoolName}
      />

      {/* Main Content Area - Strictly switching among the 5 requested pages */}
      <main className="flex-1">
        {activePage === 'dashboard' && (
          <DashboardPage
            settings={siteSettings}
            quickStats={quickStats}
            students={students}
            courses={courses}
            invoices={invoices}
            timetable={timetable}
            announcements={announcements}
            onNavigatePage={page => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
            onRecordPayment={handleRecordPayment}
          />
        )}

        {activePage === 'admin' && (
          <AdminPortal
            settings={siteSettings}
            onUpdateSettings={handleUpdateSettings}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            facultyList={facultyList}
            onAddFaculty={handleAddFaculty}
            onUpdateFaculty={handleUpdateFaculty}
            onDeleteFaculty={handleDeleteFaculty}
            inquiries={inquiries}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onDeleteInquiry={handleDeleteInquiry}
            quickStats={quickStats}
            onUpdateQuickStats={setQuickStats}
            onResetDefaults={handleResetDefaults}
            onViewLiveSite={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'sms' && (
          <SchoolManagementSystem
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            courses={courses}
            onAddCourse={handleAddCourse}
            staff={staff}
            onAddStaff={handleAddStaff}
            invoices={invoices}
            onAddInvoice={handleAddInvoice}
            onRecordPayment={handleRecordPayment}
            timetable={timetable}
            onAddTimetableSlot={handleAddTimetableSlot}
            onUpdateCourseGrade={handleUpdateCourseGrade}
            onExitToPublicSite={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'students' && (
          <StudentClassPage
            students={students}
            courses={courses}
            assignments={assignments}
            resultBatches={resultBatches}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {activePage === 'teachers' && (
          <TeachersPage
            facultyList={facultyList}
            staffRecords={staff}
            courses={courses}
            students={students}
            resultBatches={resultBatches}
            onAddFaculty={handleAddFaculty}
            onBookOfficeHours={handleBookOfficeHours}
            onDeleteFaculty={handleDeleteFaculty}
            onUploadResultsBatch={handleUploadClassResults}
          />
        )}
      </main>

      {/* Global Announcements Modal */}
      <SchoolAnnouncementsModal
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
        announcements={announcements}
      />

      {/* Global Search Directory Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        faculty={facultyList}
        events={events}
        courses={courses}
        announcements={announcements}
        onNavigatePage={page => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* System Footer - Strictly linking to the 5 pages */}
      <Footer
        settings={siteSettings}
        onSelectPage={page => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
      />
    </div>
  );
}
