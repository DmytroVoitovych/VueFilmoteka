import type { AxiosPromise } from 'axios';
import type { AxiosAdapter } from 'axios';
import axios from 'axios';
import { cacheAdapterEnhancer, type ICacheLike } from 'axios-extensions';
import LRUCache from 'lru-cache';

export const cacheOptions = new LRUCache({
  ttl: 10 * 60 * 1000, // час життя елемента кешу
  max: 100, //максимальна кількість елементів
  ttlAutopurge: true, //автоматичне видаленн протухших елементів
});

const http = axios.create({
  baseURL: 'https://api.themoviedb.org',
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, {
    defaultCache: cacheOptions as ICacheLike<AxiosPromise<any>>,
  }), //кешування
});

export const axio = {
  //мідалвара для лоудера
  loader: http,
};

export default http;

// nodehttp
const { VITE_FILMOTEKA, VITE_TELEGRAM } = import.meta.env;

export const nodeHttp = axios.create({
  baseURL: VITE_FILMOTEKA,
  headers: { 'Cache-Control': 'no-cache' },
});

export const botSend = axios.create({
  baseURL: VITE_TELEGRAM,
  headers: { 'Cache-Control': 'no-cache' },
});
