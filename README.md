# Amara: A Grad School Story

A browser game about the habits that get you through a PhD: planning for
failed experiments, sleeping before deadlines, telling the truth when it
costs you, leaning on labmates and friends, and keeping a life outside the
lab. Every path graduates. What changes is who is in the room.

Plain HTML, CSS and JavaScript. No build step. Runs on GitHub Pages as-is.

## Run locally

ES modules need a server (not `file://`):

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

## Check the story graph

```sh
node tools/check_story.js
```

Validates every scene reference, every sprite grid, and runs 2000 random
play-throughs to confirm all paths reach the ending and all five endings are
reachable.

## Deploy to GitHub Pages

```sh
git init && git add -A && git commit -m "Amara: a grad school story"
gh repo create amara-grad-school-game --public --source=. --push
gh api -X POST repos/{owner}/amara-grad-school-game/pages -f build_type=legacy -f 'source[branch]=main' -f 'source[path]=/'
```

Or in the repo settings: Pages → Source: `main` / `/ (root)`.

## Layout

```
index.html              page shell
css/game.css            canvas sizing, pixel rendering
js/main.js              boot + render loop
js/engine/              scene_player (story walker), stats, input, audio, text_layout
js/render/              dialogue_box, characters, hud, title_screen, ending_screen
js/sprites/             humanoid (parametric 16x24 character), cast (palettes), props
js/backgrounds/         one painter per location
js/story/               one file per chapter; story_graph assembles them; endings
tools/check_story.js    graph + sprite validation, random-walk simulation
```

## Stats

Three values in `[0, 10]`, shown top-left:

- **Stamina**: sleep and reserves. Drops when Amara skips sleep; below 4 she
  is tired, looks disheveled, and the risky deadline options appear.
- **Happiness**: friends, music and rest lift it; isolation drains it.
- **Stress**: overwork and shortcuts raise it; planning, honesty and help
  bring it down.

Branching is driven by flags (friends, violin, planned, mistake, fabricated,
reachedOut, ...), not by the bars, so the bars are feedback rather than gates
— except Stamina, which gates the tired options.

## Rendering

Stage is 768x432 logical pixels. Characters are a parametric 32x58 sprite
(`js/sprites/humanoid.js`) drawn at 3x (a 64x104 version and a 64x64
dialogue portrait live in `humanoid_hd.js` / `portrait.js` for a future art
pass and are not wired in yet); backgrounds are vector-painted on a
384x216 grid and drawn at 2x. Dialogue uses VT323 at 20px; names and titles
use Press Start 2P.

## Endings

`WHOLE`, `STEADY`, `REBUILT`, `THE LONG WAY BACK`, `THE HONEST ONE`.
The title screen tracks which you have found (localStorage).
