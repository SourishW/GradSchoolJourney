// The bottom text box: speaker name, typewriter text, and choice menu. Also
// renders the full-screen "fuzzy time" cards and the end-of-scene lesson
// card in the top-right corner. Stage is 768x432.

import { wrapText } from '../engine/text_layout.js';

export const BOX = { x: 16, y: 300, w: 736, h: 120 };
const PADDING = 14;
const LINE_HEIGHT = 22;
export const BODY_FONT = '20px "VT323", "Courier New", monospace';
const SMALL_BODY_FONT = '17px "VT323", "Courier New", monospace';
const SMALL_LINE_HEIGHT = 18;
export const NAME_FONT = '9px "Press Start 2P", monospace';

export function drawDialogueBox(ctx, player) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
  ctx.strokeStyle = '#f0f0f8';
  ctx.lineWidth = 3;
  ctx.strokeRect(BOX.x + 1.5, BOX.y + 1.5, BOX.w - 3, BOX.h - 3);
  ctx.textBaseline = 'top';

  if (player.mode === 'choice') drawChoices(ctx, player);
  else drawLine(ctx, player);
  ctx.restore();
}

function drawLine(ctx, player) {
  const style = player.speakerStyle(player.currentLine.who);
  let textY = BOX.y + PADDING;
  if (style.name) {
    ctx.font = NAME_FONT;
    ctx.fillStyle = style.color;
    ctx.fillText(style.name, BOX.x + PADDING, textY + 2);
    textY += 18;
  }
  ctx.font = BODY_FONT;
  ctx.fillStyle = style.name ? '#f8f8ff' : '#c8c8d8';
  const lines = wrapText(ctx, player.shownText, BOX.w - PADDING * 2);
  lines.slice(0, 4).forEach((line, index) => {
    ctx.fillText(line, BOX.x + PADDING, textY + index * LINE_HEIGHT);
  });
  if (player.typingDone && player.mode === 'text' && Math.floor(performance.now() / 400) % 2 === 0) {
    ctx.fillStyle = '#f0f0f8';
    ctx.fillRect(BOX.x + BOX.w - 22, BOX.y + BOX.h - 18, 8, 8);
  }
}

// Choices wrap to as many lines as they need; if the whole menu does not fit
// at the normal size it drops to the smaller font rather than truncating.
function drawChoices(ctx, player) {
  const available = BOX.h - PADDING * 2;
  const textWidth = BOX.w - PADDING * 2 - 28;
  const layout = (font, lineHeight) => {
    ctx.font = font;
    const rows = player.choices.map((choice) => wrapText(ctx, player.resolve(choice.text), textWidth));
    const total = rows.reduce((sum, lines) => sum + lines.length * lineHeight, 0) + (rows.length - 1) * 4;
    return { font, lineHeight, rows, total };
  };
  let plan = layout(BODY_FONT, LINE_HEIGHT);
  if (plan.total > available) plan = layout(SMALL_BODY_FONT, SMALL_LINE_HEIGHT);

  player.choiceRects = [];
  let y = BOX.y + PADDING;
  ctx.font = plan.font;
  plan.rows.forEach((lines, index) => {
    const selected = index === player.cursor;
    const rowHeight = lines.length * plan.lineHeight;
    ctx.fillStyle = selected ? '#f2c94c' : '#f8f8ff';
    if (selected) ctx.fillText('>', BOX.x + PADDING, y);
    lines.forEach((line, lineIndex) => ctx.fillText(line, BOX.x + PADDING + 24, y + lineIndex * plan.lineHeight));
    player.choiceRects.push({ x: BOX.x, y, w: BOX.w, h: rowHeight + 4 });
    y += rowHeight + 4;
  });
}

const LESSON_BOX = { x: 400, y: 14, w: 354 };
const LESSON_PADDING = 14;
const TITLE_LINE_HEIGHT = 14;

// Both the title and the body are word-wrapped to the card's inner width,
// and the card grows to fit them, so nothing can run past the border.
export function drawLessonCard(ctx, player) {
  const { lesson } = player;
  const innerWidth = LESSON_BOX.w - LESSON_PADDING * 2;
  ctx.save();
  ctx.textBaseline = 'top';
  ctx.font = NAME_FONT;
  const titleLines = wrapText(ctx, `LESSON ${player.state.lessons.length}: ${lesson.title.toUpperCase()}`, innerWidth);
  ctx.font = BODY_FONT;
  const bodyLines = wrapText(ctx, lesson.text, innerWidth);
  const titleHeight = titleLines.length * TITLE_LINE_HEIGHT;
  const height = LESSON_PADDING + titleHeight + 8 + bodyLines.length * LINE_HEIGHT + LESSON_PADDING;

  ctx.fillStyle = 'rgba(8, 8, 16, 0.92)';
  ctx.fillRect(LESSON_BOX.x, LESSON_BOX.y, LESSON_BOX.w, height);
  ctx.strokeStyle = '#f2c94c';
  ctx.lineWidth = 3;
  ctx.strokeRect(LESSON_BOX.x + 1.5, LESSON_BOX.y + 1.5, LESSON_BOX.w - 3, height - 3);

  ctx.font = NAME_FONT;
  ctx.fillStyle = '#f2c94c';
  titleLines.forEach((line, index) => ctx.fillText(line, LESSON_BOX.x + LESSON_PADDING, LESSON_BOX.y + LESSON_PADDING + index * TITLE_LINE_HEIGHT));
  ctx.font = BODY_FONT;
  ctx.fillStyle = '#f8f8ff';
  const bodyTop = LESSON_BOX.y + LESSON_PADDING + titleHeight + 8;
  bodyLines.forEach((line, index) => ctx.fillText(line, LESSON_BOX.x + LESSON_PADDING, bodyTop + index * LINE_HEIGHT));

  if (Math.floor(performance.now() / 400) % 2 === 0) {
    ctx.fillStyle = '#f2c94c';
    ctx.fillRect(LESSON_BOX.x + LESSON_BOX.w - 18, LESSON_BOX.y + height - 14, 7, 7);
  }
  ctx.restore();
}

export function drawCard(ctx, player, width, height) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.font = '28px "VT323", "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#d0d0e0';
  const lines = wrapText(ctx, player.resolve(player.scene.text), width - 120);
  const lineHeight = 32;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => ctx.fillText(line, width / 2, startY + index * lineHeight));
  ctx.restore();
}
