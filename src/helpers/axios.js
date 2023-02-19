import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import LRUCache from "lru-cache";

const cacheOptions = new LRUCache({
  ttl: 1 * 60 * 1000, // час життя елемента кешу
  max: 100, //максимальна кількість елементів
  ttlAutopurge: true, //автоматичне видаленн протухших елементів
});

const http = axios.create({
  baseURL: "https://api.themoviedb.org",
  headers: { "Cache-Control": "no-cache" },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    defaultCache: cacheOptions,
  }), //кешування
});

export const axio = {
  //мідалвара для лоудера
  loader: http,
};

export default http;
