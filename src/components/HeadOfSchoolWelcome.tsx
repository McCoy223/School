import React from 'react';
import { IMAGES } from '../assets/images';

export const HeadOfSchoolWelcome: React.FC = () => {
  return (
    <section className="py-16 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Portrait Image Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm w-full rounded-2xl overflow-hidden border border-stone-300 bg-white shadow-sm">
              <img
                src={IMAGES.headOfSchool}
                alt="Dr. Elizabeth Harrington, Head of School at St. Andrew's Academy"
                className="w-full aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-white border-t border-stone-200">
                <div className="text-sm font-serif font-bold text-stone-950">
                  Dr. Elizabeth Harrington, Ed.D.
                </div>
                <div className="text-xs text-stone-600">
                  Head of School & Professor of Educational Philosophy
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  14th Head of St. Andrew's Academy · Appointed 2018
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Letter Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
              <span>Leadership Address</span>
              <span aria-hidden="true">·</span>
              <span>Head of School Welcome</span>
              <span aria-hidden="true">·</span>
              <span>Annual Letter</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-tight mb-4">
              "We Educate Not Merely for University Entry, But for a Life of Consequence."
            </h2>

            <div className="prose prose-stone text-xs sm:text-sm text-stone-700 space-y-3.5 leading-relaxed">
              <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-0.5 first-letter:text-stone-900">
                Welcome to St. Andrew’s Academy. For over one hundred and twenty years, our quadrangles have welcomed young women and men eager to test themselves against high standards of intellectual rigor and moral clarity. We believe that true scholastic achievement is never an isolated exercise in memorization; it is the courage to ask demanding questions, the resilience to construct defensible arguments, and the empathy to serve the broader world.
              </p>
              <p>
                Our faculty do not view teaching as a transaction. When you walk through Franklin Science Hall or sit at a Harkness table in Gildersleeve, you witness mentors who know each scholar by name, challenge their assumptions, and nurture their unique intellectual curiosity.
              </p>
              <p>
                Whether you are exploring our admissions pathways, checking on your student's term assignments, or joining us for the Fall Philharmonic Gala, we invite you to be an active partner in our vibrant collegiate community.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <div>
                <span className="font-serif italic font-bold text-stone-900 text-sm block">Elizabeth Harrington</span>
                <span>Head of School, St. Andrew's Academy</span>
              </div>
              <div className="text-[11px] text-stone-500 italic">
                Office of the Headmaster · October 2026
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
