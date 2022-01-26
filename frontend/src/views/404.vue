<script lang="ts">
import { defineComponent } from 'vue';
import { CubeTransparentIcon } from '@heroicons/vue/outline';

export default defineComponent({
	components: {
		CubeTransparentIcon,
	},
	setup() {},
});
</script>

<template>
	<div>
		<div
			class="flex flex-col justify-center items-center bg-white mx-auto p-4 mt-32 w-128 h-96 shadow-md rounded-md"
		>
			<div>
				<h1 class="font-semibold text-center text-4xl">404</h1>
				<h3 class="text-xl text-center">not found</h3>
			</div>

			<CubeTransparentIcon class="w-48 my-4 text-neutral-600" />

			<router-link to="/" class="btn-primary text-center"
				>Go Back</router-link
			>
		</div>
	</div>
</template>
