import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'

const R = 85
const degToRad = (d) => (d * Math.PI) / 180

// Função para converter coordenadas celestes (RA/Dec) em posição 3D
const toSphere = (ra, dec) => {
  const raRad = degToRad(ra)
  const decRad = degToRad(dec)
  // Invertemos o X para alinhar com a visão da Terra (RA cresce para a esquerda)
  return new THREE.Vector3(
    -R * Math.cos(decRad) * Math.cos(raRad),
    R * Math.sin(decRad),
    R * Math.cos(decRad) * Math.sin(raRad)
  )
}

// 1. Dados Reais das Estrelas de Leão (Aproximados para visual)
// RA (Ascensão Reta) e Dec (Declinação)
const stars = {
  regulus:  { ra: 152.0, dec: 12.0, name: "Regulus" }, // Coração/Pata
  eta:      { ra: 151.0, dec: 17.0, name: "Eta Leonis" },
  algieba:  { ra: 155.0, dec: 20.0, name: "Algieba" }, // Pescoço
  adhafera: { ra: 154.0, dec: 24.0, name: "Adhafera" }, // Juba
  rasalas:  { ra: 149.0, dec: 26.0, name: "Rasalas" }, // Ponta da cabeça
  zosma:    { ra: 169.0, dec: 21.0, name: "Zosma" },   // Costas
  chertan:  { ra: 169.0, dec: 16.0, name: "Chertan" }, // Pata traseira
  denebola: { ra: 177.0, dec: 15.0, name: "Denebola" } // Cauda
}

// Convertendo todas as estrelas para vetores 3D
const starPoints = Object.fromEntries(
  Object.entries(stars).map(([key, data]) => [key, toSphere(data.ra, data.dec)])
)

// 2. Definindo os caminhos das linhas para igualar a imagem
// Caminho do Corpo: Cauda -> Costas -> Pescoço -> Peito -> Coração -> Pata Traseira -> Cauda
const bodyPath = [
  starPoints.denebola,
  starPoints.zosma,
  starPoints.algieba,
  starPoints.eta,
  starPoints.regulus,
  starPoints.chertan,
  starPoints.denebola // Fecha o ciclo
]

// Caminho da Cabeça (A Foice): Pescoço -> Juba -> Topo
const headPath = [
  starPoints.algieba,
  starPoints.adhafera,
  starPoints.rasalas
]

export default function ConstellationLeo() {
  return (
    <group rotation={[0, -Math.PI / 2, 0]}> {/* Rotação para centralizar na camera */}
      
      {/* Renderiza todas as estrelas */}
      {Object.values(starPoints).map((pos, i) => (
        <mesh key={i} position={pos}>
          {/* Estrelas principais um pouco maiores */}
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
      ))}

      {/* Estrela Principal (Regulus) com destaque */}
      <mesh position={starPoints.regulus}>
         <sphereGeometry args={[0.4, 16, 16]} />
         <meshBasicMaterial color="#b3e5fc" /> {/* Levemente azulada como na realidade */}
      </mesh>

      {/* Linha do Corpo */}
      <Line
        points={bodyPath}
        color="#ffd54f"
        lineWidth={1.5}
        opacity={0.6}
        transparent
      />

      {/* Linha da Cabeça */}
      <Line
        points={headPath}
        color="#ffd54f"
        lineWidth={1.5}
        opacity={0.6}
        transparent
      />

      {/* Label na estrela principal */}
      <Html position={starPoints.regulus} distanceFactor={10}>
        <div style={{
          color: '#ffd54f',
          fontFamily: 'Arial',
          fontSize: '14px',
          fontWeight: 'bold',
          transform: 'translate3d(10px, 10px, 0)',
          textShadow: '0px 0px 4px black'
        }}>
        </div>
      </Html>
    </group>
  )
}