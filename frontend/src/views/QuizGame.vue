<template>
  <v-container class="quiz-container">
    <v-card class="quiz-card">
      <v-card-title class="d-flex justify-space-between align-center">
        <div>Topic: <strong>{{ topic }}</strong></div>
        <div>Score: <strong>{{ score }}</strong></div>
      </v-card-title>
      <v-card-subtitle class="question-progress">
        Question {{ currentQuestion + 1 }} out of {{ totalQuestions }}
      </v-card-subtitle>
      <v-card-text v-if="loading" class="loading-text">
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
        <p>Loading...</p>
      </v-card-text>
      <v-card-text v-else-if="question" class="question-text">
        <p>{{ question.question }}</p>
        <p class="time-left">Time Left: <strong>{{ timeLeft }}</strong> seconds</p>
        <v-list class="answer-list">
          <v-list-item
            v-for="(answer, index) in question.answers"
            :key="index"
            @click="submitAnswer(answer)"
            :class="[getOptionClass(answer), { 'disabled-answer': isAnswered }]"
            :disabled="isAnswered"
            class="answer-item"
          >
            <v-list-item-title>{{ answer }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions v-if="!loading && selectedAnswer" class="actions">
        <v-btn color="primary" @click="nextQuestion">Next Question</v-btn>
      </v-card-actions>
      <v-card-actions v-if="question && !loading" class="actions">
        <v-btn color="error" @click="quitGame">Quit Game</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { mapActions } from "vuex";

export default defineComponent({
  name: "QuizQuestion",
  computed: {
    topic() {
      return (this as any).$route.query.topic;
    },
    score() {
      return (this as any).$store.state.score;
    }
  },
  data() {
    return {
      question: null as any,
      askedQuestions: [] as any[],
      selectedAnswer: "",
      correctAnswer: "",
      loading: false,
      isAnswered: false,
      timeLeft: 20,
      timer: null as any,
      currentQuestion: 0,
      totalQuestions: 20,
    };
  },
  watch: {
    topic() {
      this.fetchQuestion();
    },
  },
  mounted() {
    this.fetchQuestion();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions(["setScore"]),
    async fetchQuestion() {
      this.loading = true;
      this.timeLeft = 20;
      clearInterval(this.timer);
      const response = await axios.post(`/quiz/get-question`, {
        topicName: this.topic,
      });
      this.question = response.data;
      this.startTimer();
      this.askedQuestions.push(this.question.question);
      this.loading = false;
    },
    async nextQuestion() {
      this.selectedAnswer = "";
      this.correctAnswer = "";
      this.isAnswered = false;
      this.timeLeft = 20;
      clearInterval(this.timer);
      await this.fetchQuestion();
      if (this.currentQuestion < this.totalQuestions - 1) {
        this.currentQuestion++;
      }
    },
    async submitAnswer(answer: string) {
      this.isAnswered = true;
      clearInterval(this.timer);
      this.selectedAnswer = answer;
      try {
        const response = await axios.post("/quiz/answer", {
          answer: answer,
        });
        this.correctAnswer = response.data.correctAnswer;
        this.setScore(response.data.score);
      } catch (error: any) {
        if (error.response.status === 444) {
          (this as any).$router.push({
            path: "/GameOver",
            query: { score: this.score },
          });
        } else {
          console.log(error);
        }
      }
    },
    getOptionClass(option: string) {
      if (!this.selectedAnswer) return "";

      if (option === this.selectedAnswer && option === this.correctAnswer) {
        return "correct-answer";
      } else if (option === this.selectedAnswer) {
        return "wrong-answer";
      } else if (option === this.correctAnswer) {
        return "correct-answer";
      }
      return "";
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeOut();
        }
      }, 1000);
    },
    timeOut() {
      clearInterval(this.timer);
      this.submitAnswer("");
    },
    quitGame() {
      clearInterval(this.timer);
      this.$emit("game-quit");
      (this as any).$router.push({
        path: "/GameOver",
        query: { score: this.score },
      });
    },
  },
});
</script>

<style scoped>
.quiz-container {
  background-color: darkblue;
  max-width: 600px;
  margin: auto;
  padding-top: 20px;
}

.quiz-card {
  border-radius: 16px;
}

.question-progress {
  text-align: center;
  font-size: 16px;
  margin-top: 10px;
}

.loading-text {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.question-text {
  font-size: 20px;
  margin-bottom: 20px;
}

.time-left {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}

.answer-list {
  margin-top: 20px;
}

.answer-item {
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

.answer-item:hover {
  background-color: #f5f5f5;
}

.correct-answer {
  background-color: #e0ffe0;
  color: green;
}

.wrong-answer {
  background-color: #ffe0e0;
  color: red;
}

.disabled-answer {
  pointer-events: none;
  opacity: 0.6;
}

.actions {
  justify-content: space-between;
  margin-top: 20px;
}
</style>
