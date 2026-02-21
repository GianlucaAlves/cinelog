text
# CineLog — Product Requirements Document

**Version:** 1.0  
**Author:** Gianluca  
**Date:** February 2026  
**Status:** Draft

---

## 1. Project Overview

CineLog is a full-stack web application inspired by Letterboxd that allows users to discover, track, review, and rate movies and TV series. The project is built solo as a learning milestone after the medical system project, covering authentication, REST API design, external API consumption, and a polished React frontend — all without relying on AI code agents.

---

## 2. Goals

- Build a complete full-stack project independently to demonstrate ownership of the entire codebase
- Practice JWT authentication with access + refresh token rotation
- Design and consume a self-owned REST API from a React frontend
- Integrate TMDB as an external data source through a backend proxy layer
- Produce a portfolio-ready project with real-world features

---

## 3. Out of Scope (v1.0)

These will **not** be built in the first version to keep scope manageable:

- Social features (following users, activity feed)
- Lists (custom curated lists like "My Top 10")
- Comments on reviews
- Notifications
- Admin panel
- Mobile app

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

### 5.2 Movie & Series Discovery

| ID | Requirement |
|---|---|
| DISC-01 | Home page shows trending movies and trending series (from TMDB) |
| DISC-02 | User can search movies and series by title via unified search |
| DISC-03 | Results are paginated (20 items per page) |
| DISC-04 | User can filter browse by genre |
| DISC-05 | Each card shows: poster, title, year, and average TMDB rating |

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

---

## 7. Technical Architecture

┌─────────────────────┐ ┌──────────────────────────┐
│ React Frontend │ ──────▶│ Express Backend API │
│ React + TS + │ fetch │ Node.js + Prisma + │
│ Tailwind + shadcn │ ◀───── │ PostgreSQL + JWT │
└─────────────────────┘ JSON └───────────┬──────────────┘
│ HTTP (proxy)
▼
┌──────────────────────┐
│ TMDB API v3 │
│ api.themoviedb.org │
└──────────────────────┘

text

---

## 8. API Endpoints (Backend)

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create new user |
| POST | `/api/auth/login` | ❌ | Login, returns tokens |
| POST | `/api/auth/logout` | ✅ | Invalidate refresh token |
| POST | `/api/auth/refresh` | ❌ | Get new access token |

### Movies & Series (TMDB Proxy)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/movies/trending` | ❌ | Trending movies |
| GET | `/api/series/trending` | ❌ | Trending series |
| GET | `/api/search?q=&page=` | ❌ | Unified search |
| GET | `/api/movies/:tmdbId` | ❌ | Movie detail |
| GET | `/api/series/:tmdbId` | ❌ | Series detail |

### Reviews

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/reviews/:mediaType/:tmdbId` | ❌ | Get reviews for a title |
| POST | `/api/reviews` | ✅ | Create review |
| PUT | `/api/reviews/:id` | ✅ | Edit own review |
| DELETE | `/api/reviews/:id` | ✅ | Delete own review |

### Watchlist

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/watchlist` | ✅ | Get user's watchlist |
| POST | `/api/watchlist` | ✅ | Add title to watchlist |
| DELETE | `/api/watchlist/:id` | ✅ | Remove from watchlist |

### Users

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/users/:username` | ❌ | Get public profile |

---

## 9. Pages (Frontend)

| Page | Route | Auth Required |
|---|---|---|
| Home | `/` | ❌ |
| Search Results | `/search?q=` | ❌ |
| Movie Detail | `/movie/:tmdbId` | ❌ |
| Series Detail | `/series/:tmdbId` | ❌ |
| Watchlist | `/watchlist` | ✅ |
| Profile | `/profile/:username` | ❌ |
| Login | `/login` | ❌ |
| Register | `/register` | ❌ |

---

## 10. Development Phases

| Phase | Scope | Deliverable |
|---|---|---|
| **1 — Setup** | Repo, folder structure, Prisma init, Express boilerplate | Running dev server |
| **2 — Auth** | Register, login, logout, JWT middleware | Postman-testable auth API |
| **3 — TMDB Proxy** | Trending, search, detail endpoints | Backend serves TMDB data |
| **4 — Browse UI** | Home page, search, movie/series cards | Browseable frontend |
| **5 — Detail Pages** | Movie + series detail with cast | Clickable cards |
| **6 — Reviews** | Create, edit, delete reviews + star rating | Full review flow |
| **7 — Watchlist** | Add/remove, watchlist page | Persistent list |
| **8 — Profile** | Profile page with stats, reviews, watchlist | Public profiles |
| **9 — Polish** | Responsive design, loading skeletons, error handling | Portfolio-ready |

---

## 11. Repository Structure

cinelog/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middlewares/
│ │ ├── services/ ← tmdbService.ts lives here
│ │ └── app.ts
│ ├── prisma/schema.prisma
│ ├── .env.example
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ ├── services/ ← api.ts (axios to your backend)
│ │ └── context/
│ ├── .env.example
│ └── package.json
├── .gitignore
└── README.md