import { Cpu, Database, Gauge, HardDrive } from 'lucide-react'
import Panel from './Panel'
import { metrics } from '../data/mockData'

const icons = { CPU: Cpu, GPU: Gauge, RAM: Database, DISK: HardDrive }

export default function SystemStatus({ stats }) {
  return (
    <Panel title="SYSTEM STATUS" eyebrow="TELEMETRY // LOCAL" className="status-panel">
      <div className="metric-list">
        {metrics.map((metric) => {
          const Icon = icons[metric.label]
          const value = stats[metric.label.toLowerCase()]
          return <div className="metric-row" key={metric.label}><div className="metric-name"><Icon size={14} /><span>{metric.label}</span></div><strong>{value}%</strong><div className="metric-track"><i className={metric.color} style={{ width: `${value}%` }} /></div></div>
        })}
      </div>
      <div className="status-foot"><span className="status-pulse" /> All systems nominal <span>SYNC 99.9%</span></div>
    </Panel>
  )
}
