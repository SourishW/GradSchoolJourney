// Five endings. All of them graduate. They differ in who was in the room and
// how far she had to walk to get there.

export const ENDINGS = [
  {
    id: 'honest',
    title: 'THE HONEST ONE',
    lines: [
      'She fabricated once. She was caught, and she chose the hard path afterward: every number checked, every table earned back.',
      'The degree on the wall is real because she made sure of it.',
    ],
  },
  {
    id: 'long_way_back',
    title: 'THE LONG WAY BACK',
    lines: [
      'She spent the first years alone, and the bottom was a kitchen floor. Then a text, a door, a cafe, a chair saved for her.',
      'Recovery took longer than seven days. It took anyway. There is always a path to the stage.',
    ],
  },
  {
    id: 'rebuilt',
    title: 'REBUILT',
    lines: [
      'A sleepless night, a shortcut, a deleted directory or a bug she shipped. Then an apology without excuses, and an advisor who said: rest, then rebuild.',
      'She rebuilt. With verification in the schedule this time.',
    ],
  },
  {
    id: 'whole',
    title: 'WHOLE',
    lines: [
      'Friends on day one. Cake on the rejection. Thursdays with a violin and a guilt that got quieter than the music.',
      'She graduates with the people who saw her through, and a life that was never only the lab.',
    ],
  },
  {
    id: 'steady',
    title: 'STEADY',
    lines: [
      'She built community early, planned for failure, and told the truth when it cost her. The violin stayed under the bed.',
      'She graduates whole. There is a case under the bed that is still waiting.',
    ],
  },
];

export function computeEnding(flags) {
  const pick = (id) => ENDINGS.find((ending) => ending.id === id);
  if (flags.fabricated) return pick('honest');
  if (!flags.friends) return pick('long_way_back');
  if (flags.mistake) return pick('rebuilt');
  if (flags.violin) return pick('whole');
  return pick('steady');
}
