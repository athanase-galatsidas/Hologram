<script lang="ts">
import { Post } from '@/interfaces/Post';
import { defineComponent, PropType } from 'vue';
import { CubeIcon, AnnotationIcon } from '@heroicons/vue/outline';

export default defineComponent({
	name: 'Post',
	components: {
		CubeIcon,
		AnnotationIcon,
	},
	props: {
		post: {
			type: Object as PropType<Post>,
		},
	},
	setup() {},
});
</script>

<template>
	<div
		class="flex justify-between items-center w-full h-16 mx-2 mb-4 bg-white text-neutral-800 shadow-md rounded-md cursor-pointer"
	>
		<div class="flex w-full items-center">
			<figure class="h-16 w-16 px-3">
				<!-- TODO: thumbnails -->
				<CubeIcon class="h-full w-full" />
			</figure>

			<h4 class="text-xl font-medium text-center">
				{{ post?.title }}
			</h4>
		</div>

		<div class="w-56 flex justify-between">
			<span class="text-neutral-400">
				{{ post?.annotations.length }}
				<AnnotationIcon class="inline-block ml-1 w-4 h-4" />
			</span>

			<span class="text-center text-neutral-400 mx-4" v-if="post?.date">
				{{ new Date(post?.date).toLocaleDateString('en-GB') }}
			</span>
		</div>
	</div>
</template>
