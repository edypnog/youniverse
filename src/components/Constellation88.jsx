import { Line, Html } from '@react-three/drei'

const K = [
  [-8, 4, -45],
  [-8, 2, -45],
  [-8, 0, -45],
  [-8, -2, -45],
  [-8, -4, -45],

  [-6, 1, -45],
  [-5, 2, -45],

  [-6, -1, -45],
  [-5, -2, -45],
]

const E = [
  [-2, 4, -45],
  [-2, 2, -45],
  [-2, 0, -45],
  [-2, -2, -45],
  [-2, -4, -45],

  [0, 4, -45],
  [0, 0, -45],
  [0, -4, -45],
]

export default function ConstellationKE() {
  return (
    <group rotation={[0.1, -0.25, 0]}>
      {[...K, ...E].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color="#e6f1ff" />
        </mesh>
      ))}

      {/* linhas K */}
      <Line points={K} color="white" lineWidth={1} opacity={0.5} />

      {/* linhas E */}
      <Line points={E} color="white" lineWidth={1} opacity={0.5} />

      <Html position={[-4, -6, -45]} center>
        <div style={{
          color: 'white',
          fontSize: '12px',
          opacity: 0.6,
          letterSpacing: '3px'
        }}>
          K ✦ E
        </div>
      </Html>
    </group>
  )
}
