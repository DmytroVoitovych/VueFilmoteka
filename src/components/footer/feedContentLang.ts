import { type langT } from '@/types/types';

export const getModalContentFeed = (lang: langT): string[] => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Palaute',
          'Symbolien määrä',
          'Kuvaile löydetty ongelma, virheitä tai ehdotuksesi tämän sivuston parantamiseksi.',
          'lähetä palaute',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          "Зворотній зв'язок",
          'Кількість символів',
          'Опишіть знайдену проблему, помилки або свою пропозицію щодо покращення цього сайту.',
          'надіслати відгук',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Feedback',
          'Amount of symbol',
          'Describe finded problem, bugs or your offer for improving this site.',
          'send feedback',
        ]
      );
      break;
  }
  return content;
};

export const getModalContentNotify = (lang: langT): string[] => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(...['Kiitos huomiostanne, viestinne otetaan huomioon.']);
      break;
    case 'uk':
      content.push(
        ...['Дякую за вашу увагу, ваше повідомлення буде взяте до уваги.']
      );
      break;
    default:
      content.push(
        ...[
          'Thank you for your attention, your message will be taken into consideration.',
        ]
      );
      break;
  }
  return content;
};
