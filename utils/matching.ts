import { SalesExecutive } from '@/types'

export function calculateMatchScore(user1: SalesExecutive, user2: SalesExecutive): number {
  let score = 0
  let factors = 0

  // Company size compatibility (30% weight)
  if (user1.metadata?.company_size?.key === user2.metadata?.company_size?.key) {
    score += 30
  } else {
    // Partial points for adjacent sizes
    const sizeOrder = ['startup', 'smb', 'midmarket', 'enterprise']
    const user1Index = sizeOrder.indexOf(user1.metadata?.company_size?.key || '')
    const user2Index = sizeOrder.indexOf(user2.metadata?.company_size?.key || '')
    const sizeDiff = Math.abs(user1Index - user2Index)
    if (sizeDiff === 1) score += 15
    else if (sizeDiff === 2) score += 5
  }
  factors += 30

  // Experience level compatibility (25% weight)
  const user1Experience = user1.metadata?.years_in_sales || 0
  const user2Experience = user2.metadata?.years_in_sales || 0
  const experienceDiff = Math.abs(user1Experience - user2Experience)
  
  if (experienceDiff <= 2) score += 25
  else if (experienceDiff <= 5) score += 15
  else if (experienceDiff <= 10) score += 10
  else score += 5
  factors += 25

  // Timezone compatibility (15% weight)
  if (user1.metadata?.timezone?.key === user2.metadata?.timezone?.key) {
    score += 15
  } else {
    // Partial points for adjacent timezones
    const timezoneOrder = ['PST', 'MST', 'CST', 'EST']
    const user1Index = timezoneOrder.indexOf(user1.metadata?.timezone?.key || '')
    const user2Index = timezoneOrder.indexOf(user2.metadata?.timezone?.key || '')
    const timezoneDiff = Math.abs(user1Index - user2Index)
    if (timezoneDiff === 1) score += 10
    else if (timezoneDiff === 2) score += 5
  }
  factors += 15

  // Skills intersection (20% weight)
  const user1Skills = user1.metadata?.expertise_areas || []
  const user2Skills = user2.metadata?.learning_goals || []
  const user1Learning = user1.metadata?.learning_goals || []
  const user2Expertise = user2.metadata?.expertise_areas || []

  // Check if user1 can teach user2 or vice versa
  const canTeachCount = user1Skills.filter((skill: any) => 
    user2Skills.some((learningSkill: any) => 
      skill.id === learningSkill.id || skill.title === learningSkill.title
    )
  ).length

  const canLearnCount = user1Learning.filter((skill: any) => 
    user2Expertise.some((expertiseSkill: any) => 
      skill.id === expertiseSkill.id || skill.title === expertiseSkill.title
    )
  ).length

  const skillScore = Math.min(20, (canTeachCount + canLearnCount) * 5)
  score += skillScore
  factors += 20

  // Mentorship compatibility (10% weight)
  let mentorshipScore = 0
  if (user1.metadata?.seeking_mentorship && user2.metadata?.willing_to_mentor) {
    mentorshipScore += 5
  }
  if (user2.metadata?.seeking_mentorship && user1.metadata?.willing_to_mentor) {
    mentorshipScore += 5
  }
  score += mentorshipScore
  factors += 10

  // Normalize score to 0-100
  return Math.round((score / factors) * 100)
}