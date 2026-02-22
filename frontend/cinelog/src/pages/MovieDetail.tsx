import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  getMovieDetail,
  getReviews,
  createReview,
  getWatchlistStatus,
  addToWatchlist,
  removeFromWatchlist,
} from "@/api/movies";
import type { MovieDetail, Review } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

const TMDB_IMAGE = "https://image.tmdb.org/t/p/";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={clsx(
            "text-2xl leading-none transition-transform duration-100",
            (hovered || value) >= star
              ? "text-yellow-400 scale-110"
              : "text-slate-600",
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function MovieDetailPage() {
  const { tmdbId } = useParams<{ tmdbId: string }>();
  const [params] = useSearchParams();
  const mediaType = (params.get("type") as "movie" | "tv") ?? "movie";

  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem("accessToken");
  const displayTitle = detail?.title ?? detail?.name ?? "";
  const releaseDate = detail?.release_date ?? detail?.first_air_date ?? "";
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const runtime = detail?.runtime
    ? `${detail.runtime} min`
    : detail?.episode_run_time?.[0]
      ? `~${detail.episode_run_time[0]} min / ep`
      : detail?.number_of_seasons
        ? `${detail.number_of_seasons} season${detail.number_of_seasons > 1 ? "s" : ""}`
        : null;

  useEffect(() => {
    if (!tmdbId) return;
    setLoading(true);
    setError(null);

    Promise.all([
      getMovieDetail(tmdbId, mediaType),
      getReviews(tmdbId),
      isLoggedIn
        ? getWatchlistStatus(tmdbId)
        : Promise.resolve({ inWatchlist: false }),
    ])
      .then(([d, r, wl]) => {
        setDetail(d);
        setReviews(r);
        setInWatchlist(wl.inWatchlist);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, [tmdbId, mediaType, isLoggedIn]);

  async function handleWatchlist() {
    if (!detail || !tmdbId) return;
    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(tmdbId);
        setInWatchlist(false);
      } else {
        await addToWatchlist(tmdbId, {
          title: displayTitle,
          type: mediaType,
          releaseDate: releaseDate || new Date().toISOString(),
          posterPath: detail.poster_path ?? "",
        });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWatchlistLoading(false);
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!detail || !tmdbId || rating === 0) return;
    setSubmitting(true);
    setReviewError(null);
    try {
      const saved = await createReview(tmdbId, {
        rating,
        text: reviewText,
        title: displayTitle,
        type: mediaType,
        releaseDate: releaseDate || new Date().toISOString(),
        posterPath: detail.poster_path ?? "",
      });
      setReviews((prev) => {
        const without = prev.filter(
          (r) => r.user.username !== saved.user.username,
        );
        return [saved, ...without];
      });
      setReviewText("");
      setRating(0);
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : "Failed to save review",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (error)
    return (
      <div className="min-h-svh bg-slate-950 text-red-400 flex items-center justify-center p-8">
        {error}
      </div>
    );

  return (
    <div className="min-h-svh bg-slate-950 text-white">
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {loading ? (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) : detail?.backdrop_path ? (
          <>
            <img
              src={`${TMDB_IMAGE}w1280${detail.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        {/* Back link */}
        <Link
          to="/store"
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-100 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-4 h-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Store
        </Link>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-16 -mt-32 relative z-10">
        <div className="flex gap-6 items-end">
          {/* Poster */}
          <div className="shrink-0">
            {loading ? (
              <Skeleton className="w-32 md:w-44 aspect-2/3 rounded" />
            ) : (
              <div className="vhs-tape w-32 md:w-44 rounded overflow-hidden">
                {/* Cassette top band */}
                <div className="h-5 bg-linear-to-b from-neutral-950 to-neutral-900 flex items-center justify-between px-2 border-b border-amber-900/20">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 border border-neutral-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 border border-neutral-600" />
                  </div>
                  <span className="text-[7px] font-mono text-amber-700/50 tracking-widest">
                    VHS
                  </span>
                </div>
                {detail?.poster_path ? (
                  <img
                    src={`${TMDB_IMAGE}w500${detail.poster_path}`}
                    alt={displayTitle}
                    className="w-full aspect-2/3 object-cover"
                  />
                ) : (
                  <div className="aspect-2/3 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    No Image
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0 pb-2">
            {loading ? (
              <>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-yellow-400 text-black px-2 py-0.5 rounded-sm">
                    {mediaType === "tv" ? "SERIES" : "MOVIE"}
                  </span>
                  {detail?.status && (
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                      {detail.status}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold neon-text leading-tight">
                  {displayTitle}
                </h1>
                {detail?.tagline && (
                  <p className="mt-1 text-sm text-slate-400 italic">
                    "{detail.tagline}"
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  {year && <span>{year}</span>}
                  {runtime && <span>· {runtime}</span>}
                  <span className="flex items-center gap-1">
                    · <span className="text-yellow-400">★</span>
                    <span>{detail?.vote_average?.toFixed(1)}</span>
                    <span className="text-slate-500 text-xs">
                      ({detail?.vote_count?.toLocaleString()})
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {detail?.genres?.map((g) => (
                    <span
                      key={g.id}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-cyan-800/50 text-cyan-300/80 bg-cyan-950/40"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Watchlist button */}
        {!loading && (
          <div className="mt-6">
            {isLoggedIn ? (
              <button
                onClick={handleWatchlist}
                disabled={watchlistLoading}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2 rounded text-sm font-bold tracking-wide transition-all duration-200",
                  inWatchlist
                    ? "bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 hover:bg-red-950/50 hover:border-red-500/50 hover:text-red-300"
                    : "bg-yellow-400 text-black hover:bg-yellow-300",
                  watchlistLoading && "opacity-60 pointer-events-none",
                )}
              >
                {inWatchlist ? (
                  <>
                    <span>✓</span> In my list
                    <span className="text-[10px] font-normal opacity-60 ml-1">
                      (click to remove)
                    </span>
                  </>
                ) : (
                  <>
                    <span>＋</span> Add to my list
                  </>
                )}
              </button>
            ) : (
              <p className="text-sm text-slate-400">
                <Link to="/login" className="text-cyan-300 hover:underline">
                  Sign in
                </Link>{" "}
                to add to your watchlist
              </p>
            )}
          </div>
        )}

        {/* Overview */}
        {!loading && detail?.overview && (
          <p className="mt-6 text-slate-300 leading-relaxed max-w-3xl">
            {detail.overview}
          </p>
        )}

        {/* ── Review form ─────────────────────────────────────── */}
        <div className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="text-xl font-extrabold neon-text mb-4">Reviews</h2>

          {isLoggedIn ? (
            <form
              onSubmit={handleReviewSubmit}
              className="vhs-panel rounded-lg p-4 md:p-5 mb-6 space-y-3"
            >
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                Your Review
              </p>
              <StarPicker value={rating} onChange={setRating} />
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your thoughts…"
                rows={3}
                required
                className="w-full bg-slate-900/80 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none focus:border-cyan-600"
              />
              {reviewError && (
                <p className="text-red-400 text-xs">{reviewError}</p>
              )}
              <button
                type="submit"
                disabled={submitting || rating === 0 || !reviewText.trim()}
                className="px-5 py-2 bg-yellow-400 text-black text-sm font-black rounded hover:bg-yellow-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {submitting ? "Saving…" : "Post Review"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-400 mb-6">
              <Link to="/login" className="text-cyan-300 hover:underline">
                Sign in
              </Link>{" "}
              to leave a review
            </p>
          )}

          {/* Review list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No reviews yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="vhs-panel rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-cyan-200">
                      {r.user.username}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={
                            s <= r.rating ? "text-yellow-400" : "text-slate-700"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {r.text}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
