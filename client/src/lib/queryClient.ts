import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { 
  mockClubTypes, 
  mockGolfProfile, 
  mockSwingAnalysis, 
  mockRecommendedClubs, 
  mockRetailerDeals 
} from './mockData';

// Check if we're running on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Mock API request function for GitHub Pages
async function mockApiResponse(url: string, method: string, data?: unknown): Promise<Response> {
  console.log(`Mock API request: ${method} ${url}`);
  
  let responseData: any;
  let profileId = 1;
  let clubTypeId = 1;
  let clubId = 1;
  
  // Extract IDs from URL if present
  if (url.includes('/profiles/')) {
    const match = url.match(/\/profiles\/(\d+)/);
    if (match) profileId = parseInt(match[1]);
  }
  
  if (url.includes('/club-types/')) {
    const match = url.match(/\/club-types\/(\d+)/);
    if (match) clubTypeId = parseInt(match[1]);
  }
  
  if (url.includes('/clubs/')) {
    const match = url.match(/\/clubs\/(\d+)/);
    if (match) clubId = parseInt(match[1]);
  }

  // Handle GET requests
  if (method === 'GET') {
    if (url === '/api/club-types') {
      responseData = mockClubTypes;
    } else if (url.startsWith('/api/club-types/') && url.endsWith(clubTypeId.toString())) {
      responseData = mockClubTypes.find(type => type.id === clubTypeId);
    } else if (url.includes('/profiles/') && url.includes('/swing-analysis')) {
      responseData = mockSwingAnalysis;
    } else if (url.includes('/profiles/') && url.includes('/recommendations')) {
      responseData = mockRecommendedClubs;
    } else if (url.includes('/club-types/') && url.includes('/recommendations')) {
      responseData = mockRecommendedClubs.filter(club => club.clubTypeId === clubTypeId);
    } else if (url.includes('/clubs/') && url.includes('/deals')) {
      responseData = mockRetailerDeals;
    } else {
      responseData = { message: "Endpoint not mocked" };
    }
  } 
  // Handle POST requests
  else if (method === 'POST') {
    if (url === '/api/profiles') {
      responseData = mockGolfProfile;
    } else if (url === '/api/swing-analyses') {
      responseData = mockSwingAnalysis;
    } else if (url === '/api/recommendations') {
      responseData = mockRecommendedClubs[0];
    } else if (url === '/api/analyze-swing') {
      responseData = mockSwingAnalysis;
    } else {
      responseData = { message: "Endpoint not mocked", data: data };
    }
  }
  
  // Create a mock response
  const blob = new Blob([JSON.stringify(responseData)], {
    type: "application/json",
  });
  
  return new Response(blob, {
    status: 200,
    statusText: "OK",
  });
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Use mock API when on GitHub Pages
  if (isGitHubPages) {
    return mockApiResponse(url, method, data);
  }
  
  // Otherwise use real API
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Use mock data when on GitHub Pages
    if (isGitHubPages) {
      const url = queryKey[0] as string;
      const mockRes = await mockApiResponse(url, 'GET');
      return await mockRes.json();
    }
    
    // Otherwise use real API
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
