async function main() {

  const file = await fetch(`../medias/teapotWithoutF.obj`);
  console.log(file.result);
  const content = await file.text();
  console.log(content);

  paeseText(content);
}

function paeseText(text) {
  const lines = text.split(`\n`);
  console.log(lines);

  const vertices = [];

  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    console.log(line);
    const parts = line.split(/\s+/).slice(1);
    console.log(parts);
    for (let i = 0; i < parts.length; ++i) {
      vertices.push(parts[i]);
    }
    console.log(vertices);

  }
}

main();