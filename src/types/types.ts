import { type ComputedRef } from 'vue';

export type langT = ComputedRef<string> | string; // залежить від vuex гетера

export type FilmForWheel = {
  title: string;
  backdrop_path: string;
  id: number;
  poster_path: string;
  video: { id: number; results: { [key: string]: string }[] };
};
