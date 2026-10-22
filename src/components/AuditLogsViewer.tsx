import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Key,
  UserCheck,
  FileSpreadsheet,
  FileCode,
  Trash2,
  AlertTriangle,
  Sparkles,
  Info,
  Terminal,
  Check
} from 'lucide-react';
import { AuditLogEntry, AuditSeverity } from '../types';
import { auditLogger } from '../services/auditLogger';
import {
  getClerkPublishableKey,
  ClerkConfigModal,
  ClerkLiveAuthWidget
} from './ClerkIntegration';

export const AuditLogsViewer: React.FC<{
  onRecordAuditNotification?: (msg: string) => void;
}> = ({ onRecordAuditNotification }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');
  const [selectedSyncFilter, setSelectedSyncFilter] = useState<'all' | 'synced' | 'offline'>('all');
  const [inspectEntry, setInspectEntry] = useState<AuditLogEntry | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<{
    valid: boolean;
    totalRecords: number;
    message: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Sync state from auditLogger
  const refreshLedger = () => {
    setLogs(auditLogger.getLogs());
    setIsOnline(auditLogger.isNetworkOnline());
    setIsSimulatedOffline(auditLogger.getSimulatedOffline());
  };

  useEffect(() => {
    refreshLedger();
    const unsubscribe = auditLogger.subscribe(() => {
      refreshLedger();
    });
    return () => unsubscribe();
  }, []);

  const hasClerkKey = Boolean(getClerkPublishableKey());
  const unsyncedCount = useMemo(() => logs.filter(l => !l.synced).length, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(entry => {
      // Sync Status Filter
      if (selectedSyncFilter === 'synced' && !entry.synced) return false;
      if (selectedSyncFilter === 'offline' && entry.synced) return false;

      // Action Filter
      if (selectedActionFilter !== 'ALL') {
        if (!entry.action.startsWith(selectedActionFilter)) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesActor =
          entry.actorName.toLowerCase().includes(q) ||
          (entry.actorEmail && entry.actorEmail.toLowerCase().includes(q)) ||
          entry.actorId.toLowerCase().includes(q);
        const matchesAction =
          entry.action.toLowerCase().includes(q) ||
          entry.actionLabel.toLowerCase().includes(q);
        const matchesResource = entry.resource.toLowerCase().includes(q);
        const matchesDetails = JSON.stringify(entry.details).toLowerCase().includes(q);
        const matchesHash = entry.hash.toLowerCase().includes(q);

        return matchesActor || matchesAction || matchesResource || matchesDetails || matchesHash;
      }

      return true;
    });
  }, [logs, selectedSyncFilter, selectedActionFilter, searchQuery]);

  // Actions
  const handleToggleSimulatedOffline = () => {
    const nextVal = !isSimulatedOffline;
    auditLogger.setSimulatedOffline(nextVal);
    setIsSimulatedOffline(nextVal);
    if (nextVal) {
      if (onRecordAuditNotification) {
        onRecordAuditNotification('Offline Simulation Active: Any new actions will buffer in local queue.');
      }
    } else {
      if (onRecordAuditNotification) {
        onRecordAuditNotification('Back Online: Offline queue auto-synchronized.');
      }
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const result = auditLogger.syncOfflineQueue();
      setIsSyncing(false);
      if (onRecordAuditNotification) {
        onRecordAuditNotification(result.message);
      }
    }, 400);
  };

  const handleVerifyIntegrity = () => {
    const report = auditLogger.verifyLedgerIntegrity();
    setIntegrityStatus(report);
  };

  const handleExportJSON = () => {
    const data = auditLogger.exportToJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `st-andrews-audit-ledger-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onRecordAuditNotification) {
      onRecordAuditNotification('Cryptographic audit ledger exported to JSON.');
    }
  };

  const handleExportCSV = () => {
    const csv = auditLogger.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `st-andrews-audit-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onRecordAuditNotification) {
      onRecordAuditNotification('Audit records exported to CSV.');
    }
  };

  const handleGenerateSampleEvent = () => {
    const sampleActions = [
      {
        action: 'RESULTS_UPLOADED' as const,
        label: 'Grade Assessment Records Uploaded',
        resource: 'CourseAssessment:MATH-401',
        details: { scoreAverage: 94.2, scholarsCount: 22, assessment: 'Differential Calculus Midterm' }
      },
      {
        action: 'STUDENT_UPDATED' as const,
        label: 'Academic Standing Updated',
        resource: 'StudentRecord:SA-2026-104',
        details: { field: 'gpa', previous: 3.75, updated: 3.9, advisor: 'Dr. Vance' }
      },
      {
        action: 'SETTINGS_UPDATE' as const,
        label: 'Portal Security Parameter Modified',
        resource: 'SiteSettings:SecurityRules',
        details: { parameter: 'twoFactorEnforcement', enabled: true }
      },
      {
        action: 'INVOICE_PAID' as const,
        label: 'Bursar Tuition Remittance Processed',
        resource: 'FeeInvoice:INV-2026-902',
        details: { amount: 8250, studentId: 'SA-2026-118', method: 'Direct Bank Wire' }
      }
    ];

    const pick = sampleActions[Math.floor(Math.random() * sampleActions.length)];
    const logged = auditLogger.log({
      action: pick.action,
      actionLabel: pick.label,
      resource: pick.resource,
      severity: 'info',
      details: pick.details
    });

    if (onRecordAuditNotification) {
      onRecordAuditNotification(
        logged.offlineBuffered
          ? `[OFFLINE BUFFERED] Event logged to local queue: ${pick.label}`
          : `[SYNCED ONLINE] Event logged to live ledger: ${pick.label}`
      );
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 text-stone-900">
      {/* Top Header & Architecture Banner */}
      <div className="bg-[#1d2327] text-white p-6 rounded-2xl shadow-xl border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2271b1] flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                Security Audit Ledger & Compliance Trail
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
              Cryptographically chained immutable ledger tracking all administrative, academic, and financial actions.
              Powered by real <strong>Clerk Authentication</strong> with resilient <strong>Offline Local Buffering</strong>.
            </p>
          </div>

          {/* Right Controls: Clerk Auth & Network State */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Real Network Status */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                isOnline && !isSimulatedOffline
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
            >
              {isOnline && !isSimulatedOffline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Network: <strong>Online</strong></span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    Network: <strong>Offline Buffer Active</strong>
                  </span>
                </>
              )}
            </div>

            {/* Offline Simulation Switch */}
            <button
              onClick={handleToggleSimulatedOffline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                isSimulatedOffline
                  ? 'bg-amber-600 border-amber-500 text-white hover:bg-amber-700'
                  : 'bg-[#2c3338] border-stone-700 text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
              title="Toggle offline simulation to test local queue buffering without disconnecting WiFi"
            >
              {isSimulatedOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Simulating Offline (Click to Reconnect)</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5 text-stone-400" />
                  <span>Test Offline Mode</span>
                </>
              )}
            </button>

            {/* Clerk Authentication Live Widget */}
            <div className="border-l border-stone-700 pl-3">
              <ClerkLiveAuthWidget onOpenKeyModal={() => setIsConfigModalOpen(true)} />
            </div>
          </div>
        </div>

        {/* Real Clerk Publishable Key Missing Notice if needed */}
        {!hasClerkKey && (
          <div className="mt-5 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Real Clerk Authentication Ready:</strong> No demo or fake mode is enabled. Enter your live or test Publishable Key to bind your real Clerk login sessions to every audit log.
              </span>
            </div>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors shadow-sm"
            >
              Enter Clerk Key
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Entries */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Ledger Entries</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1 font-mono tabular-nums">
              {logs.length}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Tamper-evident chain</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Offline Buffered Queue */}
        <div
          className={`p-4 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${
            unsyncedCount > 0
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-white border-stone-200 text-stone-900'
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Offline Queue (Pending)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-serif font-bold font-mono tabular-nums">
                {unsyncedCount}
              </p>
              {unsyncedCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase">
                  Buffered
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {unsyncedCount === 0 ? 'All logs synced' : 'Will auto-sync on reconnect'}
            </p>
          </div>
          {unsyncedCount > 0 ? (
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Cryptographic Hash Verification */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Hash Chain Integrity</p>
            <p className="text-sm font-semibold text-emerald-700 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tamper-Proof Chained</span>
            </p>
            <button
              onClick={handleVerifyIntegrity}
              className="text-[11px] text-[#2271b1] hover:underline font-semibold mt-1 cursor-pointer block"
            >
              Run Chain Audit →
            </button>
          </div>
          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Current Auth Actor */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Active Audit Actor</p>
            <p className="text-sm font-bold text-stone-900 mt-1 truncate">
              {auditLogger.getClerkActor()?.fullName || 'Local Administrator'}
            </p>
            <p className="text-[11px] text-stone-500 truncate font-mono">
              {auditLogger.getClerkActor()?.primaryEmail || 'Clerk Unlinked (Local Staff)'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Integrity Verification Modal/Banner */}
      {integrityStatus && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
            integrityStatus.valid
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {integrityStatus.valid ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">
                {integrityStatus.valid ? 'Cryptographic Integrity Check Passed' : 'Cryptographic Integrity Fault!'}
              </p>
              <p className="mt-0.5 text-stone-700 leading-relaxed">{integrityStatus.message}</p>
            </div>
          </div>
          <button
            onClick={() => setIntegrityStatus(null)}
            className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Control Bar: Search, Filters, and Operations */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by actor, email, action, resource, hash..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-[#2271b1] focus:bg-white transition-colors"
          />
        </div>

        {/* Middle: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter */}
          <select
            value={selectedActionFilter}
            onChange={e => setSelectedActionFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-700 font-medium focus:outline-none focus:border-[#2271b1]"
          >
            <option value="ALL">All Actions</option>
            <option value="AUTH">Authentication (Clerk)</option>
            <option value="SETTINGS">Settings & System</option>
            <option value="RESULTS">Results & Grading</option>
            <option value="STUDENT">Student Records</option>
            <option value="INVOICE">Invoices & Finance</option>
            <option value="ANNOUNCEMENT">Announcements</option>
            <option value="EVENT">Calendar Events</option>
            <option value="OFFLINE">Offline Sync Events</option>
          </select>

          {/* Sync Status Filter */}
          <select
            value={selectedSyncFilter}
            onChange={e => setSelectedSyncFilter(e.target.value as any)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-700 font-medium focus:outline-none focus:border-[#2271b1]"
          >
            <option value="all">All Sync States</option>
            <option value="synced">Synced Only</option>
            <option value="offline">Offline Buffered Only ({unsyncedCount})</option>
          </select>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateSampleEvent}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            title="Log an action right now to verify how it gets buffered offline or synced online"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Test Audit Event</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            title="Export complete cryptographic ledger as JSON"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            title="Export audit ledger as RFC-4180 CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/80 text-stone-600 font-semibold border-b border-stone-200 select-none">
                <th className="py-3 px-4 w-44">Timestamp (UTC)</th>
                <th className="py-3 px-4 w-48">Actor (Clerk Auth)</th>
                <th className="py-3 px-4 w-40">Action</th>
                <th className="py-3 px-4">Target Resource & Details</th>
                <th className="py-3 px-4 w-36">Sync State</th>
                <th className="py-3 px-4 w-32">Block Hash</th>
                <th className="py-3 px-3 text-right w-20">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Shield className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="font-semibold text-stone-700">No matching audit logs</p>
                      <p className="text-stone-500 text-[11px]">
                        Try adjusting your search terms or filters above, or generate a test audit event.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(entry => {
                  const isAuth = entry.action.startsWith('AUTH');
                  const isDelete = entry.action.includes('DELETE') || entry.action.includes('RESET');
                  const isCreate = entry.action.includes('CREATED') || entry.action.includes('ENROLLED') || entry.action.includes('UPLOADED');
                  const isSync = entry.action === 'OFFLINE_QUEUE_SYNCED';

                  let badgeBg = 'bg-stone-100 text-stone-800 border-stone-200';
                  if (isAuth) badgeBg = 'bg-purple-100 text-purple-900 border-purple-200';
                  else if (isDelete) badgeBg = 'bg-rose-100 text-rose-900 border-rose-200';
                  else if (isCreate) badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-200';
                  else if (isSync) badgeBg = 'bg-blue-100 text-blue-900 border-blue-200';

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono tabular-nums text-stone-600 text-[11px] whitespace-nowrap">
                        {entry.timestamp.replace('T', ' ').substring(0, 19)}
                      </td>

                      {/* Actor */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {entry.actorAvatar ? (
                            <img
                              src={entry.actorAvatar}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[9px] shrink-0">
                              {(entry.actorName || 'A').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="truncate max-w-[140px]">
                            <p className="font-semibold text-stone-900 truncate text-[11px]">
                              {entry.actorName}
                            </p>
                            <p className="text-[10px] text-stone-400 font-mono truncate">
                              {entry.actorEmail || entry.actorId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeBg} truncate max-w-[150px]`}
                        >
                          {entry.action}
                        </span>
                      </td>

                      {/* Resource & Details */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-stone-900 text-xs">
                            {entry.actionLabel}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            <span className="font-mono text-stone-600 bg-stone-100 px-1 rounded text-[10px]">
                              {entry.resource}
                            </span>
                            <span className="truncate max-w-xs text-stone-500">
                              {JSON.stringify(entry.details)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Sync State */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {entry.synced ? (
                          <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Synced</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Offline Buffer</span>
                          </div>
                        )}
                      </td>

                      {/* Block Hash */}
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                        <button
                          onClick={() => copyHash(entry.hash)}
                          className="hover:text-stone-900 cursor-pointer flex items-center gap-1 group/hash"
                          title="Click to copy SHA-256 block hash"
                        >
                          <span>{entry.hash.substring(0, 8)}…</span>
                          {copiedHash === entry.hash ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <span className="text-[9px] text-stone-400 group-hover/hash:text-stone-700">📋</span>
                          )}
                        </button>
                      </td>

                      {/* Inspect button */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setInspectEntry(entry)}
                          className="px-2 py-1 bg-stone-100 hover:bg-[#2271b1] hover:text-white rounded text-[11px] font-semibold text-stone-700 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectEntry && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d2327] text-stone-200 border border-stone-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-stone-700 flex items-center justify-between bg-[#15191c]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#2271b1] flex items-center justify-center text-white font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Cryptographic Audit Entry</h3>
                  <p className="text-[11px] text-stone-400 font-mono">{inspectEntry.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectEntry(null)}
                className="text-stone-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-[#15191c] p-4 rounded-xl border border-stone-800">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Actor Identification:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{inspectEntry.actorName}</p>
                  <p className="text-stone-300 font-mono text-[11px] mt-0.5">ID: {inspectEntry.actorId}</p>
                  {inspectEntry.actorEmail && (
                    <p className="text-stone-400 text-[11px]">Email: {inspectEntry.actorEmail}</p>
                  )}
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Sync Status:</span>
                  <div className="mt-1">
                    {inspectEntry.synced ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Synchronized at {inspectEntry.syncedAt || inspectEntry.timestamp}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        Buffered in Local Offline Queue
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cryptographic Linkage Block */}
              <div className="bg-[#101416] p-4 rounded-xl border border-stone-800 font-mono space-y-2 text-[11px]">
                <div>
                  <span className="text-stone-500 text-[10px] uppercase block">Block Hash (SHA-256):</span>
                  <span className="text-emerald-400 font-bold select-all">{inspectEntry.hash}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] uppercase block">Previous Block Hash (Chain Link):</span>
                  <span className="text-stone-400 select-all">{inspectEntry.previousHash}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
                  <div>
                    <span className="text-stone-500 text-[10px] uppercase block">Client Network IP:</span>
                    <span className="text-stone-300">{inspectEntry.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] uppercase block">Timestamp (ISO-8601):</span>
                    <span className="text-stone-300">{inspectEntry.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Raw Payload JSON */}
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold mb-1">
                  Operation Payload Data (Immutable):
                </span>
                <pre className="bg-[#101416] p-3.5 rounded-xl border border-stone-800 text-[11px] text-stone-300 overflow-x-auto font-mono">
                  {JSON.stringify(inspectEntry.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#15191c] border-t border-stone-700 flex justify-end">
              <button
                onClick={() => setInspectEntry(null)}
                className="px-4 py-1.5 rounded-lg bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clerk Publishable Key Configuration Modal */}
      <ClerkConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onKeySaved={key => {
          if (onRecordAuditNotification) {
            onRecordAuditNotification(
              key ? 'Clerk Publishable Key configured successfully.' : 'Clerk Key cleared.'
            );
          }
          refreshLedger();
        }}
      />
    </div>
  );
};
