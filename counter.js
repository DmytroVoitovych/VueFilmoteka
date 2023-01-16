// const counter = (n) => {
//   const data = [];
//   const find = '9';
//   const l = String(n);
//     if (l.length > 6) {
//         const sli = +l.split('').slice(-6).join('');

//         for (let i = 1; i <= sli; i++) {
//             data.push(i.length > 1 || String(i).split(''));
//         }

//         const normali = data.flat(2).filter(e => e === find).length;

//         return l.length <= 6 ? normali : +`${l.length - 1}00000` * l.split('').slice(0, l.length - 6).join('') + normali;
//     }

//     else {
//         const sli = +l.split('').slice(-5).join('');
//         for (let i = 1; i <= sli; i++) {
//             data.push(i.length > 1 || String(i).split(''));
//         }

//         const normali = data.flat(2).filter(e => e === find).length;
//         return l.length <= 5 ? normali : +`${l.length - 1}0000` * l.split('').slice(0, l.length - 5).join('') + normali;
//     }
// };
function counter(n) {
  const data = [];
  const find = "9";
  const l = String(n);
  const sli = +l.split("").slice(-6).join("");

  for (let i = 1; i <= sli; i++) {
    data.push(i.length > 1 || String(i).split(""));
  }

  const normali = data
    .flat(2)
    .filter((e) => e === find).length;

  return l.length <= 6
    ? normali
    : l.length <= 13
    ? +`${l.length - 1}00000` *
        l
          .split("")
          .slice(0, l.length - 6)
          .join("") +
      normali
    : +`${l.length - 6}00000` *
        l
          .split("")
          .slice(l.length - 9, l.length - 6)
          .join("") +
      normali;
}

counter(8);
console.log(`9 => 8 = ${counter(8)}`);
console.log(`9 => 9 = ${counter(9)}`);
console.log(`9 => 10 = ${counter(10)}`);
console.log(`9 => 98 = ${counter(100)}`);
console.log(`9 => 100 = ${counter(565754)}`);
console.log(`9 => дох*я = ${counter(1009000000009)}`);
