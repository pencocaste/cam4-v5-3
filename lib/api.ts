import { type Cam, type CamProfile, type ApiResponse } from '@/lib/types';

const API_BASE_URL = 'https://api.cam4pays.com/api/v1';
const AFFILIATE_ID = '7654';

// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

function getCacheKey(endpoint: string, params: Record<string, string | number>): string {
  const sortedParams = Object.keys(params).sort().reduce((result, key) => {
    result[key] = params[key];
    return result;
  }, {} as Record<string, string | number>);
  
  return `${endpoint}_${JSON.stringify(sortedParams)}`;
}

function isValidCache(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}
export function createApiUrl(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  url.searchParams.append('aid', AFFILIATE_ID);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  return url.toString();
}

export async function fetchCams(
  page = 1,
  filters: Record<string, string> = {}
): Promise<Cam[]> {
  // Create cache key
  const cacheKey = getCacheKey('cams', { page, ...filters });
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && isValidCache(cached.timestamp)) {
    return cached.data;
  }
  
  try {
    const url = createApiUrl('cams/online.json', {
      page,
      limit: filters.limit || 36,  // Reduced default for better performance
      ...filters
    });

    const response = await fetch(url, { 
      cache: 'no-store',
      // Add timeout for better error handling
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response format');
    }

    const result = data || [];
    
    // Log for debugging duplicate issues
    if (process.env.NODE_ENV === 'development') {
      const duplicateIds = result.reduce((acc: number[], cam: Cam, index: number) => {
        const isDuplicate = result.findIndex((c: Cam) => c.id === cam.id) !== index;
        if (isDuplicate) acc.push(cam.id);
        return acc;
      }, []);
      
      if (duplicateIds.length > 0) {
        console.warn(`API returned duplicate cam IDs: ${duplicateIds.join(', ')}`);
      }
    }
    
    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching cams:', error);
    
    // Return cached data if available, even if expired
    const cached = cache.get(cacheKey);
    if (cached) {
      console.warn('Using expired cache due to API error');
      return cached.data;
    }
    
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

export async function fetchCamProfile(username: string): Promise<CamProfile | null> {
  try {
    const url = createApiUrl('cams/online.json', {
      nickname: username
    });
    
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response format');
    }
    
    // Find the cam profile that matches the username
    const profile = data.find((cam: Cam) => cam.nickname === username);
    
    if (!profile) {
      return null;
    }
    
    // Add username field for compatibility with existing code
    return {
      ...profile,
      username: profile.nickname
    };
  } catch (error) {
    console.error('Error fetching cam profile:', error);
    throw new Error('Failed to fetch profile');
  }
}

export async function fetchCamProfileDetail(username: string): Promise<any | null> {
  try {
    const url = createApiUrl(`cams/profile/${username}.json`);
    
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      // Return null for 404 (profile not found) instead of throwing error
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching detailed cam profile:', error);
    return null;
  }
}