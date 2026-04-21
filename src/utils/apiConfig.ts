// API Configuration
// When hosted on GitHub Pages, API calls go to the Netlify backend
// When hosted on Netlify, API calls are relative (same domain)

const isNetlify = window.location.hostname.includes('netlify.app');

export const API_BASE = isNetlify 
  ? '' // Same domain on Netlify — use relative paths
  : 'https://flourishing-griffin-2768f3.netlify.app'; // Netlify backend URL for GitHub Pages

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
