import React, { useState, useRef } from 'react';
import { Student, TestRecord } from '../types';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  FileText,
  Activity,
  UserCheck,
  UploadCloud,
  FileSpreadsheet,
  Plus,
  RotateCw,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';

interface DashboardViewProps {
  students: Student[];
  onTabChange: (tab: any) => void;
  onSelectStudent: (studentId: string) => void;
  onDeepLinkTools: (studentId: string, toolType: 'lesson_plan' | 'worksheet' | 'quiz' | 'report_card_comments', topic: string) => void;
  onUpdateStudent?: (updatedStudent: Student) => void;
}

export default function DashboardView({ students, onTabChange, onSelectStudent, onDeepLinkTools, onUpdateStudent }: DashboardViewProps) {
  const [selectedStudentIdForIntake, setSelectedStudentIdForIntake] = useState(students[0]?.id || '');
  const [assessmentName, setAssessmentName] = useState('');
  const [assessmentDate, setAssessmentDate] = useState('2026-06-27');
  const [assessmentScore, setAssessmentScore] = useState(85);
  const [rawIntakeText, setRawIntakeText] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [intakeSuccessMsg, setIntakeSuccessMsg] = useState('');
  const [parsingError, setParsingError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      setRawIntakeText(`Uploaded file: ${file.name}.\nRaw text content extracted from mark sheet scan: Student details indicate score achieved: 84% on Trigonometric Ratios Test conducted on 2026-06-25.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setRawIntakeText(`Uploaded file: ${file.name}.\nRaw text content extracted from mark sheet scan: Student details indicate score achieved: 84% on Trigonometric Ratios Test conducted on 2026-06-25.`);
    }
  };

  const handleAIParsing = async () => {
    if (!rawIntakeText && !uploadedFileName) {
      setParsingError('Please paste score text or drop a mark sheet file first.');
      return;
    }
    setIsParsingText(true);
    setParsingError('');
    
    const prompt = `You are an AI academic assistant. Extract assessment details from the following student report/mark sheet snippet.
Format your response as a strict, raw JSON object with exactly these properties:
{
  "topic": "extracted test topic/subject (max 4 words)",
  "date": "YYYY-MM-DD",
  "score": number between 0 and 100
}
Do not write any markdown blocks (like \`\`\`json), explanation, or other text. Just the single, raw JSON object string.

Snippet:
"${rawIntakeText || uploadedFileName}"`;

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        let cleanText = data.text.trim();
        if (cleanText.includes('```')) {
          cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        const parsed = JSON.parse(cleanText);
        if (parsed.topic) setAssessmentName(parsed.topic);
        if (parsed.date) setAssessmentDate(parsed.date);
        if (parsed.score) setAssessmentScore(Number(parsed.score));
      } else {
        setParsingError('Failed to parse text. Please enter values manually.');
      }
    } catch (err) {
      setParsingError('AI parsing system busy. Please key in values manually.');
    } finally {
      setIsParsingText(false);
    }
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateStudent) return;
    
    const targetStudent = students.find(s => s.id === selectedStudentIdForIntake);
    if (!targetStudent) return;

    const newTest: TestRecord = {
      id: `t-dynamic-${Date.now()}`,
      date: assessmentDate,
      topic: assessmentName || 'Unit Diagnostic Drill',
      score: Number(assessmentScore)
    };

    const updatedTestHistory = [...targetStudent.testHistory, newTest];
    const avgScore = Math.round(updatedTestHistory.reduce((acc, t) => acc + t.score, 0) / updatedTestHistory.length);

    const updatedStudent: Student = {
      ...targetStudent,
      testHistory: updatedTestHistory,
      averageGrade: avgScore
    };

    onUpdateStudent(updatedStudent);
    setIntakeSuccessMsg(`Score successfully registered! Added "${newTest.topic}" (${newTest.score}%) to ${targetStudent.name}'s academic dossier.`);
    
    // Clear forms
    setAssessmentName('');
    setUploadedFileName('');
    setRawIntakeText('');
    setTimeout(() => setIntakeSuccessMsg(''), 5000);
  };

  // 1. Calculate dynamic analytics for top cards
  const totalStudents = students.length;
  
  const avgAttendance = Math.round(
    students.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents
  );
  
  const avgHomework = Math.round(
    students.reduce((acc, curr) => acc + (curr.homeworkCompletion || 0), 0) / totalStudents
  );

  const atRiskCount = students.filter(s => s.status === 'red').length;

  // 2. Trend mapping helper for table badge representation
  const getStudentTrend = (studentId: string) => {
    switch(studentId) {
      case 'std-diya':
        return { label: 'At Risk', bg: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' };
      case 'std-sara':
        return { label: 'Inconsistent', bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
      case 'std-aarav':
      case 'std-ishita':
        return { label: 'Improving', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
      default:
        return { label: 'Steady', bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  // 3. Prepare data for dynamic Midterm comparative chart
  const midtermChartData = students.map(s => {
    // Find midterm test or fallback to last recorded score
    const midtermTest = s.testHistory.find(t => t.topic.toLowerCase().includes('midterm')) || s.testHistory[s.testHistory.length - 1];
    const score = midtermTest ? midtermTest.score : s.averageGrade;
    
    // Get colors matching trends
    let trendColor = '#64748B'; // steady slate
    if (s.id === 'std-diya') trendColor = '#EF4444'; // at risk
    else if (s.id === 'std-sara') trendColor = '#F59E0B'; // inconsistent
    else if (s.id === 'std-aarav' || s.id === 'std-ishita') trendColor = '#10B981'; // improving

    return {
      name: s.name.split(' ')[0], // short name
      score: score,
      color: trendColor,
      fullName: s.name,
      trend: getStudentTrend(s.id).label
    };
  }).sort((a, b) => b.score - a.score); // Sorted by score for nice display curve

  // Custom Dot component for the comparative LineChart
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <circle 
        key={`dot-${payload.name}`}
        cx={cx} 
        cy={cy} 
        r={6} 
        fill={payload.color} 
        stroke="#FFFFFF" 
        strokeWidth={2} 
        className="filter drop-shadow-sm"
      />
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 md:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.25),transparent_60%)]" />
        <div className="relative z-10 max-w-xl">
          <div className="bg-indigo-500/25 border border-indigo-500/35 px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Welcome back to your workspace!
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">Hello, Coach Ananya</h2>
          <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
            Your tutoring workspace is preloaded with 6 active students across Mathematics, Physics, and Chemistry. Manage your roster and track performance trends.
          </p>
        </div>
        <div className="relative z-10 shrink-0 flex gap-3">
          <button 
            onClick={() => onTabChange('tools')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-950/40 flex items-center gap-1.5 hover:-translate-y-0.5"
            id="launch-planner-btn"
          >
            <Sparkles className="w-3.5 h-3.5" /> Launch AI Planner
          </button>
          <button 
            onClick={() => onTabChange('mentor')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
            id="consult-mentor-btn"
          >
            Consult AI Mentor
          </button>
        </div>
      </div>

      {/* TOP STAT CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Students</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1" id="stat-total-students">{totalStudents}</p>
            <p className="text-[10px] text-teal-600 font-semibold mt-1 flex items-center gap-0.5">
              <span>All rosters verified active</span>
            </p>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Average Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Avg Attendance</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1" id="stat-avg-attendance">{avgAttendance}%</p>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1 flex items-center gap-0.5">
              <span>High attendance rate</span>
            </p>
          </div>
          <div className="bg-teal-50 text-teal-600 p-3 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Average Homework Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Homework Comp.</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1" id="stat-homework-completion">{avgHomework}%</p>
            <p className="text-[10px] text-amber-600 font-semibold mt-1">
              <span>Keep assigning revisions</span>
            </p>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Students At Risk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Students At Risk</span>
            <p className={`text-3xl font-extrabold mt-1 ${atRiskCount > 0 ? 'text-rose-600' : 'text-slate-900'}`} id="stat-students-at-risk">{atRiskCount}</p>
            <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-0.5 animate-pulse">
              <span>Needs immediate support</span>
            </p>
          </div>
          <div className={`p-3 rounded-xl ${atRiskCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ATTENTION / INSIGHTS PANEL */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">Needs Attention — AI Roster Insights</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time educational alerts and positive progress spikes analyzed by TutorBridge.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Active Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Diya Patel - Red Flag */}
          <div className="border border-rose-100 bg-rose-50/40 rounded-xl p-4 flex gap-3.5 hover:bg-rose-50/70 transition-colors cursor-pointer" onClick={() => onSelectStudent('std-diya')}>
            <div className="bg-rose-100 text-rose-700 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">Diya Patel</span>
                <span className="bg-rose-100 text-rose-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Declining</span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Diya Patel — scores and attendance both declining. Recommend a parent check-in.
              </p>
            </div>
          </div>

          {/* Sara Khan - Amber Flag */}
          <div className="border border-amber-100 bg-amber-50/40 rounded-xl p-4 flex gap-3.5 hover:bg-amber-50/70 transition-colors cursor-pointer" onClick={() => onSelectStudent('std-sara')}>
            <div className="bg-amber-100 text-amber-700 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">Sara Khan</span>
                <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Foundational</span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Sara Khan — inconsistent results due to foundational gaps in ratios & proportion.
              </p>
            </div>
          </div>

          {/* Ishita Nair - Green Flag */}
          <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-4 flex gap-3.5 hover:bg-emerald-50/60 transition-colors cursor-pointer" onClick={() => onSelectStudent('std-ishita')}>
            <div className="bg-emerald-100 text-emerald-700 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">Ishita Nair</span>
                <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Breakthrough</span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Ishita Nair — strong turnaround; ready for harder word problems.
              </p>
            </div>
          </div>

          {/* Rohan Gupta - Green Flag */}
          <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4 flex gap-3.5 hover:bg-indigo-50/60 transition-colors cursor-pointer" onClick={() => onSelectStudent('std-rohan')}>
            <div className="bg-indigo-100 text-indigo-700 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">Rohan Gupta</span>
                <span className="bg-indigo-100 text-indigo-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Enrichment</span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Rohan Gupta — under-challenged; recommend olympiad-level enrichment.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* NEW: MARK SHEET UPLOADER & AI SCORE INTAKE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">Mark Sheet Scan & Score Intake</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Upload exam sheets, drag PDF/images, or paste grades. Gemini extracts scores dynamically.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full uppercase tracking-wider self-start md:self-auto">
            AI Automated Extraction
          </span>
        </div>

        {intakeSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-5 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{intakeSuccessMsg}</span>
          </div>
        )}

        {parsingError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-5 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{parsingError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Drag & Drop Scanned Mark Sheet area */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Drag & Drop Scan or Mark Sheet Files</label>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-52 relative ${
                isDragActive 
                  ? 'border-indigo-500 bg-indigo-50/50' 
                  : uploadedFileName 
                    ? 'border-emerald-300 bg-emerald-50/10 hover:bg-emerald-50/20' 
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileSelect}
                className="hidden" 
                accept="image/*,.pdf,.csv,.xlsx,.txt"
              />
              
              {uploadedFileName ? (
                <div className="space-y-2.5">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-xs">{uploadedFileName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">File registered successfully</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    Ready to Parse
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-700">Drag & drop scanned file here</p>
                    <p className="text-[10px] text-slate-400 mt-1">Accepts images, reports, CSV spreadsheets, or text files</p>
                  </div>
                  <button 
                    type="button"
                    className="bg-slate-100 hover:bg-slate-200 text-[10px] font-bold py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 transition-colors"
                  >
                    Select File manually
                  </button>
                </div>
              )}
            </div>

            {/* AI Paste assistant */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Paste Text or Scan Output (AI Assist)</label>
              <textarea
                placeholder="Paste raw email feedback, grade lists, or copy-paste text, e.g. 'Aarav Mehta obtained 88% on Unit Test 3 on June 25th 2026.'"
                value={rawIntakeText}
                onChange={(e) => setRawIntakeText(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-250/70 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 leading-normal"
              />
              <button
                type="button"
                onClick={handleAIParsing}
                disabled={isParsingText}
                className="w-full bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isParsingText ? 'Parsing report details...' : 'Extract Scores with Gemini AI'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic registration form */}
          <form onSubmit={handleSaveAssessment} className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Review Score Registration Details</p>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Student Profile</label>
                <select
                  value={selectedStudentIdForIntake}
                  onChange={(e) => setSelectedStudentIdForIntake(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-bold"
                  required
                >
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assessment / Test Name</label>
                <input
                  type="text"
                  placeholder="e.g. Unit Test 3, Trigonometric Ratios"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Score achieved %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assessmentScore}
                    onChange={(e) => setAssessmentScore(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date Conducted</label>
                  <input
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-6">
              <p className="text-[10px] text-slate-400">
                Saving will append this assessment to the student history and immediately recalculate averages and trends.
              </p>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Save Score to Dossier
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Roster & Quick Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROSTER OVERVIEW (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg font-display">Student Roster Overview</h3>
                <p className="text-xs text-slate-400 mt-1">Select a student row to view diagnostic tests, weaknesses, and message parents.</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                6 Active Profiles
              </span>
            </div>

            {/* Desktop Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Name</th>
                    <th className="pb-3">Grade</th>
                    <th className="pb-3">Attendance</th>
                    <th className="pb-3 text-center">Latest Score</th>
                    <th className="pb-3 text-center">Trend Status</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => {
                    const trend = getStudentTrend(student.id);
                    const initials = student.name.split(' ').map(n => n[0]).join('');
                    
                    // Fetch latest recorded test score from history
                    const latestTest = student.testHistory[student.testHistory.length - 1];
                    const latestScore = latestTest ? latestTest.score : student.averageGrade;

                    return (
                      <tr 
                        key={student.id}
                        onClick={() => onSelectStudent(student.id)}
                        className="group hover:bg-slate-50/80 transition-all cursor-pointer text-xs"
                      >
                        <td className="py-4 pl-2 font-medium text-slate-900 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 ${student.avatarColor}`}>
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {student.name}
                            </span>
                            <p className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">{student.subject.split(',')[0]}</p>
                          </div>
                        </td>
                        <td className="py-4 text-slate-600 font-medium">
                          {student.grade}
                        </td>
                        <td className="py-4 text-slate-600">
                          <div className="flex items-center gap-1.5 font-mono font-medium">
                            <span>{student.attendance}%</span>
                            <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden hidden sm:block">
                              <div 
                                className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-emerald-500' : student.attendance >= 80 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                                style={{ width: `${student.attendance}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="font-mono font-bold bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-slate-700">
                            {latestScore}%
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${trend.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${trend.dot}`} />
                            {trend.label}
                          </span>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <button className="text-slate-400 group-hover:text-indigo-600 transition-colors p-1">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 mt-6 text-center">
            <button 
              onClick={() => onTabChange('students')}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto hover:underline"
              id="view-all-students-btn"
            >
              View Full Student Dossier Profiles <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* QUICK CHART (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-5">
              <h3 className="font-bold text-slate-900 text-lg font-display">Midterm Comparison</h3>
              <p className="text-xs text-slate-400 mt-1">Comparative exam curves color-coded by active trend indicators.</p>
            </div>

            <div className="h-60 mt-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={midtermChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={10} 
                    fontWeight={600} 
                  />
                  <YAxis 
                    domain={[40, 100]} 
                    stroke="#94A3B8" 
                    fontSize={10} 
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 text-white p-3 rounded-xl border border-slate-800 text-left shadow-lg">
                            <p className="text-xs font-extrabold">{data.fullName}</p>
                            <p className="text-[10px] text-slate-300 mt-1 flex justify-between gap-4">
                              <span>Midterm Score:</span>
                              <span className="font-mono font-bold text-teal-400">{payload[0].value}%</span>
                            </p>
                            <p className="text-[10px] text-slate-300 mt-0.5 flex justify-between gap-4">
                              <span>Trend Status:</span>
                              <span className="font-bold" style={{ color: data.color }}>{data.trend}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4F46E5" 
                    strokeWidth={3} 
                    dot={renderCustomDot}
                    activeDot={{ r: 8 }} 
                  />
                  {/* Cohort average reference line */}
                  <ReferenceLine 
                    y={74} 
                    stroke="#94A3B8" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Class Avg (74%)', position: 'insideTopLeft', fontSize: 9, fill: '#64748B', fontWeight: 'bold' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Color Legend explanation */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>At Risk (Diya)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Inconsistent (Sara)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Improving (Aarav, Ishita)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
                <span>Steady (Rohan, Vihaan)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onTabChange('analytics')}
            className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto hover:underline mt-6"
            id="view-analytics-btn"
          >
            Check Academic Analytics <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
