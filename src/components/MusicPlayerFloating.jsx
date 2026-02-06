import { Html } from '@react-three/drei'
import MusicPlayer from './MusicPlayer'

export default function MusicPlayerFloating() {
  const stop = (e) => e.stopPropagation()

  

  return (
    <Html fullscreen zIndexRange={[100, 0]}>
      <div
        onPointerDown={stop}
        onPointerMove={stop}
        onPointerUp={stop}
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          pointerEvents: 'auto'
        }}
      >
        <MusicPlayer />
      </div>
    </Html>
  )
}
