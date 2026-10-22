import React from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Bell,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Award
} from 'lucide-react';
import {
  SiteSettings,
  QuickStat,
  StudentRecord,
  Course,
  FeeInvoice,
  TimetableSlot,
  SchoolAnnouncement,
  AppPage
} from '../types';

interface DashboardPageProps {
  settings: SiteSettings;
  quickStats: QuickStat[];
  students: StudentRecord[];
  courses: Course[];
  invoices: FeeInvoice[];
  timetable: TimetableSlot[];
  announcements: SchoolAnnouncement[];
  onNavigatePage: (page: AppPage) => void;
  onOpenAnnouncements: () => void;
  onRecordPayment: (invoiceId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  settings,
  quickStats,
  students,
  courses,
  invoices,
  timetable,
  announcements,
  onNavigatePage,
  onOpenAnnouncements,
  onRecordPayment
}) => {
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = totalBilled - totalPaid;
  const collectionRate = totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : '100';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Top Banner Ribbon */}
      <div className="bg-stone-900 text-stone-200 rounded-xl p-6 shadow-sm border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{settings.schoolName} · Executive Command & Operational Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              School Operations Dashboard
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of enrolled scholars, classroom periods, faculty attendance, and bursar ledger accounts for {settings.termName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigatePage('students')}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Manage Student Classes</span>
            </button>
            <button
              onClick={() => onNavigatePage('sms')}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>SMS Operations</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Executive Performance Indicators */}
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
            Exceeds 97.5% accreditation target
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Tuition Collection</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
            {collectionRate}%
          </div>
          <div className="text-xs text-stone-500 mt-1">
            ${totalPaid.toLocaleString()} collected of ${totalBilled.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Student-to-Faculty Ratio</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
            8.1 : 1
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Average seminar size: 12 scholars
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Master Schedule + Action Workflows + Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Today's Period Schedule & Quick Shortcuts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-950">
                  Today's Master Classroom Schedule
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Live synchronized period schedule across academy laboratory halls.
                </p>
              </div>
              <button
                onClick={() => onNavigatePage('sms')}
                className="text-xs text-stone-700 hover:text-stone-950 font-semibold underline cursor-pointer"
              >
                Full Week Timetable →
              </button>
            </div>

            <div className="divide-y divide-stone-200 mt-3 text-xs">
              {timetable.slice(0, 5).map(slot => (
                <div key={slot.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-semibold text-stone-900">{slot.courseName}</span>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      {slot.courseCode} · Instructor: <strong>{slot.instructor}</strong>
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

          {/* Quick Hub Navigation Cards */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
            <h3 className="text-base font-serif font-bold text-stone-950 mb-1">
              Primary System Portals
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Direct access to the 5 designated operational modules.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => onNavigatePage('students')}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <GraduationCap className="w-5 h-5 text-stone-700 mb-2 group-hover:text-stone-950" />
                <div className="font-semibold text-stone-900">Student Class</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Rosters & courses</div>
              </button>

              <button
                onClick={() => onNavigatePage('teachers')}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <Users className="w-5 h-5 text-stone-700 mb-2 group-hover:text-stone-950" />
                <div className="font-semibold text-stone-900">Teachers</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Faculty directory & HR</div>
              </button>

              <button
                onClick={() => onNavigatePage('sms')}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <UserCheck className="w-5 h-5 text-stone-700 mb-2 group-hover:text-stone-950" />
                <div className="font-semibold text-stone-900">SMS System</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Roll call & billing</div>
              </button>

              <button
                onClick={() => onNavigatePage('admin')}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <ShieldCheck className="w-5 h-5 text-stone-700 mb-2 group-hover:text-stone-950" />
                <div className="font-semibold text-stone-900">Admin</div>
                <div className="text-[11px] text-stone-500 mt-0.5">CMS & settings</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Urgent Bulletins & Bursar Receivables */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Urgent Bulletins Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-700" />
                <h3 className="text-base font-serif font-bold text-stone-950">
                  Campus Bulletins & Notices
                </h3>
              </div>
              <button
                onClick={onOpenAnnouncements}
                className="text-xs text-stone-600 hover:text-stone-900 underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              {announcements.slice(0, 3).map(ann => (
                <div
                  key={ann.id}
                  className={`p-3 rounded-lg border ${
                    ann.urgent ? 'bg-amber-50/60 border-amber-200' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span className="font-semibold text-stone-900">{ann.category}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="font-semibold text-stone-900">{ann.title}</h4>
                  <p className="text-stone-600 text-[11px] mt-1 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding Bursar Accounts */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-serif font-bold text-stone-950">
                Tuition Receivables
              </h3>
              <span className="text-xs font-semibold text-amber-800">
                ${totalOutstanding.toLocaleString()} Due
              </span>
            </div>

            <div className="space-y-2.5 mt-3 text-xs">
              {invoices.filter(i => i.status !== 'Paid').map(inv => (
                <div key={inv.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-900">{inv.studentName}</span>
                    <div className="text-stone-500 text-[11px]">{inv.description}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-950 tabular-nums">
                      ${inv.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onRecordPayment(inv.id)}
                      className="block mt-1 px-2.5 py-0.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-[10px] font-semibold cursor-pointer"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
