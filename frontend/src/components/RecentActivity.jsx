import { Code2, Folder, Music2, Search, Terminal } from 'lucide-react'
import Panel from './Panel'

const icons = { code: Code2, folder: Folder, music: Music2, search: Search, terminal: Terminal }

export default function RecentActivity({ activity }) {
  return (
    <Panel title="RECENT ACTIVITY" eyebrow="EVENT LOG // LAST 24H" className="activity-panel">
      <div className="activity-list">
        {activity.map((item, index) => { const Icon = icons[item.icon] || Terminal; return <div className="activity-row" key={`${item.title}-${index}`}><span className="activity-icon"><Icon size={14} /></span><span className="activity-title">{item.title}</span><time>{item.time}</time></div> })}
      </div>
    </Panel>
  )
}
