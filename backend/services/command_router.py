from dataclasses import dataclass

from commands.app_commands import APP_COMMANDS
from commands.system_commands import current_time_message, system_status_message
from commands.web_commands import WEB_COMMANDS, open_website


@dataclass
class CommandResult:
    success: bool
    message: str
    action: str
    data: dict | None = None


def route_command(command: str) -> CommandResult:
    normalized = " ".join(command.lower().strip().split())

    if normalized in APP_COMMANDS:
        launcher, message, action = APP_COMMANDS[normalized]
        try:
            launched = launcher()
        except OSError:
            launched = False
        return CommandResult(
            success=launched,
            message=message if launched else "Sir, I couldn't locate that application on this system.",
            action=action if launched else "application_not_found",
        )

    if normalized in WEB_COMMANDS:
        url, message, action = WEB_COMMANDS[normalized]
        try:
            opened = open_website(url)
        except OSError:
            opened = False
        return CommandResult(
            success=opened,
            message=message if opened else "Sir, I couldn't open that website.",
            action=action if opened else "website_unavailable",
        )

    if normalized == "what time is it":
        return CommandResult(True, current_time_message(), "current_time")

    if normalized == "system status":
        message, data = system_status_message()
        return CommandResult(True, message, "system_status", data)

    return CommandResult(False, "I don't have a safe command for that yet, sir.", "unknown_command")
