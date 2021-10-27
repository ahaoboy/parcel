// @flow

import {Resolver} from '@parcel/plugin';
import nullthrows from 'nullthrows';
import fs from 'fs';

const FILES = new Map([
  [
    '@parcel/runtime-js/src/helpers/bundle-manifest.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/bundle-manifest.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/bundle-url.js',
    fs.readFileSync(
      __dirname + '/../../../../packages/runtimes/js/src/helpers/bundle-url.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/cacheLoader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/cacheLoader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/get-worker-url.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/get-worker-url.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/browser/preload-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/browser/preload-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/browser/prefetch-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/browser/prefetch-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/browser/css-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/browser/css-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/browser/html-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/browser/html-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/browser/js-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/browser/js-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/browser/wasm-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/browser/wasm-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/browser/import-polyfill.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/browser/import-polyfill.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/worker/js-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/worker/js-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/worker/wasm-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/worker/wasm-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/node/css-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/node/css-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/node/html-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/node/html-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/node/js-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/node/js-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/runtime-js/src/helpers/node/wasm-loader.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/runtimes/js/src/helpers/node/wasm-loader.js',
      'utf8',
    ),
  ],
  [
    '@parcel/transformer-js/src/esmodule-helpers.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/transformers/js/src/esmodule-helpers.js',
      'utf8',
    ),
  ],
  [
    '@parcel/transformer-react-refresh-wrap/src/helpers/helpers.js',
    fs.readFileSync(
      __dirname +
        '/../../../../packages/transformers/react-refresh-wrap/src/helpers/helpers.js',
      'utf8',
    ),
  ],
]);

function keyStartsWith<T>(map: Map<string, T>, s: string) {
  for (let k of map.keys()) {
    if (k.startsWith(s)) {
      return k;
    }
  }
}

export default (new Resolver({
  resolve({dependency}) {
    let key = keyStartsWith(FILES, dependency.specifier);
    if (key != null) {
      return {
        filePath: `/app/VIRTUAL${key.replace(/\//g, '-')}.js`,
        // filePath: '/VIRTUAL/' + key,
        code: nullthrows(FILES.get(key)),
      };
    }
  },
}): Resolver);
