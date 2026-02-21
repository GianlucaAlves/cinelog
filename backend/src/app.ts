import express from 'express';
import router from './routes/auth';

const app = express();
const port = 3000;

app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.json({ok: true});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})