import axios from 'axios';
import { Topic, Question } from '../models/gameSession';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = process.env.OPENAI_API_KEY;

export async function generateQuizTopics(): Promise<{ name: string; }[]> {
  try {
    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: 'gpt-4o-2024-08-06',
        messages: [{ role: 'user', content: `Generate 4 unique quiz topics and give response exactly in the form of strict JSON array without any markdown formatting. 
          Example response: [{
    name: "Space Exploration",
  },
  ...more topics
  ]` }],
      },
      {
        headers: {
          Authorization: `Bearer ${CHATGPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedTopics = response.data.choices[0].message.content;
    return parseTopics(generatedTopics);
  } catch (error) {
    console.log(error)
  }
  return [];
}

 export async function generateQuizQuestion(topicName: string, askedQuestions: string[]): Promise<Question> {
  if (!topicName) {
    throw new Error('No topic chosen. Please choose a topic first.');
  }

  try {
    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: 'gpt-4o-2024-08-06',
        messages: [{
          role: 'user',
          content: `
          Generate one question for the topic "${topicName}", and give the response exactly in the form of a strict JSON object without any markdown formatting.
          The question must be new and not previously asked. Here is the list of questions that were previously asked: 
            ${askedQuestions.join(', ')}
          Example response: 
              {
                "question": "Which planet is known as the Red Planet?",
                "answers": ["Mars", "Jupiter", "Venus", "Mercury"],
                "correctAnswer": "Mars"
              }
          `
        }],
      },
      {
        headers: {
          Authorization: `Bearer ${CHATGPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedQuestions = response.data.choices[0].message.content;
    return parseQuestion(generatedQuestions);
  } catch (error) {
    console.log(error)
  }
  return {question: "", answers: [], correctAnswer: ""};
}


function parseTopics(content: string): Topic[] {
  try {
    const topics = JSON.parse(content);
    return topics;  
  } catch (e) {
    console.log(content)
    return [];
  }
}

function parseQuestion(content: string): Question {
  try {
    const questions = JSON.parse(content);
    return questions;
  } catch (e) {
    console.log(content)
    return {question: "", answers: [], correctAnswer: ""};
  }
}