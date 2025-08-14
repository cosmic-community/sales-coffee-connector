// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Sales Executive interface
export interface SalesExecutive extends CosmicObject {
  type: 'sales-executives';
  metadata: {
    auth_user_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string; // Added for Cosmic auth
    profile_photo?: {
      url: string;
      imgix_url: string;
    };
    company_name?: string;
    job_title?: string;
    years_in_sales?: number;
    linkedin_url?: string;
    timezone?: Timezone;
    industries?: Industry[];
    company_size?: CompanySize;
    annual_quota?: number;
    expertise_areas?: Skill[];
    learning_goals?: Skill[];
    willing_to_mentor?: boolean;
    seeking_mentorship?: boolean;
    max_meetings_per_week?: MaxMeetings;
    preferred_meeting_days?: string[];
    profile_completed?: boolean;
    account_status?: AccountStatus;
  };
}

// Skill interface
export interface Skill extends CosmicObject {
  type: 'skills';
  metadata: {
    skill_name?: string;
    category?: SkillCategory;
    description?: string;
    experience_level?: ExperienceLevel;
  };
}

// Industry interface
export interface Industry extends CosmicObject {
  type: 'industries';
  metadata: {
    industry_name?: string;
    category?: IndustryCategory;
    sales_cycle?: SalesCycle;
    common_challenges?: string;
  };
}

// Matching Session interface
export interface MatchingSession extends CosmicObject {
  type: 'matching-sessions';
  metadata: {
    session_id?: string;
    participant_1?: SalesExecutive;
    participant_2?: SalesExecutive;
    session_status?: SessionStatus;
    scheduled_datetime?: string;
    meeting_platform?: MeetingPlatform;
    meeting_link?: string;
    match_score?: number;
    suggested_topics?: DiscussionTopic[];
    session_rating_p1?: SessionRating;
    session_rating_p2?: SessionRating;
    followup_planned?: boolean;
  };
}

// Discussion Topic interface
export interface DiscussionTopic extends CosmicObject {
  type: 'discussion-topics';
  metadata: {
    topic_title?: string;
    category?: Skill[];
    description?: string;
    difficulty_level?: DifficultyLevel;
    estimated_time?: number;
  };
}

// Success Story interface
export interface SuccessStory extends CosmicObject {
  type: 'success-stories';
  metadata: {
    story_title?: string;
    participant_1?: SalesExecutive;
    participant_2?: SalesExecutive;
    story_content?: string;
    outcome_achieved?: string;
    is_featured?: boolean;
    approval_status?: ApprovalStatus;
  };
}

// Type literals for select-dropdown values
export type Timezone = 'EST' | 'CST' | 'MST' | 'PST' | 'GMT' | 'CET';
export type CompanySize = 'startup' | 'smb' | 'midmarket' | 'enterprise';
export type MaxMeetings = '1' | '2' | '3' | '4' | '5';
export type AccountStatus = 'pending' | 'active' | 'suspended' | 'inactive';
export type SkillCategory = 'prospecting' | 'discovery' | 'presentation' | 'negotiation' | 'closing' | 'management' | 'strategy';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type IndustryCategory = 'technology' | 'healthcare' | 'manufacturing' | 'financial' | 'retail' | 'real_estate' | 'consulting' | 'other';
export type SalesCycle = 'short' | 'medium' | 'long' | 'enterprise';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type MeetingPlatform = 'zoom' | 'teams' | 'google_meet' | 'other';
export type SessionRating = '1' | '2' | '3' | '4' | '5';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Form data interfaces
export interface OnboardingStepData {
  step: number;
  data: Partial<SalesExecutive['metadata']>;
}

export interface MatchingPreferences {
  skills_to_learn: string[];
  skills_to_teach: string[];
  preferred_experience_levels: ExperienceLevel[];
  preferred_industries: string[];
  availability: {
    days: string[];
    max_per_week: number;
  };
}

// Matching algorithm types
export interface MatchScore {
  user_id: string;
  compatibility_score: number;
  skill_overlap: number;
  industry_match: number;
  experience_balance: number;
  timezone_compatibility: number;
  reasons: string[];
}

// Authentication types - Updated for Cosmic auth with uid property
export interface AuthUser {
  id: string;
  uid: string; // Added uid property for compatibility
  email: string;
  firstName: string;
  lastName: string;
}

// Component prop types
export interface DashboardStats {
  total_sessions: number;
  completed_sessions: number;
  average_rating: number;
  profile_completion: number;
  upcoming_sessions: number;
}

// Type guards for runtime validation
export function isSalesExecutive(obj: CosmicObject): obj is SalesExecutive {
  return obj.type === 'sales-executives';
}

export function isSkill(obj: CosmicObject): obj is Skill {
  return obj.type === 'skills';
}

export function isIndustry(obj: CosmicObject): obj is Industry {
  return obj.type === 'industries';
}

export function isMatchingSession(obj: CosmicObject): obj is MatchingSession {
  return obj.type === 'matching-sessions';
}

// Utility types  
export type OptionalMetadata<T extends CosmicObject> = Partial<T['metadata']>;
export type CreateSalesExecutiveData = Omit<SalesExecutive, 'id' | 'created_at' | 'modified_at'>;