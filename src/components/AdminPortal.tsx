import React, { useState } from 'react';
import {
  Settings,
  FileText,
  Calendar,
  Users,
  Bell,
  Inbox,
  CheckCircle2,
  Trash2,
  Edit3,
  Plus,
  Save,
  RotateCcw,
  AlertTriangle,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  SiteSettings,
  SchoolAnnouncement,
  SchoolEvent,
  FacultyMember,
  AdmissionsInquiry,
  QuickStat,
  EventCategory
} from '../types';

interface AdminPortalProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  announcements: SchoolAnnouncement[];
  onAddAnnouncement: (ann: Omit<SchoolAnnouncement, 'id'>) => void;
  onUpdateAnnouncement: (ann: SchoolAnnouncement) => void;
  onDeleteAnnouncement: (id: string) => void;
  events: SchoolEvent[];
  onAddEvent: (evt: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'userRsvpd'>) => void;
  onUpdateEvent: (evt: SchoolEvent) => void;
  onDeleteEvent: (id: string) => void;
  facultyList: FacultyMember[];
  onAddFaculty: (faculty: Omit<FacultyMember, 'id'>) => void;
  onUpdateFaculty: (faculty: FacultyMember) => void;
  onDeleteFaculty: (id: string) => void;
  inquiries: AdmissionsInquiry[];
  onUpdateInquiryStatus: (id: string, status: AdmissionsInquiry['status']) => void;
  onDeleteInquiry: (id: string) => void;
  quickStats: QuickStat[];
  onUpdateQuickStats: (stats: QuickStat[]) => void;
  onResetDefaults: () => void;
  onViewLiveSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  settings,
  onUpdateSettings,
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  facultyList,
  onAddFaculty,
  onUpdateFaculty,
  onDeleteFaculty,
  inquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  quickStats,
  onUpdateQuickStats,
  onResetDefaults,
  onViewLiveSite
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'general' | 'announcements' | 'events' | 'faculty' | 'inquiries' | 'stats'>('general');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [localStats, setLocalStats] = useState<QuickStat[]>(quickStats);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Announcement modal state
  const [editingAnnouncement, setEditingAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Academics' | 'Campus Alert' | 'Student Life' | 'Arts & Athletics'>('Academics');
  const [newAnnAuthor, setNewAnnAuthor] = useState('Office of Communications');
  const [newAnnDate, setNewAnnDate] = useState('2026-10-21');
  const [newAnnUrgent, setNewAnnUrgent] = useState(false);
  const [newAnnContent, setNewAnnContent] = useState('');

  // Event modal state
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'academic' as EventCategory,
    date: '2026-11-15',
    time: '14:00 - 15:30',
    location: '',
    building: '',
    organizer: '',
    targetAudience: 'all' as 'all' | 'students' | 'parents' | 'faculty'
  });

  // Faculty modal state
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    title: '',
    department: 'Sciences & Mathematics' as FacultyMember['department'],
    email: '',
    officeRoom: '',
    officeHours: '',
    phone: '',
    bio: '',
    education: '',
    coursesTaught: '',
    consultationAvailable: true
  });

  const triggerNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 2500);
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    triggerNotice('General site settings and hero copy saved successfully!');
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateQuickStats(localStats);
    triggerNotice('Academy KPI metrics updated!');
  };

  // Add / Edit Announcement handlers
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnnouncement) {
      onUpdateAnnouncement(editingAnnouncement);
      setEditingAnnouncement(null);
      triggerNotice('Announcement updated successfully.');
    } else {
      if (!newAnnTitle) return;
      onAddAnnouncement({
        title: newAnnTitle,
        category: newAnnCategory,
        author: newAnnAuthor,
        date: newAnnDate,
        urgent: newAnnUrgent,
        content: newAnnContent
      });
      setIsAddAnnouncementOpen(false);
      setNewAnnTitle('');
      setNewAnnContent('');
      triggerNotice('New announcement published.');
    }
  };

  // Add / Edit Event handlers
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      onUpdateEvent(editingEvent);
      setEditingEvent(null);
      triggerNotice('Event updated.');
    } else {
      if (!eventForm.title) return;
      onAddEvent({
        ...eventForm,
        isPublic: true
      });
      setIsAddEventOpen(false);
      setEventForm({
        title: '',
        description: '',
        category: 'academic',
        date: '2026-11-15',
        time: '14:00 - 15:30',
        location: '',
        building: '',
        organizer: '',
        targetAudience: 'all'
      });
      triggerNotice('New event scheduled on master calendar.');
    }
  };

  // Add / Edit Faculty handlers
  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaculty) {
      onUpdateFaculty(editingFaculty);
      setEditingFaculty(null);
      triggerNotice('Faculty profile updated.');
    } else {
      if (!facultyForm.name) return;
      onAddFaculty({
        name: facultyForm.name,
        title: facultyForm.title,
        department: facultyForm.department,
        email: facultyForm.email,
        officeRoom: facultyForm.officeRoom,
        officeHours: facultyForm.officeHours,
        phone: facultyForm.phone,
        bio: facultyForm.bio,
        education: facultyForm.education.split(',').map(s => s.trim()).filter(Boolean),
        coursesTaught: facultyForm.coursesTaught.split(',').map(s => s.trim()).filter(Boolean),
        consultationAvailable: facultyForm.consultationAvailable,
        avatarColor: 'bg-stone-800'
      });
      setIsAddFacultyOpen(false);
      setFacultyForm({
        name: '',
        title: '',
        department: 'Sciences & Mathematics',
        email: '',
        officeRoom: '',
        officeHours: '',
        phone: '',
        bio: '',
        education: '',
        coursesTaught: '',
        consultationAvailable: true
      });
      triggerNotice('New faculty member added to directory.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      
      {/* Notice alert */}
      {saveSuccessNotice && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-amber-200 text-xs px-4 py-2.5 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* Admin Header Card */}
      <div className="bg-stone-900 text-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Academy Administration & Site Content Management System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Site Administration Console
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Manage website metadata, homepage hero copy, published school bulletins, faculty listings, master events, and incoming prospective student admissions inquiries in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onViewLiveSite}
              className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-200 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </button>
            <button
              onClick={onResetDefaults}
              className="px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset sample data back to standard demo state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-800/90 rounded-lg border border-stone-700/80 mt-6 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('general')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'general' ? 'bg-amber-100 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Site Info & Hero Copy</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('announcements')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'announcements' ? 'bg-amber-100 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Bulletins & Alerts ({announcements.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('events')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'events' ? 'bg-amber-100 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Master Calendar ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('faculty')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'faculty' ? 'bg-amber-100 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Faculty Directory ({facultyList.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('inquiries')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'inquiries' ? 'bg-amber-100 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Admissions Inquiries ({inquiries.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('stats')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'stats' ? 'bg-amber-100 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>KPI Metrics ({quickStats.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SITE INFO & HERO COPY EDITOR */}
      {/* ======================================================== */}
      {activeAdminTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <h3 className="text-lg font-serif font-bold text-stone-950 pb-2 border-b border-stone-200 mb-6">
              Academy Identity & Homepage Copy
            </h3>

            <form onSubmit={handleSaveGeneralSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Academy Name</label>
                  <input
                    type="text"
                    required
                    value={localSettings.schoolName}
                    onChange={(e) => setLocalSettings({ ...localSettings, schoolName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Founded Year</label>
                  <input
                    type="number"
                    required
                    value={localSettings.foundedYear}
                    onChange={(e) => setLocalSettings({ ...localSettings, foundedYear: parseInt(e.target.value) || 1903 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Institutional Motto</label>
                <input
                  type="text"
                  required
                  value={localSettings.motto}
                  onChange={(e) => setLocalSettings({ ...localSettings, motto: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <label className="block font-semibold text-stone-800 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  required
                  value={localSettings.heroHeadline}
                  onChange={(e) => setLocalSettings({ ...localSettings, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs font-serif text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Hero Narrative Subtitle</label>
                <textarea
                  rows={3}
                  required
                  value={localSettings.heroSubtitle}
                  onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Active Term</label>
                  <input
                    type="text"
                    required
                    value={localSettings.termName}
                    onChange={(e) => setLocalSettings({ ...localSettings, termName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Admissions Deadline</label>
                  <input
                    type="text"
                    required
                    value={localSettings.admissionsDeadline}
                    onChange={(e) => setLocalSettings({ ...localSettings, admissionsDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Campus Visiting Hours</label>
                  <input
                    type="text"
                    required
                    value={localSettings.visitingHours}
                    onChange={(e) => setLocalSettings({ ...localSettings, visitingHours: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Switchboard Phone</label>
                  <input
                    type="text"
                    required
                    value={localSettings.phone}
                    onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">24/7 Security Emergency</label>
                  <input
                    type="text"
                    required
                    value={localSettings.emergencyPhone}
                    onChange={(e) => setLocalSettings({ ...localSettings, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Top Banner Alert Link Text</label>
                <input
                  type="text"
                  required
                  value={localSettings.topRibbonAlert}
                  onChange={(e) => setLocalSettings({ ...localSettings, topRibbonAlert: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Official Accreditation Statement</label>
                <input
                  type="text"
                  required
                  value={localSettings.accreditationText}
                  onChange={(e) => setLocalSettings({ ...localSettings, accreditationText: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Site Updates</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Hero Preview</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-3">
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                  {localSettings.schoolName} · Founded {localSettings.foundedYear}
                </div>
                <h4 className="text-base font-serif font-bold text-stone-950 leading-snug">
                  {localSettings.heroHeadline}
                </h4>
                <p className="text-stone-600 line-clamp-3 text-[11px]">
                  {localSettings.heroSubtitle}
                </p>
                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
                  <div><strong>Term:</strong> {localSettings.termName}</div>
                  <div><strong>Deadline:</strong> {localSettings.admissionsDeadline}</div>
                  <div><strong>Hours:</strong> {localSettings.visitingHours}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Admin Note:</strong> Modifications made in this administration console update the live in-memory state of the entire site, including top navigation, hero ribbon, admissions forms, and calendar headers immediately.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ANNOUNCEMENTS & BULLETINS CMS */}
      {/* ======================================================== */}
      {activeAdminTab === 'announcements' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-950">
                Official Academy Bulletins Manager
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Create, revise, and dispatch priority alerts and administrative announcements.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingAnnouncement(null);
                setIsAddAnnouncementOpen(true);
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </button>
          </div>

          {/* Bulletins Table */}
          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <tr>
                  <th className="p-3">Title & Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Urgency</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {announcements.map(ann => (
                  <tr key={ann.id} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{ann.title}</div>
                      <div className="text-stone-500 text-[11px]">{ann.category}</div>
                    </td>
                    <td className="p-3 text-stone-600 font-medium tabular-nums">{ann.date}</td>
                    <td className="p-3 text-stone-600">{ann.author}</td>
                    <td className="p-3">
                      {ann.urgent ? (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Urgent
                        </span>
                      ) : (
                        <span className="text-stone-500 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingAnnouncement(ann)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                          title="Edit bulletin"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAnnouncement(ann.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Delete bulletin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add / Edit Announcement Modal */}
          {(isAddAnnouncementOpen || editingAnnouncement) && (
            <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="text-base font-serif font-bold text-stone-950">
                    {editingAnnouncement ? 'Edit Announcement' : 'Publish New Announcement'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddAnnouncementOpen(false);
                      setEditingAnnouncement(null);
                    }}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveAnnouncement} className="py-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingAnnouncement ? editingAnnouncement.title : newAnnTitle}
                      onChange={(e) => {
                        if (editingAnnouncement) {
                          setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value });
                        } else {
                          setNewAnnTitle(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Category</label>
                      <select
                        value={editingAnnouncement ? editingAnnouncement.category : newAnnCategory}
                        onChange={(e) => {
                          const cat = e.target.value as any;
                          if (editingAnnouncement) {
                            setEditingAnnouncement({ ...editingAnnouncement, category: cat });
                          } else {
                            setNewAnnCategory(cat);
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                      >
                        <option value="Academics">Academics</option>
                        <option value="Campus Alert">Campus Alert</option>
                        <option value="Student Life">Student Life</option>
                        <option value="Arts & Athletics">Arts & Athletics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={editingAnnouncement ? editingAnnouncement.date : newAnnDate}
                        onChange={(e) => {
                          if (editingAnnouncement) {
                            setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value });
                          } else {
                            setNewAnnDate(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Author / Department</label>
                    <input
                      type="text"
                      required
                      value={editingAnnouncement ? editingAnnouncement.author : newAnnAuthor}
                      onChange={(e) => {
                        if (editingAnnouncement) {
                          setEditingAnnouncement({ ...editingAnnouncement, author: e.target.value });
                        } else {
                          setNewAnnAuthor(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="urgent-toggle"
                      checked={editingAnnouncement ? editingAnnouncement.urgent : newAnnUrgent}
                      onChange={(e) => {
                        if (editingAnnouncement) {
                          setEditingAnnouncement({ ...editingAnnouncement, urgent: e.target.checked });
                        } else {
                          setNewAnnUrgent(e.target.checked);
                        }
                      }}
                      className="w-4 h-4 rounded text-stone-900"
                    />
                    <label htmlFor="urgent-toggle" className="font-semibold text-stone-800 text-xs">
                      Mark as Urgent Notice (triggers top notification alert)
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Announcement Body</label>
                    <textarea
                      rows={4}
                      required
                      value={editingAnnouncement ? editingAnnouncement.content : newAnnContent}
                      onChange={(e) => {
                        if (editingAnnouncement) {
                          setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value });
                        } else {
                          setNewAnnContent(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs leading-relaxed"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddAnnouncementOpen(false);
                        setEditingAnnouncement(null);
                      }}
                      className="px-3.5 py-2 text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-md hover:bg-stone-800"
                    >
                      Save Bulletin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MASTER EVENT MANAGER (CALENDAR CMS) */}
      {/* ======================================================== */}
      {activeAdminTab === 'events' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-950">
                Master Calendar & Event Management
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Schedule exams, athletic regattas, galas, and open house sessions.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsAddEventOpen(true);
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Calendar Event</span>
            </button>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <tr>
                  <th className="p-3">Title & Category</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Audience</th>
                  <th className="p-3">RSVPs</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {events.map(evt => (
                  <tr key={evt.id} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{evt.title}</div>
                      <div className="text-stone-500 text-[11px] capitalize">{evt.category} · {evt.organizer}</div>
                    </td>
                    <td className="p-3 text-stone-700">
                      <div className="font-medium tabular-nums">{evt.date}</div>
                      <div className="text-[11px] text-stone-500">{evt.time}</div>
                    </td>
                    <td className="p-3 text-stone-600">
                      <div>{evt.location}</div>
                      <div className="text-[11px] text-stone-500">{evt.building}</div>
                    </td>
                    <td className="p-3 text-stone-600 capitalize">
                      {evt.targetAudience}
                    </td>
                    <td className="p-3 font-semibold text-stone-900 tabular-nums">
                      {evt.rsvpCount}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingEvent(evt)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                          title="Edit event"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEvent(evt.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add / Edit Event Modal */}
          {(isAddEventOpen || editingEvent) && (
            <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="text-base font-serif font-bold text-stone-950">
                    {editingEvent ? 'Edit Event' : 'Add Calendar Event'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddEventOpen(false);
                      setEditingEvent(null);
                    }}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEvent} className="py-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      value={editingEvent ? editingEvent.title : eventForm.title}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({ ...editingEvent, title: e.target.value });
                        } else {
                          setEventForm({ ...eventForm, title: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Category</label>
                      <select
                        value={editingEvent ? editingEvent.category : eventForm.category}
                        onChange={(e) => {
                          const cat = e.target.value as any;
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, category: cat });
                          } else {
                            setEventForm({ ...eventForm, category: cat });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                      >
                        <option value="academic">Academics & Exams</option>
                        <option value="arts">Arts & Music</option>
                        <option value="athletics">Athletics</option>
                        <option value="community">Community</option>
                        <option value="admissions">Admissions</option>
                        <option value="pta">Parents & PTA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Target Audience</label>
                      <select
                        value={editingEvent ? editingEvent.targetAudience : eventForm.targetAudience}
                        onChange={(e) => {
                          const aud = e.target.value as any;
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, targetAudience: aud });
                          } else {
                            setEventForm({ ...eventForm, targetAudience: aud });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                      >
                        <option value="all">All Community</option>
                        <option value="students">Students Only</option>
                        <option value="parents">Parents Only</option>
                        <option value="faculty">Faculty Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={editingEvent ? editingEvent.date : eventForm.date}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, date: e.target.value });
                          } else {
                            setEventForm({ ...eventForm, date: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Time</label>
                      <input
                        type="text"
                        required
                        value={editingEvent ? editingEvent.time : eventForm.time}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, time: e.target.value });
                          } else {
                            setEventForm({ ...eventForm, time: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Location / Venue</label>
                      <input
                        type="text"
                        required
                        value={editingEvent ? editingEvent.location : eventForm.location}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, location: e.target.value });
                          } else {
                            setEventForm({ ...eventForm, location: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Building</label>
                      <input
                        type="text"
                        value={editingEvent ? editingEvent.building : eventForm.building}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, building: e.target.value });
                          } else {
                            setEventForm({ ...eventForm, building: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Organizer / Department</label>
                    <input
                      type="text"
                      value={editingEvent ? editingEvent.organizer : eventForm.organizer}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({ ...editingEvent, organizer: e.target.value });
                        } else {
                          setEventForm({ ...eventForm, organizer: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingEvent ? editingEvent.description : eventForm.description}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({ ...editingEvent, description: e.target.value });
                        } else {
                          setEventForm({ ...eventForm, description: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddEventOpen(false);
                        setEditingEvent(null);
                      }}
                      className="px-3.5 py-2 text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-md hover:bg-stone-800"
                    >
                      Save Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FACULTY & STAFF DIRECTORY CMS */}
      {/* ======================================================== */}
      {activeAdminTab === 'faculty' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-950">
                Faculty & Department Chairs Directory
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Maintain instructional rosters, office hour availability, and faculty credentials.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingFaculty(null);
                setIsAddFacultyOpen(true);
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <tr>
                  <th className="p-3">Faculty Scholar</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Office Location & Hours</th>
                  <th className="p-3">Consultations</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {facultyList.map(f => (
                  <tr key={f.id} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{f.name}</div>
                      <div className="text-stone-500 text-[11px]">{f.title}</div>
                      <div className="text-stone-400 text-[10px]">{f.email}</div>
                    </td>
                    <td className="p-3 text-stone-700 font-medium">
                      {f.department}
                    </td>
                    <td className="p-3 text-stone-600">
                      <div>{f.officeRoom}</div>
                      <div className="text-[11px] text-stone-500">{f.officeHours}</div>
                    </td>
                    <td className="p-3">
                      {f.consultationAvailable ? (
                        <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Appointment only</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingFaculty(f)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                          title="Edit faculty"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteFaculty(f.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Remove faculty"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add / Edit Faculty Modal */}
          {(isAddFacultyOpen || editingFaculty) && (
            <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="text-base font-serif font-bold text-stone-950">
                    {editingFaculty ? 'Edit Faculty Profile' : 'Add New Faculty Member'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddFacultyOpen(false);
                      setEditingFaculty(null);
                    }}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveFaculty} className="py-4 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editingFaculty ? editingFaculty.name : facultyForm.name}
                        onChange={(e) => {
                          if (editingFaculty) {
                            setEditingFaculty({ ...editingFaculty, name: e.target.value });
                          } else {
                            setFacultyForm({ ...facultyForm, name: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Academic Department</label>
                      <select
                        value={editingFaculty ? editingFaculty.department : facultyForm.department}
                        onChange={(e) => {
                          const d = e.target.value as any;
                          if (editingFaculty) {
                            setEditingFaculty({ ...editingFaculty, department: d });
                          } else {
                            setFacultyForm({ ...facultyForm, department: d });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs bg-white"
                      >
                        <option value="Sciences & Mathematics">Sciences & Mathematics</option>
                        <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                        <option value="World Languages">World Languages</option>
                        <option value="Fine & Performing Arts">Fine & Performing Arts</option>
                        <option value="Athletics & Physical Education">Athletics & Physical Education</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Title / Chair Designation</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty ? editingFaculty.title : facultyForm.title}
                      onChange={(e) => {
                        if (editingFaculty) {
                          setEditingFaculty({ ...editingFaculty, title: e.target.value });
                        } else {
                          setFacultyForm({ ...facultyForm, title: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Institutional Email</label>
                      <input
                        type="email"
                        required
                        value={editingFaculty ? editingFaculty.email : facultyForm.email}
                        onChange={(e) => {
                          if (editingFaculty) {
                            setEditingFaculty({ ...editingFaculty, email: e.target.value });
                          } else {
                            setFacultyForm({ ...facultyForm, email: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Phone Extension</label>
                      <input
                        type="text"
                        value={editingFaculty ? editingFaculty.phone : facultyForm.phone}
                        onChange={(e) => {
                          if (editingFaculty) {
                            setEditingFaculty({ ...editingFaculty, phone: e.target.value });
                          } else {
                            setFacultyForm({ ...facultyForm, phone: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Office Room</label>
                      <input
                        type="text"
                        required
                        value={editingFaculty ? editingFaculty.officeRoom : facultyForm.officeRoom}
                        onChange={(e) => {
                          if (editingFaculty) {
                            setEditingFaculty({ ...editingFaculty, officeRoom: e.target.value });
                          } else {
                            setFacultyForm({ ...facultyForm, officeRoom: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Office Hours Schedule</label>
                      <input
                        type="text"
                        required
                        value={editingFaculty ? editingFaculty.officeHours : facultyForm.officeHours}
                        onChange={(e) => {
                          if (editingFaculty) {
                            setEditingFaculty({ ...editingFaculty, officeHours: e.target.value });
                          } else {
                            setFacultyForm({ ...facultyForm, officeHours: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Academic Degrees (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ph.D. Physics (Harvard), B.S. (MIT)"
                      value={
                        editingFaculty
                          ? editingFaculty.education.join(', ')
                          : facultyForm.education
                      }
                      onChange={(e) => {
                        if (editingFaculty) {
                          setEditingFaculty({
                            ...editingFaculty,
                            education: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          });
                        } else {
                          setFacultyForm({ ...facultyForm, education: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Courses Taught (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. AP Physics C, Classical Mechanics, Quantum Theory"
                      value={
                        editingFaculty
                          ? editingFaculty.coursesTaught.join(', ')
                          : facultyForm.coursesTaught
                      }
                      onChange={(e) => {
                        if (editingFaculty) {
                          setEditingFaculty({
                            ...editingFaculty,
                            coursesTaught: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          });
                        } else {
                          setFacultyForm({ ...facultyForm, coursesTaught: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Biographical Statement</label>
                    <textarea
                      rows={3}
                      value={editingFaculty ? editingFaculty.bio : facultyForm.bio}
                      onChange={(e) => {
                        if (editingFaculty) {
                          setEditingFaculty({ ...editingFaculty, bio: e.target.value });
                        } else {
                          setFacultyForm({ ...facultyForm, bio: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="fac-consult-toggle"
                      checked={
                        editingFaculty
                          ? editingFaculty.consultationAvailable
                          : facultyForm.consultationAvailable
                      }
                      onChange={(e) => {
                        if (editingFaculty) {
                          setEditingFaculty({
                            ...editingFaculty,
                            consultationAvailable: e.target.checked
                          });
                        } else {
                          setFacultyForm({
                            ...facultyForm,
                            consultationAvailable: e.target.checked
                          });
                        }
                      }}
                      className="w-4 h-4 rounded text-stone-900"
                    />
                    <label htmlFor="fac-consult-toggle" className="font-semibold text-stone-800 text-xs">
                      Enable online office consultation bookings for this faculty member
                    </label>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddFacultyOpen(false);
                        setEditingFaculty(null);
                      }}
                      className="px-3.5 py-2 text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-md hover:bg-stone-800"
                    >
                      Save Faculty Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ADMISSIONS INQUIRIES DESK */}
      {/* ======================================================== */}
      {activeAdminTab === 'inquiries' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-950">
                Prospective Student Admissions Inquiries
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Incoming requests submitted via the public admissions inquiry portal.
              </p>
            </div>
            <div className="text-xs text-stone-600">
              Total Inquiries: <strong className="text-stone-900 tabular-nums">{inquiries.length}</strong>
            </div>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <tr>
                  <th className="p-3">Applicant & Level</th>
                  <th className="p-3">Parent Contact</th>
                  <th className="p-3">Inquiry Notes</th>
                  <th className="p-3">Status Workflow</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {inquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{inq.applicantName}</div>
                      <div className="text-stone-500 text-[11px]">{inq.gradeLevel}</div>
                      <div className="text-stone-400 text-[10px] tabular-nums mt-0.5">Recv: {inq.submittedAt}</div>
                    </td>
                    <td className="p-3 text-stone-700">
                      <div>{inq.parentName}</div>
                      <a href={`mailto:${inq.parentEmail}`} className="text-stone-500 text-[11px] hover:underline">
                        {inq.parentEmail}
                      </a>
                    </td>
                    <td className="p-3 text-stone-600 max-w-xs">
                      <p className="line-clamp-2">{inq.inquiryNotes}</p>
                    </td>
                    <td className="p-3">
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2 py-1 rounded border ${
                          inq.status === 'new'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : inq.status === 'tour-scheduled'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : inq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        <option value="new">New Inquiry</option>
                        <option value="contacted">Contacted</option>
                        <option value="tour-scheduled">Tour Scheduled</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteInquiry(inq.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. KPI METRICS EDITOR */}
      {/* ======================================================== */}
      {activeAdminTab === 'stats' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-lg font-serif font-bold text-stone-950">
              Institutional KPI Strip Editor
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              These metrics appear in the prominent 4-column banner immediately beneath the homepage hero.
            </p>
          </div>

          <form onSubmit={handleSaveStats} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {localStats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                    Metric 0{idx + 1}
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">Value (e.g. 100%, 8:1)</label>
                    <input
                      type="text"
                      required
                      value={stat.value}
                      onChange={(e) => {
                        const next = [...localStats];
                        next[idx].value = e.target.value;
                        setLocalStats(next);
                      }}
                      className="w-full px-2.5 py-1.5 font-bold font-serif text-sm border border-stone-300 rounded bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">Label</label>
                    <input
                      type="text"
                      required
                      value={stat.label}
                      onChange={(e) => {
                        const next = [...localStats];
                        next[idx].label = e.target.value;
                        setLocalStats(next);
                      }}
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">Context Description</label>
                    <input
                      type="text"
                      required
                      value={stat.detail}
                      onChange={(e) => {
                        const next = [...localStats];
                        next[idx].detail = e.target.value;
                        setLocalStats(next);
                      }}
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save KPI Strip</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
