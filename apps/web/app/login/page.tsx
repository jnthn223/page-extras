import { SiteShell } from '@/components/site/SiteShell'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <SiteShell>
      <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-5xl items-center px-6 py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_380px] md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold text-accent">PageExtras account</p>
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              Sign in to join the discussion layer.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              PageExtras accounts power posting, voting, reporting, reputation,
              and public profiles across the web.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </SiteShell>
  )
}
