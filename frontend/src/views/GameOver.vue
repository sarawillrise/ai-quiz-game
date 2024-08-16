<template>
  <v-container class="game-over-container">
    <v-card class="game-over-card">
      <v-card-title class="game-over-text">GAME OVER</v-card-title>
      <v-card-subtitle class="score-text">Your Score: {{ score }}</v-card-subtitle>
      <v-card-actions class="game-over-actions">
        <v-btn color="primary" dark class="start-over-btn" @click="startOver">Start Over</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameOver',
  computed: {
    score() { 
      return (this as any).$store.state.score;
    }
  },
  methods: {
    startOver() {
      (this as any).$router.push("/");
    }
  }
});
</script>

<style scoped>
.game-over-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: darkblue;
}

.game-over-card {
  max-width: 400px;
  text-align: center;
  border-radius: 16px;
  padding: 20px;
  background: linear-gradient(145deg, #2e2e2e, #1a1a1a);
}

.game-over-text {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #f0f0f0;
}

.score-text {
  font-size: 1.5em;
  margin-top: 10px;
  color: #f0f0f0;
}

.game-over-actions {
  margin-top: 30px;
}

.start-over-btn {
  width: 100%;
  font-size: 1.2em;
  padding: 10px 0;
}
</style>
