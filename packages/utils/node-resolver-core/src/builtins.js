// @flow strict-local
const builtinModules = [
  '_http_agent',
  '_http_client',
  '_http_common',
  '_http_incoming',
  '_http_outgoing',
  '_http_server',
  '_stream_duplex',
  '_stream_passthrough',
  '_stream_readable',
  '_stream_transform',
  '_stream_wrap',
  '_stream_writable',
  '_tls_common',
  '_tls_wrap',
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'sys',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
];

export const empty: string = '/_empty.js'; //require.resolve('./_empty.js');

// $FlowFixMe
let builtins: {[string]: any, ...} = Object.create(null);
// use definite (current) list of Node builtins
for (let key of builtinModules) {
  builtins[key] = empty;
}

// builtins.assert = 'assert/';
// .buffer = 'buffer/';
// .console = 'console-browserify';
// .constants = 'constants-browserify';
// .crypto = 'crypto-browserify';
// .domain = 'domain-browser';
// .events = 'events/';
// .http = 'stream-http';
// .https = 'https-browserify';
// .os = 'os-browserify/browser.js';
// .path = 'path-browserify';
// .process = 'process/browser.js';
// .punycode = 'punycode/';
// .querystring = 'querystring-es3/';
// .stream = 'stream-browserify';
// .string_decoder = 'string_decoder/';
// .sys = 'util/util.js';
// .timers = 'timers-browserify';
// .tty = 'tty-browserify';
// .url = 'url/';
// .util = 'util/util.js';
// .vm = 'vm-browserify';
// .zlib = 'browserify-zlib';

export default builtins;
