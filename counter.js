const chceckIdFilmData = (storeArr, arr) =>
  storeArr.every(e => arr.includes(e) && arr.length === storeArr.length);

const arr = [4546, 7878, 7, 90, 34];
const storeArr = [4546, 7878, 7, 90, 34];

console.log(chceckIdFilmData(storeArr, arr));
