import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, Mesh, MeshStandardMaterial } from 'three';

function Rings() {
  const itemsRef = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    itemsRef.current.forEach((item, index) => {
      const mesh = itemsRef.current[index];

      // Position calculation for animated ring tunnel effect:
      // We have 14 rings (index 0-13) that need to create an infinite tunnel moving toward the camera
      //
      // Part 1: (index - 7) * 3.5
      //   - Centers the rings around index 7 (middle of 0-13)
      //   - Spaces them 3.5 units apart along the z-axis (depth)
      //   - Creates initial positions from -24.5 (far back) to 21 (far front)
      //
      // Part 2: ((elapsed * 0.4) % 3.5) * 2
      //   - elapsed * 0.4: time-based animation (slower = more smooth)
      //   - % 3.5: loops every 3.5 units to match ring spacing
      //   - * 2: doubles the offset to 7 units for seamless wrapping
      //
      // Result: Rings smoothly move forward, and when one passes the camera,
      // it wraps back to the far end, creating an endless tunnel effect
      const z = (index - 7) * 3.5 + ((elapsed * 0.4) % 3.5) * 2;

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
