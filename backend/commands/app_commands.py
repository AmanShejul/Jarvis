import os
import shutil
import subprocess
from typing import Callable


def _launch_candidates(candidates: list[str]) -> bool:
    """
    Try launching an application using executables
    available in the system PATH.
    """
    for candidate in candidates:
        executable = shutil.which(candidate)

        if executable:
            try:
                subprocess.Popen(
                    [executable],
                    shell=False,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                return True
            except OSError:
                continue

    return False


def _launch_paths(paths: list[str]) -> bool:
    """
    Try launching an application from common Windows installation paths.
    """
    for path in paths:
        if os.path.exists(path):
            try:
                subprocess.Popen(
                    [path],
                    shell=False,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                return True
            except OSError:
                continue

    return False


# ---------------------------------------------------------
# VISUAL STUDIO CODE
# ---------------------------------------------------------

def launch_vscode() -> bool:
    return _launch_candidates(
        [
            "code",
            "code.cmd",
        ]
    )


# ---------------------------------------------------------
# GOOGLE CHROME
# ---------------------------------------------------------

def launch_chrome() -> bool:
    chrome_paths = [
        os.path.expandvars(
            r"%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"
        ),
        os.path.expandvars(
            r"%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe"
        ),
        os.path.expandvars(
            r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
        ),
    ]

    return (
        _launch_candidates(["chrome", "chrome.exe"])
        or _launch_paths(chrome_paths)
    )


# ---------------------------------------------------------
# SPOTIFY
# ---------------------------------------------------------

def launch_spotify() -> bool:
    spotify_paths = [
        os.path.expandvars(
            r"%APPDATA%\Spotify\Spotify.exe"
        ),
        os.path.expandvars(
            r"%LOCALAPPDATA%\Microsoft\WindowsApps\Spotify.exe"
        ),
        os.path.expandvars(
            r"%PROGRAMFILES%\Spotify\Spotify.exe"
        ),
    ]

    return (
        _launch_candidates(["spotify", "spotify.exe"])
        or _launch_paths(spotify_paths)
    )


# ---------------------------------------------------------
# NOTEPAD
# ---------------------------------------------------------

def launch_notepad() -> bool:
    return _launch_candidates(
        [
            "notepad",
            "notepad.exe",
        ]
    )


# ---------------------------------------------------------
# CALCULATOR
# ---------------------------------------------------------

def launch_calculator() -> bool:
    return _launch_candidates(
        [
            "calc",
            "calc.exe",
        ]
    )


# ---------------------------------------------------------
# FILE EXPLORER
# ---------------------------------------------------------

def launch_file_explorer() -> bool:
    try:
        explorer = os.path.expandvars(
            r"%WINDIR%\explorer.exe"
        )

        os.startfile(explorer)
        return True

    except (OSError, AttributeError):
        return False


# ---------------------------------------------------------
# APP COMMAND REGISTRY
# ---------------------------------------------------------

APP_COMMANDS: dict[
    str,
    tuple[Callable[[], bool], str, str]
] = {

    "open vscode": (
        launch_vscode,
        "Opening Visual Studio Code, sir.",
        "open_vscode",
    ),

    "open chrome": (
        launch_chrome,
        "Opening Google Chrome, sir.",
        "open_chrome",
    ),

    "open spotify": (
        launch_spotify,
        "Opening Spotify, sir.",
        "open_spotify",
    ),

    "open notepad": (
        launch_notepad,
        "Opening Notepad, sir.",
        "open_notepad",
    ),

    "open calculator": (
        launch_calculator,
        "Opening Calculator, sir.",
        "open_calculator",
    ),

    "open file explorer": (
        launch_file_explorer,
        "Opening File Explorer, sir.",
        "open_file_explorer",
    ),
}
