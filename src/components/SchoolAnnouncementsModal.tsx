import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Check, BookOpen, Calendar, Info } from 'lucide-react';
import { SchoolAnnouncement } from '../types';

interface SchoolAnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: SchoolAnnouncement[];
}

export const SchoolAnnouncementsModal: React.FC<SchoolAnnouncementsModalProps> = ({
  isOpen,
  onClose,
  announcements
}) => {
  const [filter, setFilter] = useState<string>('All');

  if (!isOpen) return null;

  const filteredAnnouncements = announcements.filter(a => {
    if (filter === 'All') return true;
    if (filter === 'Urgent') return a.urgent;
    return a.category === filter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-950">
                Official Academy Bulletins & Notices
              </h3>
              <p className="text-xs text-stone-500">
                Administrative announcements, campus alerts, and academic honors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          {['All', 'Urgent', 'Academics', 'Student Life', 'Campus Alert', 'Arts & Athletics'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bulletins List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredAnnouncements.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs">
              No notices match the selected category.
            </div>
          ) : (
            filteredAnnouncements.map(ann => (
              <div
                key={ann.id}
                className={`p-4 rounded-xl border transition-all ${
                  ann.urgent
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                  <div className="flex items-center gap-2">
                    {ann.urgent && (
                      <span className="font-semibold text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Urgent Notice
                      </span>
                    )}
                    <span className="font-medium text-stone-700">{ann.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ann.date}</span>
                  </div>
                  <span className="text-stone-500 text-[11px]">{ann.author}</span>
                </div>

                <h4 className="text-sm font-serif font-bold text-stone-950 mb-1.5">
                  {ann.title}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-200/80 hover:bg-stone-200 rounded-lg cursor-pointer"
          >
            Close Bulletins
          </button>
        </div>

      </div>
    </div>
  );
};
