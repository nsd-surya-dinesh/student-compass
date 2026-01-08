
export type StudentStage = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Career Changer';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentProfile {
  user_id: string;
  name: string;
  email: string;
  avatar?: string;
  stage: StudentStage;
  skillLevel: SkillLevel;
  primaryGoal: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface StudyNotes {
  title: string;
  content: string; // Markdown supported
  concepts: string[];
}

export interface Task {
  id: string;
  day: string;
  start: number;
  end: number;
  title: string;
  color: string;
  notified: boolean;
  reminderActive: boolean;
}

/**
 * Interface for synthesized learning materials provided by Lumina.
 */
export interface SimplifiedMaterial {
  summary: string;
  keyConcepts: string[];
  resources: {
    title: string;
    url: string;
    type: 'video' | 'article';
  }[];
}

/**
 * Interface for practical project suggestions tailored to a student's path.
 */
export interface ProjectIdea {
  title: string;
  description: string;
  difficulty: SkillLevel;
  whyThis: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'current' | 'completed';
  practicalActions: string[];
  preventiveAdvice?: string;
  materials?: SimplifiedMaterial;
  notes?: StudyNotes;
  mindMap?: MindMapNode;
  exam?: PracticeQuestion[];
}

export interface LearningPath {
  id: string;
  subject: string;
  goal: string;
  stage: StudentStage;
  milestones: Milestone[];
  isPublic: boolean;
  isArchived?: boolean;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorStage: string;
  topic: string;
  progress: number;
  timestamp: string;
}
