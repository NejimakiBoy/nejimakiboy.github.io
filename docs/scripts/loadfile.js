async function main() {

  const file = await fetch(`../medias/teapot.obj`);
  //console.log(file.result);
  const text = await file.text();
  //console.log(text);

  var v = [];
  var f = []

  paeseText(text, v, f);

  var sortedV = []
  sortV(sortedV, v, f);
  console.log("sortedV: " + sortedV)
}

function paeseText(text, v, f) {
  const lines = text.split(`\n`);
  //console.log(lines);

  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    //console.log("line " + lineNo + ": " + line);

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
}

function sortV(sortedV, v, f) {
  for (let fNo = 0; fNo < f.length; ++fNo) {
    var vNo = Number(f[fNo]);
    if (v[vNo] != void 0) {
      for (var i = 0; i < v[vNo].length; ++i) {
        sortedV.push(v[vNo][i]);
      }
    }
  }
}


main();