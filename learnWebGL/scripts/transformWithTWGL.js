"use strict";

const vsSouce = `
  attribute vec4 a_position;
  attribute vec4 a_color;

  uniform mat4 u_matrix;

  varying vec4 v_color;

  void main() {
    gl_Position = u_matrix * a_position;

    v_color = a_color;
  }
  `;

const fsSouce = `
  precision mediump float;

  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
  `;

const positions = [
  //前面
  0, 0, 0,
  25, 50, -25,
  50, 0, 0,

  //背面
  50, 0, -50,
  25, 50, -25,
  0, 0, -50,

  //左側面
  0, 0, 0,
  0, 0, -50,
  25, 50, -25,

  //右側面
  50, 0, -50,
  50, 0, 0.0,
  25, 50, -25,

  //底面
  0, 0, 0,
  50, 0, 0,
  50, 0, -50,

  0, 0, 0,
  50, 0, -50,
  0, 0, -50,
];

const colors = [
  // 前面
  255, 0, 0,
  255, 0, 0,
  255, 0, 0,

  // 背面
  0, 255, 0,
  0, 255, 0,
  0, 255, 0,

  // 左側面
  0, 0, 255,
  0, 0, 255,
  0, 0, 255,

  // 右側面
  255, 255, 0,
  255, 255, 0,
  255, 255, 0,

  // 底面
  255, 0, 255,
  255, 0, 255,
  255, 0, 255,
  255, 0, 255,
  255, 0, 255,
  255, 0, 255,
];

function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");

  var programInfo = twgl.createProgramInfo(gl, [vsSouce, fsSouce]);

  var arrays = {
    a_position: {
      numComponents: 3,
      data: positions,
    },
    a_color: {
      numComponents: 3,
      data: colors,
    }
  }

  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  // トランスフォームを設定
  var translation = [0, -0.2, 0];
  var rotation = [degToRad(-22.5), degToRad(45), degToRad(0)];
  var scale = [0.01, 0.01, 0.01];

  // 回転する量を設定（rad / millisecond）
  var rotationSpeed = 0.001;

  // 経過時間
  var then = 0;

  // 移動方向
  var moveDir = 1;

  // 拡縮方向
  var scaleDir = 1

  requestAnimationFrame(drawScene);

  function drawScene(now) {
    // 現在時間から経過時間を引く（millisecond）
    var deltaTime = now - then;

    // 現在時間は次のフレームで経過時間として使う
    then = now;

    rotation[1] += rotationSpeed * deltaTime;

    translation[0] += 0.01 * moveDir;

    if (translation[0] >= 0.8) {
      moveDir = -1;
    }
    else if (translation[0] <= -0.8) {
      moveDir = 1
    }

    scale[1] += 0.0001 * scaleDir;

    if (scale[1] >= 0.015) {
      scaleDir = -1;
    }
    else if (scale[1] <= 0.005) {
      scaleDir = 1
    }

    // キャンバス解像度と表示解像度を合わせる

    twgl.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    
    gl.useProgram(programInfo.program);

    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    var matrix = twgl.m4.translation(translation);

    var movePivotMatrix = twgl.m4.translation([-25, 0, 25]);
    matrix = twgl.m4.rotateX(matrix, rotation[0]);
    matrix = twgl.m4.rotateY(matrix, rotation[1]);
    matrix = twgl.m4.rotateZ(matrix, rotation[2]);
    matrix = twgl.m4.scale(matrix, scale);
    matrix = twgl.m4.multiply(matrix, movePivotMatrix);

    const uniforms = {
      u_matrix: matrix,
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