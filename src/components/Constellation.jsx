import { Line, Html } from '@react-three/drei'
import { useState } from 'react'

export default function Constellation({ name, points }) {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <Line
        points={points}
        color="white"
        lineWidth={1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {hovered && (
        <Html position={points[0]} center>
          <div className="text-xs text-white bg-black/60 px-2 py-1 rounded">
            {name}
          </div>
        </Html>
      )}
    </>
  )
}
