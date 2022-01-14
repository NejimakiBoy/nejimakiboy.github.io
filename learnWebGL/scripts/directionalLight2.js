"use strict";

const vsSouce = `
  attribute vec4 a_position;
  attribute vec3 a_normal;
  
  uniform mat4 u_worldViewProjection;
  uniform mat4 u_worldInverseTranspose;

  varying vec3 v_normal;

  void main() {
    gl_Position = u_worldViewProjection * a_position;

    v_normal = mat3(u_worldInverseTranspose) * a_normal;
  }
  `;

const fsSouce = `
  precision mediump float;

  uniform vec3 u_reverseLightDirection;
  uniform vec4 u_color;

  varying vec3 v_normal;

  
  void main() {
    vec3 normal = normalize(v_normal);

    float light = dot(normal, u_reverseLightDirection);
  
    gl_FragColor = u_color;
  
    gl_FragColor.rgb *= light;
  }
  `;

const positions = [
  -0.5, -0.5, 0.5, // 1
  0.0, 0.5, 0.0, // 2
  0.5, -0.5, 0.5, // 0

  0.5, -0.5, 0.5, // 0
  0.0, 0.5, 0.0, // 2
  0.5, -0.5, -0.5, // 4

  0.5, -0.5, -0.5, // 4
  0.0, 0.5, 0.0, // 2
  -0.5, -0.5, -0.5, // 3

  -0.5, -0.5, -0.5, // 3
  0.0, 0.5, 0.0, // 2
  -0.5, -0.5, 0.5, // 1

  -0.5, -0.5, 0.5, // 1
  0.5, -0.5, 0.5, // 0
  0.5, -0.5, -0.5, // 4

  0.5, -0.5, -0.5, // 4
  -0.5, -0.5, -0.5, // 3
  -0.5, -0.5, 0.5, // 1
];

const normals = [
  0.0, 0.447214, 0.894427,
  0.0, 0.447214, 0.894427,
  0.0, 0.447214, 0.894427,

  0.894427, 0.447214, -0.0, // 0
  0.894427, 0.447214, -0.0,
  0.894427, 0.447214, -0.0,

  -0.0, 0.447214, -0.894427, // 4
  -0.0, 0.447214, -0.894427,
  -0.0, 0.447214, -0.894427, // 3

  -0.894427, 0.447214, -0.0, // 3
  -0.894427, 0.447214, -0.0,
  -0.894427, 0.447214, -0.0,

  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,

  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
];

function main() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  var programInfo = twgl.createProgramInfo(gl, [vsSouce, fsSouce]);

  function multiply (){
    var X100 = [];
    for (let i = 0; i < positions.length; ++i) {
      X100.push(positions[i] * 100);
      console.log(X100[i]);
    }
    return X100;
  }

  var multipliedPositons = multiply();

  console.log(multipliedPositons);

  var arrays = {
    a_position: {
      numComponents: 3,
      data: multipliedPositons,
    },
    a_normal: {
      numComponents: 3,
      data: normals,
    }
  }

  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }


  var translation = [0, 0, 0];
  var rotation = [degToRad(0), degToRad(0), degToRad(0)];
  var scale = [1, 1, 1];

  var cameraTranslation = [0, 50, 200];
  var targetTranslation = [0, 0, 0];

  var fieldOfViewYInRadians = degToRad(60);
  var fRotationRadians = 0;

  var rotationSpeed = 0.001;

  var then = 0;

  requestAnimationFrame(drawScene);

  function drawScene(now) {
    var deltaTime = now - then;

    then = now;

    rotation[1] += rotationSpeed * deltaTime;

    twgl.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.frontFace(gl.CW);

    gl.useProgram(programInfo.program);

    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var projectionMatrix = twgl.m4.perspective(fieldOfViewYInRadians, aspect, 1, 2000);

    var cameraMatrix = twgl.m4.lookAt(cameraTranslation, targetTranslation, [0, 1, 0]);
    var viewMatrix = twgl.m4.inverse(cameraMatrix);
    var viewProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewMatrix);

    var worldMatrix = twgl.m4.rotationY(fRotationRadians);
    worldMatrix = twgl.m4.translate(worldMatrix, translation);
    worldMatrix = twgl.m4.rotateX(worldMatrix, rotation[0]);
    worldMatrix = twgl.m4.rotateY(worldMatrix, rotation[1]);
    worldMatrix = twgl.m4.rotateZ(worldMatrix, rotation[2]);
    worldMatrix = twgl.m4.scale(worldMatrix, scale);

    var worldViewProjectionMatrix = twgl.m4.multiply(viewProjectionMatrix, worldMatrix);
    var worldInverseMatrix = twgl.m4.inverse(worldMatrix);
    var worldInverseTransposeMatrix = twgl.m4.transpose(worldInverseMatrix);

    const uniforms = {
      u_worldViewProjection: worldViewProjectionMatrix,
      u_worldInverseTranspose: worldInverseTransposeMatrix,
      u_color: [0.231, 0.670, 1.0, 1.0],
      u_reverseLightDirection: twgl.v3.normalize([0.5, 0.7, 1]),
    };

    twgl.setUniforms(programInfo, uniforms);

    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(drawScene);
  }
}

function debugVar(v) {
  console.log(v);
}

main();