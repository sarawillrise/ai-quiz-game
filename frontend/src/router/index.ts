import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import QuizGame from '@/views/QuizGame.vue';
import GameOver from '@/views/GameOver.vue';
import TopicView from '@/views/TopicView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'TopicView',
    children: [
      {
        path: '/TopicView',
        name: 'TopicView',
        component: TopicView
      },
      {
        path: '/QuizGame',
        name: 'QuizGame',
        component: QuizGame
      },
      {
        path: '/GameOver',
        name: 'GameOver',
        component: GameOver
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
