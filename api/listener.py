"""Mach Listener — the platform's nerve. Never lets a request go unheard.

Every commercially meaningful event (new signup, new agent request,
approval, payment recorded) fires a Telegram message to Father, delivered
via the same bot that carries Cj's voice. Fires on a daemon thread with a
short timeout: notification failure must NEVER fail the API call itself.
"""

from __future__ import annotations

import json
import threading
import urllib.request
from pathlib import Path


def _env(name: str) -> str:
    env_file = Path.home() / ".hermes" / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith(f"{name}="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


def _send(text: str) -> None:
    # Dedicated platform bot (separate from Cj's gateway bot) — ops pings
    # land in their own channel. Falls back to the gateway bot if unset.
    token = _env("MACH_LISTENER_BOT_TOKEN") or _env("TELEGRAM_BOT_TOKEN")
    chat_id = (
        _env("MACH_LISTENER_CHAT_ID")
        or _env("TELEGRAM_HOME_CHANNEL")
        or _env("TELEGRAM_ALLOWED_USERS").split(",")[0].strip()
    )
    if not token or not chat_id:
        return
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": True,
    }).encode()
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    try:
        urllib.request.urlopen(req, timeout=10).read()
    except Exception:
        pass  # the bell failing must never break the platform


def notify(text: str) -> None:
    """Fire-and-forget: delivers on a daemon thread."""
    threading.Thread(target=_send, args=(text,), daemon=True).start()


def new_signup(name: str, email: str, plan: str) -> None:
    notify(
        "🆕 *MACH Platform — new signup*\n\n"
        f"*{name}* ({email})\n"
        f"Plan: `{plan}`"
    )


def new_agent_request(agent: str, atype: str, channels: list, client: str, plan: str) -> None:
    notify(
        "💰 *MACH Platform — agent request*\n\n"
        f"Agent: *{agent}* (`{atype}`)\n"
        f"Channels: {', '.join(channels) or 'none'}\n"
        f"Client: {client} (`{plan}`)\n\n"
        "Awaiting your call in the Operator Console.\n"
        "https://mach-platform.vercel.app/#/operator"
    )


def agent_approved(agent: str, client: str) -> None:
    notify(f"✅ *{agent}* approved — awaiting payment from {client}.")


def payment_recorded(agent: str, client: str, amount_cents: int) -> None:
    notify(
        f"🟢 *Payment confirmed* — *{agent}* is LIVE.\n"
        f"{client} paid ${amount_cents/100:.2f}."
    )
