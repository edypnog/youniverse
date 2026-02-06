import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import Universe from './scenes/Universe'
import MusicPlayerFloating from './components/MusicPlayerFloating'
import { AnimatePresence } from 'framer-motion'

export default function App() {
  const [entered, setEntered] = useState(false)

  return (
    <div className="w-full h-full">
      <AnimatePresence>
        {!entered && <WelcomeScreen onEnter={() => setEntered(true)} />}
      </AnimatePresence>
      {entered && (
        <>
          <Universe />
          {/* HUD FIXO */}
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 9999,
              pointerEvents: "auto"
            }}/>
        </>
      )}
    </div>
  )
}
