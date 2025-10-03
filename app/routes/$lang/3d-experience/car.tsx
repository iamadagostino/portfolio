import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import carModelVelora from '~/assets/models/cars/velora.glb';

function Car() {
  const gltf = useLoader(GLTFLoader, carModelVelora);

  useEffect(() => {
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.traverse((model) => {
      if (model instanceof Mesh) {
        model.castShadow = true;
        model.receiveShadow = true;
        model.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} dispose={null} />;
}

export default Car;
