import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  LogOut, 
  GraduationCap 
} from 'lucide-react';
import { Tutor } from '../types';

export type SidebarTab = 'dashboard' | 'students' | 'analytics' | 'tools' | 'reports' | 'mentor' | 'pricing';

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  tutor: Tutor;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, tutor, onLogout }: SidebarProps) {
  const menuItems: { id: SidebarTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'tools', label: 'AI Teaching Tools', icon: Sparkles, badge: 'AI' },
    { id: 'reports', label: 'Parent Reports', icon: FileText },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare, badge: 'New' },
    { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-150 flex flex-col justify-between text-slate-800 select-none">
      
      {/* Brand Logo & Plan */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center space-x-3 mb-5">
          <div className="bg-gradient-to-tr from-indigo-600 to-teal-500 p-2.5 rounded-xl text-white shadow-sm shadow-indigo-100">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 font-display">Tutor<span className="text-indigo-600">Bridge</span></span>
            <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase font-semibold">Bridging Edu & AI</p>
          </div>
        </div>
        
        {/* Plan Indicator */}
        <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Current Plan</p>
            <p className="text-xs font-bold text-slate-800 mt-1">{tutor.plan} Educator</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive 
                  ? 'bg-indigo-50/75 text-indigo-600 shadow-sm' 
                  : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : item.badge === 'AI' 
                      ? 'bg-gradient-to-r from-indigo-600 to-teal-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 shrink-0">
              AR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{tutor.name}</p>
              <p className="text-[10px] text-slate-400 truncate">Math & Chemistry</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}
