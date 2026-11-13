// Arrival. Two choices that echo through the whole game: does she go to the
// social (friends), and does she pick the violin back up (life beyond lab)?

export const prologue = {
  title: { type: 'title', next: 'card_first_week' },

  card_first_week: {
    type: 'card',
    text: 'The first week.\nOr thereabouts.',
    next: 'arrival_lab',
  },

  arrival_lab: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 192 }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'narrator', text: 'A lab. Twelve desks, four working monitors, one whiteboard wiped clean, markers lined up in the tray.' },
      { who: 'narrator', text: 'Amara finds the desk with her name taped to it. The tape is crooked.' },
      { who: 'daniel', pose: 'happy', text: "You're Amara? Daniel. Fourth year. That's your machine. It works, mostly." },
      { who: 'daniel', pose: 'idle', text: "The cluster goes down about twice a week. When it does, ask me before you fight it alone." },
      { who: 'daniel', text: "Everyone fights it alone their first year. Don't." },
      { who: 'amara', pose: 'happy', text: 'Noted. Thank you.' },
      { who: 'narrator', text: 'A second-year, Priya, rolls her chair over from the next desk.' },
    ],
    next: 'priya_invite',
  },

  priya_invite: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 192 }, { who: 'priya', x: 544, pose: 'happy' }],
    lines: [
      { who: 'priya', text: 'New person! Department social tonight. Seven. The cafe on Fourth. Free food.' },
      { who: 'priya', pose: 'idle', text: 'Good food, even. The department splurges exactly once a year.' },
      { who: 'amara', text: 'I was going to read the papers Dr. Park sent...' },
      { who: 'priya', text: 'The papers will still be there tomorrow. The people might not be.' },
      { who: 'narrator', text: 'Two paths. Both reasonable. Only one of them is the right one.' },
    ],
    choices: [
      {
        text: 'Go to the social. Meet people, even though it is exhausting.',
        effects: { happiness: 3, stamina: -1, stress: -1 },
        set: { friends: true },
        next: 'social',
      },
      {
        text: 'Stay in and read the papers. Research comes first.',
        effects: { stress: 1, happiness: -1 },
        set: { friends: false },
        next: 'alone_evening',
      },
    ],
  },

  social: {
    bg: 'cafe',
    lesson: 'build_relationships',
    cast: [{ who: 'amara', x: 144 }, { who: 'priya', x: 464, pose: 'happy' }, { who: 'daniel', x: 640 }],
    lines: [
      { who: 'narrator', text: 'The food is good. The conversation is better.' },
      { who: 'daniel', text: "Rule one of this lab: nobody debugs the scheduler alone after 10pm. Rule two: there's always cake when a paper gets rejected." },
      { who: 'amara', pose: 'happy', text: 'When? Not if?' },
      { who: 'daniel', pose: 'happy', text: 'When.' },
      { who: 'priya', text: 'Different topic. I play viola in a string band. We do covers at a bar on Thursdays. Badly. Joyfully.' },
      { who: 'priya', text: 'We lost our violinist to a postdoc in Zurich. You do not happen to...' },
      { who: 'amara', pose: 'idle', text: 'I played. In high school. The violin is in a case under my bed.' },
      { who: 'priya', pose: 'happy', text: 'Thursday. Eight. No pressure. Some pressure.' },
    ],
    choices: [
      {
        text: 'Audition Thursday. One evening a week is not going to sink a PhD.',
        effects: { happiness: 3 },
        set: { violin: true },
        next: 'card_months',
      },
      {
        text: 'Maybe once research settles down.',
        effects: { stress: 1 },
        set: { violin: false },
        next: 'card_months',
      },
    ],
  },

  alone_evening: {
    bg: 'apartment',
    lesson: 'build_relationships',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'narrator', text: 'She reads three papers. She understands one and a half of them.' },
      { who: 'narrator', text: 'The building is quiet in the way that is not peaceful.', effects: { happiness: -1 } },
      { who: 'narrator', text: 'In the mail: a flyer. "Fourth Street Strings. Violinist wanted. Thursdays. We are not good. Come anyway."' },
      { who: 'amara', pose: 'sad', text: 'The violin is under the bed. It has been under a bed for six years.' },
    ],
    choices: [
      {
        text: 'Audition anyway. One evening a week.',
        effects: { happiness: 3 },
        set: { violin: true },
        next: 'card_months',
      },
      {
        text: 'Not now. First year is for research.',
        effects: { stress: 1 },
        set: { violin: false },
        next: 'card_months',
      },
    ],
  },
};
