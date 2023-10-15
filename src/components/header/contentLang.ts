import { type langT } from '@/types/types';

const getAuthContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push('Kirjautuminen');
      break;
    case 'uk':
      content.push('Авторизація');
      break;
    default:
      content.push('Authorization');
      break;
  }
  return content.join('');
};

const getLinkContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(...['Etusivu', 'Kirjasto']);
      break;
    case 'uk':
      content.push(...['Головна', 'Бібліотека']);
      break;
    default:
      content.push(...['Home', 'My library']);
      break;
  }
  return content;
};

const getInputContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push('Elokuvien haku');
      break;
    case 'uk':
      content.push('Пошук фільмів');
      break;
    default:
      content.push('Movie search');
      break;
  }
  return content.join('');
};

const getButtonContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(...['NAHTU', 'JONO']);
      break;
    case 'uk':
      content.push(...['ПЕРЕГЛЯНУТІ', 'У ЧЕРЗІ']);
      break;
    default:
      content.push(...['WATCHED', 'QUEUE']);
      break;
  }
  return content;
};

export const getCont = {
  getAuthContent,
  getLinkContent,
  getInputContent,
  getButtonContent,
};
