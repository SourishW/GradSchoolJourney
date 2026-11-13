// Assembles every chapter into one scene map. Scene ids must be unique
// across chapters; tools/check_story.js verifies that and that every `next`
// resolves.

import { prologue } from './prologue.js';
import { firstExperiment } from './first_experiment.js';
import { theDeadline } from './the_deadline.js';
import { theGrilling } from './the_grilling.js';
import { theRejection } from './the_rejection.js';
import { theLowPoint } from './the_low_point.js';
import { staying } from './staying.js';
import { mentoring } from './mentoring.js';
import { graduation } from './graduation.js';

const CHAPTERS = [
  prologue, firstExperiment, theDeadline, theGrilling,
  theRejection, theLowPoint, staying, mentoring, graduation,
];

export const STORY = {};
for (const chapter of CHAPTERS) {
  for (const [id, scene] of Object.entries(chapter)) {
    if (STORY[id]) throw new Error(`duplicate scene id '${id}'`);
    STORY[id] = scene;
  }
}
