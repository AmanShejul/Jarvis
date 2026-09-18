import { useCallback, useEffect, useState } from 'react'
import {
  getJarvisStatus,
  getSystemStats,
  sendCommand,
} from '../services/api'
import { initialActivity } from '../data/mockData'

export function useJarvis() {
  const [clock, setClock] = useState(new Date())
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const [stats, setStats] = useState({
    cpu: 0,
    ram: 0,
    disk: 0,
    battery: null,
  })

  const [status, setStatus] = useState({
    state: 'CONNECTING',
    message: 'Checking backend',
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [activity, setActivity] = useState(initialActivity)

  // Stores a dangerous action waiting for confirmation
  const [pendingAction, setPendingAction] = useState(null)

  const [messages, setMessages] = useState([
    {
      role: 'jarvis',
      text: ' Heyy Aman. How can I help you today?',
    },
  ])

  // ---------------------------------------------------------
  // CLOCK
  // ---------------------------------------------------------

  useEffect(() => {
    const timer = window.setInterval(
      () => setClock(new Date()),
      1000
    )

    return () => window.clearInterval(timer)
  }, [])

  // ---------------------------------------------------------
  // BACKEND STATUS + SYSTEM STATS
  // ---------------------------------------------------------

  useEffect(() => {
    let active = true

    const refresh = async () => {
      try {
        const [nextStats, nextStatus] = await Promise.all([
          getSystemStats(),
          getJarvisStatus(),
        ])

        if (active) {
          setStats(nextStats)
          setStatus(nextStatus)
        }
      } catch {
        if (active) {
          setStatus({
            state: 'BACKEND OFFLINE',
            message: 'Start the Python service',
          })
        }
      }
    }

    refresh()

    const timer = window.setInterval(refresh, 2500)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  // ---------------------------------------------------------
  // JARVIS VOICE
  // ---------------------------------------------------------

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      return
    }

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(text)

    speech.rate = 0.95
    speech.pitch = 0.9
    speech.volume = 1

    window.speechSynthesis.speak(speech)
  }, [])

  // ---------------------------------------------------------
  // ADD JARVIS MESSAGE
  // ---------------------------------------------------------

  const addJarvisMessage = useCallback((text) => {
    setMessages((current) => [
      ...current,
      {
        role: 'jarvis',
        text,
      },
    ])
  }, [])

  // ---------------------------------------------------------
  // SUBMIT COMMAND
  // ---------------------------------------------------------

  const submitCommand = useCallback(
    async (command) => {
      const trimmedCommand = command.trim()

      if (!trimmedCommand) {
        return
      }

      const normalizedInput = trimmedCommand.toLowerCase()

      // =====================================================
      // CONFIRMATION HANDLING
      // =====================================================

      if (pendingAction) {
        // -----------------------------------------------
        // YES / CONFIRM
        // -----------------------------------------------

        const positiveResponses = [
          'yes',
          'yeah',
          'yep',
          'yes please',
          'go ahead',
          'do it',
          'proceed',
          'confirm',
          'confirmed',
          'sure',
          'okay',
          'ok',
        ]

        if (
          positiveResponses.some(
            (response) =>
              normalizedInput === response ||
              normalizedInput.startsWith(`${response} `)
          )
        ) {
          setMessages((current) => [
            ...current,
            {
              role: 'user',
              text: trimmedCommand,
            },
          ])

          setIsProcessing(true)

          try {
            const result = await sendCommand(
              pendingAction.command
            )

            addJarvisMessage(result.message)
            speak(result.message)

            setActivity((current) => [
              {
                icon: 'terminal',
                title: `Confirmed: ${pendingAction.command}`,
                time: 'Just now',
              },
              ...current.slice(0, 3),
            ])
          } catch {
            const errorMessage =
              'Backend unavailable, sir. Please start the Python service.'

            addJarvisMessage(errorMessage)
            speak(errorMessage)
          } finally {
            setIsProcessing(false)
            setPendingAction(null)
          }

          return
        }

        // -----------------------------------------------
        // NO / CANCEL
        // -----------------------------------------------

        const negativeResponses = [
          'no',
          'nope',
          'nah',
          'cancel',
          'stop',
          'dont',
          "don't",
          'do not',
          'never mind',
          'never mind it',
        ]

        if (
          negativeResponses.some(
            (response) =>
              normalizedInput === response ||
              normalizedInput.startsWith(`${response} `)
          )
        ) {
          const message =
            'Understood, sir. Action cancelled.'

          setMessages((current) => [
            ...current,
            {
              role: 'user',
              text: trimmedCommand,
            },
            {
              role: 'jarvis',
              text: message,
            },
          ])

          speak(message)

          setPendingAction(null)

          return
        }

        // -----------------------------------------------
        // UNKNOWN CONFIRMATION RESPONSE
        // -----------------------------------------------

        const message =
          'Please say yes to proceed or no to cancel, sir.'

        setMessages((current) => [
          ...current,
          {
            role: 'user',
            text: trimmedCommand,
          },
          {
            role: 'jarvis',
            text: message,
          },
        ])

        speak(message)

        return
      }

      // =====================================================
      // NORMAL COMMAND
      // =====================================================

      setMessages((current) => [
        ...current,
        {
          role: 'user',
          text: trimmedCommand,
        },
      ])

      setIsProcessing(true)

      try {
        const result = await sendCommand(trimmedCommand)

        // =================================================
        // DANGEROUS COMMANDS
        // =================================================

        if (
          result.action === 'shutdown_laptop' ||
          result.action === 'restart_laptop'
        ) {
          const confirmationMessage =
            result.action === 'shutdown_laptop'
              ? 'Shutdown requires confirmation, sir. Shall I proceed?'
              : 'Restart requires confirmation, sir. Shall I proceed?'

          setPendingAction({
            command: trimmedCommand,
            action: result.action,
          })

          addJarvisMessage(confirmationMessage)
          speak(confirmationMessage)

          return
        }

        // =================================================
        // NORMAL RESPONSE
        // =================================================

        addJarvisMessage(result.message)
        speak(result.message)

        setActivity((current) => [
          {
            icon: 'terminal',
            title: `Command: ${trimmedCommand}`,
            time: 'Just now',
          },
          ...current.slice(0, 3),
        ])
      } catch {
        const errorMessage =
          'Backend unavailable, sir. Please start the Python service.'

        addJarvisMessage(errorMessage)
        speak(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [pendingAction, addJarvisMessage, speak]
  )

  // ---------------------------------------------------------
  // CONTROLS
  // ---------------------------------------------------------

  const toggleListening = useCallback(() => {
    setIsListening((current) => !current)
  }, [])

  const togglePlaying = useCallback(() => {
    setIsPlaying((current) => !current)
  }, [])

  // ---------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------

  return {
    clock,
    isListening,
    isPlaying,
    stats,
    status,
    activity,
    messages,
    isProcessing,
    pendingAction,
    submitCommand,
    toggleListening,
    togglePlaying,
  }
}
