import React from 'react';
import { BookOpen, Compass, Award, ArrowRight, Check } from 'lucide-react';
import { IMAGES } from '../assets/images';
import { ACADEMIC_DIVISIONS } from '../data/mockData';

interface AcademicProgramsSectionProps {
  onExploreCourses: () => void;
  onViewFaculty: () => void;
}

export const AcademicProgramsSection: React.FC<AcademicProgramsSectionProps> = ({
  onExploreCourses,
  onViewFaculty
}) => {
  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
            <span>Rigorous Scholarship</span>
            <span aria-hidden="true">·</span>
            <span>Academic Framework</span>
            <span aria-hidden="true">·</span>
            <span>Continuum K–12</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight text-balance">
            Intellectual Rigor Grounded in Classical Foundations and Modern Inquiry
          </h2>
          <p className="text-stone-600 text-base mt-3 leading-relaxed">
            Our curriculum balances the analytical discipline of mathematics and empirical laboratory sciences with the historical depth of the humanities and creative expression.
          </p>
        </div>

        {/* Feature Split: Collaborative Lab Image + Upper School Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs relative">
            <img
              src={IMAGES.studentsAcademics}
              alt="Scholars conducting advanced biotechnology and physical laboratory research"
              className="w-full h-80 sm:h-96 lg:h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent text-white">
              <p className="text-xs font-serif italic text-stone-200">
                Upper School research scholars at the Franklin Science Hall Wet Lab.
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Equipped with spectrophotometers, CRISPR assay kits, and digital sensor arrays.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
                Curricular Distinction
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-950">
                The AP & Harkness Seminar Continuum
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                Rather than passive lecture halls, St. Andrew's classes average 12 scholars gathered around oval Harkness mahogany tables. Discussion is peer-driven, rigorous, and guided by master educators.
              </p>

              <div className="space-y-3 mt-6 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">✓</div>
                  <span><strong>38 Advanced Placement Courses</strong> including Post-AP Multivariable Calculus and Quantum Mechanics</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">✓</div>
                  <span><strong>Senior Thesis Fellowships:</strong> Year-long independent research evaluated by visiting university faculty</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">✓</div>
                  <span><strong>Global Languages:</strong> French, Spanish, Latin, and Mandarin literature tracks with study abroad</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex items-center gap-4 mt-6">
              <button
                onClick={onViewFaculty}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Meet Faculty Chairs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Academic Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACADEMIC_DIVISIONS.map((div, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Division 0{idx + 1}
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-950">
                  {div.name}
                </h3>
                <p className="text-xs font-medium text-stone-600 mt-0.5">
                  {div.subtitle}
                </p>
                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {div.description}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                  {div.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-stone-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <button
                  onClick={onExploreCourses}
                  className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Course Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
