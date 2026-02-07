import { useRef, useState, useEffect, useCallback } from "react";
import "./MusicPlayer.css";

import mute from "../assets/mute.svg"
import next from "../assets/next.svg"
import play from "../assets/play.svg"
import prev from "../assets/prev.svg"
import repeatIcon from "../assets/repeat.svg"
import pause from "../assets/pause.svg"
import minimizebtn from "../assets/minimizebtn.svg"
import expandbtn from "../assets/expandbtn.svg"

import useAudioPulse from "../hooks/useAudioPulse"


const playlist = [
  { title: "wave", file: "/music/Wave.mp3" },
  { title: "altar", file: "/music/altar.mp3" },
  { title: "suas linhas", file: "/music/suaslinhas.mp3" },
  { title: "light", file: "/music/light.mp3" },
  { title: "good days", file: "/music/gooddays.mp3" },
  { title: "escape", file: "/music/escape.mp3" },
  { title: "nervous", file: "/music/nervous.mp3" },
  { title: "over 85", file: "/music/over85.mp3" },
  { title: "te vivo", file: "/music/tevivo.mp3" },
  { title: "snooze", file: "/music/snooze.mp3" },
  { title: "butterflies", file: "/music/butterflies.mp3" },
  { title: "saturn", file: "/music/Saturn.mp3" },
  { title: "somebody", file: "/music/SOMEBODY.mp3" },
  { title: "my obsession", file: "/music/myobsession.mp3" },
  { title: "mine", file: "/music/mine.mp3" },
  { title: "tainted", file: "/music/tainted.mp3" },
  { title: "paraíso", file: "/music/paraiso.mp3" },
  { title: "um amor puro", file: "/music/umamorpuro.mp3" },
  { title: "after hours", file: "/music/afterhours.mp3" },
  { title: "why don't you stay", file: "/music/whydontyoustay.mp3" },
  { title: "my you", file: "/music/myyou.mp3" },
  { title: "intentions", file: "/music/intentions.mp3" },
  { title: "nobody gets me", file: "/music/nobodygetme.mp3" },
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


  const playNext = useCallback(() => {
  if (isTransitioning.current) return;
  isTransitioning.current = true;

  fadeTo(0, () => {
    setCurrent((prev) => (prev + 1) % playlist.length);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setPlaying(true);
        fadeTo(muted ? 0 : volume, () => {
          isTransitioning.current = false;
        });
      }
    }, 150);
  });
}, [volume, muted]);

const playPrev = () => {
  if (isTransitioning.current) return;
  isTransitioning.current = true;

  fadeTo(0, () => {
    setCurrent((prev) => (prev - 1 + playlist.length) % playlist.length);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setPlaying(true);
        fadeTo(muted ? 0 : volume, () => {
          isTransitioning.current = false;
        });
      }
    }, 150);
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

  // const restart = () => {
  //   audioRef.current.currentTime = 0;
  //   audioRef.current.play();
  //   setPlaying(true);
  // };

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
          boxShadow: `
          0 0 ${2 + pulse * 10}px rgba(255, 230, 0, ${0.3 + pulse * 0.7}), /* Amarelo Interno */
          0 0 ${3 + pulse * 70}px rgba(0, 110, 255, ${0.2 + pulse * 0.6})  /* Azul Externo */
          `,
          border: `${1 + pulse * 2}px solid rgba(255, 255, 255, ${0.1 + pulse * 0.4})`,
          opacity: 0.6 + pulse * 0.4,
          transform: `scale(${1 + pulse * 0.003})`,
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
          {minimized ? <img src={expandbtn} alt="Expandir" className="icon-white" /> : <img src={minimizebtn} alt="Minimizar" className="icon-white" />}
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
        {/* Botão Anterior */}
        <button onClick={playPrev} title="Anterior">
          <img src={prev} alt="Anterior" className="icon-white" />
        </button>

        {/* Play / Pause */}
        <button onClick={togglePlay} className="play-btn-circle">
          <img 
            src={playing ? pause : play} 
            alt="Play/Pause" 
            className="icon-white" 
            style={{ marginLeft: playing ? "0" : "3px" }} // Ajuste óptico para o ícone de play
          />
        </button>

        {/* Próximo */}
        <button onClick={playNext} title="Próximo">
          <img src={next} alt="Próximo" className="icon-white" />
        </button>

        {/* Repetir */}
        <button
          className={repeat ? "active" : ""}
          onClick={() => setRepeat(!repeat)}
          title="Repeat"
        >
          <img src={repeatIcon} alt="Repetir" className="icon-white" />
        </button>

        {/* Mute */}
        <button
          className={muted ? "active" : ""}
          onClick={toggleMute}
          title="Mute"
        >
          <img src={mute} alt="Mudo" className="icon-white" />
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
