<template>
  <v-container>
    <v-card>
      <v-card-title>Topic: {{ topic }}</v-card-title>
      <v-card-subtitle>Score: {{ score }}</v-card-subtitle>
      <v-card-text v-if="loading">
        <p>Loading...</p>
      </v-card-text>
      <v-card-text v-else-if="question">
        <p>{{ question.question }}</p>
        <p>Time Left: {{ timeLeft }} seconds</p>
        <v-list>
          <v-list-item
            v-for="(answer, index) in question.answers"
            :key="index"
            @click="submitAnswer(answer)"
            :class="getOptionClass(answer)"
            :disabled="isAnswered"
          >
            <v-list-item-title>{{ answer }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions v-if="!loading && selectedAnswer">
        <v-btn color="blue" @click="nextQuestion">Next Question</v-btn>
      </v-card-actions>
      <v-card-actions v-if="question && !loading">
        <v-btn color="error" @click="quitGame">Quit Game</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
//import GameOver from './GameOver.vue';
// import { mapState, mapActions } from 'vuex';
import { mapActions } from 'vuex';

export default defineComponent({
  name: "QuizQuestion",
  components: {
    // GameOver
  },
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
    ...mapActions(['setScore']),
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
    
        this.loading = false
    },

    async nextQuestion() {
      this.selectedAnswer = "";
      this.correctAnswer = "";
      this.isAnswered = false;
      this.timeLeft = 20;
      clearInterval(this.timer);
      await this.fetchQuestion();
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
        // this.score = response.data.score;
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
        return "green--text";
      } else if (option === this.selectedAnswer) {
        return "red--text";
      } else if (option === this.correctAnswer) {
        return "green--text";
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
      // (this as any).$router.push({path: '/GameOver', query: {score: this.score }});
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
.green--text {
  color: green;
}
.red--text {
  color: red;
}
</style>