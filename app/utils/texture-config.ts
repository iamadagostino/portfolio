import type { Texture } from 'three';

type TextureConfig = Record<string, string | number | object | boolean | null | undefined>;

/**
 * Applies configuration properties to a THREE.Texture object
 * This utility centralizes imperative texture mutations for Three.js objects,
 * which are external library objects and not React state.
 *
 * @param texture - The Three.js texture to configure
 * @param config - Configuration object with texture properties
 */
export function configureTexture<T extends Texture>(texture: T, config: TextureConfig): T {
  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined) {
      (texture as Record<string, unknown>)[key] = value;
    }
  });
  return texture;
}

/**
 * Applies the same configuration to multiple textures
 *
 * @param textures - Array of textures to configure
 * @param config - Configuration object with texture properties
 */
export function configureTextures<T extends Texture>(textures: T[], config: TextureConfig): T[] {
  textures.forEach((texture) => configureTexture(texture, config));
  return textures;
}
