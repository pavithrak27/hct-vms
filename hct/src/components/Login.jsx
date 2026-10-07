import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Network, AlertCircle, RefreshCw } from 'lucide-react';

const Login = () => {
  const { login, roles } = useRole();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('superadmin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Simulated Authentication States
  const [authState, setAuthState] = useState('idle'); // 'idle', 'saml_redirect', 'ad_mapping', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    let roleToLog = selectedRole;
    if (email) {
      const eLower = email.toLowerCase();
      if (eLower.includes('super')) roleToLog = 'superadmin';
      else if (eLower.includes('campus')) roleToLog = 'campusadmin';
      else if (eLower.includes('host')) roleToLog = 'host';
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
        else if (roleToLog === 'reception') navigate('/visitor');
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
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-hct-blue focus:border-hct-blue sm:text-sm font-medium" placeholder="name@hct.ac.ae" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-slate-700">Password</label>
                  <div className="mt-2">
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
    </div>
  );
};

export default Login;



