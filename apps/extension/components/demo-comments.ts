import type { PageExtraComment, PageInfo } from './types'

export const getDemoComments = (page: PageInfo): PageExtraComment[] => [
  {
    id: 'demo-1',
    author: 'Alex Chen',
    reputation: 1250,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    content: `Demo note for this page on ${page.domain}. This is where PageExtras will show community discussion once the backend is connected.`,
    upvotes: 87,
    downvotes: 3,
    replies: [
      {
        id: 'demo-1-1',
        author: 'Jordan Lee',
        reputation: 450,
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        content:
          'The extension shell is already reading the current tab title and domain.',
        upvotes: 24,
        downvotes: 0,
      },
    ],
  },
  {
    id: 'demo-2',
    author: 'Sam Rivera',
    reputation: 890,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    content:
      'Next step: replace these demo comments with browser storage, then an API keyed by normalized page URL.',
    upvotes: 42,
    downvotes: 2,
  },
  {
    id: 'demo-3',
    author: 'Taylor Morgan',
    reputation: 320,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    content:
      'This is demo content only, so testing on any site does not mean that site has an official PageExtras integration.',
    upvotes: 18,
    downvotes: 1,
  },
]
