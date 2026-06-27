import React, { useState } from 'react';
import { Student, StudentStatus, TestRecord } from '../types';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  BookOpen, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Award,
  BookMarked,
  Clock,
  FileText,
  Activity,
  PlusCircle,
  RotateCw,
  Check,
  ShieldAlert,
  HelpCircle,
  Edit
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface StudentsViewProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string | null) => void;
  onDeepLinkTools: (
    studentId: string, 
    toolType: 'lesson_plan' | 'worksheet' | 'quiz' | 'report_card_comments' | 'parent_report', 
    topic: string
  ) => void;
  onAddStudent: (newStudent: Omit<Student, 'id' | 'avatarColor' | 'testHistory' | 'lessonHistory'>) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export default function StudentsView({ 
  students, 
  selectedStudentId, 
  onSelectStudent, 
  onDeepLinkTools,
  onAddStudent,
  onUpdateStudent
}: StudentsViewProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [trendFilter, setTrendFilter] = useState<string>('all');
  
  // Modal State for registering student
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student form states
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('Grade 9');
  const [newStudentSubject, setNewStudentSubject] = useState('Mathematics');
  const [newStudentStatus, setNewStudentStatus] = useState<StudentStatus>('green');
  const [newStudentAttendance, setNewStudentAttendance] = useState(90);
  const [newStudentHomework, setNewStudentHomework] = useState(85);
  const [newStudentAvgGrade, setNewStudentAvgGrade] = useState(75);
  const [newStudentAge, setNewStudentAge] = useState(14);
  const [newStudentParent, setNewStudentParent] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentWeak, setNewStudentWeak] = useState('');
  const [newStudentStrong, setNewStudentStrong] = useState('');

  // Edit Student Modal and Form States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentGrade, setEditStudentGrade] = useState('');
  const [editStudentSubject, setEditStudentSubject] = useState('');
  const [editStudentStatus, setEditStudentStatus] = useState<StudentStatus>('green');
  const [editStudentAttendance, setEditStudentAttendance] = useState(90);
  const [editStudentHomework, setEditStudentHomework] = useState(85);
  const [editStudentAvgGrade, setEditStudentAvgGrade] = useState(75);
  const [editStudentAge, setEditStudentAge] = useState(14);
  const [editStudentParent, setEditStudentParent] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentPhone, setEditStudentPhone] = useState('');
  const [editStudentWeak, setEditStudentWeak] = useState('');
  const [editStudentStrong, setEditStudentStrong] = useState('');

  const handleOpenEditModal = () => {
    if (!currentStudent) return;
    setEditStudentName(currentStudent.name);
    setEditStudentGrade(currentStudent.grade);
    setEditStudentSubject(currentStudent.subject);
    setEditStudentStatus(currentStudent.status);
    setEditStudentAttendance(currentStudent.attendance);
    setEditStudentHomework(currentStudent.homeworkCompletion || 85);
    setEditStudentAvgGrade(currentStudent.averageGrade);
    setEditStudentAge(currentStudent.age || 14);
    setEditStudentParent(currentStudent.parentName);
    setEditStudentEmail(currentStudent.parentEmail);
    setEditStudentPhone(currentStudent.parentPhone);
    setEditStudentWeak(currentStudent.weakTopics.join(', '));
    setEditStudentStrong(currentStudent.strongTopics.join(', '));
    setIsEditModalOpen(true);
  };

  const handleUpdateStudentProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const updated: Student = {
      ...currentStudent,
      name: editStudentName,
      grade: editStudentGrade,
      subject: editStudentSubject,
      status: editStudentStatus,
      attendance: Number(editStudentAttendance),
      homeworkCompletion: Number(editStudentHomework),
      averageGrade: Number(editStudentAvgGrade),
      age: Number(editStudentAge),
      parentName: editStudentParent,
      parentEmail: editStudentEmail,
      parentPhone: editStudentPhone,
      weakTopics: editStudentWeak ? editStudentWeak.split(',').map(s => s.trim()) : currentStudent.weakTopics,
      strongTopics: editStudentStrong ? editStudentStrong.split(',').map(s => s.trim()) : currentStudent.strongTopics,
    };

    onUpdateStudent(updated);
    setIsEditModalOpen(false);
  };

  // Observation State
  const [newObservation, setNewObservation] = useState('');
  const [observationAddedMsg, setObservationAddedMsg] = useState(false);

  // Gemini regeneration state
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [geminiError, setGeminiError] = useState('');

  // Helper to map and retrieve cohesive trend states
  const getStudentTrend = (studentId: string) => {
    switch(studentId) {
      case 'std-diya':
        return { label: 'At Risk', bg: 'bg-rose-50 border-rose-100 text-rose-700', dot: 'bg-rose-500', icon: AlertTriangle };
      case 'std-sara':
        return { label: 'Inconsistent', bg: 'bg-amber-50 border-amber-100 text-amber-700', dot: 'bg-amber-500', icon: ShieldAlert };
      case 'std-aarav':
      case 'std-ishita':
        return { label: 'Improving', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: TrendingUp };
      default:
        return { label: 'Steady', bg: 'bg-indigo-50 border-indigo-100 text-indigo-700', dot: 'bg-indigo-500', icon: CheckCircle };
    }
  };

  // Handle student registration submit
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentParent.trim()) return;

    onAddStudent({
      name: newStudentName,
      grade: newStudentGrade,
      subject: newStudentSubject,
      status: newStudentStatus,
      attendance: Number(newStudentAttendance) || 90,
      averageGrade: Number(newStudentAvgGrade) || 75,
      parentName: newStudentParent,
      parentEmail: newStudentEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      parentPhone: newStudentPhone || '+91 98450 00000',
      weakTopics: newStudentWeak ? newStudentWeak.split(',').map(s => s.trim()) : ['Algebra foundation'],
      strongTopics: newStudentStrong ? newStudentStrong.split(',').map(s => s.trim()) : ['Class participation'],
      age: Number(newStudentAge) || 14,
      enrolled: 'Jun 2026',
      homeworkCompletion: Number(newStudentHomework) || 80,
      teacherObservation: 'Newly registered profile. Ready for intake diagnostic review.',
      aiInsight: 'Intake pending. Complete unit diagnostics to configure predictive curves.'
    });

    // Reset fields
    setNewStudentName('');
    setNewStudentParent('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentWeak('');
    setNewStudentStrong('');
    setNewStudentAge(14);
    setIsAddModalOpen(false);
  };

  // Find active student record
  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Append observation
  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !newObservation.trim()) return;

    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedNote = `[${timestamp}] ${newObservation.trim()}`;
    const updatedObservation = currentStudent.teacherObservation 
      ? `${currentStudent.teacherObservation}\n\n${formattedNote}` 
      : formattedNote;

    const updatedStudent: Student = {
      ...currentStudent,
      teacherObservation: updatedObservation
    };

    onUpdateStudent(updatedStudent);
    setNewObservation('');
    setObservationAddedMsg(true);
    setTimeout(() => setObservationAddedMsg(false), 3000);
  };

  // Regenerate insight via Gemini
  const handleRegenerateInsight = async () => {
    if (!currentStudent) return;

    setIsRegenerating(true);
    setGeminiError('');

    const scoresList = currentStudent.testHistory.map(t => `${t.topic}: ${t.score}%`).join(', ');
    const weakList = currentStudent.weakTopics.join(', ');
    const strongList = currentStudent.strongTopics.join(', ');

    const prompt = `Review the academic performance of student ${currentStudent.name} and write a highly professional, actionable, single-sentence tutoring insight for Ananya Rao.
Student details:
- Name: ${currentStudent.name}
- Grade: ${currentStudent.grade}
- Current average score: ${currentStudent.averageGrade}%
- Attendance rate: ${currentStudent.attendance}%
- Homework completion rate: ${currentStudent.homeworkCompletion || 85}%
- Strengths: ${strongList}
- Focus weaknesses: ${weakList}
- Recent tests: ${scoresList}
- Teacher observations: ${currentStudent.teacherObservation || 'None'}

Provide only the direct insight sentence. Keep it concise (less than 35 words), professional, empathetic, and highly targeted. Avoid markdown headers or wrapping text in quotes.`;

    const systemInstruction = 'You are an advanced academic diagnostics engine. Generate clean, highly impactful, single-sentence tutor insights based on empirical student data.';

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        const updatedStudent: Student = {
          ...currentStudent,
          aiInsight: data.text.trim()
        };
        onUpdateStudent(updatedStudent);
      } else {
        setGeminiError(data.error || 'Unable to analyze diagnostic curves. Please try again.');
      }
    } catch (err) {
      setGeminiError('Connection to tutoring server failed.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Filter students based on dual selectors and search queries
  const filteredStudents = students.filter(student => {
    const trendInfo = getStudentTrend(student.id);
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    const matchesTrend = trendFilter === 'all' || trendInfo.label === trendFilter;

    return matchesSearch && matchesGrade && matchesTrend;
  });

  return (
    <div className="animate-fade-in text-left">
      
      {currentStudent ? (
        /* ==================== 1. RICH STUDENT PROFILE SCREEN ==================== */
        <div className="space-y-6">
          
          {/* Action Row - Navigation & Deep Links */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => onSelectStudent(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors py-2 px-3 border border-slate-200 hover:border-indigo-100 bg-slate-50 hover:bg-indigo-50/20 rounded-xl max-w-max"
              id="back-to-roster-btn"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Dossier List
            </button>
            
            {/* AI Generation Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1.5">AI Suite Generators:</span>
              <button
                onClick={() => onDeepLinkTools(currentStudent.id, 'parent_report', '')}
                className="bg-teal-50 border border-teal-100 hover:bg-teal-100/60 text-teal-800 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5"
                id="profile-parent-report-btn"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" /> Generate Parent Report
              </button>
              <button
                onClick={() => onDeepLinkTools(currentStudent.id, 'worksheet', currentStudent.weakTopics[0] || 'Quadratic Equations')}
                className="bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/60 text-indigo-800 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5"
                id="profile-worksheet-btn"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Generate Worksheet
              </button>
              <button
                onClick={() => onDeepLinkTools(currentStudent.id, 'quiz', currentStudent.weakTopics[0] || 'Quadratic Equations')}
                className="bg-purple-50 border border-purple-100 hover:bg-purple-100/60 text-purple-800 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5"
                id="profile-quiz-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Generate Quiz
              </button>
            </div>
          </div>

          {/* Student Header Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_60%)]" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4.5">
                {/* Initials badge */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl border ${currentStudent.avatarColor} shrink-0 shadow-sm`}>
                  {currentStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{currentStudent.name}</h2>
                    
                    {/* Dynamic Trend Badge */}
                    {(() => {
                      const trend = getStudentTrend(currentStudent.id);
                      const TrendIcon = trend.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${trend.bg}`}>
                          <TrendIcon className="w-3.5 h-3.5" />
                          {trend.label}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">{currentStudent.grade}</span>
                    <span>•</span>
                    <span>{currentStudent.age || 14} years old</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-slate-400">Enrolled: {currentStudent.enrolled || 'Jan 2025'}</span>
                  </div>

                  <p className="text-xs text-indigo-600 font-bold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" /> Active Subjects: {currentStudent.subject}
                  </p>

                  <button
                    onClick={handleOpenEditModal}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 mt-2 transition-all self-start"
                    id="edit-profile-btn"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Student Profile
                  </button>
                </div>
              </div>

              {/* Family Contact Info Drawer */}
              <div className="bg-slate-50 border border-slate-150/70 p-4 rounded-xl text-xs space-y-2 md:max-w-xs w-full">
                <p className="font-bold text-slate-700 border-b border-slate-200 pb-1.5 flex items-center gap-1.5 uppercase tracking-wide text-[10px] text-slate-400">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Guardian Contacts
                </p>
                <p className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-semibold text-slate-800">{currentStudent.parentName}</span>
                </p>
                <p className="flex items-center justify-between gap-4 font-mono text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone:</span>
                  <span className="font-medium text-slate-700">{currentStudent.parentPhone}</span>
                </p>
                <p className="flex items-center justify-between gap-4 font-mono text-[11px] truncate">
                  <span className="text-slate-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]" title={currentStudent.parentEmail}>{currentStudent.parentEmail}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics - Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Attendance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Attendance Rate</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{currentStudent.attendance}%</p>
                <p className="text-[10px] text-slate-400 mt-1">Goal: 90% or higher</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Homework Completion */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Homework Completion</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{currentStudent.homeworkCompletion || 85}%</p>
                <p className="text-[10px] text-slate-400 mt-1">Required for diagnostic review</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Latest Score */}
            {(() => {
              const latestTest = currentStudent.testHistory[currentStudent.testHistory.length - 1];
              const latestScore = latestTest ? latestTest.score : currentStudent.averageGrade;
              const topicLabel = latestTest ? latestTest.topic : 'Average Score';
              return (
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Latest Assessment</span>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{latestScore}%</p>
                    <p className="text-[10px] text-indigo-600 font-bold mt-1 truncate max-w-[170px]" title={topicLabel}>{topicLabel}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Academic Visualizers & Topic Mastery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* PERFORMANCE OVER TIME CHART */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-3">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" /> Performance Over Time
                  </h4>
                  <span className="text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Assessed Scores Track
                  </span>
                </div>

                <div className="h-60 mt-4 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentStudent.testHistory} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" />
                      <XAxis 
                        dataKey="topic" 
                        stroke="#94A3B8" 
                        fontSize={10} 
                        fontWeight={600} 
                        tickFormatter={(v) => v.replace(/\(.*?\)/g, '').trim()} // strip brackets for cleaner axis
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
                              <div className="bg-slate-950 text-white p-3 rounded-xl border border-slate-800 text-left shadow-lg text-xs font-sans">
                                <p className="font-extrabold">{data.topic}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Date: {data.date}</p>
                                <p className="text-[10px] text-teal-400 font-bold mt-1 flex justify-between gap-4">
                                  <span>Score achieved:</span>
                                  <span className="font-mono font-bold text-teal-400">{payload[0].value}%</span>
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
                        dot={{ r: 5, fill: '#4F46E5', strokeWidth: 2, stroke: '#FFFFFF' }}
                        activeDot={{ r: 7 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-3.5 mt-4 text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Test score trends are chronological and reflect official BrightMinds assessment benchmarks.</span>
              </div>
            </div>

            {/* SUBJECT / TOPIC MASTERY BAR CHART */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-3">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-teal-600" /> Topic Mastery Focus
                  </h4>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded uppercase tracking-wider">
                    Diagnostic
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  Comparative breakdown of validated strengths and focus weaknesses logged during standard curriculum review blocks.
                </p>

                <div className="space-y-4.5">
                  {/* Strengths List (Green) */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> High Competencies (90%+ Mastery)
                    </span>
                    <div className="space-y-2">
                      {currentStudent.strongTopics.map((topic, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 truncate max-w-[180px]" title={topic}>{topic}</span>
                            <span className="font-mono text-[10px] font-bold text-emerald-600">92%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses List (Red/Amber) */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Focus Revision Areas (&lt;60% Mastery)
                    </span>
                    <div className="space-y-2">
                      {currentStudent.weakTopics.map((topic, i) => {
                        const score = currentStudent.id === 'std-diya' ? '45%' : '55%';
                        const barColor = currentStudent.id === 'std-diya' ? 'bg-rose-500' : 'bg-amber-500';
                        const textColor = currentStudent.id === 'std-diya' ? 'text-rose-600' : 'text-amber-600';
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-700 truncate max-w-[180px]" title={topic}>{topic}</span>
                              <span className={`font-mono text-[10px] font-bold ${textColor}`}>{score}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`${barColor} h-full rounded-full`} style={{ width: score }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 border border-slate-150/70 rounded-xl p-3 text-[11px] text-slate-500 leading-normal">
                <span className="font-bold text-slate-700 block mb-0.5">Tutor Revision Blueprint:</span> 
                Homework parameters target weak topics for 25 minutes daily.
              </div>
            </div>

          </div>

          {/* ASSESSMENT HISTORY TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-3.5">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Assessment History Record</h4>
                <p className="text-xs text-slate-400 mt-0.5">Chronological record of unit tests, midterm checks, and remedial drills.</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {currentStudent.testHistory.length} Exams Recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Assessment Name</th>
                    <th className="pb-3">Date Conducted</th>
                    <th className="pb-3 text-center">Score achieved</th>
                    <th className="pb-3 pr-2 text-right">Academic Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {currentStudent.testHistory.map((test) => {
                    const isHigh = test.score >= 80;
                    const isLow = test.score < 60;
                    
                    return (
                      <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-slate-800">
                          {test.topic}
                        </td>
                        <td className="py-3.5 text-slate-500 font-mono">
                          {test.date}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className="font-mono font-bold bg-slate-50 border border-slate-150 px-2 py-1 rounded-md text-slate-700">
                            {test.score}%
                          </span>
                        </td>
                        <td className="py-3.5 pr-2 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isHigh 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                              : isLow 
                                ? 'bg-rose-50 border-rose-100 text-rose-700' 
                                : 'bg-amber-50 border-amber-100 text-amber-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-emerald-500' : isLow ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            {isHigh ? 'Excellent' : isLow ? 'Needs Remediation' : 'Consistent'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Observations & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* TEACHER OBSERVATIONS PANEL */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" /> Tutor Observations Log
                  </h4>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">
                    Session Notes
                  </span>
                </div>

                {/* Seeded observation text */}
                <div className="bg-slate-50 border border-slate-150/70 rounded-xl p-4 text-xs text-slate-600 leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre-line mb-5">
                  {currentStudent.teacherObservation || "No observation notes recorded for this student yet. Add one below to kickstart diagnostic tracking."}
                </div>
              </div>

              {/* Add observation form */}
              <form onSubmit={handleAddObservation} className="space-y-3 pt-3 border-t border-slate-100">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Append New Observation Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type lesson observation (e.g. Completed ratios homework perfectly today...)"
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 pl-3.5 pr-2.5 py-2 text-xs rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Save Note
                  </button>
                </div>
                {observationAddedMsg && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                    <Check className="w-3.5 h-3.5" /> Note successfully recorded to student profile dossier!
                  </p>
                )}
              </form>
            </div>

            {/* AI INSIGHTS PANEL (Gemini powered) */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.15),transparent_60%)]" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 border-b border-indigo-900 pb-3">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-400" /> AI Diagnostic Insight
                  </h4>
                  <span className="bg-teal-500/25 border border-teal-500/35 text-teal-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Powered by Gemini 3.5
                  </span>
                </div>

                {geminiError && (
                  <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs rounded-xl p-3 mb-4 font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                    <span>{geminiError}</span>
                  </div>
                )}

                {/* Seeded or generated AI Insight */}
                <div className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed italic min-h-[80px] bg-indigo-900/20 border border-indigo-900/30 rounded-xl p-4">
                  {isRegenerating ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-2 text-center">
                      <div className="relative">
                        <RotateCw className="w-6 h-6 text-teal-400 animate-spin" />
                        <Sparkles className="w-3 h-3 text-teal-300 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-xs">Analyzing scores and logs...</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Gemini is rewriting custom recommendations</p>
                      </div>
                    </div>
                  ) : (
                    `"${currentStudent.aiInsight || 'No insight generated yet. Click below to analyze student data with Gemini.'}"`
                  )}
                </div>
              </div>

              <div className="relative z-10 pt-5 mt-4 border-t border-indigo-900/60 flex items-center justify-between gap-4">
                <p className="text-[10px] text-slate-400 leading-normal max-w-[200px]">
                  Generates professional academic advice using test history curves and logs.
                </p>
                <button
                  type="button"
                  onClick={handleRegenerateInsight}
                  disabled={isRegenerating}
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 ${
                    isRegenerating ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                  }`}
                  id="regenerate-insight-btn"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>{isRegenerating ? 'Analyzing...' : 'Regenerate Insight'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ==================== 2. STUDENTS LIST VIEW ==================== */
        <div className="space-y-6">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-display">Student Dossier profiles</h2>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Conduct academic diagnostics, review family profile contacts, and execute curriculum generation plans.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5 self-start"
              id="open-register-modal-btn"
            >
              <Plus className="w-4 h-4" /> Register New Student
            </button>
          </div>

          {/* Search Bar & Multi-Filtering Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name or active subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-slate-700"
                id="student-search-input"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              
              {/* Grade Filter */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs py-2.5 pl-3.5 pr-9 rounded-xl font-bold text-slate-600 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 cursor-pointer appearance-none"
                  id="grade-filter-select"
                >
                  <option value="all">All Grades</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Trend Filter */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={trendFilter}
                  onChange={(e) => setTrendFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs py-2.5 pl-3.5 pr-9 rounded-xl font-bold text-slate-600 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 cursor-pointer appearance-none"
                  id="trend-filter-select"
                >
                  <option value="all">All Trends</option>
                  <option value="At Risk">At Risk (Red)</option>
                  <option value="Inconsistent">Inconsistent (Amber)</option>
                  <option value="Improving">Improving (Green)</option>
                  <option value="Steady">Steady (Green/Slate)</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

            </div>
          </div>

          {/* Student Dossier Cards Grid */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
              <h3 className="font-extrabold text-slate-800 text-base">No matching student logs</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                We couldn't find any active roster records matching your search query or selected trend indicators. Update filters or click Register above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setGradeFilter('all');
                  setTrendFilter('all');
                }}
                className="mt-5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold py-2 px-4 rounded-xl transition-colors hover:bg-indigo-100/50"
              >
                Clear Active Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudents.map((student) => {
                const initials = student.name.split(' ').map(n => n[0]).join('');
                const trend = getStudentTrend(student.id);
                const TrendIcon = trend.icon;
                
                return (
                  <div
                    key={student.id}
                    onClick={() => onSelectStudent(student.id)}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200/90 hover:shadow-md transition-all p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                    id={`student-card-${student.id}`}
                  >
                    {/* Tiny accent corner matching status */}
                    <div className={`absolute top-0 right-0 w-2 h-full ${
                      student.status === 'green' ? 'bg-emerald-500/20' : student.status === 'amber' ? 'bg-amber-500/20' : 'bg-rose-500/20'
                    }`} />

                    <div>
                      {/* Top Row: Avatar & status marker */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-50 pb-3 mb-4">
                        <div className="flex items-center space-x-3.5">
                          {/* Initials badge */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs border ${student.avatarColor} shrink-0`}>
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm truncate max-w-[130px]">{student.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{student.grade}</p>
                          </div>
                        </div>

                        {/* Trend badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${trend.bg} shrink-0`}>
                          <TrendIcon className="w-2.5 h-2.5" />
                          {trend.label}
                        </span>
                      </div>

                      {/* Middle Row: Subjects list & latest key weakness */}
                      <div className="space-y-2 text-xs text-slate-500 mb-5">
                        <p className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-700 truncate">{student.subject}</span>
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span className="text-rose-500 font-bold uppercase tracking-wide text-[8px] bg-rose-50 border border-rose-100 px-1 py-0.2 rounded shrink-0">Focus:</span>
                          <span className="font-medium text-slate-600 truncate">{student.weakTopics[0] || 'Quadratic Equations'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Key metrics summary */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-xs">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Average</p>
                          <p className={`font-bold mt-0.5 ${
                            student.status === 'green' ? 'text-emerald-600' : student.status === 'amber' ? 'text-amber-600' : 'text-rose-600'
                          }`}>{student.averageGrade}%</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Attendance</p>
                          <p className="font-bold text-slate-700 mt-0.5">{student.attendance}%</p>
                        </div>
                      </div>

                      <span className="text-indigo-600 group-hover:translate-x-1.5 transition-transform text-xs font-bold flex items-center gap-0.5">
                        View Profile <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* REGISTER NEW STUDENT MODAL */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-150 mb-5">
                  <h3 className="font-extrabold text-slate-900 text-lg">Register Student Profile</h3>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-2 transition-all"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Mehta"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age (Years)</label>
                      <input
                        type="number"
                        min="8"
                        max="20"
                        required
                        value={newStudentAge}
                        onChange={(e) => setNewStudentAge(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade / Year</label>
                      <select
                        value={newStudentGrade}
                        onChange={(e) => setNewStudentGrade(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 cursor-pointer text-slate-600 font-bold"
                      >
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Subjects</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mathematics, Physics"
                        value={newStudentSubject}
                        onChange={(e) => setNewStudentSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Attendance Rate %</label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={newStudentAttendance}
                        onChange={(e) => setNewStudentAttendance(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Homework Rate %</label>
                      <input
                        type="number"
                        min="30"
                        max="100"
                        value={newStudentHomework}
                        onChange={(e) => setNewStudentHomework(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Estimated Grade Avg %</label>
                      <input
                        type="number"
                        min="30"
                        max="100"
                        value={newStudentAvgGrade}
                        onChange={(e) => setNewStudentAvgGrade(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Status</label>
                      <select
                        value={newStudentStatus}
                        onChange={(e) => setNewStudentStatus(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 cursor-pointer text-slate-600 font-bold"
                      >
                        <option value="green">Excellent / Improving (Green)</option>
                        <option value="amber">Watch / Inconsistent (Amber)</option>
                        <option value="red">At Risk (Red)</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <div className="h-px bg-slate-100 my-2.5" />
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-500" /> Guardian & Family Parameters
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Mehta"
                        value={newStudentParent}
                        onChange={(e) => setNewStudentParent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Phone</label>
                      <input
                        type="text"
                        placeholder="e.g. +91 98450 11223"
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white outline-none text-slate-700"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Email</label>
                      <input
                        type="email"
                        placeholder="parent@example.com"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weak Topics (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Geometry, Trig Basics"
                        value={newStudentWeak}
                        onChange={(e) => setNewStudentWeak(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Strong Topics (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Algebra, Trigonometry"
                        value={newStudentStrong}
                        onChange={(e) => setNewStudentStrong(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700"
                      />
                    </div>

                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md"
                    >
                      Create Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Student Profile Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in text-left">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-extrabold text-slate-955 font-display">Edit Student Profile</h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdateStudentProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editStudentName}
                        onChange={(e) => setEditStudentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age</label>
                      <input
                        type="number"
                        min="8"
                        max="20"
                        required
                        value={editStudentAge}
                        onChange={(e) => setEditStudentAge(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade / Year</label>
                      <select
                        value={editStudentGrade}
                        onChange={(e) => setEditStudentGrade(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 cursor-pointer text-slate-600 font-bold"
                      >
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Subjects</label>
                      <input
                        type="text"
                        required
                        value={editStudentSubject}
                        onChange={(e) => setEditStudentSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Attendance Rate %</label>
                      <input
                        type="number"
                        min="30"
                        max="100"
                        value={editStudentAttendance}
                        onChange={(e) => setEditStudentAttendance(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Homework Rate %</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={editStudentHomework}
                        onChange={(e) => setEditStudentHomework(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Average Grade %</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={editStudentAvgGrade}
                        onChange={(e) => setEditStudentAvgGrade(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Class Flag</label>
                      <select
                        value={editStudentStatus}
                        onChange={(e) => setEditStudentStatus(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 cursor-pointer text-slate-600 font-bold"
                      >
                        <option value="green">Excellent / Improving (Green)</option>
                        <option value="amber">Watch / Inconsistent (Amber)</option>
                        <option value="red">At Risk (Red)</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <div className="h-px bg-slate-100 my-2.5" />
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-500" /> Guardian Contacts & Topics
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Name</label>
                      <input
                        type="text"
                        required
                        value={editStudentParent}
                        onChange={(e) => setEditStudentParent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Phone</label>
                      <input
                        type="text"
                        required
                        value={editStudentPhone}
                        onChange={(e) => setEditStudentPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white outline-none text-slate-700"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Email</label>
                      <input
                        type="email"
                        required
                        value={editStudentEmail}
                        onChange={(e) => setEditStudentEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white outline-none text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Focus Weak Topics (comma separated)</label>
                      <input
                        type="text"
                        value={editStudentWeak}
                        onChange={(e) => setEditStudentWeak(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Strong Topics (comma separated)</label>
                      <input
                        type="text"
                        value={editStudentStrong}
                        onChange={(e) => setEditStudentStrong(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white text-slate-700"
                      />
                    </div>

                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
