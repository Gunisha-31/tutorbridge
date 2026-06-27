import React, { useState, useRef, useEffect } from 'react';
import { Message, Student } from '../types';
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
  Smile
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIMentorViewProps {
  students: Student[];
}

export default function AIMentorView({ students }: AIMentorViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'model',
      content: `Hello! I am your **TutorBridge AI Mentor**. 🎓  
I am a senior pedagogical advisor and educational specialist. My purpose is to help you (Ananya Rao) optimize your tutoring methodologies, coordinate curricula, and coach your students effectively.

I have full, secure diagnostic access to your student roster (including **Aarav**, **Diya**, **Rohan**, **Sara**, and **Vihaan**). If you ask me about any student by name, I will consult their exact records to help you design a target plan.

**How can I support you today?**  
Choose one of the starter coaching prompts below or type your custom query!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Pre-loaded coaching suggestion queries exactly as specified
  const starterQuestions = [
    { 
      text: "How do I re-engage a student whose attendance is dropping?", 
      label: "Attendance Engagement", 
      icon: HeartHandshake,
      color: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
    },
    { 
      text: "Suggest a revision plan for Vihaan's trigonometry weakness.", 
      label: "Vihaan's Trig Plan", 
      icon: BookOpen,
      color: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" 
    },
    { 
      text: "What enrichment work suits Rohan?", 
      label: "Rohan's Enrichment Work", 
      icon: Zap,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
    }
  ];

  // Auto scroll chat to bottom when message arrives
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsLoading(true);

    // Prepare student roster contextual background for Gemini grounding
    const rosterContext = students.map(s => `
Student Profile:
- Name: ${s.name}
- Grade Level: ${s.grade}
- Current average score: ${s.averageGrade}% (Status: ${s.status})
- Attendance: ${s.attendance}%
- Homework completion rate: ${s.homeworkCompletion || 85}%
- Strengths: ${s.strongTopics.join(', ')}
- Weak Topics: ${s.weakTopics.join(', ')}
- Tutor observations: "${s.teacherObservation}"
- AI Diagnostic Insight: "${s.aiInsight}"
- Historical test timeline: ${s.testHistory.map(t => `${t.topic}: ${t.score}%`).join(' -> ')}
`).join('\n---\n');

    const systemInstruction = `You are TutorBridge AI Mentor, a highly experienced senior pedagogical coach, educational psychologist, and curriculum director. 
Your sole purpose is to advise the tutor (Ananya Rao) on teaching strategies, lesson planning, and student coaching. You are NOT an assistant for students, you are a mentor for the TUTOR.

You are fully aware of Ananya's current private tutoring roster of students:
=========================================
${rosterContext}
=========================================

Instructions:
1. Always ground your answers in the student roster details when the tutor mentions a student like Diya, Vihaan, Rohan, Aarav, or Sara.
2. If they ask about attendance drop re-engagement, explicitly mention Diya Patel, who has a 71% attendance rate, a 57% average (marked Red), and has disengaged or missed online support sessions, and provide tailored advice.
3. If they ask about Vihaan's trigonometry plan, refer to Vihaan Reddy's actual weak topics (Trigonometry Identities, Mensuration formulas) and average (68%), and output a step-by-step 4-week active mastery revision schedule.
4. If they ask about Rohan's enrichment, refer to Rohan Gupta's profile (94% average, 98% attendance, top performer ready for olympiad-level material but prone to careless calculation errors), and give advanced number theory or geometry proof-writing strategies.
5. Focus on expert pedagogical methodologies: active recall, visual diagrams, socratic questioning, and scaffolded practice.
6. Provide concrete bullet points and checklists for classroom management, student motivation, curriculum planning, and assessment design.`;

    // Build dialogue payload representing history
    const dialogueHistory = [...messages, userMessage];
    const promptString = dialogueHistory.map(m => 
      `${m.role === 'user' ? 'Tutor' : 'Mentor'}: ${m.content}`
    ).join('\n') + `\nMentor:`;

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptString,
          systemInstruction
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-model`,
          role: 'model',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-err`,
          role: 'model',
          content: `⚠️ Sorry, I could not complete the coaching request: ${data.error || 'Server error'}. Please check your connection or environment parameters.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        content: `⚠️ Failed to communicate with TutorBridge full-stack API. Please make sure the node server is active on Port 3000.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in min-h-[560px]">
      
      {/* Left Column (1 Span): Quick suggestions panel */}
      <div className="lg:col-span-1 flex flex-col justify-between bg-white p-5 border border-slate-100 rounded-2xl shadow-sm select-none">
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Suggested Prompts</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click one of the curated diagnostic prompts below to get instant pedagogical guidance based on real student records:
          </p>
          <div className="flex flex-col gap-2.5">
            {starterQuestions.map((q, i) => {
              const IconComp = q.icon;
              return (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(q.text)}
                  className={`p-3 text-left border rounded-xl transition-all text-xs font-semibold flex items-start gap-2.5 cursor-pointer select-none ${q.color} ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{q.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Roster Status */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" /> Active Roster Links
          </p>
          <div className="flex flex-wrap gap-1.5">
            {students.map(s => (
              <span 
                key={s.id} 
                className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${
                  s.status === 'red' 
                    ? 'bg-rose-50 border-rose-100 text-rose-700' 
                    : s.status === 'amber' 
                      ? 'bg-amber-50 border-amber-150 text-amber-700' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}
              >
                {s.name}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 leading-normal pt-1">
            The AI Mentor is continuously grounded in student analytics and teacher notes.
          </p>
        </div>
      </div>

      {/* Right Columns (3 Span): Interactive Chat Dialogue Screen */}
      <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[580px] justify-between">
        
        {/* Chat Title bar */}
        <div className="p-4 md:p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 rounded-t-2xl select-none">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-150">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm block">TutorBridge AI Mentor</span>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Pedagogical Expert • Online
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Model: gemini-3.5-flash</span>
        </div>

        {/* Conversation flow container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/30 select-text">
          {messages.map((m) => {
            const isModel = m.role === 'model';
            return (
              <div 
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar bubble */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold border shadow-sm select-none ${
                  isModel 
                    ? 'bg-slate-900 text-teal-400 border-slate-800' 
                    : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}>
                  {isModel ? 'AI' : 'AR'}
                </div>

                {/* Message text bubble */}
                <div className={`rounded-2xl p-4 shadow-sm text-xs border ${
                  isModel 
                    ? 'bg-white border-slate-100 text-slate-700 leading-relaxed' 
                    : 'bg-indigo-600 border-indigo-500 text-white leading-relaxed font-medium'
                }`}>
                  {isModel ? (
                    <div className="prose prose-sm max-w-none prose-indigo prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-3 prose-headings:mb-1.5 text-xs text-slate-700">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                  <span className={`block text-[9px] mt-1.5 text-right font-mono select-none ${isModel ? 'text-slate-400' : 'text-indigo-200'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator bubble */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold border bg-slate-900 text-teal-400 border-slate-800">
                AI
              </div>
              <div className="rounded-2xl p-4 shadow-sm text-xs border bg-white border-slate-100 text-slate-500 flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>AI Mentor is compiling pedagogical references...</span>
              </div>
            </div>
          )}
          
          <div ref={chatBottomRef} />
        </div>

        {/* Input submission footer form */}
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
              placeholder="Ask the Pedagogical Mentor anything (e.g. 'How should I help Diya?')..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none outline-offset-0 transition-all outline-indigo-600"
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
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
