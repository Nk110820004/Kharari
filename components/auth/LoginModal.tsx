import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import CountryCodeSelector from './CountryCodeSelector';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 w-full max-w-md m-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-neutral-400 mb-6">
              {authMode === 'signup' ? 'Start your personalized learning journey.' : 'Sign in to continue your journey.'}
            </p>
            
            <button
              onClick={onSuccess}
              className="w-full bg-white text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.87 1.62-4.7 0-8.48-3.78-8.48-8.48s3.78-8.48 8.48-8.48c2.69 0 4.38 1.02 5.39 1.98l2.6-2.58C18.94 1.22 16.27 0 12.48 0 5.88 0 .04 5.88.04 12.48s5.84 12.48 12.44 12.48c3.41 0 6.08-1.16 8.16-3.25 2.16-2.16 2.82-5.21 2.82-8.16v-1.62h-11z"/></svg>
              Continue with Google
            </button>

            <div className="my-5 flex items-center">
                <div className="flex-grow border-t border-neutral-700"></div>
                <span className="mx-4 text-neutral-500 text-sm">OR</span>
                <div className="flex-grow border-t border-neutral-700"></div>
            </div>
            
            {authMode === 'signup' && (
              <div className="bg-neutral-800 p-1 rounded-lg flex items-center justify-center gap-2 mb-6">
                   <button onClick={() => setActiveTab('email')} className={cn("w-full py-2 rounded-md text-sm font-medium transition-colors", activeTab === 'email' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-700/50')}>
                      <Mail size={16} className="inline mr-2"/> Email
                  </button>
                   <button onClick={() => setActiveTab('phone')} className={cn("w-full py-2 rounded-md text-sm font-medium transition-colors", activeTab === 'phone' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-700/50')}>
                      <Phone size={16} className="inline mr-2"/> Phone
                  </button>
              </div>
            )}


            {activeTab === 'email' && (
                <form onSubmit={(e) => { e.preventDefault(); onSuccess(); }} className="space-y-4">
                    {authMode === 'signup' && (
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                        <input type="text" placeholder="Username" className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                      </div>
                    )}
                    <div className="relative">
                       <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                       <input type="email" placeholder="you@example.com" className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                    </div>
                     <div className="relative">
                       <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                       <input type="password" placeholder="Password" className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                    </div>
                    {authMode === 'signup' && (
                       <div className="flex gap-2 mt-4">
                        <CountryCodeSelector />
                        <input type="tel" placeholder="Phone number" className="flex-grow w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                      </div>
                    )}
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      {authMode === 'signup' ? 'Create Account' : 'Login'}
                    </button>
                </form>
            )}

            {activeTab === 'phone' && authMode === 'signup' && (
                <form onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                      <input type="text" placeholder="Username" className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <CountryCodeSelector />
                        <input type="tel" placeholder="Phone number" className="flex-grow w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">Create Account</button>
                </form>
            )}

            <p className="text-center text-sm text-neutral-400 mt-6">
              {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="font-semibold text-blue-400 hover:underline">
                {authMode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;