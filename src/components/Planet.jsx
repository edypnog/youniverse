import { useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Html } from '@react-three/drei'

export default function Planet({
  size,
  texture,
  speed,
  distance,
  children,
  ring = false
}) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  const map = useLoader(TextureLoader, texture)

  useFrame(({ clock }) => {
    if (distance > 0) {
      ref.current.position.x =
        Math.sin(clock.elapsedTime * speed) * distance
      ref.current.position.z =
        Math.cos(clock.elapsedTime * speed) * distance
    }
    ref.current.rotation.y += 0.0015
  })

  return (
    <group
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={map} />
      </mesh>

      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 2, 64]} />
          <meshStandardMaterial
            color="#d4c4a8"
            side={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}

      {hovered && (
        <Html center>
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
            
          </div>
        </Html>
      )}
      {children}
    </group>
  )
}
