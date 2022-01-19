<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AppHeader',
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
		<h1 class="w-1/4">{{ title }}</h1>
		<div class="w-full h-full flex justify-end items-center">
			<slot></slot>
		</div>
	</header>
</template>
