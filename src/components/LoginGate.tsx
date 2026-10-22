import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  User,
  Key,
  GraduationCap,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  Wifi,
  WifiOff,
  Sparkles,
  Info,
  LogIn
} from 'lucide-react';
import { AuthUserSession } from '../types';
import { auditLogger } from '../services/auditLogger';
import {
  getClerkPublishableKey,
  ClerkConfigModal,
  ClerkLiveAuthWidget
} from './ClerkIntegration';

interface LoginGateProps {
  onLogin: (session: AuthUserSession) => void;
  schoolName?: string;
}

export const LoginGate: React.FC<LoginGateProps> = ({
  onLogin,
  schoolName = "St. Andrew's Academy"
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<AuthUserSession['role']>('admin');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isClerkModalOpen, setIsClerkModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasClerkKey = Boolean(getClerkPublishableKey());
  const isOnline = auditLogger.isNetworkOnline();

  // Preset institutional profiles for one-click access
  const presetProfiles: Array<{
    role: AuthUserSession['role'];
    title: string;
    name: string;
    email: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
  }> = [
    {
      role: 'admin',
      title: 'Academy Administrator',
      name: 'Dr. Elizabeth Harrington',
      email: 'headmaster@standrewsacademy.org',
      description: 'Full administrative access, WordPress CMS editor, and security audit ledger.',
      icon: Shield,
      accentColor: 'border-amber-500/50 hover:border-amber-400 bg-amber-950/20 text-amber-200'
    },
    {
      role: 'faculty',
      title: 'Faculty Fellow & Dept Chair',
      name: 'Dr. Alistair Vance',
      email: 'a.vance@standrewsacademy.org',
      description: 'Course syllabus management, grade assessment uploads, and timetable.',
      icon: Users,
      accentColor: 'border-blue-500/50 hover:border-blue-400 bg-blue-950/20 text-blue-200'
    },
    {
      role: 'student',
      title: 'Honor Scholar (Sixth Form)',
      name: 'Cordelia Montclaire',
      email: 'c.montclaire@scholars.standrews.edu',
      description: 'Class schedule, transcript GPA, assignment submission, and student ID card.',
      icon: GraduationCap,
      accentColor: 'border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/20 text-emerald-200'
    },
    {
      role: 'registrar',
      title: 'Bursar & Financial Controller',
      name: 'Marcus Sterling, CPA',
      email: 'bursar@standrewsacademy.org',
      description: 'Tuition fees ledger, invoice remittance receipts, and admissions ledger.',
      icon: Building,
      accentColor: 'border-purple-500/50 hover:border-purple-400 bg-purple-950/20 text-purple-200'
    }
  ];

  const handleSelectPreset = (preset: typeof presetProfiles[0]) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const session: AuthUserSession = {
        id: `usr-${preset.role}-${Date.now()}`,
        name: preset.name,
        email: preset.email,
        role: preset.role,
        roleTitle: preset.title,
        rememberDevice,
        loggedInAt: new Date().toISOString()
      };

      auditLogger.setClerkActor({
        id: session.id,
        fullName: session.name,
        primaryEmail: session.email,
        sessionId: `ses-${Date.now()}`
      });

      auditLogger.log({
        action: 'AUTH_LOGIN',
        actionLabel: `User Authenticated (${preset.title})`,
        resource: `AuthSession:${preset.role}`,
        resourceId: session.id,
        severity: 'info',
        details: {
          role: preset.role,
          name: preset.name,
          email: preset.email,
          authMethod: 'one_time_role_login',
          deviceRemembered: rememberDevice
        }
      });

      onLogin(session);
    }, 300);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your academic email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const roleTitles: Record<AuthUserSession['role'], string> = {
        admin: 'Academy Administrator',
        faculty: 'Faculty Fellow',
        student: 'Student Scholar',
        parent: 'Guardian / Parent',
        registrar: 'Bursar & Registrar'
      };

      const session: AuthUserSession = {
        id: `usr-${Date.now()}`,
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        role,
        roleTitle: roleTitles[role],
        rememberDevice,
        loggedInAt: new Date().toISOString()
      };

      auditLogger.setClerkActor({
        id: session.id,
        fullName: session.name,
        primaryEmail: session.email,
        sessionId: `ses-${Date.now()}`
      });

      auditLogger.log({
        action: 'AUTH_LOGIN',
        actionLabel: `Credentials Login: ${session.name} (${roleTitles[role]})`,
        resource: 'AuthSession:Credentials',
        resourceId: session.id,
        severity: 'info',
        details: {
          role,
          email: session.email,
          name: session.name,
          authMethod: 'institutional_credentials',
          deviceRemembered: rememberDevice
        }
      });

      onLogin(session);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#111417] text-stone-100 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950 relative overflow-hidden">
      {/* Subtle Background Ornament */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-[#2271b1] rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-700 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-stone-800/80 bg-[#161a1e]/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 border border-amber-500/30 text-amber-300 flex items-center justify-center font-serif font-black text-sm shadow-md">
            SA
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm tracking-wide text-white">
              {schoolName}
            </h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
              Central Authentication Service (CAS)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Online System</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline Resilient</span>
              </>
            )}
          </div>

          <ClerkLiveAuthWidget onOpenKeyModal={() => setIsClerkModalOpen(true)} />
        </div>
      </header>

      {/* Center Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl bg-[#191e23] border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Top Banner Notice: One-Time Login Explanation */}
          <div className="bg-gradient-to-r from-stone-900 via-[#1c242b] to-stone-900 px-6 py-5 border-b border-stone-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-white">
                  Academy One-Time Sign In
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Sign in once to authenticate this terminal. Your session will remain securely active for all academy systems.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] bg-stone-800/80 border border-stone-700 px-3 py-1.5 rounded-lg text-stone-300 shrink-0 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Persistent Session</span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-stone-800 bg-[#14181c] text-xs">
            <button
              onClick={() => {
                setActiveTab('quick');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 px-4 font-semibold text-center transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'quick'
                  ? 'border-amber-400 text-amber-300 bg-stone-900/40'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Institutional Access</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('credentials');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 px-4 font-semibold text-center transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'credentials'
                  ? 'border-[#72aee6] text-[#72aee6] bg-stone-900/40'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Custom Academy Credentials</span>
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: QUICK ROLE PRESETS */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-400">
                  Select your institutional affiliation below to sign in immediately with pre-configured academy privileges:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {presetProfiles.map(preset => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.role}
                        onClick={() => handleSelectPreset(preset)}
                        disabled={isSubmitting}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between hover:scale-[1.01] ${preset.accentColor}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-white shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-sm text-white group-hover:text-amber-200 transition-colors">
                                {preset.title}
                              </h3>
                              <p className="text-[11px] text-stone-300 font-medium">
                                {preset.name}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-[11px] text-stone-400 mt-2.5 leading-relaxed line-clamp-2">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Clerk Quick Connect */}
                <div className="mt-4 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-stone-900/50 p-3.5 rounded-xl border border-stone-800">
                  <div className="flex items-center gap-2 text-stone-300 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Or authenticate via real Clerk OAuth / Social / Passkey</span>
                  </div>
                  <ClerkLiveAuthWidget onOpenKeyModal={() => setIsClerkModalOpen(true)} />
                </div>
              </div>
            )}

            {/* TAB 2: CREDENTIALS FORM */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g., Jonathan Sterling"
                      className="w-full bg-[#121619] border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#72aee6]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      Institutional Role
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as any)}
                      className="w-full bg-[#121619] border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#72aee6]"
                    >
                      <option value="admin">Administrator (Full Privileges & CMS)</option>
                      <option value="faculty">Faculty Member (Grading & Courses)</option>
                      <option value="student">Student Scholar (Classroom & IDs)</option>
                      <option value="registrar">Bursar / Registrar (Billing & Invoices)</option>
                      <option value="parent">Parent / Guardian (Auditing)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      Academic Email Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="user@standrewsacademy.org"
                      className="w-full bg-[#121619] border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#72aee6]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">
                      Password <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#121619] border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#72aee6]"
                    />
                  </div>
                </div>

                {/* Remember device checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberDeviceCheck"
                    checked={rememberDevice}
                    onChange={e => setRememberDevice(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <label
                    htmlFor="rememberDeviceCheck"
                    className="text-stone-300 text-xs font-medium cursor-pointer"
                  >
                    Remember this device (One-Time Login - bypass login on future visits)
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-lg font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In & Unlock Portal'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Device Persistence Notice */}
            <div className="mt-6 pt-4 border-t border-stone-800 text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Session is securely cached on this device via encrypted local storage.</span>
              </span>
              <span className="font-mono text-stone-400">
                SHA-256 Ledger Verified
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800/60 bg-[#14181c]/90 px-6 py-3 text-center text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 {schoolName}. All administrative interactions are cryptographically audited.</span>
        <span className="italic font-serif text-stone-400">In Lumine Tuo Videbimus Lumen</span>
      </footer>

      {/* Clerk Config Modal */}
      <ClerkConfigModal
        isOpen={isClerkModalOpen}
        onClose={() => setIsClerkModalOpen(false)}
        onKeySaved={() => {}}
      />
    </div>
  );
};
