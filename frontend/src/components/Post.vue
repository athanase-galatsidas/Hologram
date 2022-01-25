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
		class="flex flex-col justify-end items-center w-60 h-64 mx-2 mb-4 flex-grow-0 bg-white shadow-md rounded-md p-4"
	>
		<figure class="h-44 w-full">
			<!-- TODO: thumbnails -->
			<CubeIcon class="h-full w-full" />
		</figure>

		<div class="flex flex-col justify-between h-16 w-full flex-shrink-0">
			<h4 class="text-xl font-medium text-center">
				{{ post?.title }}
			</h4>

			<div class="flex justify-between text-neutral-400">
				<span
					>{{ post?.annotations.length }}
					<AnnotationIcon class="inline-block ml-1 w-4 h-4" />
				</span>

				<span class="text-center" v-if="post?.date">
					{{ new Date(post?.date).toLocaleDateString('en-GB') }}
				</span>
			</div>
		</div>
	</div>
</template>
