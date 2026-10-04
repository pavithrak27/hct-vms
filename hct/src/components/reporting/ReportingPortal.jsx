import React from 'react';
import { BarChart3, Users, Briefcase, ShieldAlert, Database, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ReportingPortal = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-hct-blue" /> Reports Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Enterprise analytics, audits, and visitor metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Visitor Stats */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Users className="w-6 h-6"/></div>
          <h3 className="font-bold text-slate-800 mb-4">Visitor Statistics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Total Visitors</span><span className="font-bold">1,250</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Today's Visitors</span><span className="font-bold">42</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Currently Inside</span><span className="font-bold text-emerald-600">24</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Walk-in</span><span className="font-bold">500</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Pre-Scheduled</span><span className="font-bold">450</span></div>
          </div>
        </div>

        {/* Contractor Stats */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4"><Briefcase className="w-6 h-6"/></div>
          <h3 className="font-bold text-slate-800 mb-4">Contractor Statistics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Total Contractors</span><span className="font-bold">15</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Approved</span><span className="font-bold text-emerald-600">12</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Pending</span><span className="font-bold text-amber-600">2</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Expired</span><span className="font-bold text-red-600">1</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Employees</span><span className="font-bold">340</span></div>
          </div>
        </div>

        {/* Security Stats */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4"><ShieldAlert className="w-6 h-6"/></div>
          <h3 className="font-bold text-slate-800 mb-4">Security Statistics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Restricted Visitors</span><span className="font-bold text-red-600">125</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Security Reviews</span><span className="font-bold">8</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Exceptional Approvals</span><span className="font-bold text-emerald-600">5</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Rejected Visits</span><span className="font-bold text-red-600">32</span></div>
          </div>
        </div>

        {/* System Stats */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4"><Database className="w-6 h-6"/></div>
          <h3 className="font-bold text-slate-800 mb-4">System Statistics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Total Audit Actions</span><span className="font-bold">84,092</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Failed Actions</span><span className="font-bold text-red-600">14</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Notifications</span><span className="font-bold">12,450</span></div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-6">Available Reports</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/reports/visitor" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-hct-blue hover:shadow-lg transition-all flex flex-col justify-between h-40">
          <div>
            <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-hct-blue transition-colors">Visitor Report</h4>
            <p className="text-sm text-slate-500 line-clamp-2">Detailed list of individual visit transactions, check-ins, and durations.</p>
          </div>
          <div className="flex justify-end"><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-hct-blue transition-colors"/></div>
        </Link>
        <Link to="/reports/directory" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-hct-blue hover:shadow-lg transition-all flex flex-col justify-between h-40">
          <div>
            <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-hct-blue transition-colors">Visitor Directory</h4>
            <p className="text-sm text-slate-500 line-clamp-2">Master list of known visitor profiles, contact information, and IDs.</p>
          </div>
          <div className="flex justify-end"><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-hct-blue transition-colors"/></div>
        </Link>
        <Link to="/reports/contractor-onboarded" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-hct-blue hover:shadow-lg transition-all flex flex-col justify-between h-40">
          <div>
            <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-hct-blue transition-colors">Contractor Onboarded</h4>
            <p className="text-sm text-slate-500 line-clamp-2">Status of contractor companies, validities, and employee counts.</p>
          </div>
          <div className="flex justify-end"><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-hct-blue transition-colors"/></div>
        </Link>
        <Link to="/reports/contractor-visitor" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-hct-blue hover:shadow-lg transition-all flex flex-col justify-between h-40">
          <div>
            <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-hct-blue transition-colors">Contractor Visits</h4>
            <p className="text-sm text-slate-500 line-clamp-2">Detailed log of gate passes and visits specifically for contractors.</p>
          </div>
          <div className="flex justify-end"><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-hct-blue transition-colors"/></div>
        </Link>
        <Link to="/reports/audit" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-hct-blue hover:shadow-lg transition-all flex flex-col justify-between h-40">
          <div>
            <h4 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-hct-blue transition-colors">Audit Log Report</h4>
            <p className="text-sm text-slate-500 line-clamp-2">Comprehensive, immutable log of all system actions and decisions.</p>
          </div>
          <div className="flex justify-end"><ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-hct-blue transition-colors"/></div>
        </Link>
      </div>

    </motion.div>
  );
};

export default ReportingPortal;
