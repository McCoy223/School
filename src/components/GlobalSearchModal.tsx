import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, Calendar, BookOpen, Bell, ArrowRight } from 'lucide-react';
import { FacultyMember, SchoolEvent, Course, SchoolAnnouncement, AppPage } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: FacultyMember[];
  events: SchoolEvent[];
  courses: Course[];
  announcements: SchoolAnnouncement[];
  onSelectFaculty?: (f: FacultyMember) => void;
  onSelectEvent?: (e: SchoolEvent) => void;
  onNavigatePage: (page: AppPage) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  faculty,
  events,
  courses,
  announcements,
  onSelectFaculty,
  onSelectEvent,
  onNavigatePage
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingFaculty = cleanQuery
    ? faculty.filter(f =>
        f.name.toLowerCase().includes(cleanQuery) ||
        f.department.toLowerCase().includes(cleanQuery) ||
        f.coursesTaught.some(c => c.toLowerCase().includes(cleanQuery))
      ).slice(0, 3)
    : [];

  const matchingEvents = cleanQuery
    ? events.filter(e =>
        e.title.toLowerCase().includes(cleanQuery) ||
        e.description.toLowerCase().includes(cleanQuery) ||
        e.location.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const matchingCourses = cleanQuery
    ? courses.filter(c =>
        c.name.toLowerCase().includes(cleanQuery) ||
        c.code.toLowerCase().includes(cleanQuery) ||
        c.instructor.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const matchingAnnouncements = cleanQuery
    ? announcements.filter(a =>
        a.title.toLowerCase().includes(cleanQuery) ||
        a.content.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  const hasResults =
    matchingFaculty.length > 0 ||
    matchingEvents.length > 0 ||
    matchingCourses.length > 0 ||
    matchingAnnouncements.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        
        {/* Search header */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search scholars, teachers, courses, bulletins, departments..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-stone-900 placeholder-stone-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 text-xs">
          {!cleanQuery ? (
            <div className="text-stone-400 text-center py-8">
              <p>Type keywords to search across the entire academy system.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[11px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded">Physics</span>
                <span className="text-[11px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded">Dr. Vance</span>
                <span className="text-[11px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded">Calculus</span>
                <span className="text-[11px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded">Tuition</span>
                <span className="text-[11px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded">Admissions</span>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-stone-500">
              No matching records found for "{query}". Try checking the spelling or searching by department.
            </div>
          ) : (
            <>
              {/* Faculty results */}
              {matchingFaculty.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Faculty & Teachers ({matchingFaculty.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingFaculty.map(f => (
                      <div
                        key={f.id}
                        onClick={() => {
                          if (onSelectFaculty) onSelectFaculty(f);
                          onClose();
                          onNavigatePage('teachers');
                        }}
                        className="p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold text-stone-900">{f.name}</div>
                          <div className="text-stone-500 text-[11px]">{f.title} · {f.department}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events results */}
              {matchingEvents.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Events & Master Schedule ({matchingEvents.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingEvents.map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          if (onSelectEvent) onSelectEvent(e);
                          onClose();
                          onNavigatePage('dashboard');
                        }}
                        className="p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold text-stone-900">{e.title}</div>
                          <div className="text-stone-500 text-[11px]">{e.date} · {e.time} · {e.location}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses results */}
              {matchingCourses.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Academic Courses ({matchingCourses.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingCourses.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onClose();
                          onNavigatePage('students');
                        }}
                        className="p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold text-stone-900">{c.code}: {c.name}</div>
                          <div className="text-stone-500 text-[11px]">{c.instructor} · {c.schedule}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements results */}
              {matchingAnnouncements.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Official Bulletins ({matchingAnnouncements.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingAnnouncements.map(a => (
                      <div
                        key={a.id}
                        className="p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                      >
                        <div className="font-semibold text-stone-900">{a.title}</div>
                        <div className="text-stone-500 text-[11px] line-clamp-1 mt-0.5">{a.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>St. Andrew's Academy System Directory</span>
        </div>

      </div>
    </div>
  );
};
