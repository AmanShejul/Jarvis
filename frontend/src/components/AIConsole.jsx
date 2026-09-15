import { ArrowUp, Mic2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Panel from './Panel'

function Waveform() {
  return <div className="waveform" aria-label="Listening waveform">{Array.from({ length: 32 }).map((_, index) => <motion.i key={index} animate={{ height: [5 + (index % 4) * 3, 10 + ((index * 7) % 20), 6 + (index % 3) * 4] }} transition={{ duration: 0.65 + (index % 5) * 0.08, repeat: Infinity, delay: index * 0.025 }} />)}</div>
}

export default function AIConsole({ messages, isListening, onToggleListening, onSubmit }) {
  const [command, setCommand] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(command)
    setCommand('')
  }

  return (
    <Panel title="A.I. CONSOLE" eyebrow="SECURE CHANNEL // 001" action={<span className="panel-online"><span />LIVE</span>} className="console-panel">
      <div className="console-messages" aria-live="polite">
        {messages.slice(-3).map((message, index) => (
          <motion.div key={`${message.text}-${index}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`console-message ${message.role}`}>
            <span className="message-tag">{message.role === 'user' ? 'YOU' : 'JARVIS'}</span>
            <p>{message.text}</p>
          </motion.div>
        ))}
      </div>
      {isListening && <Waveform />}
      <form className="command-form" onSubmit={handleSubmit}>
        <button type="button" className={`mic-button ${isListening ? 'is-listening' : ''}`} onClick={onToggleListening} aria-label="Toggle listening"><Mic2 size={17} /></button>
        <input value={command} onChange={(event) => setCommand(event.target.value)} placeholder={isListening ? 'Listening for a command…' : 'Speak or type a command…'} aria-label="Command input" />
        <button type="submit" className="send-button" aria-label="Send command"><ArrowUp size={17} /></button>
      </form>
      <div className="console-hint"><Sparkles size={12} /> Try “Open VS Code” or “What is on my schedule?”</div>
    </Panel>
  )
}
