// Resubmission, life beyond the lab, and the night she drafts the email to
// leave. A friend coaches her; she chooses to stay, eyes open.

const hasSupport = (s) => s.flags.friends || s.flags.reachedOut;
const friendName = (s) => (s.flags.friends ? 'priya' : 'daniel');

export const staying = {
  resubmit: {
    bg: 'office',
    lesson: 'rejection_is_normal',
    cast: [{ who: 'amara', x: 192 }, { who: 'park', x: 544 }],
    lines: [
      { who: 'park', text: 'Read the reviews again, now that you can.' },
      { who: 'park', text: "Reviewer 1's point stands. Fix the ablation. Reviewer 2's does not. Answer it anyway, kindly, with a plot." },
      { who: 'park', pose: 'kind', text: 'Every paper I have ever published was rejected first. Every one. Resubmission is not a second chance. It is the normal path.' },
      { who: 'phone', when: hasSupport, text: (s) => (s.flags.friends
        ? "Priya: you've got this. also we are out of cake. unrelated."
        : 'Daniel: Reviewer 2 is still wrong. I put a rebuttal draft in the shared folder for when you want it.') },
      { who: 'amara', pose: 'happy', text: 'Okay. Fixing the ablation. Resubmitting.', effects: { stress: -2 }, set: { resubmitted: true } },
    ],
    next: (s) => (s.flags.violin ? 'concert' : 'quiet_thursday'),
  },

  concert: {
    bg: 'stage',
    lesson: 'life_beyond_lab',
    bgVariant: 'concert',
    cast: [{ who: 'amara', x: 280, pose: 'idle' }, { who: 'jun', x: 600, prop: 'cello' }],
    lines: [
      { who: 'narrator', text: 'Thursday. The bar is half full, which for a string band is a sellout.' },
      { who: 'amara', pose: 'sad', text: 'I should be running the sweep.' },
      { who: 'jun', text: 'The sweep runs without you. That is what clusters are for. Play.' },
      { who: 'narrator', text: 'Jun has played cello for nineteen years and defends their thesis in a month. They seem fine. Suspiciously fine.' },
      { who: 'jun', pose: 'happy', text: 'The guilt does not go away, if that is what you are waiting for. It just gets quieter than the music.' },
      { who: 'amara', pose: 'violin', text: '...' },
      { who: 'narrator', text: 'They play. Badly in places. Joyfully throughout. Nobody in the room is thinking about schedulers.', effects: { happiness: 3, stress: -2 }, set: { concert: true } },
    ],
    next: 'card_time_uneven',
  },

  quiet_thursday: {
    bg: 'apartment',
    lesson: 'life_beyond_lab',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 384 }],
    lines: [
      { who: 'narrator', text: 'Thursday. She works. The apartment is quiet in the way that is not peaceful.', effects: { stress: 1 } },
      { who: 'narrator', text: 'The violin case is still under the bed.' },
    ],
    choices: [
      {
        text: 'Open it.',
        effects: { happiness: 2 },
        set: { violin: true, lateViolin: true },
        next: 'first_notes',
      },
      {
        text: 'Later.',
        next: 'card_time_uneven',
      },
    ],
  },

  first_notes: {
    bg: 'apartment',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 384, pose: 'violin' }],
    lines: [
      { who: 'narrator', text: 'The A string is flat. Her fingers remember more than she expected and less than she hoped.' },
      { who: 'narrator', text: 'She plays for twenty minutes. The sweep finishes on its own. It was always going to.' },
      { who: 'amara', pose: 'happy', text: 'Thursday. I will go Thursday.', effects: { stress: -1 } },
    ],
    next: 'card_time_uneven',
  },

  card_time_uneven: {
    type: 'card',
    text: 'Time passes the way it does:\nunevenly.',
    next: 'comparison',
  },

  comparison: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 192 }, { who: 'daniel', x: 544, pose: 'happy' }],
    lines: [
      { who: 'narrator', text: "A labmate's paper gets into the top venue. Everyone claps. Amara claps." },
      { who: 'narrator', text: 'Her resubmission is still under review. It has been under review for a long time.' },
      { who: 'amara', pose: 'sad', text: 'They started after me.', effects: { happiness: -2 } },
      { who: 'narrator', text: 'That night she opens a blank email. Subject: Withdrawing from the program.', effects: { stress: 2 }, set: { consideredLeaving: true } },
    ],
    next: 'leaving_draft',
  },

  leaving_draft: {
    bg: 'cafe',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'priya', x: 544, when: (s) => s.flags.friends }, { who: 'daniel', x: 544, when: (s) => !s.flags.friends }],
    lines: [
      { who: 'narrator', text: 'She shows the draft to the one person she trusts to not pretend.' },
      { who: friendName, text: 'Leaving is a real choice. Some people leave and are happier. That is true and I will not pretend otherwise.' },
      { who: friendName, text: 'But leaving because a stranger wrote "not convinced" in a text box? That is not you deciding. That is letting Reviewer 2 decide.' },
      { who: friendName, pose: 'kind', text: 'Finish this one. Then decide, with the whole picture, rested, in daylight.' },
      { who: 'amara', text: 'And if I still want to leave then?' },
      { who: friendName, pose: 'happy', text: 'Then I will help you write the email, and it will be a good one.' },
    ],
    choices: [
      { text: 'Delete the draft.', effects: { stress: -2, happiness: 1 }, set: { stayed: true }, next: 'decides_to_stay' },
      { text: 'Keep it in drafts. Decide after the decision comes back.', effects: { stress: -1, happiness: 1 }, set: { stayed: true }, next: 'decides_to_stay' },
    ],
  },

  decides_to_stay: {
    bg: 'cafe',
    lesson: 'stay_by_choice',
    cast: [{ who: 'amara', x: 192 }, { who: 'priya', x: 544, when: (s) => s.flags.friends }, { who: 'daniel', x: 544, when: (s) => !s.flags.friends }],
    lines: [
      { who: 'narrator', text: 'Either way, she stays. Not because she must. Because she chose to, for now, with her eyes open.' },
      { who: 'narrator', text: 'That turns out to be the only kind of staying that works.' },
    ],
    next: 'card_season',
  },

  card_season: {
    type: 'card',
    text: 'A season later.',
    next: 'acceptance',
  },

  acceptance: {
    bg: 'lab',
    cast: [{ who: 'amara', x: 192 }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'email', text: 'We are pleased to inform you that your submission has been accepted. The reviewers particularly appreciated the thorough ablation.' },
      { who: 'amara', pose: 'shock', text: 'The ablation.' },
      { who: 'daniel', pose: 'happy', text: 'Reviewer 1 sends their regards.' },
      { who: 'amara', pose: 'happy', text: 'It does not feel like I thought it would. It feels... normal. Like a Tuesday.', effects: { stress: -3 } },
      { who: 'daniel', text: 'That is the secret. Nobody tells you. The highs are Tuesdays too.' },
    ],
    next: 'card_another_first_week',
  },
};
