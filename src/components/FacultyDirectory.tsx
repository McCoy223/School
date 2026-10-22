import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, MapPin, Clock, Calendar, Check, X, Award, BookOpen, GraduationCap } from 'lucide-react';
import { FacultyMember } from '../types';

interface FacultyDirectoryProps {
  facultyList: FacultyMember[];
  onBookOfficeHours?: (facultyId: string, consultationDetails: any) => void;
}

export const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({
  facultyList,
  onBookOfficeHours
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedFacultyForDetails, setSelectedFacultyForDetails] = useState<FacultyMember | null>(null);
  
  // Consultation booking modal state
  const [consultationFaculty, setConsultationFaculty] = useState<FacultyMember | null>(null);
  const [studentName, setStudentName] = useState('Liam Montgomery');
  const [studentEmail, setStudentEmail] = useState('l.montgomery27@students.standrewsacademy.org');
  const [consultationDate, setConsultationDate] = useState('2026-10-27');
  const [consultationTime, setConsultationTime] = useState('14:30');
  const [consultationTopic, setConsultationTopic] = useState('');
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  const departments = [
    'All',
    'Sciences & Mathematics',
    'Humanities & Social Sciences',
    'World Languages',
    'Fine & Performing Arts',
    'Athletics & Physical Education'
  ];

  const filteredFaculty = useMemo(() => {
    return facultyList.filter(f => {
      const matchesDept = selectedDepartment === 'All' || f.department === selectedDepartment;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesDept;

      const matchesQuery = 
        f.name.toLowerCase().includes(query) ||
        f.title.toLowerCase().includes(query) ||
        f.department.toLowerCase().includes(query) ||
        f.coursesTaught.some(c => c.toLowerCase().includes(query)) ||
        f.education.some(e => e.toLowerCase().includes(query));

      return matchesDept && matchesQuery;
    });
  }, [facultyList, selectedDepartment, searchQuery]);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationFaculty) return;

    if (onBookOfficeHours) {
      onBookOfficeHours(consultationFaculty.id, {
        studentName,
        studentEmail,
        date: consultationDate,
        time: consultationTime,
        topic: consultationTopic
      });
    }

    setBookingSuccessMessage(
      `Consultation with ${consultationFaculty.name} confirmed for ${consultationDate} at ${consultationTime}. A calendar invitation has been dispatched.`
    );
    setTimeout(() => {
      setBookingSuccessMessage(null);
      setConsultationFaculty(null);
      setConsultationTopic('');
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header section */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
          <span>Academic Staff</span>
          <span aria-hidden="true">·</span>
          <span>Faculty Directory</span>
          <span aria-hidden="true">·</span>
          <span>Office Consultations</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
          Scholars, Mentors & Department Chairs
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
          St. Andrew's faculty hold advanced terminal degrees from premier global research institutions. Reach out directly for student academic guidance, honors thesis advisement, or scheduled office consultations.
        </p>
      </div>

      {/* Search and Department Filter Toolbar */}
      <div className="space-y-4 mb-8">
        {/* Search input */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name, course, discipline, or alma mater..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-stone-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter buttons - functional segmented controls per Section 1A */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit border border-stone-200/70">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedDepartment === dept
                  ? 'bg-white text-stone-950 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {dept === 'All' ? 'All Departments' : dept.replace('&', '&')}
            </button>
          ))}
        </div>
      </div>

      {/* Directory count and active filter summary */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6 pb-2 border-b border-stone-200">
        <div>
          <span>Showing {filteredFaculty.length} of {facultyList.length} faculty members</span>
          {selectedDepartment !== 'All' && (
            <>
              <span aria-hidden="true" className="mx-1.5">·</span>
              <span className="font-medium text-stone-800">{selectedDepartment}</span>
            </>
          )}
        </div>
        <span className="hidden sm:inline">Office consultations can be reserved online</span>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-stone-200">
          <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-700 font-medium">No faculty members found matching your search</p>
          <p className="text-xs text-stone-500 mt-1">Try adjusting your department filter or search keyword.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedDepartment('All'); }}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-sm transition-shadow"
            >
              <div>
                {/* Faculty Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${faculty.avatarColor} text-white font-serif font-semibold text-lg flex items-center justify-center shrink-0 shadow-xs`}>
                    {faculty.name.replace(/^(Dr\.|Coach|Dean)\s+/, '').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-serif font-bold text-stone-950 truncate">
                      {faculty.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                      {faculty.title}
                    </p>
                    <div className="text-[11px] font-medium text-stone-500 mt-0.5">
                      {faculty.department}
                    </div>
                  </div>
                </div>

                {/* Unboxed Metadata list with clean spacing */}
                <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{faculty.officeRoom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{faculty.officeHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate text-stone-500">{faculty.education[0]}</span>
                  </div>
                </div>

                {/* Courses preview */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Instructional Courses
                  </div>
                  <div className="text-xs text-stone-800 space-y-1">
                    {faculty.coursesTaught.slice(0, 2).map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0" />
                        <span className="truncate">{c}</span>
                      </div>
                    ))}
                    {faculty.coursesTaught.length > 2 && (
                      <div className="text-[11px] text-stone-500 pl-2.5">
                        +{faculty.coursesTaught.length - 2} additional elective
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyEmail(faculty.email, faculty.id)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                    title={copiedEmailId === faculty.id ? 'Copied!' : `Copy ${faculty.email}`}
                    aria-label="Copy Email"
                  >
                    {copiedEmailId === faculty.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedFacultyForDetails(faculty)}
                    className="text-xs text-stone-600 hover:text-stone-950 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Full Bio
                  </button>
                </div>

                {faculty.consultationAvailable ? (
                  <button
                    onClick={() => {
                      setConsultationFaculty(faculty);
                      setBookingSuccessMessage(null);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-stone-600" />
                    <span>Office Hours</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-400 italic">By appointment</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Bio Modal */}
      {selectedFacultyForDetails && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-lg ${selectedFacultyForDetails.avatarColor} text-white font-serif font-bold text-xl flex items-center justify-center shrink-0`}>
                  {selectedFacultyForDetails.name.charAt(selectedFacultyForDetails.name.search(/[A-Z]/))}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-950">
                    {selectedFacultyForDetails.name}
                  </h3>
                  <p className="text-xs font-medium text-stone-600">
                    {selectedFacultyForDetails.title}
                  </p>
                  <p className="text-xs text-stone-500">
                    {selectedFacultyForDetails.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFacultyForDetails(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 text-sm">
              {/* Bio */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Academic Biography & Background
                </h4>
                <p className="text-stone-700 leading-relaxed">
                  {selectedFacultyForDetails.bio}
                </p>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Academic Degrees & Terminal Credentials
                </h4>
                <ul className="space-y-1.5 text-stone-800">
                  {selectedFacultyForDetails.education.map((degree, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-stone-400 shrink-0" />
                      <span>{degree}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Courses Taught */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Current Term Courses & Seminars
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFacultyForDetails.coursesTaught.map((c, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/70 text-xs text-stone-800">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact and Office Details */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-stone-900 block mb-0.5">Office Location</span>
                  <span>{selectedFacultyForDetails.officeRoom}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 block mb-0.5">Office Hours</span>
                  <span>{selectedFacultyForDetails.officeHours}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 block mb-0.5">Institutional Email</span>
                  <a href={`mailto:${selectedFacultyForDetails.email}`} className="text-stone-900 hover:underline">
                    {selectedFacultyForDetails.email}
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 block mb-0.5">Direct Extension</span>
                  <span>{selectedFacultyForDetails.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedFacultyForDetails(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedFacultyForDetails.consultationAvailable && (
                <button
                  onClick={() => {
                    const f = selectedFacultyForDetails;
                    setSelectedFacultyForDetails(null);
                    setConsultationFaculty(f);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Book Office Hours
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Consultation Booking Modal */}
      {consultationFaculty && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  Schedule Office Consultation
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  With {consultationFaculty.name} ({consultationFaculty.department})
                </p>
              </div>
              <button
                onClick={() => setConsultationFaculty(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessMessage ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-stone-900 mb-1">Appointment Confirmed</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  {bookingSuccessMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Student Scholar Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Academy Email</label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={consultationDate}
                      onChange={(e) => setConsultationDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Time Slot</label>
                    <select
                      value={consultationTime}
                      onChange={(e) => setConsultationTime(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    >
                      <option value="14:00">14:00 - 14:20</option>
                      <option value="14:30">14:30 - 14:50</option>
                      <option value="15:00">15:00 - 15:20</option>
                      <option value="15:30">15:30 - 15:50</option>
                      <option value="16:00">16:00 - 16:20</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Discussion Topic / Purpose
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={consultationTopic}
                    onChange={(e) => setConsultationTopic(e.target.value)}
                    placeholder="e.g. Inquire regarding AP Mechanics laboratory error margins and question 4 on problem set..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationFaculty(null)}
                    className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Confirm Consultation
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
