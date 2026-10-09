import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, Shield, Briefcase, Activity, CheckCircle, Clock, 
  Building2, FileSignature, AlertTriangle, Calendar, ChevronDown, 
  Download, FileText, ArrowRight, ShieldAlert, LogIn, LogOut, 
  Ban, Scan, Radio, CheckCircle2, AlertOctagon, Sparkles, 
  Video, Eye, Filter, RefreshCw, Layers, ShieldCheck, HardHat,
  Search, ExternalLink, X, FileSearch, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../../context/RoleContext';
import { useCheckIn } from '../../../context/CheckInContext';

export default function SuperadminDashboard() {
  const { currentRole, sessionUser } = useRole();
  const { securityReviews, expectedPasses, activeVisits, stats } = useCheckIn();
  const navigate = useNavigate();

  // Controls & States
  const [dateFilter, setDateFilter] = useState('Today');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('visitors'); // 'visitors' | 'modules'
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorFilter, setVisitorFilter] = useState('ALL');

  // Modals
  const [showLiveStreamModal, setShowLiveStreamModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogType, setAuditLogType] = useState('pdf');

  // Recent Security Reviews list
  const recentReviews = [
    {
      id: 'SR-2026-0001',
      visitorName: 'David Brown',
      docNumber: '784-9876-5432109-2',
      reason: 'Security Concern • Blocklist Matched',
      host: 'Facility Manager',
      campus: 'Main Campus',
      matchTime: '08:30 AM Today',
      status: 'Pending Review'
    },
    {
      id: 'SR-2026-0002',
      visitorName: 'David K. Miller',
      docNumber: '784-1234-5678901-1',
      reason: 'Safety Violation / Expired ID',
      host: 'Dean Office',
      campus: 'Main Campus',
      matchTime: '09:41 AM Today',
      status: 'Denied'
    },
    {
      id: 'SR-2026-0003',
      visitorName: 'John Smith',
      docNumber: '784-3321-9988776-5',
      reason: 'Access Escalation Verified',
      host: 'IT Dept',
      campus: 'Main Campus',
      matchTime: 'Yesterday, 04:15 PM',
      status: 'Temp Released'
    }
  ];

  const [selectedReview, setSelectedReview] = useState(recentReviews[0]);

  // Sample Expected Visitors data
  const [visitorsList, setVisitorsList] = useState([
    { id: 'V-101', name: 'Michael Chang', company: 'Tech Solutions LLC', host: 'Dr. Ahmed Al-Maktoum', date: '2026-10-05', time: '09:00 AM - 11:00 AM', status: 'Pending', gate: 'Gate 2 Main Entrance', passType: 'Pre-Approved' },
    { id: 'V-102', name: 'Sarah Parker', company: 'Ministry of Education', host: 'Jane Doe', date: '2026-10-05', time: '01:00 PM - 03:00 PM', status: 'Approved', gate: 'Gate 1 North Wing', passType: 'VIP Guest' },
    { id: 'V-103', name: 'Ali Hassan', company: 'Global Services Group', host: 'Facilities Dept', date: '2026-10-05', time: '02:30 PM - 05:00 PM', status: 'Checked In', gate: 'Gate 4 Service Bay', passType: 'Contractor Pass' },
    { id: 'V-104', name: 'Elena Rostova', company: 'CyberTech Emirates', host: 'Eng. Khalid Mansoor', date: '2026-10-05', time: '11:15 AM - 01:45 PM', status: 'Checked Out', gate: 'Gate 2 Main Entrance', passType: 'Pre-Approved' },
    { id: 'V-105', name: 'David K. Miller', company: 'Independent Consultant', host: 'Dean Office', date: '2026-10-05', time: '09:41 AM - 12:00 PM', status: 'Rejected', gate: 'Turnstile 3', passType: 'Restricted' },
    { id: 'V-106', name: 'Robert Taylor', company: 'Apex Logistics', host: 'Dr. Ahmed Al-Maktoum', date: '2026-10-05', time: '03:15 PM', status: 'Blocked', gate: 'Gate 1 Main Entry', passType: 'Walk-In' }
  ]);

  const mockCounts = useMemo(() => {
    let base = { expected: 24, checkedIn: 14, checkedOut: 10, overstay: 1, blocked: 1, chart: { preApproved: 18, walkins: 5, denied: 1 }, validPasses: 13 };
    if (dateFilter === 'Last 7 Days') {
       base = { expected: 156, checkedIn: 45, checkedOut: 110, overstay: 3, blocked: 5, chart: { preApproved: 120, walkins: 30, denied: 6 }, validPasses: 15 };
    } else if (dateFilter === 'This Month') {
       base = { expected: 640, checkedIn: 210, checkedOut: 400, overstay: 8, blocked: 12, chart: { preApproved: 500, walkins: 120, denied: 20 }, validPasses: 18 };
    } else if (dateFilter === 'Custom Date' && customDate) {
       const val = parseInt(customDate.replace(/-/g, '')) % 100 || 50;
       base = { expected: val + 20, checkedIn: Math.floor(val/2) + 5, checkedOut: Math.floor(val/2) + 10, overstay: val % 3, blocked: val % 2, chart: { preApproved: val + 15, walkins: 4, denied: 1 }, validPasses: 10 + (val%5) };
    }
    return base;
  }, [dateFilter, customDate]);

  const handleExport = (format) => {
    setIsExporting(true);
    setAuditLogType(format);
    setTimeout(() => {
      setIsExporting(false);
      setShowAuditModal(true);
    }, 800);
  };

  const filteredVisitors = visitorsList.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(visitorSearch.toLowerCase()) ||
                          v.company.toLowerCase().includes(visitorSearch.toLowerCase()) ||
                          v.host.toLowerCase().includes(visitorSearch.toLowerCase());
    if (visitorFilter === 'ALL') return matchesSearch;
    return matchesSearch && v.status.toLowerCase() === visitorFilter.toLowerCase();
  });

  if (!currentRole.portals.includes('dashboard')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Restricted</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Your current simulated role ({currentRole.label}) does not have access to the administrative dashboard. 
          Please select an available module from the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 w-full pb-12 space-y-6">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Top Header & Enterprise Toolbar */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 justify-end w-full">
        <div>
          
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Date Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none flex items-center gap-2.5 shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{dateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                {['Today', 'Last 7 Days', 'This Month', 'Custom Date'].map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { setDateFilter(option); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${dateFilter === option ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {dateFilter === 'Custom Date' && (
            <input 
              type="date" 
              value={customDate} 
              onChange={(e) => setCustomDate(e.target.value)} 
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 shadow-sm"
            />
          )}

          {/* PDF Export */}
          <button  
            onClick={() => handleExport('pdf')} 
            disabled={isExporting} 
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting && auditLogType === 'pdf' ? (
              <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...</span>
            ) : (
              <><Download className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Export PDF</>
            )}
          </button>

          {/* Quick Refresh */}
          <button 
            onClick={() => {
              const prev = visitorsList;
              setVisitorsList([...prev]);
            }}
            title="Refresh Live Data"
            className="p-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-blue-600 hover:border-blue-300 dark:hover:border-slate-600 rounded-xl shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ROW 1: 5 High-Impact KPI Stat Cards */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Expected Today */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/visitor-list')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                Total Expected<br />
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{mockCounts.expected}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                Scheduled
              </span>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{mockCounts.chart.preApproved} pre-approved</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span>{mockCounts.expected - mockCounts.chart.preApproved} walk-ins</span>
          </div>
        </motion.div>

        {/* Card 2: Checked-In On-Premises */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/active-visits')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                Checked-In<br />
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <LogIn className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{mockCounts.checkedIn}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span>Current on-site visitors</span>
          </div>
        </motion.div>

        {/* Card 3: Checked-Out Today */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/visit-history')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-slate-400 hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                Checked-Out<br />
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <LogOut className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{mockCounts.checkedOut}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                Completed
              </span>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span>Daily departed sessions</span>
          </div>
        </motion.div>

        {/* Card 4: Overstay / Pending Exit */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/active-visits')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-amber-400 hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                Overstay /<br />Pending Exit
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">{mockCounts.overstay}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                Escalated
              </span>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span>Security watch logged</span>
          </div>
        </motion.div>

        {/* Card 5: Blocked & Blacklisted */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/security-reviews')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-rose-400 hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                Blocked &amp;<br />Blacklisted
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">{mockCounts.blocked}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 flex items-center gap-1">
                Active Alert
              </span>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="text-rose-600 dark:text-rose-400 font-semibold">Gate 3 Intercept</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span>{mockCounts.blocked} Breaches</span>
          </div>
        </motion.div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ROW 2: Three Enterprise Operational Columns */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── COLUMN 1: VISITOR ARRIVALS (Simple term) ─── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Visitor Arrivals</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily breakdown by pass type</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Today (24)
              </span>
            </div>

            {/* Circular Gauge / Donut Visualization */}
            <div className="relative flex justify-center items-center my-6">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="11"
                    className="text-slate-100 dark:text-slate-800"
                    fill="transparent"
                  />
                  {/* Segment 1: Pre-Approved Host Passes (75% -> 18 of 24) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#2563eb"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="59.69"
                    fill="transparent"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Segment 2: Kiosk Direct Walk-ins (21% -> 5 of 24) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#10b981"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="188.62"
                    style={{
                      transform: 'rotate(270deg)',
                      transformOrigin: '50% 50%'
                    }}
                    fill="transparent"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Segment 3: Denied / Watchlist Blocked (4% -> 1 of 24) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#ef4444"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="229.2"
                    style={{
                      transform: 'rotate(345deg)',
                      transformOrigin: '50% 50%'
                    }}
                    fill="transparent"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Donut Center Metrics */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">TOTAL</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{mockCounts.expected}</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">95.8% Pass</span>
                </div>
              </div>
            </div>

            {/* Breakdown Legend Items */}
            <div className="space-y-2.5">
              <div onClick={() => navigate('/visitor')} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/70 dark:hover:bg-slate-800 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pre-Approved Host Passes</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {mockCounts.chart.preApproved} <span className="text-slate-400 font-normal text-[11px]">({Math.round((mockCounts.chart.preApproved/mockCounts.expected)*100)}%)</span>
                </div>
              </div>

              <div onClick={() => navigate('/visitor')} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/70 dark:hover:bg-slate-800 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Walk-ins</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {mockCounts.chart.walkins} <span className="text-slate-400 font-normal text-[11px]">({Math.round((mockCounts.chart.walkins/mockCounts.expected)*100)}%)</span>
                </div>
              </div>

              <div onClick={() => navigate('/security-reviews')} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50/70 dark:hover:bg-slate-800 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Denied / Watchlist Blocked</span>
                </div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {mockCounts.chart.denied} <span className="text-rose-400/80 font-normal text-[11px]">({Math.round((mockCounts.chart.denied/mockCounts.expected)*100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
         
        </div>

        {/* ─── COLUMN 2: CONTRACTOR PASSES (Simple term & removed Revoked/Suspended) ─── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-4 rounded-full bg-slate-800 dark:bg-slate-200 mt-1 shrink-0"></div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Contractor Passes</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pass validity &amp; active roster</p>
                </div>
              </div>
            </div>

            {/* 3-Column Metric Tiles (Removed Revoked/Suspended) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mb-5">
              {/* Tile 1: Active Contractors */}
              <div onClick={() => navigate('/contractors-hub')} className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-sm transition-all">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Active<br />Contractors
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">{mockCounts.validPasses}</span>
                  
                </div>
              </div>

                            {/* Tile 1b: Contractor Check In */}
              <div onClick={() => navigate('/contractors-hub')} className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-sm transition-all">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Contractor<br />Check In
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">12</span>
                </div>
              </div>

              {/* Tile 1c: Contractor Check Out */}
              <div onClick={() => navigate('/contractors-hub')} className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-sm transition-all">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Contractor<br />Check Out
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">8</span>
                </div>
              </div>

              {/* Tile 1d: Employees Count */}
              <div onClick={() => navigate('/employee-approvals')} className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-sm transition-all">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Total<br />Employees
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">45</span>
                </div>
              </div>

              {/* Tile 2: Expired Passes */}
              <div onClick={() => navigate('/contractors-hub')} className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-red-400 dark:hover:border-red-700 hover:shadow-sm transition-all">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Expired<br />Passes
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">0</span>
                 
                </div>
              </div>

              {/* Tile 3: Onboard Requests */}
              <div onClick={() => navigate('/contractor-approvals')} className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-amber-400 dark:hover:border-amber-700 hover:shadow-sm transition-all">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Onboard<br />Requests
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">0</span>
                
                </div>
              </div>
            </div>

            {/* Pass Validity Roster Bar (Valid vs Expired only) */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Pass Validity <span className="text-slate-400 font-normal">({mockCounts.validPasses} Total)</span></span>
                <span className="font-bold text-slate-900 dark:text-white text-[11px]"></span>
              </div>

              {/* Horizontal Bar: 100% Valid */}
              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div style={{ width: '100%' }} className="bg-blue-600 h-full rounded-full" title={`${mockCounts.validPasses} Valid passes`}></div>
              </div>

              {/* Legend under bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> {mockCounts.validPasses} Valid
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> 0 Expired
                </span>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="text-slate-500 dark:text-slate-400">
              <span>Pending approvals: </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">0 Items</span>
            </div>
            <Link 
              to="/contractors-hub" 
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 group"
            >
              <span>Contractor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ─── COLUMN 3: SECURITY REVIEWS (Recent Review List Only) ─── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-4 rounded-full bg-amber-500 mt-1 shrink-0"></div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Security Reviews</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Recent flagged review requests</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                {recentReviews.length} Reviews
              </span>
            </div>

            {/* Recent Reviews List Only */}
            <div className="space-y-2.5">
              {recentReviews.map((rev) => (
                <div
                  key={rev.id}
                  onClick={() => {
                    setSelectedReview(rev);
                    setShowReviewModal(true);
                  }}
                  className="cursor-pointer p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/60 bg-slate-50/70 hover:bg-amber-50/40 dark:bg-slate-800/50 dark:hover:bg-amber-950/20 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                        {rev.visitorName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {rev.visitorName}
                        </h4>
                        <p className="text-[10px] text-slate-400">{rev.id} • {rev.matchTime}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      rev.status === 'Pending Review' 
                        ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300' 
                        : rev.status === 'Denied'
                        ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{rev.reason}</span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Review →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="text-slate-500 dark:text-slate-400">
              <span>Pending Action: </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">1 Review</span>
            </div>
            <Link 
              to="/security-reviews" 
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 group"
            >
              <span>Security Reviews Queue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* OPERATIONAL DRILLDOWN & LOGS SECTION (Without Live Gate Events Tab) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-7 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
        
        {/* Tab Controls (Live Gate Events Tab Removed) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveBottomTab('visitors')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeBottomTab === 'visitors' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Calendar className="w-4 h-4" />
              <span>Today's Expected Visitors</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {visitorsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveBottomTab('modules')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeBottomTab === 'modules' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Layers className="w-4 h-4" />
              <span>Quick Access Portals</span>
            </button>
          </div>

          {activeBottomTab === 'visitors' && (
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter name, company..."
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 w-44 sm:w-56"
                />
              </div>

              <select
                value={visitorFilter}
                onChange={(e) => setVisitorFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Rejected">Rejected</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Visitors Table */}
        {activeBottomTab === 'visitors' && (
          <div className="pt-4 overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-4">Company / Org</th>
                  <th className="py-3 px-4">Host / Department</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Gate &amp; Archetype</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredVisitors.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center">
                          {row.name.charAt(0)}
                        </div>
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{row.company}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{row.host}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{row.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{row.gate}</span>
                      <span className="block text-[11px] text-slate-400">{row.passType}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {row.status === 'Pending' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200">
                          Pending
                        </span>
                      )}
                      {row.status === 'Approved' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {row.status === 'Checked In' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200">
                          Checked In
                        </span>
                      )}
                      {row.status === 'Checked Out' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200">
                          Checked Out
                        </span>
                      )}
                      {row.status === 'Rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200">
                          Rejected
                        </span>
                      )}
                      {row.status === 'Blocked' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 inline-flex items-center gap-1">
                          <Ban className="w-3 h-3 text-red-600"/> Blocked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Quick Modules Directory */}
        {activeBottomTab === 'modules' && (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Visitor Management', desc: 'Fast Pass & walk-in check-in', to: '/visitor-list', icon: Users, badge: 'Fast Pass', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
              { title: 'Host Approvals', desc: 'Staff approval queues & VIP requests', to: '/host', icon: UserCheck, badge: '12 Pending', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
              { title: 'Security', desc: 'Blocklist management, reviews & release', to: '/security-reviews', icon: FileSearch, badge: '1 Pending', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
              { title: 'Contractor Desk', desc: 'Permits, passes & induction roster', to: '/contractors-hub', icon: Briefcase, badge: '45 On-Site', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' }
            ].map((mod, i) => (
              <Link
                key={i}
                to={mod.to}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mod.color}`}>
                      <mod.icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{mod.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mt-4">
                  <span>Open Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL 1: LIVE STREAM / OPTICAL KIOSK MODAL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLiveStreamModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Live Kiosk Lane &amp; Optical Sensor</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Kiosk 01 • Main Gate
                  </span>
                </div>
                <button 
                  onClick={() => setShowLiveStreamModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden flex flex-col justify-between p-4 border border-slate-800">
                  <div className="flex justify-between items-center text-xs text-white">
                    <span className="bg-red-600 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
                    </span>
                    <span className="font-mono text-slate-400 text-xs">FPS: 30 • 1080p • 2.4 Mbps</span>
                  </div>

                  {/* Simulated HUD scanner overlay */}
                  <div className="self-center border border-dashed border-emerald-400/60 w-32 h-44 rounded-xl flex items-center justify-center relative">
                    <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400"></div>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider">AI FACE DETECT: CLEAR</span>
                  </div>

                  <div className="flex justify-between items-end text-xs text-white/80">
                    <span className="font-mono text-[11px]">FEED ID: CAM-MNT-0412</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Barrier Sync Armed
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span>FastTrack Optical Lane is operating within normal latency parameters (&lt;120ms).</span>
                  <button 
                    onClick={() => setShowLiveStreamModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    Close Feed
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL 2: SECURITY REVIEW MODAL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-amber-200 dark:border-amber-900/60 overflow-hidden shadow-2xl"
            >
              <div className="bg-amber-50 dark:bg-amber-950/40 p-5 border-b border-amber-100 dark:border-amber-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Security Review Item</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-300">Case Ticket #{selectedReview?.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Visitor Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedReview?.visitorName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Document ID:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedReview?.docNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Restriction Matched:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{selectedReview?.reason}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Host / Campus:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedReview?.host} • {selectedReview?.campus}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Current Status:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{selectedReview?.status}</span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button 
                    onClick={() => {
                      setShowReviewModal(false);
                      navigate('/security-reviews');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
                  >
                    Go to Security Reviews Portal
                  </button>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL 3: AUDIT LOG GENERATED CONFIRMATION */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAuditModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Audit Snapshot Compiled</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                The campus security manifest for <strong>{dateFilter}</strong> includes 24 visitor records, 13 active contractor credentials, and 1 security review case.
              </p>

              <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
                PROVISIT_AUDIT_{new Date().toISOString().slice(0, 10)}.pdf (418 KB)
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/20"
                >
                  Download Report
                </button>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
