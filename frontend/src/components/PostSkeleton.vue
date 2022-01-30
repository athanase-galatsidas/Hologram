<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PostSkeleton',
	setup() {},
});
</script>

<template>
	<div
		class="w-full h-16 m-2 flex-grow-0 bg-gray-50 shadow-md rounded-md pulse"
	></div>
</template>

<style lang="postcss" scoped>
.pulse {
	animation-name: pulse;
	animation-duration: 500ms;
	animation-timing-function: ease-in-out;
	animation-direction: alternate;
	animation-iteration-count: infinite;
}

@keyframes pulse {
	from {
		@apply opacity-100;
	}
	to {
		@apply opacity-50;
	}
}
</style>
