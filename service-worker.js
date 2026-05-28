// Service Worker for 职场权力人格测评
// 提供离线缓存和快速加载体验

const CACHE_NAME = 'wpr-cache-v1.2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/analytics.js',
  '/assets/config.json',
  '/assets/questions.json',
  // 图标资源
  '/assets/icon-72.png',
  '/assets/icon-96.png',
  '/assets/icon-128.png',
  '/assets/icon-144.png',
  '/assets/icon-192.png',
  '/assets/icon-384.png',
  '/assets/icon-512.png',
  // CDN资源
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

// 安装阶段：缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 缓存静态资源');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 清理旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求：缓存优先策略
self.addEventListener('fetch', event => {
  // 跳过非GET请求和浏览器扩展
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.includes('sockjs-node')) {
    return;
  }

  // 处理API请求：网络优先，失败时返回缓存
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 缓存成功的API响应
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 静态资源：缓存优先
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // 从缓存返回，同时更新缓存
          fetchAndUpdateCache(event.request);
          return cachedResponse;
        }
        // 缓存中没有，从网络获取
        return fetchAndCache(event.request);
      })
  );
});

async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // 网络失败，尝试返回离线页面
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match('/offline.html');
    return cached || new Response('网络连接失败，请检查网络后重试', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

async function fetchAndUpdateCache(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
  } catch (error) {
    // 静默失败
  }
}

// 后台同步：处理离线数据
self.addEventListener('sync', event => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalyticsData());
  }
});

async function syncAnalyticsData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const analyticsRequests = keys.filter(key => 
      key.url.includes('/api/analytics')
    );

    for (const request of analyticsRequests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('同步数据失败:', error);
  }
}

// 推送通知
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || '你有新的测评报告可以查看',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: '查看报告'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '职场权力人格测评', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    const url = event.notification.data.url;
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (const client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// 后台定期更新
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  for (const url of STATIC_ASSETS) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      // 静默失败
    }
  }
}