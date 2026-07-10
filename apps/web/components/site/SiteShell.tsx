import Link from 'next/link'
import type { ReactNode } from 'react'

type SiteShellProps = {
  children: ReactNode
}

export const SiteShell = ({ children }: SiteShellProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link className="text-sm font-bold text-foreground" href="/">
            PageExtras
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/me"
            >
              Profile
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/settings"
            >
              Settings
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </main>
  )
}
