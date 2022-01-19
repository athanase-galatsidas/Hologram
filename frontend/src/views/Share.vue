<script lang="ts">
import { defineComponent, ref } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import useFetch from '@/composable/useFetch';
import { useRoute } from 'vue-router';
import { toCanvas } from 'qrcode';

export default defineComponent({
	name: 'Share',
	components: {
		AppHeader,
	},
	setup() {
		const { params } = useRoute();
		const link = `${window.location.origin}/ar-view/${params.id}`;

		const visible = ref(false);

		const toggleView = (show: boolean) => {
			visible.value = show;
		};

		return {
			link,
			visible,
			toggleView,
		};
	},
	mounted() {
		toCanvas(document.querySelector('#qr'), this.link, { width: 256 });
	},
});
</script>

<template>
	<div>
		<AppHeader title="Share your creation"></AppHeader>

		<section
			v-show="!visible"
			class="max-w-3xl mx-auto my-8 flex flex-col items-center"
		>
			<h3 class="text-2xl mb-8">
				Scan this code with an AR-capable mobile device.
			</h3>

			<div
				class="bg-white w-64 h-64 overflow-hidden rounded-md shadow-md"
			>
				<canvas id="qr"></canvas>
			</div>
			<span>{{ link }}</span>

			<button @click="toggleView(true)" class="btn-primary mt-8">
				Next
			</button>
		</section>

		<section
			v-show="visible"
			class="max-w-3xl mx-auto my-8 flex flex-col items-center"
		>
			<h3 class="text-2xl">Scan this marker to view the model</h3>

			<button @click="toggleView(false)" class="btn-primary my-8">
				Back
			</button>

			<img
				class="w-128 h-128 shadow-md"
				src="@/assets/hiro.png"
				alt="could not load image"
			/>
		</section>
	</div>
</template>

<style lang="postcss" scoped>
#qr {
	@apply w-full h-full !important;
}
</style>
