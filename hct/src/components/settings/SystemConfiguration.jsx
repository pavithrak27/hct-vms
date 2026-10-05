import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContractor } from '../../context/ContractorContext';
import { roles } from '../../context/RoleContext';

const ApprovalConfiguration = () => {
  const { approvalConfig, setApprovalConfig } = useContractor();
  const [tempConfig, setTempConfig] = useState(approvalConfig);
  const [testResult, setTestResult] = useState(null);

  const handleSave = () => {
    setApprovalConfig(tempConfig);
    setTestResult({ type: 'success', message: 'Approval configuration saved successfully.' });
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-hct-blue" /> Approval Configuration
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure the approval hierarchy and automation flows for reports and passes.</p>
        </div>
      </div>

      <div className="max-w-4xl">
        
        <AnimatePresence>
          {testResult && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <div className="p-4 rounded-xl flex items-start gap-3 font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5"/>
                <p>{testResult.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200">
            <div className="flex items-center gap-8 py-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-hct-blue">
                  <div className="w-2.5 h-2.5 bg-hct-blue rounded-full" />
                </div>
                <span className="font-bold text-slate-800">Configure Approval Flow</span>
              </label>
            </div>
            
            <div className="text-sm text-slate-500 mt-2 ml-8">Define sequential approval levels for requests.</div>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Approval Levels</h3>
            {tempConfig.mode === 'flow' && (
              <div className="space-y-6 relative before:absolute before:inset-y-4 before:left-[17px] before:w-px before:bg-slate-200">
                {tempConfig.levels.map((level, index) => (
                  <div key={level.id} className="relative flex items-center gap-6 group">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 text-slate-500 group-hover:bg-hct-blue group-hover:text-white flex items-center justify-center font-bold relative z-10 border-4 border-white transition-colors">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 max-w-md flex items-center gap-4">
                      <select 
                        value={level.role} 
                        onChange={(e) => {
                          const newLevels = [...tempConfig.levels];
                          newLevels[index].role = e.target.value;
                          setTempConfig({...tempConfig, levels: newLevels});
                        }}
                        className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-hct-blue bg-slate-50 hover:bg-white transition-colors font-medium text-slate-700"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.label}>{r.label}</option>
                        ))}
                      </select>
                      
                      <button onClick={() => {
                        const newLevels = tempConfig.levels.filter((_, i) => i !== index);
                        setTempConfig({...tempConfig, levels: newLevels});
                      }} className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div 
                  onClick={() => {
                    setTempConfig({...tempConfig, levels: [...(tempConfig.levels || []), { id: Date.now(), role: roles[0]?.label || 'Superadmin', note: '' }]})
                  }} 
                  className="relative flex items-center gap-6 pt-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center relative z-10 border-4 border-white group-hover:bg-hct-blue group-hover:text-white transition-colors shadow-sm">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-500 group-hover:text-hct-blue transition-colors">Add Approval Level</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button onClick={handleSave} className="px-8 py-3.5 bg-hct-blue hover:bg-blue-800 text-white flex items-center gap-2 rounded-xl font-bold shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5">
              <Save className="w-5 h-5" /> Save Configuration
            </button>
            <button onClick={() => setTempConfig(approvalConfig)} className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold shadow-sm transition-colors">
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApprovalConfiguration;
