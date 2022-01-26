<script lang="ts">
import { defineComponent, ref } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import Post from '@/components/Post.vue';
import PostSkeleton from '@/components/PostSkeleton.vue';
import { UploadIcon } from '@heroicons/vue/outline';

import useFetch from '@/composable/useFetch';
import { Post as IPost } from '@/interfaces/Post';
import router from '@/bootstrap/router';

export default defineComponent({
	name: 'Home',
	components: {
		AppHeader,
		Post,
		PostSkeleton,
		UploadIcon,
	},
	setup() {
		const posts = ref<IPost[]>();

		const openPost = (id: string) => {
			router.push({ name: 'share', params: { id: id } });
		};

		return {
			posts,
			openPost,
		};
	},
	async mounted() {
		const { get, URL } = useFetch();

		await get(URL + '/v1/posts')
			.then((res) => res.json())
			.then((data) => {
				this.posts = data;
			});
	},
});
</script>

<template>
	<div>
		<AppHeader title="Hologram">
			<router-link class="flex" to="/upload">
				<UploadIcon class="h-8 w-8 mr-2" /> Upload
			</router-link>
		</AppHeader>

		<div
			v-if="posts && posts?.length > 0"
			class="max-w-3xl mt-8 flex content-start flex-wrap mx-auto"
		>
			<Post
				v-for="(value, key) of posts"
				:key="key"
				:post="value"
				@click="openPost(value._id)"
			/>
		</div>
		<div v-else class="max-w-3xl mt-8 flex content-start flex-wrap mx-auto">
			<PostSkeleton v-for="i in 12" :key="i" />
		</div>
	</div>
</template>
