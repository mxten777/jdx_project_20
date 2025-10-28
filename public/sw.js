// 서비스 워커 - PWA 기능 지원

const CACHE_NAME = 'lotto-generator-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-72x72.png',
  '/icon-96x96.png',
  '/icon-128x128.png',
  '/icon-144x144.png',
  '/icon-152x152.png',
  '/icon-192x192.png',
  '/icon-384x384.png',
  '/icon-512x512.png',
  '/vite.svg',
];

// Vite 빌드 assets/* 전체를 동적으로 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        await cache.addAll(urlsToCache);
        // assets/* 폴더 내 모든 파일을 캐시 (최초 install 시)
        if ('caches' in self && 'fetch' in self) {
          try {
            const assetsResp = await fetch('/assets/manifest.json');
            if (assetsResp.ok) {
              const manifest = await assetsResp.json();
              const assetFiles = Object.values(manifest).map(v => '/assets/' + v);
              await Promise.all(assetFiles.map(f => cache.add(f)));
            }
          } catch {}
        }
      })
  );
});

// 서비스 워커 설치
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 요청 가로채기 및 캐시된 응답 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에서 찾으면 반환
        if (response) {
          return response;
        }
        
        // 없으면 네트워크에서 가져오기
        return fetch(event.request).then((response) => {
          // 유효한 응답이 아니면 그대로 반환
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 응답을 복사하여 캐시에 저장
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// 캐시 업데이트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 백그라운드 동기화 (미래 기능)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    // 오프라인 상태에서 생성된 번호 동기화 등
  }
});

// 푸시 알림 처리 (미래 기능)
self.addEventListener('push', (event) => {
  const options = {
    body: '새로운 로또 추첨일입니다! 번호를 확인해보세요.',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore', 
        title: '번호 확인',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close', 
        title: '닫기',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🎲 프리미엄 로또 생성기', options)
  );
});