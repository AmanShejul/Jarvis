from datetime import datetime

from services.system_monitor import get_system_stats


def current_time_message() -> str:
    return f"It is {datetime.now().strftime('%I:%M %p').lstrip('0')}, sir."


def system_status_message() -> tuple[str, dict[str, int | None]]:
    stats = get_system_stats()
    return (
        f"CPU is at {stats['cpu']}%, RAM at {stats['ram']}%, and disk at {stats['disk']}%, sir.",
        stats,
    )
