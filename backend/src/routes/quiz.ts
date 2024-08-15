import express from 'express';
import { generateQuizTopics, generateQuizQuestion } from '../services/chatgptService';
import { GameSession, Question} from '../models/gameSession';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const sessions: { [key: string]: GameSession} = {};

router.post('/start', async (req, res) => {
  let userId = req.cookies.userId;
  if (!userId) {
    userId = uuidv4();
    res.cookie('userId', userId, { httpOnly: true });
  }

  const topics = await generateQuizTopics();
  const gameSession = new GameSession(userId, topics);

  sessions[userId] = gameSession;
  res.json({ topics });
});

router.post('/get-question',async (req, res) => {
  const { topicName } = req.body;
  const userId = req.cookies.userId;

  const session = sessions[userId];
  if (!session) {
    return res.status(400).json({ message: 'No active session found.' });
  }
  
  if (!session.validateTopic(topicName)) {
    return res.status(400).json({ message: 'Invalid topic name.' });
  }
  let askedQuestions = session.generatedQuestions.map(question => question.question)
  
  let newQuestion = await generateQuizQuestion(topicName, askedQuestions);
  session.saveGeneratedQuestion(newQuestion); // Save the newly generated question to the session
  session.question = newQuestion;
  session.startedTime = new Date().getTime() / 1000;

  res.json({ ...newQuestion, correctAnswer: undefined });
})

router.post('/answer', (req, res) => {

  const { answer } = req.body;
  const userId = req.cookies.userId;

  const session = sessions[userId];
  if (!session) {
    return res.status(400).json({ message: 'No active session found.' });
  }

  const now = new Date().getTime() / 1000
  if ((session.startedTime + 20) < now || session.generatedQuestions.length >= 20 || session.wrongAnswers.length >= 3 ) {
    const response = { gameOver: true, reason: 'Game over' };
    console.log(response);
    return res.status(444).json(response);
  }
  
  // if no - generate question and answer to user

  const answerReponse = session.answerQuestion(answer);
  res.json({ isCorrect: answerReponse.isCorrect, correctAnswer: answerReponse.correctAnswer, score: session.score });
});

export default router;
