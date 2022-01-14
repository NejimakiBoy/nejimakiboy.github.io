"use strict";

const vertexShaderSource = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;

  v_color = a_color;
}
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
  `;

function createShader(gl, type, source) {
  // シェーダーを作る
  var shader = gl.createShader(type);
  // シェーダーのコードを教える
  gl.shaderSource(shader, source);
  // シェーダーをコンパイル
  gl.compileShader(shader);
  // 成功したらシェーダーを返す
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createShaderProgram(gl, vs, fs) {
  // シェーダープログラムを作る
  var program = gl.createProgram();
  // 頂点シェーダーを紐付け
  gl.attachShader(program, vs);
  // フラグメントシェーダーを紐付け
  gl.attachShader(program, fs);
  // プログラムをリンク
  gl.linkProgram(program);
  //成功したらプログラムを返す
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

async function paeseObj(text, vertexArray) {
  const v = [];
  const f = [];

  const lines = text.split(`\n`);

  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();

    if ("v" == line.charAt(0)) {
      const parts = line.split(/\s+/).slice(1);
      v.push(parts);
    }

    else if ("f" == line.charAt(0)) {
      const parts = line.split(/\s+/).slice(1);
      for (let partsNo = 0; partsNo < parts.length; ++partsNo) {
        f.push(parts[partsNo]);
      }
    }
  }

  await sortV(vertexArray, v, f);

  async function sortV(vertexArray, v, f) {
    for (let fNo = f.length; fNo > 0; --fNo) {
      var vNo = Number(f[fNo] - 1);
      if (v[vNo] != void 0) {
        for (var i = 0; i < v[vNo].length; ++i) {
          vertexArray.push(v[vNo][i]);
        }
      }
    }
  }
}


async function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");

  const obj = await fetch(`../medias/teapot.obj`);

  var vertexArray = []

  await paeseObj(await obj.text(), vertexArray);

  // 頂点シェーダーを作る
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  // フラグメントシェーダーを作る
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // シェーダープログラムを作る
  var shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);

  // 属性を置く場所を検索
  var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");

  // ユニフォームを置く場所を検索
  var matrixUniformLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

  /* 
  NOTE: バッファーの作成はまとめてやってもいいが、
  バッファーのバインドと情報の書き込みは属性ごとにやる。
  まとめてバインドしてから書き込むことは出来ないっぽい
  */

  // バッファーを作成
  var positionBuffer = gl.createBuffer();

  // バッファーをバインド
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // バッファーに頂点座標を入れる
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

  // バッファーを作成
  var colorBuffer = gl.createBuffer();

  //バッファーをバインド
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  //バッファーに頂点色を入れる
  const colArr = [];

  for (let i = 0; i < vertexArray.length / 3; ++i) {
    const col1 = Math.random();
    const col2 = Math.random();
    const col3 = Math.random();
    for (let j = 0; j < 3; ++j) {
      colArr.push(col1);
      colArr.push(col2);
      colArr.push(col3);
    }
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colArr), gl.STATIC_DRAW);

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  // トランスフォームを設定
  var translation = [0, -0.3, -2];
  var rotation = [degToRad(0), degToRad(0), degToRad(0)];
  var scale = [0.2, 0.2, 0.2];
  var fieldOfViewRadians = degToRad(60);
  var change = 1;

  // 回転量を設定（rad / millisecond）
  var rotationSpeed = 0.001;

  // 経過時間
  var then = 0;

  requestAnimationFrame(drawScene);

  function drawScene(now) {
    // 現在時間から経過時間を引く（millisecond）
    var deltaTime = now - then;

    // 現在時間は次のフレームで経過時間として使う
    then = now;

    rotation[1] += rotationSpeed * deltaTime;

    fieldOfViewRadians += 0.005 * change;

    if (fieldOfViewRadians >= 2) {
      change = -1;
    }
    else if (fieldOfViewRadians <= 0) {
      change = 1;
    }

    // キャンバス解像度と表示解像度を合わせる
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // webGL のビューポートを設定
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // この色でクリアする
    gl.clearColor(0, 0, 0, 1);
    // キャンバスをクリア
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 隠面消去を有効に
    gl.enable(gl.CULL_FACE);

    // デプスをテスト
    gl.enable(gl.DEPTH_TEST);

    // 使用するプラグラムを伝える
    gl.useProgram(shaderProgram);

    // 属性を有効に
    gl.enableVertexAttribArray(positionAttributeLocation);

    // バッファーをバインド
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // バッファーからのデータのとり方を設定する
    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    //色の属性の読み方を設定
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

    // 行列計算
    //各行列をかけ合わせる
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 200;
    var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    // 移動回転の基準点を移動
    var movePivotMatrix = m4.translation(0, 0, 0, 0);
    matrix = m4.multiply(matrix, movePivotMatrix);

    // 行列を渡す
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

    // 描画
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = vertexArray.length / 3;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(drawScene);
  }
}


var m4 = {

  perspective: function (fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function (tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1,
    ];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  },

  scaling: function (sx, sy, sz) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1,
    ];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

};

function debugVar(v) {
  console.log(v);
}

main();