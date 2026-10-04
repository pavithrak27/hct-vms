import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Link as LinkIcon, Save, RefreshCw, Network, Lock, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

const SSOConfiguration = () => {
  const [isTesting, setIsTesting] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <KeyRound className="w-8 h-8 text-indigo-500" /> Authentication & Identity
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure SAML/SSO integration with HCT Active Directory for seamless role-based logins.</p>
        </div>
        <button onClick={() => alert('SSO Configuration saved to Audit Log.')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-md">
          <Save className="w-5 h-5"/> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Settings Form */}
        <div className="xl:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Network className="w-5 h-5 text-indigo-500"/> Identity Provider (IdP) Settings</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500">Enable SSO</span>
                <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer shadow-inner">
                   <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Entity ID / Issuer URL *</label>
                <input type="text" defaultValue="https://sts.windows.net/hct-tenant-id/" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-mono text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Single Sign-On (SSO) Service URL *</label>
                <input type="text" defaultValue="https://login.microsoftonline.com/hct-tenant/saml2" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-mono text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Single Logout (SLO) Service URL</label>
                <input type="text" defaultValue="https://login.microsoftonline.com/hct-tenant/saml2/logout" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-mono text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6"><Lock className="w-5 h-5 text-indigo-500"/> X.509 Certificate</h3>
             <div className="mb-4">
               <label className="block text-sm font-bold text-slate-700 mb-1">Public Certificate (Base64) *</label>
               <textarea rows="5" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-mono text-xs bg-slate-50 text-slate-600" defaultValue="-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIQY29... (Masked for Security) ...HctQ==
-----END CERTIFICATE-----"></textarea>
             </div>
             <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-amber-500"/> Ensure the certificate matches the identity provider metadata to prevent signature validation failures.</p>
          </div>

        </div>

        {/* Sidebar Info & Mapping */}
        <div className="space-y-8">
           
           <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg text-white">
             <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><LinkIcon className="w-5 h-5 text-indigo-400"/> Pro-Visit SP Details</h3>
             <p className="text-sm text-slate-400 mb-4">Provide these endpoints to your Identity Provider (Azure AD / ADFS) administrator.</p>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-1">Assertion Consumer Service (ACS) URL</label>
                 <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 font-mono text-xs text-indigo-200 break-all select-all">
                   https://provisit.hct.ac.ae/api/auth/saml/acs
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-1">SP Entity ID</label>
                 <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 font-mono text-xs text-indigo-200 break-all select-all">
                   https://provisit.hct.ac.ae/saml/metadata
                 </div>
               </div>
             </div>

             <button className="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2">
               <FileCode className="w-4 h-4"/> Download SP Metadata XML
             </button>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">Attribute Mapping</h3>
             <p className="text-xs font-medium text-slate-500 mb-4">Map incoming SAML claims to Pro-Visit user profile fields.</p>

             <div className="space-y-3">
               <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Email Address Claim</label>
                 <input type="text" defaultValue="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress" className="w-full p-2 rounded-lg border border-slate-300 font-mono text-[10px]" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Display Name Claim</label>
                 <input type="text" defaultValue="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" className="w-full p-2 rounded-lg border border-slate-300 font-mono text-[10px]" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Group/Role Claim</label>
                 <input type="text" defaultValue="http://schemas.microsoft.com/ws/2008/06/identity/claims/role" className="w-full p-2 rounded-lg border border-slate-300 font-mono text-[10px]" />
               </div>
             </div>
           </div>

           <button 
             onClick={() => { setIsTesting(true); setTimeout(() => setIsTesting(false), 2000); }} 
             className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex justify-center items-center gap-2 transition-colors border border-slate-200"
           >
             <RefreshCw className={`w-5 h-5 ${isTesting ? 'animate-spin text-indigo-500' : ''}`}/> Test Identity Provider Connection
           </button>

        </div>

      </div>
    </motion.div>
  );
};

export default SSOConfiguration;
