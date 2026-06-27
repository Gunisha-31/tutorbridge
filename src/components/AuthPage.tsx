import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  BookOpen, 
  Sparkles, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

type TabType = 'signin' | 'signup';

export default function AuthPage({ onLoginSuccess, onBackToLanding }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('signin');
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpSubject, setSignUpSubject] = useState('Mathematics');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpSuccess('');
    
    if (username.trim() === 'user' && password.trim() === 'user') {
      setLoginError('');
      onLoginSuccess();
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setSignUpError('Please fill in all required fields.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    // Success action
    setSignUpSuccess('Account created! Please sign in.');
    
    // Clear sign up form
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');
    
    // Switch to Sign In tab
    setActiveTab('signin');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/60 via-slate-50 to-teal-50/40 min-h-screen flex flex-col justify-center items-center font-sans p-6 relative overflow-hidden select-none">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-200/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-teal-200/30 blur-[100px] pointer-events-none" />

      {/* Back Button */}
      <button 
        onClick={onBackToLanding}
        className="absolute top-6 left-6 text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 text-xs font-semibold bg-white/80 border border-slate-100 px-3.5 py-2 rounded-xl shadow-sm hover:shadow backdrop-blur-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </button>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* TutorBridge Logo Header */}
        <div className="text-center mb-8 cursor-pointer" onClick={onBackToLanding}>
          <div className="inline-flex bg-gradient-to-tr from-indigo-600 to-teal-500 p-3 rounded-2xl text-white shadow-md shadow-indigo-100 mb-4 transition-transform hover:scale-105">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">
            Tutor<span className="text-indigo-600">Bridge</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1 font-semibold">
            Bridging Education & AI
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-950/5 overflow-hidden">
          
          {/* Two-Tab Selector */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => {
                setActiveTab('signin');
                setLoginError('');
                setSignUpError('');
              }}
              className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'signin'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setLoginError('');
                setSignUpError('');
                setSignUpSuccess('');
              }}
              className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'signup'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content Padding */}
          <div className="p-8">
            
            {/* SUCCESS BANNER (FROM SIGNUP TRANSITION) */}
            {signUpSuccess && activeTab === 'signin' && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-2xl p-4 mb-6 flex items-start gap-2.5 animate-fade-in font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-950">Success!</p>
                  <p className="text-[11px] text-emerald-700/90 mt-0.5">{signUpSuccess}</p>
                </div>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Welcome Back</h3>
                  <p className="text-slate-400 text-xs mt-1">Access your personalized tutor dashboard and seed data.</p>
                </div>

                {/* Inline Error */}
                {loginError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-2xl p-3.5 flex items-center gap-2.5 font-medium animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Username</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="user"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setLoginError('');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setLoginError('');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign In
                  </button>
                </form>

                {/* Helper Line */}
                <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-3.5 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">
                    Demo login — username: <span className="font-bold text-indigo-700">user</span> · password: <span className="font-bold text-indigo-700">user</span>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: SIGN UP */}
            {activeTab === 'signup' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Create Account</h3>
                  <p className="text-slate-400 text-xs mt-1">Sign up to explore custom workspace capabilities.</p>
                </div>

                {/* Inline Error */}
                {signUpError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-2xl p-3.5 flex items-center gap-2.5 font-medium animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ananya Rao"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="ananya@tutorbridge.app"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subjects Taught</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={signUpSubject}
                        onChange={(e) => setSignUpSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="Mathematics, Physics, Chemistry">Mathematics, Physics, Chemistry</option>
                        <option value="Mathematics, Science">Mathematics, Science</option>
                        <option value="Only Mathematics">Only Mathematics</option>
                        <option value="Languages & Literature">Languages & Literature</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
