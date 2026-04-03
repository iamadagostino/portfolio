import plasterBrickNormalMap from '@/assets/textures/ground/plasterbrick_nor_gl_1k.jpg';
import plasterBrickRoughnessMap from '@/assets/textures/ground/plasterbrick_rough_1k.jpg';
import { configureTextures } from '@/utils/texture-config';
import { MeshReflectorMaterial } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { LinearSRGBColorSpace, RepeatWrapping, TextureLoader } from 'three';

function Ground() {
  const [roughnessMap, normalMap] = useLoader(TextureLoader, [plasterBrickRoughnessMap, plasterBrickNormalMap]);

  useEffect(() => {
    configureTextures([roughnessMap, normalMap], {
      wrapS: RepeatWrapping,
      wrapT: RepeatWrapping,
      colorSpace: LinearSRGBColorSpace,
    });

    [roughnessMap, normalMap].forEach((texture) => {
      texture.repeat.set(5, 5);
    });

    // Cleanup function to dispose textures when component unmounts
    return () => {
      roughnessMap.dispose();
      normalMap.dispose();
    };
  }, [normalMap, roughnessMap]);

  useFrame((state) => {
    // Get the elapsed time and use it to create a scrolling effect
    const t = -state.clock.getElapsedTime() * 0.128;
    // Scroll the texture to create a moving effect
    roughnessMap.offset.set(0, t);
    normalMap.offset.set(0, t);
  });

  return (
    <mesh rotation-x={-Math.PI * 0.5} castShadow receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        envMapIntensity={0}
        normalMap={normalMap}
        normalScale={[0.15, 0.15]}
        roughnessMap={roughnessMap}
        dithering={true}
        color={[0.015, 0.015, 0.015]}
        roughness={0.7}
        blur={[1000, 400]}
        mixBlur={30}
        mixStrength={80}
        mixContrast={1}
        resolution={512}
        mirror={0}
        depthScale={0.01}
        minDepthThreshold={0.9}
        maxDepthThreshold={1}
        depthToBlurRatioBias={0.25}
        reflectorOffset={0.2}
      />
    </mesh>
  );
}
export default Ground;
