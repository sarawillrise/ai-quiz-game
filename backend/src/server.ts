import express from 'express';
import cookieParser from 'cookie-parser';
import quizRouter from './routes/quiz';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/quiz', quizRouter);

app.listen(port, () => {
  console.log(`Quiz game backend running at http://localhost:${port}`);
});
