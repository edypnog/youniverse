import { Line, Html } from '@react-three/drei'

const R = 85

const capricorn = [
  [25, 15],   // topo direito
  [22, 5],
  [20, -5],
  [18, -15],
  [15, -20],  // base
  [8, -15],
  [5, -10],
  [2, -5],
  [0, 0],     // meio esquerdo
  [10, 2],
  [18, 8],
  [25, 15],   // fecha no topo
]

const degToRad = (d) => (d * Math.PI) / 180

const toSphere = ([ra, dec]) => {
  const raRad = degToRad(ra)
  const decRad = degToRad(dec)

  return [
    R * Math.cos(decRad) * Math.cos(raRad),
    R * Math.sin(decRad),
    R * Math.cos(decRad) * Math.sin(raRad),
  ]
}

const points = capricorn.map(toSphere)

export default function ConstellationCapricorn() {
  return (
    <group>
      {/* estrelas */}
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#7DB3FF" />
        </mesh>
      ))}

      {/* linhas */}
      <Line
        points={points}
        color="#7DB3FF"
        lineWidth={1}
        opacity={0.7}
      />

      {/* label */}
      <Html position={points[0]}>
        <div style={{ color: '#7DB3FF', fontSize: 12, opacity: 0.8 }}>
          
        </div>
      </Html>
    </group>
  )
}
