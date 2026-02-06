/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ShootingStar({ color }) {
  const mesh = useRef()
  
  // Criamos uma trajetória aleatória para cada estrela
  const track = useMemo(() => ({
    speed: 0.5 + Math.random() * 1.5,
    // Começa em um lugar aleatório bem longe
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 400
    ),
    // Direção do voo
    dir: new THREE.Vector3(-1, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5).normalize()
  }), [])

  useFrame((state, delta) => {
    if (!mesh.current) return

    // Move a estrela
    mesh.current.position.addScaledVector(track.dir, track.speed)
    
    // Se a estrela for muito longe, reseta a posição para criar um loop infinito
    if (mesh.current.position.length() > 500) {
      mesh.current.position.set(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      )
    }
    
    // Faz a estrela "olhar" para onde está indo para o rastro ficar certo
    mesh.current.lookAt(
      mesh.current.position.clone().add(track.dir)
    )
  })

  return (
    <mesh ref={mesh} position={track.pos}>
      {/* Uma geometria de "agulha" (comprida e fina) */}
      <boxGeometry args={[0.05, 0.05, 4]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
      />
    </mesh>
  )
}

export default function ShootingStars() {
  // Criamos 15 estrelas amarelas e 15 azuis
  const stars = useMemo(() => {
    const arr = []
    for (let i = 0; i < 15; i++) arr.push({ id: `y-${i}`, color: "#FFE600" })
    for (let i = 0; i < 15; i++) arr.push({ id: `b-${i}`, color: "#006EFF" })
    return arr
  }, [])

  return (
    <group>
      {stars.map(star => (
        <ShootingStar key={star.id} color={star.color} />
      ))}
    </group>
  )
}