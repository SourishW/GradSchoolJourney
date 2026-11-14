// The rejection. Day one is the floor giving way. With friends, there is cake.
// Without them, the path goes through the low point first.

export const theRejection = {
  rejection_day_one: {
    bg: 'apartment',
    lesson: 'rejection_is_normal',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'email', text: 'We regret to inform you that your submission was not accepted. Reviews are attached. Reviewer 2 raises concerns about the baseline.' },
      { who: 'amara', pose: 'sad', text: '...' },
      { who: 'narrator', text: 'Day one feels like the floor is gone. Not as a figure of speech. Her legs actually feel it.', effects: { stress: 2, happiness: -3 } },
      { who: 'narrator', text: 'Reviewer 2 is wrong about the baseline. It does not help that Reviewer 2 is wrong.' },
      { who: 'narrator', text: 'Reviewer 1 is right about the ablation. That helps even less, today.' },
    ],
    next: (s) => (s.flags.friends ? 'cake' : 'disappearing'),
  },

  cake: {
    bg: 'apartment',
    lesson: 'support_network',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 144, pose: 'sad' }, { who: 'priya', x: 464, pose: 'happy', prop: 'cake' }, { who: 'daniel', x: 640 }],
    lines: [
      { who: 'narrator', text: 'A knock. Then a louder knock.' },
      { who: 'priya', text: 'We brought a cake. It says REJECT and then I crossed it out with icing.' },
      { who: 'daniel', pose: 'happy', text: 'Rule two.' },
      { who: 'amara', pose: 'cry', text: 'I am not crying about a cake.' },
      { who: 'priya', pose: 'kind', text: 'You are allowed to cry about a cake.' },
      { who: 'narrator', text: 'She cries about the cake. Nobody minds. Priya finds plates.' },
      { who: 'daniel', pose: 'idle', text: 'When you are ready, not tonight: Reviewer 1 is right about the ablation. We can fix that in a weekend.' },
      { who: 'daniel', text: 'Reviewer 2 is wrong, and we will say so. Politely. With a plot.' },
      { who: 'amara', pose: 'happy', text: 'Not tonight.', effects: { happiness: 2, stress: -3, stamina: 1 }, set: { cakeScene: true } },
      { who: 'priya', pose: 'happy', text: 'Not tonight. Tonight is cake.' },
    ],
    next: 'counseling_mention',
  },

  counseling_mention: {
    bg: 'apartment',
    bgVariant: 'night',
    lesson: 'seek_help',
    cast: [{ who: 'amara', x: 192 }, { who: 'priya', x: 544 }],
    lines: [
      { who: 'priya', text: 'One more thing, and then I will stop mothering you.' },
      { who: 'priya', text: 'The counseling center. Third floor of the health building. The college pays for it. I go.' },
      { who: 'amara', text: 'Is something wrong?' },
      { who: 'priya', pose: 'kind', text: 'No. Grad school is just a lot, and talking to someone whose job it is helps. Book one session. See.' },
      { who: 'amara', pose: 'happy', text: 'Okay. One session.', effects: { stress: -2 }, set: { counseling: true } },
    ],
    next: 'card_day_seven',
  },

  card_day_seven: {
    type: 'card',
    text: 'Day seven.\nThe floor is back.',
    enter: { effects: { stamina: 2, stress: -1, happiness: 1 } },
    next: 'resubmit',
  },
};
