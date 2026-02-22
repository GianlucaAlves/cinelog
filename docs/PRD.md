# CineLog — Product Requirements Document

**Version:** 1.1  
**Author:** Gianluca  
**Date:** February 2026  
**Status:** Draft

---

## 1. Project Overview

CineLog is a full-stack web application inspired by Letterboxd that allows users to discover, track, review, and rate movies and TV series.

**Experience direction (v1.1):** The public-facing homepage (guest) should feel like the **entrance of a video rental store** ("locadora") — neon ambience, glass door entry ritual, and a guided “walk-in” into browsing, while still being a modern web product.

---

## 2. Goals

- Build a complete full-stack project independently to demonstrate ownership of the entire codebase
- Practice JWT authentication with access + refresh token rotation
- Design and consume a self-owned REST API from a React frontend
- Integrate TMDB as an external data source through a backend proxy layer
- Produce a portfolio-ready project with real-world features
- Deliver a distinctive UX: **Video-rental entrance homepage** + “corridors” browsing metaphor

---

## 3. Out of Scope (v1.x)

These will **not** be built in the first versions to keep scope manageable:

- Social features (following users, activity feed)
- Comments on reviews
- Notifications
- Admin panel
- Mobile app
- True synchronized watch party playback (BYOS sync, DRM constraints). We can simulate “sessions” UI, but not implement full sync.

---

## 4. User Personas

| Persona | Description |
|---|---|
| **Guest** | Can browse movies/series and read reviews, cannot interact |
| **Registered User** | Can log in, rate, review, and manage a watchlist |

---

## 5. Functional Requirements

### 5.1 Authentication

| ID | Requirement |
|---|---|
| AUTH-01 | User can register with email, username, and password |
| AUTH-02 | Password is hashed with bcrypt before storing |
| AUTH-03 | User can log in and receives an access token (15min) + refresh token (7d) |
| AUTH-04 | Refresh token is stored in an HttpOnly cookie |
| AUTH-05 | User can log out (invalidates refresh token) |
| AUTH-06 | Protected routes return 401 if no valid token |

---

### 5.2 Discovery (Movies & Series)

| ID | Requirement |
|---|---|
| DISC-01 | Guest homepage `/` is a **video rental entrance** experience (door/entry CTA), and provides clear paths into browsing and search |
| DISC-02 | User can search movies and series by title via unified search |
| DISC-03 | Results are paginated (20 items per page) |
| DISC-04 | User can filter browse by genre |
| DISC-05 | Each card shows: poster, title, year, and average TMDB rating |
| DISC-06 | Trending movies and trending series from TMDB are available on browse views |

#### 5.2.1 Homepage “Video Rental Entrance” (Guest)

| ID | Requirement |
|---|---|
| HOME-01 | Homepage must not look like an internal catalog page; it must feel like a “front door” |
| HOME-02 | Primary CTA: “Enter the store” → navigates into browse corridors |
| HOME-03 | Secondary CTA: “Create session” → routes to auth if not logged in (or opens modal) |
| HOME-04 | Subtle ambience controls: sound toggle (off by default), reduce motion toggle |
| HOME-05 | Accessibility: keyboard navigation works for main actions; reduce motion is respected |

#### 5.2.2 Browse “Corridors” Experience (Guest)

| ID | Requirement |
|---|---|
| COR-01 | Browse is organized into 3–5 “corridors” (e.g., New Releases, Horror, Anime, Series) |
| COR-02 | “Walking” is represented by horizontal section navigation (snap points) |
| COR-03 | Each corridor contains a shelf carousel of titles (shadcn/ui carousel) |
| COR-04 | Parallax/ambient motion must be subtle and disabled with prefers-reduced-motion |

---

### 5.3 Detail Pages

| ID | Requirement |
|---|---|
| DET-01 | Movie detail page shows: poster, backdrop, title, synopsis, genres, runtime, release date, cast |
| DET-02 | Series detail page shows: poster, backdrop, title, synopsis, genres, number of seasons, status |
| DET-03 | Detail page shows community reviews from CineLog users |
| DET-04 | Detail page shows the logged-in user's own review if it exists |

---

### 5.4 Reviews & Ratings

| ID | Requirement |
|---|---|
| REV-01 | Logged-in user can write a review for any movie or series |
| REV-02 | Review includes a star rating from 0.5 to 5.0 (half-star steps) |
| REV-03 | Review text is optional — rating alone is valid |
| REV-04 | User can edit or delete their own review |
| REV-05 | Each user can only have one review per title |

---

### 5.5 Watchlist

| ID | Requirement |
|---|---|
| WTCH-01 | Logged-in user can add a movie/series to their watchlist |
| WTCH-02 | Logged-in user can remove from watchlist |
| WTCH-03 | Watchlist page shows all saved titles with poster and type badge (Movie/TV) |
| WTCH-04 | Adding a title already in the watchlist is idempotent (no duplicates) |

---

### 5.6 User Profile

| ID | Requirement |
|---|---|
| PROF-01 | Profile page shows username, join date, total reviews, and average rating given |
| PROF-02 | Profile page shows all reviews the user has written |
| PROF-03 | Profile page shows the user's watchlist |
| PROF-04 | User can view their own profile and any other user's public profile |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | TMDB API key is never exposed to the frontend — all TMDB calls go through the backend |
| **Security** | Passwords are never returned in any API response |
| **Performance** | TMDB responses are cached on the backend for 10 minutes to avoid rate limits |
| **Usability** | App is fully responsive (mobile-first with Tailwind breakpoints) |
| **Code Quality** | TypeScript strict mode enabled on both frontend and backend |
| **Environment** | All secrets in `.env` files, never committed to Git |
| **Accessibility** | Animations must respect prefers-reduced-motion |

---

## 7. Technical Architecture

(unchanged)

---

## 8. API Endpoints (Backend)

(unchanged)

---

## 9. Pages (Frontend)

| Page | Route | Auth Required |
|---|---|---|
| Home (Entrance) | `/` | ❌ |
| Browse Corridors | `/browse` | ❌ |
| Search Results | `/search?q=` | ❌ |
| Movie Detail | `/movie/:tmdbId` | ❌ |
| Series Detail | `/series/:tmdbId` | ❌ |
| Watchlist | `/watchlist` | ✅ |
| Profile | `/profile/:username` | ❌ |
| Login | `/login` | ❌ |
| Register | `/register` | ❌ |

---

## 10. Development Phases (updated)

| Phase | Scope | Deliverable |
|---|---|---|
| **1 — Setup** | Repo, folder structure, Prisma init, Express boilerplate | Running dev server |
| **2 — Auth** | Register, login, logout, JWT middleware | Postman-testable auth API |
| **3 — TMDB Proxy** | Trending, search, detail endpoints | Backend serves TMDB data |
| **4 — Design System** | Tailwind tokens, shadcn setup, core layout, accessibility baseline | Reusable UI primitives |
| **5 — Homepage Entrance** | `/` entrance page + door CTA + ambience toggles | Homepage experience |
| **6 — Browse Corridors** | `/browse` with corridor sections + snap + shelf carousel | Locadora browsing |
| **7 — Detail Pages** | Movie + series detail with cast | Clickable cards |
| **8 — Reviews** | Create/edit/delete reviews + star rating | Full review flow |
| **9 — Watchlist** | Add/remove + watchlist page | Persistent list |
| **10 — Profile** | Profile page with stats, reviews, watchlist | Public profiles |
| **11 — Polish** | Responsive, skeletons, errors, perf | Portfolio-ready |

---

## 11. Repository Structure

(unchanged)
