type DatalistProp = {
  title: string;
  id: number;
  vote_average: number;
  release_date: string;
};

type UllistProp = {
  title: string;
  id: number;
  release_date: string;
  vote_average?: number;
  backdrop_path?: string | null;
  poster_path?: string | null;
  video?: {
    id: number;
    results:
      | {
          [key: string]: string;
        }[]
      | [];
  };
};

export { type DatalistProp, type UllistProp };
