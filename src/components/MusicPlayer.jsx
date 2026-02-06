import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";


import useAudioPulse from "../hooks/useAudioPulse"


const playlist = [
  { title: "escape", file: "/music/escape.mp3" },
  { title: "suas linhas", file: "/music/suaslinhas.mp3" },
  { title: "light", file: "/music/light.mp3" },
  { title: "good days", file: "/music/gooddays.mp3" },
  { title: "nervous", file: "/music/nervous.mp3" },
  { title: "over 85", file: "/music/over85.mp3" },
  { title: "tainted", file: "/music/tainted.mp3" },
  { title: "snooze", file: "/music/snooze.mp3" },
  { title: "mine", file: "/music/mine.mp3" },
  { title: "butterflies", file: "/music/butterflies.mp3" },
  { title: "after hours", file: "/music/afterhours.mp3" },
  { title: "saturn", file: "/music/Saturn.mp3" },
]


const FADE_TIME = 1500; // ms
const CROSSFADE_THRESHOLD = 5;

export default function MusicPlayer() {
  
  const audioRef = useRef(null);
  const fadeInterval = useRef(null);
  const lastVolume = useRef(0.7);
  const isTransitioning = useRef(false);


  const [current, setCurrent] = useState(
    Number(localStorage.getItem("music:index")) || 0
  );
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(
    Number(localStorage.getItem("music:volume")) || 0.7
  );
  const [repeat, setRepeat] = useState(
    localStorage.getItem("music:repeat") !== "false"
  );
  const [muted, setMuted] = useState(
    localStorage.getItem("music:muted") === "true"
  );

  const [minimized, setMinimized] = useState(false)

  const pulse = useAudioPulse(audioRef)



  /* ---------------- SYNC AUDIO ---------------- */

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = repeat;
  }, [repeat]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  /* ---------------- LOCAL STORAGE ---------------- */

  useEffect(() => {
    localStorage.setItem("music:index", current);
    localStorage.setItem("music:volume", volume);
    localStorage.setItem("music:repeat", repeat);
    localStorage.setItem("music:muted", muted);
  }, [current, volume, repeat, muted]);

  /* ---------------- CROSSFADE ---------------- */

  const fadeTo = (targetVolume, callback) => {
    clearInterval(fadeInterval.current);
    const audio = audioRef.current;
    const step = 20;
    const delta = (targetVolume - audio.volume) / (FADE_TIME / step);

    fadeInterval.current = setInterval(() => {
      audio.volume = Math.max(0, Math.min(1, audio.volume + delta));

      if (
        (delta > 0 && audio.volume >= targetVolume) ||
        (delta < 0 && audio.volume <= targetVolume)
      ) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval.current);
        callback?.();
      }
    }, step);
  };

  /* ---------------- CONTROLS ---------------- */

  const playNext = () => {
  if (isTransitioning.current) return;
  isTransitioning.current = true;

  // Fade out da música atual
    fadeTo(0, () => {
      setCurrent((prev) => (prev + 1) % playlist.length);
      
      // Pequeno delay para o state do 'current' atualizar e o áudio carregar o novo src
      setTimeout(() => {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        // Fade in da nova música
        fadeTo(muted ? 0 : volume, () => {
          isTransitioning.current = false;
        });
      }, 100);
    });
  };

  const togglePlay = () => {
    if (!playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setPlaying(!playing);
  };

  const restart = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setPlaying(true);
  };

  const toggleMute = () => {
    if (!muted) {
      lastVolume.current = volume;
      setMuted(true);
    } else {
      setMuted(false);
      setVolume(lastVolume.current || 0.7);
    }
  };

  const selectMusic = (index) => {
    if (index === current || isTransitioning.current) return;

    isTransitioning.current = true;
    fadeTo(0, () => {
      setCurrent(index);
      setTimeout(() => {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        fadeTo(muted ? 0 : volume, () => {
          isTransitioning.current = false;
        });
        setPlaying(true);
      }, 150);
    });
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // LÓGICA DE CROSSFADE AUTOMÁTICO
      const timeLeft = audio.duration - audio.currentTime;
      
      // Se faltar 5 segundos e não estivermos em transição
      if (audio.duration > 0 && timeLeft <= CROSSFADE_THRESHOLD && !isTransitioning.current && !repeat) {
        playNext();
      }
    };

    const handleEnded = () => {
      // Caso a música acabe abruptamente ou o repeat esteja ligado
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [volume, muted, repeat, current, playNext]); // Adicione as dependências para a lógica de playNext funcionar aqui

  // Função para formatar segundos em 00:00
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="music-wrapper">
      <div
        className="music-glow"
        style={{
          opacity: pulse,
          boxShadow: `
            0 0 ${30 + pulse * 60}px rgba(138,92,255,0.6),
            inset 0 0 ${20 + pulse * 40}px rgba(0,255,213,0.4)
          `
        }}
      />
      <div
        className="music-glass"
      >
        
        <audio ref={audioRef} src={playlist[current].file} preload="none" />

        <div className="player-header">
        <h3>{playlist[current].title}</h3>

        <button
          className="minimize-btn"
          onClick={() => setMinimized(!minimized)}
          title={minimized ? "Expandir" : "Minimizar"}
        >
          {minimized ? "🔼" : "🔽"}
        </button>
      </div>

        {!minimized && (
    <>
      {/* BARRA DE PROGRESSO MODERNA */}
            <div className="seek-container">
              <input
                type="range"
                className="seek-bar"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  background: `linear-gradient(to right, #8a5cff ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`
                }}
              />
              <div className="time-info">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>  
      <div className="controls">
        <button onClick={restart}>⏮</button>

        <button onClick={togglePlay}>
          {playing ? "⏸" : "▶️"}
        </button>

        <button
          className={repeat ? "active" : ""}
          onClick={() => setRepeat(!repeat)}
          title="Repeat"
        >
          🔁
        </button>

        <button
          className={muted ? "active" : ""}
          onClick={toggleMute}
          title="Mute"
        >
          🔇
        </button>
      </div>

      <div className="volume">
        🔊
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={(e) => {
            setMuted(false)
            setVolume(Number(e.target.value))
          }}
        />
      </div>

      <ul className="playlist">
        {playlist.map((song, i) => (
          <li
            key={i}
            className={i === current ? "active" : ""}
            onClick={() => selectMusic(i)}
          >
            {song.title}
          </li>
        ))}
      </ul>
    </>
  )}

      </div>
    </div>
  );
}
