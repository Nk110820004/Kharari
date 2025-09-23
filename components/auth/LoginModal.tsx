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
              <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#4285F4" d="M533.5 278.4c0-18.4-1.7-36.2-5-53.3H272v100.9h146.9c-6.4 34.6-25.2 64-53.7 83.6v69.2h86.7c50.7-46.7 81.6-115.4 81.6-200.4z"/>
                <path fill="#34A853" d="M272 544.3c72.9 0 134.1-24.1 178.8-65.4l-86.7-69.2c-24.1 16.2-55 25.8-92.1 25.8-70.7 0-130.6-47.7-152-111.7H32.5v70.2c44.5 88.3 135.6 150.3 239.5 150.3z"/>
                <path fill="#FBBC05" d="M120 323.8c-10.4-30.9-10.4-64.2 0-95.2V158.4H32.5c-46.8 93.6-46.8 205.8 0 299.4l87.5-134z"/>
                <path fill="#EA4335" d="M272 107.7c39.6-.6 77.8 14.5 106.9 42.6l80.1-80.1C424 24.2 351.1-1.1 272 0 168.1 0 77 62 32.5 150.3l87.5 70.2C141.4 156.5 201.3 108.7 272 107.7z"/>
              </svg>
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
