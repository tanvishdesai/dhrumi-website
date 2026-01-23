"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useSettings } from "@/hooks/useSettings";

// Wireframe Sphere Component
function WireframeSphere() {
  const meshRef = useRef<THREE.LineSegments>(null);
  const { settings } = useSettings();
  const { meridians, parallels, lineWidth } = settings.globe;

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(2, meridians, parallels);
    return new THREE.WireframeGeometry(geo);
  }, [meridians, parallels]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xffffff, // White/Chrome look
      linewidth: lineWidth,
      transparent: true,
      opacity: 0.15, // More subtle
    });
  }, [lineWidth]);

  return <lineSegments ref={meshRef} geometry={geometry} material={material} />;
}

// Inner Sphere for depth (Optional black core to hide back lines slightly)
function InnerSphere() {
    return (
        <mesh>
            <sphereGeometry args={[1.95, 32, 32]} />
            <meshBasicMaterial color="black" transparent opacity={0.9} />
        </mesh>
    )
}


// Rotating text around the globe
function RotatingText() {
  const groupRef = useRef<THREE.Group>(null);
  const { settings } = useSettings();

  const text = "SOFTWARE ENGINEER THE BEST DEFENSE IS BUILT ON A DEEP UNDERSTANDING OF OFFENSE — SENIOR RESEARCHER — ";

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z -= delta * 0.1; // Rotate around Z axis for the ring effect
    }
  });

  // Create text segments around the ring
  const textSegments = useMemo(() => {
    const segments = [];
    const radius = 3.2; // Larger radius for the ring
    const chars = text.split("");
    const anglePerChar = (2 * Math.PI) / chars.length;

    for (let i = 0; i < chars.length; i++) {
        const angle = i * anglePerChar;
        // Position explicitly on a circle in the XY plane
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        segments.push({
            char: chars[i],
            position: [x, y, 0] as [number, number, number],
            // Rotate the text to face outward or align with the ring
            rotation: [0, 0, angle - Math.PI / 2] as [number, number, number], 
        });
    }

    return segments;
  }, [text]);

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}> 
      {textSegments.map((segment, index) => (
        <Text
          key={index}
          position={segment.position}
          rotation={segment.rotation}
          fontSize={0.25}
          color="#555555" // Dark grey text
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.woff2"
          fontWeight={800}
        >
          {segment.char}
        </Text>
      ))}
    </group>
  );
}

// Main Globe scene with rotation
function GlobeScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { settings } = useSettings();
  const { mouse } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Auto rotation for the sphere itself
      groupRef.current.rotation.y += delta * settings.globe.rotationSpeed * 0.5;

      // Mouse influence
      const mouseSensitivity = settings.interaction.mouseSensitivity;
      targetRotation.current.x = mouse.y * mouseSensitivity * 0.2;
      targetRotation.current.y = mouse.x * mouseSensitivity * 0.2;

      // Smooth interpolation
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group>
        {/* The rotating text ring is separate from the sphere rotation to be stable or independently rotating */}
         <group rotation={[0, 0, Math.PI / 6]}> {/* Tilt the entire setup */}
            <RotatingText />
         </group>

        {/* Sphere Group */}
        <group ref={groupRef}>
            <WireframeSphere />
            <InnerSphere />
        </group>
    </group>
  );
}

// Post-processing effect for RGB shift (chromatic aberration)
function RGBShiftEffect() {
  // This would require custom shader implementation
  // For now, we'll skip this effect as it requires more complex setup
  return null;
}

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-[600px] w-full lg:h-[800px] flex items-center justify-center -mr-20"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4444ff" /> {/* Blueish tint */}
        <GlobeScene />
        <RGBShiftEffect />
      </Canvas>
    </div>
  );
}
