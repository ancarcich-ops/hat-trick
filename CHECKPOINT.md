# Combine — Checkpoint

A daily sports trivia game in the style of Wordle / NYT Connections, for pro and college team mascots, logos, and geography. Originally built as "Hat Trick"; rebranded to **Combine** mid-development.

## How to run

```bash
python -m http.server 4820 --directory C:\Users\andre\hat-trick
```

Then open <http://localhost:4820>.

The dev server is also registered in `.claude/launch.json` under name `hat-trick` (port 4820), so the Claude Code preview tools work out of the box. _(Folder + launch entry kept as `hat-trick` for filesystem stability — the user-facing brand is "Combine" everywhere in the UI.)_

## Live

- **Primary URL:** https://combine-app.vercel.app
- **Backward-compat alias:** https://hat-trick-app.vercel.app
- **GitHub:** https://github.com/ancarcich-ops/hat-trick
- **Vercel project:** `hat-trick` (under `andrews-projects-283d7415`)
- _Note:_ Each `vercel deploy --prod` requires a manual `vercel alias set <new-deploy> combine-app.vercel.app` to keep the primary URL pointing at the latest build. See "Deploy flow" below.

## Tech stack

- **Vanilla HTML / CSS / JS.** No build step. No framework.
- All app logic in a single IIFE in `app.js` (~2500 lines).
- Mascot dataset is a plain JS array on `window.MASCOTS` in `mascots.js`.
- **Supabase** backend for the social/groups feature (anonymous auth + Postgres). Client in `js/combine-supabase.js`.
- LocalStorage key for state: `mascotdaily.v1` (NOT renamed — preserves player progress across the rebrand).
- Internal `STORAGE_KEY` var still says `mascotdaily`. Don't touch.

## File map

```
hat-trick/
├── index.html             ← shell, header (icon + Combine wordmark, streak, groups chip), <main>, footer
├── app.js                 ← all app logic (~2500 lines, single IIFE)
├── mascots.js             ← ~259 mascot entries
├── styles.css             ← base styles
├── themes.css             ← 4 theme overrides (editorial / stadium / glass / riso) — only editorial is exposed
├── us-map.svg             ← US states SVG (Wikimedia public domain)
├── js/
│   └── combine-supabase.js   ← Supabase client + window.Combine API (groups, scores, leaderboard)
├── images/
│   ├── combine-icon.svg       ← header brand mark (stopwatch + magnifying-glass seal)
│   ├── combine-wordmark.svg   ← title-screen hero ("Combine" w/ double rules + "DAILY · LOGOS · MASCOTS")
│   ├── mlb-grid.png nfl-grid.png nba-grid.png nhl-grid.png mls-grid.png  ← AI-generated source grids
│   ├── bigeast-ivy-grid.png bigten-grid.png big12-grid.png sec-grid.png acc-grid.png
│   ├── conf2-grid.png conf3-grid.png  conference-logos.png
│   ├── missing-mascots-grid.png  ← grid for late-additions (Hugo, Youppi, etc.)
│   └── mascots/                ← cropped per-mascot photos (~260 PNGs)
├── skins/                ← 10 standalone HTML mockups (early aesthetic exploration)
├── league-audit.html     ← dev-only audit grid: every mascot's logo + photo side by side
├── mls-audit.html        ← dev-only MLS-only audit grid
├── riso-accent-mockups.html  ← dev-only mockup page for choosing riso accent color
└── .claude/launch.json   ← Claude Code preview server config
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
  logo: ESPN("mlb","phi"),    // ← team logo URL (ESPN CDN, NCAA(id), SOCCER(id), MLS(abbr))
  image: IMG("phillie-phanatic"), // ← optional cropped mascot photo
  state: "WA",                // ← optional override for STATE_BY_CITY conflicts (only used for UW)
  noLogo: true,               // ← optional; excludes the entry from logo-based question types
}
```

Helpers at top of `mascots.js`: `ESPN(sport, abbr)`, `NCAA(id)`, `SOCCER(id)`, `MLS(abbr)`, `IMG(slug)`.

## Total dataset: ~259 mascots with photos (262 entries; a few are logo-only e.g. REDD / NY Red Bulls, The Loon / MN United)

| League                   | Count | Notes                                                     |
| ------------------------ | ----- | --------------------------------------------------------- |
| MLB                      | 24    | All real, photo-accurate                                  |
| NFL                      | 27    | All real except `Raider Rush` (kept per user — semi-real) |
| NBA                      | 22    | All real, well-documented                                 |
| NHL                      | 17    | All real                                                  |
| MLS                      | 16    | Cleaned heavily — fabrications dropped                    |
| College (23 conferences) | ~155  | Audited; ~15 fabricated names fixed to real-mascot names  |

College conferences: ACC, A-10, AAC, America East, Big 12, Big East, Big Sky, Big Ten, CAA, CUSA, Independent, Ivy League, MAAC, MAC, MVC, OVC, PAC-12, Patriot League, SEC, SoCon, Southland, Sun Belt, WCC.

## Question generators (all in `app.js`)

| Generator                | Type            | Difficulty bucket | Notes                                                                                                                                                                                  |
| ------------------------ | --------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gen_pickLeague`         | multiple-choice | EASY              | Subject = mascot name only (text), no team / no logo — to avoid leak                                                                                                                   |
| `gen_logoToTeam`         | multiple-choice | EASY              | Logo subject with **center-out reveal animation** over 30s                                                                                                                             |
| `gen_logoToCity`         | multiple-choice | EASY              | Same reveal animation                                                                                                                                                                  |
| `gen_pickTeamFromMascot` | multiple-choice | MEDIUM            | Photo + name subject; choices include team logos                                                                                                                                       |
| `gen_pickMascotFromTeam` | multiple-choice | MEDIUM            | Logo subject (showing **just the city/school name**, not team nickname — to avoid revealing the animal); choices are mascot **photos** (filtered to `m.image` so no emoji-leak)        |
| `gen_pickState`          | map             | HARD              | Click-a-state on US SVG; **pinch + pan + on-screen +/− zoom**; hidden tooltip; show state name on answer                                                                               |
| `gen_oddOneOut`          | multiple-choice | HARD              | Choices show photos only (no team names — would leak)                                                                                                                                  |
| `gen_writeMatchAnimal`   | multi-choice    | HARD              | "Which of these mascots represents a [animal] team?"; choices show **city · league** only (team nickname hidden to avoid leak); filters out targets whose own name contains the animal |
| `gen_writeAdultVersion`  | multi-choice    | HARD              | "Subject is a [animal]. Which of these is also a [animal]?"; same name+subtitle leak filtering                                                                                         |
| `gen_writeMatchColors`   | multi-choice    | HARD              | "Which team has X colors as primary?"                                                                                                                                                  |

### Leak filters

- **`leaksTeam(m)`** — filters mascots from being TARGETS (in pickTeamFromMascot / pickMascotFromTeam / pickLeague) when their `name` or `animal` would obviously reveal the team. Stem-matches against team words, plus an `ANIMAL_SYNONYMS` map (`devil↔demon`, `bear↔bruin/cub/grizzly`, `bird↔cardinal`).
- **`nameLeaksAnimal(m, animal)`** — filters targets/correct-answers in `gen_writeMatchAnimal` and `gen_writeAdultVersion` when the mascot's own name contains the animal word (e.g., "Rocky the Bull" would self-identify when asking about a bull team).
- **`m.noLogo`** — excluded from any generator that displays a team logo (subject or choice). Currently set on: Crew Cat / Columbus Crew (ESPN's logo 404s).

## Daily quiz logic

- **5 questions per day**, seeded by `${date}:${level}:${contentType}`
- **Slot structure:** Q1+Q2 from EASY bucket, Q3 from MEDIUM, Q4 pinned to map question (`gen_pickState`) when contentType allows, Q5 from HARD
- **Pool filter:** All / Pro / College (tabs in title screen; default **All**)
- **Content filter:** Both / Mascots / Logos (tabs; default **Both**)
- **Staged reveal** before timer starts: question-type label → prompt (+950ms) → subject (+950ms, if any) → choices (+950ms) → timer bar appears + clock starts (+950ms). Total intro ~3s with subject, ~2s without. Choices have `pointer-events: none` until revealed.

## Scoring (out of 1000)

- Per-question max: **Q1=100, Q2=100, Q3=200, Q4=300, Q5=300** (= 1000 perfect)
- 30-second timer per question with 4 speed bands. The multiplier is **continuous within each band** — it ramps linearly from the band's start value down to the next band's value, so faster answers always score higher (even within the same band). Bands still drive the toast/label:
  - **⚡ Lightning** (0–12s): 1.0 → 0.85
  - **🔥 Quick** (12–20s): 0.85 → 0.65
  - **✓ Steady** (20–26s): 0.65 → 0.45
  - **⏱ Last second** (26–30s): 0.45 → 0.30
  - **🐢 Overtime** (≥30s): 0.30 hard floor
- Wrong answer = 0 pts.
- State persisted in `state.history[`${date}:${level}:${contentType}`]` with `{score, results, points, bands, userAnswers, level, contentType, correctCount}`.

## Themes

`themes.css` defines 4 theme classes applied to `<html>`. **Only `editorial` is exposed.** The `.theme-switcher` element in the header has the `hidden` attribute, and `state.theme` is force-set to `editorial` on every boot. Other themes preserved for future use.

- **`.theme-editorial`** (active default) — newsprint cream + DM Serif Display + JetBrains Mono labels + double-rule borders + burgundy (`#8B0000`) accent
- `.theme-stadium` — deep navy + cyan neon + Bebas Neue + cyan-glow buttons
- `.theme-glass` — pastel multi-radial + frosted-glass cards + indigo accent
- `.theme-riso` — cream paper + Caprasimo + Space Mono + black 3px borders + teal hard-shadows (was pink; user changed it)

## Combine branding (added late)

- Brand name: **Combine** (DM Serif Display wordmark)
- Tagline: "DAILY · LOGOS · MASCOTS"
- Color palette (matches editorial theme):
  - Cream paper `#F2EAD3`, surface `#FAF5E6`
  - Deep ink `#1A1714`, soft ink `#6B5E4F`
  - Rule warm tan `#C9B98E`
  - Burgundy accent `#8B0000`
- Icon: stopwatch + magnifying-glass seal with a serif "C" in the dial (`images/combine-icon.svg`)
- Wordmark: 1024×512 SVG with "Combine" set in DM Serif Display, double rules above/below, "EST. MMXXVI · № 001" subhead, tagline below (`images/combine-wordmark.svg`)
- Generated via the Combine Branding Kit (HTML/SVG); see commits e0cf7d0 + ad8b740.

## Groups feature (Supabase)

Anonymous-auth multiplayer / friend-group leaderboards.

### Data model (Supabase Postgres)

```
players       (id uuid pk, display_name text, created_at)
groups        (id text pk = 6-char code, name, level, content_type, created_by, created_at)
group_members (group_id, player_id, joined_at) — composite pk
scores        (player_id, date, level, content_type, score, correct_count, submitted_at) — composite pk
```

RLS policies: public read on all four tables; insert/update only when row id = `auth.uid()`. See SQL schema in commit history.

### `window.Combine` API (in `js/combine-supabase.js`)

- `ensureSession()` — anonymous sign-in if needed; returns UID
- `getPlayer()`, `setDisplayName(name)`
- `createGroup({name, level, contentType})` — generates 6-char code, auto-joins creator
- `joinGroup(code)`, `leaveGroup(code)`, `listMyGroups()`
- `submitScore({date, level, contentType, score, correctCount})` — best-of-day upsert; only updates if new score ≥ existing
- `getGroupLeaderboard(groupId, range)` where `range = 'today' | 'week' | 'all'` — returns `{group, rows}`; rows have `display_name, score (today), avg, plays, last_date`

### UX

- **👥** chip in topbar opens Groups screen.
- Groups screen: list of joined groups + Create (name + Pool/Type pickers) + Join with code + Edit display name.
- Group detail: name + mode + 6-char code + **Share invite** button (Web Share API → clipboard fallback; produces `?join=CODE` URL).
- 3 tabs: **Today** (score), **This week** (rolling-7-day avg), **All-time** (career avg). Highlighted "(you)" row.
- After every quiz, `submitScore` is fired in the background. Best-of-day per (player, date, level, content_type). Failures are silent.
- `?join=CODE` URL handler: on boot, if present, prompts to join → drops user into the group's Today leaderboard.

### Supabase config

- Project URL: `https://dafrpyeghfjoarlmfera.supabase.co`
- Anon key is embedded in `js/combine-supabase.js` (intended — RLS does the gatekeeping).
- Anonymous Sign-Ins ON in Auth → Providers → Settings.

## Result page

After a quiz, the result page shows:

- **High-striker score reveal** (carnival "test of strength" cabinet, cleaned up):
  - Wood-grain cabinet with subtle fire/ice glow accents
  - LED scoreboard at top with red digital glow — score animates up over **5.7s**
  - Tall thermometer tower (cool blue → red gradient)
  - Tick marks (100..1000) flash white as the puck crosses them
  - Tier markers on the left (🏆 Hall of Fame / 🥇 Champion / ⚡ Pro / 💪 Amateur / 👶 Rookie) illuminate as the puck passes them; HoF gets a gold accent
  - LED ticker punches every 100 pts
  - Shockwave ring expands at settle position
  - Rank pill below the cabinet ("🥇 CHAMPION" etc.) updates live as the puck rises
- **Per-question summary rows** below the cabinet. Each row is clickable to expand a detail panel showing: the question prompt, the subject thumbnail (logo/photo), the player's answer (red callout if wrong, green if right), and the correct answer.
- **Share result** button — produces:
  ```
  Combine · May 14, 2026
  866/1000
  ✅✅❌✅❌
  https://combine-app.vercel.app
  ```
  URL is plain text (not the Web Share `url` field) so messaging apps auto-link without generating a rich preview card.

## Conventions / gotchas

- **Folder is still `hat-trick`** for filesystem stability. Brand is "Combine" everywhere user-facing.
- **GitHub repo is still `hat-trick`**, same reason.
- **Vercel deploy needs manual alias**: after `vercel deploy --prod --yes`, run `vercel alias set <new-deployment-url> combine-app.vercel.app` to keep the primary URL current. The build pipeline also keeps `hat-trick-app.vercel.app` updated automatically (older alias).
- **Filename collisions** disambiguated with school/team suffix in slugs: `willie-the-wildcat-nu.png` (Northwestern), `willie-the-wildcat-ksu.png` (K-State), `swoop-utah.png` (Utah, vs Eagles `swoop.png`), `bucky-badger.png` (Wisconsin, vs Bucky RSL just renamed), `big-red-wku.png` (WKU, vs Cardinals `big-red.png`), `chomps-mls.png` (deleted), etc.
- **`STATE_BY_CITY`** in `app.js` maps both pro cities and college school names to state abbrevs for the map question. `state` field on the mascot overrides this for cases where the same key would resolve differently (UW: city="Washington" but state="WA", not DC).
- **Linter formats CSS/JS on save** in this workspace — sometimes interferes with `Edit` calls; if a tool says "file modified", just re-read the relevant section.
- **MLS logos**: ESPN `mls/{abbr}` URLs work for Chicago (`chi`), Seattle (`sea`); ESPN `soccer/500/{id}` works for most others. St. Louis City SC is at id 21812. Columbus Crew has no working logo (marked `noLogo: true`).
- **`leaksTeam(m)`** filter applied to TARGET selection in pickTeam / pickMascot / pickLeague. Distractors not filtered (they're meant to mislead).
- **Mascot photo questions filter to `m.image` only** — never show emoji as a choice next to photo choices (would be a giveaway by visual elimination).

## Streak

- `state.streak` (count) + `state.lastPlayed` (ISO date).
- One play per calendar day counts. Yesterday → +1. Skip a day → resets to 1.
- 🔥 chip in topbar shows the count. **Long-press** the streak chip to reset all Combine progress (localStorage wipe).

## Audit history

Earlier in development, a thorough audit caught ~75 issues across mascot photos:

- ~27 hard mismatches (wrong species in photo) — most fixed via new AI-grid crops or by replacing with real photos
- ~43 label leaks (source-grid text bleeding into the crop) — all cleaned
- 4 severe encroachment cases (MLS) — fixed
- 1 missing file (`freddy-falcon-bg.png`) — re-cropped from missing-mascots-grid

The audit also surfaced ~25 fabricated/wrongly-named entries across MLS, NFL, NHL, and college conferences. **All resolved**: AI-fabricated mascots for teams that don't really have one were dropped (Steel Curtain / Steelers, etc.) or renamed to the team's real mascot (Commander → Major Tuddy / Saints' Sir Saint → Gumbo / etc.). MLB and NBA were clean from the start.

The audit report is in `audit-report.md` (16 batches of findings; mostly historical reference now).

## Recently shipped

- 👥 **Groups feature** (Supabase) — anonymous accounts, friend-group leaderboards with Today / Week / All-time tabs, share invite via 6-char code or `?join=` URL
- 🏷️ **Combine rebrand** — wordmark + icon SVGs from a branding kit; editorial theme made default; theme switcher hidden (other themes preserved)
- ⏱️ **Slower pacing** — staged question reveal (~3s intro), softer scoring curve (HoF achievable at ~5s/question avg with all correct)
- 🗺️ **Map zoom** — pinch + pan + on-screen +/− zoom buttons for the US map question
- 🩹 **Animal-name leak filter** — `nameLeaksAnimal` prevents "Rocky the Bull" from being the target when asking "which is a bull team?"
- 📊 **Result detail expansion** — clicking a Q row reveals prompt + subject + user's answer + correct answer
- 📤 **Share result** — date / score / emoji grid / URL; clean checkmark+X emojis

## Suggested next steps

1. **Vercel auto-alias** — set `combine-app.vercel.app` as the project's primary production domain in Vercel dashboard so `vercel deploy --prod` auto-updates it (eliminates manual `vercel alias set`).
2. **OG meta tags** in `index.html` for nicer link-preview cards when the URL is shared.
3. **Display-name modal** instead of `prompt()` for first-time setup — nicer UX.
4. **Calendar-week vs rolling-week toggle** for the group leaderboard.
5. **More mascot photos** for the entries that are currently logo-only (REDD, The Loon, Big Red Lamar, Crew Cat technically has one, GW George the Revolutionary).
6. **Source / regenerate the AI source-grid PNGs** if you want to fix the few remaining off-center crops noted in `audit-report.md`.

## Quick command reference

```bash
# Verify JS syntax (catches IIFE-breaking errors)
node --check app.js

# Re-crop a single grid
python -c "from PIL import Image; im = Image.open('images/sec-grid.png'); im.crop((x0,y0,x1,y1)).save('images/mascots/<slug>.png')"

# Reset localStorage in browser via the preview eval
# localStorage.clear(); location.reload();

# Deploy + re-alias to combine-app.vercel.app
cd C:/Users/andre/hat-trick
git add -A && git commit -m "..." && git push
OUT=$(vercel deploy --prod --yes 2>&1) && URL=$(echo "$OUT" | grep -oE "https://hat-trick-[a-z0-9]+-andrews[^ ]+" | head -1)
vercel alias set "$URL" combine-app.vercel.app
```
