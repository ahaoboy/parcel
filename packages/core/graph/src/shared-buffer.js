// @flow
/* global MessageChannel:readonly */
// Copy from @parcel/utils to fix: https://github.com/stackblitz/core/issues/1855
export let SharedBuffer: Class<ArrayBuffer> | Class<SharedArrayBuffer>;

if (typeof SharedArrayBuffer !== 'undefined') {
  SharedBuffer = SharedArrayBuffer;
  if (typeof MessageChannel !== 'undefined') {
    let channel = new MessageChannel();
    try {
      // Firefox might throw when sending the Buffer over a MessagePort
      channel.port1.postMessage(new SharedArrayBuffer(0));
      SharedBuffer = SharedArrayBuffer;
    } catch (_) {
      SharedBuffer = ArrayBuffer;
    }
    channel.port1.close();
    channel.port2.close();
  }
} else {
  SharedBuffer = ArrayBuffer;
}
