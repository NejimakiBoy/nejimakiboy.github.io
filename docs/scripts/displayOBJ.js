"use strict";
//const webglUtils = await import(`webgl-utils.js`);
//const glMatrix = await import(`gl-matrix.js`);

const vertexShaderSource = `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;
  }
  `;

const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(0.231, 0.670, 1, 1.0);
  }
  `;

function persOBJ(text) {
  const objPositions = [[0, 0, 0]];
  const objNormals = [[0, 0, 0]];

  const objVertexData = [
    objPositions,
    objNormals
  ];

  let webglVertexData = [
    [],
    []
  ];

  function newGeometry() {
    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
    setGeometry();
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  }

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return {
    position: webglVertexData[0],
    normal: webglVertexData[1],
  };
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
  //成功したらプログラムを返す
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");

  // 頂点シェーダーを作る
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  // フラグメントシェーダーを作る
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // シェーダープログラムを作る
  var shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);

  // 頂点データを置く場所を検索
  var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position")

  // バッファーを作成
  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 頂点
  var positions = [
    -0.3, -0.5,
    0, 0.5,
    0.3, -0.5,
  ];

  // バッファーに頂点を入れる
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // webGL のビューポートを設定
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // この色でクリアする
  gl.clearColor(0, 0, 0, 1);
  // キャンバスをクリア
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 使用するプラグラムを伝える
  gl.useProgram(shaderProgram);

  // 属性を有効に
  gl.enableVertexAttribArray(positionAttributeLocation);

  // バッファーをバインド
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // バッファーからのデータのとり方を設定する
  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  // 描画
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

main();