import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Color, Vector3, type Mesh } from 'three';

type BoxesProps = {
  color?: string | number | Color | number[];
};

function Box({ color }: BoxesProps) {
  const box = useRef<Mesh | null>(null);
  const [xRotationSpeed] = useState(() => Math.random());
  const [yRotationSpeed] = useState(() => Math.random());
  const [scale] = useState(() => Math.pow(Math.random(), 2.0) * 0.5 + 0.05);
  const [position] = useState<Vector3>(() => resetPosition());

  function resetPosition(): Vector3 {
    const v = new Vector3((Math.random() * 2 - 1) * 3, Math.random() * 2.5 + 0.1, (Math.random() * 2 - 1) * 15);

    if (v.x < 0) v.x -= 1.75;
    if (v.x > 0) v.x += 1.75;

    return v;
  }

  useFrame((state, delta) => {
    if (box.current) {
      box.current.position.set(position.x, position.y, position.z);
      box.current.rotation.x += delta * xRotationSpeed;
      box.current.rotation.y += delta * yRotationSpeed;
      box.current.position.z += delta * 3;
    }
  });

  return (
    <mesh ref={box} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={
          Array.isArray(color)
            ? new Color(color[0], color[1], color[2])
            : (color as string | number | Color | undefined)
        }
        envMapIntensity={0.15}
      />
    </mesh>
  );
}

function Boxes() {
  const [boxes] = useState(() => {
    const a = [];
    for (let i = 0; i < 100; i++) a.push(0);
    return a;
  });

  return (
    <>
      {boxes.map((_, i) => (
        <Box key={i} color={i % 2 === 0 ? [0.4, 0.1, 0.1] : [0.05, 0.15, 0.4]} />
      ))}
    </>
  );
}

export default Boxes;
