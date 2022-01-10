"use strict";

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

function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  
  const programInfo = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource]);
  
  const arrays = {
    a_position: {
      numComponents: 3,
      data: [
        -0.5, -0.5, 0,
        0, 0.5, 0,
        0.5, -0.5, 0,
      ],
    }
  }

  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  twgl.resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.drawBufferInfo(gl, bufferInfo);
}

main();