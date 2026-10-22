import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Printer,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Layers,
  Award,
  Lock,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
  onSaveCardMockup?: (studentId: string, mockupUrl: string) => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  student,
  onSaveCardMockup
}) => {
  const [viewMode, setViewMode] = useState<'mockup' | 'digital'>('mockup');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedSuccess, setRegeneratedSuccess] = useState(false);
  const [accessPermissions, setAccessPermissions] = useState<string[]>([
    'Science Complex & Labs',
    'Main Academic Quad',
    'Memorial Library & Archives',
    'Dining Commons Refectory'
  ]);

  // Pick appropriate mockup image or fallback template
  const mockupImage =
    student.idCardMockupUrl ||
    (student.name.toLowerCase().includes('liam')
      ? '/src/assets/images/student_id_liam_1792630513061.jpg'
      : student.name.toLowerCase().includes('cordelia') || student.name.toLowerCase().includes('claire')
      ? '/src/assets/images/student_id_cordelia_1792630515573.jpg'
      : student.name.toLowerCase().includes('sophia')
      ? '/src/assets/images/student_id_sophia_1792630517080.jpg'
      : '/src/assets/images/student_id_badge_card_1792630517398.jpg');

  if (!isOpen) return null;

  const handleSimulateRegenerate = () => {
    setIsRegenerating(true);
    setRegeneratedSuccess(false);

    setTimeout(() => {
      setIsRegenerating(false);
      setRegeneratedSuccess(true);
      setTimeout(() => setRegeneratedSuccess(false), 3000);
    }, 1800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-stone-200 bg-stone-900 text-white rounded-t-2xl flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-stone-950 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
                <span>St. Andrew's Academy Registrar</span>
                <span>·</span>
                <span>Official Identity Card</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">
                Student ID Card Credential Mockup
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          
          {/* Scholar Headline Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 border border-stone-200 p-4 rounded-xl">
            <div>
              <div className="font-serif font-bold text-base text-stone-900">
                {student.name}
              </div>
              <div className="flex items-center gap-2 text-stone-600 font-mono text-[11px] mt-0.5">
                <span>ID: {student.studentId}</span>
                <span>·</span>
                <span>{student.grade} ({student.division})</span>
                <span>·</span>
                <span>Advisor: {student.advisor}</span>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('mockup')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                  viewMode === 'mockup'
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>3D Photorealistic Mockup</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('digital')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                  viewMode === 'digital'
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Interactive PVC Smart Card</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE A: Photorealistic 3D Image Mockup (Generated by tool) */}
          {viewMode === 'mockup' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-stone-900 aspect-3/2 max-h-[380px] flex items-center justify-center">
                {isRegenerating ? (
                  <div className="flex flex-col items-center justify-center text-white space-y-3 p-8">
                    <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <div className="font-serif font-bold text-base">Rendering High-Resolution Mockup...</div>
                    <p className="text-stone-400 text-xs max-w-sm text-center">
                      Synthesizing PVC plastic sheen, Academy gold security crest, RFID microchip, and crisp typography for {student.name}.
                    </p>
                  </div>
                ) : (
                  <img
                    src={mockupImage}
                    alt={`Professional Student ID Card Mockup for ${student.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                )}

                {/* Overlaid Badge Details Banner */}
                <div className="absolute bottom-3 left-3 right-3 bg-stone-950/80 backdrop-blur-md rounded-xl p-3 border border-stone-700/60 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                      SA
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-white">{student.name}</div>
                      <div className="font-mono text-[10px] text-stone-400">
                        {student.studentId} · St. Andrew's Academy PVC Card
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold">
                      VERIFIED ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {regeneratedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Credential card mockup freshly compiled and verified against Academy records.</span>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE B: Interactive Digital Smart ID Card */}
          {viewMode === 'digital' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Click the card or use the toggle button to inspect Front / Reverse side security magnetic strip.</span>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="text-stone-800 hover:text-stone-950 font-semibold flex items-center gap-1 underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Flip to {isFlipped ? 'Front' : 'Reverse Side'}</span>
                </button>
              </div>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer transition-all duration-300 select-none"
              >
                {!isFlipped ? (
                  // FRONT OF ID CARD
                  <div className="rounded-2xl border-2 border-amber-300/60 bg-linear-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-7 shadow-xl relative overflow-hidden">
                    {/* Decorative Watermark Emblem */}
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border-12 border-white/5 pointer-events-none" />

                    <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-amber-100 text-stone-900 flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                          SA
                        </div>
                        <div>
                          <div className="text-[10px] tracking-widest uppercase font-mono font-bold text-amber-300">
                            St. Andrew's Academy
                          </div>
                          <div className="text-sm font-serif font-bold text-white tracking-tight">
                            Official Student Identity Card
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="w-8 h-6 rounded bg-linear-to-r from-amber-400 to-amber-200 border border-amber-500/80 shadow-xs flex items-center justify-center">
                          <span className="text-[9px] font-mono font-bold text-stone-950">CHIP</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-5 items-center">
                      {/* Photo Area */}
                      <div className="w-24 h-28 rounded-xl bg-stone-800 border-2 border-amber-300/50 flex flex-col items-center justify-center text-center p-2 shrink-0 overflow-hidden shadow-inner relative">
                        <div className="w-12 h-12 rounded-full bg-stone-700 text-amber-200 flex items-center justify-center font-serif font-bold text-xl mb-1">
                          {student.name.charAt(0)}
                        </div>
                        <div className="text-[9px] uppercase font-mono text-stone-400 font-semibold tracking-wider">
                          PHOTO
                        </div>
                        <div className="absolute bottom-1 text-[8px] text-emerald-400 font-mono font-bold">
                          ACTIVE
                        </div>
                      </div>

                      {/* Information Column */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-stone-400">Scholar Full Name</div>
                          <div className="text-base font-serif font-bold text-white tracking-tight truncate">
                            {student.name}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-stone-400">Student ID</div>
                            <div className="font-mono font-bold text-amber-300">{student.studentId}</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-stone-400">Division / Grade</div>
                            <div className="font-semibold text-stone-200 truncate">{student.grade}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-stone-400">Academic Term</div>
                            <div className="text-stone-300">2026–2027</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-stone-400">Valid Thru</div>
                            <div className="font-mono text-stone-300">06 / 2027</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Barcode Footer */}
                    <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between">
                      <div className="font-mono text-[9px] text-stone-400 tracking-widest">
                        ||| | ||||| || |||| ||| ||||||| |||| |
                      </div>
                      <div className="text-[9px] font-mono text-stone-400">
                        RFID: 9942-A8F-2026
                      </div>
                    </div>
                  </div>
                ) : (
                  // REVERSE OF ID CARD
                  <div className="rounded-2xl border-2 border-stone-700 bg-stone-900 text-white p-6 shadow-xl relative space-y-4">
                    {/* Magnetic Stripe */}
                    <div className="w-full h-10 bg-stone-950 border-y border-stone-800 -mx-6 px-6" />

                    <div className="text-[10px] text-stone-400 leading-relaxed space-y-1">
                      <p>
                        This card is the property of St. Andrew's Academy and is non-transferable. The holder agrees to observe all campus codes of conduct, laboratory safety protocols, and FERPA regulations.
                      </p>
                      <p>
                        If found, please return to: Office of the Registrar, 1903 Academy Quadrangle, Worcester County, MA.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800 text-xs">
                      <div>
                        <div className="text-[9px] uppercase text-stone-400">Campus Security 24/7</div>
                        <div className="font-mono text-stone-200">(555) 843-2911</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-stone-400">Registrar Office</div>
                        <div className="font-mono text-stone-200">(555) 843-2000</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                      <span>SIGNATURE: Dr. Arthur Vance, Dean</span>
                      <span>CARD NO: {student.studentId}-REV</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Access Permissions & Clearances */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Building Access Clearances Encoded on Smart Card</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {accessPermissions.map((perm, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-lg p-2 text-stone-800 flex items-center gap-1.5 font-medium text-[11px]"
                >
                  <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{perm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Tools Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateRegenerate}
                disabled={isRegenerating}
                className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Mockup'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-500" />
                <span>Print Official Badge</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-200 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
            >
              Close ID Viewer
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
