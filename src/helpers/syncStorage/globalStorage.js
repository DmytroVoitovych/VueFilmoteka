import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

const localDB = new PouchDB('mydb');
const remoteDB = new PouchDB('http://localhost:3000/mytoken');

export { localDB, remoteDB };
