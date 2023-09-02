function whatIsInAName(collection, source) {
  const r = [];
  const a = [];
  collection.filter((e, i) => {
    for (let key in source) {
      if (e[key] === source[key] && JSON.stringify(e)) {
        r.push(i);
      }
    }
  });

  r.filter((e, i, arr) =>
    Object.keys(source).length > 1 ? e % arr[i + 1] === 0 : e
  ).forEach(e => a.push(collection[e]));

  return JSON.stringify(collection[0]) === JSON.stringify(source)
    ? [
        collection[0],
        ...a.filter(
          (e, i) => e[Object.keys(source).at(-1)] && e !== collection[0]
        ),
      ]
    : a.filter((e, i) => e[Object.keys(source).at(-1)]);
}

whatIsInAName(
  [
    { first: 'Romeo', last: 'Montague' },
    { first: 'Mercutio', last: null },
    { first: 'Tybalt', last: 'Capulet' },
  ],
  { last: 'Capulet' }
);

whatIsInAName(
  [
    { apple: 1, bat: 2 },
    { apple: 1 },
    { apple: 1, bat: 2, cookie: 2 },
    { bat: 2 },
  ],
  { apple: 1, bat: 2 }
);

whatIsInAName(
  [{ apple: 1, bat: 2 }, { apple: 1 }, { apple: 1, bat: 2, cookie: 2 }],
  { apple: 1, cookie: 2 }
);
whatIsInAName([{ apple: 1 }, { apple: 1 }, { apple: 1, bat: 2 }], { apple: 1 });
