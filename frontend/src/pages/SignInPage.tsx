import { useState, type FormEvent } from 'react';
import { LogIn, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRoute } from '../hooks/useRoute';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { Logo } from '../components/Logo';

export function SignInPage() {
  const { signIn, loading, error, clearError } = useAuth();
  const { navigate } = useRoute();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await signIn(email, password);
    if (ok) navigate('dashboard');
  };

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center pt-28 pb-16 px-6">
      <Reveal className="w-full max-w-[420px]">
        <div className="rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] shadow-md p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo size={26} />
            <h1 className="text-h2 text-[var(--color-ink)] mt-6">Welcome back</h1>
            <p className="text-body text-[var(--color-ink-muted)] mt-2">
              Sign in to your Mach account.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-radius-sm bg-[rgba(184,92,56,0.1)] border border-[rgba(184,92,56,0.25)] px-3.5 py-3 mb-5">
              <AlertCircle size={16} strokeWidth={1.75} className="text-[var(--color-accent-primary)] shrink-0 mt-0.5" />
              <span className="text-[0.875rem] text-[var(--color-ink)]">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                placeholder="••••••••"
                className="rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-3 text-body text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent-tertiary)] transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={loading ? undefined : ArrowRight}
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} strokeWidth={1.75} className="shrink-0" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[0.9375rem] text-[var(--color-ink-muted)]">
              New to Mach?{' '}
            </span>
            <a
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                navigate('signup');
              }}
              className="text-[0.9375rem] font-semibold text-[var(--color-accent-tertiary)] hover:underline"
            >
              Create an account
            </a>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
