import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Download,
  Plus,
  Check,
  Search,
  Filter,
  X,
  Share2
} from 'lucide-react';
import { SchoolEvent, EventCategory } from '../types';
import { exportEventToICS } from '../utils/calendarExport';

interface EventCalendarProps {
  events: SchoolEvent[];
  onToggleRSVP: (eventId: string) => void;
  onAddEvent: (newEvent: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'userRsvpd'>) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onToggleRSVP,
  onAddEvent
}) => {
  // Calendar viewing state
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 21)); // October 2026
  const [viewMode, setViewMode] = useState<'month' | 'agenda' | 'week'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ date: string; events: SchoolEvent[] } | null>(null);
  
  // Create Event Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('academic');
  const [newDate, setNewDate] = useState('2026-11-10');
  const [newTime, setNewTime] = useState('14:00 - 15:30');
  const [newLocation, setNewLocation] = useState('');
  const [newBuilding, setNewBuilding] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newAudience, setNewAudience] = useState<'all' | 'students' | 'parents' | 'faculty'>('all');
  const [eventCreatedNotice, setEventCreatedNotice] = useState(false);

  // Filter categories
  const categories: { id: string; label: string; dotColor: string }[] = [
    { id: 'all', label: 'All Categories', dotColor: 'bg-stone-500' },
    { id: 'academic', label: 'Academics & Exams', dotColor: 'bg-indigo-600' },
    { id: 'arts', label: 'Arts & Concerts', dotColor: 'bg-amber-600' },
    { id: 'athletics', label: 'Athletics & Regattas', dotColor: 'bg-emerald-600' },
    { id: 'community', label: 'Community & Service', dotColor: 'bg-teal-600' },
    { id: 'admissions', label: 'Admissions Open House', dotColor: 'bg-rose-600' },
    { id: 'pta', label: 'Parents & Family', dotColor: 'bg-purple-600' }
  ];

  // Helper colors for events
  const getCategoryMeta = (cat: EventCategory) => {
    switch (cat) {
      case 'academic': return { label: 'Academic', color: 'text-indigo-900 bg-indigo-50 border-indigo-200' };
      case 'arts': return { label: 'Arts & Music', color: 'text-amber-900 bg-amber-50 border-amber-200' };
      case 'athletics': return { label: 'Athletics', color: 'text-emerald-900 bg-emerald-50 border-emerald-200' };
      case 'community': return { label: 'Community', color: 'text-teal-900 bg-teal-50 border-teal-200' };
      case 'admissions': return { label: 'Admissions', color: 'text-rose-900 bg-rose-50 border-rose-200' };
      case 'pta': return { label: 'Family & PTA', color: 'text-purple-900 bg-purple-50 border-purple-200' };
      default: return { label: 'Event', color: 'text-stone-900 bg-stone-50 border-stone-200' };
    }
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
      const matchAud = selectedAudience === 'all' || e.targetAudience === 'all' || e.targetAudience === selectedAudience;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchCat && matchAud;

      const matchQuery =
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query) ||
        e.organizer.toLowerCase().includes(query);

      return matchCat && matchAud && matchQuery;
    });
  }, [events, selectedCategory, selectedAudience, searchQuery]);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 21));
  };

  // Calendar calculations
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Create calendar cells
  const calendarDays = useMemo(() => {
    const days: { day: number; currentMonth: boolean; dateStr: string; events: SchoolEvent[] }[] = [];

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        currentMonth: false,
        dateStr,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        currentMonth: true,
        dateStr,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    // Next month days to complete 35 or 42 cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        currentMonth: false,
        dateStr,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    return days;
  }, [year, month, firstDayIndex, daysInMonth, prevMonthDays, filteredEvents]);

  // Handle Event Creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddEvent({
      title: newTitle,
      description: newDescription,
      category: newCategory,
      date: newDate,
      time: newTime,
      location: newLocation || 'Campus Quadrangle',
      building: newBuilding || 'Main Academic Hall',
      organizer: newOrganizer || 'Faculty Council',
      isPublic: true,
      targetAudience: newAudience
    });

    setEventCreatedNotice(true);
    setTimeout(() => {
      setEventCreatedNotice(false);
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewLocation('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
            <span>Academic Year 2026–2027</span>
            <span aria-hidden="true">·</span>
            <span>Academy Master Calendar</span>
            <span aria-hidden="true">·</span>
            <span>Event Management</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
            Campus Events & Master Schedule
          </h2>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Live schedule of examinations, symposiums, athletics, orchestral performances, and community assemblies. RSVP or export directly to personal calendars.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit School Event</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Views + Filters + Search */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Month / Year Navigator */}
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-serif font-bold text-stone-900 min-w-44">
              {monthName} {year}
            </h3>
            <div className="flex items-center gap-1 border border-stone-200 rounded-lg p-0.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                Current
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* View Mode Switcher (Month / Agenda) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200/60 w-fit">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-stone-950 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-stone-950 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Agenda List ({filteredEvents.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, halls, topics..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>
        </div>

        {/* Category Filters (interactive buttons per section 1A) */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-500 text-[11px] font-semibold uppercase tracking-wider mr-1">
              Category:
            </span>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dotColor}`} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Audience Filter */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 text-[11px] font-semibold uppercase tracking-wider">
              Audience:
            </span>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-800"
            >
              <option value="all">All Community</option>
              <option value="students">Students Only</option>
              <option value="parents">Parents & Families</option>
              <option value="faculty">Faculty & Staff</option>
            </select>
          </div>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50 text-center text-[11px] font-semibold text-stone-500 uppercase tracking-wider py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-stone-200">
            {calendarDays.map((cell, idx) => {
              const isToday = cell.dateStr === '2026-10-21';
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.events.length > 0) {
                      setSelectedDayEvents({ date: cell.dateStr, events: cell.events });
                    }
                  }}
                  className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors ${
                    cell.currentMonth ? 'bg-white' : 'bg-stone-50/50 text-stone-400'
                  } ${cell.events.length > 0 ? 'hover:bg-amber-50/30 cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold'
                          : cell.currentMonth
                          ? 'text-stone-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {cell.events.length > 0 && (
                      <span className="text-[10px] text-stone-500 font-medium">
                        {cell.events.length} {cell.events.length === 1 ? 'event' : 'events'}
                      </span>
                    )}
                  </div>

                  {/* Event indicators */}
                  <div className="space-y-1 mt-1">
                    {cell.events.slice(0, 2).map(evt => {
                      const meta = getCategoryMeta(evt.category);
                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                          }}
                          className={`text-[11px] truncate px-1.5 py-0.5 rounded border ${meta.color} font-medium hover:opacity-85 transition-opacity`}
                          title={`${evt.title} (${evt.time})`}
                        >
                          {evt.title}
                        </div>
                      );
                    })}
                    {cell.events.length > 2 && (
                      <div className="text-[10px] text-stone-500 font-medium pl-1">
                        +{cell.events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGENDA / LIST VIEW */}
      {viewMode === 'agenda' && (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-stone-200">
              <CalendarIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-700 font-medium">No events match your current filter</p>
              <p className="text-xs text-stone-500 mt-1">Try selecting "All Categories" or clearing the search query.</p>
            </div>
          ) : (
            filteredEvents.map(evt => {
              const meta = getCategoryMeta(evt.category);
              const eventDateObj = new Date(evt.date + 'T00:00:00');
              const formattedDate = eventDateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    {/* Unboxed Metadata Header */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-stone-900">{meta.label}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-stone-700">{formattedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{evt.time}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{evt.targetAudience === 'all' ? 'Open to All' : `${evt.targetAudience} Only`}</span>
                    </div>

                    <h4
                      onClick={() => setSelectedEvent(evt)}
                      className="text-lg font-serif font-bold text-stone-950 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      {evt.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{evt.location} ({evt.building})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>{evt.organizer}</span>
                      </div>
                      <div className="text-stone-500">
                        <span className="font-semibold text-stone-800 tabular-nums">{evt.rsvpCount}</span> RSVPs
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center sm:flex-col md:items-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <button
                      onClick={() => onToggleRSVP(evt.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        evt.userRsvpd
                          ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      {evt.userRsvpd ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Attending</span>
                        </>
                      ) : (
                        <span>RSVP Now</span>
                      )}
                    </button>

                    <button
                      onClick={() => exportEventToICS(evt)}
                      className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Download .ics calendar event"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-500" />
                      <span>Add to Calendar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Day Events Summary Modal (when clicking a date in Month view) */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-serif font-bold text-stone-950">
                Events for {new Date(selectedDayEvents.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="text-stone-400 hover:text-stone-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedDayEvents.events.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedDayEvents(null);
                    setSelectedEvent(evt);
                  }}
                  className="p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-stone-800">{evt.time}</span>
                    <span className="capitalize">{evt.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">{evt.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">{evt.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <span className="font-semibold text-stone-900 capitalize">{selectedEvent.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-950">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs sm:text-sm">
              <p className="text-stone-700 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  <span><strong>Time:</strong> {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                  <span><strong>Venue:</strong> {selectedEvent.location}, {selectedEvent.building}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-stone-400 shrink-0" />
                  <span><strong>Convened by:</strong> {selectedEvent.organizer}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600 pt-2">
                <span>Total Registrations: <strong className="text-stone-900 tabular-nums">{selectedEvent.rsvpCount}</strong></span>
                <span>Audience: <strong className="text-stone-900 capitalize">{selectedEvent.targetAudience}</strong></span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => exportEventToICS(selectedEvent)}
                className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export (.ics)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onToggleRSVP(selectedEvent.id);
                    setSelectedEvent(prev => prev ? {
                      ...prev,
                      userRsvpd: !prev.userRsvpd,
                      rsvpCount: prev.userRsvpd ? prev.rsvpCount - 1 : prev.rsvpCount + 1
                    } : null);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    selectedEvent.userRsvpd
                      ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {selectedEvent.userRsvpd ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Attending ✓</span>
                    </>
                  ) : (
                    <span>Confirm RSVP</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit New School Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Submit School Event
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Publish a new academic, artistic, athletic or community event to the master calendar.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {eventCreatedNotice ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-stone-900 mb-1">Event Scheduled</h4>
                <p className="text-xs text-stone-600">
                  The event has been added to the master calendar and is now visible to the academy community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="py-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Winter Chamber Orchestra Recital"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs bg-white"
                    >
                      <option value="academic">Academic & Exams</option>
                      <option value="arts">Arts & Music</option>
                      <option value="athletics">Athletics</option>
                      <option value="community">Community Service</option>
                      <option value="admissions">Admissions</option>
                      <option value="pta">Parents & Family</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Target Audience</label>
                    <select
                      value={newAudience}
                      onChange={(e) => setNewAudience(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs bg-white"
                    >
                      <option value="all">All Community</option>
                      <option value="students">Students</option>
                      <option value="parents">Parents</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Time Range</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15:30 - 17:00"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Venue / Room</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Main Auditorium"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Building</label>
                    <input
                      type="text"
                      placeholder="e.g. Fine Arts Center"
                      value={newBuilding}
                      onChange={(e) => setNewBuilding(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Host / Organizing Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Department of Performing Arts"
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Description & Programme Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details regarding agenda, seating, requirements..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Publish to Calendar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
