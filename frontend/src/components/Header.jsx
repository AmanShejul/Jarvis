import { CloudSun, Radio, ShieldCheck } from 'lucide-react'

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

export default function Header({ clock, status }) {
  return (
    <header className="topbar">
      <div className="topbar-block topbar-clock">
        <span className="live-dot" />
        <div>
          <p className="micro-label">LOCAL TIME // PUNE</p>
          <p className="clock-value">{formatTime(clock)}</p>
          <p className="date-value">{clock.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
        </div>
      </div>

      <div className="brand-lockup">
        <p className="brand-kicker">STARK INDUSTRIES // PERSONAL SYSTEM</p>
        <h1>J.A.R.V.I.S<span>.</span></h1>
        <p>JUST A RATHER VERY INTELLIGENT SYSTEM</p>
      </div>

      <div className="topbar-block topbar-weather">
        <CloudSun size={28} strokeWidth={1.2} />
        <div>
          <p className="micro-label">PUNE, INDIA</p>
          <p className="weather-value">28°<span>C</span></p>
          <p className="date-value">PARTLY CLOUDY</p>
        </div>
        <div className="topbar-status"><ShieldCheck size={14} /> {status.state}</div>
      </div>
    </header>
  )
}
