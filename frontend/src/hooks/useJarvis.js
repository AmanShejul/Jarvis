import { useCallback, useEffect, useState } from 'react'
import { getJarvisStatus, getSystemStats, sendCommand } from '../services/api'
import { initialActivity } from '../data/mockData'

export function useJarvis() {
  const [clock, setClock] = useState(new Date())
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stats, setStats] = useState({ cpu: 0, ram: 0, disk: 0, battery: null })
  const [status, setStatus] = useState({ state: 'CONNECTING', message: 'Checking backend' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [activity, setActivity] = useState(initialActivity)
  const [messages, setMessages] = useState([
    { role: 'jarvis', text: 'Good morning, Aman. How can I help you today?' },
  ])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const [nextStats, nextStatus] = await Promise.all([getSystemStats(), getJarvisStatus()])
        if (active) {
          setStats(nextStats)
          setStatus(nextStatus)
        }
      } catch {
        if (active) setStatus({ state: 'BACKEND OFFLINE', message: 'Start the Python service' })
      }
    }
    refresh()
    const timer = window.setInterval(refresh, 2500)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  const submitCommand = useCallback(async (command) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return
    setMessages((current) => [...current, { role: 'user', text: trimmedCommand }])
    setIsProcessing(true)
    try {
      const result = await sendCommand(trimmedCommand)
      setMessages((current) => [...current, { role: 'jarvis', text: result.message }])
      setActivity((current) => [
        { icon: 'terminal', title: `Command: ${trimmedCommand}`, time: 'Just now' },
        ...current.slice(0, 3),
      ])
    } catch {
      setMessages((current) => [...current, { role: 'jarvis', text: 'Backend unavailable, sir. Please start the Python service.' }])
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const toggleListening = useCallback(() => setIsListening((current) => !current), [])
  const togglePlaying = useCallback(() => setIsPlaying((current) => !current), [])

  return {
    clock,
    isListening,
    isPlaying,
    stats,
    status,
    activity,
    messages,
    isProcessing,
    submitCommand,
    toggleListening,
    togglePlaying,
  }
}
