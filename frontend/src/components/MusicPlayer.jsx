import { Heart, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import Panel from './Panel'

export default function MusicPlayer({ isPlaying, onTogglePlaying }) {
  return (
    <Panel title="NOW PLAYING" eyebrow="AUDIO NODE // 04" action={<Heart size={14} />} className="music-player-panel">
      <div className="track-info"><div className="album-art"><div className="album-orbit" /></div><div><strong>The Less I Know The Better</strong><span>Tame Impala // Currents</span></div></div>
      <div className="progress-row"><span>1:24</span><div className="progress-track"><i /></div><span>3:36</span></div>
      <div className="player-controls"><button aria-label="Previous track"><SkipBack size={17} /></button><button className="play-button" onClick={onTogglePlaying} aria-label={isPlaying ? 'Pause music' : 'Play music'}>{isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}</button><button aria-label="Next track"><SkipForward size={17} /></button></div>
      <div className="player-state"><span className="status-pulse" /> {isPlaying ? 'PLAYBACK ACTIVE' : 'PLAYBACK PAUSED'} <span>LOCAL MODE</span></div>
    </Panel>
  )
}
