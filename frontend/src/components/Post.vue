<script lang="ts">
import { Post } from '@/interfaces/Post';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'Post',
	props: {
		post: {
			type: Object as PropType<Post>,
		},
	},
	setup() {},
});
</script>

<template>
	<div class="w-60 h-64 mx-2 mb-4 flex-grow-0 bg-white shadow-md rounded-md">
		{{ post?.title }}
	</div>
</template>
