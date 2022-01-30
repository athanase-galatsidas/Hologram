<script lang="ts">
import { defineComponent, ref } from 'vue';

import router from '@/bootstrap/router';
import useSocket from '@/composable/useSocket';
import { useRoute } from 'vue-router';
import useFetch from '@/composable/useFetch';
import {
	initAr,
	loadModel,
	loadModelLocal,
	loadText,
	rotate,
	toggleAxis,
	position,
} from '@/modules/ArHelper';
import {
	AnnotationIcon,
	LogoutIcon,
	RefreshIcon,
} from '@heroicons/vue/outline';

export default defineComponent({
	name: 'ArView',
	components: {
		AnnotationIcon,
		LogoutIcon,
		RefreshIcon,
	},
	setup() {
		const isLoaded = ref(false);
		const trayVissible = ref(false);
		const overlay = ref(false);
		const axislbl = ref('Y');

		const { socket } = useSocket();
		const route = useRoute();

		socket.on(`comment:${route.params.id}`, (payload: any) => {
			console.log(`received: ${payload}`);

			loadText(payload.message, payload.x, payload.y, payload.z);
		});

		const closeOverlay = () => {
			overlay.value = false;
		};

		const annotate = () => {
			const text = (
				document.querySelector('#annotation') as HTMLInputElement
			).value;

			trayVissible.value = false;
			const pos = position();
			loadText(text, pos.x, pos.y, pos.z);

			socket.emit('annotation', {
				id: route.params.id,
				message: text,
				x: 0.0,
				y: 0.0,
				z: 0.0,
			});
		};

		const toggleTray = (value: boolean) => {
			trayVissible.value = value;
		};

		const turn = () => {
			rotate();
		};

		const changeAxis = () => {
			const axis = toggleAxis();

			if (axis == 0) axislbl.value = 'Y';
			if (axis == 1) axislbl.value = 'Z';
			if (axis == 2) axislbl.value = 'X';
		};

		return {
			isLoaded,
			trayVissible,
			annotate,
			turn,
			changeAxis,
			toggleTray,
			overlay,
			closeOverlay,
			axislbl,
		};
	},
	async mounted() {
		const { get, URL } = useFetch();
		const { params } = useRoute();

		// initialize the ar scene
		initAr();

		// loadModelLocal('cube', () => {
		// 	this.isLoaded = true;
		// 	this.overlay = true;
		// });

		await get(`${URL}/v1/posts/${params.id}`)
			.then((res) => {
				if (res.ok) return res.json();
				else router.push('not-found'); // if the model does not exist: go to 404 page
			})
			.then((data) => {
				// load model
				loadModel(`${URL}/public/${data.file}`, () => {
					this.isLoaded = true;
					this.overlay = true;
				});

				// load annotations
				data.annotations.forEach((element: any) => {
					loadText(element.message, element.x, element.y, element.z);
				});
			});
	},
});
</script>

<template>
	<div class="relative">
		<!-- <div class="ar-view" id="ARScene"></div> -->
		<div
			class="flex justify-around items-center fixed z-10 top-0 left-0 w-screen h-16 bg-gray-100 bg-opacity-80 text-neutral-800"
			v-show="!trayVissible"
		>
			<button
				class="bg-primary active:opacity-50 hover:opacity-25 text-white w-12 h-12 p-3 rounded-md shadow-sm"
				@click="toggleTray(true)"
			>
				<AnnotationIcon />
			</button>

			<button
				class="bg-primary active:opacity-50 hover:opacity-25 text-white w-12 h-12 p-3 rounded-md shadow-sm"
				@click="turn()"
			>
				<RefreshIcon />
			</button>

			<button
				class="bg-primary active:opacity-50 hover:opacity-25 text-white w-12 h-12 p-2 rounded-md shadow-sm"
				@click="changeAxis()"
			>
				<span class="text-xl font-medium">{{ axislbl }}</span>
			</button>

			<router-link
				to="/"
				class="bg-secondary active:opacity-50 hover:opacity-25 text-white w-12 h-12 p-3 rounded-md shadow-sm"
			>
				<LogoutIcon />
			</router-link>
		</div>

		<div
			class="flex justify-between items-center fixed z-10 top-0 left-0 w-screen h-16 bg-gray-100 bg-opacity-80 text-neutral-800"
			v-show="trayVissible"
		>
			<input
				type="text"
				class="w-full h-12 mx-2 px-2 rounded-md shadow-sm"
				placeholder="annotation"
				id="annotation"
			/>
			<button
				class="bg-primary active:opacity-50 mr-2 hover:opacity-25 text-white w-12 h-12 p-3 rounded-md shadow-sm"
				@click="annotate()"
			>
				<AnnotationIcon />
			</button>
		</div>

		<!-- loading screen -->
		<div
			v-show="!isLoaded"
			class="flex justify-center items-center fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-50"
		>
			<span>loading assets, please wait</span>
		</div>

		<div
			v-show="overlay"
			class="flex flex-col justify-center items-center fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-50"
		>
			<span class="text-xl">Look for this marker</span>
			<img class="w-32 h-32 my-4" src="@/assets/hiro.png" />
			<button @click="closeOverlay()" class="btn-primary">Got it</button>
		</div>
	</div>
</template>
