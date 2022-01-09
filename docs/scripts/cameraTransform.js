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

async function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");

  // objの読み込み
  const obj = await fetch(`../medias/teapot.obj`);

  var vertexArray = []

  // テキストとしてobj解析関数に渡す
  await parseObj(await obj.text(), vertexArray);

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
  バインドすると上書きされるらしい
  */

  // 頂点座標を入れるバッファーを作成
  var positionBuffer = gl.createBuffer();

  // バッファーをバインド
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // バッファーに頂点座標を入れる
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

  // 頂点色を入れるバッファーを作成
  var colorBuffer = gl.createBuffer();

  //バッファーをバインド
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  const colArr = [];

  // ポリゴンごとにランダムな色を設定
  for (let i = 0; i < vertexArray.length / 3; ++i) {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    for (let j = 0; j < 3; ++j) {
      colArr.push(r);
      colArr.push(g);
      colArr.push(b);
    }
  }

  //バッファーに頂点色を入れる
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colArr), gl.STATIC_DRAW);

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  // トランスフォームを設定
  var translation = [0, -1, 0];
  var rotation = [degToRad(0), degToRad(0), degToRad(0)];
  var scale = [1, 1, 1];

  var cameraAngleRadians = degToRad(0);
  var radius = 3;
  var cameraRadius = 10;

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

    // カメラ角度を更新する
    cameraAngleRadians += rotationSpeed * deltaTime;

    // 視野角を更新する
    cameraRadius += 0.05 * change;

    // 視野角が一定の範囲より大きかったり小さくならないようにする
    if (cameraRadius >= 30) {
      change = -1;
    }
    else if (cameraRadius <= 3) {
      change = 1;
    }

    // キャンバス解像度と表示解像度を合わせる
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

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
    var size = 3; // 呼び出すごとに3つづつ取る（x, y, z）
    var type = gl.FLOAT; // データ型
    var normalize = false; // 正規化の有無
    var stride = 0; // シェーダーを呼び出すごとに進む距離らしい 0 = size * sizeof(type) よくわからない
    var offset = 0; // バッファーのどこから読み始めるか

    // positionBufferとpositionAttributeを結びつける
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // 上と同じことを属性毎にやる
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight; // canvasのアスペクト
    var zNear = 1; // zNearClipの距離
    var zFar = 200; // zFarClipの距離

    // プロジェクション行列
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // カメラのトランスフォーム行列
    var cameraMatrix = m4.yRotation(cameraAngleRadians);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, cameraRadius);


    // ビュー行列を作る
    var viewMatrix = m4.inverse(cameraMatrix);

    // ビュープロジェクション行列を計算
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // ティーポットの数
    var teapots = 3

    for (let i = 0; i < teapots; ++i) {

      // 円形に配置
      var angle = i * Math.PI * 2 / teapots;
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;

      // トランスフォームの行列を計算
      var matrix = m4.translate(viewProjectionMatrix, x, translation[1], y);
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
      var primitiveType = gl.TRIANGLES; // プリミティブを選ぶ
      var offset = 0; // 頂点の配列のどこから読み出すか 最初に読み出される配列要素の添字
      var count = vertexArray.length / 3; // 描画するプリミティブの数を指定する 今回は三角形なので 頂点数/3 になる
      gl.drawArrays(primitiveType, offset, count);
    }

    requestAnimationFrame(drawScene);
  }
}

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
  // 成功したらプログラムを返す
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

async function parseObj(text, vertexArray) {
  const v = [];
  const f = [];

  //行ごとに区切って配列に入れる
  const lines = text.split(`\n`);

  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    // 両端のスペースを消す
    const line = lines[lineNo].trim();

    // 1文字目が v ならスペースごとに区切って配列に入れる
    if ("v" == line.charAt(0)) {
      const parts = line.split(/\s+/).slice(1);
      v.push(parts);
    }

    // 1文字目が f ならスペースごとに区切って配列に入れる
    else if ("f" == line.charAt(0)) {
      const parts = line.split(/\s+/).slice(1);
      for (let partsNo = 0; partsNo < parts.length; ++partsNo) {
        f.push(parts[partsNo]);
      }
    }
  }

  await sortV(vertexArray, v, f);

  // f が指定する通りに v を並べて配列に入れる。
  async function sortV(vertexArray, v, f) {
    for (let fNo = 0; fNo < f.length; ++fNo) {
      var vNo = Number(f[fNo] - 1);
      if (v[vNo] != void 0) {
        for (var i = 0; i < v[vNo].length; ++i) {
          vertexArray.push(v[vNo][i]);
        }
      }
    }
  }
}

function resize(canvas) {
  // ブラウザがcanvasを表示しているサイズを調べる。
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // canvasの「描画バッファーのサイズ」と「表示サイズ」が異なるかどうか確認する。
  if (canvas.width != displayWidth ||
    canvas.height != displayHeight) {

    // サイズが違っていたら、描画バッファーのサイズを
    // 表示サイズと同じサイズに合わせる。
    canvas.width = displayWidth;
    canvas.height = displayHeight;
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

  inverse: function (m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0 = m22 * m33;
    var tmp_1 = m32 * m23;
    var tmp_2 = m12 * m33;
    var tmp_3 = m32 * m13;
    var tmp_4 = m12 * m23;
    var tmp_5 = m22 * m13;
    var tmp_6 = m02 * m33;
    var tmp_7 = m32 * m03;
    var tmp_8 = m02 * m23;
    var tmp_9 = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },

  vectorMultiply: function (v, m) {
    var dst = [];
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j) {
        dst[i] += v[j] * m[j * 4 + i];
      }
    }
    return dst;
  },

};

function debugVar(v) {
  console.log(v);
}

main();