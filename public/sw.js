if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>a(e,t),u={module:{uri:t},exports:c,require:r};s[t]=Promise.all(n.map((e=>u[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-07672ec7"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"00cc9552de433c541f7f679534be2282"},{url:"/_next/dynamic-css-manifest.json",revision:"d751713988987e9331980363e24189ce"},{url:"/_next/static/6uqN_hWLa8LFv5ed0YOyZ/_buildManifest.js",revision:"c2b309af9677fef6f6dd16a290067e87"},{url:"/_next/static/6uqN_hWLa8LFv5ed0YOyZ/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/173-91338b30b9b5d408.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/4bd1b696-3bd8d8790df389f3.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/517-2654ea947cee027f.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/735.6e9c7e96f28c50e2.js",revision:"6e9c7e96f28c50e2"},{url:"/_next/static/chunks/736-2a88ed0a4c40cde6.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/993-15a81270e70d8901.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/_not-found/page-7da39ccd95710e08.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/auth/callback/page-69a34cece3c160aa.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/auth/signin/page-2abd804f7835ad6e.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/auth/signup/page-f9a8e4c6bb78efec.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/auth/verify/page-e09c41ed9667f8ca.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/dashboard/page-20477a2b1f08f177.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/exercises/page-6c9d5d2a64f4317b.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/layout-7fe1a6399017b454.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/meals/page-a9df938c093686fd.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/page-6b347bcd7b0792c8.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/vital-signs/%5Bid%5D/page-aacd3f8b23114271.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/app/vital-signs/page-34d340e2a7857a96.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/framework-6b27c2b7aa38af2d.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/main-4d62f31cf24a053c.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/main-app-c545f10c639df3c8.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/pages/_app-d23763e3e6c904ff.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-ed793a2fa1308541.js",revision:"6uqN_hWLa8LFv5ed0YOyZ"},{url:"/_next/static/css/43240f317716557b.css",revision:"43240f317716557b"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/manifest.json",revision:"1632e74fadd20cec2ae88b914189c197"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
