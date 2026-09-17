from dataclasses import dataclass

from commands.app_commands import APP_COMMANDS
from commands.system_commands import (
    current_time_message,
    system_status_message,
    lock_laptop,
    restart_laptop,
    shutdown_laptop,
    sleep_laptop,
    cancel_shutdown,
)
from commands.web_commands import WEB_COMMANDS, open_website


@dataclass
class CommandResult:
    success: bool
    message: str
    action: str
    data: dict | None = None


def normalize_command(command: str) -> str:
    normalized = command.lower().strip()

    for char in ".,!?;:":
        normalized = normalized.replace(char, "")

    normalized = " ".join(normalized.split())

    # Remove common wake words
    normalized = normalized.replace("hey jarvis", "")
    normalized = normalized.replace("jarvis", "")

    return " ".join(normalized.split())


def find_command(normalized: str) -> str | None:

    # Chrome
    if (
        "open google chrome" in normalized
        or "open chrome" in normalized
        or "launch chrome" in normalized
        or "start chrome" in normalized
    ):
        return "open chrome"

    # VS Code
    if (
        "open vscode" in normalized
        or "open vs code" in normalized
        or "launch vscode" in normalized
        or "launch vs code" in normalized
    ):
        return "open vscode"

    # Spotify
    if (
        "open spotify" in normalized
        or "launch spotify" in normalized
        or "start spotify" in normalized
    ):
        return "open spotify"

    # Notepad
    if "open notepad" in normalized:
        return "open notepad"

    # Calculator
    if "open calculator" in normalized:
        return "open calculator"

    # File Explorer
    if (
        "open file explorer" in normalized
        or "open explorer" in normalized
    ):
        return "open file explorer"

    # Websites
    if "open youtube" in normalized:
        return "open youtube"

    if "open google" in normalized:
        return "open google"

    if "open github" in normalized:
        return "open github"
        # System controls
    if "lock my laptop" in normalized or "lock laptop" in normalized:
        return "lock laptop"

    if "restart my laptop" in normalized or "restart laptop" in normalized:
        return "restart laptop"

    if "shut down my laptop" in normalized or "shutdown laptop" in normalized:
        return "shutdown laptop"

    if "sleep my laptop" in normalized or "put laptop to sleep" in normalized:
        return "sleep laptop"

    if "cancel shutdown" in normalized:
        return "cancel shutdown"

    return None


def route_command(command: str) -> CommandResult:

    normalized = normalize_command(command)

    print(f"[JARVIS] Raw command: {command}")
    print(f"[JARVIS] Normalized command: {normalized}")

    matched_command = find_command(normalized)

    # App commands
    if matched_command in APP_COMMANDS:

        launcher, message, action = APP_COMMANDS[matched_command]

        try:
            launched = launcher()
        except OSError:
            launched = False

        return CommandResult(
            success=launched,
            message=message
            if launched
            else "Sir, I couldn't locate that application on this system.",
            action=action
            if launched
            else "application_not_found",
        )

    # Website commands
    if matched_command in WEB_COMMANDS:

        url, message, action = WEB_COMMANDS[matched_command]

        try:
            opened = open_website(url)
        except OSError:
            opened = False

        return CommandResult(
            success=opened,
            message=message
            if opened
            else "Sir, I couldn't open that website.",
            action=action
            if opened
            else "website_unavailable",
        )
        # System controls

    if matched_command == "lock laptop":
        success = lock_laptop()
        return CommandResult(
            success,
            "Locking the laptop, sir." if success else "Sir, I couldn't lock the laptop.",
            "lock_laptop",
        )

    if matched_command == "restart laptop":
        success = restart_laptop()
        return CommandResult(
            success,
            "Restarting the laptop in 10 seconds, sir." if success else "Sir, I couldn't restart the laptop.",
            "restart_laptop",
        )

    if matched_command == "shutdown laptop":
        success = shutdown_laptop()
        return CommandResult(
            success,
            "Shutting down the laptop in 10 seconds, sir." if success else "Sir, I couldn't shut down the laptop.",
            "shutdown_laptop",
        )

    if matched_command == "sleep laptop":
        success = sleep_laptop()
        return CommandResult(
            success,
            "Putting the laptop to sleep, sir." if success else "Sir, I couldn't put the laptop to sleep.",
            "sleep_laptop",
        )

    if matched_command == "cancel shutdown":
        success = cancel_shutdown()
        return CommandResult(
            success,
            "Shutdown cancelled, sir." if success else "Sir, there was no shutdown to cancel.",
            "cancel_shutdown",
        )

    # Time
    if normalized in {
        "what time is it",
        "tell me the time",
        "current time",
    }:
        return CommandResult(
            True,
            current_time_message(),
            "current_time",
        )

    # System status
    if normalized in {
        "system status",
        "check system status",
        "system check",
    }:
        message, data = system_status_message()

        return CommandResult(
            True,
            message,
            "system_status",
            data,
        )

    # Unknown command
    return CommandResult(
        False,
        "I don't have a safe command for that yet, sir.",
        "unknown_command",
    )