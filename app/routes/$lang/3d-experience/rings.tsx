import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, Mesh, MeshStandardMaterial } from 'three';

function Rings() {
  const itemsRef = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    itemsRef.current.forEach((item, index) => {
      const mesh = itemsRef.current[index];

      // [-7, 6]
      // 0 is center, negative is behind, positive is in front
      // multiply by 3.5 to get spacing
      const z = (index - 7) * 3.5;

      // Move the rings towards the camera
      if (mesh) mesh.position.set(0, 0, -z);

      // Distance from the center (z=0)
      const dist = Math.abs(z);

      // Scale the rings based on their distance from the center
      // Rings further away are smaller, rings closer are larger
      // Each ring is moved forward/backward along the camera axis
      // by computing z from the ring's index.
      // The ring's scale is reduced smoothly as it moves away from the center.
      // This creates a nice depth effect as the rings move.
      // The scale is clamped to a minimum value to avoid disappearing.
      const scale = 1 / (1 + 0.1 * dist); // Adjust the multiplier for different scaling effects
      // Ensure the scale does not go below a certain threshold
      // to keep the rings visible.
      if (mesh) mesh.scale.set(scale, scale, scale);

      // Change emissive color based on distance
      let colorScale = 1;

      // Start dimming the color after a distance of 2 units
      if (dist > 2) {
        colorScale = 1 - (Math.min(dist, 12) - 2) / 10;
      }

      // Further reduce brightness for rings that are very far away
      colorScale *= 0.5;

      // Safely set emissive only when the material is a single meshStandardMaterial
      if (mesh && !Array.isArray(mesh.material)) {
        const mat = mesh.material as MeshStandardMaterial;
        const color =
          index % 2 === 1
            ? new Color(6, 0.15, 0.7).multiplyScalar(colorScale)
            : new Color(0.1, 0.7, 3).multiplyScalar(colorScale);
        if ('emissive' in mat) {
          mat.emissive.copy(color);
        }
      }
    });
  });

  return (
    <>
      {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((v, index) => (
        <mesh
          castShadow
          receiveShadow
          position={[0, 0, 0]}
          key={index}
          ref={(el) => {
            itemsRef.current[index] = el;
          }}
        >
          <torusGeometry args={[3.35, 0.05, 16, 100]} />
          <meshStandardMaterial emissive={[0.5, 0.5, 0.5]} color={[0, 0, 0]} />
        </mesh>
      ))}
    </>
  );
}

export default Rings;
