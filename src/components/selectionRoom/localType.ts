type DatalistProp = {
  title: string;
  id: number;
  vote_average: number;
  release_date: string;
};

type UllistProp = {
  title: string;
  id: number;
  vote_average?: number;
  backdrop_path?: string | null;
  poster_path?: string | null;
};

export { type DatalistProp, type UllistProp };
