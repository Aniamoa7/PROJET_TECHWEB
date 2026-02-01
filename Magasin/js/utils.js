// Shared utilities for the ARW Cosmetics store.
// Normalize image paths: use server /images/ route for ImagesProd files.
// Provide a safe normPath only if not already defined by page scripts.
window.normPath = window.normPath || function(raw) {
  if (!raw) return '';
  var p = String(raw).trim();
  if (!p) return '';
  var apiBase = window.API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://projet-techweb-arw-cosmetics-backen.onrender.com');
  // If apiBase is http but not localhost, upgrade to https to avoid mixed-content.
  if (/^http:\/\//i.test(apiBase) && apiBase.indexOf('localhost') === -1) {
    apiBase = apiBase.replace(/^http:\/\//i, 'https://');
  }
  apiBase = apiBase.replace(/\/$/, '');
  return apiBase + '/images/' + encodeURIComponent(p);
};
