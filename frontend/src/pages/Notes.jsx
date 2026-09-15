import { FileText, Pin, Plus } from 'lucide-react'
import PageFrame, { UtilityCard } from './PageFrame'
import { notes } from '../data/mockData'
export default function Notes() { return <PageFrame eyebrow="KNOWLEDGE BASE // PERSONAL" title="Notes" description="Capture ideas, prompts, and the next move for your projects." action={<button className="solid-button"><Plus size={15} /> New note</button>}><div className="utility-list">{notes.map((note) => <UtilityCard key={note.title} title={note.title} detail={note.detail} meta={note.updated} tone="cyan" icon={note.title === 'Project SIH' ? Pin : FileText} />)}</div></PageFrame> }
