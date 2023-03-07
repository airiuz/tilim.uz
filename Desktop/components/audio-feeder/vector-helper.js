// Define an allocator and blit function for float arrays
// Can be used to achieve backwards compatibility down to dark ages pre IE 10 if needed
// Also reduces code size a little with closure.

var VH = {
  float_array: function (len) {
    return new Float32Array(len);
  },
  blit: function (src, spos, dest, dpos, len) {
    dest.set(src.subarray(spos, spos + len), dpos);
  },
};

export default VH;
