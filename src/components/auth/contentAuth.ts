import { type langT } from '@/types/types';

export const getAuthLoginContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Tilin kirjautuminen',
          'Käyttäjän sähköposti',
          'Salasana',
          'Unohditko salasanasi?',
          'Kirjaudu sisään',
          'Luo tili',
          'Vaihda salasana',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Вхід в обліковий запис',
          'Електронна пошта',
          'Пароль',
          'Забули пароль?',
          'Увійти',
          'Реєстрація',
          'Змінити пароль',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Account Login',
          'User email',
          'Password',
          'Did you forget your password?',
          'Login',
          'Create account',
          'Change password',
        ]
      );
      break;
  }
  return content;
};

export const getAuthRegistrationContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Rekisteröinti',
          'Käyttäjänimi',
          'Sähköpostiosoite',
          'Salasana',
          'Rekisteröidy',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Реєстрація',
          "Ім'я користувача",
          'Електронна пошта',
          'Пароль',
          'Зареєструватися',
        ]
      );
      break;
    default:
      content.push(
        ...['Registration', 'User name', 'User email', 'Password', 'Sign up']
      );
      break;
  }
  return content;
};

export const getAuthChangeContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Salasanan vaihto',
          'Sähköposti',
          'Vanha salasana tai koodi',
          'Uusi salasana',
          'Vaihda',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Зміна паролю',
          'Електронна пошта',
          'Старий пароль чи код доступу',
          'Новий пароль',
          'Змінити',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Change password',
          'User email',
          'Old password or access code',
          'New Password',
          'Change',
        ]
      );
      break;
  }
  return content;
};

export const getAuthLoginConfirmContent = (lang: langT) => {
  const content = [];
  switch (lang) {
    case 'fi':
      content.push(
        ...[
          'Salasanan palautus',
          'Anna sähköpostiosoitteesi. Palautuskoodi lähetetään sinne.',
          'Lähetä',
          'Peruuta',
        ]
      );
      break;
    case 'uk':
      content.push(
        ...[
          'Відновлення паролю',
          'Введіть вашу поштову скриньку. Туда буде відправлено код для відновлення паролю.',
          'Відправити',
          'Відмінити',
        ]
      );
      break;
    default:
      content.push(
        ...[
          'Password Recovery',
          'Enter your email. A recovery code will be sent there.',
          'Send',
          'Cancel',
        ]
      );
      break;
  }
  return content;
};
