import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Globe,
  Calendar,
  Users,
  Image as ImageIcon,
  Inbox,
  Palette,
  Settings,
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
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  List,
  Quote,
  Heading2,
  Search,
  Filter,
  Check,
  Phone,
  Mail,
  GraduationCap,
  Building,
  Sliders,
  Maximize2
} from 'lucide-react';
import {
  SiteSettings,
  SchoolAnnouncement,
  SchoolEvent,
  FacultyMember,
  AdmissionsInquiry,
  QuickStat,
  EventCategory,
  AcademicDivision
} from '../types';
import { IMAGES } from '../assets/images';

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

type WpMenuSection =
  | 'dashboard'
  | 'site-editor'
  | 'posts'
  | 'events'
  | 'faculty'
  | 'media'
  | 'forms'
  | 'appearance'
  | 'settings';

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
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<WpMenuSection>('dashboard');
  const [editorSubTab, setEditorSubTab] = useState<'hero' | 'divisions' | 'welcome' | 'stats' | 'ribbon' | 'footer'>('hero');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'contact' | 'academics'>('general');

  // Working copy of settings for real-time live preview
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [localStats, setLocalStats] = useState<QuickStat[]>(quickStats);
  const [notice, setNotice] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Live Visual Customizer mode
  const [isLiveCustomizerOpen, setIsLiveCustomizerOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Quick Draft in Dashboard
  const [quickDraftTitle, setQuickDraftTitle] = useState('');
  const [quickDraftContent, setQuickDraftContent] = useState('');

  // Announcement Post Modal / Form
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SchoolAnnouncement | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<'Academics' | 'Campus Alert' | 'Student Life' | 'Arts & Athletics'>('Academics');
  const [postAuthor, setPostAuthor] = useState('Headmaster Office');
  const [postDate, setPostDate] = useState('2026-10-22');
  const [postUrgent, setPostUrgent] = useState(false);
  const [postContent, setPostContent] = useState('');

  // Event Modal / Form
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'academic' as EventCategory,
    date: '2026-11-15',
    time: '14:00 - 15:30',
    location: '',
    building: '',
    organizer: 'Academic Affairs',
    targetAudience: 'all' as 'all' | 'students' | 'parents' | 'faculty'
  });

  // Faculty Modal / Form
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
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

  // Media Library Selection State
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // New Academic Division Form
  const [newDivision, setNewDivision] = useState<Omit<AcademicDivision, 'id'>>({
    name: '',
    subtitle: '',
    description: '',
    highlights: ['']
  });

  const triggerNotice = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 3000);
  };

  // Commit Settings Changes to Root
  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    triggerNotice('WordPress Settings successfully published & updated on live site!');
  };

  const handleSaveStats = () => {
    onUpdateQuickStats(localStats);
    triggerNotice('Academy Key Performance Metrics updated!');
  };

  // Quick Draft submission from Dashboard
  const handleSaveQuickDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDraftTitle) return;
    onAddAnnouncement({
      title: quickDraftTitle,
      category: 'Student Life',
      author: 'Admin (Quick Draft)',
      date: new Date().toISOString().split('T')[0],
      urgent: false,
      content: quickDraftContent || 'Draft announcement created from WordPress admin console.'
    });
    setQuickDraftTitle('');
    setQuickDraftContent('');
    triggerNotice('Quick Draft published as school announcement!');
  };

  // Post / Announcement Handlers
  const handleOpenAddPost = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostContent('');
    setPostCategory('Academics');
    setPostAuthor('Administration');
    setPostDate(new Date().toISOString().split('T')[0]);
    setPostUrgent(false);
    setIsAddPostOpen(true);
  };

  const handleEditPost = (post: SchoolAnnouncement) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostCategory(post.category);
    setPostAuthor(post.author);
    setPostDate(post.date);
    setPostUrgent(post.urgent);
    setIsAddPostOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle) return;
    if (editingPost) {
      onUpdateAnnouncement({
        ...editingPost,
        title: postTitle,
        category: postCategory,
        author: postAuthor,
        date: postDate,
        urgent: postUrgent,
        content: postContent
      });
      triggerNotice(`Post "${postTitle}" updated successfully.`);
    } else {
      onAddAnnouncement({
        title: postTitle,
        category: postCategory,
        author: postAuthor,
        date: postDate,
        urgent: postUrgent,
        content: postContent
      });
      triggerNotice(`Post "${postTitle}" published live.`);
    }
    setIsAddPostOpen(false);
  };

  // Media Library assets list
  const mediaLibraryItems = [
    { title: 'Campus Historic Quadrangle', url: IMAGES.campusHero, category: 'Hero Banners', size: '1067 KB' },
    { title: 'Biotechnology & Scholars Lab', url: IMAGES.studentsAcademics, category: 'Academics', size: '915 KB' },
    { title: 'Symphony Hall Performance', url: IMAGES.artsAthletics, category: 'Campus Life', size: '1016 KB' },
    { title: 'Dr. Elizabeth Harrington Portrait', url: IMAGES.headOfSchool, category: 'Head of School', size: '746 KB' },
    { title: 'Student Liam ID Card Mockup', url: IMAGES.studentIdLiam, category: 'Student ID Cards', size: '742 KB' },
    { title: 'Student Claire ID Card Mockup', url: IMAGES.studentIdCordelia, category: 'Student ID Cards', size: '606 KB' },
    { title: 'Student Sophia ID Card Mockup', url: IMAGES.studentIdSophia, category: 'Student ID Cards', size: '727 KB' },
    { title: 'Official Smart Badge Template', url: IMAGES.studentIdBadgeCard, category: 'Smart Badges', size: '656 KB' }
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f1] font-sans text-[#2c3338] flex flex-col">
      {/* 1. Iconic WordPress Dark Top Bar */}
      <header className="bg-[#1d2327] text-[#c3c4c7] text-xs h-9 px-3 sm:px-4 flex items-center justify-between z-30 select-none border-b border-[#2c3338]">
        {/* Left cluster */}
        <div className="flex items-center gap-4">
          {/* WordPress Logo */}
          <div className="flex items-center gap-1.5 hover:text-white cursor-pointer py-1 font-semibold text-white">
            <div className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-serif font-black text-[11px] leading-none shadow-xs">
              W
            </div>
            <span className="hidden sm:inline font-bold">WordPress</span>
          </div>

          <div className="h-4 w-px bg-stone-700 hidden sm:block" />

          {/* Site Name & Visit Site */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-none">
              {localSettings.schoolName}
            </span>
            <button
              onClick={onViewLiveSite}
              className="text-[#72aee6] hover:text-white flex items-center gap-1 transition-colors py-0.5 px-1.5 rounded hover:bg-stone-800 cursor-pointer"
              title="Return to public school dashboard"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Visit Site</span>
            </button>
          </div>

          <div className="h-4 w-px bg-stone-700 hidden lg:block" />

          {/* Inquiries Bubble */}
          <button
            onClick={() => setActiveMenu('forms')}
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-stone-400" />
            <span className="bg-[#2271b1] text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
              {inquiries.filter(i => i.status === 'new').length}
            </span>
          </button>

          {/* "+ New" Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-white py-1 px-1.5 rounded hover:bg-stone-800 transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5 text-[#72aee6]" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-[#1d2327] border border-[#2c3338] rounded-b shadow-xl py-1 min-w-[150px] z-50 text-[11px]">
              <button
                onClick={handleOpenAddPost}
                className="px-3 py-1.5 text-left hover:bg-[#2271b1] hover:text-white transition-colors cursor-pointer"
              >
                Post / Announcement
              </button>
              <button
                onClick={() => {
                  setActiveMenu('events');
                  setIsAddEventOpen(true);
                }}
                className="px-3 py-1.5 text-left hover:bg-[#2271b1] hover:text-white transition-colors cursor-pointer"
              >
                School Event
              </button>
              <button
                onClick={() => {
                  setActiveMenu('faculty');
                  setIsAddFacultyOpen(true);
                }}
                className="px-3 py-1.5 text-left hover:bg-[#2271b1] hover:text-white transition-colors cursor-pointer"
              >
                Teacher Profile
              </button>
              <button
                onClick={() => setActiveMenu('site-editor')}
                className="px-3 py-1.5 text-left hover:bg-[#2271b1] hover:text-white transition-colors cursor-pointer"
              >
                Page Section
              </button>
            </div>
          </div>
        </div>

        {/* Right cluster: Live Customizer & User */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveCustomizerOpen(true)}
            className="flex items-center gap-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Customizer</span>
          </button>

          <div className="flex items-center gap-2 text-stone-300">
            <span className="hidden md:inline text-[11px]">Howdy,</span>
            <span className="font-semibold text-white text-[11px]">Administrator</span>
            <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs ring-1 ring-stone-600">
              A
            </div>
          </div>
        </div>
      </header>

      {/* WordPress Notice Banner */}
      {notice && (
        <div
          className={`mx-4 sm:mx-6 mt-4 p-3 rounded border text-xs flex items-center justify-between shadow-xs ${
            notice.type === 'success'
              ? 'bg-[#edf7ed] border-[#135e96] text-[#0f5132]'
              : 'bg-[#fff8e5] border-[#f0b849] text-[#855a00]'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2271b1]" />
            <span className="font-medium">{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-stone-500 hover:text-stone-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main WordPress Two-Column Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* 2. WordPress Left Navigation Sidebar */}
        <aside className="w-full md:w-56 lg:w-64 bg-[#1d2327] text-[#c3c4c7] shrink-0 border-r border-[#2c3338] select-none">
          <div className="py-2">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-stone-500">
              Site Administration
            </div>

            <nav className="space-y-0.5 text-xs">
              {/* Dashboard */}
              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'dashboard'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
                {activeMenu === 'dashboard' && <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {/* Site Editor & Gutenberg Builder */}
              <button
                onClick={() => setActiveMenu('site-editor')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'site-editor'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Site & Page Editor</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  CMS
                </span>
              </button>

              {/* Posts / Announcements */}
              <button
                onClick={() => setActiveMenu('posts')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'posts'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Posts & News</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{announcements.length}</span>
              </button>

              {/* Events & Calendar */}
              <button
                onClick={() => setActiveMenu('events')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'events'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Master Calendar</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{events.length}</span>
              </button>

              {/* Faculty & Staff */}
              <button
                onClick={() => setActiveMenu('faculty')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'faculty'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Teachers & Staff</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{facultyList.length}</span>
              </button>

              {/* Media Library */}
              <button
                onClick={() => setActiveMenu('media')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'media'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4" />
                  <span>Media Library</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{mediaLibraryItems.length}</span>
              </button>

              {/* Admissions Forms & Inquiries */}
              <button
                onClick={() => setActiveMenu('forms')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'forms'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4" />
                  <span>Admissions Inquiries</span>
                </div>
                {inquiries.filter(i => i.status === 'new').length > 0 && (
                  <span className="text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.2 font-bold">
                    {inquiries.filter(i => i.status === 'new').length}
                  </span>
                )}
              </button>

              <div className="pt-3 pb-1 px-4 text-[10px] uppercase font-bold tracking-wider text-stone-500">
                Design & Core
              </div>

              {/* Appearance / Theme Customizer */}
              <button
                onClick={() => setActiveMenu('appearance')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'appearance'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Appearance & Themes</span>
                </div>
              </button>

              {/* Settings */}
              <button
                onClick={() => setActiveMenu('settings')}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer text-left ${
                  activeMenu === 'settings'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Site Settings</span>
                </div>
              </button>
            </nav>

            {/* Quick Actions Footer inside Sidebar */}
            <div className="mt-8 px-4 py-3 mx-2 bg-[#2c3338] rounded text-[11px] text-stone-400 space-y-2">
              <div className="flex items-center justify-between text-stone-300 font-semibold">
                <span>WordPress v6.7</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <p className="text-[10px] leading-tight">
                Any changes made here instantly sync across the entire school management system.
              </p>
              <button
                onClick={onResetDefaults}
                className="w-full py-1 text-center bg-stone-700 hover:bg-stone-600 text-stone-200 rounded text-[10px] transition-colors cursor-pointer"
              >
                Reset Demo Content
              </button>
            </div>
          </div>
        </aside>

        {/* 3. Main WordPress Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* ======================================================== */}
          {/* TAB 1: WORDPRESS DASHBOARD OVERVIEW                     */}
          {/* ======================================================== */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-white border border-[#c3c4c7] p-6 rounded shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-[#1d2327]">
                      Welcome to the {localSettings.schoolName} Content Management System
                    </h1>
                    <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
                      Like WordPress, this admin console gives you complete authority to edit every headline, announcement, division, faculty profile, and styling setting across the school platform.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveMenu('site-editor')}
                      className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Edit Site Content</span>
                    </button>
                    <button
                      onClick={() => setIsLiveCustomizerOpen(true)}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Two-column WordPress Dashboard Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Columns: At a Glance + Activity Stream */}
                <div className="lg:col-span-7 space-y-6">
                  {/* At a Glance Widget */}
                  <div className="bg-white border border-[#c3c4c7] rounded shadow-xs overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#e5e5e5] bg-stone-50 font-serif font-bold text-stone-900 text-sm flex items-center justify-between">
                      <span>At a Glance</span>
                      <span className="text-[11px] text-stone-500 font-sans font-normal">
                        WordPress Content Summary
                      </span>
                    </div>
                    <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#2271b1]" />
                        <div>
                          <div className="font-bold text-base text-stone-900 tabular-nums">
                            {announcements.length}
                          </div>
                          <div className="text-stone-500 text-[11px]">Published Posts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold text-base text-stone-900 tabular-nums">
                            {localSettings.academicDivisions?.length || 3}
                          </div>
                          <div className="text-stone-500 text-[11px]">Academic Divisions</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-bold text-base text-stone-900 tabular-nums">
                            {events.length}
                          </div>
                          <div className="text-stone-500 text-[11px]">Calendar Events</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-bold text-base text-stone-900 tabular-nums">
                            {facultyList.length}
                          </div>
                          <div className="text-stone-500 text-[11px]">Faculty Fellows</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Inbox className="w-4 h-4 text-rose-600" />
                        <div>
                          <div className="font-bold text-base text-stone-900 tabular-nums">
                            {inquiries.length}
                          </div>
                          <div className="text-stone-500 text-[11px]">Admissions Forms</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-bold text-base text-stone-900 tabular-nums">
                            {mediaLibraryItems.length}
                          </div>
                          <div className="text-stone-500 text-[11px]">Media Assets</div>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-2.5 bg-stone-50 border-t border-[#e5e5e5] text-[11px] text-stone-500 flex items-center justify-between">
                      <span>WordPress 6.7 running St. Andrew's Theme</span>
                      <span className="text-emerald-700 font-medium">Site Health: Excellent</span>
                    </div>
                  </div>

                  {/* Activity & Recent Published Announcements */}
                  <div className="bg-white border border-[#c3c4c7] rounded shadow-xs overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#e5e5e5] bg-stone-50 font-serif font-bold text-stone-900 text-sm flex items-center justify-between">
                      <span>Recent Activity & Published Posts</span>
                      <button
                        onClick={() => setActiveMenu('posts')}
                        className="text-xs text-[#2271b1] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-stone-100">
                      {announcements.slice(0, 4).map(ann => (
                        <div key={ann.id} className="p-4 flex items-start justify-between gap-3 hover:bg-stone-50">
                          <div>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                              <span>{ann.date}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-stone-700">{ann.category}</span>
                              {ann.urgent && (
                                <span className="text-red-700 font-bold bg-red-50 px-1 rounded text-[10px]">
                                  Alert
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm">
                              {ann.title}
                            </h4>
                            <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">{ann.content}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEditPost(ann)}
                              className="p-1 text-stone-500 hover:text-[#2271b1]"
                              title="Edit post"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                onDeleteAnnouncement(ann.id);
                                triggerNotice('Post moved to Trash.');
                              }}
                              className="p-1 text-stone-400 hover:text-red-600"
                              title="Delete post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 5 Columns: WordPress Quick Draft Widget + Site Health */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Quick Draft Widget */}
                  <div className="bg-white border border-[#c3c4c7] rounded shadow-xs p-5 space-y-4">
                    <div className="border-b border-stone-200 pb-3">
                      <h3 className="font-serif font-bold text-stone-900 text-sm">Quick Draft</h3>
                      <p className="text-stone-500 text-xs mt-0.5">
                        Jot down an announcement or event draft to publish immediately.
                      </p>
                    </div>

                    <form onSubmit={handleSaveQuickDraft} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={quickDraftTitle}
                          onChange={e => setQuickDraftTitle(e.target.value)}
                          placeholder="e.g., Extended Library Hours for Midterms"
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">What's on your mind?</label>
                        <textarea
                          rows={3}
                          value={quickDraftContent}
                          onChange={e => setQuickDraftContent(e.target.value)}
                          placeholder="Draft message body..."
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] text-stone-400">Publishes live to community</span>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Save Draft
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* WordPress Customizer Quick Link Card */}
                  <div className="bg-white border border-[#c3c4c7] rounded shadow-xs p-5 space-y-3">
                    <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-600" />
                      <span>Customize Your Site</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Change your school name, hero headline, colors, academic divisions, or Headmaster address with instant live preview.
                    </p>
                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        onClick={() => setActiveMenu('site-editor')}
                        className="w-full py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded text-center transition-colors cursor-pointer shadow-xs"
                      >
                        Open Site & Page Builder
                      </button>
                      <button
                        onClick={() => setActiveMenu('appearance')}
                        className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-medium rounded text-center transition-colors cursor-pointer"
                      >
                        Change Theme Colors & Accents
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SITE & PAGE EDITOR (Gutenberg-Style Builder)      */}
          {/* ======================================================== */}
          {activeMenu === 'site-editor' && (
            <div className="space-y-6">
              {/* Header with Save / Publish button */}
              <div className="bg-white border border-[#c3c4c7] p-5 rounded shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
                    <Globe className="w-4 h-4" />
                    <span>Visual Site Builder</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-950">
                    Edit Pages & Homepage Sections
                  </h1>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Modify any text block, hero slogan, curriculum division, or Head of School letter. Changes save instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsLiveCustomizerOpen(true)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Changes</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs for Section Navigation */}
              <div className="flex border-b border-stone-300 bg-white px-4 rounded-t gap-2 overflow-x-auto">
                {[
                  { id: 'hero', label: 'Hero & Headlines' },
                  { id: 'divisions', label: 'Academic Divisions' },
                  { id: 'welcome', label: 'Head of School Address' },
                  { id: 'stats', label: 'Key Performance Stats' },
                  { id: 'ribbon', label: 'Top Banner Ribbon' },
                  { id: 'footer', label: 'Footer & Legal Notice' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setEditorSubTab(tab.id as any)}
                    className={`py-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                      editorSubTab === tab.id
                        ? 'border-[#2271b1] text-[#2271b1]'
                        : 'border-transparent text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* SECTION SUB-TAB CONTENT */}
              <div className="bg-white border border-[#c3c4c7] border-t-0 p-6 rounded-b shadow-xs space-y-6">
                {/* 1. Hero Section Editing */}
                {editorSubTab === 'hero' && (
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base">Hero Section & Call-to-Actions</h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        The primary banner viewed when visitors and parents arrive at the school portal.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          School Name / Institution Brand
                        </label>
                        <input
                          type="text"
                          value={localSettings.schoolName}
                          onChange={e => setLocalSettings({ ...localSettings, schoolName: e.target.value })}
                          className="w-full text-sm font-serif font-bold px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Latin Motto & Translation
                        </label>
                        <input
                          type="text"
                          value={localSettings.motto}
                          onChange={e => setLocalSettings({ ...localSettings, motto: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Main Hero Headline
                        </label>
                        <input
                          type="text"
                          value={localSettings.heroHeadline}
                          onChange={e => setLocalSettings({ ...localSettings, heroHeadline: e.target.value })}
                          className="w-full text-sm font-serif font-bold px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Hero Subtitle / Mission Prose
                        </label>
                        <textarea
                          rows={4}
                          value={localSettings.heroSubtitle}
                          onChange={e => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-800 mb-1.5">
                            Primary CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroCtaPrimary || 'Explore Academic Curriculum'}
                            onChange={e => setLocalSettings({ ...localSettings, heroCtaPrimary: e.target.value })}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-800 mb-1.5">
                            Secondary CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroCtaSecondary || 'Admissions & Tuition'}
                            onChange={e => setLocalSettings({ ...localSettings, heroCtaSecondary: e.target.value })}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Academic Divisions Editing */}
                {editorSubTab === 'divisions' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-stone-900 text-base">Academic Divisions</h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Configure Lower School, Middle School, and Upper School curriculum descriptions and highlights.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(localSettings.academicDivisions || []).map((division, idx) => (
                        <div key={division.id || idx} className="p-4 bg-stone-50 rounded border border-stone-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                              Division {idx + 1}
                            </span>
                            <button
                              onClick={() => {
                                const updated = (localSettings.academicDivisions || []).filter((_, i) => i !== idx);
                                setLocalSettings({ ...localSettings, academicDivisions: updated });
                              }}
                              className="text-xs text-red-600 hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Division Name</label>
                              <input
                                type="text"
                                value={division.name}
                                onChange={e => {
                                  const updated = [...(localSettings.academicDivisions || [])];
                                  updated[idx].name = e.target.value;
                                  setLocalSettings({ ...localSettings, academicDivisions: updated });
                                }}
                                className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Subtitle / Ethos</label>
                              <input
                                type="text"
                                value={division.subtitle}
                                onChange={e => {
                                  const updated = [...(localSettings.academicDivisions || [])];
                                  updated[idx].subtitle = e.target.value;
                                  setLocalSettings({ ...localSettings, academicDivisions: updated });
                                }}
                                className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={division.description}
                              onChange={e => {
                                const updated = [...(localSettings.academicDivisions || [])];
                                updated[idx].description = e.target.value;
                                setLocalSettings({ ...localSettings, academicDivisions: updated });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                              Key Highlights (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={division.highlights.join(', ')}
                              onChange={e => {
                                const updated = [...(localSettings.academicDivisions || [])];
                                updated[idx].highlights = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setLocalSettings({ ...localSettings, academicDivisions: updated });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Add new division */}
                      <button
                        onClick={() => {
                          const newDiv: AcademicDivision = {
                            id: `div-${Date.now()}`,
                            name: 'Post-Graduate & Advanced Studies',
                            subtitle: 'Fellowship & Pre-Collegiate Honors',
                            description: 'Independent research fellowships in biophysics, constitutional law, and algorithmic engineering.',
                            highlights: ['Faculty-mentored thesis', 'National competition sponsorship', 'University laboratory access']
                          };
                          setLocalSettings({
                            ...localSettings,
                            academicDivisions: [...(localSettings.academicDivisions || []), newDiv]
                          });
                          triggerNotice('New Academic Division added.');
                        }}
                        className="py-2 px-3 border border-dashed border-stone-400 text-stone-700 hover:border-[#2271b1] hover:text-[#2271b1] rounded text-xs font-semibold flex items-center justify-center gap-1.5 w-full transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Academic Division</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Head of School Welcome Letter */}
                {editorSubTab === 'welcome' && (
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base">Head of School Welcome Address</h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        The leadership letter and portrait displayed on the school landing and public pages.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-800 mb-1.5">
                            Head of School Name & Degrees
                          </label>
                          <input
                            type="text"
                            value={localSettings.headOfSchoolName || ''}
                            onChange={e => setLocalSettings({ ...localSettings, headOfSchoolName: e.target.value })}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-800 mb-1.5">
                            Academic Title & Tenure
                          </label>
                          <input
                            type="text"
                            value={localSettings.headOfSchoolTitle || ''}
                            onChange={e => setLocalSettings({ ...localSettings, headOfSchoolTitle: e.target.value })}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Guiding Quote / Banner Motto
                        </label>
                        <input
                          type="text"
                          value={localSettings.headOfSchoolQuote || ''}
                          onChange={e => setLocalSettings({ ...localSettings, headOfSchoolQuote: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none italic"
                        />
                      </div>

                      {/* Gutenberg Block Editor Style for Letter */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-stone-800">
                            Welcome Letter Body (Rich Editorial)
                          </label>
                          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded border border-stone-200 text-stone-600">
                            <span className="p-1 hover:text-stone-900 cursor-pointer" title="Bold">
                              <Bold className="w-3.5 h-3.5" />
                            </span>
                            <span className="p-1 hover:text-stone-900 cursor-pointer" title="Italic">
                              <Italic className="w-3.5 h-3.5" />
                            </span>
                            <span className="p-1 hover:text-stone-900 cursor-pointer" title="Quote block">
                              <Quote className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                        <textarea
                          rows={6}
                          value={localSettings.headOfSchoolLetter || ''}
                          onChange={e => setLocalSettings({ ...localSettings, headOfSchoolLetter: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none leading-relaxed font-serif"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Key Performance Stats */}
                {editorSubTab === 'stats' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-stone-900 text-base">Key Performance Indicators</h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          The 4 highlighted numerical metrics featured on the public homepage and dashboard.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveStats}
                        className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                      >
                        Save Metrics
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {localStats.map((stat, idx) => (
                        <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded space-y-2">
                          <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                            Metric {idx + 1}
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={e => {
                              const updated = [...localStats];
                              updated[idx].label = e.target.value;
                              setLocalStats(updated);
                            }}
                            className="w-full text-xs font-bold px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                            placeholder="Metric Label"
                          />
                          <input
                            type="text"
                            value={stat.value}
                            onChange={e => {
                              const updated = [...localStats];
                              updated[idx].value = e.target.value;
                              setLocalStats(updated);
                            }}
                            className="w-full text-base font-serif font-bold text-[#2271b1] px-2.5 py-1.5 border border-stone-300 rounded bg-white tabular-nums"
                            placeholder="e.g. 100% or 8:1"
                          />
                          <input
                            type="text"
                            value={stat.detail}
                            onChange={e => {
                              const updated = [...localStats];
                              updated[idx].detail = e.target.value;
                              setLocalStats(updated);
                            }}
                            className="w-full text-xs text-stone-600 px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                            placeholder="Context detail"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Top Ribbon Alert */}
                {editorSubTab === 'ribbon' && (
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base">Top Ribbon Alert Banner</h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        The urgent ticker notice positioned at the very summit of the website.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Ribbon Notice Text
                        </label>
                        <input
                          type="text"
                          value={localSettings.topRibbonAlert}
                          onChange={e => setLocalSettings({ ...localSettings, topRibbonAlert: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Action Link Text
                        </label>
                        <input
                          type="text"
                          value={localSettings.topRibbonLinkText || 'View Details'}
                          onChange={e => setLocalSettings({ ...localSettings, topRibbonLinkText: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Footer & Legal */}
                {editorSubTab === 'footer' && (
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base">Footer Notice & Non-Discrimination Policy</h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Legal compliance statement and accreditation summary rendered in the site footer.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Accreditation Seal Text
                        </label>
                        <input
                          type="text"
                          value={localSettings.accreditationText}
                          onChange={e => setLocalSettings({ ...localSettings, accreditationText: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Non-Discrimination & Equal Opportunity Notice
                        </label>
                        <textarea
                          rows={3}
                          value={localSettings.footerNotice || ''}
                          onChange={e => setLocalSettings({ ...localSettings, footerNotice: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Changes to Live Site</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: POSTS & ANNOUNCEMENTS (WordPress Post Table)      */}
          {/* ======================================================== */}
          {activeMenu === 'posts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                    <span>Posts & Announcements</span>
                    <button
                      onClick={handleOpenAddPost}
                      className="px-2.5 py-1 text-xs font-sans font-medium text-[#2271b1] hover:bg-[#2271b1] hover:text-white border border-[#2271b1] rounded transition-colors"
                    >
                      Add New Post
                    </button>
                  </h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Manage student body notices, faculty alerts, and academic commendations.
                  </p>
                </div>
              </div>

              {/* WordPress Standard Post List Table */}
              <div className="bg-white border border-[#c3c4c7] rounded shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-[#c3c4c7] font-semibold text-stone-700">
                        <th className="py-2.5 px-4 w-12 text-center">
                          <input type="checkbox" className="rounded text-[#2271b1]" readOnly />
                        </th>
                        <th className="py-2.5 px-4">Title</th>
                        <th className="py-2.5 px-4">Author</th>
                        <th className="py-2.5 px-4">Categories</th>
                        <th className="py-2.5 px-4">Priority</th>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5]">
                      {announcements.map(post => (
                        <tr key={post.id} className="hover:bg-stone-50 transition-colors group">
                          <td className="py-3 px-4 text-center">
                            <input type="checkbox" className="rounded text-[#2271b1]" readOnly />
                          </td>
                          <td className="py-3 px-4 font-medium text-stone-900">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="font-serif font-bold text-stone-900 hover:text-[#2271b1] text-left cursor-pointer"
                            >
                              {post.title}
                            </button>
                            <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{post.content}</div>
                          </td>
                          <td className="py-3 px-4 text-stone-600">{post.author}</td>
                          <td className="py-3 px-4">
                            <span className="text-stone-700 font-medium">{post.category}</span>
                          </td>
                          <td className="py-3 px-4">
                            {post.urgent ? (
                              <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded text-[10px]">
                                Urgent Alert
                              </span>
                            ) : (
                              <span className="text-stone-500 text-[11px]">Normal</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">{post.date}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="text-[#2271b1] hover:underline font-medium text-[11px]"
                              >
                                Edit
                              </button>
                              <span className="text-stone-300">|</span>
                              <button
                                onClick={() => {
                                  onDeleteAnnouncement(post.id);
                                  triggerNotice(`Post "${post.title}" deleted.`);
                                }}
                                className="text-red-600 hover:underline font-medium text-[11px]"
                              >
                                Trash
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 bg-stone-50 border-t border-[#c3c4c7] text-xs text-stone-500 flex items-center justify-between">
                  <span>{announcements.length} items</span>
                  <span>Published publicly to School Community</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: MASTER CALENDAR & EVENTS                          */}
          {/* ======================================================== */}
          {activeMenu === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                    <span>Events & Term Calendar</span>
                    <button
                      onClick={() => setIsAddEventOpen(true)}
                      className="px-2.5 py-1 text-xs font-sans font-medium text-[#2271b1] hover:bg-[#2271b1] hover:text-white border border-[#2271b1] rounded transition-colors"
                    >
                      Add Event
                    </button>
                  </h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Schedule convocations, symposiums, athletic tournaments, and arts performances.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#c3c4c7] rounded shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-[#c3c4c7] font-semibold text-stone-700">
                        <th className="py-2.5 px-4">Event Title</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Date & Time</th>
                        <th className="py-2.5 px-4">Venue & Hall</th>
                        <th className="py-2.5 px-4">RSVP Count</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5]">
                      {events.map(evt => (
                        <tr key={evt.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-serif font-bold text-stone-900">{evt.title}</div>
                            <div className="text-[11px] text-stone-500 line-clamp-1">{evt.description}</div>
                          </td>
                          <td className="py-3 px-4 capitalize text-stone-700">{evt.category}</td>
                          <td className="py-3 px-4">
                            <div className="font-mono text-stone-800">{evt.date}</div>
                            <div className="text-[11px] text-stone-500">{evt.time}</div>
                          </td>
                          <td className="py-3 px-4 text-stone-600">{evt.location}</td>
                          <td className="py-3 px-4 font-mono font-bold text-stone-800 tabular-nums">
                            {evt.rsvpCount} scholars
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                onDeleteEvent(evt.id);
                                triggerNotice(`Event "${evt.title}" removed.`);
                              }}
                              className="text-red-600 hover:underline font-medium text-[11px]"
                            >
                              Cancel Event
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: TEACHERS & FACULTY                                */}
          {/* ======================================================== */}
          {activeMenu === 'faculty' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                    <span>Faculty Directory & Staff</span>
                    <button
                      onClick={() => setIsAddFacultyOpen(true)}
                      className="px-2.5 py-1 text-xs font-sans font-medium text-[#2271b1] hover:bg-[#2271b1] hover:text-white border border-[#2271b1] rounded transition-colors"
                    >
                      Add Faculty
                    </button>
                  </h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Department chairs, fellows, seminar instructors, and office hours.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facultyList.map(fac => (
                  <div key={fac.id} className="bg-white border border-[#c3c4c7] p-4 rounded shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${fac.avatarColor} text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs`}>
                          {fac.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-sm">{fac.name}</h4>
                          <div className="text-[11px] text-stone-600">{fac.title}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onDeleteFaculty(fac.id);
                          triggerNotice(`Faculty profile for ${fac.name} deleted.`);
                        }}
                        className="text-stone-400 hover:text-red-600 p-1"
                        title="Remove faculty"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 pt-1 border-t border-stone-100">
                      <div>
                        <span className="font-semibold text-stone-700">Department:</span> {fac.department}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-700">Office:</span> {fac.officeRoom}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-700">Email:</span> {fac.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: MEDIA LIBRARY (Images & Badges)                    */}
          {/* ======================================================== */}
          {activeMenu === 'media' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-serif font-bold text-stone-900">Media Library</h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  High-fidelity campus photographs, student ID card mockups, and institutional badges bundled with the system.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaLibraryItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedMedia(item.url)}
                    className={`bg-white border rounded overflow-hidden shadow-xs cursor-pointer group transition-all ${
                      selectedMedia === item.url ? 'ring-2 ring-[#2271b1] border-transparent' : 'border-[#c3c4c7] hover:border-stone-400'
                    }`}
                  >
                    <div className="aspect-4/3 bg-stone-100 overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-3">
                      <div className="font-serif font-bold text-stone-900 text-xs truncate">{item.title}</div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                        <span>{item.category}</span>
                        <span className="font-mono">{item.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedMedia && (
                <div className="bg-stone-900 text-white p-4 rounded-lg flex items-center justify-between gap-4 text-xs">
                  <div className="truncate">
                    <span className="font-semibold text-amber-300">Selected Asset Path:</span>{' '}
                    <code className="text-stone-300 font-mono text-[11px]">{selectedMedia}</code>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedMedia);
                      triggerNotice('Media URL copied to clipboard.');
                    }}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded font-semibold text-xs shrink-0 cursor-pointer"
                  >
                    Copy Asset Path
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: ADMISSIONS FORMS & INQUIRIES                      */}
          {/* ======================================================== */}
          {activeMenu === 'forms' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-serif font-bold text-stone-900">Admissions Inquiries & Forms</h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Prospective student inquiries, family admissions requests, and tour bookings.
                </p>
              </div>

              <div className="bg-white border border-[#c3c4c7] rounded shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-[#c3c4c7] font-semibold text-stone-700">
                        <th className="py-2.5 px-4">Applicant</th>
                        <th className="py-2.5 px-4">Grade Level</th>
                        <th className="py-2.5 px-4">Parent / Contact</th>
                        <th className="py-2.5 px-4">Inquiry Notes</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5]">
                      {inquiries.map(inq => (
                        <tr key={inq.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-4 font-serif font-bold text-stone-900">{inq.applicantName}</td>
                          <td className="py-3 px-4 text-stone-700">{inq.gradeLevel}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-stone-800">{inq.parentName}</div>
                            <div className="text-[11px] text-stone-500">{inq.parentEmail}</div>
                          </td>
                          <td className="py-3 px-4 text-stone-600 max-w-xs">{inq.inquiryNotes}</td>
                          <td className="py-3 px-4">
                            <select
                              value={inq.status}
                              onChange={e => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                              className="text-[11px] font-semibold px-2 py-1 rounded border border-stone-300 bg-white"
                            >
                              <option value="new">New Inquiry</option>
                              <option value="contacted">Contacted</option>
                              <option value="tour-scheduled">Tour Scheduled</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                onDeleteInquiry(inq.id);
                                triggerNotice('Inquiry removed.');
                              }}
                              className="text-red-600 hover:underline text-[11px] font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: APPEARANCE & THEMES                               */}
          {/* ======================================================== */}
          {activeMenu === 'appearance' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-serif font-bold text-stone-900">Appearance & Theme Settings</h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select color accents and theme palettes for St. Andrew's Academy portal.
                </p>
              </div>

              <div className="bg-white border border-[#c3c4c7] p-6 rounded shadow-xs space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-2">
                    Primary School Accent Palette
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { id: 'amber', name: 'Classic Gold & Navy', color: 'bg-amber-600' },
                      { id: 'emerald', name: 'Forest Ivy', color: 'bg-emerald-700' },
                      { id: 'blue', name: 'Collegiate Blue', color: 'bg-blue-700' },
                      { id: 'indigo', name: 'Oxford Indigo', color: 'bg-indigo-800' },
                      { id: 'rose', name: 'Crimson Fellowship', color: 'bg-rose-800' }
                    ].map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setLocalSettings({ ...localSettings, themeAccent: theme.id as any });
                          triggerNotice(`Accent theme changed to ${theme.name}.`);
                        }}
                        className={`p-3 rounded border text-left flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          localSettings.themeAccent === theme.id
                            ? 'border-[#2271b1] ring-2 ring-[#2271b1] bg-stone-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${theme.color} shadow-xs`} />
                        <span className="text-[11px] font-semibold text-center text-stone-800">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Save Appearance Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: GENERAL SETTINGS                                  */}
          {/* ======================================================== */}
          {activeMenu === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-serif font-bold text-stone-900">WordPress General Settings</h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Core institutional parameters, term schedules, and admissions phone lines.
                </p>
              </div>

              {/* Sub-tab navigation */}
              <div className="flex border-b border-stone-300 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setSettingsSubTab('general')}
                  className={`pb-2 border-b-2 cursor-pointer ${
                    settingsSubTab === 'general' ? 'border-[#2271b1] text-[#2271b1]' : 'border-transparent text-stone-500'
                  }`}
                >
                  General Identity
                </button>
                <button
                  onClick={() => setSettingsSubTab('contact')}
                  className={`pb-2 border-b-2 cursor-pointer ${
                    settingsSubTab === 'contact' ? 'border-[#2271b1] text-[#2271b1]' : 'border-transparent text-stone-500'
                  }`}
                >
                  Contact & Campus Info
                </button>
                <button
                  onClick={() => setSettingsSubTab('academics')}
                  className={`pb-2 border-b-2 cursor-pointer ${
                    settingsSubTab === 'academics' ? 'border-[#2271b1] text-[#2271b1]' : 'border-transparent text-stone-500'
                  }`}
                >
                  Term & Admissions
                </button>
              </div>

              <div className="bg-white border border-[#c3c4c7] p-6 rounded shadow-xs space-y-4">
                {settingsSubTab === 'general' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Site Title</label>
                      <input
                        type="text"
                        value={localSettings.schoolName}
                        onChange={e => setLocalSettings({ ...localSettings, schoolName: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Tagline / Latin Motto</label>
                      <input
                        type="text"
                        value={localSettings.motto}
                        onChange={e => setLocalSettings({ ...localSettings, motto: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Founded Year</label>
                      <input
                        type="number"
                        value={localSettings.foundedYear}
                        onChange={e => setLocalSettings({ ...localSettings, foundedYear: parseInt(e.target.value) || 1903 })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono"
                      />
                    </div>
                  </>
                )}

                {settingsSubTab === 'contact' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Campus Physical Address</label>
                      <input
                        type="text"
                        value={localSettings.campusAddress}
                        onChange={e => setLocalSettings({ ...localSettings, campusAddress: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">Main Reception Telephone</label>
                        <input
                          type="text"
                          value={localSettings.phone}
                          onChange={e => setLocalSettings({ ...localSettings, phone: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">Campus Emergency Line</label>
                        <input
                          type="text"
                          value={localSettings.emergencyPhone}
                          onChange={e => setLocalSettings({ ...localSettings, emergencyPhone: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-mono text-red-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Campus Visiting Hours</label>
                      <input
                        type="text"
                        value={localSettings.visitingHours}
                        onChange={e => setLocalSettings({ ...localSettings, visitingHours: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </>
                )}

                {settingsSubTab === 'academics' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Current Academic Term</label>
                      <input
                        type="text"
                        value={localSettings.termName}
                        onChange={e => setLocalSettings({ ...localSettings, termName: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Admissions Priority Deadline</label>
                      <input
                        type="text"
                        value={localSettings.admissionsDeadline}
                        onChange={e => setLocalSettings({ ...localSettings, admissionsDeadline: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 4. LIVE VISUAL CUSTOMIZER MODAL WITH DEVICE SIMULATION    */}
      {/* ======================================================== */}
      {isLiveCustomizerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex flex-col animate-in fade-in duration-200">
          {/* Customizer Top Header Bar */}
          <div className="bg-[#1d2327] text-white h-12 px-4 flex items-center justify-between border-b border-[#2c3338] shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiveCustomizerOpen(false)}
                className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Close Customizer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="h-4 w-px bg-stone-700" />
              <div className="text-xs">
                <span className="font-semibold text-white">Customizing:</span>{' '}
                <span className="text-amber-300">{localSettings.schoolName} Live Preview</span>
              </div>
            </div>

            {/* Device Switcher (Desktop, Tablet, Mobile) */}
            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded border border-stone-800">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded transition-colors ${
                  previewDevice === 'desktop' ? 'bg-[#2271b1] text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded transition-colors ${
                  previewDevice === 'tablet' ? 'bg-[#2271b1] text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  previewDevice === 'mobile' ? 'bg-[#2271b1] text-white' : 'text-stone-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleSaveSettings();
                  setIsLiveCustomizerOpen(false);
                }}
                className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Publish & Close
              </button>
            </div>
          </div>

          {/* Interactive Simulation Container */}
          <div className="flex-1 overflow-auto bg-stone-900/60 p-4 sm:p-6 flex items-start justify-center">
            <div
              className={`bg-white rounded-lg shadow-2xl transition-all duration-300 overflow-hidden border border-stone-300 ${
                previewDevice === 'desktop'
                  ? 'w-full max-w-5xl min-h-[600px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] min-h-[600px]'
                  : 'w-[375px] min-h-[600px]'
              }`}
            >
              {/* Simulated Browser Bar */}
              <div className="bg-stone-100 border-b border-stone-200 px-3 py-1.5 flex items-center gap-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white border border-stone-200 rounded px-2.5 py-0.5 flex-1 max-w-xs font-mono text-[10px] truncate">
                  https://standrewsacademy.org/{localSettings.termName.toLowerCase().replace(/\s+/g, '-')}
                </div>
              </div>

              {/* Simulated Live School View */}
              <div className="p-6 space-y-6">
                {/* Top Banner Ribbon */}
                <div className="bg-stone-900 text-stone-200 text-xs py-2 px-3 rounded flex items-center justify-between">
                  <span className="font-semibold text-amber-300">{localSettings.topRibbonAlert}</span>
                  <span className="underline cursor-pointer">{localSettings.topRibbonLinkText || 'Learn More'}</span>
                </div>

                {/* Hero Showcase Block */}
                <div className="space-y-3 py-4 border-b border-stone-200">
                  <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                    {localSettings.schoolName} · Founded {localSettings.foundedYear}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 leading-tight">
                    {localSettings.heroHeadline}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
                    {localSettings.heroSubtitle}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button className="px-3.5 py-1.5 bg-stone-950 text-white rounded text-xs font-semibold">
                      {localSettings.heroCtaPrimary || 'Explore Academic Curriculum'}
                    </button>
                    <button className="px-3.5 py-1.5 bg-stone-100 border border-stone-300 text-stone-800 rounded text-xs font-semibold">
                      {localSettings.heroCtaSecondary || 'Admissions & Tuition'}
                    </button>
                  </div>
                </div>

                {/* Academic Divisions Preview */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Academic Continuum
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(localSettings.academicDivisions || []).slice(0, 3).map((div, i) => (
                      <div key={i} className="p-3 rounded border border-stone-200 bg-stone-50 text-xs space-y-1">
                        <div className="font-serif font-bold text-stone-900">{div.name}</div>
                        <div className="text-[11px] text-amber-800 font-medium">{div.subtitle}</div>
                        <p className="text-[11px] text-stone-600 line-clamp-2">{div.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Head of School Preview */}
                <div className="p-4 bg-stone-50 rounded border border-stone-200 text-xs space-y-2">
                  <div className="font-serif font-bold text-stone-900 text-sm">
                    {localSettings.headOfSchoolName}
                  </div>
                  <div className="text-[11px] text-stone-500">{localSettings.headOfSchoolTitle}</div>
                  <p className="italic text-stone-700 leading-relaxed">
                    "{localSettings.headOfSchoolQuote}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ADD / EDIT POST MODAL (Gutenberg-Style Form)          */}
      {/* ======================================================== */}
      {isAddPostOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-stone-300 overflow-hidden">
            <div className="px-5 py-3.5 bg-[#1d2327] text-white flex items-center justify-between">
              <span className="font-serif font-bold text-sm">
                {editingPost ? 'Edit Post' : 'Add New Post / Announcement'}
              </span>
              <button onClick={() => setIsAddPostOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full px-3 py-2 border border-stone-300 rounded font-serif text-sm font-bold focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Category</label>
                  <select
                    value={postCategory}
                    onChange={e => setPostCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Campus Alert">Campus Alert</option>
                    <option value="Student Life">Student Life</option>
                    <option value="Arts & Athletics">Arts & Athletics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Author Credit</label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={e => setPostAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentFlag"
                  checked={postUrgent}
                  onChange={e => setPostUrgent(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="urgentFlag" className="font-semibold text-stone-800">
                  Mark as Urgent Alert (triggers top banner notification for students and teachers)
                </label>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Content Body</label>
                <textarea
                  rows={5}
                  required
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Write announcement body..."
                  className="w-full px-3 py-2 border border-stone-300 rounded leading-relaxed focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPostOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  {editingPost ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ADD EVENT MODAL                                       */}
      {/* ======================================================== */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-stone-300 overflow-hidden">
            <div className="px-5 py-3.5 bg-[#1d2327] text-white flex items-center justify-between">
              <span className="font-serif font-bold text-sm">Schedule Master Calendar Event</span>
              <button onClick={() => setIsAddEventOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!eventForm.title) return;
                onAddEvent({
                  ...eventForm,
                  isPublic: true
                });
                setIsAddEventOpen(false);
                triggerNotice(`Event "${eventForm.title}" scheduled.`);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-stone-800 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g., Annual Science Symposium"
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="14:00 - 16:30"
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Location & Hall</label>
                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Franklin Science Center, Amphitheater B"
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold cursor-pointer"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. ADD FACULTY MODAL                                     */}
      {/* ======================================================== */}
      {isAddFacultyOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-stone-300 overflow-hidden">
            <div className="px-5 py-3.5 bg-[#1d2327] text-white flex items-center justify-between">
              <span className="font-serif font-bold text-sm">Add New Faculty Fellow</span>
              <button onClick={() => setIsAddFacultyOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
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
                triggerNotice(`Faculty profile for ${facultyForm.name} added.`);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-stone-800 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={facultyForm.name}
                  onChange={e => setFacultyForm({ ...facultyForm, name: e.target.value })}
                  placeholder="e.g., Dr. Arthur Vance"
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Department</label>
                  <select
                    value={facultyForm.department}
                    onChange={e => setFacultyForm({ ...facultyForm, department: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="Sciences & Mathematics">Sciences & Mathematics</option>
                    <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                    <option value="World Languages">World Languages</option>
                    <option value="Fine & Performing Arts">Fine & Performing Arts</option>
                    <option value="Athletics & Physical Education">Athletics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Academic Title</label>
                  <input
                    type="text"
                    value={facultyForm.title}
                    onChange={e => setFacultyForm({ ...facultyForm, title: e.target.value })}
                    placeholder="Department Chair"
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Office Room</label>
                  <input
                    type="text"
                    value={facultyForm.officeRoom}
                    onChange={e => setFacultyForm({ ...facultyForm, officeRoom: e.target.value })}
                    placeholder="Franklin Science Hall 304"
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Email</label>
                  <input
                    type="email"
                    value={facultyForm.email}
                    onChange={e => setFacultyForm({ ...facultyForm, email: e.target.value })}
                    placeholder="a.vance@standrewsacademy.org"
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFacultyOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold cursor-pointer"
                >
                  Save Faculty Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
