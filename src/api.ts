const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

const url = `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export const getMovies = () => {
  return fetch(url, options).then((response) => response.json());
};
