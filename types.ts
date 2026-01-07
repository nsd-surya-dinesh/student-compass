
export type StudentStage = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Career Changer';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentProfile {
  name: string;
  stage: StudentStage;
  skillLevel: SkillLevel;
  primaryGoal: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'current' | 'completed';
  practicalActions: string[];
  preventiveAdvice?: string;
}

export interface LearningPath {
  subject: string;
  goal: string;
  stage: StudentStage;
  milestones: Milestone[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
