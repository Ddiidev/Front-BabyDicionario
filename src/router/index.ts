import {
	createRouter,
	createWebHashHistory,
	// createWebHistory,
} from 'vue-router';
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			component: () => import('@/views/Home.vue'),
		},
		{
			path: '/userHome',
			component: () => import('@/views/homePrincipal/HomeView.vue'),
		},
		{
			name: 'userProfileEdit',
			path: '/userProfileEdit/:short_uuid/:name_shared',
			component: () => import('@/views/profileEdit/profileEdit.vue'),
		},
		{
			path: '/profile/:id/:name',
			name: 'profile',
			component: () => import('@/views/profile/profileView.vue'),
		},
		{
			path: '/createUser',
			name: 'createUser',
			component: () => import('@/views/user/CreateUser.vue'),
		},
		{
			path: '/words/:shortUUID/:nameShared',
			name: 'Words',
			component: () => import('@/views/words/WordsView.vue'),
		}
	],
});

export default router;
