<script lang="ts">
import { defineComponent, ref } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import useFetch from '@/composable/useFetch';
import { useRoute } from 'vue-router';
import { toCanvas } from 'qrcode';
import { ClipboardIcon, ClipboardCheckIcon } from '@heroicons/vue/outline';

export default defineComponent({
	name: 'Share',
	components: {
		AppHeader,
		ClipboardIcon,
		ClipboardCheckIcon,
	},
	setup() {
		const { params } = useRoute();
		const link = `${window.location.origin}/ar-view/${params.id}`;

		const visible = ref(false);
		const copied = ref(false);

		const toggleView = (show: boolean) => {
			visible.value = show;
		};

		const copyLink = () => {
			navigator.clipboard.writeText(link);
			copied.value = true;
		};

		return {
			link,
			visible,
			toggleView,
			copied,
			copyLink,
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

		<div
			class="absolute w-screen transition-transform duration-500"
			:class="{ 'move-right': visible }"
		>
			<section
				class="max-w-3xl mx-auto my-8 p-8 flex flex-col items-center bg-white rounded-md shadow-md"
			>
				<h3 class="text-2xl mb-8">
					Scan this code with an AR-capable mobile device.
				</h3>

				<div class="w-64 h-64 overflow-hidden">
					<canvas id="qr"></canvas>
				</div>

				<div class="w-64 my-4 flex justify-between">
					<input
						class="bg-gray-100 shadow-sm w-52 p-2 mr-2 rounded-md"
						id="linkInput"
						type="text"
						:value="link"
						readonly
					/>
					<button
						class="bg-primary text-white p-2 flex w-10 h-10 rounded-md shadow-sm"
						title="copy to clipboard"
						@click="copyLink"
					>
						<ClipboardCheckIcon v-show="copied" />
						<ClipboardIcon v-show="!copied" />
					</button>
				</div>

				<button @click="toggleView(true)" class="btn-primary mt-8">
					Next
				</button>
			</section>
		</div>

		<div
			class="absolute w-screen transition-transform duration-500"
			:class="{ 'move-left': !visible }"
		>
			<section
				class="max-w-3xl mx-auto my-8 p-8 flex flex-col items-center bg-white rounded-md shadow-md"
			>
				<h3 class="text-2xl">Scan this marker to view the model</h3>

				<img
					class="w-128 h-128 my-8"
					src="@/assets/hiro.png"
					alt="could not load image"
				/>

				<button @click="toggleView(false)" class="btn-primary">
					Back
				</button>
			</section>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
#qr {
	@apply w-full h-full !important;
}

.move-right {
	transform: translateX(-100vw);
}

.move-left {
	transform: translateX(100vw);
}
</style>
