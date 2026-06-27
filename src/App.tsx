import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Sidebar, { SidebarTab } from './components/Sidebar';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import AnalyticsView from './components/AnalyticsView';
import AIToolsView from './components/AIToolsView';
import ParentReportsView from './components/ParentReportsView';
import AIMentorView from './components/AIMentorView';
import PricingView from './components/PricingView';
import { tutorSeed, studentsSeed } from './data';
import { Student, Tutor } from './types';
import { Bell, Search, GraduationCap } from 'lucide-react';

export default function App() {
  // Navigation & Authentication states
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');

  // Core Data States (retains in-memory for the session)
  const [tutor, setTutor] = useState<Tutor>(tutorSeed);
  const [students, setStudents] = useState<Student[]>(studentsSeed);
  
  // Roster detail navigation state
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Deep Link States (for quick-prep actions across views)
  const [prefilledStudentId, setPrefilledStudentId] = useState<string | null>(null);
  const [prefilledTopic, setPrefilledTopic] = useState<string>('');
  const [prefilledToolType, setPrefilledToolType] = useState<'lesson_plan' | 'worksheet' | 'quiz' | 'report_card_comments' | null>(null);

  // Notification bell state
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Callback to add a new student profile
  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'avatarColor' | 'testHistory' | 'lessonHistory'>) => {
    const nextId = `std-00${students.length + 1}`;
    
    // Choose colors dynamically for design variation
    const colors = [
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-teal-100 text-teal-700 border-teal-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-amber-100 text-amber-700 border-amber-200'
    ];
    const avatarColor = colors[students.length % colors.length];

    const studentRecord: Student = {
      ...newStudent,
      id: nextId,
      avatarColor,
      testHistory: [
        { id: `t-new-1`, date: '2026-06-15', topic: newStudent.weakTopics[0] || 'Orientation', score: newStudent.averageGrade }
      ],
      lessonHistory: [
        { id: `l-new-1`, date: '2026-06-20', topic: 'Orientation Session', performance: 'Good', notes: 'First session. Completed intake checklist. Student is engaged and motivated.' }
      ]
    };

    setStudents(prev => [...prev, studentRecord]);
  };

  // Callback to update an existing student profile in memory
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  // Callback to trigger deep-linking (e.g. from Dashboard or Student detail to AI Tools page or Parent Reports page)
  const handleDeepLinkTools = (
    studentId: string, 
    toolType: 'lesson_plan' | 'worksheet' | 'quiz' | 'report_card_comments' | 'parent_report', 
    topic: string
  ) => {
    setPrefilledStudentId(studentId);
    setPrefilledTopic(topic);
    if (toolType === 'parent_report') {
      setActiveTab('reports');
    } else {
      setPrefilledToolType(toolType);
      setActiveTab('tools');
    }
  };

  // Reset deep link fields once they have been consumed by AIToolsView or ParentReportsView
  const handleClearDeepLinks = () => {
    setPrefilledStudentId(null);
    setPrefilledTopic('');
    setPrefilledToolType(null);
  };

  // Callback to update pricing tier plan
  const handleUpdatePlan = (newPlan: string) => {
    setTutor(prev => ({ ...prev, plan: newPlan }));
  };

  // Determine current active view title for topbar
  const tabTitles: Record<SidebarTab, string> = {
    dashboard: 'Workplace Overview',
    students: 'Student Dossiers',
    analytics: 'Academic Analytics',
    tools: 'AI Curriculum Suite',
    reports: 'Parent Report Center',
    mentor: 'AI Mentorship Circle',
    pricing: 'Workspace Plans',
  };

  // Render correct sub-view inside app container
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            students={students} 
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSelectedStudentId(null);
            }} 
            onSelectStudent={(id) => {
              setSelectedStudentId(id);
              setActiveTab('students');
            }}
            onDeepLinkTools={handleDeepLinkTools}
            onUpdateStudent={handleUpdateStudent}
          />
        );
      case 'students':
        return (
          <StudentsView 
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
            onDeepLinkTools={handleDeepLinkTools}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        );
      case 'analytics':
        return <AnalyticsView students={students} />;
      case 'tools':
        return (
          <AIToolsView 
            students={students}
            prefilledStudentId={prefilledStudentId}
            prefilledTopic={prefilledTopic}
            prefilledToolType={prefilledToolType}
            onClearDeepLinks={handleClearDeepLinks}
          />
        );
      case 'reports':
        return (
          <ParentReportsView 
            students={students} 
            prefilledStudentId={prefilledStudentId}
            onClearDeepLinks={handleClearDeepLinks}
          />
        );
      case 'mentor':
        return <AIMentorView students={students} />;
      case 'pricing':
        return <PricingView tutor={tutor} onUpdatePlan={handleUpdatePlan} />;
      default:
        return <div className="text-slate-400">Section details pending compilation...</div>;
    }
  };

  // Auth routing controller
  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setCurrentPage('auth')}
        onSignIn={() => setCurrentPage('auth')}
      />
    );
  }

  if (currentPage === 'auth') {
    return (
      <AuthPage 
        onLoginSuccess={() => setCurrentPage('app')}
        onBackToLanding={() => setCurrentPage('landing')}
      />
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 font-sans h-screen flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          // If moving between tabs, clear active student sub-screen
          if (tab !== 'students') {
            setSelectedStudentId(null);
          }
        }} 
        tutor={tutor} 
        onLogout={() => {
          setCurrentPage('landing');
          setActiveTab('dashboard');
          setSelectedStudentId(null);
        }}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between shrink-0 relative select-none">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-slate-800">{tabTitles[activeTab]}</span>
            {activeTab === 'students' && selectedStudentId && (
              <>
                <span className="text-slate-300 text-xs">/</span>
                <span className="text-xs font-semibold text-indigo-600">
                  {students.find(s => s.id === selectedStudentId)?.name}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Quick search (cosmetic) */}
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-400 font-medium">
              <Search className="w-3.5 h-3.5 mr-2" />
              <span>Cmd + K to Search</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setHasNotifications(false);
                  setShowNotificationDropdown(!showNotificationDropdown);
                }}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fade-in text-xs space-y-3">
                  <div className="font-bold text-slate-900 border-b border-slate-50 pb-2 flex items-center justify-between">
                    <span>Recent Notices</span>
                    <button 
                      onClick={() => setShowNotificationDropdown(false)}
                      className="text-[10px] text-indigo-600 font-bold hover:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="space-y-2 text-slate-600 leading-normal">
                    <p className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                      ⚠️ <span className="font-bold text-slate-800">Remediation Alert:</span> Diya Patel is currently at 57% average. Focus quadratics comments.
                    </p>
                    <p className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                      ✓ <span className="font-bold text-slate-800">Quiz Created:</span> A custom circle theorems quiz was drafted for Aarav Mehta.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-100" />

            {/* Profile Avatar & Info */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-teal-400">
                AR
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">{tutor.name}</span>
                <span className="text-[9px] text-slate-400 font-semibold block uppercase tracking-wider">{tutor.plan} Plan</span>
              </div>
            </div>

          </div>
        </header>

        {/* Scrollable Sub-View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-7xl mx-auto pb-12">
            {renderTabContent()}
          </div>
        </main>

      </div>
    </div>
  );
}
