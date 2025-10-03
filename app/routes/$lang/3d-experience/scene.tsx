import { CubeCamera, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import Boxes from './boxes';
import Car from './car';
import Ground from './ground';
import Rings from './rings';

function Scene() {
  return (
    <>
      {/* Camera and Controls */}
      <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]} />
      <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />

      {/* Background Color */}
      <color attach="background" args={[0, 0, 0]} />

      {/* Lighting so the material color is visible */}
      <ambientLight intensity={0.3} />

      {/* Hemisphere light for soft sky/ground fill */}
      <hemisphereLight args={[0xffffff, 0x222222, 0.6]} />

      {/* Environment and Car inside a CubeCamera for real-time reflections */}
      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            {/* Environment Map */}
            <Environment map={texture} />
            {/* Car Model - Velora */}
            <Car />
          </>
        )}
      </CubeCamera>

      {/* Rings */}
      <Rings />

      {/* Boxes */}
      <Boxes />

      {/* A brighter spotlight with shadows enabled */}
      <spotLight
        color={[1, 0.25, 0.7]}
        intensity={150}
        position={[5, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* A cooler spotlight with shadows enabled */}
      <spotLight
        color={[0.14, 0.5, 0.7]}
        intensity={200}
        position={[-5, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Ground Plane */}
      <Ground />

      <EffectComposer>
        <DepthOfField
          focusDistance={0.035} // Focus distance
          focalLength={0.01} // Focal length
          bokehScale={3} // Bokeh scale
          height={480} // Render height
        />

        <Bloom
          blendFunction={BlendFunction.ADD} // Blend Mode
          intensity={1.2} // Bloom intensity
          width={300} // Render width
          height={300} // Render height
          kernelSize={5} // Kernel size
          luminanceThreshold={0.95} // Luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // Smoothness of the luminance threshold. Can be thought of as a range around the threshold. Range is [0, 1]
        />

        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // Blend Mode
          offset={[0.0005, 0.0012]} // Subtle effect
        />
      </EffectComposer>
    </>
  );
}

export default Scene;
