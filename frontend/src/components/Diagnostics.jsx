import { Activity, LockKeyhole, Network, ShieldCheck } from 'lucide-react'
import Panel from './Panel'

export default function Diagnostics() {
  const items = [['POWER', '100%', ShieldCheck], ['STABILITY', '98%', Activity], ['SYSTEMS', '100%', Network], ['COMMS', '100%', LockKeyhole]]
  return <Panel title="SUIT DIAGNOSTICS" eyebrow="CORE HEALTH // 04" className="diagnostics-panel"><div className="diagnostic-figure"><div className="figure-head" /><div className="figure-body" /><span className="figure-cross" /></div><div className="diagnostic-list">{items.map(([label, value, Icon]) => <div className="diagnostic-item" key={label}><div><Icon size={13} /><span>{label}</span></div><strong>{value}</strong><div className="diagnostic-bar"><i style={{ width: value }} /></div></div>)}</div></Panel>
}
