import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, ShieldCheck, Plus, Trash2, Briefcase, Shield, AlertTriangle, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContractor } from '../../context/ContractorContext';
import { roles } from '../../context/RoleContext';

const ApprovalConfiguration = () => {
  const { approvalConfig, setApprovalConfig } = useContractor();
  const [activeFlow, setActiveFlow] = useState('contractor');
  const [tempConfig, setTempConfig] = useState(approvalConfig[activeFlow] || null);
  const [testResult, setTestResult] = useState(null);
  const [isAddingFlow, setIsAddingFlow] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  
  const [flows, setFlows] = useState([
    { id: 'contractor', label: 'Contractor Approval', icon: Briefcase },
    { id: 'restriction', label: 'Restriction Flow', icon: Shield },
    { id: 'blocked', label: 'Blocked Visitor', icon: AlertTriangle }
  ]);

  useEffect(() => {
    setTempConfig(approvalConfig[activeFlow] || null);
  }, [activeFlow, approvalConfig]);

  const submitNewFlow = () => {
    if (newFlowName && newFlowName.trim()) {
      const newId = newFlowName.trim().toLowerCase().replace(/\s+/g, '-');
      if (!flows.some(f => f.id === newId)) {
        setFlows([...flows, { id: newId, label: newFlowName.trim(), icon: ShieldCheck }]);
        setActiveFlow(newId);
      }
    }
    setIsAddingFlow(false);
    setNewFlowName('');
  };

  const handleSave = () => {
    setApprovalConfig(prev => ({
      ...prev,
      [activeFlow]: tempConfig
    }));
    const flowLabel = flows.find(f => f.id === activeFlow)?.label || 'Flow';
    setTestResult({ type: 'success', message: `${flowLabel} configuration saved successfully.` });
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

      <div className="w-full">
        
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
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Sliders className="w-5 h-5 text-hct-blue" /> Configure Approval Flow
                </span>
                <p className="text-sm text-slate-500 mt-1">Choose which process you are configuring the approval hierarchy for.</p>
              </div>
              
              <div className="flex gap-6 border-b-2 border-slate-100 w-full overflow-x-auto hide-scrollbar items-center px-4 pt-2">
                {flows.map((flow) => {
                  const Icon = flow.icon;
                  return (
                  <button
                    key={flow.id}
                    onClick={() => setActiveFlow(flow.id)}
                    className={`relative py-4 text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      activeFlow === flow.id 
                        ? 'text-hct-blue' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {activeFlow === flow.id && (
                      <motion.div
                        layoutId="activeFlowUnderline"
                        className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-hct-blue rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.3)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                       <Icon className={`w-5 h-5 ${activeFlow === flow.id ? 'text-hct-blue' : 'text-slate-400'}`} />
                       {flow.label}
                    </span>
                  </button>
                )})}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Approval Levels</h3>
            {!tempConfig ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                  <Sliders className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Not Configured</h4>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">This flow does not have an approval configuration yet. Initialize it to start adding approval levels.</p>
                <button 
                  onClick={() => setTempConfig({ mode: 'flow', levels: [] })} 
                  className="px-6 py-2.5 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Initialize Configuration
                </button>
              </div>
            ) : tempConfig.mode === 'flow' && (
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

          {tempConfig && (
            <div className="flex items-center gap-4 pt-4">
              <button onClick={handleSave} className="px-8 py-3.5 bg-hct-blue hover:bg-blue-800 text-white flex items-center gap-2 rounded-xl font-bold shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5">
                <Save className="w-5 h-5" /> Save Configuration
              </button>
              <button onClick={() => setTempConfig(approvalConfig[activeFlow] || null)} className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold shadow-sm transition-colors">
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Custom Flow Modal */}
      <AnimatePresence>
        {isAddingFlow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-hct-blue rounded-xl">
                    <Plus className="w-6 h-6" />
                  </div>
                  Add Custom Flow
                </h3>
                <button onClick={() => setIsAddingFlow(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">Flow Name</label>
                <input 
                  type="text" 
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitNewFlow()}
                  placeholder="e.g. Vendor Access Flow"
                  className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-hct-blue outline-none text-slate-800 font-medium transition-colors"
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsAddingFlow(false)}
                  className="flex-1 py-3.5 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitNewFlow}
                  className="flex-1 py-3.5 bg-hct-blue hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  Create Flow
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApprovalConfiguration;
