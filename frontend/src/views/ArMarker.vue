<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'ArMarker',
	setup() {
		// TODO: if mobile redirect to ar-view

		const visible = ref(false);

		const toggleView = (show: boolean) => {
			visible.value = show;
		};

		return {
			visible,
			toggleView,
		};
	},
});
</script>

<template>
	<div v-show="!visible" class="max-w-3xl mx-auto my-8 flex flex-col items-center">
		<h3 class="text-2xl">Scan this code with an AR-capable mobile device.</h3>

		<p class="bg-white w-64 h-64 shadow-md my-8">TODO: generate qr code here</p>

		<button @click="toggleView(true)" class="btn-primary">Next</button>
	</div>

	<div v-show="visible" class="max-w-3xl mx-auto my-8 flex flex-col items-center">
		<h3 class="text-2xl">Scan this marker to view the model</h3>

		<button @click="toggleView(false)" class="btn-primary my-8">Back</button>

		<img class="w-128 h-128 shadow-md" src="@/assets/hiro.png" alt="could not load image" />
	</div>
</template>
