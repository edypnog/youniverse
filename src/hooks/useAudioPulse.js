import { useState, useEffect, useRef } from "react";

export default function useAudioPulse(audioRef) {
  const [pulse, setPulse] = useState(0);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const lastPulse = useRef(0); // Para suavizar a queda do pulso

  useEffect(() => {
    const update = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // 1. FOCO NOS GRAVES (BASS)
        // Pegamos apenas as primeiras barras da análise (frequências baixas)
        // Isso isola o bumbo (kick) e o baixo da música.
        let bassSum = 0;
        const bassBins = 4; // Analisamos apenas as 4 primeiras frequências
        for (let i = 0; i < bassBins; i++) {
          bassSum += dataArrayRef.current[i];
        }
        const bassAvg = bassSum / bassBins;

        // 2. SENSIBILIDADE E NORMALIZAÇÃO
        // Convertemos para 0 a 1 e damos um "boost" na sensibilidade
        let targetPulse = (bassAvg / 255) * 1.2; 
        if (targetPulse > 1) targetPulse = 1;

        // 3. SUAVIZAÇÃO (SMOOTHING)
        // Se o novo pulso for maior que o anterior, ele sobe rápido (ataque).
        // Se for menor, ele desce devagar (decay), evitando o efeito "tremido".
        if (targetPulse > lastPulse.current) {
          lastPulse.current = targetPulse;
        } else {
          lastPulse.current *= 0.85; // Controla a velocidade da queda (suavidade)
        }

        setPulse(lastPulse.current);
      }
      animationRef.current = requestAnimationFrame(update);
    };

    const setup = () => {
      if (!audioRef.current || analyserRef.current) return;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyser = audioContext.createAnalyser();
      
      // fftSize 128 ou 256 dá uma precisão melhor para graves
      analyser.fftSize = 128; 
      analyser.smoothingTimeConstant = 0.4; // Ajuda o próprio analyser a ser menos brusco

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      update();
    };

    window.addEventListener("click", setup, { once: true });
    window.addEventListener("touchstart", setup, { once: true });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("click", setup);
      window.removeEventListener("touchstart", setup);
    };
  }, [audioRef]);

  return pulse;
}