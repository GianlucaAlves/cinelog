import type { Request, Response } from "express";
import { getShelvesFromTMDB } from "../services/tmdbService";

export async function getShelves(req: Request, res: Response) {
  try {
    const shelves = await getShelvesFromTMDB();
    res.status(200).json(shelves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shelves" });
  }
}
