// Simple Service Worker for Portfolio
const CACHE_NAME = 'portfolio-cache-v1';

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Simple pass-through, no caching for development
  event.respondWith(fetch(event.request));
});