import { SiteShell } from '@/components/site/SiteShell'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | PageExtras',
  description: 'Terms for using PageExtras.',
}

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-3 text-sm font-semibold text-accent">PageExtras</p>
        <h1 className="mb-3 text-4xl font-bold text-foreground">Terms of Service</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: July 11, 2026</p>

        <div className="space-y-8 rounded-2xl border border-border bg-card p-6 leading-relaxed md:p-8">
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Agreement</h2>
            <p className="text-muted-foreground">
              By using PageExtras, you agree to these Terms of Service. If you do not
              agree, do not use the PageExtras website, browser extension, or API-backed
              discussion features.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">What PageExtras does</h2>
            <p className="text-muted-foreground">
              PageExtras provides a community discussion layer for webpages. Users can
              view, post, reply to, vote on, edit, delete, and report discussion content
              associated with webpages.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Your account</h2>
            <p className="text-muted-foreground">
              You are responsible for keeping your account secure and for activity that
              happens through your account. You must provide accurate information where
              required and may not impersonate another person or misrepresent your
              identity.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">User content</h2>
            <p className="mb-3 text-muted-foreground">
              You are responsible for the comments, replies, reports, usernames, and
              other content you submit. Do not submit content that is unlawful, abusive,
              harassing, hateful, spammy, malicious, or violates someone else&apos;s rights.
            </p>
            <p className="text-muted-foreground">
              By submitting content, you give PageExtras permission to store, display,
              moderate, and process that content as needed to operate the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Moderation</h2>
            <p className="text-muted-foreground">
              We may remove content, restrict access, or take other action if we believe
              content or behavior violates these terms, harms the service, or creates
              risk for other users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Acceptable use</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Do not use PageExtras to harass, threaten, or abuse others.</li>
              <li>Do not post spam, malware, phishing links, or deceptive content.</li>
              <li>Do not attempt to bypass security, rate limits, or access controls.</li>
              <li>Do not scrape, overload, or disrupt the service.</li>
              <li>Do not use PageExtras for unlawful activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Service availability</h2>
            <p className="text-muted-foreground">
              PageExtras is provided as-is and may change, break, pause, or become
              unavailable. We do not guarantee uninterrupted access, data availability, or
              compatibility with every website or browser environment.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Limitation of liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent allowed by law, PageExtras and its developer are not
              liable for indirect, incidental, special, consequential, or punitive damages
              arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Changes to these terms</h2>
            <p className="text-muted-foreground">
              We may update these terms as PageExtras changes. If we make material
              changes, we will update the date above and publish the new terms on this
              page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Privacy</h2>
            <p className="text-muted-foreground">
              Please read our{' '}
              <Link className="text-accent hover:underline" href="/privacy">
                Privacy Policy
              </Link>{' '}
              to understand how PageExtras handles information.
            </p>
          </section>
        </div>
      </section>
    </SiteShell>
  )
}
