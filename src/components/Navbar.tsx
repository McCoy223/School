import React from 'react';
import {
  Search,
  Bell,
  GraduationCap,
  Users,
  Shield,
  LayoutDashboard,
  Server,
  BookOpen
} from 'lucide-react';
import { AppPage } from '../types';

interface NavbarProps {
  activePage: AppPage;
  onSelectPage: (page: AppPage) => void;
  onOpenSearch: () => void;
  onOpenAnnouncements: () => void;
  unreadAnnouncementsCount: number;
  schoolName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  onOpenSearch,
  onOpenAnnouncements,
  unreadAnnouncementsCount,
  schoolName = "St. Andrew's Academy"
}) => {
  const navItems: { id: AppPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'sms', label: 'SMS System', icon: Server },
    { id: 'students', label: 'Student Class', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: Users }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => onSelectPage('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 rounded py-1 shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-stone-900 text-amber-100 flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:bg-stone-800 transition-colors">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-stone-950 whitespace-nowrap leading-none">
                {schoolName}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-semibold mt-0.5">
                School Management System
              </span>
            </div>
          </button>

          {/* Zone 2: The 5 core pages */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-stone-600">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search, Bulletins, Quick Action */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
              title="Search school directory (Cmd+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline text-stone-400 font-mono text-[11px] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                ⌘K
              </span>
            </button>

            <button
              onClick={onOpenAnnouncements}
              className="relative p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Academy Bulletins & Urgent Alerts"
              aria-label="Announcements"
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            <button
              onClick={() => onSelectPage('sms')}
              className="hidden sm:flex px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-200 hover:bg-amber-100 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>SMS Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Nav Bar (all 5 pages accessible) */}
      <div className="lg:hidden border-t border-stone-200 bg-stone-50 px-3 py-2 flex items-center justify-between text-xs font-medium text-stone-700 overflow-x-auto gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
