import { motion } from 'framer-motion'
import { ArrowUpRight, Search } from 'lucide-react'

export default function PageFrame({ eyebrow, title, description, children, action }) {
  return <motion.main className="utility-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><div className="utility-heading"><div><p className="section-eyebrow">// {eyebrow}</p><h2>{title}</h2><p>{description}</p></div>{action || <button className="outline-button"><Search size={15} /> Search</button>}</div>{children}</motion.main>
}

export function UtilityCard({ title, detail, meta, tone = 'red', icon: Icon, onClick }) {
  return <button className="utility-card" onClick={onClick}><div className={`utility-icon ${tone}`}>{Icon ? <Icon size={21} /> : <ArrowUpRight size={18} />}</div><div><strong>{title}</strong><span>{detail}</span></div>{meta && <em>{meta}</em>}<ArrowUpRight className="card-arrow" size={16} /></button>
}
