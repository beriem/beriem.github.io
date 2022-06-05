'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "icons/apple-icon-114x114.png": "99531e058d1886e7d69efac92a87185e",
"icons/favicon-96x96.png": "f1452479cbbb51e60f331df9b4d44d19",
"icons/ms-icon-70x70.png": "5f7c8a927e4eb7ba0b92f2504ea9a609",
"icons/ms-icon-144x144.png": "6782a01719b38195df202ef4816818d9",
"icons/ms-icon-310x310.png": "170b416eb3f5aad746fa6126917f5c58",
"icons/favicon.ico": "caf3ab201888478d7b93010de5841f5e",
"icons/apple-icon-76x76.png": "da6a64b6a56e976e5230ae6f353318c7",
"icons/apple-icon-57x57.png": "fd3edb9de544b19b2638bc7548c81368",
"icons/apple-icon-72x72.png": "be987da929755d78f4daf4caed250372",
"icons/apple-icon-152x152.png": "9b7e499f1a0d72ea39d2d99593e182ac",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-72x72.png": "be987da929755d78f4daf4caed250372",
"icons/apple-icon-60x60.png": "dc515cf65437a824444d7bc9d0ac51bd",
"icons/favicon-32x32.png": "4654bea69d4fe4908e735839a80aad4b",
"icons/favicon-16x16.png": "01f62272374ccc012d0c31bf694aef2e",
"icons/android-icon-144x144.png": "6782a01719b38195df202ef4816818d9",
"icons/apple-icon-120x120.png": "f73961d69fef75368d7b348705aaae13",
"icons/apple-icon-precomposed.png": "6cd48505a9e8bb37a51cf68030c430e2",
"icons/apple-icon-144x144.png": "6782a01719b38195df202ef4816818d9",
"icons/ms-icon-150x150.png": "aedd3f70ff41d2622fa73409eb0a01b9",
"icons/android-icon-36x36.png": "154819ef6f01984ba1ff5a71012ba8e0",
"icons/apple-icon-180x180.png": "5bd1dab5a231d12c9e4f39f6ef446689",
"icons/android-icon-96x96.png": "f1452479cbbb51e60f331df9b4d44d19",
"icons/android-icon-48x48.png": "2f1cedd30c731ca1b9735b75bcc2bf49",
"icons/apple-icon.png": "6cd48505a9e8bb37a51cf68030c430e2",
"icons/android-icon-192x192.png": "1b1e0b69a7696547b00744fc27745f5f",
"favicon.png": "6cd48505a9e8bb37a51cf68030c430e2",
"manifest.json": "5dab9e7f1b60879ae21f9ee2153e33ca",
"assets/NOTICES": "16115891710dfceea283b68e4a37b8d5",
"assets/assets/icons/ic_google_logo.png": "b75aecaf9e70a9b1760497e33bcd6db1",
"assets/assets/icons/check.svg": "4220c82511cc1dfb40b8bba7d25c5f55",
"assets/assets/icons/download.svg": "628700a3031424d215a441fab2da1731",
"assets/assets/images/me.png": "7fe5504972e5588ecdab4a374557e5ec",
"assets/assets/images/sign.png": "a1024198a44f740f920b148c749665e9",
"assets/assets/fonts/Tajawal-Black.ttf": "bc674767a78d2808b19a818d9742a4af",
"assets/assets/fonts/Tajawal-Medium.ttf": "3358032dd0994cf4a2116f0b16f80d70",
"assets/assets/fonts/Tajawal-Light.ttf": "b6f8ed4fd29cc11d562ce730712aeaae",
"assets/assets/fonts/Tajawal-Bold.ttf": "76f83be859d749342ba420e1bb010d6a",
"assets/FontManifest.json": "fde0acdd2cc8c9825cf499dc3faf5b72",
"assets/packages/typicons_flutter/fonts/typicons.ttf": "29f9630f7d87a79830d1c321e1600f2e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/AssetManifest.json": "1d225992f92466b4b98eb7ad8708f1d1",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"index.html": "a341952abc1705ad6642b1e36bf71c08",
"/": "a341952abc1705ad6642b1e36bf71c08",
"main.dart.js": "5a574312d26b81f24ad64538b4fc65f8",
"version.json": "b0b73e099387cd68b918db43c47384a1"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
