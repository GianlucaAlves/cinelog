import type { Shelf } from "./types/shelf"

export async function getShelves(): Promise<Shelf[]> {
  const res = await fetch("/api/shelves")
  if (!res.ok) throw new Error("Failed to fetch shelves")
  return await res.json()
}