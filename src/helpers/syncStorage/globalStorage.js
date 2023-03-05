import { CrossStorageClient } from 'cross-storage';

// Создание экземпляра CrossStorageClient
const storage = new CrossStorageClient('https://vue-filmoteka.vercel.app/');

// Установка значения в локальное хранилище
const funcSetGlobal = token =>
  storage
    .onConnect()
    .then(() => {
      return storage.set('myToken', token);
    })
    .catch(err => {
      console.error(err);
    });

// Получение значения из локального хранилища
const funcGetGlobal = () =>
  storage
    .onConnect()
    .then(() => {
      return storage.get('myToken');
    })
    .then(value => {
      console.log('Value:', value);
    })
    .catch(err => {
      console.error(err);
    });

export { funcGetGlobal, funcSetGlobal };
