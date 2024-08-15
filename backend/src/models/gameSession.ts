export interface Topic {
  name: string;
}

export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

export class GameSession {
  userId: string;
  topics: Topic[];
  score: number;
  question?: Question;
  generatedQuestions: Question[] = [];
  wrongAnswers: string[] = [];
  startedTime: number = 0;

  constructor(userId: string, topics: Topic[]) {
    this.userId = userId;
    this.topics = topics;
    this.score = 0;
  
  }

  public answerQuestion(answer: string): {isCorrect: boolean, correctAnswer: string} {
    if (this.question) {
      if (this.question.correctAnswer === answer) {
        this.score += 10;
        return {isCorrect: true, correctAnswer: this.question.correctAnswer};
      } else {
        this.score -= 5; 
        this.wrongAnswers.push(answer);
        return {isCorrect: false, correctAnswer: this.question.correctAnswer};
      }
    }
    return {isCorrect: false, correctAnswer: ""};
  }
  public validateTopic(topic: string): boolean {
    return !!this.topics.find(t => t.name === topic);
  }

  public saveGeneratedQuestion(newQuestion: Question) {
    this.generatedQuestions.push(newQuestion);
  }
}
