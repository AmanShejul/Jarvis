import { motion } from 'framer-motion'

export default function ArcReactor({ isListening }) {
  return (
    <div className={`reactor-wrap ${isListening ? 'reactor-listening' : ''}`} aria-label="Animated arc reactor">
      <div className="reactor-hud-label reactor-label-top"><span>REACTOR CORE</span><b>07.4 // ACTIVE</b></div>
      <div className="reactor-scan-line" />
      <motion.div className="reactor-orbit orbit-a" animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="reactor-orbit orbit-b" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="reactor-orbit orbit-c" animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} />
      <div className="reactor-ring ring-outer" />
      <div className="reactor-ring ring-mid"><span /><span /><span /><span /></div>
      <div className="reactor-ring ring-inner" />
      <motion.div className="reactor-core" animate={{ scale: [0.94, 1.05, 0.94], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="reactor-core-shape" />
      </motion.div>
      <div className="reactor-crosshair horizontal" />
      <div className="reactor-crosshair vertical" />
      <div className="reactor-readout readout-left">POWER<br /><strong>100.0%</strong></div>
      <div className="reactor-readout readout-right">OUTPUT<br /><strong>1.21 GW</strong></div>
      <div className="reactor-hud-label reactor-label-bottom"><span>ARC / 001</span><b>STABLE</b></div>
    </div>
  )
}
