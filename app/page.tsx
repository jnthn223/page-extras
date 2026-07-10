'use client'

import { PageExtras } from '@/components/PageExtras'
import type { FC } from 'react'

const mockComments = [
  {
    id: '1',
    author: 'Alex Chen',
    avatar: 'A',
    reputation: 1250,
    timestamp: '2 hours ago',
    content:
      'This is a really insightful perspective on the topic. I particularly appreciate how the author balances different viewpoints.',
    upvotes: 87,
    downvotes: 3,
    replies: [
      {
        id: '1-1',
        author: 'Jordan Lee',
        avatar: 'J',
        reputation: 450,
        timestamp: '1 hour ago',
        content: 'I completely agree! The writing is clear and well-researched.',
        upvotes: 24,
        downvotes: 0,
      },
    ],
  },
  {
    id: '2',
    author: 'Sam Rivera',
    avatar: 'S',
    reputation: 890,
    timestamp: '1 hour ago',
    content:
      'Has anyone else noticed the connection to the broader trend discussed in the community?',
    upvotes: 42,
    downvotes: 2,
  },
  {
    id: '3',
    author: 'Taylor Morgan',
    avatar: 'T',
    reputation: 320,
    timestamp: '30 minutes ago',
    content:
      'Great read! I would love to see more content exploring this angle in future articles.',
    upvotes: 18,
    downvotes: 1,
  },
  {
    id: '4',
    author: 'Casey Kim',
    avatar: 'C',
    reputation: 156,
    timestamp: '15 minutes ago',
    content: 'Thanks for sharing. Definitely got me thinking about the implications.',
    upvotes: 7,
    downvotes: 0,
  },
]

const Page: FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Hero section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12 animate-scale-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            PageExtras
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            A community discussion layer for every webpage. Join thoughtful
            conversations happening right now.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: '💬',
              title: 'Community Discussions',
              desc: 'Engage in meaningful conversations about any page on the web.',
            },
            {
              icon: '🌐',
              title: 'Decentralized Comments',
              desc: 'Comments live everywhere, not controlled by any single platform.',
            },
            {
              icon: '⭐',
              title: 'Reputation System',
              desc: 'Build credibility through thoughtful contributions and community votes.',
            },
            {
              icon: '🎯',
              title: 'Threaded Replies',
              desc: 'Follow conversation branches and respond directly to specific comments.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Example section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">
            See it in action
          </h2>
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
            <div className="prose prose-invert dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                The Future of Web Discussion
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                Traditional comment sections are often controlled by website owners and subject to
                algorithmic manipulation. PageExtras reimagines this by creating a truly
                community-owned discussion layer that exists independently across the web.
              </p>
              <p className="text-foreground leading-relaxed mb-4">
                Every page becomes a meeting place for genuine conversation. Votes are genuine,
                discussions are threaded, and community reputation matters.
              </p>
              <p className="text-foreground leading-relaxed">
                The extension is designed to feel native to the web—subtle when not needed, powerful
                when engaged with. Open-source, transparent, and built for the community.
              </p>
            </div>

            {/* Demo hint */}
            <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-sm text-muted-foreground">
                👉 Look for the floating action button in the bottom-right corner to see PageExtras
                in action on this page.
              </p>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { number: '127', label: 'Extras on this page' },
            { number: '4', label: 'Threaded replies' },
            { number: '⭐⭐', label: 'Top contributor' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl bg-accent/5 border border-accent/20"
            >
              <div className="text-3xl font-bold text-accent mb-2">
                {stat.number}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <p className="text-lg text-muted-foreground mb-4">
            Try PageExtras right now on any webpage
          </p>
          <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
            Install Extension
          </button>
        </div>
      </div>

      {/* PageExtras component */}
      <PageExtras
        pageTitle="The Future of Web Discussion"
        pageDomain="pageextras.io"
        initialComments={mockComments}
      />
    </main>
  )
}

export default Page
