/* eslint-disable react-hooks/purity */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Galaxy() {
  const ref = useRef()

  const points = []
  const arms = 3
  const count = 5000

  for (let i = 0; i < count; i++) {
    const arm = i % arms
    const angle = (i / count) * Math.PI * 6 + arm * (Math.PI * 2 / arms)
    const radius = Math.random() * 500

    points.push(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 2,
      Math.sin(angle) * radius
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(points, 3)
  )

  useFrame(() => {
    ref.current.rotation.y += 0.0003
  })

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial size={0.05} color="#ffffff" />
    </points>
  )
}
