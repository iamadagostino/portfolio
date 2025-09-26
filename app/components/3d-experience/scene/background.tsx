import { forwardRef, useEffect, useRef } from 'react';

import { Sphere, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

type BackgroundProps = {
  darkMode: boolean;
};

type ScrollState = ReturnType<typeof useScroll> & {
  scroll: { current: number };
};

export const Background = ({ darkMode }: BackgroundProps) => {
  const material = useRef<THREE.MeshBasicMaterial | null>(null);
  const color = useRef<{ color: string }>({
    color: darkMode ? '#1e293b' : '#f1f5f9',
  });
  const data = useScroll() as ScrollState;

  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Capitalized wrapper to avoid react/no-unknown-property ESLint errors.
  // ESLint treats lowercase JSX tags as DOM elements and validates their props;
  // wrapping the intrinsic `meshBasicMaterial` with a capitalized component
  // lets us pass three.js-specific props like `side` and `toneMapped` without
  // triggering the rule while still rendering the same intrinsic element.
  // Use a permissive but typed props shape to avoid referencing the global JSX namespace in this module
  const MeshBasicMaterial = forwardRef<THREE.MeshBasicMaterial, Record<string, unknown>>((props, ref) => {
    // Forward the ref to the actual three.js material element
    return <meshBasicMaterial ref={ref} {...props} />;
  });

  useFrame(() => {
    // Check if the timeline and the material are initialized before proceeding
    if (timeline.current && material.current) {
      timeline.current.progress(data.scroll.current);
      material.current.color = new THREE.Color(color.current.color);
    }
  });

  useEffect(() => {
    timeline.current = gsap.timeline();

    // About Section Color: sky-700 (#0369a1) or sky-500 (#38bdf8)
    timeline.current.to(color.current, {
      color: darkMode ? '#0369a1' : '#0ea5e9',
    });

    // Projects Section Color: blue-950 (#172554) sky-700 (#0369a1)
    timeline.current.to(color.current, {
      color: darkMode ? '#172554' : '#0369a1',
    });

    // Contact Section Color: teal-800 (#be123c) or teal-600 (#0d9488)
    timeline.current.to(color.current, {
      color: darkMode ? '#115e59' : '#0d9488',
    });

    return () => {
      timeline.current?.kill();
      timeline.current = null;
    };
  }, [darkMode]);

  return (
    <group>
      <Sphere scale={[30, 30, 30]}>
        <MeshBasicMaterial ref={material} side={THREE.BackSide} toneMapped={false} />
      </Sphere>
    </group>
  );
};
