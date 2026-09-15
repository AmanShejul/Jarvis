import { FileCode2, FileText, Folder, Image, Search } from 'lucide-react'
import PageFrame, { UtilityCard } from './PageFrame'

const files = [['JARVIS frontend', 'Folder · Modified just now', Folder, 'red'], ['App.jsx', 'JavaScript · 8 KB', FileCode2, 'cyan'], ['Interface notes', 'Markdown · 3 KB', FileText, 'purple'], ['reactor-reference.png', 'Image · 1.2 MB', Image, 'amber']]
export default function Files() { return <PageFrame eyebrow="LOCAL STORAGE // INDEXED" title="Files" description="A clean view of your local workspace and project artifacts."><div className="file-toolbar"><span>RECENTLY UPDATED</span><button><Search size={14} /> Filter</button></div><div className="utility-list">{files.map(([title, detail, Icon, tone]) => <UtilityCard key={title} title={title} detail={detail} meta="OPEN" tone={tone} icon={Icon} />)}</div></PageFrame> }
