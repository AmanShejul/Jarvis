import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import BottomControls from './components/BottomControls'
import Dashboard from './pages/Dashboard'
import Apps from './pages/Apps'
import Files from './pages/Files'
import Web from './pages/Web'
import Music from './pages/Music'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import { useJarvis } from './hooks/useJarvis'

const pages = { dashboard: Dashboard, apps: Apps, files: Files, web: Web, music: Music, notes: Notes, settings: Settings }

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const jarvis = useJarvis()
  const Page = pages[activePage]

  return <div className="app-shell">
    <div className="ambient ambient-red" /><div className="ambient ambient-cyan" />
    <Header clock={jarvis.clock} status={jarvis.status} />
    <Sidebar activePage={activePage} onNavigate={setActivePage} />
    <div className="content-area"><Page jarvis={jarvis} /></div>
    <RightSidebar onNavigate={setActivePage} />
    <BottomControls onToggleListening={jarvis.toggleListening} onNavigate={setActivePage} />
    <div className="scanlines" />
  </div>
}
