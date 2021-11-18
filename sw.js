//全部缓存模式
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('cache-v1').then(function (cache) {
      cache
        .addAll
      // levels 11–20
      ([
        './',
      ]);
      return cache
        .addAll
      // core assets and levels 1–10
      ([
        './',
      ]);
    }),
  );
});

//磁盘缓存
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('cache-sd').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});

//刷新磁盘缓存
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('cache-sd').then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }),
  );
});

//缓存刷新后同步数据
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('cache-v2').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
