export const TOKEN_KEY = 'hackathon_access_token';
export const REFRESH_TOKEN_KEY = 'hackathon_refresh_token';
export const API_BASE_URL = '/api'; // Handled via Vite Proxy

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access_token: string, refresh_token: string) {
  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Wrapper for fetch that auto-adds the Authorization header
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure content-type is set if body exists and is JSON
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers
  };

  let response = await fetch(url.startsWith('/api') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`, fetchOptions);

  // If 401, token might be expired. Try to refresh.
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      try {
        const refreshResponse = await fetch('/api/v1/user/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          // Assuming API returns { access_token: "...", refresh_token: "..." }
          if (refreshData.access_token) {
              setTokens(refreshData.access_token, refreshData.refresh_token || refreshToken);
              
              // Refetch original request with new token
              headers.set('Authorization', `Bearer ${refreshData.access_token}`);
              return fetch(url.startsWith('/api') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`, { ...options, headers });
          }
        }
      } catch (err) {
        console.error('Failed to refresh token', err);
      }
    }
    
    // If refresh failed or was absent, throw them out
    clearTokens();
    window.location.href = '/login/admin'; // Fallback redirect strategy
  }

  return response;
}
