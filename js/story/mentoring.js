// Another first week, not hers. The loop closes: she hands Sam the lesson
// she had to learn the hard way.

export const mentoring = {
  card_another_first_week: {
    type: 'card',
    text: 'Another first week.\nNot hers.',
    next: 'mentoring_sam',
  },

  mentoring_sam: {
    bg: 'lab',
    cast: [{ who: 'sam', x: 192, pose: 'sad' }, { who: 'amara', x: 544 }],
    lines: [
      { who: 'narrator', text: 'A first-year named Sam has been staring at the same flat plot for two days. Amara recognizes the posture.' },
      { who: 'sam', text: 'The baseline beat me. On the first try. I think maybe I am not...' },
      { who: 'narrator', text: 'Two paths. She knows which one is harder. She knows which one is right.' },
    ],
    choices: [
      {
        text: 'Pull a chair over. Plan the next three steps together.',
        effects: { happiness: 2, stress: -1 },
        set: { mentored: true },
        next: 'mentoring_plan',
      },
      {
        text: 'Tell him it gets better. Go back to work.',
        set: { mentored: false },
        next: 'mentoring_brief',
      },
    ],
  },

  mentoring_plan: {
    bg: 'lab',
    lesson: 'pay_it_forward',
    cast: [{ who: 'sam', x: 192 }, { who: 'amara', x: 544, pose: 'happy' }],
    lines: [
      { who: 'amara', text: 'Experiments fail. That is the normal outcome. Nobody told me that clearly enough, so: that is the normal outcome.' },
      { who: 'amara', pose: 'idle', text: 'Before every run, write down what you expect to see and what you will do if you do not see it. Then failing is just picking the next line.' },
      { who: 'sam', pose: 'idle', text: 'And if I run out of lines?' },
      { who: 'amara', pose: 'happy', text: 'Then you ask Daniel, or me. That is literally what labmates are for.' },
      { who: 'amara', text: 'Also: department social tonight. Free food, and it is actually good. Come.' },
      { who: 'sam', pose: 'happy', text: 'Okay.' },
    ],
    next: 'card_graduation',
  },

  mentoring_brief: {
    bg: 'lab',
    lesson: 'pay_it_forward',
    cast: [{ who: 'sam', x: 192, pose: 'sad' }, { who: 'amara', x: 544 }],
    lines: [
      { who: 'amara', text: 'It gets better. Really.' },
      { who: 'narrator', text: 'It is true. It is also not what he needed, and she knows it on the walk back to her desk.' },
      { who: 'narrator', text: 'The next morning she leaves a note on his monitor: "Write down what you expect before you run it. Ask Daniel or me. Social Thursday." It is a start.', effects: { happiness: 1 } },
    ],
    next: 'card_graduation',
  },
};
