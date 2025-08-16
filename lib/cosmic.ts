import { createBucketClient } from '@cosmicjs/sdk'
import { SalesExecutive } from '@/types'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Create a new sales executive
export async function createSalesExecutive(data: {
  title: string
  auth_user_id: string
  first_name: string
  last_name: string
  email: string
  password_hash: string
  company_name: string
  job_title: string
  years_in_sales: number
  timezone: { key: string; value: string }
  company_size: { key: string; value: string }
  max_meetings_per_week: { key: string; value: string }
  account_status: { key: string; value: string }
}) {
  try {
    const response = await cosmic.objects.insertOne({
      title: data.title,
      type: 'sales-executives',
      metadata: {
        auth_user_id: data.auth_user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password_hash: data.password_hash,
        company_name: data.company_name,
        job_title: data.job_title,
        years_in_sales: data.years_in_sales,
        linkedin_url: '',
        timezone: data.timezone,
        industries: [],
        company_size: data.company_size,
        annual_quota: 0,
        expertise_areas: [],
        learning_goals: [],
        willing_to_mentor: false,
        seeking_mentorship: false,
        max_meetings_per_week: data.max_meetings_per_week,
        preferred_meeting_days: null,
        profile_completed: false,
        account_status: data.account_status
      }
    })
    return response.object as SalesExecutive
  } catch (error) {
    console.error('Error creating sales executive:', error)
    throw error
  }
}

// Get all sales executives
export async function getSalesExecutives(): Promise<SalesExecutive[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'sales-executives' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return response.objects as SalesExecutive[] || []
  } catch (error: unknown) {
    const cosmicError = error as { status?: number }
    if (cosmicError.status === 404) {
      return []
    }
    console.error('Error getting sales executives:', error)
    throw error
  }
}

// Get sales executive by auth user ID
export async function getSalesExecutiveByAuthId(authUserId: string): Promise<SalesExecutive | null> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'sales-executives',
        'metadata.auth_user_id': authUserId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    const executives = response.objects as SalesExecutive[]
    return executives && executives.length > 0 ? executives[0] : null
  } catch (error: unknown) {
    const cosmicError = error as { status?: number }
    if (cosmicError.status === 404) {
      return null
    }
    console.error('Error getting sales executive by auth ID:', error)
    throw error
  }
}

// Get sales executive by email
export async function getSalesExecutiveByEmail(email: string): Promise<SalesExecutive | null> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'sales-executives',
        'metadata.email': email
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    const executives = response.objects as SalesExecutive[]
    return executives && executives.length > 0 ? executives[0] : null
  } catch (error: unknown) {
    const cosmicError = error as { status?: number }
    if (cosmicError.status === 404) {
      return null
    }
    console.error('Error getting sales executive by email:', error)
    throw error
  }
}

// Update sales executive
export async function updateSalesExecutive(id: string, metadata: Partial<SalesExecutive['metadata']>) {
  try {
    const response = await cosmic.objects.updateOne(id, {
      metadata: metadata
    })
    return response.object as SalesExecutive
  } catch (error: unknown) {
    console.error('Error updating sales executive:', error)
    throw error
  }
}

// Get all skills for form options
export async function getSkills() {
  try {
    const response = await cosmic.objects
      .find({ type: 'skills' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return response.objects || []
  } catch (error: unknown) {
    const cosmicError = error as { status?: number }
    if (cosmicError.status === 404) {
      return []
    }
    console.error('Error getting skills:', error)
    throw error
  }
}

// Get all industries for form options
export async function getIndustries() {
  try {
    const response = await cosmic.objects
      .find({ type: 'industries' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return response.objects || []
  } catch (error: unknown) {
    const cosmicError = error as { status?: number }
    if (cosmicError.status === 404) {
      return []
    }
    console.error('Error getting industries:', error)
    throw error
  }
}

export { SalesExecutive }
export default cosmic