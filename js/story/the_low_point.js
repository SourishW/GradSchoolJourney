// The lonely path. She disappears, she cries on the kitchen floor, and then,
// because there is always a way back, someone reaches in and she reaches out.

export const theLowPoint = {
  disappearing: {
    bg: 'apartment',
    bgVariant: 'night',
    cast: [{ who: 'amara', x: 384, pose: 'sad' }],
    lines: [
      { who: 'narrator', text: 'She does not go in on Monday. Or Tuesday.' },
      { who: 'narrator', text: 'She tells herself she is working from home. The laptop stays closed.' },
      { who: 'narrator', text: 'There is nobody to bring cake, because she never gave anyone the chance to know she would need one.', effects: { stress: 2, happiness: -2 } },
    ],
    next: 'card_days',
  },

  card_days: {
    type: 'card',
    text: 'Days.\nThen more days.',
    next: 'crying_scene',
  },

  crying_scene: {
    bg: 'apartment',
    bgVariant: 'dusty',
    lesson: 'support_network',
    cast: [{ who: 'amara', x: 384, pose: 'cry' }],
    lines: [
      { who: 'narrator', text: 'On the ninth day she cries, properly, on the kitchen floor, for reasons that are no longer only about the paper.' },
      { who: 'narrator', text: 'She does not call it depression yet. But she has stopped eating lunch, and she has stopped answering texts.' },
      { who: 'narrator', when: (s) => s.flags.violin, text: 'She has missed three Thursdays. Jun has texted twice. The violin case has dust on it.' },
      { who: 'narrator', when: (s) => !s.flags.violin, text: 'The violin case under the bed has dust on it. It has had dust on it for a long time.' },
      { who: 'amara', text: 'I should have built this when it was easy. Friends. Labmates. People who would notice. I waited until I needed them.', effects: { happiness: -2 } },
      { who: 'narrator', text: 'This is the bottom. It is real, and it is survivable, and the way out is not a thought. It is a door.', set: { cried: true, consideredLeaving: true } },
      { who: 'narrator', text: 'Two doors, actually. A student-services email she never opened mentions a counseling center. And her phone buzzes.' },
      { who: 'phone', text: "Daniel: Haven't seen you in a while. Not checking up. Okay, checking up. I'm at the cafe on Fourth till 6 if you want company. No pressure." },
    ],
    choices: [
      {
        text: 'Book the counseling center. The college offers it; she might as well use it.',
        effects: { stress: -2, stamina: 1 },
        set: { reachedOut: true, counseling: true },
        next: 'therapist',
      },
      {
        text: 'Go meet Daniel. Even like this.',
        effects: { happiness: 2, stamina: 1 },
        set: { reachedOut: true },
        next: 'cafe_dev',
      },
      {
        text: 'Not today.',
        effects: { stress: 1 },
        next: 'second_nudge',
      },
    ],
  },

  therapist: {
    bg: 'office',
    lesson: 'seek_help',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'clara', x: 544, pose: 'kind' }],
    lines: [
      { who: 'narrator', text: 'Third floor of the health building. A small office with a plant that is doing better than she is.' },
      { who: 'clara', pose: 'idle', text: 'I am Clara. You do not have to explain why you are here. Most people start with "I am probably fine."' },
      { who: 'amara', text: 'I am probably fine.' },
      { who: 'clara', pose: 'kind', text: 'There it is.' },
      { who: 'narrator', text: 'She talks for fifty minutes. About the paper, and then not about the paper.' },
      { who: 'clara', pose: 'idle', text: 'What you are describing has a name, and it is treatable, and you did the hardest part by walking in.' },
      { who: 'clara', text: 'The college provides this to every student. You are not taking it from anyone. Same time next week?' },
      { who: 'amara', pose: 'idle', text: 'Same time next week.', effects: { stress: -3, happiness: 2 } },
      { who: 'narrator', text: 'On the way out she texts Daniel back.' },
    ],
    next: 'cafe_dev',
  },

  second_nudge: {
    bg: 'apartment',
    bgVariant: 'dusty',
    cast: [{ who: 'amara', x: 384, pose: 'sad' }],
    lines: [
      { who: 'narrator', text: 'Two more days.' },
      { who: 'email', text: 'Dr. Park: Come by tomorrow. Rejections are part of the job. Disappearing is not. I am not angry. I am asking.' },
      { who: 'amara', text: 'She reads it four times.' },
    ],
    choices: [
      {
        text: 'Go to the office.',
        effects: { stamina: 1 },
        set: { reachedOut: true },
        next: 'office_return',
      },
    ],
  },

  office_return: {
    bg: 'office',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'park', x: 544, pose: 'kind' }],
    lines: [
      { who: 'park', text: 'Sit.' },
      { who: 'park', pose: 'idle', text: 'Rejection is weather. Everyone gets rained on. The ones who finish are the ones who come inside and dry off with other people.' },
      { who: 'park', text: 'I have had forty-one papers rejected. I counted once, on a bad night. I stopped counting.' },
      { who: 'amara', text: 'How do you keep going?' },
      { who: 'park', pose: 'kind', text: 'Badly, at first. Then with help. Daniel asked about you. Go talk to him.', effects: { happiness: 1, stress: -1 } },
    ],
    next: 'cafe_dev',
  },

  cafe_dev: {
    bg: 'cafe',
    lesson: 'seek_help',
    cast: [{ who: 'amara', x: 192, pose: 'sad' }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'narrator', text: 'Daniel does not ask where she has been. He slides a coffee across and waits.' },
      { who: 'amara', text: 'I stopped going in. I stopped... most things.' },
      { who: 'daniel', text: 'Second year, I did not leave my apartment for two weeks. Told everyone I had the flu.' },
      { who: 'daniel', text: 'Counseling center. Third floor of the health building. Best thing I did in grad school. Better than my thesis, and my thesis is pretty good.' },
      { who: 'amara', when: (s) => s.flags.counseling, pose: 'idle', text: 'I went. Yesterday. I have a second appointment.' },
      { who: 'daniel', when: (s) => s.flags.counseling, pose: 'happy', text: 'Then you are already ahead of where I was.' },
      { who: 'amara', when: (s) => !s.flags.counseling, pose: 'idle', text: 'I thought that was for... people who were worse off.' },
      { who: 'daniel', when: (s) => !s.flags.counseling, pose: 'kind', text: 'It is for people. You qualify.' },
    ],
    choices: [
      {
        when: (s) => !s.flags.counseling,
        text: 'Book an appointment this week.',
        effects: { stress: -5, happiness: 2 },
        set: { counseling: true },
        next: 'cafe_dev_violin',
      },
      {
        when: (s) => !s.flags.counseling,
        text: 'Maybe. I will think about it.',
        effects: { stress: -1 },
        set: { counseling: false },
        next: 'cafe_dev_violin',
      },
      {
        when: (s) => s.flags.counseling,
        text: 'Finish the coffee. It is the first one in two weeks that tastes like anything.',
        effects: { happiness: 1 },
        next: 'cafe_dev_violin',
      },
    ],
  },

  cafe_dev_violin: {
    bg: 'cafe',
    cast: [{ who: 'amara', x: 192 }, { who: 'daniel', x: 544 }],
    lines: [
      { who: 'daniel', text: 'Also. Priya says her string band still needs a violinist. She says it every week. It is getting embarrassing.' },
      { who: 'daniel', when: (s) => s.flags.violin, text: 'Which you know, because you are the violinist. Jun says they are saving your chair.' },
      { who: 'amara', when: (s) => s.flags.violin, pose: 'happy', text: 'Thursday. I will be there Thursday.', effects: { happiness: 1 } },
      { who: 'amara', when: (s) => !s.flags.violin, text: 'The violin is under my bed.' },
      { who: 'daniel', when: (s) => !s.flags.violin, pose: 'happy', text: 'That is not a no.' },
    ],
    choices: [
      {
        when: (s) => !s.flags.violin,
        text: 'Dust it off. Thursday.',
        effects: { happiness: 3 },
        set: { violin: true, lateViolin: true },
        next: 'card_day_seven_late',
      },
      {
        when: (s) => !s.flags.violin,
        text: 'Not yet. One thing at a time.',
        next: 'card_day_seven_late',
      },
      {
        when: (s) => s.flags.violin,
        text: 'Finish the coffee. Go home. Open the laptop.',
        next: 'card_day_seven_late',
      },
    ],
  },

  card_day_seven_late: {
    type: 'card',
    text: 'It takes longer than seven days.\nThe floor comes back anyway.',
    next: 'resubmit',
  },
};
