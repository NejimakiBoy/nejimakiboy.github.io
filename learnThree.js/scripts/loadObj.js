window.addEventListener('load', init);

function init() {
  const canvas = document.querySelector('#canvas');
  const OBJLoader = new THREE.OBJLoader();

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

  camera.position.set(0, 0, 25);

  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  const material = new THREE.MeshNormalMaterial();

  const object3D = new THREE.Object3D();

  OBJLoader.load("../medias/happyBuddhaFixed.obj",
    function (object) {
      object.traverse(function (child) {
          child.material = material;
          /*
          var object3DChild = new THREE.Mesh(child.geometry, child.material);
          object3D.add(object3DChild);
          */
        });
      object3D.add(object);
    })

  scene.add(object3D);

  object3D.scale.set(0.1, 0.1, 0.1);
  object3D.position.set(0, -10, 0);

  function render(time) {
    time *= 0.001;

    object3D.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}