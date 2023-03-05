import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import LRUCache from 'lru-cache';

const cacheOptions = new LRUCache({
  ttl: 10 * 60 * 1000, // час життя елемента кешу
  max: 100, //максимальна кількість елементів
  ttlAutopurge: true, //автоматичне видаленн протухших елементів
});

const http = axios.create({
  baseURL: 'https://api.themoviedb.org',
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    defaultCache: cacheOptions,
  }), //кешування
});

export const axio = {
  //мідалвара для лоудера
  loader: http,
};

export default http;

// nodehttp
const { VUE_APP_FILMOTEKA } = process.env;

export const nodeHttp = axios.create({
  baseURL: VUE_APP_FILMOTEKA,
  headers: { 'Cache-Control': 'no-cache' },
});
