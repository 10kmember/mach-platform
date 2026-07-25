"""MACH Platform API — self-hosted backend for the MACH agent-hosting site.

Replaces the Supabase dependency in the mach_dashhy frontend with our own
PostgreSQL + SQLAlchemy + FastAPI stack on Father's box. Same schema as the
original migration (profiles / agents / skills / usage_events), JWT auth
instead of Supabase Auth.

Runs on 127.0.0.1:9229 behind Caddy (https://2.28.10.195/platform-api/*).
Secrets come from ~/.hermes/.env (MACH_DATABASE_URL, MACH_JWT_SECRET).
"""

from __future__ import annotations

import os
import time
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

import bcrypt
import jwt
from fastapi import Depends, FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator


def _no_markup(v: str) -> str:
    """Reject raw HTML in free-text fields. Stored payloads are inert in
    React (auto-escaped), but defense-in-depth: markup never belongs in
    names/notes. Red-team finding: stored XSS attempts landed in DB."""
    if "<" in v or ">" in v:
        raise ValueError("Angle brackets are not allowed")
    return v
from sqlalchemy import (
    DateTime, ForeignKey, Integer, String, Text, create_engine, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session, sessionmaker

# ── Config ────────────────────────────────────────────────────────────────

def _env(name: str) -> str:
    env_file = Path.home() / ".hermes" / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith(f"{name}="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get(name, "")

DATABASE_URL = _env("MACH_DATABASE_URL")
JWT_SECRET = _env("MACH_JWT_SECRET")
JWT_ALGO = "HS256"
JWT_TTL_HOURS = 72

if not DATABASE_URL or not JWT_SECRET:
    raise RuntimeError("MACH_DATABASE_URL and MACH_JWT_SECRET must be set in ~/.hermes/.env")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

def hash_password(raw: str) -> str:
    return bcrypt.hashpw(raw.encode()[:72], bcrypt.gensalt()).decode()

def verify_password(raw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(raw.encode()[:72], hashed.encode())
    except ValueError:
        return False

# ── Models ────────────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    pass

class Profile(Base):
    __tablename__ = "profiles"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    plan: Mapped[str] = mapped_column(Text, nullable=False, default="personal")
    is_admin: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Agent(Base):
    __tablename__ = "agents"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(Text, nullable=False)  # mach_one|mach_forge|mach_relay|mach_sentry
    status: Mapped[str] = mapped_column(Text, nullable=False, default="active")
    channels: Mapped[list] = mapped_column(ARRAY(Text), nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Skill(Base):
    __tablename__ = "skills"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    agent_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="SET NULL"))
    name: Mapped[str] = mapped_column(Text, nullable=False)
    schedule: Mapped[str] = mapped_column(Text, nullable=False)
    tag: Mapped[str] = mapped_column(Text, nullable=False, default="Scheduled")
    status: Mapped[str] = mapped_column(Text, nullable=False, default="running")
    last_run_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class UsageEvent(Base):
    __tablename__ = "usage_events"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    agent_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="SET NULL"))
    skill_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="SET NULL"))
    event_type: Mapped[str] = mapped_column(Text, nullable=False)
    cost_cents: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    duration_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Payment(Base):
    """Operator-recorded payment for an agent hosting slot. The money loop:
    request → operator approval → awaiting_payment → operator marks paid →
    agent goes live. Rows are the ledger; PayPal links are sent by hand
    (human-in-the-middle) after Father assesses each request."""
    __tablename__ = "payments"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[str] = mapped_column(Text, nullable=False, default="recorded")  # recorded|confirmed|refunded
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

# ── Schemas ───────────────────────────────────────────────────────────────

class SignUpBody(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=200)
    plan: str = "personal"

    _check_name = field_validator("name")(_no_markup)

class SignInBody(BaseModel):
    email: EmailStr
    password: str

class AgentIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    type: str
    channels: list[str] = []

    _check_name = field_validator("name")(_no_markup)

class AgentStatusIn(BaseModel):
    status: str

class PaymentIn(BaseModel):
    amount_cents: int = Field(gt=0, le=100_000_000)
    note: str = Field(default="", max_length=500)

    _check_note = field_validator("note")(_no_markup)

# ── Auth helpers ──────────────────────────────────────────────────────────

def mint_token(user_id: uuid.UUID) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": str(user_id), "iat": now, "exp": now + timedelta(hours=JWT_TTL_HOURS)},
        JWT_SECRET, algorithm=JWT_ALGO,
    )

def current_user(authorization: str = Header(default="")) -> uuid.UUID:
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")
    try:
        payload = jwt.decode(authorization[7:], JWT_SECRET, algorithms=[JWT_ALGO])
        return uuid.UUID(payload["sub"])
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

def require_admin(uid: uuid.UUID = Depends(current_user)) -> uuid.UUID:
    """Gate for platform-operator endpoints. Only Father's account passes."""
    with SessionLocal() as s:
        p = s.get(Profile, uid)
        if not p or not p.is_admin:
            raise HTTPException(403, "Platform operators only")
    return uid

def db() -> Session:
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()

def public_user(p: Profile) -> dict:
    return {"id": str(p.id), "email": p.email, "name": p.name, "plan": p.plan, "is_admin": p.is_admin}

def row_agent(a: Agent) -> dict:
    return {
        "id": str(a.id), "name": a.name, "type": a.type, "status": a.status,
        "channels": a.channels or [], "created_at": a.created_at.isoformat() if a.created_at else None,
    }

def row_skill(s: Skill) -> dict:
    return {
        "id": str(s.id), "name": s.name, "schedule": s.schedule, "tag": s.tag,
        "status": s.status, "agent_id": str(s.agent_id) if s.agent_id else None,
        "last_run_at": s.last_run_at.isoformat() if s.last_run_at else None,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }

def row_usage(u: UsageEvent) -> dict:
    return {
        "id": str(u.id), "event_type": u.event_type, "cost_cents": u.cost_cents,
        "duration_ms": u.duration_ms,
        "created_at": u.created_at.isoformat() if u.created_at else None,
        "agent_id": str(u.agent_id) if u.agent_id else None,
        "skill_id": str(u.skill_id) if u.skill_id else None,
    }

# ── App ───────────────────────────────────────────────────────────────────

app = FastAPI(title="MACH Platform API", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # public marketing site + dashboard; JWT is the gate
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(engine)

@app.get("/health")
def health():
    return {"ok": True, "service": "mach-platform", "ts": int(time.time())}

# ── Auth routes ───────────────────────────────────────────────────────────

@app.post("/auth/signup", status_code=201)
def signup(body: SignUpBody, session: Session = Depends(db)):
    email = body.email.lower()
    if session.query(Profile).filter_by(email=email).first():
        raise HTTPException(409, "An account with this email already exists.")
    plan = body.plan if body.plan in ("personal", "corporate") else "personal"
    p = Profile(email=email, password_hash=hash_password(body.password), name=body.name, plan=plan)
    session.add(p)
    session.commit()
    session.refresh(p)
    import listener
    listener.new_signup(p.name, p.email, p.plan)
    return {"token": mint_token(p.id), "user": public_user(p)}

@app.post("/auth/signin")
def signin(body: SignInBody, session: Session = Depends(db)):
    p = session.query(Profile).filter_by(email=body.email.lower()).first()
    if not p or not verify_password(body.password, p.password_hash):
        raise HTTPException(401, "Invalid email or password.")
    return {"token": mint_token(p.id), "user": public_user(p)}

@app.get("/auth/me")
def me(uid: uuid.UUID = Depends(current_user), session: Session = Depends(db)):
    p = session.get(Profile, uid)
    if not p:
        raise HTTPException(404, "Profile not found")
    return {"user": public_user(p)}

# ── Agent routes ──────────────────────────────────────────────────────────

VALID_TYPES = {"mach_one", "mach_forge", "mach_relay", "mach_sentry"}

@app.get("/agents")
def list_agents(uid: uuid.UUID = Depends(current_user), session: Session = Depends(db)):
    rows = session.query(Agent).filter_by(user_id=uid).order_by(Agent.created_at.desc()).all()
    return [row_agent(a) for a in rows]

@app.post("/agents", status_code=201)
def create_agent(body: AgentIn, uid: uuid.UUID = Depends(current_user), session: Session = Depends(db)):
    if body.type not in VALID_TYPES:
        raise HTTPException(422, f"type must be one of {sorted(VALID_TYPES)}")
    # Money gate: nothing goes live without operator approval AND payment.
    a = Agent(user_id=uid, name=body.name, type=body.type, channels=body.channels, status="pending_approval")
    session.add(a)
    session.commit()
    session.refresh(a)
    p = session.get(Profile, uid)
    import listener
    listener.new_agent_request(a.name, a.type, a.channels or [], p.email if p else "?", p.plan if p else "?")
    return row_agent(a)

@app.patch("/agents/{agent_id}")
def update_agent(agent_id: uuid.UUID, body: AgentStatusIn, uid: uuid.UUID = Depends(current_user), session: Session = Depends(db)):
    a = session.query(Agent).filter_by(id=agent_id, user_id=uid).first()
    if not a:
        raise HTTPException(404, "Agent not found")
    # Clients may only pause/resume an agent that's already live. Approval
    # state transitions belong to the operator endpoints below.
    if a.status not in ("active", "paused"):
        raise HTTPException(409, "Agent is not live yet — pending operator approval")
    if body.status not in ("active", "paused"):
        raise HTTPException(422, "Invalid status")
    a.status = body.status
    session.commit()
    return row_agent(a)

# ── Operator (platform admin) routes ─────────────────────────────────────

@app.get("/admin/pending")
def admin_pending(_: uuid.UUID = Depends(require_admin), session: Session = Depends(db)):
    """The approval queue: every agent awaiting a go-live decision."""
    rows = (
        session.query(Agent, Profile)
        .join(Profile, Agent.user_id == Profile.id)
        .filter(Agent.status == "pending_approval")
        .order_by(Agent.created_at.asc())
        .all()
    )
    return [
        {**row_agent(a), "client_email": p.email, "client_name": p.name, "client_plan": p.plan}
        for a, p in rows
    ]

@app.post("/admin/agents/{agent_id}/approve")
def admin_approve(agent_id: uuid.UUID, _: uuid.UUID = Depends(require_admin), session: Session = Depends(db)):
    """Approve the request → client owes payment. Agent stays dark until
    the operator confirms money received via /mark-paid."""
    a = (
        session.query(Agent)
        .filter_by(id=agent_id, status="pending_approval")
        .with_for_update()
        .first()
    )
    if not a:
        raise HTTPException(404, "No pending agent with that id")
    a.status = "awaiting_payment"
    session.commit()
    p = session.get(Profile, a.user_id)
    import listener
    listener.agent_approved(a.name, p.email if p else "?")
    return row_agent(a)

@app.post("/admin/agents/{agent_id}/mark-paid", status_code=201)
def admin_mark_paid(agent_id: uuid.UUID, body: PaymentIn, _: uuid.UUID = Depends(require_admin), session: Session = Depends(db)):
    """Payment confirmed → ledger entry + agent goes live. This is the
    moment hosting revenue becomes real.

    Concurrency: SELECT ... FOR UPDATE pins the agent row for the whole
    transaction, so simultaneous mark-paid calls serialize — the second
    sees the already-flipped status and 404s. Red-team finding: without
    the lock, N concurrent calls could mint N ledger rows."""
    a = (
        session.query(Agent)
        .filter_by(id=agent_id, status="awaiting_payment")
        .with_for_update()
        .first()
    )
    if not a:
        raise HTTPException(404, "No agent awaiting payment with that id")
    pay = Payment(agent_id=a.id, user_id=a.user_id, amount_cents=body.amount_cents, note=body.note, status="confirmed")
    session.add(pay)
    a.status = "active"
    session.commit()
    p = session.get(Profile, a.user_id)
    import listener
    listener.payment_recorded(a.name, p.email if p else "?", body.amount_cents)
    return row_agent(a)

@app.get("/admin/payments")
def admin_payments(_: uuid.UUID = Depends(require_admin), session: Session = Depends(db)):
    """The ledger: every recorded payment, newest first."""
    rows = (
        session.query(Payment, Agent, Profile)
        .join(Agent, Payment.agent_id == Agent.id)
        .join(Profile, Payment.user_id == Profile.id)
        .order_by(Payment.created_at.desc())
        .all()
    )
    return [
        {
            "id": str(pay.id),
            "agent": a.name,
            "client_email": prof.email,
            "amount_cents": pay.amount_cents,
            "note": pay.note,
            "status": pay.status,
            "created_at": pay.created_at.isoformat() if pay.created_at else None,
        }
        for pay, a, prof in rows
    ]

@app.post("/admin/agents/{agent_id}/reject")
def admin_reject(agent_id: uuid.UUID, _: uuid.UUID = Depends(require_admin), session: Session = Depends(db)):
    a = (
        session.query(Agent)
        .filter_by(id=agent_id, status="pending_approval")
        .with_for_update()
        .first()
    )
    if not a:
        raise HTTPException(404, "No pending agent with that id")
    a.status = "rejected"
    session.commit()
    return row_agent(a)

@app.get("/admin/agents")
def admin_all_agents(_: uuid.UUID = Depends(require_admin), session: Session = Depends(db)):
    """Full fleet view across all clients, for the operator console."""
    rows = (
        session.query(Agent, Profile)
        .join(Profile, Agent.user_id == Profile.id)
        .order_by(Agent.created_at.desc())
        .all()
    )
    return [
        {**row_agent(a), "client_email": p.email, "client_name": p.name, "client_plan": p.plan}
        for a, p in rows
    ]

@app.delete("/agents/{agent_id}", status_code=204)
def delete_agent(agent_id: uuid.UUID, uid: uuid.UUID = Depends(current_user), session: Session = Depends(db)):
    a = session.query(Agent).filter_by(id=agent_id, user_id=uid).first()
    if not a:
        raise HTTPException(404, "Agent not found")
    session.delete(a)
    session.commit()
    return None

# ── Skill + usage routes ──────────────────────────────────────────────────

@app.get("/skills")
def list_skills(uid: uuid.UUID = Depends(current_user), session: Session = Depends(db)):
    rows = session.query(Skill).filter_by(user_id=uid).order_by(Skill.created_at.desc()).all()
    return [row_skill(s) for s in rows]

@app.get("/usage")
def list_usage(uid: uuid.UUID = Depends(current_user), session: Session = Depends(db)):
    rows = session.query(UsageEvent).filter_by(user_id=uid).order_by(UsageEvent.created_at.desc()).limit(50).all()
    return [row_usage(u) for u in rows]
