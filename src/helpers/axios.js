import axios from "axios";

const http = axios.create({
  baseURL: "https://api.themoviedb.org",
  headers: { "Cache-Control": "no-cache" },
});

export const axio = {
  //мідалвара для лоудера
  loader: http,
};

export default http;
