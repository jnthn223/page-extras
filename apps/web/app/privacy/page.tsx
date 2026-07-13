import { SiteShell } from '@/components/site/SiteShell'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | PageExtras',
  description: 'How PageExtras collects, uses, and protects information.',
}

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-3 text-sm font-semibold text-accent">PageExtras</p>
        <h1 className="mb-3 text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: July 11, 2026</p>

        <div className="space-y-8 rounded-2xl border border-border bg-card p-6 leading-relaxed md:p-8">
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Overview</h2>
            <p className="text-muted-foreground">
              PageExtras is a browser extension and web app that adds community
              discussions to webpages. This policy explains what information we collect,
              how we use it, and what choices you have.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Information we collect</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Account information from Firebase Authentication, such as your user ID
                and sign-in provider.
              </li>
              <li>
                Public PageExtras profile details you choose, such as your username.
              </li>
              <li>
                User content you submit, including comments, replies, votes, and reports.
              </li>
              <li>
                Page information needed to attach discussions to webpages, such as page
                URL, domain, and title.
              </li>
              <li>
                Basic technical information such as request logs, timestamps, and error
                details used to secure and maintain the service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Browser extension data</h2>
            <p className="text-muted-foreground">
              The PageExtras extension may store your sign-in session and basic
              preferences in browser extension storage so you can stay signed in and use
              the overlay. The extension reads the current page URL, domain, and title so
              it can load the correct discussion thread for that page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">How we use information</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>To authenticate users and protect accounts.</li>
              <li>To show, create, edit, delete, vote on, and report PageExtras content.</li>
              <li>To connect discussion threads to the correct webpages.</li>
              <li>To prevent abuse, debug issues, and improve reliability.</li>
              <li>To comply with legal obligations and enforce our terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">What is public</h2>
            <p className="text-muted-foreground">
              Comments, replies, votes, and public usernames may be visible to other
              PageExtras users. Do not post private, sensitive, or confidential
              information in public comments.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Third-party services</h2>
            <p className="text-muted-foreground">
              PageExtras uses Firebase services for authentication and hosting. These
              services are provided by Google and are subject to Google&apos;s own privacy
              and security practices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Data deletion</h2>
            <p className="text-muted-foreground">
              If you want to request deletion of your PageExtras account data or user
              content, contact us through the support information available on the
              PageExtras website or Chrome Web Store listing.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Changes to this policy</h2>
            <p className="text-muted-foreground">
              We may update this policy as PageExtras changes. If we make material
              changes, we will update the date above and publish the new policy on this
              page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">Contact</h2>
            <p className="text-muted-foreground">
              For privacy questions, contact the PageExtras developer through the support
              details on the Chrome Web Store listing or visit{' '}
              <Link className="text-accent hover:underline" href="/">
                pageextras.com
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </SiteShell>
  )
}
