import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, ShieldCheck, Plus, Trash2, Briefcase, Shield, AlertTriangle, Calendar, X, Users, Video, UploadCloud, FileText, Play, CheckSquare, Eye, Lock, FileCheck, Check, Film, Mail, Send, Server, EyeOff, RefreshCw } from 'lucide-react';
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
  
  // HSE Configuration State
  const [hseConfig, setHseConfig] = useState({
    videoName: 'HCT_Mandatory_Safety_Induction_2026.mp4',
    videoSize: '24.5 MB',
    videoDuration: '03:45 mins',
    uploadDate: '2026-10-05',
    requireFullWatch: true,
    requireAnnualReinduction: true,
    declarationText: 'I hereby confirm that all employees included in this pass request are authorized to work under the registered contractor company. I confirm that the information provided is accurate and that all employees will comply with the applicable site safety, security, and HSE requirements.',
    requireSignature: true,
    requireCheckbox: true,
    policyDocName: 'HCT_HSE_Policy_Guidelines_2026.pdf',
    policyDocSize: '1.4 MB'
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // SMTP Configuration State
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.hct.ac.ae',
    port: '587',
    encryption: 'TLS', // 'TLS', 'SSL', 'NONE'
    requireAuth: true,
    username: 'notifications@hct.ac.ae',
    password: '••••••••••••••••',
    senderName: 'HCT Visitor & Contractor Gateway',
    senderEmail: 'no-reply@hct.ac.ae',
    replyTo: 'support@hct.ac.ae',
    ccAdmin: true,
    testRecipient: 'admin@hct.ac.ae'
  });

  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  const [flows, setFlows] = useState([
    { id: 'contractor', label: 'Contractor Approval', icon: Briefcase },
    { id: 'hse', label: 'HSE Video & Acknowledgment', icon: Video },
    { id: 'smtp', label: 'SMTP Email Configuration', icon: Mail },
    { id: 'restriction', label: 'Document Expiry', icon: Shield },
    { id: 'blocked', label: 'Blocked Visitor', icon: AlertTriangle },
    { id: 'visitor', label: 'Visitor Workflow', icon: Users }
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

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingVideo(true);
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploadingVideo(false);
            setHseConfig(prevConfig => ({
              ...prevConfig,
              videoName: file.name,
              videoSize: (file.size / 1024 / 1024).toFixed(1) + ' MB',
              uploadDate: new Date().toISOString().split('T')[0]
            }));
            setTestResult({ type: 'success', message: `HSE Safety Video "${file.name}" uploaded successfully.` });
            setTimeout(() => setTestResult(null), 3500);
            return 100;
          }
          return prev + 30;
        });
      }, 400);
    }
  };

  const handlePolicyDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHseConfig(prev => ({
        ...prev,
        policyDocName: file.name,
        policyDocSize: (file.size / 1024 / 1024).toFixed(1) + ' MB'
      }));
      setTestResult({ type: 'success', message: `HSE Policy Document "${file.name}" attached successfully.` });
      setTimeout(() => setTestResult(null), 3500);
    }
  };

  const handleTestSmtp = () => {
    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.testRecipient) {
      alert("Host, Port, and Test Recipient Email are required to test connection.");
      return;
    }
    setIsTestingSmtp(true);
    setTimeout(() => {
      setIsTestingSmtp(false);
      setTestResult({
        type: 'success',
        message: `SMTP Test Email sent successfully to ${smtpConfig.testRecipient} via ${smtpConfig.host}:${smtpConfig.port} (${smtpConfig.encryption}).`
      });
      setTimeout(() => setTestResult(null), 5000);
    }, 1800);
  };

  const handleSave = () => {
    if (activeFlow === 'hse') {
      setTestResult({ type: 'success', message: 'HSE Safety Video & Acknowledgment Configuration saved successfully.' });
      setTimeout(() => setTestResult(null), 3500);
      return;
    }

    if (activeFlow === 'smtp') {
      setTestResult({ type: 'success', message: `SMTP Configuration (${smtpConfig.host}:${smtpConfig.port}) saved successfully.` });
      setTimeout(() => setTestResult(null), 3500);
      return;
    }

    setApprovalConfig(prev => ({
      ...prev,
      [activeFlow]: tempConfig
    }));
    const flowLabel = flows.find(f => f.id === activeFlow)?.label || 'Flow';
    setTestResult({ type: 'success', message: `${flowLabel} configuration saved successfully.` });
    setTimeout(() => setTestResult(null), 3500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-hct-blue" /> System & Approval Configuration
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure approval hierarchy, HSE video inductions, SMTP email settings, and system parameters.</p>
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
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                   <Sliders className="w-5 h-5 text-hct-blue" /> Configure Process & System Settings
                </span>
                <p className="text-sm text-slate-500 mt-1">Choose which process flow, HSE induction rules, or SMTP gateway configuration you are setting up.</p>
              </div>
              
              <div className="flex gap-6 border-b-2 border-slate-100 dark:border-slate-800 w-full overflow-x-auto hide-scrollbar items-center px-4 pt-2">
                {flows.map((flow) => {
                  const Icon = flow.icon;
                  return (
                  <button
                    key={flow.id}
                    onClick={() => setActiveFlow(flow.id)}
                    className={`relative py-4 text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      activeFlow === flow.id 
                        ? 'text-hct-blue' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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

          {/* HSE VIDEO & ACKNOWLEDGMENT CONFIGURATION TAB */}
          {activeFlow === 'hse' ? (
            <div className="space-y-8 animate-in fade-in">
              {/* Card 1: HSE Video Upload & Management */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Video className="w-6 h-6 text-hct-blue"/> HSE Safety Video Induction Management
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Upload and enforce the mandatory HSE safety video contractors must view before gate pass issuance.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200">
                    Active Video Enforced
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Active Video Details & Uploader */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-hct-blue rounded-xl flex items-center justify-center shrink-0">
                          <Film className="w-6 h-6"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 dark:text-white text-base truncate">{hseConfig.videoName}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">File Size: {hseConfig.videoSize} • Duration: {hseConfig.videoDuration} • Uploaded: {hseConfig.uploadDate}</p>
                        </div>
                      </div>

                      {/* Upload Video Trigger */}
                      <div className="pt-2">
                        <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-5 hover:border-hct-blue hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all text-center">
                          <UploadCloud className="w-8 h-8 text-hct-blue mb-2" />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Click to Upload New HSE Video</span>
                          <span className="text-xs text-slate-400 mt-1">Supported formats: MP4, WEBM, MOV (Max size: 100 MB)</span>
                          <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} className="hidden" />
                        </label>
                        {isUploadingVideo && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                              <span>Uploading Video...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div className="bg-hct-blue h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Simulated Video Preview Player */}
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-3">Live Video Induction Preview</h4>
                    <div className="bg-slate-900 rounded-2xl h-72 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner border border-slate-800">
                      {isPlayingPreview ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                          <div className="w-16 h-16 rounded-full bg-hct-blue/20 text-hct-blue flex items-center justify-center mb-4 animate-pulse">
                            <Film className="w-8 h-8"/>
                          </div>
                          <p className="font-bold text-lg text-white mb-1">Playing HSE Safety Induction</p>
                          <p className="text-xs text-slate-400 mb-6">{hseConfig.videoName} • 01:15 / {hseConfig.videoDuration}</p>
                          <button onClick={() => setIsPlayingPreview(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors">
                            Pause Preview
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center p-6">
                          <div className="w-16 h-16 rounded-full bg-hct-blue text-white flex items-center justify-center mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsPlayingPreview(true)}>
                            <Play className="w-8 h-8 ml-1"/>
                          </div>
                          <p className="font-bold text-base text-white">{hseConfig.videoName}</p>
                          <p className="text-xs text-slate-400 mt-1">Click to play safety induction preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Acknowledgment & Declaration Configuration */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-hct-blue"/> HSE Acknowledgment & Declaration Configuration
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">Customize the safety declaration prompt text and policy document attachments.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                      Mandatory Declaration Text *
                    </label>
                    <textarea 
                      rows={4} 
                      value={hseConfig.declarationText} 
                      onChange={(e) => setHseConfig({...hseConfig, declarationText: e.target.value})} 
                      className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-hct-blue shrink-0"/>
                        Attached HSE Policy PDF Document
                      </h4>
                      <span className="text-xs text-slate-500">PDF Format • Max 25 MB</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1 w-full flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-hct-blue flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5"/>
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{hseConfig.policyDocName}</p>
                            <p className="text-[10px] text-slate-400">{hseConfig.policyDocSize} • Active Attached Document</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Attached</span>
                      </div>

                      <label className="w-full md:w-auto shrink-0 cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-dashed border-hct-blue bg-blue-50/70 dark:bg-slate-800 hover:bg-blue-100/70 transition-colors text-hct-blue font-bold text-xs shadow-sm">
                        <UploadCloud className="w-4 h-4" />
                        Upload Document
                        <input type="file" accept=".pdf" onChange={handlePolicyDocUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button onClick={handleSave} className="px-8 py-3.5 bg-hct-blue hover:bg-blue-800 text-white flex items-center gap-2 rounded-xl font-bold shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5">
                  <Save className="w-5 h-5" /> Save HSE Configuration
                </button>
              </div>
            </div>
          ) : activeFlow === 'smtp' ? (
            <div className="space-y-8 animate-in fade-in">
              {/* Card 1: SMTP Server Settings */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Mail className="w-6 h-6 text-hct-blue"/> SMTP Server Gateway Settings (FR-CFG-02)
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Configure outgoing SMTP server details for sending visitor pass QR codes, contractor approval links, and system notifications.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200">
                    SMTP Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                      SMTP Host Server *
                    </label>
                    <input
                      type="text"
                      value={smtpConfig.host}
                      onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                      placeholder="e.g. smtp.hct.ac.ae or smtp.office365.com"
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                      SMTP Port *
                    </label>
                    <input
                      type="text"
                      value={smtpConfig.port}
                      onChange={(e) => setSmtpConfig({...smtpConfig, port: e.target.value})}
                      placeholder="e.g. 587, 465, 25"
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                      Encryption Protocol *
                    </label>
                    <select
                      value={smtpConfig.encryption}
                      onChange={(e) => setSmtpConfig({...smtpConfig, encryption: e.target.value})}
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm outline-none focus:ring-2 focus:ring-hct-blue cursor-pointer"
                    >
                      <option value="TLS">TLS / STARTTLS (Port 587 - Recommended)</option>
                      <option value="SSL">SSL (Port 465)</option>
                      <option value="NONE">None (Port 25 - Unencrypted)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smtpConfig.requireAuth}
                        onChange={(e) => setSmtpConfig({...smtpConfig, requireAuth: e.target.checked})}
                        className="w-5 h-5 text-hct-blue rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        Require SMTP Authentication
                      </span>
                    </label>
                  </div>

                  {smtpConfig.requireAuth && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                          SMTP Username / Email *
                        </label>
                        <input
                          type="text"
                          value={smtpConfig.username}
                          onChange={(e) => setSmtpConfig({...smtpConfig, username: e.target.value})}
                          placeholder="notifications@hct.ac.ae"
                          className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                          SMTP Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showSmtpPassword ? "text" : "password"}
                            value={smtpConfig.password}
                            onChange={(e) => setSmtpConfig({...smtpConfig, password: e.target.value})}
                            className="w-full p-3.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                          >
                            {showSmtpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Card 2: Sender Identity */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Send className="w-6 h-6 text-hct-blue"/> Sender Identity & Email Options
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">Configure default display name and sender email address shown to recipients.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                      Sender Display Name *
                    </label>
                    <input
                      type="text"
                      value={smtpConfig.senderName}
                      onChange={(e) => setSmtpConfig({...smtpConfig, senderName: e.target.value})}
                      placeholder="HCT Visitor & Contractor Gateway"
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                      From Email Address *
                    </label>
                    <input
                      type="email"
                      value={smtpConfig.senderEmail}
                      onChange={(e) => setSmtpConfig({...smtpConfig, senderEmail: e.target.value})}
                      placeholder="no-reply@hct.ac.ae"
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                      Reply-To Address
                    </label>
                    <input
                      type="email"
                      value={smtpConfig.replyTo}
                      onChange={(e) => setSmtpConfig({...smtpConfig, replyTo: e.target.value})}
                      placeholder="support@hct.ac.ae"
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smtpConfig.ccAdmin}
                        onChange={(e) => setSmtpConfig({...smtpConfig, ccAdmin: e.target.checked})}
                        className="w-5 h-5 text-hct-blue rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        BCC Security Admin on High-Priority Access Alerts
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 3: SMTP Test Connection */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Server className="w-6 h-6 text-hct-blue"/> SMTP Test & Connection Diagnostic
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">Send a test email to verify host handshake, port connectivity, and authentication credentials.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <input
                      type="email"
                      value={smtpConfig.testRecipient}
                      onChange={(e) => setSmtpConfig({...smtpConfig, testRecipient: e.target.value})}
                      placeholder="Enter recipient email for test message..."
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-sm outline-none focus:ring-2 focus:ring-hct-blue"
                    />
                  </div>

                  <button
                    onClick={handleTestSmtp}
                    disabled={isTestingSmtp}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isTestingSmtp ? <RefreshCw className="w-4 h-4 animate-spin text-hct-blue"/> : <Send className="w-4 h-4 text-hct-blue"/>}
                    Send Test Email
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button onClick={handleSave} className="px-8 py-3.5 bg-hct-blue hover:bg-blue-800 text-white flex items-center gap-2 rounded-xl font-bold shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5">
                  <Save className="w-5 h-5" /> Save SMTP Configuration
                </button>
              </div>
            </div>
          ) : (
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
          )}

          {tempConfig && activeFlow !== 'hse' && activeFlow !== 'smtp' && (
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
