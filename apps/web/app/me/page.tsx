import { SiteShell } from '@/components/site/SiteShell'

const recentActivity = [
  'Commented on The Future of Web Discussion',
  'Upvoted a thread about open web moderation',
  'Started a discussion on browser-native communities',
]

export default function ProfilePage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
                A
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-accent">Demo profile</p>
                <h1 className="text-3xl font-bold text-foreground">Alex Chen</h1>
                <p className="text-muted-foreground">@alexchen</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['1,250', 'Reputation'],
                ['48', 'Extras'],
                ['12', 'Threads'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3"
                >
                  <div className="text-xl font-bold text-accent">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">Recent activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-xl font-bold text-foreground">Profile status</h2>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              This profile is demo data. Later it will be backed by your auth provider
              and PageExtras reputation system.
            </p>
            <div className="rounded-lg bg-accent/10 p-4 text-sm text-muted-foreground">
              Public profile route planned: <span className="text-foreground">/u/alexchen</span>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  )
}
