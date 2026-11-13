// The lessons the game exists to teach. A scene names one with `lesson: id`;
// the card appears when that scene's lines end. tools/check_story.js proves
// that every path to graduation shows every lesson at least once.

export const LESSONS = {
  build_relationships: {
    title: 'Build relationships early',
    text: 'Friends and labmates are easiest to make before you need them. Go to the thing.',
  },
  plan_for_failure: {
    title: 'Plan for failure',
    text: 'Before you run an experiment, write what you expect and what you will do if you are wrong. Failure is the normal outcome.',
  },
  prioritize_health: {
    title: 'Sleep is part of the work',
    text: 'Tired brains write bugs. Protect sleep, especially near a deadline.',
  },
  verify_before_shipping: {
    title: 'Verify before you ship',
    text: 'Put the verification run in the schedule from day one. Be present when a tool acts for you.',
  },
  integrity: {
    title: 'Never fabricate',
    text: 'Dropping a run, filling a cell, hiding a baseline: all of it is academic dishonesty. Report what is real.',
  },
  own_it: {
    title: 'Own your decisions',
    text: 'When you get it wrong, say so plainly. Excuses cost more than the mistake.',
  },
  rejection_is_normal: {
    title: 'Rejection is weather',
    text: 'Day one is awful and it fades. Every published paper was rejected first. Resubmit.',
  },
  support_network: {
    title: 'Lean on your people',
    text: 'Labmates for the technical, friends for the emotional. Invest in both before the hard day comes.',
  },
  seek_help: {
    title: 'Use the help your college offers',
    text: 'Counseling is for people. You qualify. Booking the appointment is the brave move.',
  },
  life_beyond_lab: {
    title: 'Keep a life outside the lab',
    text: 'The guilt does not go away. It gets quieter than the music. Go anyway.',
  },
  stay_by_choice: {
    title: 'Decide with the whole picture',
    text: 'Leaving can be right. Leaving because a reviewer said so is letting a stranger decide.',
  },
  pay_it_forward: {
    title: 'Pass it on',
    text: 'The lesson you learned the hard way is the one a first-year needs to hear from you.',
  },
  pick_the_right_path: {
    title: 'Pick the right path',
    text: 'There are always two choices: the hard one and the easy one. Mostly you already know which is right.',
  },
};

export const LESSON_COUNT = Object.keys(LESSONS).length;
