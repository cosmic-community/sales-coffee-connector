import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// API helper functions
export async function getSkills() {
  try {
    const response = await cosmic.objects
      .find({ type: 'skills' })
      .props(['id', 'title', 'metadata'])
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch skills');
  }
}

export async function getIndustries() {
  try {
    const response = await cosmic.objects
      .find({ type: 'industries' })
      .props(['id', 'title', 'metadata'])
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch industries');
  }
}

export async function getSalesExecutiveByAuthId(authUserId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'sales-executives',
        'metadata.auth_user_id': authUserId
      })
      .props(['id', 'title', 'metadata'])
      .depth(1);
    return response.objects[0] || null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch user profile');
  }
}

export async function getUserSessions(userId: string) {
  try {
    const response = await cosmic.objects
      .find({
        type: 'matching-sessions',
        $or: [
          { 'metadata.participant_1': userId },
          { 'metadata.participant_2': userId }
        ]
      })
      .props(['id', 'title', 'metadata'])
      .depth(1);
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch user sessions');
  }
}

export async function getSuccessStories(featured?: boolean) {
  try {
    const query: Record<string, any> = { type: 'success-stories' };
    if (featured) {
      query['metadata.is_featured'] = true;
      query['metadata.approval_status'] = 'approved';
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'metadata'])
      .depth(1);
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch success stories');
  }
}