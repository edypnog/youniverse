import { motion as Motion } from "framer-motion"
import "./WelcomeScreen.css"


export default function WelcomeScreen({ onEnter }) {
  return (
    <Motion.div
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* Estrelas */}
      <div className="stars" />
      <div className="stars stars2" />
      <div className="stars stars3" />

      {/* Conteúdo */}
      <Motion.div
        className="welcome-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <h1 className="welcome-title">
          <span>(U)</span>NIVERSE
        </h1>

        <p className="welcome-subtitle">
          onde tudo que existe faz sentido<br />
          porque existe <span style={{color: "#815EFF", fontWeight: "bold", fontStyle: "italic"}}>você.</span>
        </p>

        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="welcome-button"
        >
          entrar no nosso universo ✨
        </Motion.button>
      </Motion.div>
    </Motion.div>
  )
}
