/**
 * 阿里大环线离线路书助手 - Service Worker
 * PWA 离线缓存（P1 功能）
 *
 * 策略：
 *   - 核心 HTML/JS/CSS/Data → Cache First（首次安装后离线可用）
 *   - 地图图片 → Network First（尽量获取最新，失败用缓存）
 *   - 外部服务（Windy/Weather）→ Network Only
 */

const CACHE_VERSION = 'v3-20260614';
const CACHE_NAME = 'ali-loop-cache-' + CACHE_VERSION;

// 核心资源列表（首次安装时预缓存）
const CORE_ASSETS = [
  '/',
  'index.html',
  'css/style.css',
  'data/trip-data.js',
  'js/utils.js',
  'js/app.js'
];

// 安装事件 — 预缓存核心资源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] 预缓存核心资源...');
      return cache.addAll(CORE_ASSETS).catch(function(err) {
        console.warn('[SW] 部分资源缓存失败:', err);
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// 激活事件 — 清理旧缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME && key.startsWith('ali-loop-cache-');
        }).map(function(key) {
          console.log('[SW] 删除旧缓存:', key);
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// 请求拦截
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return;

  // 跳过外部服务（Windy/Weather API）
  if (url.hostname.includes('windy.com') ||
      url.hostname.includes('weather.com') ||
      url.hostname.includes('openstreetmap.org')) {
    return; // Network only
  }

  // 地图图片 → Network First
  if (url.pathname.includes('/maps/')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  // 核心资源 → Cache First（离线优先）
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        // 只缓存成功的 GET 响应
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // 离线且无缓存，返回离线页面
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('index.html');
        }
        return new Response('离线状态下该资源不可用', { status: 503 });
      });
    })
  );
});
