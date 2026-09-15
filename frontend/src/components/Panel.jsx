export default function Panel({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`hud-panel ${className}`}>
      {(title || eyebrow || action) && (
        <div className="panel-heading">
          <div>
            {eyebrow && <p className="panel-eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
