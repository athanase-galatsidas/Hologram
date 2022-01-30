import { createCanvas } from 'canvas';
import { writeFile } from 'fs';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const render = (model: string, savePath: string) => {
	const canvas = createCanvas(128, 128);

	// @ts-ignore
	const renderer = new WebGLRenderer({ canvas: canvas });
	renderer.setClearColor(new THREE.Color(0xffffff));
	renderer.setSize(128, 128);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
	scene.add(camera);
	camera.position.z = 2;

	const grid = new THREE.GridHelper(1, 1);
	scene.add(grid);

	const light = new THREE.AmbientLight(0xffffff);
	scene.add(light);

	const loader = new GLTFLoader();
	loader.load(model, (gltf: GLTF) => {
		scene.add(gltf.scene);
	});

	// render the model
	renderer.render(scene, camera);

	// save the image
	writeFile(savePath, canvas.toDataURL(), () => {});
};

export { render };
