import {
  ContactShadows,
  Environment,
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sky,
  useScroll,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { animate, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Group, PerspectiveCamera } from 'three';

import { Projects } from '../projects';
import { Avatar } from './avatar';
import { Background } from './background';
import { Room } from './room';

type Transform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

const clampSection = (value: number) => {
  if (value < 0) return 0;
  if (value > 3) return 3;
  return value;
};

const getAvatarTransform = (section: number, viewportHeight: number, menuOpened: boolean): Transform => {
  const clamped = clampSection(section);

  switch (clamped) {
    case 0:
      return {
        scale: 1.8,
        position: [-2, 0, -0.25],
        rotation: [0, -1.65, 0],
      };
    case 1:
      return {
        scale: 2.25,
        position: [0, -viewportHeight + 1.75, 1],
        rotation: [0, menuOpened ? 8.25 : 7.75, 0],
      };
    case 2:
      return {
        scale: 0.75,
        position: [-5, -viewportHeight * 2 + 1.125, 5],
        rotation: [0, Math.PI / 1.125, 0],
      };
    case 3:
      return {
        scale: 9,
        position: [-1.5, -viewportHeight * 3 - 12.5, 0],
        rotation: [0, 1.125, 0],
      };
    default:
      return {
        scale: 1.8,
        position: [-2, 0, -0.25],
        rotation: [0, -1.65, 0],
      };
  }
};

const getRoomTransform = (section: number): Transform => {
  if (section === 1) {
    return {
      scale: 0,
      position: [0, 0, 0],
      rotation: [0, -2, 0],
    };
  }

  return {
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  };
};

const getAboutPosition = (section: number, viewportHeight: number) => {
  if (section === 1) {
    return { y: -viewportHeight, z: 0 };
  }

  return { y: -10, z: -20 };
};

type ExperienceProps = {
  darkMode: boolean;
  menuOpened: boolean;
};

type ScrollState = ReturnType<typeof useScroll> & {
  scroll: { current: number };
};

export const Experience = ({ darkMode, menuOpened }: ExperienceProps) => {
  // Scroll
  const data = useScroll() as ScrollState;

  // Viewport
  const { viewport } = useThree();

  // Section and Animation State
  const [section, setSection] = useState(0);
  const [lastAnimation, setLastAnimation] = useState(''); // Track last animation

  // Avatar animation states
  const [avatarAnimation, setAvatarAnimation] = useState('FallingIdle');

  // Set the Avatar Container
  const avatarContainerRef = useRef<Group | null>(null);

  // Set the Room Container
  const roomContainerHomeRef = useRef<Group | null>(null);

  // Camera Position, LookAt, and FOV
  const cameraPositionX = useMotionValue(0);
  const cameraPositionY = useMotionValue(0);
  const cameraPositionZ = useMotionValue(0);
  const cameraLookAtX = useMotionValue(0);
  const cameraLookAtY = useMotionValue(0);
  const cameraLookAtZ = useMotionValue(0);
  const cameraFOV = useMotionValue(0);

  const initialAvatarTransform = useRef(getAvatarTransform(0, viewport.height, menuOpened));
  const avatarScale = useMotionValue(initialAvatarTransform.current.scale);
  const avatarX = useMotionValue(initialAvatarTransform.current.position[0]);
  const avatarY = useMotionValue(initialAvatarTransform.current.position[1]);
  const avatarZ = useMotionValue(initialAvatarTransform.current.position[2]);
  const avatarRotateX = useMotionValue(initialAvatarTransform.current.rotation[0]);
  const avatarRotateY = useMotionValue(initialAvatarTransform.current.rotation[1]);
  const avatarRotateZ = useMotionValue(initialAvatarTransform.current.rotation[2]);

  const initialRoomTransform = useRef(getRoomTransform(0));
  const roomScale = useMotionValue(initialRoomTransform.current.scale);
  const roomRotateY = useMotionValue(initialRoomTransform.current.rotation[1]);

  const initialAboutPosition = useRef(getAboutPosition(0, viewport.height));
  const aboutY = useMotionValue(initialAboutPosition.current.y);
  const aboutZ = useMotionValue(initialAboutPosition.current.z);

  const aboutGroupRef = useRef<Group | null>(null);

  // Function to switch avatar animation if necessary
  const triggerAvatarAnimation = useCallback(
    (newAnimation: string) => {
      if (lastAnimation !== newAnimation) {
        setAvatarAnimation(newAnimation);
        setLastAnimation(newAnimation); // Update the last animation
      }
    },
    [lastAnimation]
  );

  useEffect(() => {
    const target = getAvatarTransform(section, viewport.height, menuOpened);
    const controls = [
      animate(avatarScale, target.scale, { duration: 0.75, delay: 0.25 }),
      animate(avatarX, target.position[0], { duration: 0.75, delay: 0.25 }),
      animate(avatarY, target.position[1], { duration: 0.75, delay: 0.25 }),
      animate(avatarZ, target.position[2], { duration: 0.75, delay: 0.25 }),
      animate(avatarRotateX, target.rotation[0], { duration: 0.75, delay: 0.25 }),
      animate(avatarRotateY, target.rotation[1], { duration: 0.75, delay: 0.25 }),
      animate(avatarRotateZ, target.rotation[2], { duration: 0.75, delay: 0.25 }),
    ];

    return () => {
      controls.forEach((control) => {
        if (control && typeof control.stop === 'function') {
          control.stop();
        }
      });
    };
  }, [
    section,
    menuOpened,
    viewport.height,
    avatarScale,
    avatarX,
    avatarY,
    avatarZ,
    avatarRotateX,
    avatarRotateY,
    avatarRotateZ,
  ]);

  useEffect(() => {
    const target = getRoomTransform(section);
    const controls = [
      animate(roomScale, target.scale, { duration: 0.5, delay: 0.6 }),
      animate(roomRotateY, target.rotation[1], { duration: 0.5, delay: 0.6 }),
    ];

    return () => {
      controls.forEach((control) => {
        if (control && typeof control.stop === 'function') {
          control.stop();
        }
      });
    };
  }, [section, roomScale, roomRotateY]);

  useEffect(() => {
    const target = getAboutPosition(section, viewport.height);
    const controls = [
      animate(aboutY, target.y, { duration: 1.2, delay: 0.6 }),
      animate(aboutZ, target.z, { duration: 1.2, delay: 0.6 }),
    ];

    return () => {
      controls.forEach((control) => {
        if (control && typeof control.stop === 'function') {
          control.stop();
        }
      });
    };
  }, [section, viewport.height, aboutY, aboutZ]);

  // Handle section changes (excluding menu interactions)
  useEffect(() => {
    if (!menuOpened) {
      if (section === 0) {
        triggerAvatarAnimation('SittingTyping');
      } else if (section === 1) {
        triggerAvatarAnimation('StandToSit');
      } else {
        triggerAvatarAnimation('StandingIdle');
      }

      const timeoutId = window.setTimeout(() => {
        if (section === 0) {
          // Set Avatar to SittingTyping
          triggerAvatarAnimation('SittingTyping');
          // Camera Settings
          animate(cameraFOV, 24, { duration: 2 });
          animate(cameraPositionX, 7.75, { duration: 1.5 });
          animate(cameraPositionY, 4.5, { duration: 1.5 });
          animate(cameraPositionZ, 1.25, { duration: 2 });
          animate(cameraLookAtX, -12, { duration: 1.5 });
          animate(cameraLookAtY, -0.25, { duration: 1.5 });
          animate(cameraLookAtZ, 1.75, { duration: 2 });
        } else if (section === 1) {
          // Set Avatar to SittingIdle
          triggerAvatarAnimation('SittingIdle');
          // Camera Settings
          animate(cameraFOV, 24, { duration: 2 });
          animate(cameraPositionX, 8, { duration: 1.5 });
          animate(cameraPositionY, 4, { duration: 1.5 });
          animate(cameraPositionZ, 1.25, { duration: 2 });
          animate(cameraLookAtX, -12, { duration: 1.5 });
          animate(cameraLookAtY, 0.25, { duration: 1.5 });
          animate(cameraLookAtZ, 2, { duration: 2 });
        } else if (section === 2) {
          // Set Avatar to StandingIdle
          triggerAvatarAnimation('StandingIdle');
          // Camera Settings
          animate(cameraFOV, 24, { duration: 2 });
          animate(cameraPositionX, 8, { duration: 1.5 });
          animate(cameraPositionY, 4, { duration: 1.5 });
          animate(cameraPositionZ, 1.25, { duration: 2 });
          animate(cameraLookAtX, -12, { duration: 1.5 });
          animate(cameraLookAtY, 0.25, { duration: 1.5 });
          animate(cameraLookAtZ, 2, { duration: 2 });
        }
      }, 250);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [
    section,
    menuOpened,
    cameraFOV,
    cameraPositionX,
    cameraPositionY,
    cameraPositionZ,
    cameraLookAtX,
    cameraLookAtY,
    cameraLookAtZ,
    triggerAvatarAnimation,
  ]);

  // Animate for Menu Opened (no intermediate animations)
  useEffect(() => {
    if (section === 0) {
      if (menuOpened) triggerAvatarAnimation('Sitting');

      // Camera Zoom and Position
      animate(cameraFOV, menuOpened ? 10 : 24, { duration: 2 });
      animate(cameraPositionX, menuOpened ? 6 : 7.75, { duration: 1.5 });
      animate(cameraPositionY, menuOpened ? 6 : 4.5, { duration: 1.5 });
      animate(cameraPositionZ, menuOpened ? -16 : 1.25, { duration: 2 });
      animate(cameraLookAtX, menuOpened ? -8 : -12, { duration: 1.5 });
      animate(cameraLookAtY, menuOpened ? -1.25 : -0.25, { duration: 1.5 });
      animate(cameraLookAtZ, menuOpened ? 9 : 1.75, { duration: 2 });
    }
  }, [
    menuOpened,
    section,
    cameraFOV,
    cameraPositionX,
    cameraPositionY,
    cameraPositionZ,
    cameraLookAtX,
    cameraLookAtY,
    cameraLookAtZ,
    triggerAvatarAnimation,
  ]);

  // Update the Camera
  useFrame((state) => {
    let currentSection = Math.floor(data.scroll.current * data.pages);
    currentSection = currentSection > 3 ? 3 : currentSection;
    if (currentSection !== section) {
      setSection(currentSection);
    }

    const camera = state.camera;
    if ('isPerspectiveCamera' in camera && camera.isPerspectiveCamera) {
      const perspectiveCamera = camera as PerspectiveCamera;
      perspectiveCamera.fov = cameraFOV.get();
      perspectiveCamera.updateProjectionMatrix();
    }
    camera.position.x = cameraPositionX.get();
    camera.position.y = cameraPositionY.get();
    camera.position.z = cameraPositionZ.get();
    camera.lookAt(cameraLookAtX.get(), cameraLookAtY.get(), cameraLookAtZ.get());

    if (avatarContainerRef.current) {
      const scale = avatarScale.get();
      avatarContainerRef.current.scale.setScalar(scale);
      avatarContainerRef.current.position.set(avatarX.get(), avatarY.get(), avatarZ.get());
      avatarContainerRef.current.rotation.set(avatarRotateX.get(), avatarRotateY.get(), avatarRotateZ.get());
    }

    if (roomContainerHomeRef.current) {
      const scale = roomScale.get();
      roomContainerHomeRef.current.scale.setScalar(scale);
      roomContainerHomeRef.current.rotation.set(0, roomRotateY.get(), 0);
    }

    if (aboutGroupRef.current) {
      aboutGroupRef.current.position.y = aboutY.get();
      aboutGroupRef.current.position.z = aboutZ.get();
    }
  });

  return (
    <>
      {/* Background */}
      <Background darkMode={darkMode} />

      {/* Avatar */}
      <group ref={avatarContainerRef}>
        <ContactShadows opacity={0.45} scale={10} blur={1} far={10} resolution={256} color="#000000" />
        <Avatar animation={avatarAnimation} />
      </group>

      {/* Room */}
      <group ref={roomContainerHomeRef}>
        <Sky sunPosition={[30, 15, 45]} />
        <Environment preset={darkMode && section === 0 ? 'night' : 'sunset'} background={section === 0} blur={0.25} />
        <ambientLight intensity={darkMode ? 0.3 : 0} />
        <Room section={section} menuOpened={menuOpened} />
      </group>

      {/* About */}
      <group ref={aboutGroupRef}>
        <Float>
          <mesh position={[-6, 3, -1.5]} scale={0.75}>
            <sphereGeometry />
            <MeshDistortMaterial opacity={0.8} transparent distort={0.4} speed={4} color={'red'} />
          </mesh>
        </Float>
        <Float>
          <mesh position={[-9, 3, 4.5]} scale={0.6}>
            <sphereGeometry />
            <MeshDistortMaterial opacity={0.8} transparent distort={1} speed={5} color="yellow" />
          </mesh>
        </Float>
        <Float>
          <mesh position={[-9, 0, 4.5]} scale={1.25}>
            <boxGeometry />
            <MeshWobbleMaterial opacity={0.8} transparent factor={1} speed={5} color={'blue'} />
          </mesh>
        </Float>
      </group>

      {/* Projects */}
      <Projects setAvatarAnimation={setAvatarAnimation} />
    </>
  );
};
