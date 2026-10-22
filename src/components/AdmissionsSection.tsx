import React, { useState } from 'react';
import { CheckCircle2, Calendar, FileText, Send } from 'lucide-react';
import { SiteSettings, AdmissionsInquiry } from '../types';

interface AdmissionsSectionProps {
  settings?: SiteSettings;
  onAddInquiry?: (inquiry: Omit<AdmissionsInquiry, 'id' | 'status' | 'submittedAt'>) => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({
  settings,
  onAddInquiry
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 9 (Freshman)');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !parentEmail) return;

    if (onAddInquiry) {
      onAddInquiry({
        applicantName,
        parentName,
        parentEmail,
        gradeLevel,
        inquiryNotes
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setApplicantName('');
      setParentName('');
      setParentEmail('');
      setInquiryNotes('');
    }, 3500);
  };

  return (
    <section className="py-16 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Admissions Process & Deadlines */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
              <span>Enrollment & Matriculation</span>
              <span aria-hidden="true">·</span>
              <span>Admissions 2027–2028</span>
            </div>

            <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
              Begin Your Journey at {settings?.schoolName || "St. Andrew's Academy"}
            </h2>

            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
              We seek intellectually inquisitive, morally grounded scholars who will thrive in a demanding, supportive academic atmosphere. We practice need-blind admissions with over $4.2M distributed in annual need-based financial aid.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                  Key Admissions Dates · Entry Fall 2027
                </div>
                <div className="space-y-2 text-xs text-stone-700 mt-2">
                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="font-medium">Priority Application Deadline</span>
                    <span className="font-semibold text-stone-900 tabular-nums">January 15, 2027</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="font-medium">Financial Aid Application (PFS)</span>
                    <span className="font-semibold text-stone-900 tabular-nums">February 1, 2027</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="font-medium">Admissions Decisions Released</span>
                    <span className="font-semibold text-stone-900 tabular-nums">March 10, 2027</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="font-medium">Candidate Enrollment Reply Date</span>
                    <span className="font-semibold text-stone-900 tabular-nums">April 10, 2027</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
                <span className="font-semibold text-stone-900 block mb-1">Standardized Testing Policy:</span>
                <span>St. Andrew's Academy is test-optional for SSAT and ISEE examinations. We evaluate candidates holistically through analytical writing samples, teacher evaluations, personal interviews, and academic transcripts.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-serif font-bold text-stone-950 mb-1">
              Request Prospectus & Campus Tour
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Our admissions team will send a full academic viewbook and invite you to schedule a personalized campus tour.
            </p>

            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-base font-serif font-bold text-stone-900">Inquiry Received</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto mt-2 leading-relaxed">
                  Thank you! An admissions counselor will reach out within 24 business hours with the 2027–2028 Viewbook packet and private tour options.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Prospective Student Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Thomas Vance"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Target Entry Grade</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs bg-white"
                    >
                      <option>Grade 6 (Middle School)</option>
                      <option>Grade 7 (Middle School)</option>
                      <option>Grade 8 (Middle School)</option>
                      <option>Grade 9 (Upper School Freshman)</option>
                      <option>Grade 10 (Upper School Sophomore)</option>
                      <option>Grade 11 (Upper School Junior)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Margaret Vance"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Parent Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. m.vance@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Academic or Co-Curricular Areas of Interest
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Interested in competitive robotics, string orchestra, and AP Biology..."
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-800 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Admissions Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
