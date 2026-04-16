// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Clock, Wrench, AlertTriangle, CheckCircle, ChevronDown, FileText, Send, BarChart3, Package, History, Zap, Target, AlertCircle, X, RefreshCw, Download, Share2, Plus, Trash2, Wifi, WifiOff, Upload } from 'lucide-react';

/** Matches Tailwind `lg` — below this width we show PSSR-style layout; at/above, admin desktop layout. */
const DESKTOP_LAYOUT_MEDIA = '(min-width: 1024px)';
import rawStjData from './data/standardJobs.json';
import rawWoData from './data/workOrders.json';
import partsIndex from './data/partsData.json';
import { getBaseModel, buildModelGroups } from './utils/modelGrouping';
import { buildSimilarityIndex, findSimilarCombos, type SimilarityResult, type PartsIndex } from './utils/similarity';
import { generateQuoteResult, type QuoteResult, type WoEntry } from './utils/quoteEngine';
import DistributionCharts from './components/DistributionCharts';

// ============================================
// TYPES & DATA LOADING
// ============================================

interface StjEntry {
  s: string;   // STJ ID or Work Order segment ID
  p: number;   // Parts price
  l: number;   // Labor price
  m: number;   // Misc price
  d: number;   // Duration (hours)
  sf: string;  // S=Shop, F=Field
  md?: string; // Modifier description
  sp?: string; // Serial prefix (first 3 chars of serial number)
  dt?: string; // Date "YYYY-MM" (WO entries only)
}

interface RawData {
  hasSerialPrefix?: boolean;
  models: Array<{ id: string; make: string }>;
  serialPrefixes?: Array<{ prefix: string }>;
  jobCodes: Array<{ code: string; desc: string }>;
  compCodes: Array<{ code: string; desc: string }>;
  jobs: Record<string, StjEntry[]>;
}

// Filter out STJ entries where parts, labor, and misc are all zero
// (Tim Dailey: these were never flat-rate priced and are unreliable)
// Normalize serial prefix case in pipe-delimited keys (e.g., "120H|dtd|010|1000" -> "120H|DTD|010|1000")
// This merges entries that differ only by case (e.g., "dtd" vs "DTD" vs "Dtd")
function normalizeSerialPrefixKeys(jobs: Record<string, StjEntry[]>): Record<string, StjEntry[]> {
  const normalized: Record<string, StjEntry[]> = {};
  for (const [key, entries] of Object.entries(jobs)) {
    const parts = key.split('|');
    const normKey = parts.length === 4
      ? `${parts[0]}|${parts[1].toUpperCase()}|${parts[2]}|${parts[3]}`
      : key;
    if (normalized[normKey]) {
      normalized[normKey].push(...entries);
    } else {
      normalized[normKey] = [...entries];
    }
  }
  return normalized;
}

function filterZeroEntries(data: RawData): RawData {
  const jobs = normalizeSerialPrefixKeys(data.jobs);
  const filteredJobs: Record<string, StjEntry[]> = {};
  for (const [key, entries] of Object.entries(jobs)) {
    const nonZero = entries.filter(e => !(e.p === 0 && e.l === 0 && e.m === 0));
    if (nonZero.length > 0) {
      filteredJobs[key] = nonZero;
    }
  }
  return { ...data, jobs: filteredJobs };
}

// Filter out WO entries that are misc-only (labor=0 AND parts=0)
// (Tim Dailey: misc-only records should be disregarded entirely)
function filterMiscOnlyEntries(data: RawData): RawData {
  const jobs = normalizeSerialPrefixKeys(data.jobs);
  const filteredJobs: Record<string, StjEntry[]> = {};
  for (const [key, entries] of Object.entries(jobs)) {
    const valid = entries.filter(e => !(e.p === 0 && e.l === 0 && e.m > 0));
    if (valid.length > 0) {
      filteredJobs[key] = valid;
    }
  }
  return { ...data, jobs: filteredJobs };
}

const STJ_DATA: RawData = filterZeroEntries(rawStjData as RawData);
const WO_DATA: RawData = filterMiscOnlyEntries(rawWoData as RawData);

// Detect if JSON data uses 4-part keys with serial prefix
const HAS_SERIAL_PREFIX = !!(STJ_DATA.hasSerialPrefix || WO_DATA.hasSerialPrefix);

// Parse a pipe-delimited key (handles both 3-part and 4-part formats)
function parseKey(key: string): { model: string; serialPrefix: string; jobCode: string; compCode: string } {
  const parts = key.split('|');
  if (parts.length === 4) {
    return { model: parts[0], serialPrefix: parts[1], jobCode: parts[2], compCode: parts[3] };
  }
  return { model: parts[0], serialPrefix: '', jobCode: parts[1], compCode: parts[2] };
}

// Merge lookup tables (union of both sources, STJ takes precedence for descriptions)
function mergeArrayById<T extends { id?: string; code?: string }>(a: T[], b: T[], key: 'id' | 'code'): T[] {
  const map = new Map<string, T>();
  for (const item of b) map.set(item[key]!, item);
  for (const item of a) map.set(item[key]!, item); // STJ overwrites WO
  return Array.from(map.values()).sort((x, y) => (x[key]! > y[key]! ? 1 : -1));
}

const MERGED_MODELS = mergeArrayById(STJ_DATA.models, WO_DATA.models, 'id')
  .filter(m => m.id.trim() !== ''); // Exclude empty model IDs
const MERGED_JOB_CODES = mergeArrayById(STJ_DATA.jobCodes, WO_DATA.jobCodes, 'code');
const MERGED_COMP_CODES = mergeArrayById(STJ_DATA.compCodes, WO_DATA.compCodes, 'code');

// ============================================
// MODEL CATEGORIZATION
// ============================================

function categorizeModel(modelId: string): { category: string; image: string } {
  const m = modelId.toUpperCase();
  if (/^D\d/.test(m)) return { category: 'Dozers', image: '🚧' };
  if (/^(1[2-6]\d|1[2-6][A-Z])/.test(m)) return { category: 'Motor Graders', image: '🛣️' };
  if (/^[23]\d{2}/.test(m)) return { category: 'Excavators', image: '🏗️' };
  if (/^9\d{2}/.test(m)) return { category: 'Wheel Loaders', image: '🚜' };
  if (/^7[0-9]{2}/.test(m)) return { category: 'Trucks', image: '🚚' };
  if (/^(5\d{2}|4[1-9]\d)/.test(m)) return { category: 'Skid Steers / Compact', image: '🔧' };
  if (/^(CB|CS|CP|CW|BW)/.test(m)) return { category: 'Compactors', image: '🛞' };
  if (/^(TL|TH)/.test(m)) return { category: 'Telehandlers', image: '🏗️' };
  if (/^(AP|BG|PM)/.test(m)) return { category: 'Paving', image: '🛣️' };
  return { category: 'Heavy Equipment', image: '⚙️' };
}

// Build model groups (per Tim Dailey: group numeric/roman numeral variants)
const MODEL_GROUPS = buildModelGroups(MERGED_MODELS.map(m => m.id));

const MODELS = Array.from(MODEL_GROUPS.values()).map(group => {
  const cat = categorizeModel(group.baseModel);
  return {
    id: group.baseModel,
    make: MERGED_MODELS.find(m => m.id === group.baseModel)?.make ||
          MERGED_MODELS.find(m => group.members.includes(m.id))?.make || 'CAT',
    ...cat,
    name: `${group.displayName} ${cat.category}`,
    members: group.members,
    displayName: group.displayName,
  };
}).sort((a, b) => a.id > b.id ? 1 : -1);

const JOB_CODES = MERGED_JOB_CODES;
const COMP_CODES = MERGED_COMP_CODES;

// ============================================
// PRE-COMPUTE AVAILABLE COMBINATIONS (union of STJ + WO)
// ============================================

// Individual model indexes (used internally for lookups)
const modelJobCodes: Record<string, Set<string>> = {};
const modelJobCompCodes: Record<string, Set<string>> = {};
// Serial prefix indexes: model -> available serial prefixes
const modelSerialPrefixes: Record<string, Set<string>> = {};
// Serial prefix -> job code cascading: model|serialPrefix -> job codes
const modelSpJobCodes: Record<string, Set<string>> = {};
// model|serialPrefix|jobCode -> comp codes
const modelSpJobCompCodes: Record<string, Set<string>> = {};

function indexCombinations(jobs: Record<string, StjEntry[]>) {
  Object.keys(jobs).forEach(key => {
    const parsed = parseKey(key);
    const { model, serialPrefix, jobCode, compCode } = parsed;

    if (!modelJobCodes[model]) modelJobCodes[model] = new Set();
    modelJobCodes[model].add(jobCode);
    const mjKey = `${model}|${jobCode}`;
    if (!modelJobCompCodes[mjKey]) modelJobCompCodes[mjKey] = new Set();
    modelJobCompCodes[mjKey].add(compCode);

    // Serial prefix indexes
    if (serialPrefix) {
      if (!modelSerialPrefixes[model]) modelSerialPrefixes[model] = new Set();
      modelSerialPrefixes[model].add(serialPrefix);

      const mspKey = `${model}|${serialPrefix}`;
      if (!modelSpJobCodes[mspKey]) modelSpJobCodes[mspKey] = new Set();
      modelSpJobCodes[mspKey].add(jobCode);

      const mspjKey = `${model}|${serialPrefix}|${jobCode}`;
      if (!modelSpJobCompCodes[mspjKey]) modelSpJobCompCodes[mspjKey] = new Set();
      modelSpJobCompCodes[mspjKey].add(compCode);
    }
  });
}
indexCombinations(STJ_DATA.jobs);
indexCombinations(WO_DATA.jobs);

// Group-level indexes: aggregate across all members in each model group
const groupJobCodes: Record<string, Set<string>> = {};
const groupJobCompCodes: Record<string, Set<string>> = {};
const groupSerialPrefixes: Record<string, Set<string>> = {};
const groupSpJobCodes: Record<string, Set<string>> = {};
const groupSpJobCompCodes: Record<string, Set<string>> = {};

for (const [base, group] of MODEL_GROUPS) {
  groupJobCodes[base] = new Set();
  groupSerialPrefixes[base] = new Set();

  for (const memberId of group.members) {
    // Aggregate job codes
    const memberJobs = modelJobCodes[memberId];
    if (memberJobs) {
      for (const jc of memberJobs) groupJobCodes[base].add(jc);
    }
    // Aggregate serial prefixes
    const memberPrefixes = modelSerialPrefixes[memberId];
    if (memberPrefixes) {
      for (const sp of memberPrefixes) groupSerialPrefixes[base].add(sp);
    }
  }

  for (const memberId of group.members) {
    // Aggregate comp codes per job code
    for (const jc of groupJobCodes[base] || []) {
      const comps = modelJobCompCodes[`${memberId}|${jc}`];
      if (comps) {
        const groupKey = `${base}|${jc}`;
        if (!groupJobCompCodes[groupKey]) groupJobCompCodes[groupKey] = new Set();
        for (const cc of comps) groupJobCompCodes[groupKey].add(cc);
      }
    }
    // Aggregate serial prefix cascading indexes
    for (const sp of groupSerialPrefixes[base] || []) {
      const memberSpJobs = modelSpJobCodes[`${memberId}|${sp}`];
      if (memberSpJobs) {
        const groupSpKey = `${base}|${sp}`;
        if (!groupSpJobCodes[groupSpKey]) groupSpJobCodes[groupSpKey] = new Set();
        for (const jc of memberSpJobs) groupSpJobCodes[groupSpKey].add(jc);
      }

      for (const jc of groupSpJobCodes[`${base}|${sp}`] || []) {
        const memberSpjComps = modelSpJobCompCodes[`${memberId}|${sp}|${jc}`];
        if (memberSpjComps) {
          const groupSpjKey = `${base}|${sp}|${jc}`;
          if (!groupSpJobCompCodes[groupSpjKey]) groupSpJobCompCodes[groupSpjKey] = new Set();
          for (const cc of memberSpjComps) groupSpJobCompCodes[groupSpjKey].add(cc);
        }
      }
    }
  }
}

// Normalize partsData keys to uppercase serial prefix
function normalizePartsKeys(data: PartsIndex): PartsIndex {
  const normalized: PartsIndex = {};
  for (const [key, entries] of Object.entries(data)) {
    const parts = key.split('|');
    const normKey = parts.length === 4
      ? `${parts[0]}|${parts[1].toUpperCase()}|${parts[2]}|${parts[3]}`
      : key;
    if (normalized[normKey]) {
      // If duplicate after normalization, keep the one with more entries
      if (entries.length > normalized[normKey].length) {
        normalized[normKey] = entries;
      }
    } else {
      normalized[normKey] = entries;
    }
  }
  return normalized;
}

// Feature flag: set to true to re-enable similarity scoring in the UI
const ENABLE_SIMILARITY = false;

// Build similarity index from parts data joined with work orders
const PARTS_DATA = normalizePartsKeys(partsIndex as PartsIndex);
const SIMILARITY_INDEX = ENABLE_SIMILARITY
  ? buildSimilarityIndex(PARTS_DATA, WO_DATA.jobs as Record<string, Array<{ l: number; m: number; p: number; dt?: string }>>)
  : new Map();

const TOTAL_STJS = Object.values(STJ_DATA.jobs).reduce((sum, arr) => sum + arr.length, 0);
const TOTAL_WOS = Object.values(WO_DATA.jobs).reduce((sum, arr) => sum + arr.length, 0);
const TOTAL_STJ_COMBOS = Object.keys(STJ_DATA.jobs).length;
const TOTAL_WO_COMBOS = Object.keys(WO_DATA.jobs).length;
const ALL_COMBO_KEYS = new Set([...Object.keys(STJ_DATA.jobs), ...Object.keys(WO_DATA.jobs)]);
const TOTAL_COMBOS = ALL_COMBO_KEYS.size;

// ============================================
// MAIN APPLICATION COMPONENT
// ============================================

const App = () => {
  const [useDesktopLayout, setUseDesktopLayout] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_LAYOUT_MEDIA).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_LAYOUT_MEDIA);
    const onChange = () => setUseDesktopLayout(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const [showQuoteResult, setShowQuoteResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);

  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedSerialPrefix, setSelectedSerialPrefix] = useState<string | null>(null);
  const [selectedJobCode, setSelectedJobCode] = useState<any>(null);
  const [selectedCompCode, setSelectedCompCode] = useState<any>(null);

  // Multi-line quoting: accumulated segments
  const [quoteSegments, setQuoteSegments] = useState<any[]>([]);

  // Price-adjustment selector: -10% (low), 0 (recommended/generated), +10% (high)
  // Per Tim Dailey (4/10/2026): tool now offers ±10% optionality off the generated
  // quote instead of historical low/high (which can be misleading outliers).
  const [priceAdjustment, setPriceAdjustment] = useState<-10 | 0 | 10>(0);

  const [modelSearch, setModelSearch] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const filteredModels = useMemo(() =>
    MODELS.filter(m =>
      m.id.toLowerCase().includes(modelSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(modelSearch.toLowerCase())
    ).slice(0, 50),
    [modelSearch]
  );

  // Cascading: available serial prefixes for selected model group
  const availableSerialPrefixes = useMemo(() => {
    if (!selectedModel || !HAS_SERIAL_PREFIX) return [];
    const prefixes = groupSerialPrefixes[selectedModel.id];
    if (!prefixes) return [];
    return Array.from(prefixes).sort();
  }, [selectedModel]);

  // Cascading: available job codes for selected model group + serial prefix
  const availableJobCodes = useMemo(() => {
    if (!selectedModel) return JOB_CODES;
    if (HAS_SERIAL_PREFIX && selectedSerialPrefix) {
      const codes = groupSpJobCodes[`${selectedModel.id}|${selectedSerialPrefix}`];
      if (!codes) return [];
      return JOB_CODES.filter(jc => codes.has(jc.code));
    }
    const codes = groupJobCodes[selectedModel.id];
    if (!codes) return [];
    return JOB_CODES.filter(jc => codes.has(jc.code));
  }, [selectedModel, selectedSerialPrefix]);

  // Cascading: available comp codes for selected model group + serial prefix + job code
  const availableCompCodes = useMemo(() => {
    if (!selectedModel || !selectedJobCode) return COMP_CODES;
    if (HAS_SERIAL_PREFIX && selectedSerialPrefix) {
      const codes = groupSpJobCompCodes[`${selectedModel.id}|${selectedSerialPrefix}|${selectedJobCode.code}`];
      if (!codes) return [];
      return COMP_CODES.filter(cc => codes.has(cc.code));
    }
    const codes = groupJobCompCodes[`${selectedModel.id}|${selectedJobCode.code}`];
    if (!codes) return [];
    return COMP_CODES.filter(cc => codes.has(cc.code));
  }, [selectedModel, selectedSerialPrefix, selectedJobCode]);

  const handleModelSelect = (model: any) => {
    setSelectedModel(model);
    setSelectedSerialPrefix(null);
    setSelectedJobCode(null);
    setSelectedCompCode(null);
    setModelSearch('');
    setShowModelDropdown(false);
  };

  const handleSerialPrefixSelect = (prefix: string | null) => {
    setSelectedSerialPrefix(prefix);
    setSelectedJobCode(null);
    setSelectedCompCode(null);
  };

  const handleJobCodeSelect = (jc: any) => {
    setSelectedJobCode(jc);
    setSelectedCompCode(null);
  };

  const generateQuote = () => {
    if (!selectedModel || !selectedJobCode || !selectedCompCode) return;
    if (HAS_SERIAL_PREFIX && !selectedSerialPrefix) return;
    setPriceAdjustment(0);
    setIsGenerating(true);
    setTimeout(() => {
      const group = MODEL_GROUPS.get(selectedModel.id);
      const memberIds = group ? group.members : [selectedModel.id];

      let allStjEntries: StjEntry[] = [];
      let allWoEntries: StjEntry[] = [];
      const allMemberKeys: string[] = [];

      for (const memberId of memberIds) {
        const key = HAS_SERIAL_PREFIX
          ? `${memberId}|${selectedSerialPrefix || ''}|${selectedJobCode.code}|${selectedCompCode.code}`
          : `${memberId}|${selectedJobCode.code}|${selectedCompCode.code}`;
        allMemberKeys.push(key);
        allStjEntries.push(...(STJ_DATA.jobs[key] || []));
        allWoEntries.push(...(WO_DATA.jobs[key] || []));
      }

      const result = generateQuoteResult(
        allStjEntries as WoEntry[],
        allWoEntries as WoEntry[],
        PARTS_DATA,
        SIMILARITY_INDEX,
        allMemberKeys,
        WO_DATA.jobs as Record<string, WoEntry[]>,
      );

      if (!result) {
        setIsGenerating(false);
        setQuoteData({ insufficientData: true });
        setShowQuoteResult(true);
        return;
      }

      setQuoteData({
        model: selectedModel,
        serialPrefix: selectedSerialPrefix,
        jobCode: selectedJobCode,
        compCode: selectedCompCode,
        ...result,
        quoteId: `Q${Date.now().toString(36).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
      });
      setIsGenerating(false);
      setShowQuoteResult(true);
    }, 800);
  };

  const resetQuote = () => {
    setShowQuoteResult(false);
    setQuoteData(null);
    setSelectedModel(null);
    setSelectedSerialPrefix(null);
    setSelectedJobCode(null);
    setSelectedCompCode(null);
    setQuoteSegments([]);
    setPriceAdjustment(0);
  };

  // Apply ±10% adjustment proportionally across parts/labor/misc.
  // Returns the same shape as quoteData with adjusted values.
  const getAdjustedQuote = (q: any, pct: number) => {
    if (!q) return q;
    const factor = 1 + pct / 100;
    return {
      avgParts: Math.round((q.avgParts || 0) * factor),
      avgLabor: Math.round((q.avgLabor || 0) * factor),
      avgMisc: Math.round((q.avgMisc || 0) * factor),
      avgTotal: Math.round((q.avgTotal || 0) * factor),
      adjustmentPct: pct,
    };
  };

  const addToQuote = () => {
    if (!quoteData || quoteData.insufficientData) return;
    const adjusted = getAdjustedQuote(quoteData, priceAdjustment);
    setQuoteSegments(prev => [...prev, { ...quoteData, ...adjusted }]);
    // Reset job/component for next segment, keep model/serial
    setShowQuoteResult(false);
    setQuoteData(null);
    setSelectedJobCode(null);
    setSelectedCompCode(null);
    setPriceAdjustment(0);
  };

  const removeSegment = (idx: number) => {
    setQuoteSegments(prev => prev.filter((_, i) => i !== idx));
  };

  const clearQuoteBuilder = () => {
    setQuoteSegments([]);
  };

  const quoteBundleTotal = useMemo(() => {
    if (quoteSegments.length === 0) return null;
    return {
      parts: quoteSegments.reduce((s, seg) => s + (seg.avgParts || 0), 0),
      labor: quoteSegments.reduce((s, seg) => s + (seg.avgLabor || 0), 0),
      misc: quoteSegments.reduce((s, seg) => s + (seg.avgMisc || 0), 0),
      total: quoteSegments.reduce((s, seg) => s + (seg.avgTotal || 0), 0),
      duration: quoteSegments.reduce((s, seg) => s + (seg.avgDuration || 0), 0),
    };
  }, [quoteSegments]);

  // ============================================
  // SYNC FUNCTIONALITY (placeholder)
  // ============================================
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());
  const [showSyncNotification, setShowSyncNotification] = useState(false);

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // When back online, attempt to sync queued quotes
      if (syncQueue.length > 0) {
        setShowSyncNotification(true);
        // Placeholder: in production, this would push to AX
        setTimeout(() => {
          setLastSyncTime(new Date());
          setSyncQueue([]);
          setTimeout(() => setShowSyncNotification(false), 3000);
        }, 1500);
      }
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue]);

  const pushToAx = () => {
    if (quoteSegments.length === 0) return;
    const bundle = {
      model: quoteSegments[0].model,
      serialPrefix: quoteSegments[0].serialPrefix,
      segments: quoteSegments,
      bundleTotal: quoteBundleTotal,
      createdAt: new Date().toISOString(),
    };
    if (isOnline) {
      // Placeholder: would push to AX API here
      setShowSyncNotification(true);
      setTimeout(() => {
        setLastSyncTime(new Date());
        setQuoteSegments([]);
        setTimeout(() => setShowSyncNotification(false), 3000);
      }, 1500);
    } else {
      // Queue for sync when back online
      setSyncQueue(prev => [...prev, bundle]);
      setQuoteSegments([]);
    }
  };

  const SyncStatusBadge = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'}`}>
      {isOnline ? (
        <>
          <Wifi size={compact ? 14 : 16} className="text-green-400" />
          {!compact && <span className="text-green-400">Synced</span>}
          {syncQueue.length > 0 && (
            <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{syncQueue.length}</span>
          )}
        </>
      ) : (
        <>
          <WifiOff size={compact ? 14 : 16} className="text-amber-400" />
          {!compact && <span className="text-amber-400">Offline</span>}
          {syncQueue.length > 0 && (
            <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{syncQueue.length} pending</span>
          )}
        </>
      )}
    </div>
  );

  const getConfidenceColor = (conf: string) => {
    if (conf === 'HIGH') return 'text-green-600 bg-green-100 border-green-300';
    if (conf === 'MEDIUM') return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  // ============================================
  // MOBILE PSSR VIEW
  // ============================================
  const MobileView = () => (
    <div className="max-w-md mx-auto bg-gray-100 w-full min-h-0">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center font-bold text-amber-500">M</div>
            <div>
              <h1 className="font-bold text-lg">Milton CAT</h1>
              <p className="text-xs text-amber-100">Quick Quote</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SyncStatusBadge compact />
            <div className="text-right text-xs">
              <div className="font-medium">Mike Smith, PSSR</div>
              <div className="text-amber-200">Standard Job Lookup</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {showSyncNotification && (
        <div className="bg-green-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
          <Upload size={16} className="animate-pulse" />
          {syncQueue.length > 0 ? `Syncing ${syncQueue.length} quote(s)...` : 'Quote synced successfully!'}
        </div>
      )}
      {!isOnline && syncQueue.length > 0 && !showSyncNotification && (
        <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
          <WifiOff size={16} />
          {syncQueue.length} quote{syncQueue.length > 1 ? 's' : ''} pending — will sync when connected
        </div>
      )}

      {!showQuoteResult ? (
        <div className="p-4 space-y-4">
          {/* Model Selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Machine Model <span className="text-gray-400 font-normal">({MODELS.length} models)</span>
            </label>
            <div className="relative">
              <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg p-3 focus-within:border-amber-500 transition-colors">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search model (e.g., 980, D6T, 336)"
                  value={selectedModel ? selectedModel.id : modelSearch}
                  onChange={(e) => {
                    setModelSearch(e.target.value);
                    setSelectedModel(null);
                    setSelectedSerialPrefix(null);
                    setSelectedJobCode(null);
                    setSelectedCompCode(null);
                    setShowModelDropdown(true);
                  }}
                  onFocus={() => setShowModelDropdown(true)}
                  className="flex-1 outline-none text-gray-900"
                />
                {selectedModel && (
                  <button onClick={() => { setSelectedModel(null); setSelectedSerialPrefix(null); setSelectedJobCode(null); setSelectedCompCode(null); setModelSearch(''); }} className="text-gray-400">
                    <X size={18} />
                  </button>
                )}
              </div>

              {showModelDropdown && !selectedModel && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredModels.length === 0 && (
                    <div className="p-3 text-gray-500 text-sm">No models found</div>
                  )}
                  {filteredModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model)}
                      className="w-full text-left p-3 hover:bg-amber-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-2xl">{model.image}</span>
                      <div>
                        <div className="font-medium text-gray-900">{model.displayName}</div>
                        <div className="text-sm text-gray-500">{model.category}</div>
                      </div>
                      <div className="ml-auto text-xs text-gray-400">
                        {groupJobCodes[model.id]?.size || 0} jobs
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedModel && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg flex items-center gap-3">
                <span className="text-3xl">{selectedModel.image}</span>
                <div>
                  <div className="font-bold text-gray-900">{selectedModel.id}</div>
                  <div className="text-sm text-gray-600">{selectedModel.category}</div>
                </div>
                <CheckCircle className="ml-auto text-green-500" size={24} />
              </div>
            )}
          </div>

          {/* Serial Prefix Selection (only when data has serial prefixes) */}
          {HAS_SERIAL_PREFIX && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Serial Prefix
              {selectedModel && <span className="text-gray-400 font-normal ml-1">({availableSerialPrefixes.length} available)</span>}
            </label>
            {!selectedModel ? (
              <div className="text-sm text-gray-400 italic p-3">Select a model first</div>
            ) : availableSerialPrefixes.length === 0 ? (
              <div className="text-sm text-red-400 italic p-3">No serial prefixes for this model</div>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-auto">
                {availableSerialPrefixes.map(prefix => (
                  <button
                    key={prefix}
                    onClick={() => handleSerialPrefixSelect(prefix)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedSerialPrefix === prefix
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="font-mono text-sm font-semibold text-gray-900">{prefix}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Job Code Selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Type (SMC Job Code)
              {selectedModel && <span className="text-gray-400 font-normal ml-1">({availableJobCodes.length} available)</span>}
            </label>
            {!selectedModel || (HAS_SERIAL_PREFIX && !selectedSerialPrefix) ? (
              <div className="text-sm text-gray-400 italic p-3">{!selectedModel ? 'Select a model first' : 'Select a serial prefix first'}</div>
            ) : availableJobCodes.length === 0 ? (
              <div className="text-sm text-red-400 italic p-3">No job codes for this combination</div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
                {availableJobCodes.map(job => (
                  <button
                    key={job.code}
                    onClick={() => handleJobCodeSelect(job)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedJobCode?.code === job.code
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="font-mono text-xs text-gray-500">{job.code}</div>
                    <div className="font-semibold text-gray-900 text-xs">{job.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Component Code Selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Component (SMC Component Code)
              {selectedJobCode && <span className="text-gray-400 font-normal ml-1">({availableCompCodes.length} available)</span>}
            </label>
            {!selectedJobCode ? (
              <div className="text-sm text-gray-400 italic p-3">Select a job type first</div>
            ) : availableCompCodes.length === 0 ? (
              <div className="text-sm text-red-400 italic p-3">No components for this combination</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-auto">
                {availableCompCodes.map(comp => (
                  <button
                    key={comp.code}
                    onClick={() => setSelectedCompCode(comp)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                      selectedCompCode?.code === comp.code
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs text-gray-500">{comp.code}</div>
                      <div className="font-semibold text-gray-900 text-sm">{comp.desc}</div>
                    </div>
                    {selectedCompCode?.code === comp.code && (
                      <CheckCircle className="text-amber-500" size={20} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={generateQuote}
            disabled={!selectedModel || (HAS_SERIAL_PREFIX && !selectedSerialPrefix) || !selectedJobCode || !selectedCompCode || isGenerating}
            className={`w-full p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              selectedModel && (!HAS_SERIAL_PREFIX || selectedSerialPrefix) && selectedJobCode && selectedCompCode
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={24} />
                Looking up Standard Jobs...
              </>
            ) : (
              <>
                <Zap size={24} />
                Generate Quote
              </>
            )}
          </button>
        </div>
      ) : (
        /* Quote Result View */
        <div className="p-4 space-y-4">
          {quoteData.insufficientData ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Insufficient Data</h3>
              <p className="text-gray-500 text-sm">
                No standard jobs, work orders, or sufficiently similar combinations were found for this combination.
              </p>
              <button onClick={resetQuote} className="mt-4 px-6 py-2 text-amber-600 font-medium">
                ← New Quote
              </button>
            </div>
          ) : (
          <>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-amber-400 text-xs font-medium">
                  {quoteData.tier === 1 ? 'STANDARD JOB QUOTE' : quoteData.tier === 2 ? 'WORK ORDER HISTORY QUOTE' : 'ESTIMATE BASED ON SIMILAR JOBS'}
                </div>
                <div className="font-mono text-sm text-gray-400">{quoteData.quoteId}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  TIER {quoteData.tier}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getConfidenceColor(quoteData.confidence)}`}>
                  {quoteData.confidence} CONFIDENCE
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-gray-400 text-sm">{quoteData.model.id}{quoteData.serialPrefix ? ` [${quoteData.serialPrefix}]` : ''} - {quoteData.model.category}</div>
              <div className="text-xl font-bold">
                {quoteData.jobCode.desc} - {quoteData.compCode.desc}
              </div>
            </div>

            {/* Price-adjustment selector: -10% / Recommended / +10% */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[-10, 0, 10].map(pct => {
                const adj = getAdjustedQuote(quoteData, pct);
                const isActive = priceAdjustment === pct;
                const label = pct === 0 ? 'RECOMMENDED' : pct < 0 ? `${pct}%` : `+${pct}%`;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPriceAdjustment(pct as -10 | 0 | 10)}
                    className={`text-center rounded-lg px-2 py-2 transition ${
                      isActive
                        ? 'bg-amber-500/20 border-2 border-amber-400'
                        : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className={`text-[10px] font-medium ${isActive ? 'text-amber-300' : 'text-gray-400'}`}>{label}</div>
                    <div className={`font-bold ${isActive ? 'text-2xl text-amber-300' : 'text-base text-gray-300'}`}>
                      ${adj.avgTotal.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700 text-xs">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-gray-400">{quoteData.avgDuration} hrs</span>
              </div>
              <div className="flex items-center gap-2">
                <History size={14} className="text-gray-400" />
                <span className="text-gray-400">
                  {quoteData.count} {quoteData.tier === 1 ? 'standard job' : quoteData.tier === 2 ? 'work order' : 'similar job'}{quoteData.count !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-gray-500">
                Range: ${quoteData.lowTotal.toLocaleString()} – ${quoteData.highTotal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div className={`rounded-xl p-4 border-2 ${getConfidenceColor(quoteData.confidence)}`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-white">
                {quoteData.confidence === 'HIGH' ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : quoteData.confidence === 'MEDIUM' ? (
                  <AlertCircle size={24} className="text-yellow-600" />
                ) : (
                  <AlertTriangle size={24} className="text-red-600" />
                )}
              </div>
              <div>
                <div className="font-bold text-lg">{quoteData.confidenceScore}% Confidence</div>
                <div className="text-sm mt-1">
                  Based on {quoteData.count} {quoteData.tier === 1 ? 'standard job' : quoteData.tier === 2 ? 'work order' : 'similar job'}{quoteData.count !== 1 ? 's' : ''} with ${quoteData.stdDev.toLocaleString()} price variance
                  {quoteData.tier === 2 && <span className="block mt-1 text-xs opacity-75">Source: Historical work orders (no standard job available)</span>}
                  {quoteData.tier === 3 && !quoteData.tierOverride && <span className="block mt-1 text-xs opacity-75">Source: Estimate from similar job combinations</span>}
                </div>
                {quoteData.confidenceBreakdown && quoteData.tier === 2 && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer opacity-75">Score breakdown</summary>
                    <div className="mt-1 space-y-0.5 opacity-75">
                      <div>Base (count): {quoteData.confidenceBreakdown.baseScore}</div>
                      <div>CV adjustment: {quoteData.confidenceBreakdown.cvAdjustment >= 0 ? '+' : ''}{quoteData.confidenceBreakdown.cvAdjustment}</div>
                      {ENABLE_SIMILARITY && <div>Similarity: {quoteData.confidenceBreakdown.similarityAdjustment >= 0 ? '+' : ''}{quoteData.confidenceBreakdown.similarityAdjustment}</div>}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>

          {/* Tier Override Note */}
          {quoteData.tierOverride && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
              <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{quoteData.tierOverrideNote}</span>
            </div>
          )}

          {/* Deviation Warning */}
          {quoteData.deviationWarning && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
              <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <span>Recent pricing trend diverges from historical median.</span>
            </div>
          )}

          {/* Cost Breakdown */}
          {(() => {
            const adj = getAdjustedQuote(quoteData, priceAdjustment);
            return (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">
                  Cost Breakdown
                  {priceAdjustment !== 0 && (
                    <span className="ml-2 text-xs font-medium text-amber-600">
                      ({priceAdjustment > 0 ? '+' : ''}{priceAdjustment}% applied)
                    </span>
                  )}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-400" />
                      <span>Labor</span>
                    </div>
                    <span className="font-bold">${adj.avgLabor.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-gray-400" />
                      <span>Parts{quoteData.partsRepriced ? ' (catalog)' : quoteData.partsFallbackToHistorical ? ' (historical)' : ''}</span>
                    </div>
                    <span className="font-bold">${adj.avgParts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Wrench size={18} className="text-gray-400" />
                      <span>Misc/Shop Supplies</span>
                    </div>
                    <span className="font-bold">${adj.avgMisc.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Quote Total</span>
                    <span className="font-bold text-xl text-amber-600">${adj.avgTotal.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    Est. duration: {quoteData.avgDuration} hrs ({quoteData.lowDuration} - {quoteData.highDuration} range)
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Distribution Charts */}
          {quoteData.entries && quoteData.entries.length > 1 && (
            <DistributionCharts
              entries={quoteData.entries}
              avgDuration={quoteData.avgDuration}
              avgParts={quoteData.avgParts}
            />
          )}

          {/* Standard Jobs / Work Orders List */}
          {quoteData.entries && quoteData.entries.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">
              {quoteData.tier === 1 ? 'Matching Standard Jobs' : quoteData.tier === 2 ? 'Matching Work Orders' : 'Reference Work Orders'} ({quoteData.entries.length})
            </h3>
            <div className="space-y-2">
              {quoteData.entries.slice(0, 6).map((stj: StjEntry, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-mono text-xs text-gray-500">{stj.s}</div>
                    <div className="text-sm font-medium">{stj.md || quoteData.compCode.desc}</div>
                    <div className="text-xs text-gray-400">
                      {stj.sf === 'S' ? 'Shop' : stj.sf === 'F' ? 'Field' : ''} · {stj.d} hrs
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(stj.p + stj.l + stj.m).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      P: ${stj.p.toLocaleString()} · L: ${stj.l.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {quoteData.entries.length > 6 && (
                <div className="text-center text-sm text-gray-400 pt-2">
                  +{quoteData.entries.length - 6} more {quoteData.tier === 1 ? 'standard jobs' : 'work orders'}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Similarity Matches */}
          {ENABLE_SIMILARITY && quoteData.similarCombos && quoteData.similarCombos.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Target size={18} className="text-amber-500" />
                {quoteData.tier === 3 ? 'Similar Jobs Used for Estimate' : 'Similar Combinations'}
              </h3>
              <p className="text-xs text-gray-500 mb-3">Based on parts overlap and labor cost analysis</p>
              <div className="space-y-3">
                {quoteData.similarCombos.map((sim: SimilarityResult, idx: number) => {
                  const keyParts = sim.matchKey.split('|');
                  const simModel = keyParts[0];
                  const simJobCode = keyParts.length === 4 ? keyParts[2] : keyParts[1];
                  const simCompCode = keyParts.length === 4 ? keyParts[3] : keyParts[2];
                  const jcDesc = JOB_CODES.find(j => j.code === simJobCode)?.desc || simJobCode;
                  const ccDesc = COMP_CODES.find(c => c.code === simCompCode)?.desc || simCompCode;
                  const scoreColor = sim.overallScore >= 70 ? 'text-green-600 bg-green-50' :
                                     sim.overallScore >= 40 ? 'text-yellow-600 bg-yellow-50' :
                                     'text-gray-600 bg-gray-50';
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900">{simModel}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor}`}>
                          {sim.overallScore}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{jcDesc} - {ccDesc}</div>
                      <div className="text-xs text-gray-400 mt-1">{sim.explanation}</div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Parts</div>
                          <div className="text-xs font-bold">{Math.round(sim.partsOverlap * 100)}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Qty Match</div>
                          <div className="text-xs font-bold">{Math.round(sim.partsQuantityCorrelation * 100)}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Labor</div>
                          <div className="text-xs font-bold">{Math.round(sim.laborProximity * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={addToQuote}
              className="w-full p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add to Quote
            </button>
            <button className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium flex items-center justify-center gap-2">
              <Download size={18} />
              Export PDF
            </button>
            <button onClick={resetQuote} className="w-full p-3 text-gray-600 font-medium">
              ← New Quote
            </button>
          </div>
          </>
          )}
        </div>
      )}

      {/* Quote Builder - Accumulated Segments */}
      {quoteSegments.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-amber-400" />
                <span className="text-white font-bold">Quote Builder</span>
                <span className="text-gray-400 text-sm">— {quoteSegments[0].model.id}{quoteSegments[0].serialPrefix ? ` [${quoteSegments[0].serialPrefix}]` : ''}</span>
              </div>
              <span className="text-amber-400 text-sm font-medium">{quoteSegments.length} item{quoteSegments.length > 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {quoteSegments.map((seg, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      #{idx + 1} {seg.jobCode.code}/{seg.compCode.code} — {seg.jobCode.desc}
                    </div>
                    <div className="text-xs text-gray-500">
                      {seg.compCode.desc} • Tier {seg.tier} • {seg.confidence}
                      {seg.adjustmentPct ? <span className="ml-1 text-amber-600 font-medium">• {seg.adjustmentPct > 0 ? '+' : ''}{seg.adjustmentPct}%</span> : null}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Parts ${seg.avgParts.toLocaleString()} + Labor ${seg.avgLabor.toLocaleString()} + Misc ${seg.avgMisc.toLocaleString()} = <span className="font-bold">${seg.avgTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => removeSegment(idx)} className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            {quoteBundleTotal && (
              <div className="bg-gray-50 px-4 py-3 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900">Bundle Total</span>
                  <span className="text-xl font-bold text-amber-600">${quoteBundleTotal.total.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Parts ${quoteBundleTotal.parts.toLocaleString()} • Labor ${quoteBundleTotal.labor.toLocaleString()} • Misc ${quoteBundleTotal.misc.toLocaleString()} • {quoteBundleTotal.duration} hrs
                </div>
                <div className="space-y-2">
                  <button onClick={pushToAx} className="w-full p-3 bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700">
                    <Send size={18} />
                    {isOnline ? 'Push Bundle to AX' : 'Queue for Sync'}
                  </button>
                  <button className="w-full p-2 border border-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 text-sm hover:bg-gray-50">
                    <Download size={16} />
                    Export PDF
                  </button>
                  <button onClick={clearQuoteBuilder} className="w-full p-2 text-gray-500 text-sm">
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================
  // REFLEXIVE ANALYTICS (right-hand side, Desktop)
  // ============================================
  const ReflexiveAnalytics = ({ selectedModel, selectedSerialPrefix }: { selectedModel: any; selectedSerialPrefix: string | null }) => {
    const analytics = useMemo(() => {
      if (!selectedModel) return null;

      const group = MODEL_GROUPS.get(selectedModel.id);
      const memberIds = group ? group.members : [selectedModel.id];

      // Count WO entries for each job code, comp code, and job+comp combo
      // across all model group members matching the selected serial prefix
      const jobCounts: Record<string, number> = {};
      const compCounts: Record<string, number> = {};
      const comboCounts: Record<string, number> = {};
      let totalWOs = 0;

      for (const memberId of memberIds) {
        for (const [key, entries] of Object.entries(WO_DATA.jobs)) {
          const parsed = parseKey(key);
          if (parsed.model !== memberId) continue;
          if (HAS_SERIAL_PREFIX && selectedSerialPrefix && parsed.serialPrefix !== selectedSerialPrefix) continue;

          const count = (entries as any[]).length;
          totalWOs += count;

          jobCounts[parsed.jobCode] = (jobCounts[parsed.jobCode] || 0) + count;
          compCounts[parsed.compCode] = (compCounts[parsed.compCode] || 0) + count;

          const comboKey = `${parsed.jobCode}|${parsed.compCode}`;
          comboCounts[comboKey] = (comboCounts[comboKey] || 0) + count;
        }
      }

      const topCombos = Object.entries(comboCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([key, count]) => {
          const [jc, cc] = key.split('|');
          return { jc, cc, count };
        });

      const topJobs = Object.entries(jobCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      const topComps = Object.entries(compCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      return { topCombos, topJobs, topComps, totalWOs };
    }, [selectedModel, selectedSerialPrefix]);

    if (!analytics || analytics.totalWOs === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <AlertTriangle size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">No work order history found for this selection.</p>
        </div>
      );
    }

    const { topCombos, topJobs, topComps, totalWOs } = analytics;
    const maxComboCount = topCombos[0]?.count || 1;
    const maxJobCount = topJobs[0]?.[1] || 1;
    const maxCompCount = topComps[0]?.[1] || 1;

    const label = `${selectedModel.id}${selectedSerialPrefix ? ` [${selectedSerialPrefix}]` : ''}`;

    return (
      <>
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Work Order History</h3>
              <p className="text-sm text-gray-500">{label} — {totalWOs.toLocaleString()} work orders</p>
            </div>
          </div>
        </div>

        {/* Top Job + Comp Combinations */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Most Frequent Job + Component Combinations</h3>
            <p className="text-xs text-gray-400">For {label}</p>
          </div>
          <div className="p-4 space-y-2">
            {topCombos.map(({ jc, cc, count }, idx) => {
              const jcDesc = JOB_CODES.find(j => j.code === jc)?.desc || jc;
              const ccDesc = COMP_CODES.find(c => c.code === cc)?.desc || cc;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900 truncate block">{jcDesc}</span>
                      <span className="text-xs text-gray-500 truncate block">{ccDesc}</span>
                    </div>
                    <span className="text-sm font-bold text-amber-600 ml-2 flex-shrink-0">{count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${(count / maxComboCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
            {topCombos.length === 0 && <p className="text-sm text-gray-400">No data</p>}
          </div>
        </div>

        {/* Most Frequent Job Codes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Most Frequent Job Codes</h3>
            <p className="text-xs text-gray-400">For {label}</p>
          </div>
          <div className="p-4 space-y-2">
            {topJobs.map(([code, count], idx) => {
              const desc = JOB_CODES.find(j => j.code === code)?.desc || code;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{code} — {desc}</span>
                    <span className="text-sm font-bold text-blue-600">{count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${(count / maxJobCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Frequent Component Codes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Most Frequent Component Codes</h3>
            <p className="text-xs text-gray-400">For {label}</p>
          </div>
          <div className="divide-y divide-gray-100">
            {topComps.map(([code, count], idx) => {
              const desc = COMP_CODES.find(c => c.code === code)?.desc || code;
              return (
                <div key={idx} className="px-4 py-2 flex justify-between items-center">
                  <div>
                    <div className="font-mono text-xs text-gray-500">{code}</div>
                    <div className="text-sm font-medium">{desc}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-purple-600">{count.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  // ============================================
  // DESKTOP ADMIN VIEW
  // ============================================
  const DesktopView = () => {
    return (
      <div className="bg-gray-50 w-full min-h-0">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-4 border-amber-500">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xl">M</div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Milton CAT</h1>
                  <p className="text-amber-400 text-sm">Intelligent Service Quoting Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <SyncStatusBadge />
                <div className="text-right">
                  <div className="text-white font-medium">Tim Dailey</div>
                  <div className="text-gray-400 text-sm">Service Operations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Notification Banner - Desktop */}
        {showSyncNotification && (
          <div className="bg-green-500 text-white px-6 py-2 flex items-center justify-center gap-2 text-sm font-medium">
            <Upload size={16} className="animate-pulse" />
            {syncQueue.length > 0 ? `Syncing ${syncQueue.length} quote(s)...` : 'Quote synced successfully!'}
          </div>
        )}
        {!isOnline && syncQueue.length > 0 && !showSyncNotification && (
          <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff size={16} />
            {syncQueue.length} quote{syncQueue.length > 1 ? 's' : ''} pending sync — will push when connected
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
                  <div className="flex items-center gap-3">
                    <FileText className="text-amber-500" size={24} />
                    <div>
                      <div className="text-2xl font-bold">{TOTAL_STJS.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Standard Jobs</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center gap-3">
                    <History className="text-blue-500" size={24} />
                    <div>
                      <div className="text-2xl font-bold">{TOTAL_WOS.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Work Orders</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={24} />
                    <div>
                      <div className="text-2xl font-bold">{TOTAL_COMBOS.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Unique Combinations</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                  <div className="flex items-center gap-3">
                    <Target className="text-purple-500" size={24} />
                    <div>
                      <div className="text-2xl font-bold">{MODELS.length}</div>
                      <div className="text-sm text-gray-500">Machine Models</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Form */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                  <h2 className="font-bold text-lg text-gray-900">Generate Service Quote</h2>
                  <span className="text-sm text-gray-500">SMC Code Lookup — Standard Jobs + Work Order History</span>
                </div>

                <div className="p-6">
                  <div className={`grid ${HAS_SERIAL_PREFIX ? 'grid-cols-4' : 'grid-cols-3'} gap-6`}>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Machine Model</label>
                      <div className="relative">
                        <select
                          value={selectedModel?.id || ''}
                          onChange={(e) => {
                            const model = MODELS.find(m => m.id === e.target.value);
                            handleModelSelect(model);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white pr-10"
                        >
                          <option value="">Select model...</option>
                          {MODELS.map(model => (
                            <option key={model.id} value={model.id}>
                              {model.displayName} - {model.category}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>

                    {HAS_SERIAL_PREFIX && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Serial Prefix {selectedModel && <span className="text-gray-400 font-normal">({availableSerialPrefixes.length})</span>}
                      </label>
                      <select
                        value={selectedSerialPrefix || ''}
                        onChange={(e) => handleSerialPrefixSelect(e.target.value || null)}
                        disabled={!selectedModel}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">{selectedModel ? 'Select prefix...' : 'Select model first...'}</option>
                        {availableSerialPrefixes.map(prefix => (
                          <option key={prefix} value={prefix}>{prefix}</option>
                        ))}
                      </select>
                    </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Code {selectedModel && <span className="text-gray-400 font-normal">({availableJobCodes.length})</span>}
                      </label>
                      <select
                        value={selectedJobCode?.code || ''}
                        onChange={(e) => handleJobCodeSelect(JOB_CODES.find(j => j.code === e.target.value))}
                        disabled={!selectedModel || (HAS_SERIAL_PREFIX && !selectedSerialPrefix)}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">{!selectedModel ? 'Select model first...' : (HAS_SERIAL_PREFIX && !selectedSerialPrefix) ? 'Select prefix first...' : 'Select job type...'}</option>
                        {availableJobCodes.map(job => (
                          <option key={job.code} value={job.code}>{job.code} - {job.desc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Component Code {selectedJobCode && <span className="text-gray-400 font-normal">({availableCompCodes.length})</span>}
                      </label>
                      <select
                        value={selectedCompCode?.code || ''}
                        onChange={(e) => setSelectedCompCode(COMP_CODES.find(c => c.code === e.target.value))}
                        disabled={!selectedJobCode}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">{selectedJobCode ? 'Select component...' : 'Select job first...'}</option>
                        {availableCompCodes.map(comp => (
                          <option key={comp.code} value={comp.code}>{comp.code} - {comp.desc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={generateQuote}
                      disabled={!selectedModel || !selectedJobCode || !selectedCompCode || (HAS_SERIAL_PREFIX && !selectedSerialPrefix) || isGenerating}
                      className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                        selectedModel && selectedJobCode && selectedCompCode && (!HAS_SERIAL_PREFIX || selectedSerialPrefix)
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isGenerating ? (
                        <><RefreshCw className="animate-spin" size={20} /> Looking up...</>
                      ) : (
                        <><Zap size={20} /> Generate Quote</>
                      )}
                    </button>
                    {quoteData && (
                      <button onClick={resetQuote} className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Clear</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quote Result */}
              {quoteData && quoteData.insufficientData && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Insufficient Data</h3>
                  <p className="text-gray-500">
                    No standard jobs, work orders, or sufficiently similar combinations were found for this combination.
                  </p>
                </div>
              )}
              {quoteData && !quoteData.insufficientData && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
                    <div>
                      <div className="text-amber-400 text-sm font-medium">
                        {quoteData.tier === 1 ? 'STANDARD JOB QUOTE' : quoteData.tier === 2 ? 'WORK ORDER HISTORY QUOTE' : 'ESTIMATE BASED ON SIMILAR JOBS'}
                      </div>
                      <div className="text-white text-xl font-bold">
                        {quoteData.model.id}{quoteData.serialPrefix ? ` [${quoteData.serialPrefix}]` : ''} - {quoteData.jobCode.desc} {quoteData.compCode.desc}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="text-gray-400 text-sm">{quoteData.quoteId}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        TIER {quoteData.tier}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getConfidenceColor(quoteData.confidence)}`}>
                        {quoteData.confidenceScore}% {quoteData.confidence}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {(() => {
                      const adj = getAdjustedQuote(quoteData, priceAdjustment);
                      return (
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="col-span-2">
                        <h3 className="font-bold text-gray-900 mb-1">Quote Summary</h3>
                        <p className="text-xs text-gray-500 mb-4">Recommended quote uses current catalog parts pricing + recency-weighted labor. Use ±10% to flex.</p>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {[-10, 0, 10].map(pct => {
                            const candidate = getAdjustedQuote(quoteData, pct);
                            const isActive = priceAdjustment === pct;
                            const label = pct === 0 ? 'Recommended' : pct < 0 ? `${pct}%` : `+${pct}%`;
                            const sub = pct === 0 ? 'Generated quote' : pct < 0 ? 'More aggressive' : 'More conservative';
                            return (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setPriceAdjustment(pct as -10 | 0 | 10)}
                                className={`rounded-lg p-4 text-center transition ${
                                  isActive
                                    ? 'bg-amber-50 border-2 border-amber-500 shadow-sm'
                                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                                }`}
                              >
                                <div className={`text-sm font-medium ${isActive ? 'text-amber-700' : 'text-gray-600'}`}>{label}</div>
                                <div className={`font-bold ${isActive ? 'text-3xl text-amber-600' : 'text-xl text-gray-700'}`}>
                                  ${candidate.avgTotal.toLocaleString()}
                                </div>
                                <div className={`text-xs ${isActive ? 'text-amber-500' : 'text-gray-400'}`}>{sub}</div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="text-xs text-gray-400 mb-4 text-center">
                          Historical range across {quoteData.count} {quoteData.tier === 1 ? 'STJs' : quoteData.tier === 2 ? 'work orders' : 'similar jobs'}: ${quoteData.lowTotal.toLocaleString()} – ${quoteData.highTotal.toLocaleString()} ({quoteData.lowDuration}–{quoteData.highDuration} hrs)
                        </div>

                        <table className="w-full">
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="py-3 text-gray-600">Labor ({quoteData.tier === 2 ? 'recency-weighted' : 'avg'} across {quoteData.count} {quoteData.tier === 1 ? 'STJs' : quoteData.tier === 2 ? 'WOs' : 'similar jobs'})</td>
                              <td className="py-3 text-right font-bold">${adj.avgLabor.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-3 text-gray-600">Parts{quoteData.partsRepriced ? ' (current catalog pricing)' : quoteData.partsFallbackToHistorical ? ' (historical avg)' : ''}</td>
                              <td className="py-3 text-right font-bold">${adj.avgParts.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-3 text-gray-600">Shop/Misc</td>
                              <td className="py-3 text-right font-bold">${adj.avgMisc.toLocaleString()}</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="py-3 font-bold text-lg">
                                Quote Total
                                {priceAdjustment !== 0 && (
                                  <span className="ml-2 text-xs font-medium text-amber-600">
                                    ({priceAdjustment > 0 ? '+' : ''}{priceAdjustment}% applied)
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-right font-bold text-xl text-amber-600">${adj.avgTotal.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Confidence Analysis</h3>
                        <div className={`rounded-lg p-4 border-2 ${getConfidenceColor(quoteData.confidence)}`}>
                          <div className="text-center mb-4">
                            <div className="text-4xl font-bold">{quoteData.confidenceScore}%</div>
                            <div className="text-sm font-medium">{quoteData.confidence} CONFIDENCE</div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <History size={16} className="text-blue-600" />
                              <span>{quoteData.count} {quoteData.tier === 1 ? 'standard jobs' : quoteData.tier === 2 ? 'work orders' : 'similar jobs'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 size={16} className="text-purple-600" />
                              <span>${quoteData.stdDev.toLocaleString()} price variance</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-green-600" />
                              <span>{quoteData.lowDuration} - {quoteData.highDuration} hrs range</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <button
                            onClick={addToQuote}
                            className="w-full p-3 bg-amber-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-amber-600"
                          >
                            <Plus size={18} /> Add to Quote
                          </button>
                          <button className="w-full p-3 border border-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
                            <Download size={18} /> Export PDF
                          </button>
                        </div>
                      </div>
                    </div>
                      );
                    })()}

                    {/* Tier Override Note */}
                    {quoteData.tierOverride && (
                      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 mb-4">
                        <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{quoteData.tierOverrideNote}</span>
                      </div>
                    )}

                    {/* Deviation Warning */}
                    {quoteData.deviationWarning && (
                      <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800 mb-4">
                        <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>Recent pricing trend diverges from historical median.</span>
                      </div>
                    )}

                    {/* Confidence Breakdown */}
                    {quoteData.confidenceBreakdown && quoteData.tier === 2 && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <div className="font-medium text-gray-700 mb-1">Confidence Score Breakdown</div>
                        <div className="flex gap-6">
                          <span>Base (count): {quoteData.confidenceBreakdown.baseScore}</span>
                          <span>CV adjustment: {quoteData.confidenceBreakdown.cvAdjustment >= 0 ? '+' : ''}{quoteData.confidenceBreakdown.cvAdjustment}</span>
                          {ENABLE_SIMILARITY && <span>Similarity: {quoteData.confidenceBreakdown.similarityAdjustment >= 0 ? '+' : ''}{quoteData.confidenceBreakdown.similarityAdjustment}</span>}
                          <span className="font-medium text-gray-900">= {quoteData.confidenceScore}%</span>
                        </div>
                      </div>
                    )}

                    {/* Distribution Charts */}
                    {quoteData.entries && quoteData.entries.length > 1 && (
                      <div className="border-t pt-6">
                        <DistributionCharts
                          entries={quoteData.entries}
                          avgDuration={quoteData.avgDuration}
                          avgParts={quoteData.avgParts}
                        />
                      </div>
                    )}

                    {/* STJ / WO Details Table */}
                    {quoteData.entries && quoteData.entries.length > 0 && (
                    <div className="border-t pt-6">
                      <h3 className="font-bold text-gray-900 mb-4">
                        {quoteData.tier === 1 ? 'Standard Job Details' : quoteData.tier === 2 ? 'Work Order Details' : 'Reference Work Orders'} ({quoteData.entries.length})
                      </h3>
                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-gray-600">{quoteData.tier === 1 ? 'STJ ID' : 'Segment ID'}</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-600">Modifier</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-600">Shop/Field</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-600">Parts</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-600">Labor</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-600">Misc</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-600">Hours</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {quoteData.entries.slice(0, 15).map((stj: StjEntry, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono">{stj.s}</td>
                                <td className="px-4 py-3 text-xs">{stj.md || '—'}</td>
                                <td className="px-4 py-3">{stj.sf === 'S' ? 'Shop' : stj.sf === 'F' ? 'Field' : '—'}</td>
                                <td className="px-4 py-3 text-right">${stj.p.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">${stj.l.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">${stj.m.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-medium">${(stj.p + stj.l + stj.m).toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">{stj.d}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {quoteData.entries.length > 15 && (
                          <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 border-t">
                            Showing 15 of {quoteData.entries.length} {quoteData.tier === 1 ? 'standard jobs' : 'work orders'}
                          </div>
                        )}
                      </div>
                    </div>
                    )}

                    {/* Similarity Matches - Desktop */}
                    {ENABLE_SIMILARITY && quoteData.similarCombos && quoteData.similarCombos.length > 0 && (
                      <div className="border-t pt-6">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Target size={18} className="text-amber-500" />
                          {quoteData.tier === 3 ? 'Similar Jobs Used for Estimate' : 'Similar Combinations'} ({quoteData.similarCombos.length})
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Based on parts overlap and labor cost analysis from Work Order History</p>
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Model</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Job Code</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Component</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600">Score</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600">Parts Overlap</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600">Qty Match</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600">Labor Prox.</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {quoteData.similarCombos.map((sim: SimilarityResult, idx: number) => {
                                const keyParts = sim.matchKey.split('|');
                                const simModel = keyParts[0];
                                const simJobCode = keyParts.length === 4 ? keyParts[2] : keyParts[1];
                                const simCompCode = keyParts.length === 4 ? keyParts[3] : keyParts[2];
                                const jcDesc = JOB_CODES.find(j => j.code === simJobCode)?.desc || simJobCode;
                                const ccDesc = COMP_CODES.find(c => c.code === simCompCode)?.desc || simCompCode;
                                const scoreColor = sim.overallScore >= 70 ? 'text-green-600' :
                                                   sim.overallScore >= 40 ? 'text-yellow-600' : 'text-gray-500';
                                return (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{simModel}</td>
                                    <td className="px-4 py-3 text-xs">{simJobCode} - {jcDesc}</td>
                                    <td className="px-4 py-3 text-xs">{simCompCode} - {ccDesc}</td>
                                    <td className={`px-4 py-3 text-right font-bold ${scoreColor}`}>{sim.overallScore}%</td>
                                    <td className="px-4 py-3 text-right">{Math.round(sim.partsOverlap * 100)}%</td>
                                    <td className="px-4 py-3 text-right">{Math.round(sim.partsQuantityCorrelation * 100)}%</td>
                                    <td className="px-4 py-3 text-right">{Math.round(sim.laborProximity * 100)}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quote Builder - Desktop */}
              {quoteSegments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-amber-400" />
                      <span className="text-white font-bold text-lg">Quote Builder</span>
                      <span className="text-gray-400">— {quoteSegments[0].model.id}{quoteSegments[0].serialPrefix ? ` [${quoteSegments[0].serialPrefix}]` : ''}</span>
                    </div>
                    <span className="text-amber-400 font-medium">{quoteSegments.length} segment{quoteSegments.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Job / Component</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Tier</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600">Parts</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600">Labor</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600">Misc</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600">Hours</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {quoteSegments.map((seg, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{seg.jobCode.code} — {seg.jobCode.desc}</div>
                              <div className="text-xs text-gray-500">{seg.compCode.code} — {seg.compCode.desc}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">T{seg.tier}</span>
                              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${seg.confidence === 'HIGH' ? 'text-green-600 bg-green-50' : seg.confidence === 'MEDIUM' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'}`}>
                                {seg.confidenceScore}%
                              </span>
                              {seg.adjustmentPct ? (
                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50">
                                  {seg.adjustmentPct > 0 ? '+' : ''}{seg.adjustmentPct}%
                                </span>
                              ) : null}
                            </td>
                            <td className="px-4 py-3 text-right">${seg.avgParts.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">${seg.avgLabor.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">${seg.avgMisc.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-bold">${seg.avgTotal.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">{seg.avgDuration}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => removeSegment(idx)} className="text-gray-400 hover:text-red-500">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {quoteBundleTotal && (
                        <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                          <tr>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3 font-bold text-gray-900">Bundle Total</td>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3 text-right font-bold">${quoteBundleTotal.parts.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-bold">${quoteBundleTotal.labor.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-bold">${quoteBundleTotal.misc.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-bold text-lg text-amber-600">${quoteBundleTotal.total.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-bold">{quoteBundleTotal.duration}</td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t flex items-center gap-3">
                    <button onClick={pushToAx} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
                      <Send size={18} /> {isOnline ? 'Push Bundle to AX' : 'Queue for Sync'}
                    </button>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50">
                      <Download size={18} /> Export PDF
                    </button>
                    <button onClick={clearQuoteBuilder} className="px-4 py-3 text-gray-500 text-sm hover:text-gray-700">
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Reflexive Analytics */}
            <div className="space-y-6">
              {(!selectedModel || (HAS_SERIAL_PREFIX && !selectedSerialPrefix)) ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <BarChart3 size={40} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-500 mb-1">Service History Analytics</h3>
                  <p className="text-sm text-gray-400">
                    Select a model{HAS_SERIAL_PREFIX ? ' and serial prefix' : ''} to see the most frequent jobs performed from work order history.
                  </p>
                </div>
              ) : (
                <ReflexiveAnalytics
                  selectedModel={selectedModel}
                  selectedSerialPrefix={selectedSerialPrefix}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-dvh bg-gray-100 flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col">
        {useDesktopLayout ? <DesktopView /> : <MobileView />}
      </div>
      <footer className="shrink-0 border-t border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-3 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-3 sm:text-sm lg:justify-end">
          <span>
            <span className="font-medium text-gray-700">RapidCanvas</span>
            <span className="mx-1 text-gray-400">×</span>
            <span>Milton CAT</span>
          </span>
          <span className="hidden sm:inline text-gray-300">·</span>
          <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            {TOTAL_STJS.toLocaleString()} STJs + {TOTAL_WOS.toLocaleString()} WOs loaded
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
