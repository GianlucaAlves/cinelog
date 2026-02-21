import { Router } from 'express';
import { getPopularMovies, getPopularSeries } from '../controllers/tmdbController';

const router = Router();

router.get('/movies/popular', getPopularMovies);
router.get('/series/popular', getPopularSeries);

export default router;
