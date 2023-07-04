export const getModalContent = lang => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(...['Ääni / Äänet', 'Suosio', 'Alkuperäinen Nimi', 'Genre', 'Kuvaus']);
      break;
    case 'uk':
      content.push(...['Голос / Голоси', 'Популярність', 'Оригінальна Назва', 'Жанр', 'Опис']);
      break;
    default:
      content.push(...['Vote / Votes', 'Popularity', 'Original Title', 'Genre', 'About']);
      break;
  }
  return content;
};
