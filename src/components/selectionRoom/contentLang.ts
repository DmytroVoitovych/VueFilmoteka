import type { langT } from '@/types/types';

export const getSelectionContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Valitse keräystapa',
          'Vakiolento',
          'Lähtö',
          'Taistelu ><',
          'Kääntymisaika',
          'sek.',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Вибір способу відбору',
          'Стандарт',
          'На виліт',
          'Битва ><',
          'Час обертання',
          'сек.',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Choosing the Selection Method',
          'Standard',
          'Takeoff',
          'Battle ><',
          'Turning time',
          'sec.',
        ]
      );
      break;
  }
  return content;
};

export const getFormAddingFilmContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Etsi elokuva nimellä:',
          'Lisää',
          'Lisää elokuvia ilman hakua nimellä.',
          'Lisättyjen elokuvien luettelo',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Пошук фільму по назві:',
          'Додати',
          'Додавати фільми без пошуку по назві.',
          'Список доданих фільмів',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Search for a movie by title:',
          'Add',
          'Add movies without searching by title.',
          'List of added movies',
        ]
      );
      break;
  }
  return content;
};
