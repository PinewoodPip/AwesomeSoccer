export function randomFromRange(min, max) {
    return Math.round((Math.random() * (max - min) + min));
}

export function format(str) { // by gpvos from stackoverflow
    var args = arguments;
    return str.replace(/\{(\d+)\}/g, function (m, n) { return args[parseInt(n) + 1]; });
  };

export function round(number, places=1) {
    var rounded = Math.round( number * Math.pow(10, places) ) / Math.pow(10, places);
    return rounded;
  }

export function checkRoll(threshold) {
    return (Math.random() < threshold);
}
  
export function randomFromRangeFloat(min, max) {
    return (Math.random() * (max - min) + min);
}

export function importAll(r) {
  // r = require.context(r, false, /\.(gif|jpe?g|svg|png)$/);
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}