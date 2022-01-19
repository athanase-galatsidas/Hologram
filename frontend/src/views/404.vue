<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	setup() {},
});
</script>

<template>
	<div>
		<div class="bg-white mx-auto mt-16 w-64 h-32 shadow-md rounded-md">
			<h1>404</h1>
			<h3>not found</h3>

			<router-link to="/" class="btn-primary">Go Back</router-link>
		</div>
	</div>
</template>
