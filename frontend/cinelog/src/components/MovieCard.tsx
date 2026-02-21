// src/components/MovieCard.tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Movie } from "../../../../backend/src/types/tmdbTypes";

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
        alt={movie.title}
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{movie.release_date?.split('-')[0]}</Badge>
        </CardAction>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>{movie.overview}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Movie</Button>
      </CardFooter>
    </Card>
  )
}
