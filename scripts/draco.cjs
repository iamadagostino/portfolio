require('colors'); // Module for colored console output
const fs = require('fs-extra');

const src = 'node_modules/three/examples/jsm/libs/draco/gltf';
const output = 'public/draco';

// Ensure the output directory exists
if (!fs.existsSync(output)) {
  fs.mkdirSync(output);
  console.info(`Directory created: ${output}`.green);
} else {
  console.info(`Directory already exists: ${output}`.cyan);
}

// Copy draco decoder from three.js into the public directory with overwrite enabled
console.info(`Copying draco_decoder.wasm and draco_wasm_wrapper.js from three.js to ${output}...`.yellow);
fs.copySync(`${src}/draco_decoder.wasm`, `${output}/draco_decoder.wasm`, { overwrite: true });
console.info('draco_decoder.wasm copied successfully'.green);

fs.copySync(`${src}/draco_wasm_wrapper.js`, `${output}/draco_wasm_wrapper.js`, { overwrite: true });
console.info('draco_wasm_wrapper.js copied successfully'.green);