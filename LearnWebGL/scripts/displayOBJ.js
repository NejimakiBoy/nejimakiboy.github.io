"use strict";

// shaders
const vertexShader = '';

const fragmentShader = '';

// parse .OBJ
function parseOBJ(text) {
  objPositions = [[0, 0, 0]]

  const objVertex = [
    objPositions,
  ];

  let webglVertex = [
    [],
  ];
  
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
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  }


}

// main function
async function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // compiles and links the shaders, looks up attribute and uniform locations
  const meshProgramInfo = webglUtils.createProgramInfo(gl, [vs, fs]);

  const response = await fetch("../medias/teapot.js")
  const text = await response.text();
  const data = parseOBJ(text);

  const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);

}

main();