<script lang="ts">
import { defineComponent, ref } from 'vue';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
	ArToolkitProfile,
	ArToolkitSource,
	ArToolkitContext,
	ArMarkerControls,
	// @ts-ignore
} from '@ar-js-org/ar.js/three.js/build/ar-threex';

import router from '@/bootstrap/router';
import useSocket from '@/composable/useSocket';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'ArView',
	setup() {
		const { socket } = useSocket();
		const route = useRoute();

		socket.on(`comment:${route.params.id}`, (payload: any) => {
			console.log(`received: ${payload}`);
		});

		socket.emit('comment', { id: route.params.id });
	},
	mounted() {
		// modified boilerplate code from official examples
		// https://github.com/AR-js-org/AR.js/blob/190c3e635f467792e43427d02b17f2a43f1e44a1/three.js/examples/default.html

		ArToolkitContext.baseURL = '../';

		// init renderer
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});

		renderer.setClearColor(new THREE.Color('lightgrey'), 0);
		// renderer.setPixelRatio( 2 );
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = '0px';
		renderer.domElement.style.left = '0px';
		// renderer.domElement.classList.add('ar-content');
		document.body.appendChild(renderer.domElement); // We should be able to specify an html element to append AR.js related elements to.
		// document.querySelector('#ARScene')?.appendChild(renderer.domElement);

		// array of functions for the rendering loop
		const onRenderFcts: any = [];

		// init scene and camera
		const scene = new THREE.Scene();

		//////////////////////////////////////////////////////////////////////////////////
		//		Initialize a basic camera
		//////////////////////////////////////////////////////////////////////////////////

		// Create a camera
		const camera = new THREE.Camera();
		scene.add(camera);
		const artoolkitProfile = new ArToolkitProfile();
		artoolkitProfile.sourceWebcam(); // Is there good reason for having a function to set the sourceWebcam but not the displayWidth/Height etc?

		// add existing parameters, this is not well documented
		const additionalParameters = {
			// Device id of the camera to use (optional)
			deviceId: null,
			// resolution of at which we initialize in the source image
			sourceWidth: 640,
			sourceHeight: 480,
			// resolution displayed for the source
			displayWidth: 640,
			displayHeight: 480,
			// sourceHeight: window.innerWidth,
			// sourceWidth: window.innerHeight,
			// displayWidth: window.innerWidth,
			// displayHeight: window.innerHeight,
		};

		Object.assign(artoolkitProfile.sourceParameters, additionalParameters);
		console.log(artoolkitProfile.sourceParameters); // now includes the additionalParameters

		const arToolkitSource = new ArToolkitSource(
			artoolkitProfile.sourceParameters,
		);

		arToolkitSource.init(function onReady() {
			onResize();
		});

		// handle resize
		window.addEventListener('resize', function () {
			onResize();
		});

		// resize is not called for the canvas on init. The canvas with the cube seems to be resized correctly at start.
		// Is that maybe a vue-specific problem?
		function onResize() {
			arToolkitSource.onResizeElement();
			arToolkitSource.copyElementSizeTo(renderer.domElement);
			if (arToolkitContext.arController !== null) {
				arToolkitSource.copyElementSizeTo(
					arToolkitContext.arController.canvas,
				);
			}
		}

		////////////////////////////////////////////////////////////////////////////////
		//          initialize arToolkitContext
		////////////////////////////////////////////////////////////////////////////////

		// create atToolkitContext
		const arToolkitContext = new ArToolkitContext({
			debug: true,
			cameraParametersUrl:
				ArToolkitContext.baseURL + 'data/camera_para.dat',
			detectionMode: 'mono',
			canvasWidth: 640,
			canvasHeight: 490,
			// canvasWidth: window.innerWidth,
			// canvasHeight: window.innerHeight,
			imageSmoothingEnabled: true, // There is still a warning about mozImageSmoothingEnabled when using Firefox
		});

		// initialize it
		arToolkitContext.init(function onCompleted() {
			// copy projection matrix to camera
			camera.projectionMatrix.copy(
				arToolkitContext.getProjectionMatrix(),
			);
		});

		// update artoolkit on every frame
		onRenderFcts.push(function () {
			if (arToolkitSource.ready === false) return;

			arToolkitContext.update(arToolkitSource.domElement);
		});

		////////////////////////////////////////////////////////////////////////////////
		//          Create a ArMarkerControls
		////////////////////////////////////////////////////////////////////////////////

		const markerGroup = new THREE.Group();
		scene.add(markerGroup);

		const markerControls = new ArMarkerControls(
			arToolkitContext,
			markerGroup,
			{
				type: 'pattern',
				patternUrl: ArToolkitContext.baseURL + 'data/patt.hiro',
				smooth: true,
				smoothCount: 5,
				smoothTolerance: 0.01,
				smoothThreshold: 2,
			},
		);

		//////////////////////////////////////////////////////////////////////////////////
		//		add an object in the scene
		//////////////////////////////////////////////////////////////////////////////////

		const markerScene = new THREE.Scene();
		markerGroup.add(markerScene);

		// debug mesh
		const axisHelper = new THREE.AxesHelper();
		markerScene.add(axisHelper);

		// TODO: models are UPSIDE DOWN
		// create mesh loader
		const loader = new GLTFLoader();
		loader.load(
			ArToolkitContext.baseURL + 'data/asset.glb',
			(gltf: GLTF) => {
				gltf.scene.scale.x = 0.5;
				gltf.scene.scale.y = 0.5;
				gltf.scene.scale.z = 0.5;
				markerScene.add(gltf.scene);
			},
		);

		// light the meshes
		const light = new THREE.AmbientLight(0xffffff);
		markerScene.add(light);

		// add a torus knot
		// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
		// const boxMaterial = new THREE.MeshNormalMaterial({
		// 	transparent: true,
		// 	opacity: 0.5,
		// 	side: THREE.DoubleSide,
		// });
		// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
		// boxMesh.position.y = boxGeometry.parameters.height / 2;
		// markerScene.add(boxMesh);

		// var knotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
		// var knotMaterial = new THREE.MeshNormalMaterial();
		// var knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
		// knotMesh.position.y = 0.5;
		// markerScene.add(knotMesh);

		// onRenderFcts.push(function (delta: number) {
		// 	knotMesh.rotation.x += delta * Math.PI;
		// });

		//////////////////////////////////////////////////////////////////////////////////
		//		render the whole thing on the page
		//////////////////////////////////////////////////////////////////////////////////
		onRenderFcts.push(function () {
			renderer.render(scene, camera);
		});

		// run the rendering loop
		let lastTimeMsec: number | null = null;
		requestAnimationFrame(function animate(nowMsec) {
			// keep looping
			requestAnimationFrame(animate);
			// measure time
			lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
			let deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
			lastTimeMsec = nowMsec;
			// call each update function
			onRenderFcts.forEach(function (onRenderFct: any) {
				onRenderFct(deltaMsec / 1000, nowMsec / 1000);
			});
		});
	},
});
</script>

<template>
	<div class="relative">
		<!-- <div class="ar-view" id="ARScene"></div> -->
		<aside
			class="fixed z-10 bottom-0 left-0 w-full h-32 bg-white bg-opacity-50"
		>
			<span>ar controls</span>
		</aside>
	</div>
</template>

<style lang="postcss" scoped>
.ar-view {
	@apply w-full h-full absolute top-0 left-0;
}
</style>
