// ページの読み込みを待つ
window.addEventListener('load', init);

import * as THREE from '../../node_modules/three/build/three.module.js';

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

  camera.position.set(0, 0, 6);

  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const box = new THREE.Mesh(boxGeo, material);
  scene.add(box);
  box.position.set(-2, 2, 0);

  const circleGeo = new THREE.CircleGeometry(0.5, 12);
  const circle = new THREE.Mesh(circleGeo, material);
  scene.add(circle);
  circle.position.set(0, 2, 0);

  const coneGeo = new THREE.ConeGeometry(0.5, 1, 12);
  const cone = new THREE.Mesh(coneGeo, material);
  scene.add(cone);
  cone.position.set(2, 2, 0);

  const cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
  const cylinder = new THREE.Mesh(cylinderGeo, material);
  scene.add(cylinder);
  cylinder.position.set(-2, 0, 0);

  const dodecahedronGeo = new THREE.DodecahedronGeometry(0.5);
  const dodecahedron = new THREE.Mesh(dodecahedronGeo, material);
  scene.add(dodecahedron);
  dodecahedron.position.set(0, 0, 0,);

  const icosahedronGeo = new THREE.IcosahedronGeometry(0.5);
  const icosahedron = new THREE.Mesh(icosahedronGeo, material);
  scene.add(icosahedron);
  icosahedron.position.set(2, 0, 0);

  const octahedronGeo = new THREE.OctahedronGeometry(0.5);
  const octahedron = new THREE.Mesh(octahedronGeo, material);
  scene.add(octahedron);
  octahedron.position.set(-2, -2, 0);

  const planeGeo = new THREE.PlaneGeometry(1, 1);
  const plane = new THREE.Mesh(planeGeo, material);
  scene.add(plane);
  plane.position.set(0, -2, 0);

  const ringGeo = new THREE.RingGeometry(0.3, 0.5, 12);
  const ring = new THREE.Mesh(ringGeo, material);
  scene.add(ring);
  ring.position.set(2, -2, 0);


  function render(time) {
    time *= 0.001;
    box.rotation.x = time;
    box.rotation.y = time;

    circle.rotation.x = time;
    circle.rotation.y = time;

    cone.rotation.x = time;
    cone.rotation.y = time;

    cylinder.rotation.x = time;
    cylinder.rotation.y = time;

    dodecahedron.rotation.x = time;
    dodecahedron.rotation.y = time;

    icosahedron.rotation.x = time;
    icosahedron.rotation.y = time;

    octahedron.rotation.x = time;
    octahedron.rotation.y = time;

    plane.rotation.x = time;
    plane.rotation.y = time;

    ring.rotation.x = time;
    ring.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}