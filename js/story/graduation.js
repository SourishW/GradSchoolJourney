// Graduation. Every path arrives here. Who stands beside her depends on the
// choices; the advisor's line is the one every new student should hear.

const hasSupport = (s) => s.flags.friends || s.flags.reachedOut;

export const graduation = {
  card_graduation: {
    type: 'card',
    text: 'Some years after the first week.\nThe exact number does not matter.',
    enter: { effects: { stamina: 1, stress: -1 } },
    next: 'graduation_ceremony',
  },

  graduation_ceremony: {
    bg: 'graduation_hall',
    lesson: 'pick_the_right_path',
    cast: [
      { who: 'amara', x: 300, pose: 'grad' },
      { who: 'park', x: 460 },
      { who: 'daniel', x: 600, pose: 'happy', when: hasSupport },
      { who: 'priya', x: 690, pose: 'happy', when: (s) => s.flags.friends },
      { who: 'jun', x: 690, pose: 'happy', when: (s) => !s.flags.friends && s.flags.violin },
      { who: 'sam', x: 120, pose: 'happy', when: (s) => s.flags.mentored },
    ],
    lines: [
      { who: 'narrator', text: 'A hall. A banner. A hat that will not sit straight on her hair.' },
      { who: 'park', text: 'In graduate school there are always two choices. The hard path, which is hard. And the easy path.' },
      { who: 'park', text: 'You must always pick the right one. Nobody tells you which one it is. Mostly, you already know.' },
      { who: 'park', pose: 'kind', text: 'Dr. Amara learned which was which the way everyone does: by picking wrong first, and standing back up.' },
      { who: 'narrator', when: hasSupport, text: 'Daniel whoops from the second row. He has brought a cake. It says DOCTOR and nothing is crossed out.' },
      { who: 'narrator', when: (s) => s.flags.friends, text: 'Priya is already crying. She brought tissues for both of them.' },
      { who: 'narrator', when: (s) => s.flags.violin, text: 'The string band plays her off the stage. Badly in places. Joyfully throughout.' },
      { who: 'narrator', when: (s) => s.flags.mentored, text: 'Sam, now a second-year, is taking notes. He has a plan B written down.' },
      { who: 'narrator', when: (s) => !hasSupport(s), text: 'The hall is full of people she did not let herself know. She knows that now. It is the last lesson, and it arrives on time.' },
      { who: 'amara', pose: 'grad', text: 'Okay.', effects: { happiness: 1, stress: -1 } },
    ],
    next: 'ending',
  },

  ending: {
    type: 'ending',
    bg: 'graduation_hall',
    cast: [{ who: 'amara', x: 384, pose: 'grad' }],
  },
};
