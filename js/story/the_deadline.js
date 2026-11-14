// The deadline. Sleep or do not; verify or do not; and then, on every path,
// one honest table and one tempting shortcut.
//
// Sets flags.mistake to null | 'deleted' | 'bug' and flags.fabricated.

import { LOW_STAMINA } from '../engine/stats.js';

const tired = (s) => s.stats.stamina < LOW_STAMINA;

export const theDeadline = {
  card_deadline: {
    type: 'card',
    text: 'A season later.\nA deadline.',
    next: 'deadline_eve',
  },

  deadline_eve: {
    bg: 'apartment',
    lesson: 'prioritize_health',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'narrator', text: 'Ten days to the submission. The results are close. Not done. Close.' },
      { who: 'narrator', text: 'It is 1am. You can choose to keep working, but your stamina will drop. The bar in the corner is not decoration.' },
    ],
    choices: [
      {
        text: 'Sleep. Set the alarm for six. Tired brains write bugs.',
        effects: { stamina: 2, stress: -1 },
        set: { sleptWell: true },
        next: 'deadline_lab',
      },
      {
        text: 'Work through the night. Every hour counts.',
        effects: { stamina: -6, stress: 2 },
        set: { sleptWell: false },
        next: 'deadline_lab',
      },
    ],
  },

  deadline_lab: {
    bg: 'lab',
    lesson: 'verify_before_shipping',
    bgVariant: 'deadline-night',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'narrator', when: (s) => !tired(s), text: 'Rested, the bug in the logging script takes ten minutes to find instead of three hours.' },
      { who: 'amara', when: (s) => !tired(s), text: 'The main table needs one more verification run. That costs a day I do not really have.' },
      { who: 'narrator', when: tired, text: 'Morning. She did not sleep. Her eyes will not focus; she reads the same line four times and it means something different each time.', effects: { happiness: -2 } },
      { who: 'amara', pose: 'sad', when: tired, text: 'I cannot look at this anymore. I need the sweep done by morning.' },
    ],
    choices: [
      // Rested options.
      {
        when: (s) => !tired(s),
        text: 'Run the verification. Cut the fourth experiment if I have to.',
        effects: { stress: -1 },
        set: { mistake: null },
        next: 'honest_table',
      },
      {
        when: (s) => !tired(s),
        text: 'Skip it. The numbers look right. Ship.',
        effects: { stress: 1 },
        set: { mistake: 'bug' },
        next: 'bug_table',
      },
      // Tired options.
      {
        when: tired,
        text: (s) => `Let the agent finish it with --dangerously-skip-permissions. ${s.flags.friends ? "Go to Priya's party." : 'Go to bed.'}`,
        set: { mistake: 'deleted' },
        next: 'agent_deletes',
      },
      {
        when: tired,
        text: 'Push the numbers as they are. No time to verify.',
        effects: { stress: 1 },
        set: { mistake: 'bug' },
        next: 'bug_table',
      },
      {
        when: tired,
        text: 'Email Dr. Park: I am dropping one experiment so I can sleep and verify the rest.',
        effects: { stress: -2, stamina: 3 },
        set: { mistake: null },
        next: 'honest_table',
      },
    ],
  },

  agent_deletes: {
    bg: 'apartment',
    lesson: 'integrity',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 384, pose: 'tired' }],
    lines: [
      { who: 'narrator', text: 'The agent runs for six hours. Nobody watches it. That was the point.' },
      { who: 'terminal', text: 'Task complete. Reorganized project. Removed stale artifacts to reduce clutter: results/, experiments/, checkpoints/. Tests pass (0 tests found).' },
      { who: 'amara', pose: 'shock', text: 'No. No no no.', effects: { happiness: -3 } },
      { who: 'narrator', text: 'Three months of results. Not corrupted. Deleted, cleanly, by something she told to stop asking her questions.' },
      { who: 'narrator', text: 'The tool did exactly what it was permitted to do. The failure was not in the tool.' },
      { who: 'amara', pose: 'sad', text: 'I was not working. I was gambling. And I was not even in the room.', effects: { stress: 2 } },
      { who: 'narrator', text: 'Her notebook has some of the numbers. Not all. Rerunning everything takes weeks. The deadline is in nine days.' },
    ],
    choices: [
      {
        text: 'Fill in the missing cells with what they "should" be. Re-run later, quietly.',
        set: { fabricated: true },
        effects: { stress: 2 },
        next: 'card_submitted',
      },
      {
        text: 'Call Dr. Park tonight. Submit what is real, or do not submit.',
        set: { fabricated: false },
        effects: { stress: -2 },
        next: 'card_submitted',
      },
    ],
  },

  bug_table: {
    bg: 'lab',
    lesson: 'integrity',
    bgVariant: 'deadline-night',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'narrator', text: 'Five runs. Four agree. One does not; it is nine points lower, for no reason she can see.' },
      { who: 'amara', pose: 'tired', text: 'Probably a cluster hiccup.' },
      { who: 'narrator', text: 'Probably.' },
    ],
    choices: [
      {
        text: 'Drop the odd run. Report the clean four.',
        set: { fabricated: true },
        effects: { stress: 1 },
        next: 'card_submitted',
      },
      {
        text: 'Report all five. Note the variance in the text.',
        set: { fabricated: false },
        effects: { stress: -1 },
        next: 'card_submitted',
      },
    ],
  },

  honest_table: {
    bg: 'lab',
    lesson: 'integrity',
    bgVariant: 'deadline',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'narrator', text: 'The verification run finishes. The main result holds. One row does not: in the small-batch setting the baseline wins.' },
      { who: 'amara', text: 'One row. Out of twelve. Nobody would notice if it were not there.' },
    ],
    choices: [
      {
        text: 'Leave that setting out of the table.',
        set: { fabricated: true },
        effects: { stress: 1 },
        next: 'card_submitted',
      },
      {
        text: 'Report it. Write a paragraph about why it happens.',
        set: { fabricated: false },
        effects: { stress: -1 },
        next: 'card_submitted',
      },
    ],
  },

  card_submitted: {
    type: 'card',
    text: (s) => (s.flags.fabricated
      ? 'The submission goes out.\nThe logs stay on the cluster.'
      : 'The submission goes out.\nShe sleeps for eleven hours.'),
    next: (s) => {
      if (s.flags.fabricated) return 'grilling_fabricated';
      if (s.flags.mistake === 'deleted') return 'grilling_deleted';
      if (s.flags.mistake === 'bug') return 'bug_found';
      return 'check_in';
    },
  },
};
