import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import { 
  Bell, CheckCircle2, AlertTriangle, Clock, ShieldAlert, FileText, 
  Trash2, Check, Filter, QrCode, Mail, Briefcase, ChevronRight, X, Sparkles, Building, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const initialNotifications = [
  {
    id: 'NOTIF-001',
    title: 'New Visitor Gate Pass Request Pending Approval',
    description: 'Walk-in pass request submitted for John Smith (Tech Solutions LLC) visiting Dr. Ahmed Al-Maktoum.',
    time: '5 mins ago',
    type: 'pass',
    priority: 'high',
    read: false,
    roleCategory: ['host', 'superadmin', 'campusadmin', 'reception'],
    link: '/visitor-approvals'
  },
  {
    id: 'NOTIF-002',
    title: 'Gate Pass Approved & QR Code Active',
    description: 'Contractor gate pass PR-101 for 2 employees (Tech Solutions LLC) has been approved for Abu Dhabi Men\'s Campus.',
    time: '25 mins ago',
    type: 'contractor',
    priority: 'medium',
    read: false,
    roleCategory: ['contractor', 'superadmin', 'campusadmin', 'host'],
    link: '/contractor'
  },
  {
    id: 'NOTIF-003',
    title: 'Security Review Interception Alert',
    description: 'Visitor David K. Miller matched watch-list security criteria at Gate 2 Main Entrance.',
    time: '1 hour ago',
    type: 'security',
    priority: 'high',
    read: false,
    roleCategory: ['security', 'superadmin', 'campusadmin'],
    link: '/security-reviews'
  },
  {
    id: 'NOTIF-004',
    title: 'Visitor Checked In Successfully',
    description: 'Khalfan Al-Nuaimi (Emirates Telecom) has completed check-in at Gate 01 North Wing.',
    time: '2 hours ago',
    type: 'checkin',
    priority: 'low',
    read: true,
    roleCategory: ['security', 'reception', 'host', 'superadmin', 'campusadmin'],
    link: '/active-visits'
  },
  {
    id: 'NOTIF-005',
    title: 'HSE Safety Policy Document Updated',
    description: 'Updated HSE Safety Induction policy (v2026.4) has been published under System Configuration.',
    time: 'Yesterday',
    type: 'system',
    priority: 'medium',
    read: true,
    roleCategory: ['superadmin', 'campusadmin', 'contractor', 'security'],
    link: '/settings/system'
  },
  {
    id: 'NOTIF-006',
    title: 'SMTP Diagnostic Mail Gateway Active',
    description: 'SMTP handshake test completed successfully with zero connection errors.',
    time: 'Yesterday',
    type: 'system',
    priority: 'low',
    read: true,
    roleCategory: ['superadmin', 'campusadmin'],
    link: '/settings/system'
  }
];

export default function NotificationCenter() {
  const { currentRole, sessionUser } = useRole();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'UNREAD' | 'HIGH'

  // Filter based on user role category
  const roleId = currentRole?.id || 'superadmin';
  const roleFiltered = notifications.filter(n => 
    !n.roleCategory || n.roleCategory.includes(roleId) || roleId === 'superadmin' || roleId === 'campusadmin'
  );

  const displayedNotifications = roleFiltered.filter(n => {
    if (filterType === 'UNREAD') return !n.read;
    if (filterType === 'HIGH') return n.priority === 'high';
    return true;
  });

  const unreadCount = roleFiltered.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'pass':
        return <UserCheck className="w-5 h-5 text-hct-blue" />;
      case 'contractor':
        return <Briefcase className="w-5 h-5 text-emerald-500" />;
      case 'checkin':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'system':
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-12">
      
      {/* ── Top Header Banner ── */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[28px] p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hct-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold">
                {currentRole?.label || 'User'} Notifications
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Notification Center</h1>
            <p className="text-slate-300 text-sm mt-1 font-medium">
              Real-time gate pass updates, security alerts, check-in activities, and system notifications.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-xs backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <Check className="w-4 h-4 text-emerald-400" /> Mark All as Read
              </button>
            )}
            <button 
              onClick={clearAll}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl font-bold text-xs backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs & Controls ── */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filterType === 'ALL'
                ? 'bg-hct-blue text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Notifications
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-black">
              {roleFiltered.length}
            </span>
          </button>

          <button
            onClick={() => setFilterType('UNREAD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filterType === 'UNREAD'
                ? 'bg-hct-blue text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Unread Only
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterType('HIGH')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filterType === 'HIGH'
                ? 'bg-hct-blue text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            High Priority
          </button>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Showing {displayedNotifications.length} of {roleFiltered.length} notifications
        </span>
      </div>

      {/* ── Notification List Cards ── */}
      <div className="space-y-4">
        {displayedNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Bell className="w-8 h-8"/>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Notifications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are all caught up! New visitor approvals, gate check-in alerts, and contractor pass updates will appear here.
            </p>
          </div>
        ) : (
          displayedNotifications.map(notif => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-6 rounded-[24px] border transition-all shadow-sm relative group ${
                !notif.read
                  ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 ring-2 ring-blue-500/10'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    notif.priority === 'high'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/50'
                      : notif.type === 'pass' || notif.type === 'contractor'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-hct-blue border border-blue-200 dark:border-blue-900/50'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}>
                    {getNotifIcon(notif.type)}
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-base font-bold truncate ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500 text-white uppercase tracking-wider">
                          New
                        </span>
                      )}
                      {notif.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 uppercase tracking-wider">
                          High Priority
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {notif.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-400 font-semibold flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {notif.time}
                      </span>

                      {notif.link && (
                        <button
                          onClick={() => { markAsRead(notif.id); navigate(notif.link); }}
                          className="text-hct-blue hover:underline font-bold flex items-center gap-1"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notif.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Delete Notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
