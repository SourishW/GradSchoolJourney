// The advisor. Angry first, for a good reason; then, once Amara owns it, the
// same person turns out to be the one who tells her to rest.

const SOFTENING_LINES = [
  { who: 'park', pose: 'kind', text: 'Sit down. Properly this time.' },
  { who: 'park', pose: 'idle', text: 'How much have you slept in the last forty-eight hours?' },
  { who: 'amara', pose: 'tired', text: 'Not at all.' },
  { who: 'park', text: 'That is the actual bug. Everything else today is a symptom of it.' },
  { who: 'park', pose: 'kind', text: 'I am angry because I expected better. And because I still do.' },
  { who: 'park', pose: 'idle', text: 'Burnout is not a badge. It is a failure mode, like any other. Take the weekend. All of it. Then we rebuild this the right way: verification in the schedule, not after it.' },
  { who: 'amara', pose: 'idle', text: 'Okay.', effects: { stress: -3, stamina: 3, happiness: 1 } },
];

export const theGrilling = {
  grilling_fabricated: {
    bg: 'office',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'park', x: 544, pose: 'angry' }],
    lines: [
      { who: 'narrator', text: 'Daniel, checking a related result, pulls her logs. The logs and the table disagree. He tells Dr. Park, because that is what you do.' },
      { who: 'park', text: 'Look at this table. Now look at your logs. Explain the difference to me.', effects: { stress: 3 } },
      { who: 'amara', text: 'I...' },
      { who: 'park', text: 'Do you understand what this is called? This is called academic dishonesty. Fabrication.' },
      { who: 'park', text: 'If this had gone out under my name, it would have ended both of us.', effects: { happiness: -2 } },
      { who: 'park', text: 'Not the deadline. Not the cluster. This.' },
    ],
    choices: [
      { text: 'Apologize. No excuses. Own all of it.', set: { apologized: true }, next: 'grilling_softens' },
      { text: 'Explain: the deadline, the cluster was down, there was no time...', set: { deflected: true }, effects: { stress: 2 }, next: 'grilling_deflect' },
    ],
  },

  grilling_deleted: {
    bg: 'office',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'park', x: 544, pose: 'angry' }],
    lines: [
      { who: 'park', text: 'You gave a program permission to do anything. You told it not to ask. And then you left the building.', effects: { stress: 2 } },
      { who: 'amara', text: 'It was supposed to finish the sweep.' },
      { who: 'park', text: 'That was not a tool failure. That was an attention failure. The tool was present. You were not.' },
      { who: 'park', text: 'Three months, Amara.', effects: { happiness: -2 } },
    ],
    choices: [
      { text: 'Apologize. No excuses. Own all of it.', set: { apologized: true }, next: 'grilling_softens' },
      { text: 'Explain: the agent should have asked, the deadline, Daniel said the cluster...', set: { deflected: true }, effects: { stress: 2 }, next: 'grilling_deflect' },
    ],
  },

  bug_found: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 192 }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'narrator', text: 'Two days after the submission, Daniel reruns her table for a related project.' },
      { who: 'daniel', text: 'Hey. Your 31% number. I get 9.' },
      { who: 'amara', pose: 'shock', text: 'What?' },
      { who: 'narrator', text: 'An off-by-one in the warm-up window. The kind of bug a verification run catches in an afternoon.', effects: { happiness: -2 } },
      { who: 'narrator', text: 'The odd run was not a cluster hiccup. It was the only honest one.' },
    ],
    next: 'grilling_bug',
  },

  grilling_bug: {
    bg: 'office',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'park', x: 544, pose: 'angry' }],
    lines: [
      { who: 'park', text: 'I quoted your 31% to a colleague this morning. Daniel tells me it is 9.', effects: { stress: 2 } },
      { who: 'park', text: 'A verification run costs one day. This costs the paper, and some of my name with it.' },
      { who: 'park', text: 'Why was there no verification run?' },
    ],
    choices: [
      { text: 'Apologize. No excuses. Own all of it.', set: { apologized: true }, next: 'grilling_softens' },
      { text: 'Explain: the deadline, the cluster was down, I was exhausted...', set: { deflected: true }, effects: { stress: 2 }, next: 'grilling_deflect' },
    ],
  },

  grilling_deflect: {
    bg: 'office',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'park', x: 544, pose: 'angry' }],
    lines: [
      { who: 'park', text: (s) => (s.flags.fabricated ? 'DON\'T GIVE EXCUSES FOR DISHONESTY!' : 'DON\'T GIVE ME EXCUSES!') },
      { who: 'narrator', text: 'The lamp rattles. Then, quieter:' },
      { who: 'park', text: 'The cluster did not choose. The deadline did not choose. Daniel did not choose.' },
      { who: 'park', text: 'Try again.' },
      { who: 'narrator', text: 'A long silence. The lamp hums.' },
    ],
    choices: [
      { text: '...I am sorry. It was my call, and I made it badly.', set: { apologized: true }, next: 'grilling_softens' },
    ],
  },

  grilling_softens: {
    bg: 'office',
    lesson: 'own_it',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'park', x: 544, pose: 'angry' }],
    lines: [
      { who: 'amara', text: 'I am sorry. Not for the deadline. For the decision. I knew it was wrong when I made it.' },
      { who: 'narrator', text: "Something in Dr. Park's shoulders comes down an inch." },
      ...SOFTENING_LINES,
      { who: 'park', when: (s) => s.flags.fabricated, text: 'The paper is withdrawn. Every number you produce for the next year, Daniel checks before I see it.' },
      { who: 'park', when: (s) => s.flags.fabricated, pose: 'kind', text: 'That is not punishment. That is how you earn trust back. People do.' },
      { who: 'park', when: (s) => s.flags.mistake === 'deleted', text: 'And from now on, if a program can delete something, you are in the room while it runs. Present. Watching.' },
    ],
    next: 'card_reviews',
  },

  check_in: {
    bg: 'office',
    lesson: 'own_it',
    cast: [{ who: 'amara', x: 192 }, { who: 'park', x: 544, pose: 'kind' }],
    lines: [
      { who: 'park', text: 'You dropped an experiment to sleep and verify the rest. Good.' },
      { who: 'park', pose: 'idle', text: 'The students who destroy themselves for a deadline rarely finish. The ones who finish learned to pick the hard, boring, correct thing.' },
      { who: 'park', text: 'Next time, the verification run goes in the schedule on day one. Not day sixty-nine.' },
      { who: 'park', pose: 'kind', text: 'And when a run does go wrong, come tell me the same day. Owning it early is most of the fix.' },
      { who: 'amara', pose: 'happy', text: 'Day one. Got it.', effects: { stress: -1, happiness: 1 } },
    ],
    next: 'card_reviews',
  },

  card_reviews: {
    type: 'card',
    text: (s) => (s.flags.fabricated
      ? 'The rebuilt paper goes out, every number checked twice.\nMonths pass. Reviews come back.'
      : 'Months pass.\nReviews come back.'),
    enter: { effects: { stamina: 2, stress: -2, happiness: 1 } },
    next: 'rejection_day_one',
  },
};
