import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getShelves } from "@/api/movies";
import type { Movie, Shelf } from "@/types";
import clsx from "clsx";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const VHS_STORE_INTERIOR_IMAGE = `${import.meta.env.BASE_URL}Nostalgia-Video.jpg`;

export default function Store() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getShelves()
      .then((data: Shelf[]) => {
        if (mounted) setShelves(data);
      })
      .catch((err: unknown) => {
        if (!mounted) return;

        if (err instanceof Error) {
          setError(err.message);
          return;
        }

        setError("Failed to load shelves.");
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div
      className="relative isolate min-h-svh w-full bg-slate-950 text-white overflow-x-hidden"
      aria-label="CineLog Store Shelves"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(2, 6, 23, 0.12), rgba(2, 6, 23, 0.42)),
            url('${VHS_STORE_INTERIOR_IMAGE}')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        aria-hidden="true"
      />

      <header className="sticky top-0 z-20 vhs-panel py-3 px-4 flex items-center gap-4 border-x-0 rounded-none">
        <h1 className="text-2xl font-extrabold tracking-tight neon-text">
          CineLog Store
        </h1>
        <span className="text-xs text-yellow-300/70 font-mono tracking-widest uppercase hidden sm:block">
          — browse &amp; rent —
        </span>
      </header>

      {/* Side vignettes so background shows but shelves feel contained */}
      <div
        className="pointer-events-none fixed inset-y-0 left-0 w-[8vw] z-10 bg-gradient-to-r from-black/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-y-0 right-0 w-[8vw] z-10 bg-gradient-to-l from-black/70 to-transparent"
        aria-hidden="true"
      />

      <main className="relative z-10 flex flex-col gap-0 py-6">
        <div className="max-w-5xl mx-auto w-full">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <ShelfSkeleton key={i} />
              ))
            : shelves.map((shelf: Shelf) => (
                <VhsShelf key={shelf.id} shelf={shelf} />
              ))}
        </div>
      </main>
    </div>
  );
}

function VhsShelf({ shelf }: { shelf: Shelf }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    dragFree: true,
  });

  const tweenTargets = useRef<HTMLElement[]>([]);
  const rafId = useRef<number | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const applyTween = useCallback((api: EmblaCarouselType) => {
    const progress = api.scrollProgress();
    const snaps = api.scrollSnapList();
    tweenTargets.current.forEach((node, i) => {
      if (!node) return;
      const snap = snaps[i] ?? 0;
      const diff = snap - progress;
      // scale: centered = 1.0, edges = 0.78
      const scale = Math.max(1 - Math.abs(diff) * 0.6, 0.78);
      // opacity: centered = 1.0, edges = 0.35
      const opacity = Math.max(1 - Math.abs(diff) * 1.4, 0.35);
      // subtle 3D tilt toward viewer: negative diff = left of center, tilts right
      const rotateY = diff * -18;
      node.style.transform = `scale(${scale}) rotateY(${rotateY}deg)`;
      node.style.opacity = String(opacity);
    });
  }, []);

  const syncScrollState = useCallback((api: EmblaCarouselType) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const collectTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenTargets.current = api
      .slideNodes()
      .map((node) => node.querySelector<HTMLElement>("[data-tween]")!);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    collectTweenNodes(emblaApi);
    applyTween(emblaApi);
    syncScrollState(emblaApi);

    const onScroll = () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => applyTween(emblaApi));
    };

    emblaApi.on("scroll", onScroll);
    emblaApi.on("select", () => syncScrollState(emblaApi));
    emblaApi.on("reInit", () => {
      collectTweenNodes(emblaApi);
      applyTween(emblaApi);
      syncScrollState(emblaApi);
    });

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [emblaApi, applyTween, syncScrollState, collectTweenNodes]);

  return (
    <section className="px-4" aria-label={shelf.title} tabIndex={-1}>
      <div className="shelf-genre-tag">{shelf.title}</div>

      <div className="relative vhs-shelf-row" style={{ perspective: "900px" }}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {shelf.movies.map((movie: Movie) => (
              <div
                key={movie.id}
                className="min-w-0 shrink-0 grow-0 basis-1/2 sm:basis-1/3 md:basis-1/4 pl-3"
                role="group"
                aria-roledescription="slide"
              >
                {/* data-tween is the node we manipulate directly */}
                <div
                  data-tween
                  style={{
                    willChange: "transform, opacity",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <VhsCover movie={movie} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full-height side nav panels */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          aria-label="Previous"
          className={clsx(
            "shelf-nav-panel shelf-nav-panel--left",
            !canScrollPrev && "opacity-0 pointer-events-none",
          )}
        >
          <svg
            className="shelf-nav-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="shelf-nav-label">REW</span>
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          aria-label="Next"
          className={clsx(
            "shelf-nav-panel shelf-nav-panel--right",
            !canScrollNext && "opacity-0 pointer-events-none",
          )}
        >
          <svg
            className="shelf-nav-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="shelf-nav-label">FF</span>
        </button>
      </div>
    </section>
  );
}

function VhsCover({ movie }: { movie: Movie }) {
  const posterSrc = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  return (
    <Link
      to={`/movie/${movie.id}?type=${movie.media_type ?? "movie"}`}
      className={clsx(
        "group relative flex flex-col items-center w-full focus:outline-none",
        "transition-transform duration-200 hover:-translate-y-3 focus:-translate-y-3",
      )}
      aria-label={movie.title}
    >
      <div className="vhs-tape w-full relative overflow-hidden rounded">
        {/* VHS cassette top header band */}
        <div className="h-5 w-full bg-gradient-to-b from-neutral-950 to-neutral-900 flex items-center justify-between px-2 border-b border-amber-900/20">
          <div className="flex gap-1.5 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 border border-neutral-600 shadow-inner" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 border border-neutral-600 shadow-inner" />
          </div>
          <span className="text-[8px] font-mono text-amber-700/60 tracking-widest">
            VHS
          </span>
        </div>

        {/* Poster */}
        <div className="aspect-[2/3] relative">
          {posterSrc ? (
            <img
              src={posterSrc}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-400 bg-slate-900">
              No Image
            </div>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/90 to-transparent flex items-end px-1.5 pb-1">
            <span className="text-[10px] font-bold text-white/90 truncate leading-tight">
              {movie.title}
            </span>
          </div>
        </div>
      </div>

      {/* Rental sticker — always present but spins on hover */}
      <div
        className="absolute top-[18px] right-0 z-10 bg-yellow-400 text-black text-[8px] font-black px-1.5 py-0.5 shadow-md leading-none"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)" }}
        aria-hidden="true"
      >
        RENT
      </div>
    </Link>
  );
}

function ShelfSkeleton() {
  return (
    <section className="px-2">
      <div className="mb-1 h-4 w-32 rounded bg-slate-800 animate-pulse" />
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-[2/3] w-20 sm:w-24 md:w-28 rounded"
          />
        ))}
      </div>
    </section>
  );
}
