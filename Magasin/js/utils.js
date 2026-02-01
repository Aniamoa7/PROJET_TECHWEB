// Shared utilities for the ARW Cosmetics store.
// Normalize image paths: serve from GitHub raw in production, localhost in dev.
window.normPath = window.normPath || function(raw) {
  if (!raw) return '';
  var p = String(raw).trim();
  if (!p) return '';
  
  // In local dev, use localhost backend for images
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000/images/' + encodeURIComponent(p);
  }
  
  // In production, use GitHub raw CDN for images (free and fast)
  return 'https://raw.githubusercontent.com/Aniamoa7/PROJET_TECHWEB/main/Magasin/ImagesProd/' + encodeURIComponent(p);
};
