/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Nebula({ 
  position = [0, 0, 0], 
  scale = 1, 
  color = "#ffcc00",   // Amarelo padrão
  opacity = 0.03,      // Suavidade
  count = 40,          // Quantidade de nuvens
  spread = 20          // O quanto ela se espalha
}) {
  const group = useRef()
  
  const clouds = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * (spread * 0.5), // Um pouco mais achatada no eixo Y
          (Math.random() - 0.5) * spread
        ],
        size: (spread / 5) + Math.random() * (spread / 3),
        rotation: Math.random() * Math.PI
      })
    }
    return temp
  }, [count, spread]) // Recalcula se o count ou spread mudarem

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2 // Rotação bem lenta
    }
  })

  return (
    <group ref={group} position={position} scale={scale}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.size, 16, 16]} />
          <meshBasicMaterial
            color={color} // 🎨 Cor via parâmetro
            transparent
            opacity={opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}