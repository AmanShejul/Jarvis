import { Chrome, Code2, FileText, Music2 } from 'lucide-react'
import PageFrame, { UtilityCard } from './PageFrame'
import { apps } from '../data/mockData'

const icons = { 'VS Code': Code2, Chrome, Spotify: Music2, Notion: FileText }

export default function Apps() { return <PageFrame eyebrow="APPLICATION MATRIX" title="Apps" description="Your connected workspace, organized for rapid access."><div className="utility-grid">{apps.map((app) => <UtilityCard key={app.name} title={app.name} detail={app.detail} meta="READY" tone={app.tone} icon={icons[app.name]} />)}</div><div className="empty-state"><span>+</span><strong>Add a quick launch target</strong><p>Connect your most-used desktop tools when the backend bridge is ready.</p></div></PageFrame> }
