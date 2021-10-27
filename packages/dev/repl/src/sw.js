'use strict';

let isSafari =
  /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
let lastHMRStream;

let sendToIFrame = new Map();
let pages = new Map();
let parentToIframe = new Map();
let iframeToParent = new Map();

const SECURITY_HEADERS = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

const MIME = new Map([
  ['html', 'text/html'],
  ['js', 'text/javascript'],
  ['css', 'text/css'],
]);

// // TODO figure out which script is the entry
// function htmlWrapperForJS(script) {
//   return `<script type="application/javascript">
// window.console = {
//   log: function() {
//     var content = Array.from(arguments)
//       .map(v => (typeof v === "object" ? JSON.stringify(v) : v))
//       .join(" ");
//     document
//       .getElementById("output")
//       .appendChild(document.createTextNode(content + "\\n"));
//   },
//   warn: function() {
//     console.log.apply(console, arguments);
//   },
//   info: function() {
//     console.log.apply(console, arguments);
//   },
//   error: function() {
//     console.log.apply(console, arguments);
//   }
// };
// window.onerror = function(e) {
//   console.error(e.message);
//   console.error(e.stack);
// }
// </script>
// <body>
// Console output:<br>
// <div id="output" style="font-family: monospace;white-space: pre-wrap;"></div>
// </body>
// <script type="application/javascript">
// // try{
// ${script}
// // } catch(e){
// //   console.error(e.message);
// //   console.error(e.stack);
// // }
// </script>`;
// }

self.addEventListener('message', evt => {
  let clientId = evt.source.id;
  let {type, data, id} = evt.data;
  if (type === 'setFS') {
    evt.source.postMessage({id});
    pages.set(clientId, data);
  } else if (type === 'getID') {
    evt.source.postMessage({id, data: clientId});
  } else if (type === 'hmrUpdate') {
    let send = sendToIFrame.get(parentToIframe.get(clientId)) ?? lastHMRStream;
    send?.(data);
    evt.source.postMessage({id});
  }
});

let encodeUTF8 = new TextEncoder('utf-8');

self.addEventListener('fetch', evt => {
  let url = new URL(evt.request.url);
  let {clientId} = evt;
  let parentId;
  if (!clientId && url.searchParams.has('parentId')) {
    clientId = evt.resultingClientId ?? evt.targetClientId;
    parentId = url.searchParams.get('parentId');
    parentToIframe.set(parentId, clientId);
    iframeToParent.set(clientId, parentId);
  } else {
    parentId = iframeToParent.get(evt.clientId);
  }
  if (!parentId && isSafari) {
    parentId = [...pages.keys()].slice(-1)[0];
  }

  if (parentId != null) {
    if (
      evt.request.headers.get('Accept') === 'text/event-stream' &&
      url.pathname === '/__parcel_hmr'
    ) {
      let stream = new ReadableStream({
        start: controller => {
          let cb = data => {
            let chunk = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encodeUTF8.encode(chunk));
          };
          sendToIFrame.set(clientId, cb);
          lastHMRStream = cb;
        },
      });

      evt.respondWith(
        new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Transfer-Encoding': 'chunked',
            Connection: 'keep-alive',
            ...SECURITY_HEADERS,
          },
        }),
      );
    } else if (url.pathname.startsWith('/__repl_dist/')) {
      let filename = url.pathname.slice('/__repl_dist/'.length);
      let file = pages.get(parentId)?.[filename];
      if (file == null) {
        console.error('requested missing file', parentId, filename, pages);
      }

      evt.respondWith(
        new Response(file, {
          headers: {
            'Content-Type': MIME.get(extname(filename)) + '; charset=utf-8',
            'Cache-Control': 'no-store',
            ...SECURITY_HEADERS,
          },
        }),
      );
    }
  }
});

function extname(filename) {
  return filename.slice(filename.lastIndexOf('.') + 1);
}

function removeNonExistingKeys(existing, map) {
  for (let id of map.keys()) {
    if (!existing.has(id)) {
      map.delete(id);
    }
  }
}
setInterval(async () => {
  let existingClients = new Set((await self.clients.matchAll()).map(c => c.id));

  removeNonExistingKeys(existingClients, pages);
  removeNonExistingKeys(existingClients, sendToIFrame);
  removeNonExistingKeys(existingClients, parentToIframe);
  removeNonExistingKeys(existingClients, iframeToParent);
}, 20000);
