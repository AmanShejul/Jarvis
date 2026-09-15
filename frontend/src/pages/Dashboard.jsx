import { motion } from 'framer-motion'
import AIConsole from '../components/AIConsole'
import ArcReactor from '../components/ArcReactor'
import Diagnostics from '../components/Diagnostics'
import MusicPlayer from '../components/MusicPlayer'
import RecentActivity from '../components/RecentActivity'
import SystemStatus from '../components/SystemStatus'
import Upcoming from '../components/Upcoming'

export default function Dashboard({ jarvis }) {
  return <motion.main className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
    <div className="dashboard-grid">
      <div className="dashboard-left"><SystemStatus stats={jarvis.stats} /><AIConsole messages={jarvis.messages} isListening={jarvis.isListening} onToggleListening={jarvis.toggleListening} onSubmit={jarvis.submitCommand} /><RecentActivity activity={jarvis.activity} /></div>
      <div className="dashboard-center"><div className="center-status"><span className="status-pulse" /> {jarvis.status.state} <b>//</b> {jarvis.status.message}</div><ArcReactor isListening={jarvis.isListening} /><div className="center-caption"><span>JARVIS // COMMAND DECK</span><span>AUTH: AMAN SINGH</span></div></div>
      <div className="dashboard-right"><Diagnostics /><MusicPlayer isPlaying={jarvis.isPlaying} onTogglePlaying={jarvis.togglePlaying} /><Upcoming /></div>
    </div>
  </motion.main>
}
