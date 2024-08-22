import isEqual from 'lodash.isequal'; // швидке звірення масивів // швидше джейсон

export const getAndCompare = (storeArr: any[], nodeArr: any[]) =>
  isEqual(
    storeArr.map(e => [e.id]),
    nodeArr.map(e => [e.idFilm])
  );
