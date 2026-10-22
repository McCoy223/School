import React, { useEffect, useState } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk
} from '@clerk/clerk-react';
import { Shield, Key, CheckCircle, AlertCircle, ExternalLink, RefreshCw, LogIn, UserCheck } from 'lucide-react';
import { auditLogger } from '../services/auditLogger';

const CLERK_STORAGE_KEY = 'sa_clerk_publishable_key';

export function getClerkPublishableKey(): string {
  // Check env variable first
  const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (envKey && envKey.trim() !== '' && !envKey.includes('pk_test_...')) {
    return envKey.trim();
  }

  // Check stored override in localStorage
  try {
    const local = localStorage.getItem(CLERK_STORAGE_KEY);
    if (local && local.trim() !== '') {
      return local.trim();
    }
  } catch {}

  // If env key exists even as placeholder, return it if user replaced it
  if (envKey && envKey.startsWith('pk_')) {
    return envKey.trim();
  }

  return '';
}

export function saveClerkPublishableKey(key: string) {
  try {
    if (!key || key.trim() === '') {
      localStorage.removeItem(CLERK_STORAGE_KEY);
    } else {
      localStorage.setItem(CLERK_STORAGE_KEY, key.trim());
    }
  } catch {}
}

/**
 * Inner component mounted inside ClerkProvider to sync real Clerk user session
 * to the auditLogger singleton automatically.
 */
function ClerkUserAuditor() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      auditLogger.setClerkActor({
        id: user.id,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Clerk User',
        primaryEmail: user.primaryEmailAddress?.emailAddress || null,
        avatarUrl: user.imageUrl || null,
        sessionId: user.id
      });
    } else {
      auditLogger.setClerkActor(null);
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}

/**
 * Live Clerk User Status component
 */
export function ClerkLiveAuthWidget({ onOpenKeyModal }: { onOpenKeyModal?: () => void }) {
  const activeKey = getClerkPublishableKey();

  if (!activeKey) {
    return (
      <div className="flex items-center gap-2 bg-stone-900/80 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs text-amber-200">
        <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate max-w-[200px]">Clerk Key Required for Real Auth</span>
        {onOpenKeyModal && (
          <button
            onClick={onOpenKeyModal}
            className="text-[11px] bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded font-medium cursor-pointer transition-colors"
          >
            Configure
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <div className="flex items-center gap-2 bg-[#2c3338] border border-emerald-500/30 px-2.5 py-1 rounded-md text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-medium text-[11px] hidden sm:inline">Clerk Active</span>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-6 h-6 rounded-full border border-stone-600'
              }
            }}
          />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <button className="flex items-center gap-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors shadow-sm">
              <LogIn className="w-3.5 h-3.5" />
              <span>Clerk Sign In</span>
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-stone-300 hover:text-white px-2 py-1 text-xs font-medium cursor-pointer transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
}

/**
 * Clerk Configuration Modal for entering real publishable key
 */
export function ClerkConfigModal({
  isOpen,
  onClose,
  onKeySaved
}: {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (newKey: string) => void;
}) {
  const [inputKey, setInputKey] = useState(getClerkPublishableKey());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputKey(getClerkPublishableKey());
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      saveClerkPublishableKey('');
      onKeySaved('');
      onClose();
      return;
    }

    if (!trimmed.startsWith('pk_test_') && !trimmed.startsWith('pk_live_')) {
      setError('A valid Clerk Publishable Key starts with "pk_test_" or "pk_live_".');
      return;
    }

    saveClerkPublishableKey(trimmed);
    setSuccess(true);
    setError(null);
    setTimeout(() => {
      onKeySaved(trimmed);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1d2327] text-stone-200 border border-stone-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-stone-700 flex items-center justify-between bg-[#15191c]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2271b1] flex items-center justify-center text-white font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Clerk Authentication Setup</h3>
              <p className="text-[11px] text-stone-400">Strict real authentication — no demo or mock mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <p className="text-stone-300 leading-relaxed">
            To attribute audit logs to real Clerk users, provide your <strong>Publishable Key</strong> from your{' '}
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#72aee6] underline inline-flex items-center gap-1 hover:text-white"
            >
              Clerk Dashboard <ExternalLink className="w-3 h-3 inline" />
            </a>.
          </p>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">
              Clerk Publishable Key (<code className="font-mono text-amber-300">pk_test_...</code> or{' '}
              <code className="font-mono text-emerald-300">pk_live_...</code>):
            </label>
            <input
              type="text"
              value={inputKey}
              onChange={e => {
                setInputKey(e.target.value);
                setError(null);
              }}
              placeholder="pk_test_..."
              className="w-full bg-[#101416] border border-stone-600 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#72aee6] shadow-inner"
            />
            {error && (
              <p className="mt-1.5 text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
            {success && (
              <p className="mt-1.5 text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                Key saved. Initializing live Clerk session...
              </p>
            )}
          </div>

          <div className="bg-[#15191c] p-3 rounded-lg border border-stone-800 text-stone-400 text-[11px] space-y-1">
            <span className="font-semibold text-stone-300 block">Permanent Configuration (.env.local):</span>
            <code className="block font-mono bg-black/40 p-2 rounded text-stone-300 select-all">
              VITE_CLERK_PUBLISHABLE_KEY={inputKey || 'pk_test_your_key_here'}
            </code>
            <span>Keys saved in this dialog are also retained in your browser cache.</span>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-[#15191c] border-t border-stone-700 flex items-center justify-between">
          <button
            onClick={() => {
              saveClerkPublishableKey('');
              setInputKey('');
              setError(null);
            }}
            className="text-stone-400 hover:text-rose-400 text-xs cursor-pointer transition-colors"
          >
            Clear Stored Key
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-stone-600 text-stone-300 hover:bg-stone-800 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold cursor-pointer shadow transition-colors"
            >
              Save & Activate Clerk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Root Clerk Application Provider that gracefully handles missing keys
 * without throwing React runtime crashes.
 */
export function ClerkRootProvider({ children }: { children: React.ReactNode }) {
  const [publishableKey, setPublishableKey] = useState<string>(() => getClerkPublishableKey());

  useEffect(() => {
    const handleStorage = () => {
      setPublishableKey(getClerkPublishableKey());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkUserAuditor />
      {children}
    </ClerkProvider>
  );
}
