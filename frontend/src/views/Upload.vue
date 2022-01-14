<script lang="ts">
import router from '@/bootstrap/router';
import { defineComponent, ref } from 'vue';
import { UploadIcon } from '@heroicons/vue/outline';

export default defineComponent({
	name: 'Upload',
	components: {
		UploadIcon,
	},
	setup() {
		const file = ref<File>();

		const upload = () => {
			if (!file.value) return;

			// TODO: post to server

			router.push('/ar-marker');
		};

		const dragAndDropFiles = (e: DragEvent) => {
			const files = e.dataTransfer?.files;

			if (files) file.value = files.item(0) as File;

			file.value?.name;
		};

		return {
			upload,
			dragAndDropFiles,
			file,
		};
	},
});
</script>

<template>
	<div class="max-w-3xl mx-auto my-8 flex flex-col items-center">
		<h1 class="text-2xl mb-8">Upload a file</h1>
		<div
			@dragover.prevent
			@drop.prevent="dragAndDropFiles($event)"
			class="relative text-gray-400 border-gray-400 hover:bg-gray-50 border-4 border-dashed rounded-xl w-64 h-64"
		>
			<UploadIcon class="absolute left-0 bottom-2 w-full h-full p-12" />
			<span
				v-if="file"
				class="absolute bottom-4 left-0 text-center text-lg font-medium w-full"
			>
				{{ file.name }}
			</span>
			<span
				v-else
				class="absolute bottom-4 left-0 text-center text-lg font-medium w-full"
			>
				Drag .glb files to upload
			</span>
		</div>
		<button @click="upload()" class="btn-primary my-8">Upload</button>
	</div>
</template>
