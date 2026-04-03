import gridTexture from '@/assets/textures/ground/grid.png';
import { configureTexture } from '@/utils/texture-config';
import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { RepeatWrapping, TextureLoader } from 'three';

export function FloatingGrid() {
  const diffuse = useLoader(TextureLoader, gridTexture);

  useEffect(() => {
    configureTexture(diffuse, {
      wrapS: RepeatWrapping,
      wrapT: RepeatWrapping,
      anisotropy: 4,
    });
    diffuse.repeat.set(1, 1);
    diffuse.offset.set(0, 0);
  }, [diffuse]);

  useFrame((state) => {
    // Get the elapsed time and use it to create a scrolling effect
    const t = -state.clock.getElapsedTime() * 0.128;
    // Scroll the texture to create a moving effect
    diffuse.offset.set(0, t);
  });

  return (
    // A large plane with a grid texture that appears to float slightly above the ground
    <mesh rotation-x={-Math.PI * 0.5} position={[0, 0.001, 0]}>
      <planeGeometry args={[35, 35]} />
      <meshBasicMaterial color={[1, 1, 1]} opacity={0.5} map={diffuse} alphaMap={diffuse} transparent={true} />
    </mesh>
  );
}

export default FloatingGrid;
