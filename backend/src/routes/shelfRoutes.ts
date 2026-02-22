import { Router } from "express";
import { getShelves } from "../controllers/shelfController";

const router = Router();
router.get("/", getShelves);
export default router;
