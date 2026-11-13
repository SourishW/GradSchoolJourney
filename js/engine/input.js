// Keyboard, mouse and touch all collapse into a handful of named actions.
// Pointer events also report where on the logical canvas they landed so the
// dialogue box can hit-test choice rows.

export function attachInput(canvas, logicalWidth, logicalHeight, handlers) {
  const keyActions = {
    Enter: 'advance', ' ': 'advance', z: 'advance', Z: 'advance',
    ArrowUp: 'up', ArrowDown: 'down', w: 'up', s: 'down',
    m: 'mute', M: 'mute',
  };

  window.addEventListener('keydown', (event) => {
    const action = keyActions[event.key];
    if (!action) return;
    event.preventDefault();
    handlers.onAction(action);
  });

  const toLogical = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * logicalWidth,
      y: ((event.clientY - rect.top) / rect.height) * logicalHeight,
    };
  };

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handlers.onPointer(toLogical(event));
  });

  canvas.addEventListener('pointermove', (event) => {
    handlers.onHover(toLogical(event));
  });
}
