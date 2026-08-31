// ---------------------------------------------------------------
// STL parsing — supports binary STL, with ASCII STL fallback.
// Shared by index.html (homepage preview) and viewer.html (full viewer).
// Requires THREE (three.js) to already be loaded on the page.
// ---------------------------------------------------------------
function isLikelyASCII(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  if (arrayBuffer.byteLength < 84) return true;
  const triCount = view.getUint32(80, true);
  const expected = 84 + triCount * 50;
  if (expected === arrayBuffer.byteLength) return false;
  const head = new TextDecoder('utf-8').decode(arrayBuffer.slice(0, 200)).toLowerCase();
  return head.trim().startsWith('solid');
}

function parseBinarySTL(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const triCount = view.getUint32(80, true);
  const positions = new Float32Array(triCount * 9);
  const normals = new Float32Array(triCount * 9);
  let offset = 84;

  for (let i = 0; i < triCount; i++) {
    const nx = view.getFloat32(offset, true);
    const ny = view.getFloat32(offset + 4, true);
    const nz = view.getFloat32(offset + 8, true);
    offset += 12;

    for (let v = 0; v < 3; v++) {
      const vi = i * 9 + v * 3;
      positions[vi] = view.getFloat32(offset, true);
      positions[vi + 1] = view.getFloat32(offset + 4, true);
      positions[vi + 2] = view.getFloat32(offset + 8, true);
      normals[vi] = nx;
      normals[vi + 1] = ny;
      normals[vi + 2] = nz;
      offset += 12;
    }
    offset += 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function parseASCIISTL(arrayBuffer) {
  const text = new TextDecoder('utf-8').decode(arrayBuffer);
  const positionsArr = [];
  const normalsArr = [];

  const facetBlocks = text.split(/facet normal/i).slice(1);
  for (const block of facetBlocks) {
    const nMatch = block.match(/([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)/);
    let nx = 0, ny = 0, nz = 0;
    if (nMatch) { nx = parseFloat(nMatch[1]); ny = parseFloat(nMatch[2]); nz = parseFloat(nMatch[3]); }

    const vMatches = [...block.matchAll(/vertex\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)/g)];
    for (const m of vMatches.slice(0, 3)) {
      positionsArr.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
      normalsArr.push(nx, ny, nz);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionsArr), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normalsArr), 3));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function parseSTL(arrayBuffer) {
  if (isLikelyASCII(arrayBuffer)) return parseASCIISTL(arrayBuffer);
  return parseBinarySTL(arrayBuffer);
}
