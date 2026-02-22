import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const bgUrl = `${import.meta.env.BASE_URL}vhs-store-bg.jpg`;

  return (
    <div className="w-full text-white bg-slate-950">
      {/* HERO (only the first screen has the image background) */}
      <section
        className="relative min-h-svh w-full overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(80% 60% at 50% 35%, rgba(0,0,0,0.25), rgba(0,0,0,0.65)),
            linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.7)),
            url('${bgUrl}')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-label="CineLog video rental store entrance"
      >
        <div
          className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_140px_40px_rgba(0,0,0,0.55)]"
          aria-hidden="true"
        />

        {/* Full height; card sits at bottom without spacer */}
        <div className="relative z-10 flex min-h-svh flex-col items-center px-6 pt-10 pb-12">
          <div className="vhs-panel mt-auto w-full max-w-xl rounded-2xl px-8 py-10 text-center">
            <h1 className="mb-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
              CineLog
            </h1>

            <p className="mb-6 text-lg font-semibold text-cyan-200">
              The video store experience, reimagined for the web.
            </p>

            <p className="mb-8 max-w-xl text-sm text-white/80 sm:text-base">
              CineLog isn’t just another movie database. Step into a virtual VHS
              store, browse shelves, discover hidden gems, and host movie nights
              with friends—just like the old days. No endless scrolling, no
              algorithms—just the magic of browsing and sharing movies together.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-cyan-400 text-black hover:bg-cyan-300"
                onClick={() => navigate("/store")}
              >
                Enter the store
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 hover:bg-white/10"
                onClick={() => navigate("/create-session")}
              >
                Create session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* REST OF CONTENT (normal scrolling, no weird top gap) */}
      <main className="relative z-10 flex flex-col items-center px-6">
        <section className="vhs-panel mt-24 mb-24 w-full max-w-3xl rounded-xl p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-cyan-200">
            Why CineLog?
          </h2>

          <p className="mb-6 text-base text-white/90">
            CineLog is more than a movie tracker—it's a community built around
            nostalgia, discovery, and sharing. We recreate the ritual of
            browsing shelves, finding hidden gems, and connecting with friends
            over movie nights. No endless feeds, no impersonal ratings—just real
            collections, real conversations, and real fun.
          </p>

          <ul className="mx-auto mb-6 max-w-xl list-inside list-disc text-left text-white/80">
            <li>
              Relive the magic of VHS stores with virtual aisles and covers
            </li>
            <li>Host and join movie sessions with friends</li>
            <li>Build, organize, and share your personal collection</li>
            <li>Discover movies through community, not algorithms</li>
            <li>Accessible, fast, and designed for movie lovers</li>
          </ul>

          <Button
            size="lg"
            className="mt-4 bg-pink-500 text-white hover:bg-pink-400"
            onClick={() => navigate("/signup")}
          >
            Join CineLog Now
          </Button>
        </section>

        <div className="mt-20 mb-20 grid w-full max-w-5xl gap-8 sm:grid-cols-3">
          <FeatureCard
            title="Browse Like It's 1999"
            description="Walk the aisles, pick up covers, and discover movies the way you remember—no algorithms, just serendipity."
            icon={<VhsIcon />}
            color="from-cyan-400 to-blue-600"
          />
          <FeatureCard
            title="Host Movie Nights"
            description="Create sessions, invite friends, and sync your movie nights—bring back the social magic of VHS rentals."
            icon={<PopcornIcon />}
            color="from-pink-400 to-yellow-400"
          />
          <FeatureCard
            title="Build & Share Collections"
            description="Track what you’ve watched, make lists, and share your shelf with friends—your collection, your way."
            icon={<TapeStackIcon />}
            color="from-yellow-300 to-pink-500"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  color,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <div
      className={`
        group relative rounded-xl p-6 text-center shadow-xl vhs-panel
        bg-linear-to-br ${color}
        border-2 border-transparent
        transition-all duration-300
        hover:border-cyan-300 hover:shadow-[0_0_32px_4px_rgba(34,211,238,0.4)]
        before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-black/70
      `}
      tabIndex={0}
      aria-label={title}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="mb-1 text-lg font-bold drop-shadow-[0_0_8px_cyan]">
        {title}
      </h3>
      <p className="text-sm text-white/90">{description}</p>
    </div>
  );
}

function VhsIcon() {
  return (
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="4"
        width="36"
        height="16"
        rx="3"
        fill="#222"
        stroke="#0ff"
        strokeWidth="2"
      />
      <rect x="10" y="8" width="20" height="8" rx="2" fill="#444" />
      <circle cx="14" cy="12" r="2" fill="#0ff" />
      <circle cx="26" cy="12" r="2" fill="#0ff" />
    </svg>
  );
}

function PopcornIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="16" cy="10" rx="10" ry="6" fill="#fffbe7" />
      <rect x="8" y="10" width="16" height="14" rx="3" fill="#fbbf24" />
      <rect x="10" y="12" width="12" height="10" rx="2" fill="#fff" />
    </svg>
  );
}

function TapeStackIcon() {
  return (
    <svg
      width="36"
      height="28"
      viewBox="0 0 36 28"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="6"
        width="32"
        height="8"
        rx="2"
        fill="#222"
        stroke="#f472b6"
        strokeWidth="2"
      />
      <rect x="6" y="10" width="24" height="4" rx="1" fill="#444" />
      <rect
        x="4"
        y="16"
        width="28"
        height="8"
        rx="2"
        fill="#222"
        stroke="#fde68a"
        strokeWidth="2"
      />
      <rect x="10" y="20" width="16" height="4" rx="1" fill="#444" />
    </svg>
  );
}
