import { createRouter, createWebHashHistory , createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/userHome',
      component: () => import('../views/homeLogged/Home.vue')
    },
    {
      name: "userProfileEdit",
      path: '/userProfileEdit/:short_uuid/:name_shared',
      component: () => import('../views/profileEdit/profileEdit.vue')
    },
    {
      path: '/profile/:id/:name',
      name: 'profile',
      component: () => import('@/views/profile/Profile.vue')
    },
    {
      path: '/createUser',
      name: 'createUser',
      component: () => import('@/views/user/CreateUser.vue')
    }
  ]
})

export default router
