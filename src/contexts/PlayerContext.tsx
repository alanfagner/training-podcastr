import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePLay: () => void;
  toggleLoop: () => void;
  toggleShuffling: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  clearPlayerState: () => void;
  playPrevious: () => void;
  isShuffling: boolean;
  hasNext: boolean;
  isLooping: boolean;
  hasPrevious: boolean;
  isPlaying: boolean;
  episodeList: Episode[];
  currentEpisodeIndex: number;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PLayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PLayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePLay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffling() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state); 1
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else
      if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider value={{ clearPlayerState, isShuffling, toggleShuffling, toggleLoop, isLooping, hasNext, hasPrevious, playPrevious, playNext, playList, episodeList, currentEpisodeIndex, isPlaying, play, togglePLay, setPlayingState }}>
      {children}
    </PlayerContext.Provider>
  )
}


export const usePlayer = () => {
  return useContext(PlayerContext);
}