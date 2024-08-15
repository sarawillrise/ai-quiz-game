<template>
  <v-container class="game-over-container">
    <div class="game-over-content">
      <p class="game-over-text">GAME OVER</p>
      <p class="score-text">Your Score: {{ score }}</p>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameOver',
  data() {
  },
  computed: {
    score() { 
      return (this as any).$store.state.score;
    }
  },
});
</script>

<style scoped>
.game-over-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a;
}

.game-over-content {
  text-align: center;
  color: white;
}

.game-over-text {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px #ff0000;
}

.score-text {
  font-size: 1.5em;
  margin-top: 10px;
}
</style>
