export const getModalContent = lang => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Ääni / Äänet',
          'Suosio',
          'Alkuperäinen Nimi',
          'Genre',
          'Kuvaus',
          'Lisää katsottuihin',
          'Poista katsotuista',
          'Lisää jonoon',
          'Poista jonosta',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Голос / Голоси',
          'Популярність',
          'Оригінальна Назва',
          'Жанр',
          'Опис',
          'в переглянуті',
          'витяти з переглянутих',
          'в чергу',
          'витяти з черги',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Vote / Votes',
          'Popularity',
          'Original Title',
          'Genre',
          'About',
          'add to watched',
          'remove from watched',
          'add to queue',
          'remove from queue',
        ]
      );
      break;
  }
  return content;
};

export const getModalContentPag = lang => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Siirry toiselle sivulle',
          'Saatavilla sivua',
          'Syötä sivunumero navigoidaksesi',
          'Lähetä',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Перехід на іншу сторінку',
          'Доступно сторінок',
          'Введіть номер сторінки для переходу',
          'Надіслати',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Go to another page',
          'Available pages',
          'Enter the page number to navigate',
          'Submit',
        ]
      );
      break;
  }
  return content;
};
