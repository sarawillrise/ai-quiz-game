<template>
  <v-container class="topic-container">
    <v-card class="topic-card">
      <v-card-title class="d-flex justify-center">Select a Topic</v-card-title>
      <v-card-text v-if="loading" class="loading-text">
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
        <p>Loading...</p>
      </v-card-text>
      <v-card-text v-else class="topics-list">
        <v-btn @click="generateTopics" color="primary" class="generate-btn">Generate Topics</v-btn>
        <v-list>
          <v-list-item
            v-for="topic in topics"
            :key="topic.name"
            @click="selectTopic(topic.name)"
            class="topic-item"
          >
            <v-list-item-title>{{ topic.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

interface ITopic {
  name: string;
}
interface IStartResponse {
  topics: ITopic[];
}

export default defineComponent({
  name: 'TopicView',
  data() {
    return {
      topics: Array() as ITopic[],
      selectedTopic: '',
      loading: false,
    };
  },
  methods: {
    async generateTopics() {
      this.loading = true;
      try {
        const response = await axios.post('/quiz/start');
        this.topics = (response.data as IStartResponse).topics;
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    selectTopic(topic: string) {
      console.log(topic);
      (this as any).$router.push({ path: '/QuizGame', query: { topic } });
    },
  },
});
</script>

<style scoped>
.topic-container {
  max-width: 500px;
  margin: auto;
  padding-top: 20px;
}

.topic-card {
  border-radius: 16px;
}

.loading-text {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.generate-btn {
  display: block;
  margin: 20px auto;
  font-weight: bold;
}

.topics-list {
  margin-top: 20px;
}

.topic-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.topic-item:hover {
  background-color: #f0f0f0;
}
</style>
