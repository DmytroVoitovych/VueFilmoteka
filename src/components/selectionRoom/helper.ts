import { pick } from 'lodash';
import type { UllistProp } from './localType';
import type { Router } from 'vue-router';

export const getSegmentWidth = (
  circle: number,
  segmentWidth: number,
  numSegments: number
): string => {
  switch (numSegments) {
    case 6:
      return '58%';
    case 5:
      return '74%';
    case 4:
      return '100%';
    case 3:
      return '174%';
    case 2:
      return '100%';
    case 1:
      return '100%';
    default:
      return `calc((${circle}px + ${segmentWidth}px) / (${numSegments} - 1) )`;
  }
};

export const tranformObjectForLists = (arr: {}[], keys: string[]) =>
  arr
    .map(obj => pick(obj, keys))
    .filter(e => 'release_date' in e && e.release_date);

export const getSessionFilmsList = (): string | null =>
  window.sessionStorage.getItem('addedForWheel');

export const changeUrlAndStore = (index: number, router: Router): void => {
  const filmSessionData: UllistProp[] = JSON.parse(
    window.sessionStorage.getItem('addedForWheel') as string
  );

  filmSessionData.splice(index, 1);
  const listId = filmSessionData
    .map(e => (e.id.toString().includes('user') ? e : e.id))
    .join('_');
  window.sessionStorage.setItem(
    'addedForWheel',
    JSON.stringify(filmSessionData)
  );

  router.push({
    name: 'SelectionRoom',
    query: {
      id: `${listId}_`,
    },
  });
};
