import { useState, type FormEvent } from 'react';
import { ArrowRight, AlertCircle, Loader2, User, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useHashRoute } from '../hooks/useHashRoute';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { Logo } from '../components/Logo';

type PlanChoice = 'personal' | 'corporate';

export function SignUpPage() {
  const { signUp, loading, error, clearError } = useAuth();
  const { navigate } = useHashRoute();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<PlanChoice>('personal');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await signUp(name, email, password, plan);
    if (ok) navigate('dashboard');
  };

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center pt-28 pb-16 px-6">
      <Reveal className="w-full max-w-[480px]">
        <div className="rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] shadow-md p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo size={26} />
            <h1 className="text-h2 text-[var(--color-ink)] mt-6">Create your account</h1>
            <p className="text-body text-[var(--color-ink-muted)] mt-2">
              Get started with Mach in under a minute.
            </p>
          </div>

          {/* Plan toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setPlan('personal')}
              className={`flex flex-col items-center gap-2 rounded-radius-md border p-4 transition-all ${
                plan === 'personal'
                  ? 'border-[var(--color-accent-tertiary)] bg-[rgba(47,111,107,0.06)] shadow-sm'
                  : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent-tertiary)]'
              }`}
            >
              <User size={20} strokeWidth={1.5} className={plan === 'personal' ? 'text-[var(--color-accent-tertiary)]' : 'text-[var(--color-ink-muted)]'} />
              <span className={`font-body font-semibold text-[0.9375rem] ${plan === 'personal' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'}`}>
                Personal
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPlan('corporate')}
              className={`flex flex-col items-center gap-2 rounded-radius-md border p-4 transition-all ${
                plan === 'corporate'
                  ? 'border-[var(--color-accent-tertiary)] bg-[rgba(47,111,107,0.06)] shadow-sm'
                  : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent-tertiary)]'
              }`}
            >
              <Building2 size={20} strokeWidth={1.5} className={plan === 'corporate' ? 'text-[var(--color-accent-tertiary)]' : 'text-[var(--color-ink-muted)]'} />
              <span className={`font-body font-semibold text-[0.9375rem] ${plan === 'corporate' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'}`}>
                Corporate
              </span>
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-radius-sm bg-[rgba(184,92,56,0.1)] border border-[rgba(184,92,56,0.25)] px-3.5 py-3 mb-5">
              <AlertCircle size={16} strokeWidth={1.75} className="text-[var(--color-accent-primary)] shrink-0 mt-0.5" />
              <span className="text-[0.875rem] text-[var(--color-ink)]">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">
                {plan === 'corporate' ? 'Company name' : 'Your name'}
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError();
                }}
                placeholder={plan === 'corporate' ? 'Acme Inc.' : 'Jane Doe'}
                className="rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-3 text-body text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent-tertiary)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                placeholder="you@example.com"
                className="rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-3 text-body text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent-tertiary)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                placeholder="At least 6 characters"
                className="rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-3 text-body text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent-tertiary)] transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight size={16} strokeWidth={1.75} className="shrink-0" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[0.9375rem] text-[var(--color-ink-muted)]">
              Already have an account?{' '}
            </span>
            <a
              href="#/signin"
              onClick={(e) => {
                e.preventDefault();
                navigate('signin');
              }}
              className="text-[0.9375rem] font-semibold text-[var(--color-accent-tertiary)] hover:underline"
            >
              Sign in
            </a>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
