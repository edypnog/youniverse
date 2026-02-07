import { useState, useEffect, useRef } from "react";

export default function useAudioPulse(audioRef) {
  // Agora retornamos um objeto com grave e agudo
  const [pulse, setPulse] = useState({ bass: 0, treble: 0 });
  
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  
  // Refs para suavização independente
  const lastBass = useRef(0);
  const lastTreble = useRef(0);

  useEffect(() => {
    const update = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // --- 1. CÁLCULO DOS GRAVES (BASS) ---
        let bassSum = 0;
        const bassBins = 6; // Frequências bem baixas
        for (let i = 0; i < bassBins; i++) {
          bassSum += dataArrayRef.current[i];
        }
        let bassAvg = (bassSum / bassBins / 255) * 1.2;
        if (bassAvg > 1) bassAvg = 1;

        // Suavização do Grave
        if (bassAvg > lastBass.current) lastBass.current = bassAvg;
        else lastBass.current *= 0.88;

        // --- 2. CÁLCULO DOS AGUDOS (TREBLE/MID) ---
        let trebleSum = 0;
        // Pegamos frequências mais altas (do meio para o fim do array)
        const startBin = 15; 
        const endBin = 40;
        for (let i = startBin; i < endBin; i++) {
          trebleSum += dataArrayRef.current[i];
        }
        let trebleAvg = (trebleSum / (endBin - startBin) / 255) * 2.0; // Boost no agudo pois ele é mais fraco
        if (trebleAvg > 1) trebleAvg = 1;

        // Suavização do Agudo (mais rápida para ser frenética)
        if (trebleAvg > lastTreble.current) lastTreble.current = trebleAvg;
        else lastTreble.current *= 0.82;

        setPulse({
          bass: lastBass.current,
          treble: lastTreble.current
        });
      }
      animationRef.current = requestAnimationFrame(update);
    };

    const setup = () => {
      if (!audioRef.current || analyserRef.current) return;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256; // Aumentei um pouco para ter mais divisões de agudo
      analyser.smoothingTimeConstant = 0.3;

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