import { type ComputedRef } from 'vue';

export type langT = ComputedRef<string> | string; // залежить від vuex гетера

export type FilmForWheel = {
  title: string;
  backdrop_path: string | null;
  id: number;
  poster_path: string | null;
  video: { id: number; results: { [key: string]: string }[] | [] };
};
