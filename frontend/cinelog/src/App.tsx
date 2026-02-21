// src/App.tsx
import { useEffect, useState } from 'react'
import { MovieCard } from '@/components/MovieCard'
import type { Movie, TMDBResponse } from '../../../backend/src/types/tmdbTypes'

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/movies/popular`);
      const data: TMDBResponse = await res.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchMovies();
}, []);

  

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default App;
