import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import Planet from '../components/Planet'
import Galaxy from '../components/Galaxy'
import sun from '../assets/textures/sun.jpg'
import moon from '../assets/textures/moon.jpg'
import mercury from '../assets/textures/mercury.jpg'
import venus from '../assets/textures/venus.jpg'
import earth from '../assets/textures/earth.jpg'
import mars from '../assets/textures/mars.jpg'
import jupiter from '../assets/textures/jupiter.jpg'
import saturn from '../assets/textures/saturn.jpg'
import uranus from '../assets/textures/uranus.jpg'
import neptune from '../assets/textures/neptune.jpg'
import pluto from '../assets/textures/pluto.jpg'

import ConstellationLeo from '../components/ConstellationLeo'
import ConstellationCapricorn from '../components/ConstellationCapricorn'
import MusicPlayerFloating from '../components/MusicPlayerFloating'
import Nebula from '../components/Nebula'


export default function Universe() {
  return (
    <Canvas
      camera={{ position: [0, 8, 18], fov: 55 }}
      gl={{ antialias: true }}
      style={{
        width: '100vw',
        height: '100vh',
        touchAction: 'none' // 🔑 ABSOLUTO
      }}
    >
      {/* Luzes cinematográficas */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#fff5cc" />

      {/* Céu */}
      <Stars
        radius={300}
        depth={100}
        count={15000}
        factor={4}
        saturation={0}
        fade
      />

      {/* Constelação */}
      <ConstellationCapricorn />

      {/* Galáxia */}
      <Galaxy />

      <ConstellationLeo />

      {/* Sistema solar — escala proporcional realista */}
      <Planet
        name="Sol"
        size={5}
        texture={sun}
        speed={0}
        distance={0}
      >
        <pointLight
          intensity={4}
          distance={200}
          decay={2}
          color="#fff5cc"
        />
      </Planet>

      <Planet
        name="Mercúrio"
        size={0.2}
        texture={mercury}
        speed={0.6}
        distance={9}
      />

      <Planet
        name="Vênus"
        size={0.47}
        texture={venus}
        speed={0.3}
        distance={12}
      />

      <Planet
        name="Terra"
        size={0.5}
        texture={earth}
        speed={0.2}
        distance={15}
      >
        <Planet
          name="Lua"
          size={0.20}
          texture={moon}
          speed={0.8}
          distance={1.2}
          rotation={[0.1, 0, 0]}
        />
      </Planet>

      

      <Planet
        name="Marte"
        size={0.3}
        texture={mars}
        speed={0.2}
        distance={19}
      />

      <Planet
        name="Júpiter"
        size={5.6}
        texture={jupiter}
        speed={0.2}
        distance={26}
      />

      <Planet
        name="Saturno"
        size={4.7}
        texture={saturn}
        speed={0.1}
        distance={42}
        ring
      />

      <Planet
        name="Urano"
        size={2.0}
        texture={uranus}
        speed={0.3}
        distance={54}
      />

      <Planet
        name="Netuno"
        size={1.9}
        texture={neptune}
        speed={0.2}
        distance={60}
      />

      <Planet
        name="Plutão"
        size={0.3}
        texture={pluto}
        speed={0.1}
        distance={70}
      />

      <OrbitControls
        makeDefault
        enableRotate={true}
        enableZoom={true}
        enablePan={true}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8} // Reduzi um pouco para ficar mais suave no mobile
        zoomSpeed={1.2}
        
        // Configuração recomendada para mobile:
        touches={{
          ONE: 0, // Um dedo: ROTACIONAR (o padrão que todo mundo espera)
          TWO: 2  // Dois dedos: PINÇA para ZOOM e ARRASTAR para PAN
        }}
      />

        <Nebula 
          position={[60, 10, -20]} 
          color="#FBE948" 
          count={30} 
          spread={50} 
        />

        {/* Nebulosa Azul/Violeta ao longe */}
        <Nebula 
          position={[-80, 10, -40]} 
          color="#4400ff" 
          opacity={0.02} 
          scale={2} 
        />


      <MusicPlayerFloating />
    </Canvas>
  )
}
