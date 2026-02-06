import { useFrame } from '@react-three/fiber'

export default function CinematicCamera() {
  useFrame((state) => {
    // 1. Definimos a velocidade (0.1 é bem lento e elegante)
    const time = state.clock.getElapsedTime() * 0.1 
    
    // 2. Calculamos a distância oscilante
    // No exemplo abaixo, a câmera vai flutuar entre 30 e 90 de distância
    // O 60 é o ponto médio, e o 30 é o quanto ela se afasta/aproxima
    const distance = 50 + Math.sin(time) * 30 
    
    // 3. Aplicamos a distância à câmera sem perder a rotação do OrbitControls
    state.camera.position.setLength(distance)
    state.camera.updateProjectionMatrix()
  })

  return null
}