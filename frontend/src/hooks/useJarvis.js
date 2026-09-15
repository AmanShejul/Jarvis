import { useCallback, useEffect, useState } from 'react'
import { getJarvisStatus, getSystemStats, sendCommand } from '../services/api'
import { initialActivity } from '../data/mockData'

export function useJarvis() {
  const [clock, setClock] = useState(new Date())
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stats, setStats] = useState({ cpu: 12, gpu: 8, ram: 46, storage: 31 })
  const [status, setStatus] = useState({ state: 'ONLINE', message: 'All systems operational' })
  const [activity, setActivity] = useState(initialActivity)
  const [messages, setMessages] = useState([
    { role: 'jarvis', text: 'Good morning, Aman. How can I help you today?' },
  ])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    Promise.all([getSystemStats(), getJarvisStatus()]).then(([nextStats, nextStatus]) => {
      setStats(nextStats)
      setStatus(nextStatus)
    })
  }, [])

  const submitCommand = useCallback(async (command) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return
    setMessages((current) => [...current, { role: 'user', text: trimmedCommand }])
    const result = await sendCommand(trimmedCommand)
    setMessages((current) => [...current, { role: 'jarvis', text: result.response }])
    setActivity((current) => [
      { icon: 'terminal', title: `Command: ${trimmedCommand}`, time: 'Just now' },
      ...current.slice(0, 3),
    ])
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
    submitCommand,
    toggleListening,
    togglePlaying,
  }
}
