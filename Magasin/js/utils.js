// Shared utilities for the ARW Cosmetics store.
// Normalize image paths: use server /images/ route for ImagesProd files.
window.normPath = function(raw) {
  if (!raw) return '';
  var p = String(raw).trim();
  if (!p) return '';
  var base = window.API_BASE || 'http://localhost:4000';
  return base + '/images/' + encodeURIComponent(p);
};
