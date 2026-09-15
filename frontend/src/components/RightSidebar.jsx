import { Bot, ChevronRight, ExternalLink, Plus, TerminalSquare } from 'lucide-react'
import { apps } from '../data/mockData'

export default function RightSidebar({ onNavigate }) {
  return (
    <aside className="sidebar right-sidebar">
      <div className="sidebar-rail-label">QUICK LAUNCH</div>
      <div className="quick-apps">
        {apps.map((app) => (
          <button key={app.name} className="quick-app" onClick={() => onNavigate('apps')}>
            <span className={`app-glyph ${app.tone}`}>{app.name === 'VS Code' ? '<>' : app.name.slice(0, 1)}</span>
            <span>{app.name}</span>
            <ExternalLink size={12} />
          </button>
        ))}
      </div>
      <button className="quick-app add-app" onClick={() => onNavigate('apps')}>
        <span className="app-glyph add"><Plus size={20} /></span><span>Add app</span>
      </button>
      <div className="right-sidebar-note">
        <Bot size={17} />
        <div><strong>JARVIS CORE</strong><span>Ready for input</span></div>
        <ChevronRight size={15} />
      </div>
      <div className="sidebar-footer-mark"><TerminalSquare size={14} /> SECURE LINK</div>
    </aside>
  )
}
