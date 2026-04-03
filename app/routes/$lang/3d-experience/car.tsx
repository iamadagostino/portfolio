import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import carModelVelora from '@/assets/models/cars/velora.glb';

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

  useFrame((state) => {
    // Elapsed time
    const t = state.clock.getElapsedTime();

    // Group
    const group = gltf.scene;

    // Wheels
    // Each wheel has a rim and a tire
    // We will rotate both the rim and the tire to simulate wheel rotation

    // Front Left Wheel
    // children[46] {name: 'Rim_Front_L'}
    // children[47] {name: 'Tire_Front_L'}
    const frontLeftWheel = {
      rim: group.children[46],
      tire: group.children[47],
    };

    // Front Right Wheel
    // children[50] {name: 'Rim_Front_R'}
    // children[51] {name: 'Tire_Front_R'}
    const frontRightWheel = {
      rim: group.children[50],
      tire: group.children[51],
    };

    // Rear Left Wheel
    // children[48] {name: 'Rim_Rear_L'}
    // children[49] {name: 'Tire_Rear_L'}
    const rearLeftWheel = {
      rim: group.children[48],
      tire: group.children[49],
    };

    // Rear Right Wheel
    // children[52] {name: 'Rim_Rear_R'}
    // children[53] {name: 'Tire_Rear_R'}
    const rearRightWheel = {
      rim: group.children[52],
      tire: group.children[53],
    };

    // Rotate each wheel's rim and tire around x using elapsed time
    const rotationX = t * 2;

    // Front Left Wheel
    frontLeftWheel.rim.rotation.x = rotationX;
    frontLeftWheel.tire.rotation.x = rotationX;

    // Front Right Wheel
    frontRightWheel.rim.rotation.x = rotationX;
    frontRightWheel.tire.rotation.x = rotationX;

    // Rear Left Wheel
    rearLeftWheel.rim.rotation.x = rotationX;
    rearLeftWheel.tire.rotation.x = rotationX;

    // Rear Right Wheel
    rearRightWheel.rim.rotation.x = rotationX;
    rearRightWheel.tire.rotation.x = rotationX;
  });

  return <primitive object={gltf.scene} dispose={null} />;
}

export default Car;
