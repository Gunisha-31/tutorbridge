import { Student, Tutor, GeneratedToolOutput } from './types';

export const tutorSeed: Tutor = {
  name: "Ananya Rao",
  title: "Private Tutor & Founder, BrightMinds Tutoring",
  location: "Bengaluru, India",
  subjects: ["Mathematics", "Physics", "Chemistry (Grades 8–10)"],
  experience: "7 years",
  email: "ananya@tutorbridge.app",
  plan: "180-Day Plan",
  avatarInitials: "AR",
  tuitionSize: 6
};

export const studentsSeed: Student[] = [
  {
    id: "std-aarav",
    name: "Aarav Mehta",
    grade: "Grade 9",
    age: 14,
    subject: "Mathematics, Physics",
    status: "green",
    averageGrade: 77,
    attendance: 92,
    homeworkCompletion: 88,
    enrolled: "Jan 2025",
    weakTopics: ["Geometry (circle theorems)", "Trigonometry Basics"],
    strongTopics: ["Algebra", "Linear Equations"],
    parentName: "Rohit Mehta",
    parentEmail: "rohit.mehta@gmail.com",
    parentPhone: "+91 98450 11111",
    avatarColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    performanceTag: "Consistent",
    teacherObservation: "Responds very well to visual explanations. Confidence is clearly improving over the term.",
    aiInsight: "On an upward trajectory. Likely to struggle with upcoming coordinate geometry — revise circle theorems before the next test.",
    testHistory: [
      { id: "t-101", date: "2026-03-10", topic: "Unit Test 1 (Math)", score: 68 },
      { id: "t-102", date: "2026-04-15", topic: "Unit Test 2 (Math)", score: 78 },
      { id: "t-103", date: "2026-05-20", topic: "Midterm (Math)", score: 84 }
    ],
    lessonHistory: [
      {
        id: "l-101",
        date: "2026-06-12",
        topic: "Linear Equations & Graphing",
        performance: "Good",
        notes: "Aarav showed rapid understanding of slope-intercept form. Drew graph lines independently and precisely."
      },
      {
        id: "l-102",
        date: "2026-06-19",
        topic: "Introduction to Circle Theorems",
        performance: "Consistent",
        notes: "Introduced chords and central angles. Aarav was initially hesitant with proofs but responded very well once we used interactive geometry tools."
      }
    ]
  },
  {
    id: "std-diya",
    name: "Diya Patel",
    grade: "Grade 10",
    age: 15,
    subject: "Mathematics, Physics, Chemistry",
    status: "red",
    averageGrade: 57,
    attendance: 71,
    homeworkCompletion: 54,
    enrolled: "Aug 2024",
    weakTopics: ["Quadratic Equations", "Physics (motion numericals)"],
    strongTopics: ["Chemistry (basic organic)"],
    parentName: "Meera Patel",
    parentEmail: "meera.patel@yahoo.com",
    parentPhone: "+91 98450 22222",
    avatarColor: "bg-rose-100 text-rose-700 border-rose-200",
    performanceTag: "Needs Attention",
    teacherObservation: "Attendance is dropping and she seems disengaged in Math. Needs motivation and a parent check-in.",
    aiInsight: "Risk flag: scores AND attendance both falling. Recommend a parent conversation and confidence-building work on quadratics this week.",
    testHistory: [
      { id: "t-201", date: "2026-03-12", topic: "Unit Test 1 (Math)", score: 62 },
      { id: "t-202", date: "2026-04-18", topic: "Unit Test 2 (Math)", score: 58 },
      { id: "t-203", date: "2026-05-22", topic: "Midterm (Math)", score: 51 }
    ],
    lessonHistory: [
      {
        id: "l-201",
        date: "2026-06-10",
        topic: "Quadratic Equations (Factoring)",
        performance: "Needs Work",
        notes: "Diya missed the last scheduled online support session. Today we struggled with factoring quadratic trinomials when the leading coefficient is greater than 1. Seems distracted."
      },
      {
        id: "l-202",
        date: "2026-06-17",
        topic: "Physics: Motion Numericals",
        performance: "Consistent",
        notes: "Walked through distance-time graph interpretations. Diya was able to solve basic speed calculations but struggled when algebraic rearrangments of equations of motion were required."
      }
    ]
  },
  {
    id: "std-rohan",
    name: "Rohan Gupta",
    grade: "Grade 8",
    age: 13,
    subject: "Mathematics, Science",
    status: "green",
    averageGrade: 94,
    attendance: 98,
    homeworkCompletion: 100,
    enrolled: "Jun 2024",
    weakTopics: ["Careless calculation errors"],
    strongTopics: ["Algebra", "Number Theory", "Fast conceptual grasp"],
    parentName: "Anil Gupta",
    parentEmail: "anil.gupta@hotmail.com",
    parentPhone: "+91 98450 33333",
    avatarColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    performanceTag: "Consistent",
    teacherObservation: "Top performer. Clearly ready for advanced and olympiad-level material.",
    aiInsight: "Under-challenged. Recommend enrichment worksheets and olympiad-level problems to keep him engaged.",
    testHistory: [
      { id: "t-301", date: "2026-03-10", topic: "Unit Test 1", score: 91 },
      { id: "t-302", date: "2026-04-14", topic: "Unit Test 2", score: 94 },
      { id: "t-303", date: "2026-05-18", topic: "Midterm Exam", score: 96 }
    ],
    lessonHistory: [
      {
        id: "l-301",
        date: "2026-06-11",
        topic: "Advanced Number Theory Basics",
        performance: "Good",
        notes: "Rohan is remarkably quick. We covered prime factorization properties, divisibility rules, and modular arithmetic basics. Solved all extension problems."
      },
      {
        id: "l-302",
        date: "2026-06-18",
        topic: "Olympiad Level Equations",
        performance: "Good",
        notes: "Worked on non-linear equations systems. Rohan needs to write complete steps instead of jumping straight to the solution to avoid simple careless sign errors."
      }
    ]
  },
  {
    id: "std-sara",
    name: "Sara Khan",
    grade: "Grade 9",
    age: 14,
    subject: "Mathematics, Physics",
    status: "amber",
    averageGrade: 62,
    attendance: 84,
    homeworkCompletion: 70,
    enrolled: "Mar 2025",
    weakTopics: ["Fractions", "Ratios and Proportion (middle school gaps)"],
    strongTopics: ["Physics (mechanics concepts)"],
    parentName: "Imran Khan",
    parentEmail: "imran.khan@gmail.com",
    parentPhone: "+91 98450 44444",
    avatarColor: "bg-amber-100 text-amber-700 border-amber-200",
    performanceTag: "Needs Attention",
    teacherObservation: "Bright but inconsistent. Foundational arithmetic gaps surface under exam time pressure.",
    aiInsight: "Volatility traced to weak fundamentals. Recommend targeted ratio & proportion revision before the next exam.",
    testHistory: [
      { id: "t-401", date: "2026-03-15", topic: "Unit Test 1", score: 55 },
      { id: "t-402", date: "2026-04-20", topic: "Unit Test 2", score: 72 },
      { id: "t-403", date: "2026-05-24", topic: "Midterm Exam", score: 60 }
    ],
    lessonHistory: [
      {
        id: "l-401",
        date: "2026-06-08",
        topic: "Ratios & Unitary Method Remediation",
        performance: "Consistent",
        notes: "Sara understands physics concepts like force very well, but when setting up proportion ratios, she gets confused. Practiced standardizing ratios with visual boxes."
      },
      {
        id: "l-402",
        date: "2026-06-15",
        topic: "Fraction Arithmetic Review",
        performance: "Consistent",
        notes: "Worked on adding and subtracting algebraic fractions. We need to focus on finding lowest common denominators."
      }
    ]
  },
  {
    id: "std-vihaan",
    name: "Vihaan Reddy",
    grade: "Grade 10",
    age: 15,
    subject: "Mathematics, Chemistry",
    status: "green",
    averageGrade: 68,
    attendance: 89,
    homeworkCompletion: 82,
    enrolled: "Sep 2024",
    weakTopics: ["Trigonometry Identities", "Mensuration formulas"],
    strongTopics: ["Chemistry (Inorganic basic reactions)"],
    parentName: "Lakshmi Reddy",
    parentEmail: "lakshmi.reddy@yahoo.co.in",
    parentPhone: "+91 98450 55555",
    avatarColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    performanceTag: "Consistent",
    teacherObservation: "Steady, reliable worker. Trigonometry is the main blocker holding back higher scores.",
    aiInsight: "Trigonometry identities are a recurring weakness across all three tests. Schedule a focused revision block.",
    testHistory: [
      { id: "t-501", date: "2026-03-11", topic: "Unit Test 1", score: 64 },
      { id: "t-502", date: "2026-04-16", topic: "Unit Test 2", score: 67 },
      { id: "t-503", date: "2026-05-19", topic: "Midterm Exam", score: 73 }
    ],
    lessonHistory: [
      {
        id: "l-501",
        date: "2026-06-09",
        topic: "Trigonometric Sine and Cosine Laws",
        performance: "Consistent",
        notes: "Vihaan works diligently. He wrote down complete reference tables for standard angle values. Struggles to recognize when to apply sine rule vs cosine rule in non-right triangles."
      },
      {
        id: "l-502",
        date: "2026-06-16",
        topic: "Surface Areas of Spheres & Cones",
        performance: "Good",
        notes: "Calculated surface areas accurately when given direct inputs. Needs to watch unit conversions (e.g. cm³ to liters)."
      }
    ]
  },
  {
    id: "std-ishita",
    name: "Ishita Nair",
    grade: "Grade 8",
    age: 13,
    subject: "Mathematics, Science",
    status: "green",
    averageGrade: 64,
    attendance: 95,
    homeworkCompletion: 92,
    enrolled: "Feb 2025",
    weakTopics: ["Word problems (multi-step equations interpretation)"],
    strongTopics: ["Fractions and decimals (fully strong after remediation)"],
    parentName: "Priya Nair",
    parentEmail: "priya.nair@hotmail.com",
    parentPhone: "+91 98450 66666",
    avatarColor: "bg-teal-100 text-teal-700 border-teal-200",
    performanceTag: "Improved",
    teacherObservation: "Remarkable turnaround this term. The remediation plan is clearly working.",
    aiInsight: "Strong improvement momentum. Introduce multi-step word problems to build interpretation skills.",
    testHistory: [
      { id: "t-601", date: "2026-03-14", topic: "Unit Test 1", score: 48 },
      { id: "t-602", date: "2026-04-19", topic: "Unit Test 2", score: 65 },
      { id: "t-603", date: "2026-05-25", topic: "Midterm Exam", score: 80 }
    ],
    lessonHistory: [
      {
        id: "l-601",
        date: "2026-06-14",
        topic: "Translating Word Problems into Equations",
        performance: "Good",
        notes: "Ishita is highly motivated now. We worked on highlighting keywords like 'of' (multiply), 'is' (equals), and 'more than' (plus). She solved 4 out of 5 word puzzles successfully."
      },
      {
        id: "l-602",
        date: "2026-06-21",
        topic: "Fractions & Decimals Operations Test",
        performance: "Good",
        notes: "Outstanding performance on the arithmetic diagnostic check. Ishita scored 100% on the fraction multiplication segment. Retained past remediation perfectly."
      }
    ]
  }
];

export const sampleAIToolsSeed: GeneratedToolOutput[] = [
  {
    id: "tool-001",
    type: "lesson_plan",
    studentId: "std-diya",
    studentName: "Diya Patel",
    subject: "Mathematics",
    topic: "Quadratic Equations (Remediation)",
    grade: "Grade 10",
    timestamp: "2026-06-25T14:30:00Z",
    content: `## Lesson Plan: Quadratic Equations Remediation
**Target Student:** Diya Patel (Grade 10 Mathematics)  
**Duration:** 60 Minutes  
**Objective:** Deconstruct quadratic equations into basic visual terms and master factoring of equations where $a=1$.

### 1. Re-engagement & Motivation (10 mins)
*   **The Parabolic Path:** Explain how throwing a basketball creates a perfect parabola. Give a physical, non-threatening representation of quadratics.
*   *Tutor Tip:* Give Diya direct, positive feedback early on. Focus on rebuilding her confidence after a lower midterm score.

### 2. Factoring Blueprint (20 mins)
Present the standard formula: $x^2 + bx + c = 0$.
Teach the "Sum-Product Game":
*   Find two numbers that multiply to $c$ (Product) and add up to $b$ (Sum).
*   Example: $x^2 + 5x + 6 = 0$. Numbers are 2 and 3 because $2 \\times 3 = 6$ and $2 + 3 = 5$.
*   Therefore, factored form is $(x+2)(x+3) = 0$.

### 3. Guided Practice (20 mins)
Let's solve together:
*   $x^2 - 7x + 12 = 0$.
*   Ask Diya: What multiplies to $+12$ and adds to $-7$? (Answer: $-3$ and $-4$).
*   Walk through steps to obtain roots $x = 3$ and $x = 4$.

### 4. Direct Feedback & Reflection (10 mins)
*   Praise her attempt. Ensure there's no pressure to get everything right on the first try.
*   Establish a plan to sync with her mother Meera regarding her steady attendance progress.`
  },
  {
    id: "tool-002",
    type: "quiz",
    studentId: "std-aarav",
    studentName: "Aarav Mehta",
    subject: "Mathematics",
    topic: "Circle Theorems Concepts",
    grade: "Grade 9",
    timestamp: "2026-06-24T10:15:00Z",
    content: `## Concept Quiz: Circle Geometry & Theorems
**Target Student:** Aarav Mehta (Grade 9)  
**Goal:** Diagnostic quiz to reinforce circle properties and build geometric proof patterns.

---

### Question 1: Central & Inscribed Angles
In a circle with center $O$, an arc $AB$ subtends an angle of $80^\\circ$ at the center ($O$).
*   **A)** What is the measure of the inscribed angle $\\angle ACB$ on the remaining part of the circle?
*   **B)** State the theorem you used to find this angle.

### Question 2: Tangent-Radius Property
A straight line $PT$ touches a circle at point $T$. $O$ is the center of the circle, and $OT$ is the radius.
*   What is the exact angle measure between the tangent $PT$ and the radius $OT$ at the point of contact? (Hint: Tangents are always perpendicular to the radius at the point of tangency).

### Question 3: Practice Geometry Proof
*If a quadrilateral $ABCD$ is inscribed in a circle, what is the sum of its opposite angles (e.g., $\\angle A + \\angle C$)?*
*   **A)** $90^\\circ$
*   **B)** $180^\\circ$
*   **C)** $360^\\circ$

---
*Customized visual-concept worksheet generated by TutorBridge AI tailored specifically to Aarav's preference for diagram-based questions.*`
  }
];
