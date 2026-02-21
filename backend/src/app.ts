import express from 'express';
import router from './routes/auth';
import cookieParser from 'cookie-parser';
import tmdbRouter from './routes/tmdb';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use('/', tmdbRouter);

app.get('/', (req, res) => {
  res.json({ok: true});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})