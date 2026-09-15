import { CalendarClock } from 'lucide-react'
import Panel from './Panel'
import { upcomingItems } from '../data/mockData'

export default function Upcoming() {
  return <Panel title="UPCOMING" eyebrow="SCHEDULE // NEXT" action={<CalendarClock size={15} />} className="upcoming-panel"><div className="upcoming-list">{upcomingItems.map((item) => <div className="upcoming-row" key={item.title}><span className="upcoming-mark" /><span>{item.title}</span><time>{item.time}</time></div>)}</div><button className="panel-link">VIEW CALENDAR <span>→</span></button></Panel>
}
