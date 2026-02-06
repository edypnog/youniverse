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
import NeighboringGalaxy from '../components/NeighboringGalaxy'
import CinematicCamera from '../components/CinematicCamera'
import ShootingStars from '../components/ShootingStars'


export default function Universe() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
          size={0.4}
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
          size={1}
          texture={earth}
          speed={0.2}
          distance={15}
        >
          <Planet
            name="Lua"
            size={0.6}
            texture={moon}
            speed={0.8}
            distance={2}
            rotation={[0.1, 0, 0]}
          />
        </Planet>

        

        <Planet
          name="Marte"
          size={0.5}
          texture={mars}
          speed={0.2}
          distance={24}
        />

        <Planet
          name="Júpiter"
          size={5.2}
          texture={jupiter}
          speed={0.5}
          distance={36}
        />

        <Planet
          name="Saturno"
          size={4.7}
          texture={saturn}
          speed={0.3}
          distance={48}
          ring
        />

        <Planet
          name="Urano"
          size={2.6}
          texture={uranus}
          speed={0.39}
          distance={54}
        />

        <Planet
          name="Netuno"
          size={3}
          texture={neptune}
          speed={0.2}
          distance={65}
        />

        <Planet
          name="Plutão"
          size={1}
          texture={pluto}
          speed={0.1}
          distance={78}
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

          autoRotate={true}         // Ativa o giro automático
          autoRotateSpeed={0.5}     // Velocidade do giro (0.5 a 1.0 é o ideal para espaço)
          
          // Configuração recomendada para mobile:
          touches={{
            ONE: 0, // Um dedo: ROTACIONAR (o padrão que todo mundo espera)
            TWO: 2  // Dois dedos: PINÇA para ZOOM e ARRASTAR para PAN
          }}
        />

        <CinematicCamera />

        <ShootingStars />

          <Nebula 
            position={[300, 10, -20]} 
            color="#888888" 
            count={50} 
            spread={100} 
          />

          {/* Nebulosa Azul/Violeta ao longe */}
          <Nebula 
            position={[-120, 10, -40]} 
            color="#3D4787" 
            opacity={0.02} 
            scale={2} 
          />

          <NeighboringGalaxy 
            position={[150, 40, -200]} 
            colorInside="#ffaa00" 
            colorOutside="#5500ff" 
            count={15000} 
          />

          <NeighboringGalaxy 
            position={[-200, -20, -100]} 
            colorInside="#00ffcc" 
            colorOutside="#D0FF00" 
            count={8000} 
          />

      </Canvas>
      
      <MusicPlayerFloating />
      

    </div>
  )
}
