import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/converterDurationToTimeString'

export function Player() {

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePLay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffling,
    clearPlayerState
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return <div className={styles.playerContainer}>

    <header>
      <img src="/playing.svg" alt="Tocando agora" />
      <strong>Tocando agora</strong>
    </header>

    {episode ?
      (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

    <footer className={!episode ? styles.empty : ''}>
      <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
        <div className={styles.slider} >
          {episode ?
            (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ background: '#04d361' }}
                railStyle={{ backgroundColor: ' #9f75ff' }}
                handleStyle={{ borderColor: '#84d361', borderWidth: 4 }} />
            ) :
            (
              <div className={styles.emptySlider}></div>
            )
          }
        </div>
        <span>
          {convertDurationToTimeString(episode?.duration ?? 0)}
        </span>
      </div>

      {episode && (
        <audio
          onLoadedMetadata={setupProgressListener}
          loop={isLooping}
          onEnded={handleEpisodeEnded}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          ref={audioRef}
          src={episode.url}
          autoPlay />
      )}

      <div className={styles.buttons}>
        <button
          onClick={() => toggleShuffling()}
          type="button"
          disabled={!episode || episodeList.length === 1}
          className={isShuffling ? styles.isActive : ''}>
          <img src="/shuffle.svg" alt="Embaralhar" />
        </button>

        <button
          onClick={() => playPrevious()}
          type="button"
          disabled={!episode || !hasPrevious}>
          <img src="/play-previous.svg" alt="Tocar anterior" />
        </button>

        <button
          onClick={() => togglePLay()}
          type="button"
          className={styles.playButton}
          disabled={!episode}>
          {isPlaying ? <img src="/pause.svg" alt="Tocar" /> : <img src="/play.svg" alt="Tocar" />}
        </button>

        <button
          onClick={() => playNext()}
          type="button"
          disabled={!episode || !hasNext}>
          <img src="/play-next.svg" alt="Tocar próxima" />
        </button>

        <button
          onClick={() => toggleLoop()}
          type="button"
          disabled={!episode}
          className={isLooping ? styles.isActive : ''}>
          <img src="/repeat.svg" alt="Repetir" />
        </button>
      </div>
    </footer>
  </div>
}