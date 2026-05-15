(function () {
  const ALL_MASCOTS = window.MASCOTS;
  const QUESTIONS_PER_DAY = 5;
  const STORAGE_KEY = "mascotdaily.v1";

  // City / school → state. Used for the map question. Canadian teams have
  // QC / ON and are excluded from the map quiz pool (US-only map).
  const STATE_BY_CITY = {
    Philadelphia: "PA",
    "New York": "NY",
    Miami: "FL",
    Cleveland: "OH",
    Boston: "MA",
    Milwaukee: "WI",
    Houston: "TX",
    Detroit: "MI",
    "St. Louis": "MO",
    Chicago: "IL",
    Denver: "CO",
    Charlotte: "NC",
    Atlanta: "GA",
    "San Antonio": "TX",
    "San Francisco": "CA",
    Indianapolis: "IN",
    Sunrise: "FL",
    Newark: "NJ",
    Pittsburgh: "PA",
    "Los Angeles": "CA",
    "New Orleans": "LA",
    Montreal: "QC",
    Toronto: "ON",
    "St. Petersburg": "FL",
    Oakland: "CA",
    Seattle: "WA",
    Washington: "DC",
    Minneapolis: "MN",
    Arlington: "TX",
    Phoenix: "AZ",
    "San Diego": "CA",
    Foxborough: "MA",
    Buffalo: "NY",
    Baltimore: "MD",
    Cincinnati: "OH",
    Jacksonville: "FL",
    Nashville: "TN",
    "Kansas City": "MO",
    "Las Vegas": "NV",
    Tampa: "FL",
    Glendale: "AZ",
    Orlando: "FL",
    "Oklahoma City": "OK",
    Sacramento: "CA",
    Dallas: "TX",
    Memphis: "TN",
    Portland: "OR",
    "Salt Lake City": "UT",
    Indiana: "IN",
    Iowa: "IA",
    Northwestern: "IL",
    "Penn State": "PA",
    Purdue: "IN",
    Rutgers: "NJ",
    USC: "CA",
    Arizona: "AZ",
    "Arizona State": "AZ",
    Baylor: "TX",
    TCU: "TX",
    "Texas Tech": "TX",
    UCF: "FL",
    Utah: "UT",
    "West Virginia": "WV",
    Butler: "IN",
    Creighton: "NE",
    DePaul: "IL",
    Georgetown: "DC",
    Marquette: "WI",
    Providence: "RI",
    "St. John's": "NY",
    "Seton Hall": "NJ",
    Villanova: "PA",
    Xavier: "OH",
    UMass: "MA",
    "UMass Lowell": "MA",
    "St. Bonaventure": "NY",
    Gonzaga: "WA",
    "Saint Mary's": "CA",
    Davidson: "NC",
    Dayton: "OH",
    "Saint Joseph's": "PA",
    VCU: "VA",
    "George Mason": "VA",
    "Loyola Chicago": "IL",
    "Wichita State": "KS",
    Yale: "CT",
    Princeton: "NJ",
    Maine: "ME",
    Vermont: "VT",
    Albany: "NY",
    Hartford: "CT",
    Brown: "RI",
    Columbia: "NY",
    Cornell: "NY",
    Dartmouth: "NH",
    Harvard: "MA",
    Penn: "PA",
    "Oregon State": "OR",
    "Washington State": "WA",
    "East Carolina": "NC",
    "Florida Atlantic": "FL",
    Memphis: "TN",
    "North Texas": "TX",
    Rice: "TX",
    "South Florida": "FL",
    Tulane: "LA",
    Tulsa: "OK",
    Akron: "OH",
    "Bowling Green": "OH",
    Ohio: "OH",
    "Appalachian State": "NC",
    "Coastal Carolina": "SC",
    "James Madison": "VA",
    Liberty: "VA",
    "Sam Houston": "TX",
    "Western Kentucky": "KY",
    Fordham: "NY",
    "George Washington": "DC",
    "Rhode Island": "RI",
    Richmond: "VA",
    "Loyola Marymount": "CA",
    Pepperdine: "CA",
    Pacific: "CA",
    "San Francisco": "CA",
    Belmont: "TN",
    Drake: "IA",
    "Illinois State": "IL",
    "Indiana State": "IN",
    "Northern Iowa": "IA",
    "Saint Peter's": "NJ",
    Quinnipiac: "CT",
    Delaware: "DE",
    Drexel: "PA",
    "UNC Wilmington": "NC",
    Idaho: "ID",
    "Northern Arizona": "AZ",
    Navy: "MD",
    Bucknell: "PA",
    "Boston University": "MA",
    "Holy Cross": "MA",
    "The Citadel": "SC",
    Lamar: "TX",
    McNeese: "LA",
    Nicholls: "LA",
    "Northwestern State": "LA",
    "Texas A&M–Corpus Christi": "TX",
    "Incarnate Word": "TX",
    "Tennessee Tech": "TN",
    "Austin Peay": "TN",
    "Murray State": "KY",
    "UT Martin": "TN",
    SIUE: "IL",
    Arkansas: "AR",
    Kentucky: "KY",
    "Ole Miss": "MS",
    "Mississippi State": "MS",
    Vanderbilt: "TN",
    "Boston College": "MA",
    Clemson: "SC",
    "Florida State": "FL",
    "Georgia Tech": "GA",
    Louisville: "KY",
    Pitt: "PA",
    SMU: "TX",
    "San Jose": "CA",
    "Saint Paul": "MN",
    Harrison: "NJ",
    Columbus: "OH",
    "Commerce City": "CO",
    Austin: "TX",
    Vancouver: "BC",
    // College schools
    "Ohio State": "OH",
    "Michigan State": "MI",
    Minnesota: "MN",
    Wisconsin: "WI",
    Nebraska: "NE",
    Oregon: "OR",
    UCLA: "CA",
    Maryland: "MD",
    "Virginia Tech": "VA",
    Syracuse: "NY",
    "Wake Forest": "NC",
    Duke: "NC",
    "North Carolina": "NC",
    "NC State": "NC",
    Stanford: "CA",
    Alabama: "AL",
    Auburn: "AL",
    Tennessee: "TN",
    Florida: "FL",
    LSU: "LA",
    "Texas A&M": "TX",
    "South Carolina": "SC",
    Texas: "TX",
    Oklahoma: "OK",
    Georgia: "GA",
    Missouri: "MO",
    Kansas: "KS",
    Colorado: "CO",
    "Iowa State": "IA",
    "Oklahoma State": "OK",
    "Kansas State": "KS",
    BYU: "UT",
    "Notre Dame": "IN",
    UConn: "CT",
  };
  const NON_US = new Set([
    "QC",
    "ON",
    "BC",
    "AB",
    "MB",
    "SK",
    "NS",
    "NB",
    "NL",
    "PE",
  ]);
  const STATE_NAMES = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    DC: "Washington, D.C.",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };

  const LEVELS = [
    {
      id: "all",
      short: "All",
      label: "College (D1) + Pro",
      desc: "Everything together",
    },
    {
      id: "pro",
      short: "Pro",
      label: "Pro sports only",
      desc: "MLB · NBA · NFL · NHL",
    },
    {
      id: "college",
      short: "College",
      label: "College (D1) only",
      desc: "SEC · Big Ten · ACC · Big 12 · more",
    },
  ];

  function poolFor(level) {
    if (level === "pro") return ALL_MASCOTS.filter((m) => m.level === "pro");
    if (level === "college")
      return ALL_MASCOTS.filter((m) => m.level === "college");
    return ALL_MASCOTS.slice();
  }

  // ---------- Daily seed ----------
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function quizNumber() {
    const epoch = new Date(2026, 0, 1).getTime();
    const today = new Date();
    const t = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ).getTime();
    return Math.max(1, Math.floor((t - epoch) / 86400000) + 1);
  }
  function seededRng(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let a = h >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pick(arr, rng, n) {
    return shuffle(arr, rng).slice(0, n);
  }

  // ---------- Question generators ----------

  // Synonyms mapping a mascot's `animal` field to words that may appear in a
  // team name. Catches visual leaks where the photo looks like the team even
  // though the mascot's *name* doesn't share a stem with the team — e.g. Dibs
  // (devil) for the DePaul Blue Demons, or any bear-themed mascot for the
  // Cubs / Grizzlies / Bruins.
  const ANIMAL_SYNONYMS = {
    devil: ["demon"],
    bear: ["bruin", "cub", "grizzly"],
    bird: ["cardinal"],
  };

  // Detects when a mascot's name OR animal would visually reveal its team —
  // e.g. "Blue Devil" → "Blue Devils", "Mike the Tiger" → "Tigers", or an
  // animal:"devil" mascot photo shown next to a "Blue Demons" choice. Used to
  // skip mascots that would trivially give away the answer.
  function leaksTeam(m) {
    const norm = (s) =>
      s
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
    const stem = (w) => w.replace(/s$/, "");
    const SKIP = new Set(["the", "of", "and"]);
    const teamWords = norm(m.team).filter((w) => w.length >= 3 && !SKIP.has(w));
    const teamStems = teamWords.map(stem).filter((s) => s.length >= 3);
    const overlaps = (a) => {
      const as = stem(a);
      if (as.length < 3) return false;
      for (const ts of teamStems) {
        if (as === ts) return true;
        if (as.length >= 4 && ts.includes(as)) return true;
        if (ts.length >= 4 && as.includes(ts)) return true;
      }
      return false;
    };
    const nameWords = norm(m.name).filter((w) => w.length >= 3 && !SKIP.has(w));
    for (const nw of nameWords) {
      if (overlaps(nw)) return true;
    }
    if (m.animal) {
      const animal = m.animal.toLowerCase();
      const candidates = [animal, ...(ANIMAL_SYNONYMS[animal] || [])];
      for (const c of candidates) {
        if (overlaps(c)) return true;
      }
    }
    return false;
  }

  function gen_pickTeamFromMascot(rng, pool) {
    // Choices display team logos — exclude entries marked noLogo so we never
    // show a placeholder tile for a question or answer.
    pool = pool.filter((m) => !m.noLogo);
    const safe = pool.filter((m) => !leaksTeam(m));
    if (safe.length < 1) return null;
    const target = safe[Math.floor(rng() * safe.length)];
    const sameLeague = pool.filter(
      (m) =>
        (m.team !== target.team || m.city !== target.city) &&
        m.league === target.league,
    );
    const distractors = pick(
      sameLeague.length >= 3
        ? sameLeague
        : pool.filter((m) => m.team !== target.team || m.city !== target.city),
      rng,
      3,
    );
    const choices = shuffle(
      [target, ...distractors].map((m) => ({
        logo: m.logo,
        emoji: m.emoji,
        label: m.team,
        sub: m.city,
        correct: m.team === target.team && m.city === target.city,
      })),
      rng,
    );
    return {
      promptLabel: `${target.league} • Question`,
      prompt: "Which team does this mascot belong to?",
      subject: {
        image: target.image,
        emoji: target.emoji,
        name: target.name,
      },
      choices,
    };
  }

  function gen_pickMascotFromTeam(rng, pool) {
    // Subject is the team logo. Choices show mascot photos. Restrict to mascots
    // that have real images so we never show an emoji choice next to photo
    // choices (emoji = giveaway by visual elimination), and exclude noLogo so
    // the subject is never a placeholder.
    pool = pool.filter((m) => m.image && !m.noLogo);
    const safe = pool.filter((m) => !leaksTeam(m));
    if (safe.length < 1 || pool.length < 4) return null;
    const target = safe[Math.floor(rng() * safe.length)];
    const distractors = pick(
      pool.filter((m) => m.name !== target.name),
      rng,
      3,
    );
    const choices = shuffle(
      [target, ...distractors].map((m) => ({
        image: m.image,
        emoji: m.emoji,
        label: m.name,
        correct: m.name === target.name,
      })),
      rng,
    );
    return {
      promptLabel: `${target.league} • Question`,
      prompt: `Who is the mascot of this team?`,
      subject: {
        // Hide team nickname (e.g. "Cardinals") since it can give away a
        // distractor mascot with a matching animal. Show city/school + logo.
        logo: target.logo,
        emoji: target.emoji,
        name: target.city,
        sub: target.league,
      },
      choices,
    };
  }

  function gen_pickLeague(rng, pool) {
    const distinct = Array.from(new Set(pool.map((m) => m.league)));
    if (distinct.length < 2) return null;
    const safe = pool.filter((m) => !leaksTeam(m));
    if (safe.length < 1) return null;
    const target = safe[Math.floor(rng() * safe.length)];
    let optionLeagues;
    if (distinct.length <= 4) {
      optionLeagues = distinct;
    } else {
      const others = distinct.filter((l) => l !== target.league);
      optionLeagues = shuffle(others, rng).slice(0, 3).concat([target.league]);
    }
    const choices = shuffle(
      optionLeagues.map((l) => ({ label: l, correct: l === target.league })),
      rng,
    );
    const isCollegePool = pool.every((m) => m.level === "college");
    const isProPool = pool.every((m) => m.level === "pro");
    return {
      promptLabel: isCollegePool
        ? "Conference"
        : isProPool
          ? "League"
          : "League / Conference",
      prompt: isCollegePool
        ? "Which conference does this mascot belong to?"
        : isProPool
          ? "Which league does this mascot belong to?"
          : "Which league or conference does this mascot belong to?",
      subject: {
        image: target.image,
        emoji: target.emoji,
        name: target.name,
      },
      choices,
    };
  }

  function gen_sameAnimal(rng, pool) {
    const byAnimal = {};
    for (const m of pool) (byAnimal[m.animal] ||= []).push(m);
    const groups = Object.entries(byAnimal).filter(
      ([, arr]) => arr.length >= 2,
    );
    if (groups.length === 0) return null;
    const [animal, group] = groups[Math.floor(rng() * groups.length)];
    const target = group[Math.floor(rng() * group.length)];
    const partnerPool = group.filter(
      (m) => m.team !== target.team || m.city !== target.city,
    );
    if (partnerPool.length === 0) return null;
    const partner = partnerPool[Math.floor(rng() * partnerPool.length)];
    const distractors = pick(
      pool.filter((m) => m.animal !== animal),
      rng,
      3,
    );
    const choices = shuffle(
      [partner, ...distractors].map((m) => ({
        logo: m.logo,
        emoji: m.emoji,
        label: m.name,
        sub: `${m.city} ${m.team}`,
        correct: m.name === partner.name && m.city === partner.city,
      })),
      rng,
    );
    return {
      promptLabel: "Match the type",
      prompt: `Which mascot is the same type as ${target.name}?`,
      subject: {
        logo: target.logo,
        emoji: target.emoji,
        name: target.name,
        sub: `${target.city} ${target.team}`,
      },
      choices,
    };
  }

  function gen_oddOneOut(rng, pool) {
    // All 4 choices show mascot photos — restrict to mascots with real images.
    pool = pool.filter((m) => m.image);
    const byLeague = {};
    for (const m of pool) (byLeague[m.league] ||= []).push(m);
    const eligible = Object.entries(byLeague).filter(
      ([, arr]) => arr.length >= 3,
    );
    if (eligible.length < 2) return null;
    const [main, mainArr] = eligible[Math.floor(rng() * eligible.length)];
    const otherLeagues = Object.entries(byLeague).filter(([l]) => l !== main);
    const [, intruderArr] =
      otherLeagues[Math.floor(rng() * otherLeagues.length)];
    const trio = pick(mainArr, rng, 3);
    const intruder = intruderArr[Math.floor(rng() * intruderArr.length)];
    const choices = shuffle(
      [...trio, intruder].map((m) => ({
        image: m.image,
        emoji: m.emoji,
        label: m.name,
        correct: m.name === intruder.name && m.city === intruder.city,
      })),
      rng,
    );
    return {
      promptLabel: "Odd one out",
      prompt: `Three of these mascots are from the ${main}. Tap the one that isn't.`,
      choices,
    };
  }

  // Pretty-print an animal type for the prompt (e.g. "wildcat" -> "wildcat",
  // "saber-cat" -> "saber-cat", but "creature" gets generalized).
  const ANIMAL_LABELS = {
    tiger: "tiger",
    bear: "bear",
    bird: "bird",
    bulldog: "bulldog",
    eagle: "eagle",
    horse: "horse",
    ram: "ram",
    panther: "panther",
    wildcat: "wildcat",
    elephant: "elephant",
    dog: "dog",
    cougar: "cougar",
    devil: "devil",
    knight: "knight",
    hawk: "hawk",
    dolphin: "dolphin",
    bull: "bull",
    wolf: "wolf",
    lion: "lion",
  };

  // Detect whether the pool is all-pro, all-college, or mixed — used to
  // disambiguate write-in prompts so a player on the Pro pool isn't surprised
  // when a college lion is rejected.
  function poolScopeLabel(pool) {
    const levels = new Set(pool.map((m) => m.level));
    if (levels.size !== 1) return null;
    return [...levels][0] === "pro" ? "pro" : "college";
  }

  // Detects if a mascot's NAME would give away the animal (e.g., "Rocky the
  // Bull" when asked which mascot represents a bull team). Mirrors the
  // name-vs-team stem logic in leaksTeam, but compares against the animal.
  function nameLeaksAnimal(mascot, animal) {
    const aliases = [animal, ...(ANIMAL_SYNONYMS[animal] || [])];
    const stem = (w) => w.replace(/[^a-z]/g, "").replace(/s$/, "");
    const nameStems = mascot.name
      .toLowerCase()
      .split(/\s+/)
      .map(stem)
      .filter((s) => s.length >= 3);
    for (const a of aliases) {
      const as = stem(a.toLowerCase());
      if (as.length < 3) continue;
      for (const ns of nameStems) {
        if (ns === as) return true;
        if (ns.length >= 4 && as.includes(ns)) return true;
        if (as.length >= 4 && ns.includes(as)) return true;
      }
    }
    return false;
  }

  function gen_writeMatchAnimal(rng, pool) {
    // Multi-choice: "Which of these mascots has a [animal] team?"
    // 1 correct from the target animal, 3 distractors from other animals.
    const byAnimal = {};
    for (const m of pool) {
      if (!ANIMAL_LABELS[m.animal]) continue;
      (byAnimal[m.animal] ||= []).push(m);
    }
    const eligible = Object.entries(byAnimal).filter(
      ([, arr]) => arr.length >= 1,
    );
    if (eligible.length < 2) return null;
    const [animal, group] = eligible[Math.floor(rng() * eligible.length)];
    // Exclude target candidates whose own NAME contains the animal (e.g.
    // "Rocky the Bull" would self-identify when asking about a bull team).
    const safeGroup = group.filter((m) => !nameLeaksAnimal(m, animal));
    if (safeGroup.length === 0) return null;
    const target = safeGroup[Math.floor(rng() * safeGroup.length)];
    const distractorPool = pool.filter(
      (m) => m.animal !== animal && ANIMAL_LABELS[m.animal],
    );
    if (distractorPool.length < 3) return null;
    const distractors = pick(distractorPool, rng, 3);
    // Hide the team-name suffix — a team named after the animal would
    // trivially give away the answer. Show city + league instead.
    const choices = shuffle(
      [target, ...distractors].map((m) => ({
        label: m.name,
        sub: `${m.city} · ${m.league}`,
        correct: m.name === target.name && m.city === target.city,
      })),
      rng,
    );
    const scope = poolScopeLabel(pool);
    const scopeStr = scope ? `${scope} ` : "";
    return {
      promptLabel: "Animal type",
      prompt: `Which of these ${scopeStr}mascots represents a ${ANIMAL_LABELS[animal]} team?`,
      choices,
    };
  }

  function gen_writeAdultVersion(rng, pool) {
    // Multi-choice: subject mascot + "which of these is also a [animal]?"
    const byAnimal = {};
    for (const m of pool) {
      if (!ANIMAL_LABELS[m.animal]) continue;
      (byAnimal[m.animal] ||= []).push(m);
    }
    const eligible = Object.entries(byAnimal).filter(
      ([, arr]) => arr.length >= 2,
    );
    if (eligible.length === 0) return null;
    const [animal, group] = eligible[Math.floor(rng() * eligible.length)];
    // Prefer "young animal" team names as the subject (Cubs/Wildcats/etc.).
    const youngTeams = ["Cubs", "Bears", "Wolfpack", "Wildcats"];
    const shuffled = shuffle(group, rng);
    const subjectPick =
      shuffled.find((m) => youngTeams.some((t) => m.team.includes(t))) ||
      shuffled[0];
    const subject = subjectPick;
    // Exclude correct-answer candidates whose own NAME contains the animal
    // (e.g. "Rocky the Bull" would self-identify). Subject itself can still
    // have a leaky name — the question already names the animal explicitly.
    const correctAnswer = shuffled.find(
      (m) =>
        (m.name !== subject.name || m.city !== subject.city) &&
        !nameLeaksAnimal(m, animal),
    );
    if (!correctAnswer) return null;
    const distractorPool = pool.filter(
      (m) => m.animal !== animal && ANIMAL_LABELS[m.animal],
    );
    if (distractorPool.length < 3) return null;
    const distractors = pick(distractorPool, rng, 3);
    // Hide the team-name suffix from choice subtitles — the question is
    // "which is also a <animal>?" and a team name like "Cougars" would
    // literally name the animal. Show city + league instead.
    const choices = shuffle(
      [correctAnswer, ...distractors].map((m) => ({
        label: m.name,
        sub: `${m.city} · ${m.league}`,
        correct: m.name === correctAnswer.name && m.city === correctAnswer.city,
      })),
      rng,
    );
    const animalLabel = ANIMAL_LABELS[animal];
    return {
      promptLabel: "Same family",
      prompt: `${subject.name} (${subject.city} ${subject.team}) is a ${animalLabel}. Which of these is also a ${animalLabel} mascot?`,
      subject: subject.image
        ? {
            image: subject.image,
            emoji: subject.emoji,
            name: subject.name,
            sub: `${subject.city} ${subject.team}`,
          }
        : null,
      choices,
    };
  }

  // Curated color schemes — distinctive multi-team color combos.
  // Keyed by `${city} ${team}` to match dataset entries. Schemes need at
  // least 3 dataset-matching teams to fire (see gen_writeMatchColors).
  const COLOR_SCHEMES = {
    "Black & Gold": [
      "Pittsburgh Steelers",
      "Pittsburgh Pirates",
      "Pittsburgh Penguins",
      "New Orleans Saints",
      "Iowa Hawkeyes",
      "Missouri Tigers",
      "Wake Forest Demon Deacons",
    ],
    "Purple & Gold": [
      "LSU Tigers",
      "East Carolina Pirates",
      "James Madison Dukes",
    ],
    "Orange & Black": [
      "Cincinnati Bengals",
      "San Francisco Giants",
      "Philadelphia Flyers",
      "Princeton Tigers",
    ],
    "Carolina Blue": [
      "North Carolina Tar Heels",
      "UCLA Bruins",
      "St. Petersburg Rays",
    ],
    "Red & White": [
      "Atlanta Hawks",
      "St. Louis Cardinals",
      "Cornell Big Red",
      "Wisconsin Badgers",
      "Nebraska Cornhuskers",
      "Indiana Hoosiers",
      "Arkansas Razorbacks",
    ],
    "Navy & Orange": [
      "Chicago Bears",
      "Houston Astros",
      "Detroit Tigers",
      "Auburn Tigers",
    ],
    "Crimson & Cream": [
      "Alabama Crimson Tide",
      "Oklahoma Sooners",
      "Indiana Hoosiers",
    ],
    "Green & White": [
      "Philadelphia Eagles",
      "Michigan State Spartans",
      "Oregon Ducks",
    ],
    "Royal Blue & Yellow": [
      "Los Angeles Rams",
      "Buffalo Sabres",
      "Nashville Predators",
      "Denver Nuggets",
    ],
    "Black & Silver": [
      "Las Vegas Raiders",
      "San Antonio Spurs",
      "Chicago White Sox",
    ],
    "Red & Black": [
      "Atlanta Falcons",
      "Chicago Bulls",
      "Cincinnati Bearcats",
      "Georgia Bulldogs",
      "South Carolina Gamecocks",
      "Louisville Cardinals",
      "Texas Tech Red Raiders",
      "Tampa Buccaneers",
    ],
    "Navy & Red": [
      "Foxborough Patriots",
      "Boston Red Sox",
      "Cleveland Guardians",
      "Arlington Rangers",
      "Washington Nationals",
      "Buffalo Bills",
      "Houston Texans",
      "Minneapolis Twins",
      "Ole Miss Rebels",
    ],
    "Royal Blue & White": [
      "Chicago Cubs",
      "Toronto Blue Jays",
      "Indianapolis Colts",
    ],
    "Red & Gold": [
      "USC Trojans",
      "San Francisco 49ers",
      "Iowa State Cyclones",
      "Kansas City Chiefs",
      "Maryland Terrapins",
    ],
    "Maroon & Gold": [
      "Boston College Eagles",
      "Loyola Chicago Ramblers",
      "Minnesota Golden Gophers",
    ],
    "Green & Yellow": ["Oregon Ducks", "Baylor Bears", "Oakland Athletics"],
  };

  function gen_writeMatchColors(rng, pool) {
    // Multi-choice: 1 correct team from the target scheme, 3 distractors from
    // *other* color schemes (so the wrong answers also have a known scheme).
    const poolByKey = new Map(pool.map((m) => [`${m.city} ${m.team}`, m]));
    const eligible = Object.entries(COLOR_SCHEMES)
      .map(([scheme, teams]) => [scheme, teams.filter((t) => poolByKey.has(t))])
      .filter(([, teams]) => teams.length >= 1);
    if (eligible.length < 2) return null;
    const [scheme, teams] = eligible[Math.floor(rng() * eligible.length)];
    const correctKey = teams[Math.floor(rng() * teams.length)];
    const correctMascot = poolByKey.get(correctKey);
    const sameSchemeSet = new Set(teams);
    // Build distractor pool from teams in OTHER schemes (excludes any team in
    // the target scheme to prevent ambiguity).
    const distractorKeys = new Set();
    for (const [s, ts] of Object.entries(COLOR_SCHEMES)) {
      if (s === scheme) continue;
      for (const t of ts) {
        if (!sameSchemeSet.has(t) && poolByKey.has(t)) distractorKeys.add(t);
      }
    }
    const distractorPool = [...distractorKeys].map((k) => poolByKey.get(k));
    if (distractorPool.length < 3) return null;
    const distractors = pick(distractorPool, rng, 3);
    const choices = shuffle(
      [correctMascot, ...distractors].map((m) => ({
        label: m.team,
        sub: m.city,
        correct: m.team === correctMascot.team && m.city === correctMascot.city,
      })),
      rng,
    );
    const scope = poolScopeLabel(pool);
    const scopeStr = scope ? `${scope} ` : "";
    return {
      promptLabel: "Color match",
      prompt: `Which of these ${scopeStr}teams has ${scheme} as primary colors?`,
      choices,
    };
  }

  function gen_logoToTeam(rng, pool) {
    pool = pool.filter((m) => m.logo && !m.noLogo);
    const target = pool[Math.floor(rng() * pool.length)];
    const sameLeague = pool.filter(
      (m) =>
        (m.team !== target.team || m.city !== target.city) &&
        m.league === target.league,
    );
    const distractors = pick(
      sameLeague.length >= 3
        ? sameLeague
        : pool.filter((m) => m.team !== target.team || m.city !== target.city),
      rng,
      3,
    );
    const choices = shuffle(
      [target, ...distractors].map((m) => ({
        label: m.team,
        sub: m.city,
        correct: m.team === target.team && m.city === target.city,
      })),
      rng,
    );
    return {
      promptLabel: `${target.league} • Logo`,
      prompt: "Whose logo is this?",
      subject: {
        logo: target.logo,
        emoji: target.emoji,
        name: "",
        reveal: true,
      },
      choices,
    };
  }

  function gen_logoToCity(rng, pool) {
    pool = pool.filter((m) => m.logo && !m.noLogo);
    const target = pool[Math.floor(rng() * pool.length)];
    const isCollege = target.level === "college";
    const sameLeague = pool.filter(
      (m) => m.city !== target.city && m.league === target.league,
    );
    const candidatePool =
      sameLeague.length >= 3
        ? sameLeague
        : pool.filter((m) => m.city !== target.city);
    // Dedupe distractors by city so we don't get two "New York" options.
    const seen = new Set([target.city]);
    const distractors = [];
    for (const m of shuffle(candidatePool, rng)) {
      if (seen.has(m.city)) continue;
      seen.add(m.city);
      distractors.push(m);
      if (distractors.length === 3) break;
    }
    const choices = shuffle(
      [target, ...distractors].map((m) => ({
        label: m.city,
        correct: m.city === target.city,
      })),
      rng,
    );
    return {
      promptLabel: `${target.league} • Logo`,
      prompt: isCollege
        ? "Which school's logo is this?"
        : "Where does this team play?",
      subject: {
        logo: target.logo,
        emoji: target.emoji,
        name: "",
        reveal: true,
      },
      choices,
    };
  }

  function gen_pickState(rng, pool) {
    pool = pool.filter((m) => m.logo && !m.noLogo);
    const stateOf = (m) => m.state || STATE_BY_CITY[m.city];
    const us = pool.filter((m) => {
      const s = stateOf(m);
      return s && !NON_US.has(s);
    });
    if (us.length < 1) return null;
    const target = us[Math.floor(rng() * us.length)];
    return {
      type: "map",
      promptLabel: `${target.league} • Map`,
      prompt: "Tap the state where this team plays.",
      subject: { logo: target.logo, emoji: target.emoji, name: "" },
      targetState: stateOf(target),
      targetCity: target.city,
    };
  }

  // Difficulty buckets — easier types fill early slots, harder types fill late slots.
  const EASY_GENS = [gen_pickLeague, gen_logoToTeam, gen_logoToCity];
  const MEDIUM_GENS = [gen_pickTeamFromMascot, gen_pickMascotFromTeam];
  const HARD_GENS = [
    gen_pickState,
    gen_oddOneOut,
    gen_writeMatchAnimal,
    gen_writeAdultVersion,
    gen_writeMatchColors,
  ];

  // Per-question MAX point values. Total perfect = 100.
  const POINTS = [100, 100, 200, 300, 300];
  const TIMER_SECONDS = 30;
  // Speed bands — `mult` is the multiplier at the START of each band; the
  // actual multiplier ramps down linearly across the band toward the next
  // band's mult (see getBandMultiplier). This produces a continuous gradient
  // so faster answers score higher even within the same band.
  // Tuned generously so a player answering most questions correctly in ~5s
  // can reach 950+/1000 (Hall of Fame).
  const BANDS = [
    { name: "Lightning", maxSec: 12, mult: 1.0, emoji: "⚡" },
    { name: "Quick", maxSec: 20, mult: 0.85, emoji: "🔥" },
    { name: "Steady", maxSec: 26, mult: 0.65, emoji: "✓" },
    { name: "Last second", maxSec: 30, mult: 0.45, emoji: "⏱" },
    // beyond 30s: hard floor (player took longer than the timer)
    { name: "Overtime", maxSec: Infinity, mult: 0.3, emoji: "🐢" },
  ];
  function getBand(elapsedSec) {
    for (const b of BANDS) if (elapsedSec < b.maxSec) return b;
    return BANDS[BANDS.length - 1];
  }
  // Continuous multiplier: interpolates within a band from its mult (start)
  // down to the next band's mult (end). The Overtime band stays flat.
  function getBandMultiplier(elapsedSec) {
    for (let i = 0; i < BANDS.length; i++) {
      const b = BANDS[i];
      if (elapsedSec < b.maxSec) {
        if (b.maxSec === Infinity) return b.mult;
        const prev = i > 0 ? BANDS[i - 1].maxSec : 0;
        const next = BANDS[i + 1] || b;
        const t = Math.max(
          0,
          Math.min(1, (elapsedSec - prev) / (b.maxSec - prev)),
        );
        return b.mult + (next.mult - b.mult) * t;
      }
    }
    return BANDS[BANDS.length - 1].mult;
  }

  // Categorize "mascot vs logo" by primary subject visual.
  const MASCOT_GENS_SET = new Set([
    gen_pickTeamFromMascot,
    gen_pickLeague,
    gen_oddOneOut,
    gen_writeMatchAnimal,
    gen_writeAdultVersion,
    gen_writeMatchColors,
  ]);
  const LOGO_GENS_SET = new Set([
    gen_pickMascotFromTeam,
    gen_logoToTeam,
    gen_logoToCity,
    gen_pickState,
  ]);

  function pickFrom(bucket, rng, contentType, used) {
    const filtered = bucket.filter((g) => {
      if (used.has(g)) return false;
      if (contentType === "mascots" && !MASCOT_GENS_SET.has(g)) return false;
      if (contentType === "logos" && !LOGO_GENS_SET.has(g)) return false;
      return true;
    });
    if (filtered.length === 0) {
      // Allow repeats if bucket is exhausted
      const fallback = bucket.filter((g) => {
        if (contentType === "mascots" && !MASCOT_GENS_SET.has(g)) return false;
        if (contentType === "logos" && !LOGO_GENS_SET.has(g)) return false;
        return true;
      });
      if (fallback.length === 0) return null;
      return fallback[Math.floor(rng() * fallback.length)];
    }
    return filtered[Math.floor(rng() * filtered.length)];
  }

  function buildDailyQuiz(level, contentType) {
    contentType = contentType || "both";
    const pool = poolFor(level);
    const seed = `${todayKey()}:${level}:${contentType}`;
    const rng = seededRng(seed);

    // Q1, Q2: easy. Q3: medium. Q4: pinned map (when contentType allows). Q5: hard.
    const used = new Set();
    const slots = [EASY_GENS, EASY_GENS, MEDIUM_GENS, HARD_GENS, HARD_GENS];
    const lineup = [];
    // Map question (gen_pickState) is in LOGO_GENS_SET, so it's only pinnable
    // when the player hasn't restricted to mascots-only content.
    const mapPinnable = contentType !== "mascots";
    for (let i = 0; i < slots.length; i++) {
      let g;
      if (i === 3 && mapPinnable && !used.has(gen_pickState)) {
        g = gen_pickState;
      } else {
        g = pickFrom(slots[i], rng, contentType, used);
      }
      if (g) {
        lineup.push(g);
        used.add(g);
      }
    }

    const questions = [];
    for (const g of lineup) {
      const q = g(rng, pool);
      if (q) questions.push(q);
    }
    // Top up if any generator returned null (e.g., tiny pool).
    while (questions.length < QUESTIONS_PER_DAY) {
      questions.push(gen_pickMascotFromTeam(rng, pool));
    }
    return { date: seed, questions: questions.slice(0, QUESTIONS_PER_DAY) };
  }

  // ---------- State ----------
  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveState(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  const state = loadState();
  state.streak ||= 0;
  state.lastPlayed ||= null;
  state.level ||= "all";
  state.contentType ||= "both";
  state.theme = "editorial";

  function applyTheme(t) {
    const all = ["default", "editorial", "stadium", "glass", "riso"];
    document.documentElement.classList.remove(...all.map((x) => `theme-${x}`));
    document.documentElement.classList.add(`theme-${t}`);
    document.querySelectorAll(".theme-dot").forEach((d) => {
      d.classList.toggle("active", d.dataset.theme === t);
    });
  }
  applyTheme(state.theme);
  document.querySelectorAll(".theme-dot").forEach((d) => {
    d.addEventListener("click", () => {
      state.theme = d.dataset.theme;
      saveState(state);
      applyTheme(state.theme);
    });
  });
  state.history ||= {};

  function todaysResultFor(level, contentType) {
    return state.history[`${todayKey()}:${level}:${contentType}`] || null;
  }

  // ---------- Render helpers ----------
  const screen = document.getElementById("screen");
  const streakCountEl = document.getElementById("streakCount");
  const dayLabelEl = document.getElementById("dayLabel");

  function refreshStreak() {
    streakCountEl.textContent = state.streak || 0;
  }
  function setDayLabel(n) {
    dayLabelEl.textContent = `Quiz #${n}`;
  }
  function clearScreen() {
    screen.innerHTML = "";
  }
  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "onclick") e.addEventListener("click", v);
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
    for (const c of [].concat(children)) {
      if (c == null) continue;
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return e;
  }
  function visualEl(item, sizeClass) {
    // Renders an image (mascot photo or team logo) with emoji fallback on error.
    const wrap = el("span", { class: `visual ${sizeClass}` });
    const isMascot = !!item?.image;
    const src = item?.image || item?.logo;
    if (src) {
      if (isMascot) wrap.classList.add("visual-mascot");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.className = isMascot ? "mascot-img" : "logo-img";
      img.onerror = () => {
        wrap.innerHTML = "";
        wrap.classList.remove("visual-mascot");
        if (isMascot) {
          // Mascot photos can fall back to emoji — emoji is a reasonable proxy.
          wrap.classList.add("visual-fallback");
          wrap.textContent = item.emoji || "•";
        } else {
          // Team logo failed to load — show a neutral placeholder, not an emoji
          // (emoji-as-logo is misleading and gives the answer away).
          wrap.classList.add("visual-empty");
        }
      };
      wrap.appendChild(img);
    } else {
      wrap.classList.add("visual-fallback");
      wrap.textContent = (item && item.emoji) || "";
    }
    return wrap;
  }
  function toast(msg) {
    const t = el("div", { class: "toast show" }, msg);
    document.body.appendChild(t);
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 250);
    }, 1600);
  }

  // ---------- Screens ----------
  let quiz,
    currentIdx,
    results,
    pointsEarned,
    bandsAchieved,
    userAnswers,
    currentLevel,
    currentContentType;
  let timerStart = 0;
  let timerInterval = null;
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  function elapsedSec() {
    return Math.max(0, (performance.now() - timerStart) / 1000);
  }
  function startTimer() {
    timerStart = performance.now();
    stopTimer();
    timerInterval = setInterval(updateTimerBar, 100);
  }
  function updateTimerBar() {
    const fill = document.querySelector(".timer-fill");
    if (!fill) {
      stopTimer();
      return;
    }
    const e = elapsedSec();
    const pct = Math.max(0, 100 - (e / TIMER_SECONDS) * 100);
    fill.style.width = pct + "%";
    fill.dataset.band = getBand(e).name.replace(/\s+/g, "");
  }

  const CONTENT_TYPES = [
    { id: "both", short: "Both", desc: "Mascots & logos mixed" },
    { id: "mascots", short: "Mascots", desc: "Just the characters" },
    { id: "logos", short: "Logos", desc: "Just team logos" },
  ];

  function showTitle() {
    clearScreen();
    setDayLabel(quizNumber());
    const today = todaysResultFor(state.level, state.contentType);
    const alreadyPlayed = !!today;
    const levelMeta = LEVELS.find((l) => l.id === state.level);
    const ctMeta = CONTENT_TYPES.find((c) => c.id === state.contentType);

    const levelTabs = el(
      "div",
      { class: "level-tabs", role: "tablist" },
      LEVELS.map((l) =>
        el(
          "button",
          {
            class: `level-tab${l.id === state.level ? " active" : ""}`,
            onclick: () => {
              state.level = l.id;
              saveState(state);
              showTitle();
            },
          },
          l.short,
        ),
      ),
    );

    const contentTabs = el(
      "div",
      { class: "level-tabs", role: "tablist" },
      CONTENT_TYPES.map((c) =>
        el(
          "button",
          {
            class: `level-tab${c.id === state.contentType ? " active" : ""}`,
            onclick: () => {
              state.contentType = c.id;
              saveState(state);
              showTitle();
            },
          },
          c.short,
        ),
      ),
    );

    const card = el("div", { class: "card title-screen" }, [
      el("div", { class: "hero" }, [
        el("img", {
          src: "images/combine-wordmark.svg",
          alt: "Combine",
          class: "hero-img",
        }),
      ]),
      el(
        "p",
        { class: "lede" },
        "5 questions. Easier early, bigger points later.",
      ),
      el("div", { class: "tab-section-label" }, "Pool"),
      levelTabs,
      el("div", { class: "tab-section-label" }, "Question type"),
      contentTabs,
      el("div", { class: "level-desc" }, [
        el(
          "div",
          { class: "level-desc-label" },
          `${levelMeta.label} · ${ctMeta.short}`,
        ),
        el("div", { class: "level-desc-sub" }, ctMeta.desc),
      ]),
      alreadyPlayed
        ? el(
            "div",
            { class: "level-status" },
            `Played today — ${today.score}/1000 (${today.correctCount || today.results.filter(Boolean).length}/5).`,
          )
        : null,
      el(
        "button",
        {
          class: "btn",
          onclick: () =>
            alreadyPlayed
              ? showResult(state.level, state.contentType)
              : startQuiz(state.level, state.contentType),
        },
        alreadyPlayed ? "See today's result" : "Play today",
      ),
      el(
        "div",
        { class: "puzzle-meta" },
        `Quiz #${quizNumber()} • ${todayKey()}`,
      ),
    ]);
    screen.appendChild(card);
  }

  function startQuiz(level, contentType) {
    currentLevel = level;
    currentContentType = contentType;
    quiz = buildDailyQuiz(level, contentType);
    currentIdx = 0;
    results = [];
    pointsEarned = [];
    bandsAchieved = [];
    userAnswers = [];
    showQuestion();
  }

  function showQuestion() {
    clearScreen();
    const q = quiz.questions[currentIdx];

    const progress = el(
      "div",
      { class: "q-progress" },
      quiz.questions.map((_, i) => {
        let cls = "pip";
        if (i < results.length) cls += results[i] ? " correct" : " wrong";
        else if (i === currentIdx) cls += " active";
        return el("div", { class: cls });
      }),
    );

    const points = POINTS[currentIdx];
    const tier = points === 10 ? 1 : points === 20 ? 2 : 3;
    const timer = el("div", { class: "timer-bar" }, [
      el("div", { class: "timer-fill" }),
    ]);
    const labelLine = el("div", { class: "q-prompt-label-row" }, [
      el("div", { class: "q-prompt-label" }, q.promptLabel),
      el("div", { class: `q-points q-points-${tier}x` }, `up to ${points} pts`),
    ]);
    const promptEl = el("h2", { class: "q-prompt" }, q.prompt);
    const header = [timer, labelLine, promptEl];

    let subjectEl = null;
    if (q.subject) {
      const hasVisual = !!(q.subject.logo || q.subject.emoji);
      const hasText = !!(q.subject.name || q.subject.sub);
      let subjectClass = "q-subject";
      if (hasVisual && !hasText) subjectClass += " q-subject-centered";
      else if (!hasVisual && hasText) subjectClass += " q-subject-text-only";
      if (q.subject.reveal) subjectClass += " q-subject-reveal";
      subjectEl = el("div", { class: subjectClass }, [
        hasVisual ? visualEl(q.subject, "visual-lg") : null,
        hasText
          ? el("div", { class: "q-subject-text" }, [
              q.subject.name
                ? el("div", { class: "name" }, q.subject.name)
                : null,
              q.subject.sub ? el("div", { class: "sub" }, q.subject.sub) : null,
            ])
          : null,
      ]);
    }

    let body;
    if (q.type === "map") {
      body = el("div", { class: "map-wrap" });
      renderMap(body, q);
    } else if (q.type === "write-in") {
      body = renderWriteIn(q);
    } else {
      const choicesWrap = el("div", { class: "choices" });
      const buttons = q.choices.map((c, i) => {
        const hasVisual = !!(c.logo || c.emoji);
        return el(
          "button",
          { class: "choice", onclick: () => onAnswer(i, buttons) },
          [
            hasVisual ? visualEl(c, "visual-md") : null,
            el("div", { class: "text" }, [
              el("div", {}, c.label),
              c.sub
                ? el(
                    "div",
                    {
                      class: "choice-sub",
                      style:
                        "font-weight:500;color:var(--ink-soft);font-size:13px;margin-top:2px;",
                    },
                    c.sub,
                  )
                : null,
            ]),
          ],
        );
      });
      buttons.forEach((b) => choicesWrap.appendChild(b));
      body = choicesWrap;
    }

    const card = el("div", { class: "card" }, [
      progress,
      ...header,
      subjectEl,
      body,
    ]);
    screen.appendChild(card);

    // Staged reveal — orient the player before starting the timer.
    // Order: question-type label → question prompt → subject (if any) →
    // choices/body → (brief beat) → timer bar appears and starts.
    const stages = [labelLine, promptEl];
    if (subjectEl) stages.push(subjectEl);
    stages.push(body);
    for (const el of [...stages, timer]) {
      el.classList.add("q-stage-reveal");
    }
    let delay = 150;
    const stepMs = 950;
    for (const stageEl of stages) {
      setTimeout(() => stageEl.classList.add("q-stage-shown"), delay);
      delay += stepMs;
    }
    // After choices land, give the player a short beat to scan, then reveal
    // the timer bar and start the clock.
    setTimeout(() => {
      timer.classList.add("q-stage-shown");
      startTimer();
    }, delay);
  }

  // ---- Map rendering ----
  let _cachedMapSvg = null;
  async function getMapSvg() {
    if (_cachedMapSvg) return _cachedMapSvg;
    const r = await fetch("us-map.svg");
    _cachedMapSvg = await r.text();
    return _cachedMapSvg;
  }

  // ---- Write-in question rendering ----
  function normalizeAnswer(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s]/g, " ")
      .replace(/\bthe\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  // An acceptable entry may be either a plain string (canonical = alias) or
  // an object with { canonical, aliases } so a single mascot can be matched
  // by its name, team, or "city team" string and still de-dupe correctly.
  function canonicalOf(item) {
    return typeof item === "string" ? item : item.canonical;
  }
  function aliasesOf(item) {
    return typeof item === "string" ? [item] : item.aliases;
  }
  function matchAnswer(input, acceptableList) {
    const ni = normalizeAnswer(input);
    if (!ni || ni.length < 2) return null;
    let best = null;
    for (const item of acceptableList) {
      const canonical = canonicalOf(item);
      for (const a of aliasesOf(item)) {
        const na = normalizeAnswer(a);
        if (na === ni) return canonical;
        // Substring fuzzy: input must be a meaningful chunk (>=3 chars) of alias
        if (na.includes(ni) && ni.length >= 3) {
          best = best || canonical;
        }
        // Or first significant word of alias matches input fully
        const aWords = na.split(" ");
        if (aWords.some((w) => w.length >= 3 && w === ni)) return canonical;
      }
    }
    return best;
  }
  function renderWriteIn(q) {
    const wrap = el("div", { class: "writein-wrap" });
    const inputs = [];
    for (let i = 0; i < q.inputs; i++) {
      const inp = document.createElement("input");
      inp.type = "text";
      inp.className = "writein-input";
      inp.placeholder =
        q.inputs > 1 ? `Mascot or team ${i + 1}` : `Mascot or team`;
      inp.autocomplete = "off";
      inp.autocapitalize = "off";
      inp.spellcheck = false;
      inputs.push(inp);
      wrap.appendChild(inp);
    }
    const submit = el(
      "button",
      {
        class: "btn writein-submit",
        onclick: () => onWriteSubmit(q, inputs, submit),
      },
      "Submit",
    );
    wrap.appendChild(submit);
    // Auto-focus first input
    setTimeout(() => inputs[0]?.focus(), 60);
    // Enter submits
    inputs.forEach((inp, i) => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (i < inputs.length - 1) inputs[i + 1].focus();
          else submit.click();
        }
      });
    });
    return wrap;
  }
  function onWriteSubmit(q, inputEls, submitBtn) {
    if (submitBtn.disabled) return;
    submitBtn.disabled = true;
    stopTimer();
    const e = elapsedSec();

    const matched = new Set();
    let correctCount = 0;
    inputEls.forEach((inp) => {
      const m = matchAnswer(inp.value, q.acceptable);
      if (m && !matched.has(m)) {
        matched.add(m);
        inp.classList.add("correct");
        inp.value = m; // normalize displayed text to canonical name
        correctCount++;
      } else {
        inp.classList.add("wrong");
        inp.disabled = true;
      }
      inp.disabled = true;
    });

    const max = POINTS[currentIdx];
    const ratio = correctCount / q.inputs;
    const band = correctCount > 0 ? getBand(e) : null;
    const pts =
      correctCount > 0 ? Math.round(max * ratio * getBandMultiplier(e)) : 0;
    results.push(correctCount > 0);
    pointsEarned.push(pts);
    bandsAchieved.push(
      band ? `${band.name} ${correctCount}/${q.inputs}` : null,
    );
    userAnswers.push(inputEls.map((inp) => inp.value).filter(Boolean));

    // Show what they missed (display canonical names)
    const missed = q.acceptable.filter((a) => !matched.has(canonicalOf(a)));
    if (missed.length > 0) {
      const missedEl = el("div", { class: "writein-missed" }, [
        el("div", { class: "writein-missed-label" }, "Other valid answers:"),
        el(
          "div",
          { class: "writein-missed-list" },
          missed.slice(0, 6).map(canonicalOf).join(" · "),
        ),
      ]);
      submitBtn.parentElement.appendChild(missedEl);
    }
    if (correctCount > 0) {
      const tag = el(
        "div",
        { class: `band-tag band-${band.name.replace(/\s+/g, "")}` },
        `${band.emoji} ${correctCount}/${q.inputs} +${pts}`,
      );
      document.body.appendChild(tag);
      setTimeout(() => tag.remove(), 1600);
    }

    setTimeout(() => {
      currentIdx++;
      if (currentIdx >= quiz.questions.length) finishQuiz();
      else showQuestion();
    }, 1900);
  }

  async function renderMap(container, q) {
    const svgText = await getMapSvg();
    container.innerHTML = svgText;
    const svg = container.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("class", "us-map-svg");
    svg.setAttribute("viewBox", "0 0 959 593");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.removeAttribute("style");
    // Strip <title> elements so browsers don't show the native hover tooltip.
    svg.querySelectorAll("title").forEach((t) => t.remove());
    let answered = false;
    const allPaths = svg.querySelectorAll("path");
    allPaths.forEach((p) => {
      const cls = p.getAttribute("class") || "";
      const stateAbbr = cls.length === 2 ? cls.toUpperCase() : null;
      if (stateAbbr) {
        p.classList.add("state-path");
        p.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          stopTimer();
          const e = elapsedSec();
          const correct = stateAbbr === q.targetState;
          const max = POINTS[currentIdx];
          const band = correct ? getBand(e) : null;
          const pts = correct ? Math.round(max * getBandMultiplier(e)) : 0;
          results.push(correct);
          pointsEarned.push(pts);
          bandsAchieved.push(band ? band.name : null);
          userAnswers.push(stateAbbr);
          p.classList.add(correct ? "state-correct" : "state-wrong");
          if (!correct) {
            const correctPath = svg.querySelector(
              `path.${q.targetState.toLowerCase()}`,
            );
            correctPath?.classList.add("state-correct-shown");
          }
          // Tag of what the right answer was
          const stateName = STATE_NAMES[q.targetState] || q.targetState;
          const tag = el(
            "div",
            { class: "map-answer-tag" },
            correct
              ? `${band.emoji} ${band.name} +${pts}`
              : `Answer: ${stateName}`,
          );
          tag.classList.add(correct ? "correct" : "wrong");
          container.appendChild(tag);
          setTimeout(() => {
            currentIdx++;
            if (currentIdx >= quiz.questions.length) finishQuiz();
            else showQuestion();
          }, 1400);
        });
      }
    });

    attachMapZoom(container, svg);
  }

  // Pinch-zoom + pan + on-screen zoom controls for the US map.
  function attachMapZoom(container, svg) {
    let scale = 1;
    let tx = 0;
    let ty = 0;
    let startScale = 1;
    let startTx = 0;
    let startTy = 0;
    let pinchDist = 0;
    let panStart = null;
    let moved = 0;
    const minScale = 1;
    const maxScale = 5;
    svg.style.transformOrigin = "0 0";
    svg.style.willChange = "transform";

    function apply() {
      svg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }
    function clamp() {
      if (scale <= 1) {
        tx = 0;
        ty = 0;
        return;
      }
      const w = container.clientWidth;
      const h = svg.getBoundingClientRect().height / scale;
      const sw = w * scale;
      const sh = h * scale;
      tx = Math.max(w - sw, Math.min(0, tx));
      ty = Math.max(h - sh, Math.min(0, ty));
    }
    function zoomBy(factor, cx, cy) {
      const oldScale = scale;
      scale = Math.max(minScale, Math.min(maxScale, scale * factor));
      if (cx != null && cy != null) {
        tx = cx - ((cx - tx) * scale) / oldScale;
        ty = cy - ((cy - ty) * scale) / oldScale;
      }
      clamp();
      apply();
    }

    container.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          pinchDist = Math.hypot(dx, dy);
          startScale = scale;
          startTx = tx;
          startTy = ty;
        } else if (e.touches.length === 1) {
          panStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            ix: tx,
            iy: ty,
          };
          moved = 0;
        }
      },
      { passive: true },
    );
    container.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2 && pinchDist > 0) {
          e.preventDefault();
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          scale = Math.max(
            minScale,
            Math.min(maxScale, startScale * (dist / pinchDist)),
          );
          clamp();
          apply();
        } else if (e.touches.length === 1 && panStart) {
          const dx = e.touches[0].clientX - panStart.x;
          const dy = e.touches[0].clientY - panStart.y;
          moved = Math.max(moved, Math.hypot(dx, dy));
          if (scale > 1) {
            e.preventDefault();
            tx = panStart.ix + dx;
            ty = panStart.iy + dy;
            clamp();
            apply();
          }
        }
      },
      { passive: false },
    );
    container.addEventListener("touchend", () => {
      panStart = null;
      pinchDist = 0;
    });
    // Block state taps if the user actually panned.
    svg.addEventListener(
      "click",
      (e) => {
        if (moved > 8) {
          e.stopPropagation();
          e.preventDefault();
          moved = 0;
        }
      },
      true,
    );
    // Desktop wheel-zoom (ctrl+wheel / trackpad pinch).
    container.addEventListener(
      "wheel",
      (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        zoomBy(
          e.deltaY < 0 ? 1.1 : 1 / 1.1,
          e.clientX - rect.left,
          e.clientY - rect.top,
        );
      },
      { passive: false },
    );
    // Desktop click-drag pan when zoomed.
    let mouseDown = null;
    container.addEventListener("mousedown", (e) => {
      if (scale <= 1) return;
      mouseDown = { x: e.clientX, y: e.clientY, ix: tx, iy: ty };
      moved = 0;
    });
    window.addEventListener("mousemove", (e) => {
      if (!mouseDown) return;
      const dx = e.clientX - mouseDown.x;
      const dy = e.clientY - mouseDown.y;
      moved = Math.max(moved, Math.hypot(dx, dy));
      tx = mouseDown.ix + dx;
      ty = mouseDown.iy + dy;
      clamp();
      apply();
    });
    window.addEventListener("mouseup", () => {
      mouseDown = null;
    });
    // On-screen zoom buttons (top-right of map).
    const cxCenter = () => container.clientWidth / 2;
    const cyCenter = () => svg.getBoundingClientRect().height / 2;
    const controls = el("div", { class: "map-zoom-controls" }, [
      el(
        "button",
        {
          class: "map-zoom-btn",
          "aria-label": "Zoom in",
          onclick: () => zoomBy(1.4, cxCenter(), cyCenter()),
        },
        "+",
      ),
      el(
        "button",
        {
          class: "map-zoom-btn",
          "aria-label": "Zoom out",
          onclick: () => zoomBy(1 / 1.4, cxCenter(), cyCenter()),
        },
        "−",
      ),
      el(
        "button",
        {
          class: "map-zoom-btn",
          "aria-label": "Reset",
          onclick: () => {
            scale = 1;
            tx = 0;
            ty = 0;
            apply();
          },
        },
        "⌂",
      ),
    ]);
    container.appendChild(controls);
  }

  function onAnswer(idx, buttons) {
    stopTimer();
    const e = elapsedSec();
    const q = quiz.questions[currentIdx];
    const correct = q.choices[idx].correct;
    const max = POINTS[currentIdx];
    const band = correct ? getBand(e) : null;
    const pts = correct ? Math.round(max * getBandMultiplier(e)) : 0;
    results.push(correct);
    pointsEarned.push(pts);
    bandsAchieved.push(band ? band.name : null);
    const pickedChoice = q.choices[idx];
    userAnswers.push(
      pickedChoice
        ? pickedChoice.sub
          ? `${pickedChoice.label} — ${pickedChoice.sub}`
          : pickedChoice.label
        : null,
    );

    buttons.forEach((b, i) => {
      b.disabled = true;
      if (q.choices[i].correct) b.classList.add("correct");
      else if (i === idx) b.classList.add("wrong");
      else b.classList.add("muted");
    });

    // Brief band-feedback toast
    if (correct) {
      const tag = el(
        "div",
        { class: `band-tag band-${band.name.replace(/\s+/g, "")}` },
        `${band.emoji} ${band.name.toUpperCase()} +${pts}`,
      );
      document.body.appendChild(tag);
      setTimeout(() => tag.remove(), 1200);
    }

    setTimeout(() => {
      currentIdx++;
      if (currentIdx >= quiz.questions.length) finishQuiz();
      else showQuestion();
    }, 1100);
  }

  function finishQuiz() {
    const points = pointsEarned.reduce((s, p) => s + (p || 0), 0);
    const correctCount = results.filter(Boolean).length;
    const dateKey = todayKey();
    const key = `${dateKey}:${currentLevel}:${currentContentType}`;
    state.history[key] = {
      score: points,
      correctCount,
      results: results.slice(),
      points: pointsEarned.slice(),
      bands: bandsAchieved.slice(),
      userAnswers: userAnswers.slice(),
      level: currentLevel,
      contentType: currentContentType,
    };

    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yKey = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    if (state.lastPlayed === yKey || state.lastPlayed === dateKey) {
      if (state.lastPlayed !== dateKey) state.streak = (state.streak || 0) + 1;
    } else {
      state.streak = 1;
    }
    state.lastPlayed = dateKey;
    saveState(state);
    refreshStreak();
    showResult(currentLevel, currentContentType);
  }

  function shareGrid(level, contentType) {
    const today = state.history[`${todayKey()}:${level}:${contentType}`];
    if (!today) return "";
    return today.results.map((r) => (r ? "✅" : "❌")).join("");
  }
  function shareDateLabel() {
    const d = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  // Builds the expandable detail panel under a result-summary row, showing
  // the question prompt + subject + user's answer + correct answer.
  function buildAnswerDetail(q, wasCorrect, userAnswer) {
    const parts = [];
    parts.push(el("div", { class: "detail-prompt" }, q.prompt));
    if (q.subject && (q.subject.logo || q.subject.image)) {
      const visEl =
        q.subject.image || q.subject.logo
          ? (() => {
              const img = document.createElement("img");
              img.src = q.subject.image || q.subject.logo;
              img.alt = q.subject.name || "";
              img.className = "detail-thumb";
              return img;
            })()
          : null;
      if (visEl) parts.push(visEl);
      if (q.subject.name) {
        parts.push(el("div", { class: "detail-subject-name" }, q.subject.name));
      }
    }
    let answerText = "";
    if (q.type === "map") {
      const stateName = STATE_NAMES[q.targetState] || q.targetState;
      answerText = `${stateName} (${q.targetCity})`;
    } else if (q.type === "write-in") {
      const list = q.acceptable.slice(0, 8).map(canonicalOf).join(" · ");
      const more =
        q.acceptable.length > 8 ? ` +${q.acceptable.length - 8}` : "";
      answerText = list + more;
    } else if (q.choices) {
      const correct = q.choices.find((c) => c.correct);
      if (correct) {
        answerText = correct.label + (correct.sub ? ` — ${correct.sub}` : "");
      }
    }
    // Format the user's answer for display (handles MC label, map state, write-in array, missed)
    let userText = null;
    if (userAnswer != null) {
      if (Array.isArray(userAnswer)) {
        userText = userAnswer.filter(Boolean).join(" · ") || null;
      } else if (q.type === "map") {
        userText = STATE_NAMES[userAnswer] || userAnswer;
      } else {
        userText = String(userAnswer);
      }
    }
    if (userText) {
      parts.push(
        el(
          "div",
          { class: `detail-guess ${wasCorrect ? "correct" : "wrong"}` },
          [
            el("span", { class: "detail-guess-label" }, "Your answer:"),
            el("span", { class: "detail-guess-value" }, " " + userText),
          ],
        ),
      );
    } else if (!wasCorrect) {
      parts.push(
        el("div", { class: "detail-guess wrong" }, [
          el("span", { class: "detail-guess-label" }, "Your answer:"),
          el("span", { class: "detail-guess-value" }, " (no answer)"),
        ]),
      );
    }
    if (answerText) {
      parts.push(
        el("div", { class: "detail-answer" }, [
          el(
            "span",
            { class: "detail-answer-label" },
            wasCorrect ? "Answer:" : "Correct answer:",
          ),
          el("span", { class: "detail-answer-value" }, " " + answerText),
        ]),
      );
    }
    return parts;
  }

  function showResult(level, contentType) {
    clearScreen();
    const today = state.history[`${todayKey()}:${level}:${contentType}`] || {
      score: 0,
      results: [],
    };
    const grid = shareGrid(level, contentType);
    const n = quizNumber();
    const levelMeta = LEVELS.find((l) => l.id === level);

    // Regenerate the same daily quiz (deterministic by seed) so we can show
    // the prompt + correct answer when a player clicks a row.
    let recapQuiz = null;
    try {
      recapQuiz = buildDailyQuiz(level, contentType);
    } catch (e) {
      recapQuiz = null;
    }

    const summaryRows = today.results.map((r, i) => {
      const earned = (today.points && today.points[i]) || 0;
      const band = today.bands && today.bands[i];
      const bandMeta = band ? BANDS.find((b) => b.name === band) : null;
      const bandLabel = r
        ? bandMeta
          ? `${bandMeta.emoji} ${band}`
          : "Correct"
        : "Missed";
      const q = recapQuiz?.questions?.[i];
      const head = el(
        "div",
        { class: `row row-head ${r ? "correct" : "wrong"}` },
        [
          el("div", { class: "pip" }),
          el("div", { style: "flex:1" }, `Q${i + 1} — ${bandLabel}`),
          el(
            "div",
            { style: "font-weight:700;color:var(--ink-soft)" },
            `${earned} / ${POINTS[i]}`,
          ),
        ],
      );
      if (!q) return head;
      head.classList.add("row-clickable");
      head.appendChild(el("div", { class: "row-chevron" }, "▾"));
      const userAnswer = today.userAnswers ? today.userAnswers[i] : undefined;
      const detail = buildAnswerDetail(q, r, userAnswer);
      const detailEl = el("div", { class: "row-detail" }, detail);
      const wrap = el("div", { class: "row-wrap" }, [head, detailEl]);
      head.addEventListener("click", () => {
        wrap.classList.toggle("expanded");
      });
      return wrap;
    });

    // Carnival "test of strength" — fire/ice thermometer with hammer + striker pad
    const RANK_TIERS = [
      { min: 950, label: "HALL OF FAME", emoji: "🏆" },
      { min: 800, label: "CHAMPION", emoji: "🥇" },
      { min: 600, label: "PRO", emoji: "⚡" },
      { min: 400, label: "AMATEUR", emoji: "💪" },
      { min: 200, label: "ROOKIE", emoji: "👶" },
      { min: 0, label: "WARMING UP", emoji: "🥱" },
    ];
    const tierFor = (s) => RANK_TIERS.find((t) => s >= t.min);

    // LED-style score readout at the top of the tower
    const ticker = el("div", { class: "striker-led-num" }, "0");
    const led = el("div", { class: "striker-led" }, [
      ticker,
      el("div", { class: "striker-led-of" }, "/1000"),
    ]);
    // Thermometer ticks down the tower (100..1000 from bottom to top)
    const tickEls = [];
    for (let v = 100; v >= 10; v -= 10) {
      tickEls.push(
        el("div", { class: "striker-tick", style: `bottom:${v}%` }, [
          el("div", { class: "striker-tick-line" }),
          el("div", { class: "striker-tick-num" }, String(v * 10)),
        ]),
      );
    }
    // Rank tier markers on the opposite side — light up as the puck passes.
    const tierEls = [];
    for (const tier of RANK_TIERS) {
      if (tier.min === 0) continue; // skip floor; everyone starts there
      const pct = tier.min / 10; // 950 → 95%
      tierEls.push(
        el(
          "div",
          {
            class: "striker-tier",
            style: `bottom:${pct}%`,
            "data-tier": tier.label.replace(/\s+/g, ""),
          },
          [
            el("span", { class: "striker-tier-label" }, tier.label),
            el("span", { class: "striker-tier-emoji" }, tier.emoji),
            el("div", { class: "striker-tier-line" }),
          ],
        ),
      );
    }
    const fillEl = el("div", { class: "striker-fill" });
    const puckEl = el("div", { class: "striker-puck" });
    // Tower-glass keeps overflow:hidden for the gradient + fill + puck.
    // Tick numbers and tier markers live OUTSIDE the glass so they aren't clipped.
    const tower = el("div", { class: "striker-tower" }, [
      el("div", { class: "striker-tower-glass" }, [fillEl, puckEl]),
      ...tickEls,
      ...tierEls,
    ]);
    // Hammer + striker pad at the base
    const hammer = el("div", { class: "striker-hammer" });
    hammer.innerHTML = `
      <svg viewBox="0 0 60 90" class="striker-hammer-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hmrWood" x1="0" x2="1">
            <stop offset="0%" stop-color="#5a3a22"/>
            <stop offset="35%" stop-color="#a47148"/>
            <stop offset="55%" stop-color="#8b5a36"/>
            <stop offset="100%" stop-color="#3e2818"/>
          </linearGradient>
          <linearGradient id="hmrMetalTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5a5a5e"/>
            <stop offset="40%" stop-color="#2c2c30"/>
            <stop offset="100%" stop-color="#0a0a0c"/>
          </linearGradient>
          <linearGradient id="hmrMetalSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3a3a3e"/>
            <stop offset="100%" stop-color="#161618"/>
          </linearGradient>
        </defs>
        <!-- shadow under handle -->
        <ellipse cx="30" cy="86" rx="12" ry="2" fill="rgba(0,0,0,0.35)"/>
        <!-- handle -->
        <rect x="26" y="22" width="8" height="62" rx="3" fill="url(#hmrWood)" stroke="#2a1a0c" stroke-width="0.6"/>
        <!-- handle highlight -->
        <rect x="27" y="24" width="2" height="58" rx="1" fill="rgba(255,220,170,0.45)"/>
        <!-- handle grip wrap -->
        <rect x="25" y="64" width="10" height="16" rx="1" fill="#2a1810" opacity="0.85"/>
        <rect x="25" y="64" width="10" height="2" fill="#0a0604"/>
        <rect x="25" y="78" width="10" height="2" fill="#0a0604"/>
        <!-- hammer head main block -->
        <rect x="6" y="2" width="48" height="22" rx="3" fill="url(#hmrMetalTop)" stroke="#0a0a0c" stroke-width="1.2"/>
        <!-- hammer head face highlight (top edge) -->
        <rect x="8" y="3" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/>
        <!-- claw notch on left -->
        <path d="M 6 24 L 6 14 L 12 14 L 14 24 Z" fill="url(#hmrMetalSide)" stroke="#0a0a0c" stroke-width="0.8"/>
        <!-- collar where head meets handle -->
        <rect x="22" y="18" width="16" height="6" rx="1" fill="#1a1a1c" stroke="#0a0a0c" stroke-width="0.5"/>
      </svg>
    `;
    const pad = el("div", { class: "striker-pad" });
    pad.innerHTML = `
      <svg viewBox="0 0 110 60" class="striker-pad-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYEnd meet">
        <defs>
          <radialGradient id="padDome" cx="0.5" cy="0.25" r="0.85">
            <stop offset="0%" stop-color="#ff8a60"/>
            <stop offset="40%" stop-color="#e92424"/>
            <stop offset="80%" stop-color="#8a0808"/>
            <stop offset="100%" stop-color="#3a0202"/>
          </radialGradient>
          <linearGradient id="padBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1a1a1c"/>
            <stop offset="60%" stop-color="#0c0c0e"/>
            <stop offset="100%" stop-color="#000"/>
          </linearGradient>
        </defs>
        <!-- ground shadow -->
        <ellipse cx="55" cy="58" rx="50" ry="3" fill="rgba(0,0,0,0.45)"/>
        <!-- black anvil base -->
        <rect x="6" y="42" width="98" height="14" rx="3" fill="url(#padBase)" stroke="#000" stroke-width="1.2"/>
        <!-- top edge highlight on base -->
        <rect x="8" y="43" width="94" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
        <!-- bolts on base -->
        <circle cx="14" cy="49" r="2" fill="#3a3a3c" stroke="#000" stroke-width="0.6"/>
        <circle cx="14" cy="49" r="0.6" fill="#0a0a0a"/>
        <circle cx="96" cy="49" r="2" fill="#3a3a3c" stroke="#000" stroke-width="0.6"/>
        <circle cx="96" cy="49" r="0.6" fill="#0a0a0a"/>
        <!-- red dome -->
        <path d="M 12 44 Q 12 6 55 6 Q 98 6 98 44 Z" fill="url(#padDome)" stroke="#1a0202" stroke-width="1.4"/>
        <!-- dome top gloss -->
        <ellipse cx="55" cy="14" rx="34" ry="6" fill="rgba(255,255,255,0.42)"/>
        <!-- subtle inner shadow on dome -->
        <path d="M 12 44 Q 12 6 55 6 Q 98 6 98 44" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>
      </svg>
    `;
    const base = el("div", { class: "striker-base" }, [hammer, pad]);
    // Rank label
    const rankLabel = el("div", { class: "striker-rank" }, "");

    const striker = el("div", { class: "strength-tester" }, [
      el("div", { class: "striker-cabinet" }, [led, tower]),
      rankLabel,
    ]);

    const card = el("div", { class: "card result" }, [
      el("div", { class: "score-label" }, `${levelMeta.short} • Today's score`),
      striker,
      el("div", { class: "grid-share" }, grid || "—"),
      el("div", { class: "summary" }, summaryRows),
      el("div", { class: "result-actions" }, [
        el(
          "button",
          {
            class: "btn",
            onclick: async () => {
              const text = `Combine · ${shareDateLabel()}\n${today.score}/1000\n${grid}\nhttps://combine-app.vercel.app`;
              try {
                // URL inlined as plain text (no `url` field) so the native
                // share sheet doesn't generate a rich preview card — receiving
                // apps auto-link it as tappable plain text.
                if (navigator.share) await navigator.share({ text });
                else {
                  await navigator.clipboard.writeText(text);
                  toast("Copied result to clipboard");
                }
              } catch {}
            },
          },
          "Share result",
        ),
        el(
          "button",
          { class: "btn secondary", onclick: showTitle },
          "Back to home",
        ),
      ]),
      el("div", { class: "next-puzzle" }, "Next quiz drops at midnight."),
    ]);
    screen.appendChild(card);

    // Animate the high-striker — back-easing overshoot + tier flashes + ticker punches.
    const target = today.score || 0;
    const duration = 5700;
    const startTs = performance.now();
    // Back-out overshoot: shoots past target, settles back. Adds physicality.
    const easeOutBack = (t) => {
      const c1 = 1.70158,
        c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    let lastTier = null;
    let lastDecade = -1;
    const flashTicks = striker.querySelectorAll(".striker-tick, .striker-tier");
    const flashedTicks = new Set();
    function tick(now) {
      const t = Math.min(1, (now - startTs) / duration);
      const eased = easeOutBack(t);
      const cur = Math.max(0, target * eased);
      const pct = Math.max(0, Math.min(105, cur / 10));
      const displayed = Math.round(Math.min(target, cur));
      ticker.textContent = String(displayed);
      fillEl.style.height = pct + "%";
      puckEl.style.bottom = pct + "%";

      // Punch the ticker each time it passes a multiple of 100.
      const decade = Math.floor(displayed / 100);
      if (decade !== lastDecade && displayed > 0) {
        lastDecade = decade;
        ticker.classList.remove("punch");
        // Force reflow to restart animation
        void ticker.offsetWidth;
        ticker.classList.add("punch");
      }

      // Flash thermometer ticks and tier markers as the puck crosses them.
      flashTicks.forEach((m) => {
        if (flashedTicks.has(m)) return;
        const tickPct = parseFloat(m.style.bottom);
        if (pct >= tickPct) {
          flashedTicks.add(m);
          m.classList.add("crossed");
        }
      });

      // Update rank label live as we cross tiers.
      const tier = tierFor(displayed);
      if (!lastTier || lastTier.label !== tier.label) {
        lastTier = tier;
        rankLabel.textContent = `${tier.emoji} ${tier.label}`;
        rankLabel.dataset.tier = tier.label.replace(/\s+/g, "");
        rankLabel.classList.remove("punch");
        void rankLabel.offsetWidth;
        rankLabel.classList.add("punch");
      }

      if (t < 1) requestAnimationFrame(tick);
      else {
        // Final flourish
        ticker.textContent = String(target);
        if (target >= 950) striker.classList.add("hall-of-fame");
        striker.classList.add("settled");
        // Shockwave from puck position at settle
        const wave = el("div", { class: "striker-shockwave" });
        wave.style.bottom = pct + "%";
        striker.querySelector(".striker-tower-glass").appendChild(wave);
        setTimeout(() => wave.remove(), 900);
      }
    }
    // Hammer pre-swing: hammer drops onto pad, pad pulses, THEN puck launches.
    setTimeout(() => {
      striker.classList.add("hammered");
      setTimeout(() => requestAnimationFrame(tick), 380);
    }, 220);
  }

  // ---------- Boot ----------
  refreshStreak();
  setDayLabel(quizNumber());
  showTitle();

  let pressTimer = null;
  document.getElementById("streakBtn").addEventListener("mousedown", () => {
    pressTimer = setTimeout(() => {
      if (confirm("Reset all Combine progress?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    }, 900);
  });
  document
    .getElementById("streakBtn")
    .addEventListener("mouseup", () => clearTimeout(pressTimer));
  document
    .getElementById("streakBtn")
    .addEventListener("mouseleave", () => clearTimeout(pressTimer));

  // ---------- Combine groups (Supabase) ----------
  document
    .getElementById("groupsBtn")
    .addEventListener("click", () => showGroups());

  // First-run prompt for a display name. Resolves to the player row, or null
  // if the user dismisses.
  async function promptDisplayName() {
    let name = prompt(
      "Pick a display name for the leaderboard (1-24 characters)",
    );
    name = (name || "").trim().slice(0, 24);
    if (!name) return null;
    return await window.Combine.setDisplayName(name);
  }

  function levelShort(id) {
    return (LEVELS.find((l) => l.id === id) || { short: id }).short;
  }
  function contentShort(id) {
    return (CONTENT_TYPES.find((c) => c.id === id) || { short: id }).short;
  }

  async function showGroups() {
    clearScreen();
    let player;
    try {
      await window.Combine.ensureSession();
      player = await window.Combine.getPlayer();
      if (!player) {
        player = await promptDisplayName();
        if (!player) return showTitle();
      }
    } catch (e) {
      console.error(e);
      alert("Couldn't connect to Combine: " + (e.message || e));
      return showTitle();
    }

    const loadingEl = el("div", { class: "groups-loading" }, "Loading groups…");
    const card = el("div", { class: "card groups-screen" }, [loadingEl]);
    screen.appendChild(card);

    let groups = [];
    try {
      groups = await window.Combine.listMyGroups();
    } catch (e) {
      console.error(e);
      loadingEl.textContent = "Couldn't load groups: " + (e.message || e);
      return;
    }
    loadingEl.remove();

    // Header
    card.appendChild(
      el("div", { class: "groups-head" }, [
        el("div", { class: "score-label" }, "Groups"),
        el(
          "div",
          { class: "groups-player-name" },
          `Playing as ${player.display_name}`,
        ),
      ]),
    );

    // List of your groups
    card.appendChild(el("h3", { class: "groups-section-h" }, "Your groups"));
    if (groups.length === 0) {
      card.appendChild(
        el(
          "p",
          { class: "groups-empty" },
          "No groups yet. Create one below or join with a code from a friend.",
        ),
      );
    } else {
      const list = el("div", { class: "groups-list" });
      for (const g of groups) {
        list.appendChild(
          el(
            "button",
            { class: "group-item", onclick: () => showGroupDetail(g.id) },
            [
              el("div", { class: "group-item-name" }, g.name),
              el(
                "div",
                { class: "group-item-meta" },
                `${levelShort(g.level)} · ${contentShort(g.content_type)} · ${g.id}`,
              ),
            ],
          ),
        );
      }
      card.appendChild(list);
    }

    // Create group
    card.appendChild(el("h3", { class: "groups-section-h" }, "Create a group"));
    const createName = document.createElement("input");
    createName.className = "writein-input";
    createName.placeholder = "Group name";
    createName.maxLength = 40;
    const createLevel = makeModeSelect(
      LEVELS.map((l) => ({ id: l.id, label: l.short })),
      currentLevel || state.level || "all",
    );
    const createContent = makeModeSelect(
      CONTENT_TYPES.map((c) => ({ id: c.id, label: c.short })),
      currentContentType || state.contentType || "both",
    );
    const createBtn = el(
      "button",
      {
        class: "btn",
        onclick: async () => {
          const name = createName.value.trim();
          if (!name) {
            alert("Group name required");
            return;
          }
          createBtn.disabled = true;
          createBtn.textContent = "Creating…";
          try {
            await window.Combine.createGroup({
              name,
              level: createLevel.value,
              contentType: createContent.value,
            });
            showGroups();
          } catch (e) {
            console.error(e);
            alert("Couldn't create group: " + (e.message || e));
            createBtn.disabled = false;
            createBtn.textContent = "Create group";
          }
        },
      },
      "Create group",
    );
    card.appendChild(
      el("div", { class: "group-create" }, [
        createName,
        el("div", { class: "group-create-mode" }, [
          el("label", {}, [
            el("span", { class: "group-mode-lbl" }, "Pool"),
            createLevel,
          ]),
          el("label", {}, [
            el("span", { class: "group-mode-lbl" }, "Type"),
            createContent,
          ]),
        ]),
        createBtn,
      ]),
    );

    // Join with code
    card.appendChild(el("h3", { class: "groups-section-h" }, "Join with code"));
    const joinCode = document.createElement("input");
    joinCode.className = "writein-input group-code-input";
    joinCode.placeholder = "ABC123";
    joinCode.maxLength = 6;
    joinCode.autocapitalize = "characters";
    const joinBtn = el(
      "button",
      {
        class: "btn",
        onclick: async () => {
          const code = joinCode.value.trim().toUpperCase();
          if (!code) {
            alert("Enter a 6-character group code");
            return;
          }
          joinBtn.disabled = true;
          joinBtn.textContent = "Joining…";
          try {
            await window.Combine.joinGroup(code);
            showGroups();
          } catch (e) {
            console.error(e);
            alert("Couldn't join: " + (e.message || e));
            joinBtn.disabled = false;
            joinBtn.textContent = "Join";
          }
        },
      },
      "Join",
    );
    card.appendChild(el("div", { class: "group-join" }, [joinCode, joinBtn]));

    // Back
    card.appendChild(
      el(
        "button",
        { class: "btn secondary", onclick: () => showTitle() },
        "Back to play",
      ),
    );
  }

  function makeModeSelect(options, selected) {
    const sel = document.createElement("select");
    sel.className = "group-mode-select";
    for (const o of options) {
      const opt = document.createElement("option");
      opt.value = o.id;
      opt.textContent = o.label;
      if (o.id === selected) opt.selected = true;
      sel.appendChild(opt);
    }
    return sel;
  }

  async function showGroupDetail(code) {
    clearScreen();
    const card = el("div", { class: "card groups-screen" }, [
      el("div", { class: "groups-loading" }, "Loading…"),
    ]);
    screen.appendChild(card);
    // Full leaderboard UI ships in step 3.
    alert(
      `Group detail (leaderboard) for ${code} ships in the next update. The Today / Week / All-time tabs come next.`,
    );
    showGroups();
  }

  // Quietly establish the anon session on boot so subsequent calls are fast.
  if (window.Combine) {
    window.Combine.ensureSession().catch((e) => {
      console.warn("Combine session init failed:", e.message || e);
    });
  }
})();
