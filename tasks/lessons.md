# Lessons

Rules learned from corrections on this project. Read at the start of a session.

## Character art

- **Judge a face by its silhouette at game size, not its features.** The first
  fine sprites had a head that tapered in a straight line to a narrow chin; it
  read as a square with a triangle under it. A face needs full cheeks and a
  rounded chin several pixels wide. Check the outline alone before adding
  detail. (Feedback on the 64x116 sprites, 2026-11-13.)
- **Nothing may poke out of a hair silhouette.** Single pixels on the edge of a
  hairstyle (the old curl bumps on Daniel) read as noise, not texture. Put
  texture inside the shape; keep the outline clean.
- **Texture in near-black hair needs a visibly lighter highlight colour.** A
  shade a few percent darker than the hair disappears.
- **Show the rendered sprites before pushing.** The user's first look at the
  new sprites was the live site, where it was hard to tell what had changed.
  Publish a review page (cast, poses, before/after) and get feedback first.

## Animation

- **Still characters read as unfinished.** Every character on stage should
  have an idle animation that fits their mood, and motion that contradicts the
  mood must stop (no swaying hair on a sad character).

- **A reaction plays once; only a state loops.** The startle jump for
  `shock` first repeated every two seconds and read as constant jumping. Tie
  one-shot reactions to when the pose began (`poseAge` in
  `js/render/characters.js`), and keep loops for ongoing states like swaying
  or breathing. (Feedback, 2026-11-13.)

## Tools and environment

- Headless Firefox here is a snap: it cannot read or write under `/tmp`.
  Screenshot to a temporary folder inside the repo and delete it afterwards.
- A headless screenshot is taken at the load event, before the game's first
  frame. Delay the load event (a slow image from a local server) to capture
  the canvas.
- `pkill -f <pattern>` also matches the shell running it. Use
  `pgrep -f "[x]pattern" | xargs -r kill`.
