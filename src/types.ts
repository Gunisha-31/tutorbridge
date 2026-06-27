export type StudentStatus = 'green' | 'amber' | 'red';
export type PerformanceTagType = 'Excellent' | 'Good' | 'Improving' | 'Needs Attention' | 'Consistent' | 'Improved';

export interface TestRecord {
  id: string;
  date: string;
  topic: string;
  score: number;
}

export interface LessonRecord {
  id: string;
  date: string;
  topic: string;
  performance: 'Good' | 'Consistent' | 'Needs Work';
  notes: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  subject: string;
  status: StudentStatus;
  averageGrade: number;
  attendance: number;
  weakTopics: string[];
  strongTopics: string[];
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  avatarColor: string;
  testHistory: TestRecord[];
  lessonHistory: LessonRecord[];
  performanceTag?: PerformanceTagType;
  // Extra seed details
  age?: number;
  enrolled?: string;
  homeworkCompletion?: number;
  teacherObservation?: string;
  aiInsight?: string;
}

export interface Tutor {
  name: string;
  email: string;
  plan: string;
  subjects: string[];
  tuitionSize: number;
  title?: string;
  location?: string;
  experience?: string;
  avatarInitials?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface GeneratedToolOutput {
  id: string;
  type: 'lesson_plan' | 'worksheet' | 'quiz' | 'report_card_comments';
  studentId?: string;
  studentName?: string;
  subject: string;
  topic: string;
  grade: string;
  content: string;
  timestamp: string;
}
