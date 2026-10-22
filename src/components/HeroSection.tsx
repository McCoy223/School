import React from 'react';
import { ArrowRight, Calendar, Users, GraduationCap, Award, Compass, BookOpen } from 'lucide-react';
import { IMAGES } from '../assets/images';
import { SiteSettings, QuickStat } from '../types';

interface HeroSectionProps {
  settings: SiteSettings;
  quickStats: QuickStat[];
  onNavigateToCalendar: () => void;
  onNavigateToPortals: () => void;
  onNavigateToAcademics: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  quickStats,
  onNavigateToCalendar,
  onNavigateToPortals,
  onNavigateToAcademics
}) => {
  return (
    <div className="relative bg-white border-b border-stone-200 overflow-hidden">
      {/* Subtle top notification ribbon */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-300">{settings.termName}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Classes in Session</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Admissions Priority Deadline: {settings.admissionsDeadline}</span>
          </div>
          <div className="flex items-center gap-4 text-stone-300 text-[11px]">
            <span>Campus Visiting Hours: {settings.visitingHours}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <button 
              onClick={onNavigateToCalendar}
              className="text-amber-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              {settings.topRibbonAlert}
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Left Text Narrative (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed clean metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              <span>College Preparatory & IB World School</span>
              <span aria-hidden="true">·</span>
              <span>Founded {settings.foundedYear}</span>
              <span aria-hidden="true">·</span>
              <span>Grades K–12</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950 tracking-tight leading-[1.15] text-balance mb-6">
              {settings.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mb-8">
              {settings.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onNavigateToPortals}
                className="px-6 py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Access Student & Parent Portals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onNavigateToCalendar}
                className="px-5 py-3 text-sm font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-stone-500" />
                <span>View Event Calendar</span>
              </button>

              <button
                onClick={onNavigateToAcademics}
                className="px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Academic Curriculum
              </button>
            </div>

            {/* Accreditation trust line */}
            <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-medium text-stone-700">Accredited by</span>
              <span>{settings.accreditationText}</span>
            </div>
          </div>

          {/* Right Hero Image Card (5 cols) */}
          <div className="lg:col-span-5 relative flex">
            <div className="w-full relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm flex flex-col">
              <img
                src={IMAGES.campusHero}
                alt={`${settings.schoolName} historic quadrangle and academic hall`}
                className="w-full h-80 sm:h-96 lg:h-full object-cover transition-transform duration-700 hover:scale-102"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              {/* Subtle caption overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent text-white">
                <p className="text-xs font-serif italic text-stone-200">
                  The Historic Great Hall and North Quadrangle in autumn light.
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Maintained in continuous academic service since October {settings.foundedYear}.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Full-width 4-column KPI strip below the hero split */}
      <div className="bg-stone-100/80 border-t border-stone-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {quickStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-stone-800 mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
