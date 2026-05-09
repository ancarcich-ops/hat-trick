# Hat Trick — Checkpoint

A daily sports trivia game in the style of Wordle / NYT Connections, but for sports team mascots, logos, and geography. Built collaboratively over a long Claude Code session.

## How to run

```bash
python -m http.server 4820 --directory C:\Users\andre\hat-trick
```

Then open <http://localhost:4820>.

The dev server is also registered in `.claude/launch.json` under name `hat-trick` (port 4820), so the Claude Code preview tools work out of the box.

## Tech stack

- **Vanilla HTML / CSS / JS.** No build step. No framework.
- All app logic in a single IIFE in `app.js`.
- Mascot dataset is a plain JS array on `window.MASCOTS` in `mascots.js`.
- LocalStorage key for state: `mascotdaily.v1` (NOT renamed during the rebrand to avoid wiping user progress).
- Page brand is **Hat Trick** (renamed from MascotDaily mid-session). Storage key + a couple internal var names still say `mascotdaily` — that's fine, internal-only.

## File map

```
hat-trick/
├── index.html             ← shell, header (logo + theme switcher + streak), <main>, <footer>
├── app.js                 ← all app logic (~1700 lines)
├── mascots.js             ← ~272 mascot entries
├── styles.css             ← base styles
├── themes.css             ← 4 theme overrides (editorial / stadium / glass / riso)
├── us-map.svg             ← US states SVG (Wikimedia public domain)
├── images/
│   ├── hat-trick-icon.png      ← header brand mark (badge style)
│   ├── hat-trick-wordmark.png  ← title-screen hero (HAT TRICK + hat + stars)
│   ├── hat-trick-monogram.png  ← unused alt (round HT mark)
│   ├── hat-trick-pennant.png   ← unused alt (pennant flag)
│   ├── mlb-grid.png  nfl-grid.png  nba-grid.png  nhl-grid.png  mls-grid.png
│   ├── bigeast-ivy-grid.png  bigten-grid.png  big12-grid.png  sec-grid.png  acc-grid.png
│   ├── conference-logos.png conf2-grid.png conf3-grid.png  ← AI-generated source grids
│   └── mascots/                ← cropped per-mascot photos (~270 PNGs)
├── skins/                 ← 10 standalone HTML mockups + index.html
└── .claude/launch.json    ← preview server config
```

## Dataset shape (`mascots.js`)

```js
{
  name: "Phillie Phanatic",
  team: "Phillies",
  city: "Philadelphia",       // ← actual city for pro; school name for college
  league: "MLB",              // ← MLB/NBA/NFL/NHL/MLS for pro; conference name for college
  animal: "creature",         // ← used for write-in "name 3 of X" + odd-one-out heuristics
  emoji: "🟢",                // ← fallback if no image (only used for mascot subjects, not logos)
  level: "pro",               // ← "pro" or "college"
  logo: ESPN("mlb","phi"),    // ← team logo URL (ESPN CDN, NCAA(id), SOCCER(id))
  image: IMG("phillie-phanatic"), // ← optional cropped mascot photo
  state: "WA",                // ← optional override for STATE_BY_CITY conflicts (only used for UW)
}
```

Helpers at top of `mascots.js`: `ESPN(sport, abbr)`, `NCAA(id)`, `SOCCER(id)`, `IMG(slug)`.

## Total dataset: ~272 mascots

| League                   | Count |
| ------------------------ | ----- |
| MLB                      | 24    |
| NFL                      | 28    |
| NBA                      | 22    |
| NHL                      | 17    |
| MLS                      | 23    |
| College (23 conferences) | ~158  |

College conferences: ACC, A-10, AAC, America East, Big 12, Big East, Big Sky, Big Ten, CAA, CUSA, Independent, Ivy League, MAAC, MAC, MVC, OVC, PAC-12, Patriot League, SEC, SoCon, Southland, Sun Belt, WCC.

## Question generators (all in `app.js`)

| Generator                | Type                | Difficulty bucket | Notes                                                                                           |
| ------------------------ | ------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| `gen_pickLeague`         | multiple-choice     | EASY              | Subject = mascot name only (no team, no logo) — text-only to avoid leak                         |
| `gen_logoToTeam`         | multiple-choice     | EASY              | Logo subject with **center-out reveal animation** over 30s                                      |
| `gen_logoToCity`         | multiple-choice     | EASY              | Same reveal animation                                                                           |
| `gen_pickTeamFromMascot` | multiple-choice     | MEDIUM            | Photo + name subject (no league sub)                                                            |
| `gen_pickMascotFromTeam` | multiple-choice     | MEDIUM            | Logo subject; choices are mascot **photos** (filtered to mascots with `image` so no emoji-leak) |
| `gen_pickState`          | map                 | HARD              | Click-a-state on US SVG; hidden tooltip; show state name on answer                              |
| `gen_oddOneOut`          | multiple-choice     | HARD              | Choices show photos only (no team names — would leak)                                           |
| `gen_writeMatchAnimal`   | write-in (3 inputs) | HARD              | "Name 3 mascots of type X"                                                                      |
| `gen_writeAdultVersion`  | write-in (1 input)  | HARD              | "Clark is a young bear cub. Name another bear-themed mascot."                                   |
| `gen_writeMatchColors`   | write-in (2 inputs) | HARD              | "Name 2 teams with Black & Gold colors" — `COLOR_SCHEMES` map curated for ~12 schemes           |

`leaksTeam(mascot)` filter excludes mascots whose name shares a stem with their team name (e.g., "Blue Devil" → "Blue Devils") from generators where that would give the answer away.

## Daily quiz logic

- 5 questions per day, seeded by `${date}:${level}:${contentType}`
- **Slot structure:** Q1+Q2 from EASY bucket, Q3 from MEDIUM, Q4+Q5 from HARD
- **Pool filter:** Pro / College / All (tabs in title screen)
- **Content filter:** Mascots / Both / Logos (second row of tabs) — filters generators by which "side" they test

## Scoring (out of 1000)

- Per-question max: **Q1=100, Q2=100, Q3=200, Q4=300, Q5=300** (= 1000 perfect)
- 30-second timer per question with 4 speed bands:
  - **⚡ Lightning** (<8s): 100% × max
  - **🔥 Quick** (<16s): 75%
  - **✓ Steady** (<24s): 50%
  - **⏱ Last second** (<30s): 25%
  - **🐢 Overtime** (≥30s): 25% floor (player can still answer; floor = your spec)
- Wrong answer = 0 pts.
- Write-in scoring: partial credit by ratio. `points = max × (correctCount / inputs) × bandMultiplier`.
- State persisted in `state.history[`${date}:${level}:${contentType}`]` with `{score, results, points, bands}`.

## Themes

`themes.css` defines 4 theme classes applied to `<html>`:

- **(no class)** — default navy/cream/gold (matches the Hat Trick logo)
- `.theme-editorial` — newsprint cream + DM Serif Display + JetBrains Mono labels + double-rule borders + burgundy accent
- `.theme-stadium` — deep navy + cyan neon + Bebas Neue + cyan-glow buttons
- `.theme-glass` — pastel multi-radial + frosted-glass cards (`backdrop-filter: blur(30px)`) + indigo accent
- `.theme-riso` — cream paper + Caprasimo + Space Mono + black 3px borders + pink hard-shadows

Theme dots in the top-right of the header. State persists as `state.theme`.

## Visual flourishes

- **Logo reveal** (`gen_logoToTeam`/`gen_logoToCity`): circular wipe from center, eased keyframes — fast at start, slow toward edges. Tuned through user feedback ("middle ground" pacing).
- **Speed-band toast**: `⚡ LIGHTNING +10` pops at the bottom on every correct answer.
- **High-striker score reveal** (carnival "test of strength" cabinet):
  - Wood-grain cabinet with fire-flicker on left, ice glow on right
  - LED scoreboard at top (JetBrains Mono red digital glow)
  - Tall thermometer tower (cool blue → red gradient)
  - Hammer + striker pad at base — hammer swings, pad squishes, _then_ puck launches
  - Glowing puck with motion-blur trail
  - Tick marks (100..1000) flash white as puck crosses
  - LED ticker punches every 100 pts
  - Bell wobbles during climb, hard-rings at score ≥ 800
  - Shockwave ring expands at settle position
  - Hall of Fame (≥950): gold rank pill + glow

## Skins folder (`skins/`)

10 standalone HTML mockups, each a self-contained scrollable preview of home + 2 questions + result for one aesthetic:

| #   | File                   | Style                                |
| --- | ---------------------- | ------------------------------------ |
| 01  | `skin1-editorial.html` | Editorial Sports Card                |
| 02  | `skin2-stadium.html`   | Stadium Night                        |
| 03  | `skin3-arcade.html`    | Retro Arcade Scoreboard              |
| 04  | `skin4-cartoon.html`   | Saturday Morning Cartoon             |
| 05  | `skin5-minimal.html`   | Minimalist Daily Ritual              |
| 06  | `skin6-foil.html`      | (user-added)                         |
| 07  | `skin7-brutalist.html` | (user-added)                         |
| 08  | `skin8-glass.html`     | Glassmorphism (also wired as theme)  |
| 09  | `skin9-broadcast.html` | (user-added)                         |
| 10  | `skin10-riso.html`     | Risograph Zine (also wired as theme) |

User picked 1, 2, 8, 10 to wire into the main app as themes.

## Conventions / gotchas

- **Filename collisions**: many mascots share names across schools (e.g., `Wildcat`, `Tigers`, `Sparky`). Disambiguated with school suffix in slugs: `willie-the-wildcat-nu.png` (Northwestern), `willie-the-wildcat-ksu.png` (K-State), `swoop-utah.png` (Utah, vs Eagles `swoop.png`), `bucky-badger.png` (Wisconsin, vs RSL `bucky.png`), `big-red-wku.png` (WKU, vs Cardinals `big-red.png`), `chomps-mls.png` (Nashville SC, vs Browns `chomps.png`), `blue-mls.png` (Montréal, vs Colts `blue.png`), `rocky-mls.png` (Rapids, vs Nuggets `rocky.png`), `sparky-mls.png` (Fire FC, vs NHL Islanders dragon).
- **`STATE_BY_CITY`** in `app.js` maps both pro cities and college school names to state abbrevs for the map question. `state` field on the mascot overrides this for cases where the same key would resolve differently (UW: city="Washington" but state="WA", not DC).
- **Linter formats CSS/JS on save** in this workspace — sometimes interferes with `Edit` calls; if a tool says "file modified", just re-read the relevant section.
- **MLS logos**: ESPN `mls/{abbr}` URLs **don't work**. Switched to `https://a.espncdn.com/i/teamlogos/soccer/500/{numeric_id}.png` with hand-mapped IDs. See `SOCCER()` helper.
- **Photos with neighbor encroachment**: AI-generated grids occasionally have one mascot's edge bleed into another's crop cell. Acceptable since the dominant subject is still recognizable; can be re-cropped if a specific one is bad.
- **`leaksTeam(m)`** filter: detects when mascot name shares a stem with team name (Blue Devil → Blue Devils). Skips that mascot from being the _target_ in pickTeam/pickMascot/pickLeague — they can still appear as distractors.
- **Mascot photo questions filter to `m.image` only** — never show emoji as a choice next to photo choices (would be a giveaway by visual elimination per user's explicit rule: "if we don't have the real image, skip it. don't use emojis").

## Recently shipped (last few turns of the session)

- ⏰ Speed-band scoring with 30s timer + animated countdown bar
- 🎨 4 theme switcher in header
- 🖼️ Mid-session image swap: AI-generated grids → cropped photos for ~270 mascots
- 🎯 Map question on US SVG (`gen_pickState`) with hidden tooltip + state-name reveal
- 📝 3 write-in generators (animal match, adult version, color match)
- 🎪 Carnival high-striker score reveal (thermometer cabinet, fire/ice glow, LED scoreboard, hammer + striker pad)
- 🛠️ **Replaced emoji hammer (🔨) + generic CSS pad with custom inline SVG illustrations.** Hammer has proper wood-grain handle, dark metal head with claw notch, grip-wrap rings; pad is a red dome on a black anvil base with bolts. Both inline in `app.js` near the `striker-cabinet` construction. Animation timings (hammer-swing 360ms + pad-squish 360ms keyframes in `styles.css`) unchanged — only the rendered visuals were swapped. The old `.striker-pad` CSS gradient block is now under `.unused-old-striker-pad` (dead, can be deleted later).
- 🎩 Hat Trick rebrand with new logo (icon + wordmark + monogram + pennant variants)
- 🌀 Center-out logo reveal animation (tuned through 3 iterations of user feedback)

## Known issues / open

- **Visual giveaways in `gen_pickTeamFromMascot`**: photo of e.g. Dibs (a blue devil character) + choice "Blue Demons" with the matching DePaul logo gives it away visually even though `leaksTeam` doesn't catch the _name_ overlap. Possible fix: extend `leaksTeam` to also check `animal` field vs team words (e.g. `devil` ↔ `demons`), OR drop the photo from this question type's subject. User flagged this once but didn't ask for fix yet.
- **Conferences mislabeled in source grids**: the AI sometimes put schools in the wrong conferences (e.g., Notre Dame as Big East, Stanford as PAC-12 in 2024+, UMass as Big East). Used the labels as printed; some are technically out of date.
- **Some mascot crops have title-bar slop** — e.g., `rocky-bull.png` catches "OFFICIAL" text from the AAC title bar. Cosmetic, not blocking.
- **Storage key `mascotdaily.v1`** — never renamed for back-compat. Internal var `STORAGE_KEY` in `app.js` still references it.
- **Skins 6 / 7 / 9** were added by the user but I haven't fully reviewed them. Only skins 1, 2, 8, 10 got promoted to actual themes.

## Suggested next steps

1. **Fix the photo-leak in `gen_pickTeamFromMascot`** by either dropping the photo from the subject (revert to text-only name) OR adding visual leak detection.
2. **More color schemes** in `COLOR_SCHEMES` — currently 12. Could expand to 20+ for more variety.
3. **Generate / source images for emoji-only mascots** (Hugo NBA Hornets, Youppi! NHL Canadiens, N.J. Devil, Sparky the Dragon NHL, Cy the Cardinal).
4. **Public hosting** — currently localhost only. Static site, deploys cleanly to Netlify / Vercel / GitHub Pages.
5. **Optional: ditch theme system, commit to one aesthetic** — user's been driving toward Stadium Night for the carnival reveal. Could simplify the codebase.
6. **Color-scheme dataset enrichment**: add a `colors: ["red", "white"]` field to mascot entries to enable richer color-based questions instead of the curated string-match approach.
7. **Possibly: explicit `cubsToBears` linked-mascot generator** for the "adult version of [mascot]" lateral-thinking question type the user originally asked for. Current `gen_writeAdultVersion` is generic same-animal; could add hand-curated linked pairs.

## Quick command reference

```bash
# Verify JS syntax (catches IIFE-breaking errors)
node --check app.js

# Re-crop a single grid
python -c "from PIL import Image; im = Image.open('images/sec-grid.png'); im.crop((x0,y0,x1,y1)).save('images/mascots/<slug>.png')"

# Find any remaining `mascotdaily` (case-insensitive) user-facing strings
grep -irn "mascotdaily\|mascot daily" --include="*.html" --include="*.js" --include="*.css"

# Reset localStorage in browser via the preview eval
# localStorage.clear(); location.reload();
```
