export const getNotfoundContent = lang => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...['Valitettavasti tätä sivua ei ole olemassa.', 'Mene kotiin']
      );
      break;
    case 'uk':
      content.push(...['Вибачте, але цієї сторінки не існує.', 'На головну']);
      break;
    default:
      content.push(...['Sorry, but this page is not exist.', 'Go home']);
      break;
  }
  return content;
};
