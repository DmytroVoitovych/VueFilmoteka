import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

const localDB = new PouchDB('mydb');
const remoteDB = new PouchDB('https://vue-filmoteka.vercel.app/mytoken');

export { localDB, remoteDB };
