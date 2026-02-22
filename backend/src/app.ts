import express from "express";
import router from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors";
import shelfRouter from "./routes/shelfRoutes";
import movieRouter from "./routes/movieRoutes";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use("/api/shelves", shelfRouter);
app.use("/api/movies", movieRouter);

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
