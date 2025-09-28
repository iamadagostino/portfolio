require('colors'); // Module for colored console output
const fs = require('fs-extra');
const path = require('path');

// Define source and destination paths (use path.join for cross-platform safety)
const src = path.join('node_modules', 'three', 'examples', 'jsm', 'libs', 'draco', 'gltf');
const output = path.join('public', 'static', 'vendor', 'draco');

try {
  // Ensure the entire output directory tree exists
  fs.ensureDirSync(output);
  console.info(`Directory ensured: ${output}`.green);

  // Copy draco decoder from three.js into the public directory with overwrite enabled
  const wasmSrc = path.join(src, 'draco_decoder.wasm');
  const wrapperSrc = path.join(src, 'draco_wasm_wrapper.js');

  console.info(`Copying draco_decoder.wasm and draco_wasm_wrapper.js from three.js to ${output}...`.yellow);

  if (!fs.existsSync(wasmSrc) || !fs.existsSync(wrapperSrc)) {
    console.warn(`Source files not found in ${src}. Make sure 'three' is installed.`.red);
  } else {
    fs.copyFileSync(wasmSrc, path.join(output, 'draco_decoder.wasm'));
    console.info('draco_decoder.wasm copied successfully'.green);

    fs.copyFileSync(wrapperSrc, path.join(output, 'draco_wasm_wrapper.js'));
    console.info('draco_wasm_wrapper.js copied successfully'.green);
  }
} catch (err) {
  console.error('Error copying draco decoders:'.red, err);
  process.exit(1);
}