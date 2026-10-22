import React from 'react';
import { Music, Trophy, Compass, HeartHandshake, ArrowRight } from 'lucide-react';
import { IMAGES } from '../assets/images';

interface CampusLifeSectionProps {
  onExploreCalendar: () => void;
}

export const CampusLifeSection: React.FC<CampusLifeSectionProps> = ({
  onExploreCalendar
}) => {
  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
            <span>Co-Curricular Excellence</span>
            <span aria-hidden="true">·</span>
            <span>Arts & Athletics</span>
            <span aria-hidden="true">·</span>
            <span>Traditions</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
            Choral Resonance, Varsity Competition & Lifelong Camaraderie
          </h2>
          <p className="text-stone-600 text-base mt-2 leading-relaxed">
            Education extends far beyond the lecture hall. Over 92% of students participate in varsity athletic squads or fine arts ensembles, fostering balance, stamina, and artistic poise.
          </p>
        </div>

        {/* Feature Split with Arts & Orchestra Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs relative">
            <img
              src={IMAGES.artsAthletics}
              alt="St. Andrew's Academy Symphony Orchestra performing in acoustic timber concert hall"
              className="w-full h-80 sm:h-96 lg:h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent text-white">
              <p className="text-xs font-serif italic text-stone-200">
                The St. Andrew's Academy Philharmonic in the Chamber Concert Hall.
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Annual Fall Symphony Gala scheduled for this Saturday, October 24.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
                Varsity Athletics & Performing Arts
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-950">
                19 Interscholastic Sports & 14 Master Ensembles
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                St. Andrew's competes in the New England Prep School Athletic Council (NEPSAC Class A). From our historic Boathouse crew to the chamber string masterclasses, students discover discipline and ensemble camaraderie.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6 text-xs">
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-900 block mb-0.5">Varsity Crew & Sailing</span>
                  <span className="text-stone-500 text-[11px]">4-time New England Interscholastic Champions</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-900 block mb-0.5">Chamber Symphony</span>
                  <span className="text-stone-500 text-[11px]">Annual tour to Carnegie Hall & European cathedrals</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-900 block mb-0.5">Studio Arts Wing</span>
                  <span className="text-stone-500 text-[11px]">Darkrooms, ceramics wheels, and 3D prototyping</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-900 block mb-0.5">42 Student Clubs</span>
                  <span className="text-stone-500 text-[11px]">Model UN, Debate, Robotics, Mock Trial & Ethics</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex items-center justify-between mt-6">
              <button
                onClick={onExploreCalendar}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Check Athletic & Arts Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
