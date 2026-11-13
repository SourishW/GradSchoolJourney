import { drawLab } from './lab.js';
import { drawApartment } from './apartment.js';
import { drawCafe } from './cafe.js';
import { drawStage } from './stage.js';
import { drawOffice } from './office.js';
import { drawGraduationHall } from './graduation_hall.js';

// Each painter takes (ctx, variant, timeMs) and fills the 384x216 canvas.
export const BACKGROUNDS = {
  lab: drawLab,
  apartment: drawApartment,
  cafe: drawCafe,
  stage: drawStage,
  office: drawOffice,
  graduation_hall: drawGraduationHall,
};
