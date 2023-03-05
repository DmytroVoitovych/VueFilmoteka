import { CrossStorageClient, CrossStorageHub } from 'cross-storage';

CrossStorageHub.init([
  {
    origin: /localhost:8080$/,
    allow: ['get', 'set', 'del', 'getKeys', 'clear'],
  },
]);
// Создание экземпляра CrossStorageClient
const storage = new CrossStorageClient('https://vue-filmoteka.vercel.app/', {
  timeout: 10000,
});

// Установка значения в локальное хранилище
const funcSetGlobal = token => {
  console.log(storage);
  storage
    .onConnect()
    .then(() => {
      console.log(storage);
      return storage.set('myToken', token);
    })
    .catch(err => {
      console.error(err);
    });
};

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

// globalStorage.js?b532:18 Error: CrossStorageClient could not connect
//     at eval (client.js?89f0:152:1)
