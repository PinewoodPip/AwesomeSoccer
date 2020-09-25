export function randomFromRange(min, max) {
    return Math.round(((Math.random() * (max - min)) + min));
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

export function limitRange(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

export function save(value, key) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function load(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

export function countInArray(arr, element) {
  let count = 0;
  for (let x in arr) {
    if (arr[x] == element)
      count++;
  }
  return count;
}

export function noneCheck(val) {
  return (val != 0 && val != undefined && val != null && val != NaN)
}

export function shuffle(array) { // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}