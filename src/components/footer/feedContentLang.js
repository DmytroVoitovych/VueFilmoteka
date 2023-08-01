export const getModalContentFeed = lang => {
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
