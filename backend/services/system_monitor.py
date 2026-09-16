from typing import TypedDict

import psutil


class SystemStats(TypedDict):
    cpu: int
    ram: int
    disk: int
    battery: int | None


def get_system_stats() -> SystemStats:
    battery = psutil.sensors_battery()
    return {
        "cpu": round(psutil.cpu_percent(interval=None)),
        "ram": round(psutil.virtual_memory().percent),
        "disk": round(psutil.disk_usage("C:\\").percent),
        "battery": round(battery.percent) if battery else None,
    }
