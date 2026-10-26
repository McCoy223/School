import React, { useState } from 'react';
import {
  Monitor,
  Download,
  Laptop,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  Shield,
  WifiOff,
  ChevronRight,
  AppWindow,
  Layers,
  HardDrive
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DesktopAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopAppModal: React.FC<DesktopAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isInstallable, isStandalone, platform, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'windows' | 'mac' | 'chrome'>('windows');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181d22] text-stone-100 border border-stone-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-[#121619] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2271b1] to-amber-700 flex items-center justify-center text-white shadow-md">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                School Management System Desktop App
              </h3>
              <p className="text-[11px] text-stone-400">
                Install as a standalone computer application for Windows, Mac & Linux
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg text-lg font-bold cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          {/* Status Banner */}
          {isStandalone ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl flex items-center gap-3 text-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">Standalone Desktop App Active</p>
                <p className="text-[11px] text-emerald-300/90 mt-0.5">
                  You are currently running the School Management System inside a dedicated standalone desktop window.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-[#1c232a] to-[#161a1e] border border-stone-700/80 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>One-Click Desktop Computer Installation</span>
                </div>
                <p className="text-stone-300 text-xs max-w-md">
                  Runs outside the browser with no address bar or tabs. Launches directly from your Computer Taskbar, Dock, or Start Menu.
                </p>
              </div>

              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="px-5 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Install to Computer</span>
                </button>
              ) : (
                <div className="px-4 py-2 bg-stone-800/80 border border-stone-700 rounded-xl text-stone-300 text-center sm:text-right shrink-0">
                  <span className="font-semibold block text-[11px] text-amber-300">Ready via Browser Menu</span>
                  <span className="text-[10px] text-stone-400">See 1-step instructions below</span>
                </div>
              )}
            </div>
          )}

          {/* Desktop Features Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#121619] p-3.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center">
                <AppWindow className="w-4 h-4" />
              </div>
              <p className="font-bold text-white text-xs">Dedicated Window</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Hides URL bar, browser extensions, and bookmarks for a pure software feel.
              </p>
            </div>

            <div className="bg-[#121619] p-3.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
                <WifiOff className="w-4 h-4" />
              </div>
              <p className="font-bold text-white text-xs">Offline Computer Mode</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Works offline on your computer. Queues student records and syncs automatically.
              </p>
            </div>

            <div className="bg-[#121619] p-3.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <p className="font-bold text-white text-xs">Instant Computer Launch</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Pin to Windows Start / Taskbar or macOS Dock with official School SMS icon.
              </p>
            </div>
          </div>

          {/* Computer Operating System Guides */}
          <div className="space-y-3">
            <p className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
              How to Install on Your Computer
            </p>

            <div className="flex border-b border-stone-800 text-xs">
              <button
                onClick={() => setActiveTab('windows')}
                className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'windows'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                Windows PC (Edge / Chrome)
              </button>
              <button
                onClick={() => setActiveTab('mac')}
                className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'mac'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                Apple Mac (Safari / Chrome)
              </button>
              <button
                onClick={() => setActiveTab('chrome')}
                className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'chrome'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                Chromebook / Linux
              </button>
            </div>

            <div className="bg-[#121619] p-4 rounded-xl border border-stone-800 space-y-2.5">
              {activeTab === 'windows' && (
                <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed">
                  <li>
                    Look at the right side of your computer's address bar for the{' '}
                    <strong className="text-white">Install App (⊞ / ⊕)</strong> icon.
                  </li>
                  <li>
                    Or click the browser menu (<strong className="text-white">⋮</strong> or{' '}
                    <strong className="text-white">···</strong>) → Select{' '}
                    <span className="font-mono bg-stone-800 px-1.5 py-0.5 rounded text-amber-300">
                      "Install School Management System"
                    </span>
                    .
                  </li>
                  <li>
                    Click <strong className="text-white">Install</strong>. A desktop shortcut and Start Menu entry are created automatically.
                  </li>
                </ol>
              )}

              {activeTab === 'mac' && (
                <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed">
                  <li>
                    <strong>In Safari</strong>: Click the Share button (or <strong className="text-white">File</strong> menu) → Select{' '}
                    <span className="font-mono bg-stone-800 px-1.5 py-0.5 rounded text-amber-300">
                      "Add to Dock"
                    </span>
                    .
                  </li>
                  <li>
                    <strong>In Chrome / Edge</strong>: Click the Install icon in the top right address bar or choose{' '}
                    <span className="font-mono bg-stone-800 px-1.5 py-0.5 rounded text-amber-300">
                      "Install School Management System"
                    </span>
                    .
                  </li>
                  <li>
                    The app will open as a standalone Mac application in your Dock and Launchpad.
                  </li>
                </ol>
              )}

              {activeTab === 'chrome' && (
                <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed">
                  <li>
                    Click the <strong className="text-white">Install</strong> icon in the address bar or open the Chrome menu.
                  </li>
                  <li>
                    Choose <strong className="text-white">"Install School Management System"</strong>.
                  </li>
                  <li>
                    The app will be added to your Chromebook Launcher / Linux desktop environment.
                  </li>
                </ol>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#121619] border-t border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-400 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted local storage · W3C Compliant Desktop PWA</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
