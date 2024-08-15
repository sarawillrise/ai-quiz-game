<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
  },
  data() {
    return {
      // selectedTopic: '' as string,
      // loading: false,
    };
  },
  methods: {
    // startGame(topic: string) {
    //   this.selectedTopic = topic;
    //   this.loading = true; 
    
    // },
    // resetGame() {
    //   this.selectedTopic = '';
    // },
  },
});
</script>

<!-- <TopicSelection v-if="!selectedTopic" @topic-selected="startGame" />
<QuizGame
  v-else
  :topic="selectedTopic"
  @game-quit="resetGame"
/> -->
