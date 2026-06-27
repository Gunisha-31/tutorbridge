import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Trophy, 
  Target, 
  TrendingDown, 
  ShieldCheck,
  BrainCircuit,
  RotateCw,
  Sparkles,
  Users,
  Activity,
  FileCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell,
  ReferenceLine 
} from 'recharts';

interface AnalyticsViewProps {
  students: Student[];
}

export default function AnalyticsView({ students }: AnalyticsViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');

  // 1. Calculate Aggregate Statistics
  const totalStudents = students.length;
  const overallAvgGrade = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.averageGrade, 0) / totalStudents) 
    : 0;
  const overallAvgAttendance = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents) 
    : 0;
  const overallAvgHomework = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + (curr.homeworkCompletion || 0), 0) / totalStudents) 
    : 0;

  // 2. Prepare Data for Attendance Overview (Bar Chart)
  const attendanceChartData = students.map(s => ({
    name: s.name.split(' ')[0], // short name
    fullName: s.name,
    attendance: s.attendance,
    status: s.status,
    grade: s.grade
  })).sort((a, b) => b.attendance - a.attendance);

  // 3. Prepare Data for Performance Trends over Time (Multi-Line Chart)
  // Find the maximum test history length to structure the chart points dynamically
  const maxHistoryLen = Math.max(...students.map(s => s.testHistory.length), 3);
  const trendChartData = Array.from({ length: maxHistoryLen }).map((_, idx) => {
    // Label based on standard progression: Test 1, Test 2, Midterm, etc.
    let label = `Assessment ${idx + 1}`;
    if (idx === 0) label = 'Unit Test 1';
    else if (idx === 1) label = 'Unit Test 2';
    else if (idx === 2) label = 'Midterm Exam';

    const dataPoint: any = { name: label };
    students.forEach(student => {
      const test = student.testHistory[idx];
      if (test) {
        dataPoint[student.name] = test.score;
      }
    });
    return dataPoint;
  });

  // Assign consistent line colors based on student trend or ID
  const studentColors: Record<string, string> = {
    'Aarav Mehta': '#10B981', // green (improving)
    'Ishita Nair': '#14B8A6', // teal (improving)
    'Rohan Gupta': '#6366F1', // indigo (top performer)
    'Vihaan Reddy': '#475569', // slate (steady)
    'Sara Khan': '#F59E0B', // amber (inconsistent)
    'Diya Patel': '#F43F5E', // rose (at risk)
  };

  const getStudentColor = (name: string, index: number) => {
    return studentColors[name] || ['#8B5CF6', '#EC4899', '#06B6D4', '#E11D48'][index % 4];
  };

  // 4. Class Strengths vs Weaknesses Aggregation (Horizontal Bar Chart)
  const getAggregatedWeakAreas = () => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      s.weakTopics.forEach(t => {
        let normalized = t.split('(')[0].trim();
        // Capitalize first letters
        normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
        if (normalized.toLowerCase().includes('trig')) normalized = 'Trigonometry';
        else if (normalized.toLowerCase().includes('geom') || normalized.toLowerCase().includes('mensur')) normalized = 'Geometry & Mensuration';
        else if (normalized.toLowerCase().includes('ratio') || normalized.toLowerCase().includes('fraction')) normalized = 'Ratios & Fractions';
        else if (normalized.toLowerCase().includes('word')) normalized = 'Word Problems';
        else if (normalized.toLowerCase().includes('quadr')) normalized = 'Quadratic Equations';
        else if (normalized.toLowerCase().includes('motion') || normalized.toLowerCase().includes('physics')) normalized = 'Physics Equations';
        
        counts[normalized] = (counts[normalized] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([topic, count]) => ({
        topic,
        studentsCount: count,
      }))
      .sort((a, b) => b.studentsCount - a.studentsCount)
      .slice(0, 5);
  };

  const weakTopicsData = getAggregatedWeakAreas();

  // 5. Homework Completion Chart Data (Bar Chart)
  const homeworkChartData = students.map(s => ({
    name: s.name.split(' ')[0],
    fullName: s.name,
    completion: s.homeworkCompletion || 0,
    grade: s.grade
  })).sort((a, b) => b.completion - a.completion);

  // 6. Top Performers vs Needs Attention Side-by-Side Lists
  const topPerformers = [...students]
    .sort((a, b) => b.averageGrade - a.averageGrade)
    .slice(0, 3);

  const needsAttention = [...students]
    .sort((a, b) => {
      // Sort primarily by red status, then by lower average grade
      const scoreA = a.status === 'red' ? 0 : a.status === 'amber' ? 1 : 2;
      const scoreB = b.status === 'red' ? 0 : b.status === 'amber' ? 1 : 2;
      if (scoreA !== scoreB) return scoreA - scoreB;
      return a.averageGrade - b.averageGrade;
    })
    .slice(0, 3);

  // Trigger Gemini dynamic Roster Analysis
  const handleGenerateAIRecommendations = async (silentOnLoad = false) => {
    setIsAnalyzing(true);
    setApiError('');
    
    const rosterSummary = students.map(s => {
      const tests = s.testHistory.map(t => `${t.topic}: ${t.score}%`).join(', ');
      return `- ${s.name} (${s.grade}, Status: ${s.status}): Avg: ${s.averageGrade}%, Attendance: ${s.attendance}%, Homework Comp: ${s.homeworkCompletion || 85}%, Focus Areas: [${s.weakTopics.join(', ')}], Strengths: [${s.strongTopics.join(', ')}], Test scores: [${tests}]`;
    }).join('\n');

    const prompt = `Review the entire student roster performance data below and compile an outstanding, highly professional, structured tutoring recommendation report for Coach Ananya Rao.

Roster Data:
${rosterSummary}

Write exactly 3 distinct, beautifully formatted bullet-point sections covering:
1. **Priority Student Alerts**: State exactly who to prioritize (e.g., Diya Patel due to dropping grades and declining attendance, Sara Khan with foundational gaps) and outline a direct, immediate tutoring action plan.
2. **Class-Wide Revision Focus**: Aggregate the shared weaknesses (e.g., Trigonometry, Geometry, quadratic trinomials) and recommend a group study workshop agenda.
3. **Enrichment Opportunities**: Identify high-performers ready for acceleration (e.g., Rohan Gupta with a 94% average and 100% homework rate) and specify concrete olympiad or contest-level materials to assign.

Keep the tone academic, empathetic, highly professional, and encouraging. Return the output in clean, structured paragraphs with standard linebreaks. Do not use Markdown headers (like # or ##) or titles. Use bold key phrases to make it highly readable. Keep the full length under 180 words.`;

    const systemInstruction = "You are a master academic registrar and tutoring coordinator. Provide concise, high-value, actionable diagnostic advice based on empirical roster matrices.";

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setAiReport(data.text.trim());
      } else {
        if (!silentOnLoad) {
          setApiError(data.error || 'Gemini system was unable to generate custom recommendations.');
        }
      }
    } catch (err) {
      if (!silentOnLoad) {
        setApiError('Unable to connect to BrightMinds tutoring servers. Check your connection.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Pre-load default or dynamic recommendations on load
  useEffect(() => {
    // Setup a clean default recommendation first in case API is configuring
    const defaultText = `• **Priority Student Alerts**: Diya Patel is of immediate critical focus; her attendance of 71% and declining midterm of 51% in Mathematics require a diagnostic remediation plan and guardian intervention. Sara Khan also requires close watch due to arithmetic volatility.\n\n• **Class-Wide Revision Focus**: Trigonometry and Geometry surface as the most pervasive weak spots across multiple grade profiles. Recommend holding a 45-minute structured group revision lab targeting trigonometric identities and spatial calculations.\n\n• **Enrichment Opportunities**: Rohan Gupta is currently under-challenged with a perfect 100% homework completion and 94% average. Introduce specialized math circle questions and competitive olympiad algebra to maintain maximum engagement.`;
    setAiReport(defaultText);

    // Run active API call as progressive enhancement
    handleGenerateAIRecommendations(true);
  }, [students]);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Header and subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-display" id="analytics-title">Roster Benchmarks & Trends</h2>
          <p className="text-xs text-slate-400 mt-1 leading-normal">
            Projector-ready classroom insights, score correlation trends, and dynamic predictive curves analyzed across 6 active student dossiers.
          </p>
        </div>
        <button
          onClick={() => handleGenerateAIRecommendations(false)}
          disabled={isAnalyzing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center gap-2 hover:-translate-y-0.5 transition-all self-start"
          id="refresh-analytics-btn"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Refresh AI Diagnostics'}</span>
        </button>
      </div>

      {/* AGGREGATE KEY METRIC CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Roster Average Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Class Average Score</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-extrabold text-slate-900" id="analytic-overall-avg-grade">{overallAvgGrade}%</span>
            <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +2.8%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${overallAvgGrade}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Class Target: 75% cohort bar</p>
        </div>

        {/* Card 2: Combined Roster Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Overall Attendance</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-extrabold text-slate-900" id="analytic-overall-avg-attendance">{overallAvgAttendance}%</span>
            <span className="text-[10px] text-indigo-600 font-bold">Stable</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${overallAvgAttendance}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Critical watch bar: Below 80%</p>
        </div>

        {/* Card 3: Homework completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Homework Submission</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-extrabold text-slate-900" id="analytic-overall-avg-homework">{overallAvgHomework}%</span>
            <span className="text-[10px] text-amber-500 font-bold">Revise drills</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${overallAvgHomework}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Homework correlates directly with marks</p>
        </div>

        {/* Card 4: Top performing cohort */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Top Cohort Performer</span>
            <span className="text-sm font-extrabold text-slate-900 block truncate" id="analytic-top-student">{topPerformers[0]?.name || 'N/A'}</span>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">{topPerformers[0]?.averageGrade}% Avg • {topPerformers[0]?.grade}</span>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* VISUAL CENTERPIECE: PROJECTOR-READY CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. COMBINED CHRONOLOGICAL ASSESSMENT TRENDS (Multi-Line Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Multi-Student Performance Trends
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Track and contrast progression curves across assessments. (Improving lines rise, declining lines drop).</p>
              </div>
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                6-Student Tracking
              </span>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} margin={{ top: 15, right: 20, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
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
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }}
                    itemStyle={{ fontSize: '11px', color: '#CBD5E1' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8', marginBottom: '4px' }}
                  />
                  <Legend 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} 
                  />
                  {students.map((student, sIdx) => (
                    <Line 
                      key={student.id}
                      type="monotone" 
                      dataKey={student.name} 
                      stroke={getStudentColor(student.name, sIdx)} 
                      strokeWidth={student.id === 'std-diya' ? 4.5 : 3} // thicker at risk line to highlight trend
                      dot={{ r: 4, strokeWidth: 1.5, stroke: '#FFF' }}
                      activeDot={{ r: 6 }} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-slate-50 text-[10px] text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
            <span>Noticeable trends: **Ishita Nair** & **Aarav Mehta** rise sharply due to remediation. **Diya Patel** exhibits a steep drop.</span>
          </div>
        </div>

        {/* 2. ATTENDANCE OVERVIEW (Color-Coded Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" /> Attendance Overview per Student
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Color-coded bar chart based on student active trend indicators (Red/Amber/Green).</p>
              </div>
              <span className="bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Status Aligned
              </span>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={10} 
                    fontWeight={600} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#94A3B8" 
                    fontSize={10} 
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 text-white p-3 rounded-xl text-xs text-left shadow-lg">
                            <p className="font-extrabold">{data.fullName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{data.grade}</p>
                            <p className="text-[10px] text-teal-400 font-bold mt-1">
                              Attendance Rate: {payload[0].value}%
                            </p>
                            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[8px] font-extrabold border ${
                              data.status === 'red' ? 'bg-rose-500/20 border-rose-500/30 text-rose-300' : data.status === 'amber' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                            }`}>
                              {data.status === 'red' ? 'At Risk' : data.status === 'amber' ? 'Inconsistent' : 'Steady / Improving'}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Critical Zone (80%)', position: 'insideTopLeft', fontSize: 9, fill: '#EF4444', fontWeight: 'bold' }} />
                  <Bar 
                    dataKey="attendance" 
                    radius={[6, 6, 0, 0]} 
                    barSize={24}
                  >
                    {attendanceChartData.map((entry, index) => {
                      let color = '#10B981'; // green status
                      if (entry.status === 'red') color = '#F43F5E'; // red status
                      else if (entry.status === 'amber') color = '#F59E0B'; // amber status
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-[9px] font-bold text-slate-500 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-500" />
              <span>Stable (Green status)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-amber-500" />
              <span>Inconsistent (Amber status)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-rose-500" />
              <span>At Risk (Red status)</span>
            </div>
          </div>
        </div>

        {/* 3. HOMEWORK COMPLETION BENCHMARKS (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" /> Homework Submission Rates
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Detailed completion percentages mapped out compared to the required cohort target line.</p>
              </div>
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Completion rates
              </span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={homeworkChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={10} 
                    fontWeight={600} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#94A3B8" 
                    fontSize={10} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '10px', border: 'none', color: '#FFF' }}
                    itemStyle={{ fontSize: '11px' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}
                  />
                  <ReferenceLine y={85} stroke="#6366F1" strokeDasharray="4 4" label={{ value: 'Target (85%)', position: 'insideTopRight', fontSize: 9, fill: '#6366F1', fontWeight: 'bold' }} />
                  <Bar 
                    dataKey="completion" 
                    fill="#6366F1" 
                    radius={[6, 6, 0, 0]} 
                    barSize={24}
                  >
                    {homeworkChartData.map((entry, index) => {
                      let barColor = '#4F46E5';
                      if (entry.completion === 100) barColor = '#10B981'; // perfect green
                      else if (entry.completion < 60) barColor = '#F43F5E'; // red flag
                      return <Cell key={`cell-${index}`} fill={barColor} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400">
            **Rohan Gupta** leads with a pristine **100% homework rate**, while **Diya Patel** needs severe homework remediation at **54%**.
          </div>
        </div>

        {/* 4. CLASS STRENGTHS VS WEAKNESSES (Horizontal Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Aggregated Roster Focus Weaknesses
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Horizontal representation showing common struggle topics ranked by shared student counts.</p>
              </div>
              <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Struggle Strands
              </span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={weakTopicsData} 
                  layout="vertical"
                  margin={{ top: 10, right: 15, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis 
                    type="number" 
                    domain={[0, 4]} 
                    allowDecimals={false}
                    stroke="#94A3B8" 
                    fontSize={10} 
                  />
                  <YAxis 
                    type="category" 
                    dataKey="topic" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontWeight={700}
                    width={110}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '10px', border: 'none', color: '#FFF' }}
                    itemStyle={{ fontSize: '11px' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}
                  />
                  <Bar 
                    dataKey="studentsCount" 
                    fill="#EF4444" 
                    radius={[0, 6, 6, 0]} 
                    barSize={16}
                    name="Students struggling"
                  >
                    {weakTopicsData.map((entry, index) => {
                      const colors = ['#F43F5E', '#FB7185', '#FDA4AF', '#FECDD3', '#FFE4E6'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>**Trigonometry** & **Geometry** affect multiple cohorts — recommend holding a combined tutoring revision lab.</span>
          </div>
        </div>

      </div>

      {/* TOP PERFORMERS VS NEEDS ATTENTION SIDE-BY-SIDE PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Panel: Top Performers */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-50 mb-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-indigo-500" /> Top Performing Students
            </h4>
            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
              Accelerated Group
            </span>
          </div>

          <div className="space-y-3">
            {topPerformers.map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400">#0{idx+1}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${student.avatarColor} border shrink-0`}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{student.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{student.grade} • {student.subject.split(',')[0]}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average score</span>
                  <span className="font-mono font-extrabold text-indigo-600">{student.averageGrade}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Needs Attention */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-50 mb-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" /> Needs Urgent Remediation
            </h4>
            <span className="text-[9px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
              Target revision
            </span>
          </div>

          <div className="space-y-3">
            {needsAttention.map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-rose-400 animate-pulse">Alert</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${student.avatarColor} border shrink-0`}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{student.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{student.grade} • focus weakness: {student.weakTopics[0] || 'Numericals'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average score</span>
                  <span className="font-mono font-extrabold text-rose-500">{student.averageGrade}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI ROSTER RECOMMENDATIONS SUMMARY PANEL (Gemini powered) */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-850 shadow-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_60%)]" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-900/50 p-2 rounded-xl text-teal-400 border border-indigo-800">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg font-display">AI Tutoring Recommendations</h3>
                <p className="text-xs text-slate-300 mt-0.5">Automated class-wide analysis generated using test histories and diagnostic weak topics.</p>
              </div>
            </div>
            <span className="bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Powered by Gemini 3.5
            </span>
          </div>

          {apiError && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs rounded-xl p-3 font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span>{apiError}</span>
            </div>
          )}

          {/* AI generated markdown summary */}
          <div className="text-sm text-slate-300 leading-relaxed font-medium space-y-4 max-w-4xl bg-indigo-950/40 border border-indigo-900/50 p-5 md:p-6 rounded-2xl">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                <div className="relative">
                  <RotateCw className="w-8 h-8 text-teal-400 animate-spin" />
                  <Sparkles className="w-4 h-4 text-teal-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-sm">Processing roster performance matrices...</p>
                  <p className="text-xs text-slate-400 mt-0.5">Gemini is writing priority alerts and study guidelines</p>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-line text-xs md:text-sm">
                {aiReport}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-indigo-900/60 text-xs text-slate-400">
            <p className="max-w-xl">
              Tutor Recommendations update dynamically when student records are registered, scores are modified, or lesson observations are appended.
            </p>
            <button
              onClick={() => handleGenerateAIRecommendations(false)}
              disabled={isAnalyzing}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-all ${
                isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
              id="ai-recommendations-regenerate-btn"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Regenerate Analysis'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
