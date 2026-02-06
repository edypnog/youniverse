import { useEffect, useRef, useState } from "react"

export default function useAudioPulse(audioRef) {
  const [pulse, setPulse] = useState(0)

  const analyserRef = useRef(null)
  const dataRef = useRef(null)
  const rafRef = useRef(null)

  const lastBeatRef = useRef(0)
  const energyRef = useRef(0)

  useEffect(() => {
    if (!audioRef?.current) return

    const audio = audioRef.current
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    const source = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()

    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.6

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    source.connect(analyser)
    analyser.connect(ctx.destination)

    analyserRef.current = analyser
    dataRef.current = dataArray

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)

      analyser.getByteFrequencyData(dataArray)

      // 🔥 SUB-GRAVES (kick)
      const bassBins = dataArray.slice(1, 12)
      const bassEnergy =
        bassBins.reduce((a, b) => a + b, 0) / bassBins.length

      // normaliza
      const normalized = bassEnergy / 255

      // pico (beat)
      if (normalized > lastBeatRef.current * 1.15 && normalized > 0.25) {
        energyRef.current = 1
      }

      lastBeatRef.current =
        lastBeatRef.current * 0.9 + normalized * 0.1

      // decay suave
      energyRef.current *= 0.85

      setPulse(energyRef.current)
    }

    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ctx.close()
    }
  }, [audioRef])

  return pulse
}
