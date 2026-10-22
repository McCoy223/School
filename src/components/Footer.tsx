import React from 'react';
import { SCHOOL_NAME, SCHOOL_MOTTO, SCHOOL_FOUNDED, SCHOOL_ACCREDITATION } from '../data/mockData';
import { SiteSettings, AppPage } from '../types';
import { LayoutDashboard, Shield, Server, GraduationCap, Users } from 'lucide-react';

interface FooterProps {
  settings?: SiteSettings;
  onSelectPage: (page: AppPage) => void;
  onOpenAnnouncements: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onSelectPage, onOpenAnnouncements }) => {
  const schoolName = settings?.schoolName || SCHOOL_NAME;
  const schoolMotto = settings?.motto || SCHOOL_MOTTO;
  const foundedYear = settings?.foundedYear || SCHOOL_FOUNDED;
  const address = settings?.campusAddress || "1903 Academy Quadrangle, Worcester County, MA 01609";
  const phone = settings?.phone || "(555) 843-2000";
  const emergencyPhone = settings?.emergencyPhone || "(555) 843-2911";
  const accreditation = settings?.accreditationText || SCHOOL_ACCREDITATION;

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Col 1: School Brand & Motto */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded bg-amber-100 text-stone-900 flex items-center justify-center font-serif font-bold text-sm">
                SA
              </div>
              <span className="text-lg font-serif font-bold text-white tracking-tight">
                {schoolName}
              </span>
            </div>
            
            <p className="text-stone-400 font-serif italic text-xs mb-3">
              "{schoolMotto}"
            </p>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Founded in {foundedYear}, {schoolName} is an independent, college preparatory day and boarding academy serving scholars across Lower, Middle, and Upper divisions.
            </p>

            <div className="mt-4 text-[11px] text-stone-400 space-y-0.5">
              <p>Campus: {address}</p>
              <p>Switchboard: {phone}</p>
              <p>Security 24/7: {emergencyPhone}</p>
            </div>
          </div>

          {/* Col 2: Core System Navigation */}
          <div>
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Core Modules
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectPage('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-stone-400" />
                  <span>Executive Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('students')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-stone-400" />
                  <span>Student Class Registry</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('teachers')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>Faculty & Teachers Directory</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('sms')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-medium text-amber-200"
                >
                  <Server className="w-3.5 h-3.5 text-amber-300" />
                  <span>SMS System Operations</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('admin')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                  <span>Admin CMS Control</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student & Class Modules */}
          <div>
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Class & Operations
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectPage('students')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Enrolled Scholars Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('students')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Class Courses & Academic Roster
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('sms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Daily Attendance Roll Call
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('sms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bursar Fee Billing & Invoices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('sms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Gradebook & Official Transcripts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Faculty & Administration */}
          <div>
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Faculty & Administration
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectPage('teachers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Department Chairs & Preceptors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('teachers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Office Hours Consultation Desk
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAnnouncements}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Campus Bulletins & Notices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  School Profile & CMS Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admissions Inquiry Desk
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} {schoolName}. All rights reserved. {accreditation}.
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Family Educational Rights & Privacy (FERPA)</span>
            <span aria-hidden="true">·</span>
            <span>Accredited Academic Institution</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
