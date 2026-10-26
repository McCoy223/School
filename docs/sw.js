/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "f28b1a7a4c62e7389aee5c86b0beb11e"
  }, {
    "url": "pwa-512x512.png",
    "revision": "f28b1a7a4c62e7389aee5c86b0beb11e"
  }, {
    "url": "pwa-192x192.png",
    "revision": "573875d5179b117a6d6bfe246da74c8f"
  }, {
    "url": "index.html",
    "revision": "f0c50e3c6ad6ee57a2527790ac42f725"
  }, {
    "url": "icon.svg",
    "revision": "6d57289bb5d6dddd25d547d588d00fa2"
  }, {
    "url": "favicon.ico",
    "revision": "4738ac6f45f118a3f3e9c23e28ef7c6e"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "a952b4dbb1a2fd7f5f7a3eafad712e42"
  }, {
    "url": "404.html",
    "revision": "3d10f7d018a81bb464ed03f3f1a3f675"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/index-DV8hEefr.css",
    "revision": null
  }, {
    "url": "assets/index-9tZJDG8t.js",
    "revision": null
  }, {
    "url": ".nojekyll",
    "revision": "f98c2182d80a582ba71484cd361f4d81"
  }, {
    "url": "404.html",
    "revision": "3d10f7d018a81bb464ed03f3f1a3f675"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "a952b4dbb1a2fd7f5f7a3eafad712e42"
  }, {
    "url": "favicon.ico",
    "revision": "4738ac6f45f118a3f3e9c23e28ef7c6e"
  }, {
    "url": "icon.svg",
    "revision": "6d57289bb5d6dddd25d547d588d00fa2"
  }, {
    "url": "pwa-192x192.png",
    "revision": "573875d5179b117a6d6bfe246da74c8f"
  }, {
    "url": "pwa-512x512.png",
    "revision": "f28b1a7a4c62e7389aee5c86b0beb11e"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "f28b1a7a4c62e7389aee5c86b0beb11e"
  }, {
    "url": "manifest.webmanifest",
    "revision": "150805ad53c9118da1ad14eb238d740d"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
