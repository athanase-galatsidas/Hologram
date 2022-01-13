<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'Upload',
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

		<button @click="toggleView(true)" class="btn-primary my-8">Next</button>

		<p class="bg-white w-128 h-128 shadow-md">TODO: generate qr code here</p>
	</div>

	<div v-show="visible" class="max-w-3xl mx-auto my-8 flex flex-col items-center">
		<h3 class="text-2xl">Scan this marker to view the model</h3>

		<button @click="toggleView(false)" class="btn-primary my-8">Back</button>

		<img class="w-128 h-128 shadow-md" src="@/assets/hiro.png" alt="could not load image" />
	</div>
</template>
