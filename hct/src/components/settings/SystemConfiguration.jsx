import React, { useState } from 'react';
import { Sliders, Mail, MessageSquare, Network, Save, RefreshCw, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SystemConfiguration = () => {
  const [activeTab, setActiveTab] = useState('smtp');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { type: 'success' | 'error', message: string }

  const handleTest = (type) => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({ type: 'success', message: `${type} connection successful. Credentials validated.` });
      setTimeout(() => setTestResult(null), 5000);
    }, 2000);
  };

  const handleSyncAD = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({ type: 'success', message: `Active Directory Sync Complete. Total Users: 1,452 | New: 12 | Updated: 45` });
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Sliders className="w-8 h-8 text-indigo-500" /> System Configuration
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage global system protocols including SMTP Email, SMS Gateways, and AD Synchronization.</p>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-max mb-8">
        <button onClick={() => setActiveTab('smtp')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'smtp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Mail className="w-4 h-4"/> SMTP Email
        </button>
        <button onClick={() => setActiveTab('sms')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'sms' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <MessageSquare className="w-4 h-4"/> SMS Gateway
        </button>
        <button onClick={() => setActiveTab('ad')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'ad' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Network className="w-4 h-4"/> Active Directory
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 max-w-4xl">
        
        {/* Test Result Banner */}
        <AnimatePresence>
          {testResult && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <div className={`p-4 rounded-xl flex items-start gap-3 font-bold ${testResult.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {testResult.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5"/> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5"/>}
                <p>{testResult.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SMTP Configuration --- */}
        {activeTab === 'smtp' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">SMTP Settings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">SMTP Host *</label>
                <input type="text" defaultValue="smtp.office365.com" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Port *</label>
                  <input type="text" defaultValue="587" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Encryption</label>
                  <select className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400"><option>TLS</option><option>SSL</option><option>None</option></select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Username *</label>
                <input type="text" defaultValue="no-reply@hct.ac.ae" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} defaultValue="secret_password_123" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400 pr-10" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">From Name</label>
                <input type="text" defaultValue="Pro-Visit Notifications" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
              </div>
              <div className="flex items-center gap-3 h-full pt-6">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" id="enableSMTP" />
                <label htmlFor="enableSMTP" className="font-bold text-slate-700">Enable SMTP Notifications</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
              <button onClick={() => handleTest('SMTP')} disabled={isTesting} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>} Test Connection
              </button>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                <Save className="w-5 h-5"/> Save Configuration
              </button>
            </div>
          </motion.div>
        )}

        {/* --- SMS Gateway Configuration --- */}
        {activeTab === 'sms' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">SMS Gateway Settings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">SMS Provider</label>
                <select className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400"><option>Etisalat SMS Gateway</option><option>Twilio</option><option>Custom API</option></select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">API URL *</label>
                <input type="text" defaultValue="https://api.sms-provider.ae/v1/send" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">API Key *</label>
                <input type="password" defaultValue="************************" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sender ID *</label>
                <input type="text" defaultValue="HCT-VISIT" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" id="enableSMS" />
                <label htmlFor="enableSMS" className="font-bold text-slate-700">Enable SMS Gateway</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
              <button onClick={() => handleTest('SMS Gateway')} disabled={isTesting} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>} Test SMS
              </button>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                <Save className="w-5 h-5"/> Save Configuration
              </button>
            </div>
          </motion.div>
        )}

        {/* --- Active Directory Configuration --- */}
        {activeTab === 'ad' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Active Directory Sync</h3>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
               <p className="text-sm text-blue-800 font-medium">Automatic sync runs <strong>Daily at 02:00 AM</strong>. Map AD Groups to Pro-Visit roles in the Roles & Permissions module.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Domain Controller / Server URI *</label>
                <input type="text" defaultValue="ldaps://dc.hct.ac.ae:636" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Base DN *</label>
                <input type="text" defaultValue="DC=hct,DC=ac,DC=ae" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">User Search Base</label>
                <input type="text" defaultValue="OU=Users,OU=Staff,DC=hct,DC=ac,DC=ae" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bind Username *</label>
                <input type="text" defaultValue="CN=ADSync,OU=Services,DC=hct,DC=ac,DC=ae" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bind Password *</label>
                <input type="password" defaultValue="*****************" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-400" />
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" id="enableAD" />
                <label htmlFor="enableAD" className="font-bold text-slate-700">Enable Automatic Synchronization</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
              <button onClick={() => handleTest('Active Directory')} disabled={isTesting} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                Test Connection
              </button>
              <button onClick={handleSyncAD} disabled={isTesting} className="px-6 py-3 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>} Sync Now
              </button>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                <Save className="w-5 h-5"/> Save Configuration
              </button>
            </div>
          </motion.div>
        )}
      </div>

    </motion.div>
  );
};

export default SystemConfiguration;
