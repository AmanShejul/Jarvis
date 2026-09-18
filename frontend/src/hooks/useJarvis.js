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

  // Action waiting for confirmation
  const [pendingAction, setPendingAction] = useState(null)

  // Conversation
  const [messages, setMessages] = useState([
    {
      role: 'jarvis',
      text: 'Hey Aman. How can I help you?',
    },
  ])

  // ---------------------------------------------------------
  // CLOCK
  // ---------------------------------------------------------

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date())
    }, 1000)

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
  // VOICE
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
  // ADD USER MESSAGE
  // ---------------------------------------------------------

  const addUserMessage = useCallback((text) => {
    setMessages((current) => [
      ...current,
      {
        role: 'user',
        text,
      },
    ])
  }, [])

  // ---------------------------------------------------------
  // DANGEROUS COMMAND DETECTION
  // ---------------------------------------------------------

  const detectDangerousCommand = useCallback((command) => {
    const normalized = command
      .toLowerCase()
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    // Shutdown
    if (
      normalized.includes('shut down my laptop') ||
      normalized.includes('shut down the laptop') ||
      normalized.includes('shutdown my laptop') ||
      normalized.includes('shutdown the laptop') ||
      normalized.includes('shutdown laptop') ||
      normalized.includes('turn off my laptop') ||
      normalized.includes('turn off the laptop')
    ) {
      return 'shutdown_laptop'
    }

    // Restart
    if (
      normalized.includes('restart my laptop') ||
      normalized.includes('restart the laptop') ||
      normalized.includes('restart laptop') ||
      normalized.includes('restart my computer') ||
      normalized.includes('restart the computer')
    ) {
      return 'restart_laptop'
    }

    return null
  }, [])

  // ---------------------------------------------------------
  // SUBMIT COMMAND
  // ---------------------------------------------------------

  const submitCommand = useCallback(
    async (command) => {
      const trimmedCommand = command.trim()

      if (!trimmedCommand || isProcessing) {
        return
      }

      const normalizedInput = trimmedCommand.toLowerCase()

      // =====================================================
      // HANDLE PENDING CONFIRMATION
      // =====================================================

      if (pendingAction) {
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

        const isPositive = positiveResponses.some(
          (response) =>
            normalizedInput === response ||
            normalizedInput.startsWith(`${response} `)
        )

        const isNegative = negativeResponses.some(
          (response) =>
            normalizedInput === response ||
            normalizedInput.startsWith(`${response} `)
        )

        // ---------------------------------------------------
        // YES
        // ---------------------------------------------------

        if (isPositive) {
          addUserMessage(trimmedCommand)

          setIsProcessing(true)

          try {
            // Only NOW do we send the dangerous command
            const result = await sendCommand(pendingAction.command)

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

        // ---------------------------------------------------
        // NO
        // ---------------------------------------------------

        if (isNegative) {
          addUserMessage(trimmedCommand)

          const message = 'Understood, sir. Action cancelled.'

          addJarvisMessage(message)
          speak(message)

          setPendingAction(null)

          return
        }

        // ---------------------------------------------------
        // UNKNOWN RESPONSE
        // ---------------------------------------------------

        addUserMessage(trimmedCommand)

        const message =
          'Please say yes to proceed or no to cancel, sir.'

        addJarvisMessage(message)
        speak(message)

        return
      }

      // =====================================================
      // NORMAL COMMAND
      // =====================================================

      addUserMessage(trimmedCommand)

      // -----------------------------------------------------
      // CHECK DANGEROUS COMMAND BEFORE BACKEND
      // -----------------------------------------------------

      const dangerousAction =
        detectDangerousCommand(trimmedCommand)

      if (dangerousAction) {
        const confirmationMessage =
          dangerousAction === 'shutdown_laptop'
            ? 'Shutdown requires confirmation, sir. Shall I proceed?'
            : 'Restart requires confirmation, sir. Shall I proceed?'

        setPendingAction({
          command: trimmedCommand,
          action: dangerousAction,
        })

        addJarvisMessage(confirmationMessage)
        speak(confirmationMessage)

        return
      }

      // -----------------------------------------------------
      // SEND NORMAL COMMAND
      // -----------------------------------------------------

      setIsProcessing(true)

      try {
        const result = await sendCommand(trimmedCommand)

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
    [
      pendingAction,
      isProcessing,
      addUserMessage,
      addJarvisMessage,
      speak,
      detectDangerousCommand,
    ]
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

    speak,
  }
}