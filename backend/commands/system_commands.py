from datetime import datetime
import ctypes
import subprocess

from services.system_monitor import get_system_stats


def current_time_message() -> str:
    return f"It is {datetime.now().strftime('%I:%M %p').lstrip('0')}, sir."


def system_status_message() -> tuple[str, dict[str, int | None]]:
    stats = get_system_stats()

    return (
        f"CPU is at {stats['cpu']}%, RAM at {stats['ram']}%, and disk at {stats['disk']}%, sir.",
        stats,
    )


# ---------------------------------------------------------
# WINDOWS SYSTEM CONTROLS
# ---------------------------------------------------------

def lock_laptop() -> bool:
    try:
        subprocess.Popen(
            [
                "powershell.exe",
                "-NoProfile",
                "-NonInteractive",
                "-Command",
                "Start-Sleep -Seconds 3; "
                "rundll32.exe user32.dll,LockWorkStation"
            ],
            creationflags=subprocess.CREATE_NO_WINDOW,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except Exception as e:
        print(f"[JARVIS] Lock error: {e}")
        return False
        


def restart_laptop() -> bool:
    try:
        subprocess.Popen(
            ["shutdown", "/r", "/t", "10"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except OSError:
        return False


def shutdown_laptop() -> bool:
    try:
        subprocess.Popen(
            ["shutdown", "/s", "/t", "10"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except OSError:
        return False


def sleep_laptop() -> bool:
    try:
        subprocess.Popen(
            ["rundll32.exe", "powrprof.dll,SetSuspendState", "0,1,0"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except OSError:
        return False


def cancel_shutdown() -> bool:
    try:
        subprocess.Popen(
            ["shutdown", "/a"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except OSError:
        return False