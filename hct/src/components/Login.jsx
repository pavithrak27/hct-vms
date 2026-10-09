import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Network, AlertCircle, RefreshCw, KeyRound, Send, CheckCircle2, X } from 'lucide-react';

const Login = () => {
  const { login, roles } = useRole();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('superadmin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Simulated Authentication States
  const [authState, setAuthState] = useState('idle'); // 'idle', 'saml_redirect', 'ad_mapping', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState('input'); // 'input', 'sent'

  const handleLogin = (e) => {
    e.preventDefault();
    
    let roleToLog = selectedRole;
    if (email) {
      const eLower = email.toLowerCase();
      if (eLower.includes('super')) roleToLog = 'superadmin';
      else if (eLower.includes('campus')) roleToLog = 'campusadmin';
      else if (eLower.includes('host') || eLower.includes('approver')) roleToLog = 'host';
      else if (eLower.includes('security')) roleToLog = 'security';
      else if (eLower.includes('reception')) roleToLog = 'reception';
      else if (eLower.includes('contractor')) roleToLog = 'contractor';
    }
    
    // Simulate AD / SAML Flow
    setAuthState('saml_redirect');
    
    setTimeout(() => {
      setAuthState('ad_mapping');
      
      setTimeout(() => {
        // Simulate an authorization error randomly (10% chance) for realism if not superadmin
        if (Math.random() < 0.1 && roleToLog !== 'superadmin' && roleToLog !== 'campusadmin') {
          setAuthState('error');
          setErrorMsg('Unauthorized Role. Your Active Directory group is not mapped to a Pro-Visit role. Please contact IT.');
          return;
        }
        
        login(roleToLog);
        
        // Redirect based on Role mapping
        if (roleToLog === 'superadmin') navigate('/');
        else if (roleToLog === 'campusadmin') navigate('/');
        else if (roleToLog === 'host') navigate('/');
        else if (roleToLog === 'security') navigate('/');
        else if (roleToLog === 'reception') navigate('/visitor-list');
        else if (roleToLog === 'contractor') navigate('/contractor');
        else navigate('/');

      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[480px] bg-hct-blue skew-y-3 transform -translate-y-24 z-0 rounded-b-[100px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center">
          <div className="bg-white/95 backdrop-blur px-8 py-4 rounded-3xl shadow-xl flex items-center justify-center border border-white/20 mb-4">
             <img src="/hct-logo.png" alt="HCT Logo" className="h-14 w-auto object-contain" />
          </div>
        </motion.div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white">

        </h2>
        <p className="mt-2 text-center text-sm text-blue-100 font-medium">
          HCT Enterprise Visitor Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white py-8 px-4 shadow-2xl rounded-[32px] sm:px-10 border border-slate-100">
          
          <AnimatePresence mode="wait">
            {authState === 'idle' || authState === 'error' ? (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={handleLogin}>
                
                {authState === 'error' && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold">{errorMsg}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700">Email Address</label>
                  <div className="mt-2">
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-hct-blue focus:border-hct-blue sm:text-sm font-medium" placeholder="name@hct.ac.ae or contractor@company.com" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-bold text-slate-700">Password</label>
                    <button 
                      type="button" 
                      onClick={() => { setForgotEmail(email || ''); setForgotStep('input'); setShowForgotPassword(true); }}
                      className="text-xs font-bold text-hct-blue hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="mt-1">
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-hct-blue focus:border-hct-blue sm:text-sm font-medium" placeholder="••••••••" />
                  </div>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500 font-medium">Or simulate SSO role</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-bold text-slate-700">
                    Authenticate as Role
                  </label>
                  <div className="mt-2">
                    <select
                      id="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-hct-blue focus:border-hct-blue sm:text-sm font-medium"
                    >
                      {roles.filter(r => !['visitor', 'reception'].includes(r.id)).map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
                  <strong>Notice:</strong> Clicking "Login via HCT SSO" will simulate the SAML assertion, Active Directory group mapping, and role provisioning flow.
                </div>

                <div>
                  <button type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-hct-blue hover:bg-hct-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hct-blue transition-colors">
                    Login via HCT SSO
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-hct-blue border-t-transparent animate-spin"></div>
                    <Network className="absolute inset-0 m-auto w-6 h-6 text-hct-blue" />
                 </div>
                 
                 <h3 className="text-xl font-bold text-slate-800 mb-2">Authenticating</h3>
                 
                 <div className="text-sm font-medium text-slate-500 flex items-center justify-center gap-2">
                   <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                   {authState === 'saml_redirect' && 'Connecting to HCT Identity Provider...'}
                   {authState === 'ad_mapping' && 'Mapping Active Directory Groups to RBAC...'}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowForgotPassword(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><X className="w-5 h-5"/></button>

              {forgotStep === 'input' && (
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-hct-blue rounded-2xl flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Reset Contractor / Profile Password</h3>
                  <p className="text-slate-500 text-sm mb-6">Enter your registered email address or Contractor ID. We will send a secure password reset link to your email.</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); if (forgotEmail) setForgotStep('sent'); }}>
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address / Contractor ID</label>
                      <input 
                        type="email" 
                        required 
                        value={forgotEmail} 
                        onChange={e => setForgotEmail(e.target.value)} 
                        placeholder="e.g. contractor@techsolutions.com" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none text-sm font-medium" 
                      />
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowForgotPassword(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
                      <button type="submit" className="flex-1 py-3 bg-hct-blue hover:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2">
                        Send Reset Link <Send className="w-4 h-4"/>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {forgotStep === 'sent' && (
                <div className="text-center py-2">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Reset Link Sent Successfully</h3>
                  <p className="text-slate-600 text-sm mb-6">
                    A password recovery link has been sent to <strong className="text-slate-800">{forgotEmail || 'your email'}</strong>. Please check your inbox or spam folder.
                  </p>
                  <button onClick={() => { setShowForgotPassword(false); setForgotStep('input'); }} className="w-full py-3 bg-hct-blue text-white font-bold rounded-xl text-sm shadow-md">
                    Return to Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;



