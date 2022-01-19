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
		name: 'upload',
		path: '/upload',
		component: () => import('@/views/Upload.vue'),
	},
	{
		name: 'share',
		path: '/share/:id',
		component: () => import('@/views/Share.vue'),
		beforeEnter(to, from, next) {
			if (!to.params.id) next('not-found');
			else next();
		},
	},
	{
		name: 'ar-view',
		path: '/ar-view/:id',
		component: () => import('@/views/ArView.vue'),
		beforeEnter(to, from, next) {
			if (!to.params.id) next('not-found');
			else next();
		},
	},
	{
		name: 'not-found',
		path: '/:pathMatch(.*)*',
		component: () => import('@/views/404.vue'),
	},
];

const router: Router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

router.beforeEach(
	(
		to: RouteLocationNormalized,
		from: RouteLocationNormalized,
		next: NavigationGuardNext,
	) => {
		// TODO: stuff

		// always call next
		next();
	},
);

export default router;
