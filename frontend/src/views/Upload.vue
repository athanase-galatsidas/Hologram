<script lang="ts">
import router from '@/bootstrap/router';
import { defineComponent, ref } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import { UploadIcon, DocumentTextIcon } from '@heroicons/vue/outline';

import useFetch from '@/composable/useFetch';

import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default defineComponent({
	name: 'Upload',
	components: {
		UploadIcon,
		DocumentTextIcon,
		AppHeader,
	},
	setup() {
		const file = ref<File>();
		const fileName = ref<String>();
		const uploadStep = ref(0);
		const invalidFile = ref(false);
		const invalidInput = ref(false);

		const { postForm, URL } = useFetch();

		console.log('the url is: ' + URL);

		const upload = async () => {
			if (!file.value || !fileName.value) {
				invalidInput.value = true;
				return;
			}

			// create formdata with file
			const formData = new FormData();
			formData.append('file_name', fileName.value as string);
			formData.append('uploaded_file', file.value);

			// upload it
			await postForm(URL + '/v1/upload', formData)
				.then((res) => {
					if (!res.ok) throw new Error('Invalid request');
					return res.json();
				})
				.then((data) => {
					if (data.error) {
						invalidInput.value = true;
						return;
					}

					router.push({ name: 'share', params: { id: data._id } });
				});
		};

		const dragAndDropFiles = (e: DragEvent) => {
			const files = e.dataTransfer?.files;

			if (!files) {
				invalidFile.value = true;
				return;
			}

			// read the file and create data url
			const localFile = files.item(0) as File;

			// error checking
			if (
				!localFile.name.endsWith('.glb') &&
				!localFile.name.endsWith('.gltf')
			) {
				invalidFile.value = true;
				console.log('INVALID FILE');
				return;
			}

			file.value = localFile;
			fileName.value = localFile.name;

			// read the file and create data url
			const reader = new FileReader();
			reader.onload = (e) => {
				console.log(e.target?.result);
				addPreview(e.target?.result);
			};

			reader.readAsDataURL(localFile);

			uploadStep.value = 1;
		};

		const addPreview = (model: any) => {
			const container = document.querySelector('#preview') as Element;

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(
				60,
				container.clientWidth / container.clientHeight,
				0.1,
				100,
			);
			scene.add(camera);
			camera.position.z = 2;

			const light = new THREE.AmbientLight(0xffffff);
			scene.add(light);

			const loader = new GLTFLoader();
			loader.load(model, (gltf: GLTF) => {
				scene.add(gltf.scene);
			});

			const renderer = new THREE.WebGLRenderer();
			renderer.setClearColor(new THREE.Color('white'), 1);
			renderer.setSize(container.clientWidth, container.clientHeight);

			container.appendChild(renderer.domElement);

			const draw = () => {
				renderer.render(scene, camera);
				requestAnimationFrame(draw);
			};

			draw();
		};

		return {
			upload,
			dragAndDropFiles,
			file,
			fileName,
			uploadStep,
			invalidFile,
			invalidInput,
		};
	},
});
</script>

<template>
	<div>
		<AppHeader title="Upload a file" />

		<div
			v-show="uploadStep == 0"
			class="max-w-3xl mx-auto my-8 p-8 flex flex-col items-center bg-white rounded-md shadow-md"
		>
			<h3 class="text-2xl mb-8">Pick a file</h3>

			<div
				@dragover.prevent
				@drop.prevent="dragAndDropFiles($event)"
				:class="{
					'border-red-400 text-red-400 bg-red-100 hover:bg-red-50':
						invalidFile,
				}"
				class="relative text-gray-400 border-gray-400 hover:bg-gray-50 border-4 border-dashed rounded-xl w-64 h-64"
			>
				<UploadIcon
					class="absolute left-0 bottom-2 w-full h-full p-12"
				/>
				<div
					class="absolute bottom-4 left-0 text-center text-lg font-medium w-full"
				>
					<span v-if="!invalidFile"> Drag .glb files to upload </span>
					<span v-else>Must be valid <b>.glb</b> file! </span>
				</div>
			</div>
		</div>

		<div
			v-show="uploadStep == 1"
			class="flex justify-between max-w-3xl mx-auto my-8 p-8 bg-white rounded-md shadow-md"
		>
			<div id="preview" class="w-48 h-48 bg-gray-400"></div>

			<form class="w-1/2 flex flex-col justify-between" @submit.prevent>
				<div>
					<h3 class="text-2xl mb-2">Overview</h3>
					<div class="flex flex-col">
						<label
							class="text-gray-600 mb-1 flex items-center"
							:class="{ 'text-red-400 ': invalidInput }"
							for="inpFileName"
						>
							filename</label
						>
						<input
							class="block w-64 bg-gray-100 shadow-sm px-2 py-1 rounded-md"
							:class="{
								'text-red-400 bg-red-100 ': invalidInput,
							}"
							id="inpFileName"
							v-model="fileName"
							type="text"
						/>
					</div>
				</div>

				<button @click="upload()" class="btn-primary">Upload</button>
			</form>
		</div>
	</div>
</template>
