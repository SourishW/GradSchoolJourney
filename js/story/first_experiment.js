// The first experiment fails. It always fails. What changes is whether she
// planned for that before she pressed run.

export const firstExperiment = {
  card_months: {
    type: 'card',
    text: 'Weeks blur into months.',
    enter: { effects: { stamina: 2, stress: -1 } },
    next: 'first_project',
  },

  first_project: {
    bg: 'office',
    cast: [{ who: 'amara', x: 192 }, { who: 'park', x: 544 }],
    lines: [
      { who: 'park', text: 'Your first project. A scheduler for mixed GPU workloads. The baseline is decent. Beat it.' },
      { who: 'amara', text: 'How long do I have?' },
      { who: 'park', pose: 'kind', text: "Longer than you think. Less than you'd like." },
      { who: 'park', pose: 'idle', text: 'One more thing. Experiments fail. That is their normal outcome. Plan accordingly.' },
    ],
    next: 'first_plan',
  },

  first_plan: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'narrator', text: 'A blank file. A cluster allocation that expires Friday.' },
    ],
    choices: [
      {
        text: 'Write the plan first: what I expect to see, and what I do if I do not see it.',
        effects: { stress: -2 },
        set: { planned: true },
        next: 'first_result',
      },
      {
        text: 'Start coding now. Planning is procrastination with a spreadsheet.',
        set: { planned: false },
        next: 'first_result',
      },
    ],
  },

  first_result: {
    bg: 'lab',
    lesson: 'plan_for_failure',
    cast: [{ who: 'amara', x: 192 }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'narrator', text: 'The first result comes back on a Tuesday. The baseline wins. By a lot.' },
      { who: 'amara', pose: 'sad', text: '...', effects: { happiness: -1 } },
      // Planned path: the failure is information, not a verdict.
      { who: 'amara', pose: 'idle', when: (s) => s.flags.planned, text: "Okay. That's... fine. Hypothesis two was always the stronger one. Switching to priority aging." },
      { who: 'daniel', pose: 'happy', when: (s) => s.flags.planned, text: 'You already had a plan B written down?' },
      { who: 'amara', pose: 'happy', when: (s) => s.flags.planned, text: 'Dr. Park said experiments fail. The question is whether you knew what you would do next before it did.' },
      { who: 'narrator', when: (s) => s.flags.planned, text: 'The second run takes two days. It does not beat the baseline either. The third one does.', effects: { stress: -1, happiness: 1 } },
      // Unplanned path: three days staring at one plot.
      { who: 'narrator', when: (s) => !s.flags.planned, text: 'Wednesday. Thursday. Friday. The same plot. She keeps re-running it, as if the numbers might change their minds.', effects: { stress: 2, happiness: -1, stamina: -2 } },
      { who: 'daniel', when: (s) => !s.flags.planned, text: "You've been looking at the same plot for three days." },
    ],
    next: (s) => (s.flags.planned ? 'card_deadline' : 'first_stuck'),
  },

  first_stuck: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'daniel', text: 'What was the plan if it lost to the baseline?' },
      { who: 'amara', text: 'There was no plan if it lost.' },
    ],
    choices: [
      {
        text: 'Admit I am stuck. Ask Daniel to look at it with me.',
        effects: { happiness: 1, stress: -1 },
        next: 'first_unstuck_together',
      },
      {
        text: 'I should be able to figure this out by myself.',
        effects: { stress: 1 },
        next: 'first_unstuck_alone',
      },
    ],
  },

  first_unstuck_together: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 192 }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'narrator', text: 'Daniel pulls a chair over. Forty minutes later there are three hypotheses on the whiteboard and a schedule for testing them.' },
      { who: 'daniel', pose: 'happy', text: 'Labmates are for the technical stuff. That is literally what we are for.' },
      { who: 'amara', pose: 'happy', text: 'Next time I write this down before I run anything.', effects: { happiness: 1, stamina: 1 } },
    ],
    next: 'card_deadline',
  },

  first_unstuck_alone: {
    bg: 'office',
    cast: [{ who: 'amara', x: 192, pose: 'tired' }, { who: 'park', x: 544 }],
    lines: [
      { who: 'narrator', text: 'Another week passes before she finds a second idea. She finds it the way you find your keys: by accident, exhausted.', effects: { stamina: -2 } },
      { who: 'park', text: 'Next time, before you run anything, write down what you expect and what you will do if you are wrong.' },
      { who: 'park', pose: 'kind', text: 'Failure is the normal outcome. Plan for it, and it stops being a crisis and becomes a Tuesday.' },
      { who: 'amara', pose: 'idle', text: 'Understood.', effects: { stress: -1 } },
    ],
    next: 'card_deadline',
  },
};
