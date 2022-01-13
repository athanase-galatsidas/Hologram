<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Home',
	setup() {},
});
</script>

<template>
	<div class="text-center text-2xl">
		<h1>Hello</h1>
		<p class="my-4">TODO: temporary links while app is in development</p>
		<router-link class="block my-4" to="/upload"> Ar marker for desktop </router-link>
		<router-link class="block my-4" to="/ar-marker"> Ar marker for desktop </router-link>
		<router-link class="block my-4" to="/ar-view"> Ar view for mobile </router-link>
	</div>
</template>
