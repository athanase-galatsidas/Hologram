import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import {
	ArToolkitProfile,
	ArToolkitSource,
	ArToolkitContext,
	ArMarkerControls,
	// @ts-ignore
} from '@ar-js-org/ar.js/three.js/build/ar-threex';

const markerScene = new THREE.Scene();
let axisToggle = false;
let cam: THREE.Camera;

const initAr = () => {
	// modified boilerplate code from official examples
	// https://github.com/AR-js-org/AR.js/tree/190c3e635f467792e43427d02b17f2a43f1e44a1/three.js/examples

	ArToolkitContext.baseURL = '/';

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
	cam = camera;
	scene.add(camera);
	const artoolkitProfile = new ArToolkitProfile();
	artoolkitProfile.sourceWebcam(); // Is there good reason for having a function to set the sourceWebcam but not the displayWidth/Height etc?

	// add existing parameters, this is not well documented
	const additionalParameters = {
		// Device id of the camera to use (optional)
		deviceId: null,
		// resolution of at which we initialize in the source image
		sourceWidth: 480,
		sourceHeight: 640,
		// resolution displayed for the source
		displayWidth: 480,
		displayHeight: 640,
	};

	Object.assign(artoolkitProfile.sourceParameters, additionalParameters);
	// console.log(artoolkitProfile.sourceParameters); // now includes the additionalParameters

	const arToolkitSource = new ArToolkitSource(
		artoolkitProfile.sourceParameters,
	);

	arToolkitSource.init(function onReady() {
		onResize();
	});

	// this breaks everything randomly?
	// // handle resize
	// window.addEventListener('resize', function () {
	// 	onResize();
	// });

	// resize is not called for the canvas on init. The canvas with the cube seems to be resized correctly at start.
	// Is that maybe a vue-specific problem?
	const onResize = () => {
		arToolkitSource.onResizeElement();
		arToolkitSource.copyElementSizeTo(renderer.domElement);
		if (arToolkitContext.arController !== null) {
			arToolkitSource.copyElementSizeTo(
				arToolkitContext.arController.canvas,
			);
		}
	};

	////////////////////////////////////////////////////////////////////////////////
	//          initialize arToolkitContext
	////////////////////////////////////////////////////////////////////////////////

	// create atToolkitContext
	const arToolkitContext = new ArToolkitContext({
		debug: false,
		cameraParametersUrl: ArToolkitContext.baseURL + 'data/camera_para.dat',
		detectionMode: 'mono',
		canvasWidth: 480,
		canvasHeight: 640,
		imageSmoothingEnabled: true,
	});

	// initialize it
	arToolkitContext.init(function onCompleted() {
		// copy projection matrix to camera
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
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

	const markerControls = new ArMarkerControls(arToolkitContext, markerGroup, {
		type: 'pattern',
		patternUrl: ArToolkitContext.baseURL + 'data/patt.hiro',
		smooth: true,
		smoothCount: 5,
		smoothTolerance: 0.01,
		smoothThreshold: 2,
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object in the scene
	//////////////////////////////////////////////////////////////////////////////////

	markerGroup.add(markerScene);

	// debug mesh
	const axisHelper = new THREE.AxesHelper();
	markerScene.add(axisHelper);

	// light the meshes
	const ambientLight = new THREE.AmbientLight(0xddddff, 0.5);
	markerScene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffdd, 0.75);
	markerScene.add(directionalLight);

	const lightTarget = new THREE.Object3D();
	lightTarget.position.x = -1;
	lightTarget.position.y = -1;
	lightTarget.position.z = -1;
	markerScene.add(lightTarget);

	directionalLight.target = lightTarget;

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
};

const loadModel = (url: string, callback?: Function) => {
	// create mesh loader
	const loader = new GLTFLoader();
	loader.load(url, (gltf: GLTF) => {
		gltf.scene.scale.x = 0.5;
		gltf.scene.scale.y = 0.5;
		gltf.scene.scale.z = 0.5;
		markerScene.add(gltf.scene);

		if (callback) callback(gltf);
	});
};

const loadModelLocal = (model: string, callback?: Function) => {
	// create mesh loader
	const loader = new GLTFLoader();
	loader.load(
		ArToolkitContext.baseURL + `data/${model}.glb`,
		(gltf: GLTF) => {
			gltf.scene.scale.x = 1;
			gltf.scene.scale.y = 1;
			gltf.scene.scale.z = 1;

			markerScene.add(gltf.scene);

			if (callback) callback(gltf);
		},
	);
};

const loadText = (text: string, x: number, y: number, z: number) => {
	const loader = new FontLoader();
	loader.load(ArToolkitContext.baseURL + 'data/font.json', (font) => {
		const textGeometry = new TextGeometry(text, {
			font: font,
			size: 0.1,
			// height: 0.02,
			height: 0,
		});

		const textMat = new THREE.MeshBasicMaterial({
			color: new THREE.Color(0xffffff),
		});

		const textMesh = new THREE.Mesh(textGeometry, textMat);

		textMesh.position.x = x;
		textMesh.position.y = y;
		textMesh.position.z = z;

		markerScene.add(textMesh);

		// add a line
		const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
		const lineMat = new THREE.LineBasicMaterial({ color: 0xdddddd });
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		const line = new THREE.Line(lineGeometry, lineMat);

		markerScene.add(line);
	});
};

const position = () => {
	if (!cam) {
		console.error('trying to read position before init');
	}

	// get position
	let x = cam.position.x;
	let y = cam.position.y;
	let z = cam.position.z;

	// add random variation to avoid overlap
	x += Math.random();
	y += Math.random();
	z += Math.random();

	// get unit vector, used to make annotations appear in a sphere around the centre and not go too far out
	const magnitude = Math.sqrt(x * x + y * y + z * z);
	x = x / magnitude + 0.5;
	y = x / magnitude + 0.5;
	z = x / magnitude + 0.5;

	// return everything
	return {
		x,
		y,
		z,
	};
};

const turn = () => {
	markerScene.rotateY(Math.PI / 2); // 90°
};

const toggleAxis = () => {
	axisToggle = !axisToggle;

	if (axisToggle) markerScene.rotation.z = 0;
	else markerScene.rotation.z = -Math.PI / 4; // 45°
};

export {
	initAr,
	loadModel,
	loadModelLocal,
	loadText,
	turn,
	toggleAxis,
	position,
};
