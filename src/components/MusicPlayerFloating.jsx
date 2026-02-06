// components/MusicPlayerFloating.jsx
import MusicPlayer from './MusicPlayer'

export default function MusicPlayerFloating() {
  // Isso impede que cliques no player interfiram no universo 3D
  const stop = (e) => e.stopPropagation()

  return (
    <div
      onPointerDown={stop}
      onPointerMove={stop}
      onPointerUp={stop}
      className="music-wrapper" 
    >
      <MusicPlayer />
    </div>
  )
}