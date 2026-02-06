/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function NeighboringGalaxy({ 
  position = [100, 50, -150], 
  colorInside = "#ff6030", 
  colorOutside = "#1b3984",
  count = 10000 
}) {
  const points = useRef()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const colorInsideObj = new THREE.Color(colorInside)
    const colorOutsideObj = new THREE.Color(colorOutside)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Raio e Argumento (Espiral)
      const radius = Math.random() * 40
      const spinAngle = radius * 0.2
      const branchAngle = ((i % 3) * Math.PI * 2) / 3 // 3 Braços da galáxia

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius)
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius)
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius)

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      pos[i3 + 1] = randomY // Achatamento da galáxia
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Cores (Degradê do centro para fora)
      const mixedColor = colorInsideObj.clone()
      mixedColor.lerp(colorOutsideObj, radius / 40)

      col[i3] = mixedColor.r
      col[i3 + 1] = mixedColor.g
      col[i3 + 2] = mixedColor.b
    }

    return [pos, col]
  }, [count, colorInside, colorOutside])

  useFrame((state, delta) => {
    points.current.rotation.y += delta * 0.05 // Rotação bem lenta
  })

  return (
    <points ref={points} position={position} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.8}
      />
    </points>
  )
}