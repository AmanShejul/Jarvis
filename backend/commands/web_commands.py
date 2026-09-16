import webbrowser


WEB_COMMANDS: dict[str, tuple[str, str, str]] = {
    "open youtube": ("https://www.youtube.com", "Opening YouTube, sir.", "open_youtube"),
    "open google": ("https://www.google.com", "Opening Google, sir.", "open_google"),
    "open github": ("https://github.com", "Opening GitHub, sir.", "open_github"),
}


def open_website(url: str) -> bool:
    return webbrowser.open(url, new=2)
