<script lang="ts">
import { defineComponent } from 'vue';
import { CubeIcon } from '@heroicons/vue/outline';

export default defineComponent({
	name: 'AppHeader',
	components: {
		CubeIcon,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
	},
	setup() {},
});
</script>

<template>
	<header
		class="flex items-center bg-primary text-white font-semibold text-2xl px-8 h-16 w-full shadow-md"
	>
		<router-link to="/" class="h-12 w-12 mr-2">
			<CubeIcon class="w-full h-full" />
		</router-link>
		<h1 class="w-1/4">{{ title }}</h1>
		<nav class="w-full h-full flex justify-end items-center">
			<slot></slot>
		</nav>
	</header>
</template>
