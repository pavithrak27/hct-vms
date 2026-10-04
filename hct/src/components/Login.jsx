import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Network, AlertCircle, RefreshCw } from 'lucide-react';

const Login = () => {
  const { login, roles } = useRole();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('superadmin');
  
  // Simulated Authentication States
  const [authState, setAuthState] = useState('idle'); // 'idle', 'saml_redirect', 'ad_mapping', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulate AD / SAML Flow
    setAuthState('saml_redirect');
    
    setTimeout(() => {
      setAuthState('ad_mapping');
      
      setTimeout(() => {
        // Simulate an authorization error randomly (10% chance) for realism if not superadmin
        if (Math.random() < 0.1 && selectedRole !== 'superadmin') {
          setAuthState('error');
          setErrorMsg('Unauthorized Role. Your Active Directory group is not mapped to a Pro-Visit role. Please contact IT.');
          return;
        }
        
        login(selectedRole);
        
        // Redirect based on Role mapping
        if (selectedRole === 'superadmin') navigate('/');
        else if (selectedRole === 'campusadmin') navigate('/');
        else if (selectedRole === 'host') navigate('/host');
        else if (selectedRole === 'security') navigate('/check-in-out');
        else if (selectedRole === 'reception') navigate('/visitors');
        else if (selectedRole === 'contractor') navigate('/contractor');
        else navigate('/');

      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-hct-blue skew-y-3 transform -translate-y-24 z-0 rounded-b-[100px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4">
             <ShieldCheck className="w-8 h-8 text-hct-blue" />
          </div>
        </motion.div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
          Pro-Visit VMS
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
                  <label htmlFor="role" className="block text-sm font-bold text-slate-700">
                    Authenticate as Role (Simulated SSO)
                  </label>
                  <div className="mt-2">
                    <select
                      id="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-hct-blue focus:border-hct-blue sm:text-sm font-medium"
                    >
                      {roles.map(r => (
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
