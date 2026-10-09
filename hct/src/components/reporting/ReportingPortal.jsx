import React from 'react';
import {
  BarChart3, Users, Briefcase, ShieldAlert, Database,
  ArrowRight, FileText, BookOpen, HardHat, FileSpreadsheet,
  Download, Clock, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─── Mini bar spark ─── */
const MiniBar = ({ values, color }) => {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-[3px] h-8">
      {values.map((v, i) => (
        <div
          key={i}
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.3 + (i / values.length) * 0.7 }}
          className="flex-1 rounded-t-sm"
        />
      ))}
    </div>
  );
};

/* ─── Count card ─── */
const CountCard = ({ icon: Icon, label, value, trend, trendVal, color, bars, delay }) => {
  const palette = {
    blue:    { grad: 'from-blue-500 to-indigo-600',   bar: '#6366f1', ring: 'ring-blue-100 dark:ring-blue-900/40' },
    emerald: { grad: 'from-emerald-500 to-teal-600',  bar: '#10b981', ring: 'ring-emerald-100 dark:ring-emerald-900/40' },
    indigo:  { grad: 'from-indigo-500 to-purple-600', bar: '#8b5cf6', ring: 'ring-indigo-100 dark:ring-indigo-900/40' },
    red:     { grad: 'from-rose-500 to-red-600',      bar: '#f43f5e', ring: 'ring-rose-100 dark:ring-rose-900/40' },
    slate:   { grad: 'from-slate-500 to-slate-700',   bar: '#64748b', ring: 'ring-slate-100 dark:ring-slate-800' },
  };
  const p = palette[color] || palette.blue;
  const isUp = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5 ring-1 ${p.ring} overflow-hidden relative`}
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${p.grad} opacity-10 blur-xl`} />
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.grad} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendVal}
        </span>
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{label}</p>
      <MiniBar values={bars} color={p.bar} />
    </motion.div>
  );
};

/* ─── Report card ─── */
const ReportCard = ({ to, icon: Icon, title, description, badge, count, accent, delay }) => {
  const a = {
    blue:    { strip: 'from-blue-500 to-indigo-600',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',       border: 'hover:border-blue-300 dark:hover:border-blue-700',    arrow: 'group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600' },
    indigo:  { strip: 'from-indigo-500 to-purple-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',border: 'hover:border-indigo-300 dark:hover:border-indigo-700',arrow: 'group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600' },
    amber:   { strip: 'from-amber-400 to-orange-500',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',    border: 'hover:border-amber-300 dark:hover:border-amber-700',  arrow: 'group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500' },
    emerald: { strip: 'from-emerald-500 to-teal-600',  badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',border:'hover:border-emerald-300 dark:hover:border-emerald-700',arrow:'group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-600'},
    slate:   { strip: 'from-slate-600 to-slate-800',   badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',       border: 'hover:border-slate-400 dark:hover:border-slate-500',  arrow: 'group-hover:bg-gradient-to-br group-hover:from-slate-600 group-hover:to-slate-800' },
    rose:    { strip: 'from-rose-500 to-red-600',       badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',        border: 'hover:border-rose-300 dark:hover:border-rose-700',    arrow: 'group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-red-600' },
  }[accent] || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <Link
        to={to}
        className={`group flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 dark:border-slate-700/60 ${a.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
      >
        {/* Color strip */}
        <div className={`h-1 bg-gradient-to-r ${a.strip}`} />

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.strip} flex items-center justify-center shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 ${a.arrow} transition-all duration-300 flex items-center justify-center`}>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{description}</p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${a.badge}`}>{badge}</span>
            {count && (
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <FileText className="w-3 h-3" /> {count} records
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ─── MAIN ─── */
const ReportingPortal = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-8">

    {/* ── HEADER ── */}
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#000a29] via-[#00144d] to-[#00249c] px-8 py-7 shadow-2xl"
    >
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      <div className="absolute -top-10 -right-10 w-52 h-52 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-200 text-xs font-bold tracking-widest uppercase">Analytics & Reports</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Reports Dashboard</h1>
          <p className="text-blue-200 text-sm mt-1">Enterprise analytics and visitor metrics.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-white text-hct-blue rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-all">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>
    </motion.div>

    {/* ── COUNT CARDS ── */}
    <div>
      <h2 className="text-base font-black text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-hct-blue" /> Report Metrics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { icon: Users,       label: 'Total Visitors',      value: '1,250', trend: 'up',   trendVal: '+12%', color: 'blue',    bars: [30,45,28,60,42,80,95], delay: 0.05 },
          { icon: Users,       label: "Today's Visitors",    value: '42',    trend: 'up',   trendVal: '+3',   color: 'emerald', bars: [10,18,22,15,20,35,42], delay: 0.10 },
          { icon: Briefcase,   label: 'Contractors Active',  value: '12',    trend: 'down', trendVal: '-1',   color: 'indigo',  bars: [8,12,14,10,13,12,12],  delay: 0.15 },
          { icon: ShieldAlert, label: 'Restricted Visitors', value: '125',   trend: 'down', trendVal: '-8%',  color: 'red',     bars: [20,18,22,30,28,24,22], delay: 0.20 },
          { icon: Database,    label: 'Audit Actions',       value: '84K',   trend: 'up',   trendVal: '+2%',  color: 'slate',   bars: [55,60,70,65,80,75,84], delay: 0.25 },
        ].map((c, i) => <CountCard key={i} {...c} />)}
      </div>
    </div>

    {/* ── REPORT CARDS ── */}
    <div>
      <h2 className="text-base font-black text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-hct-blue" /> Available Reports
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: '/reports/visitor',              icon: Users,          title: 'Visitor Report',       description: 'Detailed list of visit transactions, check-ins, and durations across all campuses.',   badge: 'Visitors',    count: '1,250', accent: 'blue',    delay: 0.10 },
          { to: '/reports/directory',            icon: BookOpen,       title: 'Visitor Directory',    description: 'Master list of visitor profiles, contact information, and identity documents.',          badge: 'Directory',   count: '890',   accent: 'indigo',  delay: 0.15 },
          { to: '/reports/transfer-visit',       icon: RefreshCw,      title: 'Transfer Visit Report',description: 'Comprehensive log of all transferred visitors, campus reassignments, dates, and remarks.',badge: 'Transfers',  count: '48',    accent: 'emerald', delay: 0.18 },
          { to: '/reports/contractor-onboarded', icon: HardHat,        title: 'Contractor Onboarded', description: 'Status of contractor companies, validity periods, and employee counts.',                badge: 'Contractors', count: '15',    accent: 'amber',   delay: 0.20 },
          { to: '/reports/contractor-visitor',   icon: FileSpreadsheet,title: 'Contractor Visits',    description: 'Detailed log of gate passes and visits generated for contractors on-site.',             badge: 'Contractors', count: '340',   accent: 'indigo',  delay: 0.25 },
          { to: '/reports/audit',                icon: Database,       title: 'Audit Log Report',     description: 'Comprehensive immutable log of all system actions, decisions, and security events.',    badge: 'Audit',       count: '84K',   accent: 'slate',   delay: 0.30 },
          { to: '/reports/visitor',              icon: FileText,       title: 'Custom Report',        description: 'Build and export a fully customised report with your own date ranges and field filters.', badge: 'Flexible',    count: null,    accent: 'rose',    delay: 0.35 },
        ].map((r, i) => <ReportCard key={i} {...r} />)}
      </div>
    </div>

  </motion.div>
);

export default ReportingPortal;
