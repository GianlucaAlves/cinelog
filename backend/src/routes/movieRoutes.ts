import { Router } from "express";
import {
  getMovieDetail,
  getReviews,
  createReview,
  getWatchlistStatus,
  addToWatchlist,
  removeFromWatchlist,
} from "../controllers/movieController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Public
router.get("/:tmdbId", getMovieDetail);
router.get("/:tmdbId/reviews", getReviews);

// Protected
router.post("/:tmdbId/reviews", requireAuth, createReview);
router.get("/:tmdbId/watchlist", requireAuth, getWatchlistStatus);
router.post("/:tmdbId/watchlist", requireAuth, addToWatchlist);
router.delete("/:tmdbId/watchlist", requireAuth, removeFromWatchlist);

export default router;
