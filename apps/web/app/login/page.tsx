import { SiteShell } from '@/components/site/SiteShell'
import { Mail, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  return (
    <SiteShell>
      <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-5xl items-center px-6 py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_380px] md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold text-accent">Account demo</p>
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              Sign in to join the discussion layer.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              PageExtras accounts will power posting, voting, reporting, reputation,
              and public profiles. This page is the future home for real auth.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">Demo sign in</h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Real OAuth or magic-link auth will connect here. For now, the extension
              uses a local demo profile.
            </p>
            <button className="mb-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              <Mail className="h-4 w-4" />
              Continue with email
            </button>
            <p className="text-xs text-muted-foreground">
              Demo only. No credentials are collected yet.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
