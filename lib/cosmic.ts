import { createBucketClient } from '@cosmicjs/sdk'
import { SalesExecutive, CosmicObject, Skill, Industry, MatchingSession } from '@/types'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Helper function to transform Cosmic object to include computed properties
function transformSalesExecutive(cosmicObject: any): SalesExecutive {
  return {
    ...cosmicObject,
    firstName: cosmicObject.metadata?.first_name,
    email: cosmicObject.metadata?.email,
  }
}

export async function getSalesExecutives(): Promise<SalesExecutive[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ type: 'sales-executives' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return objects.map(transformSalesExecutive)
  } catch (error: unknown) {
    const cosmicError = error as any
    if (cosmicError.status === 404) {
      return []
    }
    throw error
  }
}

export async function getSalesExecutiveByEmail(email: string): Promise<SalesExecutive | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({ type: 'sales-executives', 'metadata.email': email })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return transformSalesExecutive(object)
  } catch (error: unknown) {
    const cosmicError = error as any
    if (cosmicError.status === 404) {
      return null
    }
    throw error
  }
}

export async function getSalesExecutiveByAuthId(authUserId: string): Promise<SalesExecutive | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({ type: 'sales-executives', 'metadata.auth_user_id': authUserId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return transformSalesExecutive(object)
  } catch (error: unknown) {
    const cosmicError = error as any
    if (cosmicError.status === 404) {
      return null
    }
    throw error
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ type: 'skills' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return objects as Skill[]
  } catch (error: unknown) {
    const cosmicError = error as any
    if (cosmicError.status === 404) {
      return []
    }
    throw error
  }
}

export async function getIndustries(): Promise<Industry[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ type: 'industries' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return objects as Industry[]
  } catch (error: unknown) {
    const cosmicError = error as any
    if (cosmicError.status === 404) {
      return []
    }
    throw error
  }
}

export async function getUserSessions(userId: string): Promise<MatchingSession[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ 
        type: 'matching-sessions',
        $or: [
          { 'metadata.participant_1': userId },
          { 'metadata.participant_2': userId }
        ]
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return objects as MatchingSession[]
  } catch (error: unknown) {
    const cosmicError = error as any
    if (cosmicError.status === 404) {
      return []
    }
    throw error
  }
}

export async function createSalesExecutive(data: {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  auth_user_id: string;
}): Promise<SalesExecutive> {
  const { object } = await cosmic.objects.insertOne({
    title: `${data.first_name} ${data.last_name}`,
    type: 'sales-executives',
    status: 'published',
    metadata: {
      email: data.email,
      password_hash: data.password_hash,
      first_name: data.first_name,
      last_name: data.last_name,
      auth_user_id: data.auth_user_id,
      profile_completed: false,
      account_status: { key: 'active', value: 'Active' },
      years_in_sales: 0,
      annual_quota: 0,
      willing_to_mentor: false,
      seeking_mentorship: false,
    }
  })

  return transformSalesExecutive(object)
}

export async function updateSalesExecutive(
  id: string,
  metadata: Partial<SalesExecutive['metadata']>
): Promise<SalesExecutive> {
  const { object } = await cosmic.objects.updateOne(id, {
    metadata
  })

  return transformSalesExecutive(object)
}

export { cosmic }