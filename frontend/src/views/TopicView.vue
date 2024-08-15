<template>
  <v-container>
    <v-card>
      <v-card-title>Select a Topic</v-card-title>
      <v-card-text v-if="loading">
        <p>Loading...</p>
      </v-card-text>
      <v-card-text v-else>
        <v-btn @click="generateTopics" color="primary">Generate Topics</v-btn>
        <v-list>
          <v-list-item
            v-for="topic in topics"
            :key="topic.name"
            @click="selectTopic(topic.name)"
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
  "name": string
}
interface IStartResponse {
  "topics": ITopic[]
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
        console.log(error)
      }
      this.loading = false;
    },
    selectTopic(topic: string) {
      console.log(topic);
      (this as any).$router.push({path: '/QuizGame', query: {topic: topic}});
    },
  },
});
</script>
