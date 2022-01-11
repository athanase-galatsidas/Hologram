import {
	createRouter,
	createWebHistory,
	NavigationGuardNext,
	RouteLocationNormalized,
	Router,
	RouteRecordRaw,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		name: 'home',
		path: '/',
		component: () => import('@/views/Home.vue'),
	},
	{
		name: 'preview',
		path: '/preview',
		component: () => import('@/views/Preview.vue'),
	},
	{
		name: 'ar-marker',
		path: '/ar-marker',
		component: () => import('@/views/ArMarker.vue'),
	},
	{
		name: 'ar-view',
		path: '/ar-view',
		component: () => import('@/views/ArView.vue'),
	},
];

const router: Router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	// TODO: stuff

	// always call next
	next();
});

export default router;
