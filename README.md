# A Grad School Journey

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
js/sprites/             humanoid (parametric 64x116 character), cast (palettes and looks), props
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

Stage is 768x432 logical pixels on a 1536x864 canvas. Characters are a
parametric 64x116 sprite (`js/sprites/humanoid.js`, with the body in
`humanoid_body.js` and the head and hair in `humanoid_head.js`) drawn at 1.5x,
so one sprite pixel is exactly 3x3 canvas pixels. Each cast member in
`js/sprites/cast.js` has a palette plus a look: build, height, hairstyle,
outfit, accessories and idle fidget. Body parts are painted on separate layers
and each gets a dark, hue-tinted outline. Backgrounds are vector-painted on a 384x216
grid and drawn at 2x. Dialogue uses VT323 at 20px; names and titles use Press
Start 2P. (`js/sprites/portrait.js`, a 64x64 dialogue portrait, is not wired
in.)

To look at the whole cast in every pose:

```sh
node tools/export_sprite_sheet.js sheet.png 3            # everyone, every pose
node tools/export_sprite_sheet.js amara.png 5 amara idle,grad,violin
```

## Idle animation

Characters never stand frozen. `js/render/idle.js` turns (character, pose,
clock) into small changes to the sprite, and the pose's mood picks which:

| Mood | Poses | What happens |
|---|---|---|
| normal | idle, kind | breathing, blinking, and the character's own fidget |
| happy | happy, glad, grad | a small double hop now and then; loose hair and scarves swing wide |
| sad | sad, cry, low, tired | head hung, slow sighs, slow blinks, nothing sways; `cry` adds running tears and sobs |
| excited | shock | one startle jump and a tremble when the pose begins, then still |
| tense | angry | a fixed stare with an occasional shudder |
| playing | violin | the bow goes back and forth |

Fidgets are set per character in `js/sprites/cast.js` (`fidget`): Amara's hair
sways, Daniel checks his watch, Priya rocks on her toes, Dr. Park pushes her
glasses up, Jun nods to a beat, Sam glances around, Clara nods slowly. With
the system "reduce motion" setting on, everyone stands still.

## Endings

`WHOLE`, `STEADY`, `REBUILT`, `THE LONG WAY BACK`, `THE HONEST ONE`.
The title screen tracks which you have found (localStorage).
