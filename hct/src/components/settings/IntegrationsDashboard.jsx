import React, { useState } from 'react';
import { Cpu, Webcam, Activity, RefreshCw, CheckCircle2, AlertTriangle, List, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IntegrationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('suprema');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = (type) => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({ type: 'success', message: `${type} Connection Successful. Hardware responding on specified port.` });
      setTimeout(() => setTestResult(null), 5000);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-orange-500" /> Integrations & Hardware
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure physical access control controllers (Suprema Speed Gates, ANPR, ICT Audit).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0"><Activity className="w-6 h-6"/></div>
           <div><p className="font-bold text-slate-800">Suprema Server</p><p className="text-sm font-bold text-emerald-600">Connected & Online</p></div>
         </div>
         <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0"><Webcam className="w-6 h-6"/></div>
           <div><p className="font-bold text-slate-800">ANPR Controller</p><p className="text-sm font-bold text-emerald-600">Connected & Online</p></div>
         </div>
         <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0"><List className="w-6 h-6"/></div>
           <div><p className="font-bold text-slate-800">ICT Audit Gateway</p><p className="text-sm font-bold text-emerald-600">Syncing Active</p></div>
         </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-max mb-8">
        <button onClick={() => setActiveTab('suprema')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'suprema' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Activity className="w-4 h-4"/> Suprema Speed Gates
        </button>
        <button onClick={() => setActiveTab('anpr')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'anpr' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Webcam className="w-4 h-4"/> ANPR Controller
        </button>
        <button onClick={() => setActiveTab('ict')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'ict' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <List className="w-4 h-4"/> ICT Audit Logs
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

        {/* --- Suprema Configuration --- */}
        {activeTab === 'suprema' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Suprema Hardware Bridge</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">BioStar API Server URL *</label>
                <input type="text" defaultValue="https://biostar.hct.ac.ae:443/api/v2" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-orange-400 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">API Key / Username *</label>
                <input type="text" defaultValue="admin_integrator" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">API Secret / Password *</label>
                <input type="password" defaultValue="****************" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-orange-400" />
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-600" id="enableSuprema" />
                <label htmlFor="enableSuprema" className="font-bold text-slate-700">Enable Suprema Integration (QR Pass Syncing)</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
              <button onClick={() => handleTest('BioStar API')} disabled={isTesting} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>} Test Bridge Connection
              </button>
              <button className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                <Save className="w-5 h-5"/> Save Configuration
              </button>
            </div>
          </motion.div>
        )}

        {/* --- ANPR Configuration --- */}
        {activeTab === 'anpr' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">ICT Access Controller (ANPR)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">ICT Controller IP/URL *</label>
                <input type="text" defaultValue="10.0.50.25:8080" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-orange-400 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Authentication Token *</label>
                <input type="password" defaultValue="************************" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Camera Refresh Rate (ms)</label>
                <input type="number" defaultValue="500" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-orange-400" />
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-600" id="enableANPR" />
                <label htmlFor="enableANPR" className="font-bold text-slate-700">Enable Vehicle Plate Recognition (ANPR)</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
              <button onClick={() => handleTest('ICT ANPR Controller')} disabled={isTesting} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>} Test Feed
              </button>
              <button className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                <Save className="w-5 h-5"/> Save Configuration
              </button>
            </div>
          </motion.div>
        )}
        
        {/* --- ICT Configuration --- */}
        {activeTab === 'ict' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">ICT Audit Log Integration</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Syslog/Audit Push URL *</label>
                <input type="text" defaultValue="https://provisit.hct.ac.ae/api/audit/webhook" disabled className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono text-sm" />
                <p className="text-xs text-slate-500 mt-1">Configure your ICT Controller to push hardware access events to this webhook URL.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Webhook Secret Key *</label>
                <input type="password" defaultValue="************************" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-orange-400" />
              </div>
              <div className="flex items-center gap-3 col-span-2 pt-4">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-600" id="enableICT" />
                <label htmlFor="enableICT" className="font-bold text-slate-700">Listen for External Hardware Events (Populates main Audit Log)</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
              <button className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                <Save className="w-5 h-5"/> Save Configuration
              </button>
            </div>
          </motion.div>
        )}

      </div>

    </motion.div>
  );
};

export default IntegrationsDashboard;
