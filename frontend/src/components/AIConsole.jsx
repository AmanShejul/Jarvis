import { ArrowUp, Mic2, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Panel from './Panel'

function Waveform() {
  return (
    <div className="waveform" aria-label="Listening waveform">
      {Array.from({ length: 32 }).map((_, index) => (
        <motion.i
          key={index}
          animate={{
            height: [
              5 + (index % 4) * 3,
              10 + ((index * 7) % 20),
              6 + (index % 3) * 4,
            ],
          }}
          transition={{
            duration: 0.65 + (index % 5) * 0.08,
            repeat: Infinity,
            delay: index * 0.025,
          }}
        />
      ))}
    </div>
  )
}

export default function AIConsole({
  messages,
  isListening,
  isProcessing,
  onToggleListening,
  onSubmit,
}) {
  const [command, setCommand] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('Speech Recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-IN'
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let transcript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }

      setCommand(transcript)

      // Automatically submit when speech recognition is final
      if (event.results[event.results.length - 1].isFinal) {
        onSubmit(transcript.trim())
        setCommand('')
      }
    }

    recognition.onend = () => {
      if (isListening) {
        onToggleListening()
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)

      if (isListening) {
        onToggleListening()
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
    }
  }, [isListening, onSubmit, onToggleListening])

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedCommand = command.trim()

    if (!trimmedCommand || isProcessing) return

    onSubmit(trimmedCommand)
    setCommand('')
  }

  function handleMicClick() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert(
        'Speech recognition is not supported in this browser. Please use Google Chrome.'
      )
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      onToggleListening()
      return
    }

    try {
      recognitionRef.current?.start()
      onToggleListening()
    } catch (error) {
      console.error('Could not start microphone:', error)
    }
  }

  return (
    <Panel
      title="A.I. CONSOLE"
      eyebrow="SECURE CHANNEL // 001"
      action={
        <span className="panel-online">
          <span />
          LIVE
        </span>
      }
      className="console-panel"
    >
      <div className="console-messages" aria-live="polite">
        {messages.slice(-3).map((message, index) => (
          <motion.div
            key={`${message.text}-${index}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`console-message ${message.role}`}
          >
            <span className="message-tag">
              {message.role === 'user' ? 'YOU' : 'JARVIS'}
            </span>

            <p>{message.text}</p>
          </motion.div>
        ))}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="console-message processing"
          >
            <span className="message-tag">JARVIS</span>
            <p>
              PROCESSING
              <span className="processing-dots">...</span>
            </p>
          </motion.div>
        )}
      </div>

      {isListening && <Waveform />}

      <form className="command-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className={`mic-button ${isListening ? 'is-listening' : ''}`}
          onClick={handleMicClick}
          aria-label="Toggle listening"
        >
          <Mic2 size={17} />
        </button>

        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder={
            isListening
              ? 'Listening for a command…'
              : 'Speak or type a command…'
          }
          aria-label="Command input"
        />

        <button
          type="submit"
          className="send-button"
          aria-label="Send command"
          disabled={isProcessing || !command.trim()}
        >
          <ArrowUp size={17} />
        </button>
      </form>

      <div className="console-hint">
        <Sparkles size={12} />
        Try “Open Chrome” or “Open VS Code”
      </div>
    </Panel>
  )
}