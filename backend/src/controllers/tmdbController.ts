import { RequestHandler } from 'express';
import { tmdb } from '../services/tmdbService';

export const getPopularMovies: RequestHandler = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const data = await tmdb.getPopularMovies(page);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
};

export const getPopularSeries: RequestHandler = async (req, res) => {
  try {
    const data = await tmdb.getPopularSeries();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular series' });
  }
};
