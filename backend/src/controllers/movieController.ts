import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../lib/prisma";

const TMDB_API = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.TMDB_API_KEY ?? process.env.API_KEY;

function tmdbHeaders() {
  return {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_TOKEN}`,
  };
}

// GET /api/movies/:tmdbId?type=movie|tv
export async function getMovieDetail(req: Request, res: Response) {
  const { tmdbId } = req.params;
  const mediaType = (req.query.type as string) === "tv" ? "tv" : "movie";

  try {
    const { data } = await axios.get<Record<string, unknown>>(
      `${TMDB_API}/${mediaType}/${tmdbId}`,
      { headers: tmdbHeaders() },
    );
    res.json({ ...data, media_type: mediaType });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to fetch from TMDB" });
  }
}

// GET /api/movies/:tmdbId/reviews
export async function getReviews(req: Request, res: Response) {
  const tmdbId = Number(req.params.tmdbId);

  try {
    const movie = await prisma.movie.findUnique({ where: { tmdbId } });
    if (!movie) return res.json([]);

    const reviews = await prisma.review.findMany({
      where: { movieId: movie.id },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST /api/movies/:tmdbId/reviews  (requires auth)
export async function createReview(req: Request, res: Response) {
  const tmdbId = Number(req.params.tmdbId);
  const { rating, text, title, type, releaseDate, posterPath } = req.body;
  const userId = req.userId!;

  if (!rating || !text) {
    return res.status(400).json({ error: "rating and text are required" });
  }

  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId },
      update: {},
      create: {
        tmdbId,
        title: title ?? "Unknown",
        type: type ?? "movie",
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        posterPath: posterPath ?? "",
      },
    });

    // One review per user per movie — update if exists, create otherwise
    const existing = await prisma.review.findFirst({
      where: { userId, movieId: movie.id },
    });

    let review;
    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating: Number(rating), text },
        include: { user: { select: { username: true } } },
      });
    } else {
      review = await prisma.review.create({
        data: { userId, movieId: movie.id, rating: Number(rating), text },
        include: { user: { select: { username: true } } },
      });
    }

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/movies/:tmdbId/watchlist  (requires auth — returns status)
export async function getWatchlistStatus(req: Request, res: Response) {
  const tmdbId = Number(req.params.tmdbId);
  const userId = req.userId!;

  try {
    const movie = await prisma.movie.findUnique({ where: { tmdbId } });
    if (!movie) return res.json({ inWatchlist: false });

    const entry = await prisma.watchlist.findFirst({
      where: { userId, movieId: movie.id },
    });

    res.json({ inWatchlist: !!entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST /api/movies/:tmdbId/watchlist  (requires auth — add)
export async function addToWatchlist(req: Request, res: Response) {
  const tmdbId = Number(req.params.tmdbId);
  const { title, type, releaseDate, posterPath } = req.body;
  const userId = req.userId!;

  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId },
      update: {},
      create: {
        tmdbId,
        title: title ?? "Unknown",
        type: type ?? "movie",
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        posterPath: posterPath ?? "",
      },
    });

    const existing = await prisma.watchlist.findFirst({
      where: { userId, movieId: movie.id },
    });
    if (existing)
      return res.status(409).json({ error: "Already in watchlist" });

    const entry = await prisma.watchlist.create({
      data: { userId, movieId: movie.id },
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE /api/movies/:tmdbId/watchlist  (requires auth — remove)
export async function removeFromWatchlist(req: Request, res: Response) {
  const tmdbId = Number(req.params.tmdbId);
  const userId = req.userId!;

  try {
    const movie = await prisma.movie.findUnique({ where: { tmdbId } });
    if (!movie) return res.status(404).json({ error: "Not found" });

    await prisma.watchlist.deleteMany({ where: { userId, movieId: movie.id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
