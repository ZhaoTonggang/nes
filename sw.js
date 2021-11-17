const version = 1;
const cacheStorageKey = "testCache-" + version;

const cacheList = [
"./", 
"./sw.js",
"./game_list.json",
"./index.html", 
"./game.html",
"./404.html",
"./manifest.json", 
"./css/game.css", 
"./css/index.css",  
"./icons/72x72.png", 
"./icons/96x96.png", 
"./icons/128x128.png", 
"./icons/144x144.png", 
"./icons/152x152.png", 
"./icons/192x192.png", 
"./icons/256x256.png", 
"./icons/384x384.png", 
"./icons/512x512.png", 
"./js/joystick.js", 
"./js/jsnes.min.js", 
"./js/nes_btn.js", 
"./js/pwa.js",
"./js/nes-embed.js",
"./js/nipplejs.min.js",
"./js/jsnes.min.js.map",
"./lib/axios.min.js",
"./lib/vue.min.js",
"./lib/axios.min.map",
];

self.addEventListener("install", function(e) {
//  console.log("Cache event!");
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
//      console.log("Adding to Cache:", cacheList);
      return cache.addAll(cacheList);
    })

  );
});

self.addEventListener("activate", event => {
//  console.log("Activate event");
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => cacheStorageKey !== cacheName);
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => {
//        console.log("Clients claims.");
        self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
//    console.log("Skip waiting!");
    self.skipWaiting();
  }
});