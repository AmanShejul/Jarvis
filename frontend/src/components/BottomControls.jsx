import { Eye, Mic2, Settings2, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomControls({ onToggleListening, onNavigate }) {
  const controls = [{ label: 'Voice', icon: Mic2, action: onToggleListening }, { label: 'Vision', icon: Eye, action: () => onNavigate('web') }, { label: 'System', icon: SlidersHorizontal, action: () => onNavigate('settings') }, { label: 'Settings', icon: Settings2, action: () => onNavigate('settings') }]
  return <footer className="bottom-controls">{controls.map(({ label, icon: Icon, action }) => <motion.button key={label} whileHover={{ y: -3 }} whileTap={{ scale: 0.93 }} onClick={action}><span><Icon size={19} /></span>{label}</motion.button>)}</footer>
}
