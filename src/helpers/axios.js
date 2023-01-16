import axios from "axios";

const http = axios.create({
  baseURL: "https://api.themoviedb.org",
  headers: { "Cache-Control": "no-cache" },
});

export default http;
