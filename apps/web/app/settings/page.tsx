import { SiteShell } from '@/components/site/SiteShell'

export default function SettingsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="mb-3 text-sm font-semibold text-accent">Account settings</p>
          <h1 className="mb-4 text-3xl font-bold text-foreground">PageExtras settings</h1>
          <p className="mb-8 text-muted-foreground">
            This is the future home for profile, privacy, blocked sites, and moderation
            preferences.
          </p>

          <div className="space-y-4">
            {[
              ['Display name', 'Alex Chen'],
              ['Email', 'alex@example.com'],
              ['Default posting mode', 'Community visible'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3"
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <strong className="text-sm text-foreground">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
