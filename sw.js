const CACHE_NAME = "v1";
const RESOURCES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/CSS/style.css",
  "/audio/sekibaku.mp3"
];

const addResourcesToCache = async (resources) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
    console.log("Resources cached successfully:", resources);
  } catch (error) {
    console.error("Error caching resources:", error);
  }
};

// Installイベント: リソースをキャッシュする
self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(RESOURCES_TO_CACHE));
});

// Activateイベント: 古いキャッシュを削除する
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetchイベント: キャッシュからリソースを提供する
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
