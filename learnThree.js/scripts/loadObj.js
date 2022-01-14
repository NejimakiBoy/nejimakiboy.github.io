// ページの読み込みを待つ
window.addEventListener('load', init);

import * as THREE from '../../../node_modules/three/build/three.js';
import {OBJLoader} from '../../../node_modules/three/examples/jsm/loaders/OBJLoader.js';

function init() {

  const canvas = document.querySelector('#canvas');

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();

  var fov = 60;
  var aspect = width / height;
  var near = 0.1;
  var far = 2000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.set(0, 0, 10);

  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add( light );

  const material = new THREE.MeshStandardMaterial();

  const OBJLoader = new OBJLoader();

  OBJLoader.setMaterials(material);

  OBJLoader.load("../medias/bunny.obj", function(object) {
    object.traverse(function(child) {
      child.material = material;
      console.log(child.material);
    })
    const mesh = object;
    console.log(mesh);
    scene.add(mesh);
  })

  function render(time) {
    time *= 0.001;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}