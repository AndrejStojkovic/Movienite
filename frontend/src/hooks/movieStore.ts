import { createStore } from "solid-js/store";
import { api } from "@/utils/api";
import type { Movie } from "@/types";

const [movieStore, setMovieStore] = createStore({
  movies: [] as Movie[],
  loading: true,
  error: null as string | null,
});
export const setMovies = (movies: Movie[]) => setMovieStore("movies", movies);
export const setLoading = (loading: boolean) =>
  setMovieStore("loading", loading);
export const setError = (error: string | null) => setMovieStore("error", error);

export const fetchMovies = async () => {
  setLoading(true);
  setError(null);
  let data = [] as Movie[];
  try {
    data = await api.getMovies();
    setMovies(data);
    return data;
  } catch (e: any) {
    setError(e.message || "Unknown error");
  } finally {
    setLoading(false);
  }
  return data;
};

void fetchMovies();

export default movieStore;
