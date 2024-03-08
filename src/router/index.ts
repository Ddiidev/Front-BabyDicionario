import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/profile/:id/:name',
      component: () => import('@/views/profile/Profile.vue')
    },
    {
      path: '/createUser',
      component: () => import('@/views/user/CreateUser.vue')
    }
  ]
})

export default router
