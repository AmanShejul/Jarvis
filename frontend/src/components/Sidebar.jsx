import { Code2, FileText, Folder, Globe2, Grid2X2, Home, Music2, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { navigationItems } from '../data/mockData'

const iconMap = { home: Home, grid: Grid2X2, folder: Folder, globe: Globe2, music: Music2, note: FileText, settings: Settings }

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar left-sidebar">
      <div className="sidebar-rail-label">NAVIGATION</div>
      <nav aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon]
          const active = item.page === activePage
          return (
            <motion.button
              key={item.page}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.96 }}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => onNavigate(item.page)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={19} strokeWidth={1.7} />
              <span>{item.label}</span>
            </motion.button>
          )
        })}
      </nav>
      <div className="sidebar-footer-mark"><Code2 size={14} /> v1.0.4</div>
    </aside>
  )
}
