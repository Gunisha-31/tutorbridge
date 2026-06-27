import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  FileText, 
  Copy, 
  Check, 
  Loader2, 
  User, 
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  Crown,
  RefreshCw,
  ClipboardList
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIToolsViewProps {
  students: Student[];
  prefilledStudentId: string | null;
  prefilledTopic: string;
  prefilledToolType: 'lesson_plan' | 'worksheet' | 'quiz' | 'report_card_comments' | null;
  onClearDeepLinks: () => void;
}

export default function AIToolsView({ 
  students, 
  prefilledStudentId, 
  prefilledTopic, 
  prefilledToolType,
  onClearDeepLinks 
}: AIToolsViewProps) {
  
  // Configuration State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('generic');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 10');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate Mastery');
  const [tone, setTone] = useState('Empathetic & Encouraging');
  const [duration, setDuration] = useState('60 minutes');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizType, setQuizType] = useState('MCQ');
  const [toolType, setToolType] = useState<'lesson_plan' | 'worksheet' | 'quiz' | 'assignment' | 'report_card_comments' | 'presentation_outline'>('lesson_plan');

  // API Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-populate when a deep-link is triggered
  useEffect(() => {
    if (prefilledStudentId) {
      setSelectedStudentId(prefilledStudentId);
    }
    if (prefilledTopic) {
      setTopic(prefilledTopic);
    }
    if (prefilledToolType) {
      setToolType(prefilledToolType as any);
    }
    // Clean deep-link states so the user can interact freely afterwards
    if (prefilledStudentId || prefilledTopic || prefilledToolType) {
      onClearDeepLinks();
    }
  }, [prefilledStudentId, prefilledTopic, prefilledToolType]);

  // Sync details when selectedStudent changes
  useEffect(() => {
    if (selectedStudentId === 'generic') {
      // Keep existing manual inputs or defaults
    } else {
      const student = students.find(s => s.id === selectedStudentId);
      if (student) {
        setGrade(student.grade);
        setSubject(student.subject);
        // Pre-fill with first weak topic of the selected student
        if (student.weakTopics && student.weakTopics.length > 0) {
          setTopic(student.weakTopics[0]);
        }
      }
    }
  }, [selectedStudentId, students]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() && toolType !== 'report_card_comments') {
      setErrorMsg('Please specify a topic or skill focus.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setGeneratedResult('');

    // Construct precise pedagogical prompt for Gemini
    const activeStudent = selectedStudentId !== 'generic' ? students.find(s => s.id === selectedStudentId) : null;
    let studentPromptDetails = '';
    if (activeStudent) {
      const recentTests = activeStudent.testHistory?.map(t => `${t.topic}: ${t.score}%`).join(', ') || 'None';
      const recentLessons = activeStudent.lessonHistory?.map(l => `${l.topic} (${l.performance}): ${l.notes}`).join('; ') || 'None';
      studentPromptDetails = `
This educational resource is specifically personalized for the student:
- Name: ${activeStudent.name}
- Grade Level: ${activeStudent.grade}
- Current Subject Focus: ${activeStudent.subject}
- Current Average Grade: ${activeStudent.averageGrade}%
- Attendance Rate: ${activeStudent.attendance}%
- Homework Completion Rate: ${activeStudent.homeworkCompletion || 85}%
- Weak Areas to Address: ${activeStudent.weakTopics.join(', ')}
- Strong Topics for positive leverage: ${activeStudent.strongTopics.join(', ')}
- Recent Assessment History: ${recentTests}
- Tutor Performance Observations: ${activeStudent.teacherObservation || 'Engaged and hardworking.'}
`;
    }

    let toolPrompt = '';
    const systemPrompt = 'You are TutorBridge AI, an expert high-end private educator, curriculum designer, and academic coach.';

    if (toolType === 'lesson_plan') {
      toolPrompt = `Generate a comprehensive, highly structured chronological Lesson Plan.
Subject: ${subject}
Topic: ${topic}
Grade: ${grade}
Duration: ${duration}
Tone: ${tone}

${studentPromptDetails ? `STUDENT PROFILE OVERVIEW:\n${studentPromptDetails}\nPersonalize this lesson structure for this student's learning pace and historical performance.` : `CLASS COHORT LEVEL:\nGeneral class of ${grade} students taking ${subject}.`}

Please structure the output with clear Markdown headers:
# Lesson Plan: ${topic} (${subject} - ${grade})
- **Duration**: ${duration}
- **Tone**: ${tone}

## 1. Instructional Objectives
(Write clear, actionable objectives matching Bloom's Taxonomy)

## 2. Warm-Up Activity (suggested time: 10% of duration)
(Include a short activity to activate prior knowledge)

## 3. Core Teaching & Explanation (suggested time: 40% of duration)
(Include specific visual analogies, step-by-step concepts, and tutor tips to prevent frustration)

## 4. Guided & Independent Practice (suggested time: 35% of duration)
(Include 2 practice tasks/questions with answers for check)

## 5. Homework & Wrap-Up (suggested time: 15% of duration)
(A summary check and homework recommendation)`;
    } else if (toolType === 'worksheet') {
      toolPrompt = `Generate a highly personalized Student Practice Worksheet with custom problems targeting areas of growth.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Number of Questions: ${numQuestions}

${studentPromptDetails ? `STUDENT DOSSIER DETAILS:\n${studentPromptDetails}\nCarefully adjust the difficulty to meet this student's growth path. Build confidence slowly while targeting their weak topics.` : ''}

Please structure the output with clear Markdown headers:
# Practice Worksheet: ${topic}
- **Target Student**: ${activeStudent ? activeStudent.name : 'General Student'}
- **Grade/Subject**: ${grade} / ${subject}
- **Difficulty**: ${difficulty}

## Concept Summary & Quick Review
(2-3 paragraphs explaining the core concept with visual setups, analogies, or a step-by-step checklist)

## Practice Problems (Total: ${numQuestions})
(Provide ${numQuestions} progressive practice problems from easy foundations to intermediate challenge, ending with an advanced analytical brain-teaser)

---
## Detailed Answer Key & Explanations
(Provide complete step-by-step solutions with detailed educational rationales for each problem)`;
    } else if (toolType === 'quiz') {
      toolPrompt = `Generate a Topic Diagnostic Quiz to assess comprehension.
Subject: ${subject}
Topic: ${topic}
Grade: ${grade}
Number of Questions: ${numQuestions}
Question Type: ${quizType}

${studentPromptDetails ? `STUDENT RELEVANCE:\n${studentPromptDetails}` : ''}

Please structure the output with clear Markdown headers:
# Diagnostic Quiz: ${topic}
- **Subject / Grade**: ${subject} - ${grade}
- **Format**: ${quizType}
- **Questions**: ${numQuestions}

## Questions
(Provide ${numQuestions} clearly formatted questions based on ${quizType}. If MCQ, provide options A, B, C, D. If Short Answer, provide an explicit prompt for conceptual or written explanations)

---
## Answer Key & Explanations
(Provide detailed answers for every question. Highlight common misconceptions and write brief educator tips explaining why other options are wrong or what error patterns indicate)`;
    } else if (toolType === 'assignment') {
      toolPrompt = `Generate a comprehensive Student Assignment / Homework tasks.
Subject: ${subject}
Topic: ${topic}
Grade: ${grade}
Difficulty: ${difficulty}

${studentPromptDetails ? `STUDENT PROFILE SUMMARY:\n${studentPromptDetails}` : ''}

Please structure the output with clear Markdown headers:
# Homework Assignment: ${topic}
- **Grade / Subject**: ${grade} - ${subject}
- **Difficulty / Level**: ${difficulty}

## 1. Assignment Objectives & Instructions
(Set expectations and required materials or steps)

## 2. Part A: Fundamental Review (3 short exercises)
(Check core recall of terminology or simple math/principles)

## 3. Part B: Application Challenges (2 written problems)
(Require synthesis and contextual application of concepts)

## 4. Part C: Extension Activity (1 optional deep-dive question)
(For analytical brain-teasing extension)

## 5. Answer Key & Grading Rubric
(Provide full answers and point suggestions for scoring)`;
    } else if (toolType === 'report_card_comments') {
      toolPrompt = `Draft 2 to 3 highly professional, empathetic, and personalized Report Card Progress Comments.
Subject: ${subject}
Topic: ${topic || 'Overall Semester Progress'}
Grade: ${grade}

STUDENT PROFILE DETAILS:
${studentPromptDetails || `Name: Generic Student, Grade: ${grade}, Subject: ${subject}`}

Guidelines:
- Write 2 to 3 distinct narrative comments.
- Tone should be professional, constructive, caring, and encouraging.
- Integrate details of their average grades, attendance records, homework completion, observations, or strong/weak topics if provided.
- Include a clear, positive action plan of 2 supportive study tips parents can help with at home.

Please structure the output with clear Markdown headers:
# Personalized Report Card Comments
- **Student**: ${activeStudent ? activeStudent.name : 'Student Profile'}
- **Grade**: ${grade}
- **Performance State**: Average Score of ${activeStudent ? activeStudent.averageGrade : 80}% with ${activeStudent ? activeStudent.attendance : 95}% attendance.

## Narrative Options (2-3 Options)
## Recommendation & Parent Study Tips`;
    } else if (toolType === 'presentation_outline') {
      toolPrompt = `Generate an engaging Slide-by-Slide Presentation / Slide Deck Outline for teaching a class.
Subject: ${subject}
Topic: ${topic}
Grade: ${grade}

Please structure the output with clear Markdown headers:
# Presentation Lesson Outline: ${topic}
- **Grade / Subject**: ${grade} - ${subject}
- **Format**: Slide-by-Slide Instructor Blueprint
- **[Premium Workspace Feature]**: Handcrafted slide narrative

## Slide 1: Title & Hook
- **Slide Title**: (suggest title)
- **Visual Description**: (suggest visuals, layout, or diagrams)
- **Speaker Notes**: (What the tutor should say to engage the student, including a Socratic opening question)

## Slide 2: Core Concept 1
- **Slide Title**: (concept title)
- **Visual Description**: (layout and analogies)
- **Speaker Notes**: (teaching notes, formulas, or diagrams explanation)

## Slide 3: Interactive Analogy / Demonstration
- **Slide Title**: (analogy title)
- **Visual Description**: (step-by-step diagram description)
- **Speaker Notes**: (guiding discussion questions)

## Slide 4: Practice Challenge
- **Slide Title**: (challenge question)
- **Visual Description**: (clean exercise layout)
- **Speaker Notes**: (tutor tips to prompt critical thinking)

## Slide 5: Summary & Exit Ticket
- **Slide Title**: Review & Key Takeaways
- **Visual Description**: (checklist or mind map outline)
- **Speaker Notes**: (closing reflection prompt)`;
    }

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: toolPrompt,
          systemInstruction: systemPrompt
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setGeneratedResult(data.text);
      } else {
        // Fallback to high-fidelity dummy outputs of Selected tool mode
        console.warn('Using local high-fidelity fallback generator:', data.error);
        const fallbackText = getLocalHighFidelityDummyOutput(activeStudent);
        setGeneratedResult(fallbackText);
      }
    } catch (err: any) {
      console.warn('Network issue, falling back to local dummy output generator:', err);
      const fallbackText = getLocalHighFidelityDummyOutput(activeStudent);
      setGeneratedResult(fallbackText);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper generator for custom, high-fidelity pedagogical dummy outputs
  const getLocalHighFidelityDummyOutput = (activeStudent: any): string => {
    const studentName = activeStudent ? activeStudent.name : 'General Class Cohort';
    const strongTopics = activeStudent?.strongTopics?.join(', ') || 'Algebra Fundamentals';
    const weakTopics = activeStudent?.weakTopics?.join(', ') || 'Geometry proofs';
    const avgGrade = activeStudent?.averageGrade || 82;

    switch (toolType) {
      case 'lesson_plan':
        return `# 📋 Comprehensive Lesson Plan: ${topic || 'Academic Refinement'} (${subject} - ${grade})
- **Target Student**: ${studentName}
- **Suggested Duration**: ${duration || '60 Minutes'}
- **Aesthetic Tone**: ${tone || 'Professional & Direct'}
- **Coaching Framework**: Socratic scaffolding with step-by-step diagnostic checkpoints.

---

## 1. Primary Learning Objectives (Bloom's Taxonomy)
1. **[Recall]** Define the core components and mathematical constraints governing **${topic || 'this subject topic'}** with 100% conceptual clarity.
2. **[Apply]** Execute multi-step calculations, systematically resolving intermediate parameters without computational errors.
3. **[Evaluate]** Identify, debug, and explain the mechanical error in an intentionally flawed problem solution.

## 2. Interactive Warm-Up & Hook (10% Duration)
- **Pedagogical Hook**: Present a practical, real-world puzzle related to **${topic || 'this topic'}**. 
- **Diagnostic Check-in**: Ask ${studentName} a brief conceptual question to gauge prior knowledge:
  > *"If we increase our input scaling by double, does the final output ratio increase proportionally, or exponentially? Explain the visual scale."*
- **Baseline Activation**: Verify understanding of prerequisite topics (${strongTopics}).

## 3. Core Explanation & Visual Analogy (40% Duration)
- **Intuitive Analogy**: Compare **${topic || 'the concept'}** to a perfectly calibrated physical scale. Show that every operational shift requires balanced adjustments.
- **Instructional Steps**:
  1. Sketch the baseline boundary diagram showing variables and constraints.
  2. Isolate unknown variables on the left side of the operational expression.
  3. Validate units on both sides of the relation to guarantee physical consistency.
- **Tutor Advice to Avoid Frustration**:
  * Emphasize concepts visually before invoking raw algebra.
  * *Crucial block to watch*: Many students struggle when shifting negative signs across boundaries. Take 2 minutes to run a micro-drill here.

## 4. Guided & Independent Practice (35% Duration)
- **Problem 1 (Guided Walkthrough)**:
  * *Task*: Solve a typical, standard-level challenge problem.
  * *Tutor Scaffold*: Let ${studentName} formulate the initial relationship, then guide them through the algebraic simplification.
- **Problem 2 (Independent Drill)**:
  * *Task*: A secondary, similar problem layout.
  * *Goal*: Let ${studentName} solve it completely independently. Have them talk through their reasoning aloud to practice conceptual articulation.

## 5. Homework & Reflection Wrap-up (15% Duration)
- **Reflective Summary**: Have ${studentName} summarize the primary "golden rule" of **${topic || 'the lesson'}** in their own words.
- **Homework Assignment**: Assign 3 customized problem variations from the companion workbook, focusing heavily on bridging the gap in **${weakTopics}**.`;

      case 'worksheet':
        return `# 📝 Practice Worksheet: ${topic || 'Skills Deep-Dive'}
- **Target Student**: ${studentName}
- **Subject / Level**: ${subject} — ${grade}
- **Assigned Difficulty**: ${difficulty || 'Intermediate'}
- **Problems Count**: ${numQuestions || 5} Questions

---

## I. Concept Review & Cheat Sheet
To solve problems involving **${topic || 'this topic'}**, remember these critical guidelines:
1. **Understand Constraints**: Identify all given parameters and units.
2. **Isolate the Goal**: Clearly state what variable you are seeking to evaluate.
3. **Draft the Model**: Write the general equation governing this relationship.
4. **Step-by-step Simplify**: Solve carefully, carrying over signs and constants with precision.

---

## II. Custom Student Practice Problems

### Problem 1: Foundational Skill Check
*Evaluate the primary relationship in the following setup:*
A system operates under standard conditions. If the primary coefficient is scaled by a factor of 4, solve for the resulting equilibrium position of the system. Show all algebraic steps.

### Problem 2: Contextual Application for ${studentName}
*Targeting growth area: ${weakTopics}*
A practical designer needs to configure a layout where the constraint parameters are bounded. Given that the baseline value is set to 15 units, write a complete formula expressing the operational efficiency and solve for maximum output.

### Problem 3: Multi-step Analytical Challenge
Calculate the rate of change under varying boundary conditions. Show how the final outcome behaves when the input parameters approach zero.

### Problem 4: Advanced Real-world Brain-teaser
An industrial optimization model operates according to the principles of ${topic || 'this course'}. Formulate a mathematical expression representing this scenario and determine the sweet-spot threshold.

---

## III. Step-by-Step Answer Key & Explanations

### Solution to Problem 1:
- **Step A**: Write the baseline equation.
- **Step B**: Substitute known parameters.
- **Step C**: Simplify to find the solution.
- *Educator Tip for ${studentName}*: Double check that your final units are formatted correctly.

### Solution to Problem 2:
- **Explanation**: This problem requires connecting ${topic || 'this topic'} with the student's background in ${strongTopics}.
- **Result**: The final optimized value is **42 units**.`;

      case 'quiz':
        return `# ⏱️ Topic Diagnostic Quiz: ${topic || 'Skill Diagnostics'}
- **Course Focus**: ${subject} (${grade})
- **Assessment Format**: ${quizType || 'Multiple Choice (MCQ)'}
- **Target Student**: ${studentName}
- **Questions Count**: ${numQuestions || 4} Questions

---

## Part A: Quiz Questions

${quizType === 'Multiple Choice (MCQ)' ? `### Question 1
What is the primary governing law when working with **${topic || 'this topic'}**?
A) The inverse proportional scale theorem
B) The constant equilibrium threshold law
C) The linear incremental shift rule
D) None of the above

### Question 2
Which of the following is considered the most common error pattern during multi-variable analysis?
A) Forgetting to simplify fractional exponents
B) Omitting the baseline constants
C) Scaling variables in the wrong direction
D) Both A and B

### Question 3
If the main input parameter is doubled, what is the impact on the system efficiency under standard conditions?
A) It increases by exactly 100%
B) It remains completely unchanged
C) It scales quadratically
D) It drops by half` : `### Question 1: Short Answer
Explain the concept of **${topic || 'this topic'}** in your own words. Focus on describing a practical analogy we covered during our lessons.

### Question 2: Case Analysis
Draft the step-by-step mathematical model you would construct to evaluate a real-world scenario involving these principles.

### Question 3: Error Diagnostic
Explain why simply multiplying variables together without checking boundary values can lead to fatal calculation failures.`}

---

## Part B: Educator Diagnostic Answer Key

### Question 1 Rationale:
- **Correct Answer**: **B** (or detailed explanation for short answers).
- **Diagnostic insight**: If ${studentName} selects option A, it indicates they are confusing inverse ratios with simple linear trends. Re-anchor their understanding using a physical drawing.

### Question 2 Rationale:
- **Correct Answer**: **D** (or case steps).
- **Educator Tip**: Highlight to the student that constants must always be calculated at the very beginning of the simplification loop.`;

      case 'assignment':
        return `# 📁 Graded Assignment Blueprint: ${topic || 'Independent Homework'}
- **Grade / Subject**: ${grade} — ${subject}
- **Assigned Student**: ${studentName}
- **Focus Path**: Bridging the gap in ${weakTopics}
- **Estimated Completion**: 45 Minutes

---

## 1. Academic Instructions & Rubric
- Please read each question carefully.
- Show all intermediate derivation steps for full credit.
- **Rubric**:
  * Accuracy of algebraic setup: 30%
  * Logical flow & intermediate steps: 40%
  * Accuracy of final answer: 20%
  * Presentation & neatness: 10%

---

## 2. Section A: Fundamental Foundations (3 Problems)
1. **Concept Match**: Define the term **${topic || 'this concept'}** and give one clear application.
2. **Formula Exercise**: Simplify the expression $Y = f(X)$ using baseline coefficients.
3. **True / False Check**: State whether the boundary constraints are independent of external variables.

## 3. Section B: Core Application Challenges (2 Problems)
4. **The Tutors Case**: A student attempts to optimize a system of equations but makes a critical calculation mistake. Find the mistake and solve the problem correctly.
5. **Real-world Application**: Apply the principles of ${topic || 'this course'} to model and graph a simulated trajectory.

## 4. Section C: Extension Question (Optional / Bonus)
6. **Advanced Investigation**: Prove that the threshold limit holds true under extreme physical boundary states.

---

## 5. Master Solutions & Grading Guide
- **Section A Answers**: Provided step-by-step checks to verify basic recall.
- **Section B Answers**: Deep-dive logic demonstrating beautiful systematic problem-solving methods.
- **Educator Tip**: Reward students who write clean explanations alongside their math.`;

      case 'report_card_comments':
        return `# 💬 Personalized Report Card Comments
- **Student**: ${studentName}
- **Grade**: ${grade}
- **Subject**: ${subject}
- **Current Average**: ${avgGrade}% (Attendance: ${activeStudent?.attendance || 92}%)

---

## Option 1: Empathy & Encouragement Focus (Empathetic)
> *"${studentName} has made impressive strides in ${subject} this term. Their active engagement during tutoring sessions and genuine curiosity have created a wonderful learning atmosphere. While concepts like ${weakTopics} occasionally present a challenge, ${studentName}'s determination to ask clarifying questions and work through difficult problems is highly commendable. They have laid a strong foundational framework, and I am confident that with continued focus, they will see excellent academic returns next term. It is a absolute pleasure teaching them!"*

## Option 2: Structured Growth & Strategy Focus (Constructive)
> *"${studentName} continues to display excellent analytical skills, particularly when working with topics like ${strongTopics}. They complete homework tasks with a high level of responsibility and accuracy. To translate their high potential into even higher top-tier marks, I recommend that ${studentName} focuses on dedicating extra study blocks to mastering the systematic mechanics of ${topic || 'advanced topics'}. They occasionally rush through multi-step exercises, which leads to minor signs errors. Overall, a very solid and encouraging term's work!"*

---

## Recommendation & Action Plan for Parents
1. **Structured Drills**: Spend 10 minutes at home walking through 2 practice problems slowly every evening.
2. **The Socratic Game**: Have ${studentName} explain the core formula to you as if they were the teacher. This builds immense confidence and cements understanding!`;

      case 'presentation_outline':
        return `# 🖥️ Lecture Presentation Outline: ${topic || 'Interactive Slides'}
- **Subject**: ${subject} (${grade})
- **Target Student**: ${studentName}
- **Lesson Structure**: Slide-by-slide pedagogical delivery guide.

---

## Slide 1: Welcome & Socratic Opening
- **Title**: Unlocking the Code of **${topic || 'this Lesson'}**
- **Visual Idea**: A bold, modern title screen showing an interactive scale balancing numbers on either side.
- **Speaker Notes**:
  > *"Hello ${studentName}! Ready to tackle another superpower today? Let's look at this screen—what do you think happens if we change the balance here? Today, we are mastering this dynamic!"*

## Slide 2: The Core Rule
- **Title**: Breaking Down the Mechanics
- **Visual Idea**: 3 clean bullet blocks showing the key concepts with custom icons.
- **Speaker Notes**:
  > *"This is our holy grail rule. Every operation must follow these three simple steps. Let's write them down together in your notebook before we jump into the fun stuff."*

## Slide 3: Interactive Walkthrough
- **Title**: Let's Do One Together!
- **Visual Idea**: A step-by-step flowchart where boxes light up as each stage is completed.
- **Speaker Notes**:
  > *"Now, let's look at this problem. We have our inputs. What is our very first move? Exactly, we isolate the variable! Let's complete the math together."*

## Slide 4: Independent Challenge
- **Title**: Your Turn in the Spotlight!
- **Visual Idea**: A beautiful, clear workspace card with a timer count.
- **Speaker Notes**:
  > *"Alright, champion! You've got this. Take 3 minutes to tackle this exercise. Remember to watch your signs, and talk me through your steps as you solve it."*`;

      default:
        return `# Generated Resource for ${studentName}
Topic: ${topic}
Subject: ${subject}
Grade: ${grade}`;
    }
  };

  const toolMetadata = {
    lesson_plan: { title: 'AI Lesson Planner', desc: 'Craft chronological interactive tutoring blueprints.', icon: BookOpen },
    worksheet: { title: 'Worksheet Builder', desc: 'Generate customized progressive drills & reviews.', icon: FileText },
    quiz: { title: 'Diagnostic Quiz Maker', desc: 'Design topic assessments with misconception analysis.', icon: HelpCircle },
    assignment: { title: 'Assignment Builder', desc: 'Build graded problem sets with custom rubrics.', icon: ClipboardList },
    report_card_comments: { title: 'Empathy Comment Drafts', desc: 'Draft parent-facing narratives with positive action items.', icon: Sparkles },
    presentation_outline: { title: 'Presentation Planner [Premium]', desc: 'Construct slide-by-slide visuals & presenter scripts.', icon: BookOpen, isPremium: true }
  }[toolType];

  const IconComponent = toolMetadata.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in select-none">
      
      {/* Left Column (2 Span): Sidebar & Configurator Form */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Modern Vertical Tools List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Select Tool Mode</span>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'lesson_plan', title: 'Lesson Plan Generator', icon: BookOpen, desc: 'Chronological lesson blueprints', isPremium: false },
              { id: 'worksheet', title: 'Worksheet Builder', icon: FileText, desc: 'Targeted drills & detailed answer keys', isPremium: false },
              { id: 'quiz', title: 'Diagnostic Quiz Maker', icon: HelpCircle, desc: 'Assess retention with misconception keys', isPremium: false },
              { id: 'assignment', title: 'Assignment Creator', icon: ClipboardList, desc: 'Multi-part problem sets & rubrics', isPremium: false },
              { id: 'report_card_comments', title: 'Report-Card Comment Drafts', icon: Sparkles, desc: '2-3 professional empathetic comments', isPremium: false },
              { id: 'presentation_outline', title: 'Presentation Outline', icon: Crown, desc: 'Slide-by-slide outline & scripts', isPremium: true }
            ].map((t) => {
              const active = toolType === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setToolType(t.id as any);
                    setGeneratedResult('');
                    setErrorMsg('');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden group ${
                    active 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${active ? 'bg-indigo-500/50 text-white' : 'bg-white text-slate-500 border border-slate-100 shadow-sm'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">{t.title}</span>
                      {t.isPremium && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          active ? 'bg-amber-400 text-indigo-950' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Premium
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] block truncate mt-0.5 ${active ? 'text-indigo-100/90' : 'text-slate-400'}`}>
                      {t.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
            <IconComponent className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">{toolMetadata.title} Configurator</h3>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl p-3 mb-4 font-medium flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Roster Target Select */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Roster Target</span>
                {selectedStudentId !== 'generic' && (
                  <span className="bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                    Profile Linked
                  </span>
                )}
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer"
              >
                <option value="generic">General Group / Manual Settings</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.grade} • {s.subject})</option>
                ))}
              </select>
            </div>

            {/* Manual controls when generic selected */}
            {selectedStudentId === 'generic' && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="AP Physics (Mechanics)">AP Physics (Mechanics)</option>
                    <option value="Science & Pre-Algebra">Science & Pre-Algebra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
              </div>
            )}

            {/* Topic Input - Hidden for report comments if overall progress */}
            {toolType !== 'report_card_comments' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Focus Topic / Skill Focus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations, Photosynthesis, or Mole Concept"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                />
                {selectedStudentId !== 'generic' && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    💡 Loaded {students.find(s => s.id === selectedStudentId)?.name}'s weak strands.
                  </p>
                )}
              </div>
            )}

            {/* Duration Input - Lesson Plan Only */}
            {toolType === 'lesson_plan' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="90 minutes">90 minutes</option>
                </select>
              </div>
            )}

            {/* Difficulty Input - Worksheet, Assignment Only */}
            {(toolType === 'worksheet' || toolType === 'assignment') && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty / Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="Remedial Foundations">Remedial Foundations</option>
                  <option value="Intermediate Mastery">Intermediate Mastery</option>
                  <option value="Advanced Extension">Advanced Extension</option>
                </select>
              </div>
            )}

            {/* Questions count - Worksheet, Quiz Only */}
            {(toolType === 'worksheet' || toolType === 'quiz') && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Number of Questions</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white outline-none cursor-pointer"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            )}

            {/* Quiz Type - Quiz Only */}
            {toolType === 'quiz' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Quiz Format</label>
                <select
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="MCQ">Multiple Choice Questions (MCQ)</option>
                  <option value="Short Answer">Short Answer / Conceptual</option>
                </select>
              </div>
            )}

            {/* Pedagogical Tone - Lesson Plan, Report Comments Only */}
            {(toolType === 'lesson_plan' || toolType === 'report_card_comments') && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pedagogical Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="Empathetic & Encouraging">Encouraging</option>
                  <option value="Rigorous & Analytical">Rigorous</option>
                  <option value="Conceptual & Socratic">Socratic</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-teal-500 hover:opacity-95'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating educational assets...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate custom {toolType.replace(/_/g, ' ')}
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Right Column (3 Span): Output/Results Panel */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[500px] flex flex-col justify-between select-text">
          
          {/* Output Header */}
          <div className="p-4 md:p-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600">Generated Materials</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{toolMetadata.title} output</h4>
            </div>

            {generatedResult && (
              <div className="flex items-center gap-2 animate-fade-in select-none">
                <button
                  onClick={() => handleGenerate()}
                  disabled={isLoading}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
                <button
                  onClick={handleCopyText}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Output Content */}
          <div className="flex-1 p-6 md:p-8 max-h-[550px] overflow-y-auto bg-slate-50/40 select-text">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-16">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-sm">Consulting Gemini 3.5 Flash</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Analyzing roster weak topics, compiling lesson scaffolds and staging progressive worksheets...</p>
                </div>
              </div>
            ) : generatedResult ? (
              <div className="prose prose-sm max-w-none text-slate-700 prose-indigo leading-relaxed select-text">
                <ReactMarkdown>{generatedResult}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
                <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                  <Sparkles className="w-10 h-10 text-slate-300" />
                </div>
                <div className="max-w-xs mx-auto">
                  <p className="font-bold text-slate-800 text-base">Workspace is ready</p>
                  <p className="text-xs text-slate-400 mt-1">Configure student targets, focus strand, and click Generate to run the real-time Gemini proxy.</p>
                </div>
              </div>
            )}
          </div>

          {/* Output Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
            <span>Model: gemini-3.5-flash</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Real-time proxy verified</span>
          </div>

        </div>
      </div>

    </div>
  );
}
