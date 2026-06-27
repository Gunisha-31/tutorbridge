import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types';
import { 
  Send, 
  Bot, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  HeartHandshake, 
  Zap,
  HelpCircle,
  Users,
  CheckCircle,
  TrendingUp,
  FileText,
  Bookmark
} from 'lucide-react';

interface AIMentorViewProps {
  students: Student[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface ChatScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  badge: string;
  messages: ChatMessage[];
}

export default function AIMentorView({ students }: AIMentorViewProps) {
  // 4 Pre-loaded realistic pedagogical dialogue scenarios matching the requested tone
  const scenarios: ChatScenario[] = [
    {
      id: 'sc-scores',
      title: 'Analyze Student Scores',
      description: 'Review overall performance and locate core student weaknesses.',
      icon: TrendingUp,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      badge: 'Diagnostics',
      messages: [
        {
          id: 'sc1-m1',
          role: 'model',
          content: 'Hello! I am ready to analyze your cohort scores. How has everyone performed in their recent assessments, ma\'am?',
          timestamp: '09:12 AM'
        },
        {
          id: 'sc1-u1',
          role: 'user',
          content: 'Hi! How has everyone scored in the last test? Give me a concise breakdown.',
          timestamp: '09:13 AM'
        },
        {
          id: 'sc1-m2',
          role: 'model',
          content: `Hello! Here is your quick score diagnostic summary:
- **Rohan Gupta** & **Ishita Nair**: Outstanding performance. Both scored above **95%** on their midterms.
- **Aarav Mehta** & **Vihaan Reddy**: Steady, scoring in the high **70s to low 80s** range.
- **Diya Patel** & **Sara Khan**: Needs immediate attention. Diya scored **51%** and Sara is at **58%**.

**Key Blockers Detected:**
1. **Vihaan Reddy** continues to struggle with the concept of *Trigonometric Identities*.
2. **Sara Khan** faces consistent arithmetic speed blocks under time pressure.
3. **Diya Patel** exhibits severe conceptual gaps in *Quadratic Equations* compounded by drop in attendance.`,
          timestamp: '09:13 AM'
        }
      ]
    },
    {
      id: 'sc-assignments',
      title: 'Generate Custom Assignments',
      description: 'Create individual drill sheets addressing specific weak areas.',
      icon: BookOpen,
      color: 'border-indigo-200 bg-indigo-50 text-indigo-700',
      badge: 'Worksheets',
      messages: [
        {
          id: 'sc2-m1',
          role: 'model',
          content: 'Hello! Let\'s address target student weaknesses. Would you like me to prepare remediation drill sheets, sir?',
          timestamp: '09:20 AM'
        },
        {
          id: 'sc2-u1',
          role: 'user',
          content: 'Excellent. Make specialized homework assignments for both Vihaan and Diya targeting their respective weaknesses.',
          timestamp: '09:21 AM'
        },
        {
          id: 'sc2-m2',
          role: 'model',
          content: 'Done ma\'am. I have compiled and uploaded two highly tailored diagnostic assignments to their respective student profiles:\n\n1. **Vihaan\'s Trigonometric Mastery Drill**: 10 scaffolded questions starting from basic ratio proofs to complex double-angle identity verifications.\n2. **Diya\'s Quadratic Foundations Packet**: Visualized factorization models and 8 progressive algebraic factoring tasks to rebuild confidence.',
          timestamp: '09:21 AM'
        }
      ]
    },
    {
      id: 'sc-engagement',
      title: 'Student Engagement Strategy',
      description: 'Address dropping attendance rates and class disengagement.',
      icon: HeartHandshake,
      color: 'border-rose-200 bg-rose-50 text-rose-700',
      badge: 'Coaching',
      messages: [
        {
          id: 'sc3-m1',
          role: 'model',
          content: 'Hello! Consistent student attendance is vital for conceptual continuity. How can I assist with roster motivation today?',
          timestamp: '09:28 AM'
        },
        {
          id: 'sc3-u1',
          role: 'user',
          content: 'Diya is falling behind and missing our tutoring support sessions. How can we re-engage her?',
          timestamp: '09:29 AM'
        },
        {
          id: 'sc3-m2',
          role: 'model',
          content: `Hello! Re-engaging Diya Patel requires a quick, supportive, and structured approach:

1. **Incremental Wins**: In our next 1-on-1 session, allocate the first 15 minutes to simple, high-success probability problems (e.g., standard linear graphs) to re-trigger self-efficacy.
2. **Attendance Log Incentive**: Implement a "Weekly Streak Check" card. If she completes 3 consecutive sessions, reward her with an advanced visual math riddle card (which she enjoys).
3. **Structured Parent Check-in**: I have drafted a collaborative, gentle check-in email to Meera Patel. It emphasizes supporting Diya at home rather than criticizing scores.

Should I prepare the progress letter draft for her parents now?`,
          timestamp: '09:30 AM'
        }
      ]
    },
    {
      id: 'sc-midterm',
      title: 'Enrichment & Test Preparation',
      description: 'Plan custom exam timelines and high-achiever worksheets.',
      icon: Zap,
      color: 'border-amber-200 bg-amber-50 text-amber-700',
      badge: 'Enrichment',
      messages: [
        {
          id: 'sc4-m1',
          role: 'model',
          content: 'Hello! I can help you draft term tests, design syllabus plans, or organize high-achiever enrichment challenges.',
          timestamp: '09:35 AM'
        },
        {
          id: 'sc4-u1',
          role: 'user',
          content: 'What enrichment work suits Rohan? He is scoring 94% but makes careless errors.',
          timestamp: '09:36 AM'
        },
        {
          id: 'sc4-m2',
          role: 'model',
          content: 'Done sir. I have compiled an **Elite Olympiad Number Theory Challenge** containing 5 deep proof-based questions. To curb his careless calculations, I added a "Verification Criteria Checklist" at the end of his sheet. He must sign off on his step-by-step arithmetic checks before submitting.',
          timestamp: '09:37 AM'
        }
      ]
    }
  ];

  const [activeScenarioId, setActiveScenarioId] = useState<string>('sc-scores');
  // Initialize dynamic message streams copy based on scenarios so users can interact individually
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(() => {
    const initial: Record<string, ChatMessage[]> = {};
    scenarios.forEach(sc => {
      initial[sc.id] = [...sc.messages];
    });
    return initial;
  });

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeMessages = conversations[activeScenarioId] || [];

  // Auto-scroll logic
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isLoading]);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active conversation
    setConversations(prev => ({
      ...prev,
      [activeScenarioId]: [...prev[activeScenarioId], userMessage]
    }));
    setInputMsg('');
    setIsLoading(true);

    // Simulate direct, polite, and action-oriented pedagogical AI responses
    setTimeout(() => {
      let responseText = '';
      const lowercaseInput = text.toLowerCase();

      // Simple keyword matching grounded in active student profiles
      if (lowercaseInput.includes('diya')) {
        responseText = "Hello! Diya Patel (Grade 10) currently has a 57% average and 71% attendance. I have reviewed her quadratic equation blockers. Done ma'am. I have uploaded a 15-minute remedial workbook to her profile and prepared a gentle email draft to her mother Meera Patel.";
      } else if (lowercaseInput.includes('rohan')) {
        responseText = "Hello! Rohan Gupta is performing wonderfully at 94% average. Done sir. I have compiled a set of advanced algebraic proof worksheets for him and added an verification checklist to address his careless errors.";
      } else if (lowercaseInput.includes('vihaan')) {
        responseText = "Hello! Vihaan Reddy (Grade 10) is doing well but has conceptual blocks in Trigonometric Identities. Done ma'am. I have structured a targeted 3-part active recall exercise on his dashboard.";
      } else if (lowercaseInput.includes('sara')) {
        responseText = "Hello! Sara Khan (Grade 10) is currently at 58% average and struggles with timed calculations. Done sir. I have configured a set of short, low-pressure 5-minute mathematics arithmetic sprints on her dashboard.";
      } else if (lowercaseInput.includes('aarav')) {
        responseText = "Hello! Aarav Mehta (Grade 10) is stable at 84% average. Done ma'am. I have reviewed his linear graphs timeline and prepared a visual revision guide for his upcoming review.";
      } else if (lowercaseInput.includes('test') || lowercaseInput.includes('assignment') || lowercaseInput.includes('quiz')) {
        responseText = "Hello! Done ma'am. I have generated a customized 15-question formative quiz based on your student roster's individual weak topics and updated it in the diagnostic queue.";
      } else if (lowercaseInput.includes('report') || lowercaseInput.includes('email')) {
        responseText = "Hello! Done sir. I have compiled personalized academic progress transcripts for all students on your roster and queued the automated emails to their respective parent IDs.";
      } else {
        responseText = "Hello! Done ma'am. I have processed your instruction and applied the pedagogical coaching recommendation to your student roster logs. Please let me know if you would like me to draft an assignment or a progress letter.";
      }

      const modelMessage: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: 'model',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => ({
        ...prev,
        [activeScenarioId]: [...prev[activeScenarioId], modelMessage]
      }));
      setIsLoading(false);
    }, 850);
  };

  const handleResetScenarios = () => {
    const initial: Record<string, ChatMessage[]> = {};
    scenarios.forEach(sc => {
      initial[sc.id] = [...sc.messages];
    });
    setConversations(initial);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in min-h-[580px]">
      
      {/* Left Column (1 Span): Scenario Switcher Panel */}
      <div className="lg:col-span-1 flex flex-col justify-between bg-white p-5 border border-slate-100 rounded-2xl shadow-sm select-none">
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600 animate-pulse" />
              <h3 className="font-bold text-slate-900 text-sm font-display">Mentor Chat</h3>
            </div>
            <button 
              onClick={handleResetScenarios}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
              title="Reset sample conversations"
            >
              Reset Chats
            </button>
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Switch between these preloaded scenario conversations to see the AI Mentor in action with the teacher:
          </p>

          <div className="flex flex-col gap-2.5">
            {scenarios.map((sc) => {
              const IconComp = sc.icon;
              const isActive = activeScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setActiveScenarioId(sc.id);
                  }}
                  className={`w-full p-3 text-left border rounded-xl transition-all flex flex-col gap-1.5 cursor-pointer select-none ${
                    isActive 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm shadow-indigo-50' 
                      : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {sc.badge}
                    </span>
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">{sc.title}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-2 leading-normal">{sc.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Classroom Info Block */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-500" /> Grounded Student Roster
          </p>
          <div className="flex flex-wrap gap-1">
            {students.map(s => (
              <span 
                key={s.id} 
                className="text-[9px] font-extrabold bg-slate-50 border border-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
              >
                {s.name.split(' ')[0]}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            The AI acts as an expert coaching assistant for Ananya Rao. It delivers immediate, high-fidelity offline responses.
          </p>
        </div>
      </div>

      {/* Right Columns (3 Span): Chat Dialogue Frame */}
      <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[580px] justify-between">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/40 rounded-t-2xl select-none">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-teal-400 shadow-sm border border-slate-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs md:text-sm block">TutorBridge AI Mentor</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  Offline Demo
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Pedagogical Advisor • Active
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block">Status: Verified Logs</span>
            <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5 block">Ananya Rao's Lounge</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/20 select-text">
          {activeMessages.map((m) => {
            const isModel = m.role === 'model';
            return (
              <div 
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold border shadow-sm select-none ${
                  isModel 
                    ? 'bg-slate-900 text-teal-400 border-slate-800' 
                    : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}>
                  {isModel ? 'AI' : 'AR'}
                </div>

                {/* Bubble Body */}
                <div className={`rounded-2xl p-4 shadow-sm text-xs border leading-relaxed ${
                  isModel 
                    ? 'bg-white border-slate-100 text-slate-700 font-sans' 
                    : 'bg-indigo-600 border-indigo-500 text-white font-medium'
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span className={`block text-[8px] mt-1.5 text-right font-mono select-none ${isModel ? 'text-slate-400' : 'text-indigo-200'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold border bg-slate-900 text-teal-400 border-slate-800">
                AI
              </div>
              <div className="rounded-2xl p-4 shadow-sm text-xs border bg-white border-slate-100 text-slate-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>AI Mentor is responding...</span>
              </div>
            </div>
          )}
          
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-50 bg-white rounded-b-2xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMsg);
            }} 
            className="flex gap-2"
          >
            <input
              type="text"
              disabled={isLoading}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask for score analysis or make custom drills (e.g., 'Make an assignment for Rohan')..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMsg.trim()}
              className={`p-3 rounded-xl shadow-md flex items-center justify-center text-white transition-all shrink-0 cursor-pointer ${
                isLoading || !inputMsg.trim() 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2.5 flex items-center gap-1.5 justify-center text-[10px] text-slate-400 select-none">
            <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tone Rule: Concise, polite responses using "Hello!" and "Done ma'am/sir".</span>
          </div>
        </div>

      </div>

    </div>
  );
}
