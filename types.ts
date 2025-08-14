// Core Types
export interface AuthUser {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
}

// Cosmic CMS Types
export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata?: Record<string, any>
  created_at?: string
  modified_at?: string
  status?: string
  type?: string
}

export interface SalesExecutive extends CosmicObject {
  metadata: {
    auth_user_id: string
    first_name: string
    last_name: string
    email: string
    password_hash: string
    profile_photo?: any
    company_name: string
    job_title: string
    years_in_sales: number
    linkedin_url?: string
    timezone: SelectDropdownValue
    industries: any[]
    company_size: SelectDropdownValue
    annual_quota: number
    expertise_areas: any[]
    learning_goals: any[]
    willing_to_mentor: boolean
    seeking_mentorship: boolean
    max_meetings_per_week: SelectDropdownValue
    preferred_meeting_days?: string[]
    profile_completed: boolean
    account_status: SelectDropdownValue
  }
}

export interface SelectDropdownValue {
  key: string
  value: string
}

export interface Skill extends CosmicObject {
  metadata: {
    skill_name: string
    category: SelectDropdownValue
    description?: string
    experience_level: SelectDropdownValue
  }
}

export interface Industry extends CosmicObject {
  metadata: {
    industry_name: string
    category: SelectDropdownValue
    sales_cycle?: SelectDropdownValue
    common_challenges?: string
  }
}

export interface DiscussionTopic extends CosmicObject {
  metadata: {
    topic_title: string
    category: Skill[]
    description: string
    difficulty_level: SelectDropdownValue
    estimated_time?: number
  }
}

export interface MatchingSession extends CosmicObject {
  metadata: {
    session_id: string
    participant_1: SalesExecutive
    participant_2: SalesExecutive
    session_status: SelectDropdownValue
    scheduled_datetime: string
    meeting_platform: SelectDropdownValue
    meeting_link?: string
    match_score?: number
    suggested_topics?: DiscussionTopic[]
    session_rating_p1?: SelectDropdownValue
    session_rating_p2?: SelectDropdownValue
    followup_planned: boolean
  }
}

export interface SuccessStory extends CosmicObject {
  metadata: {
    story_title: string
    participant_1?: SalesExecutive
    participant_2?: SalesExecutive
    story_content: string
    outcome_achieved: string
    is_featured: boolean
    approval_status: SelectDropdownValue
  }
}