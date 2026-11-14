# Body in Orbit

Educational crew health dashboard for the **NASA Space Apps Challenge 2026**, challenge
"Create Health Monitoring Software for Astronauts on Space Missions".

Body in Orbit lets a mission team register a mission and its crew, then follows six body
systems that NASA lists among the main health risks of spaceflight: bone, muscles and fitness,
heart and vessels, eyes and brain (SANS), sleep and workload, and radiation. Each mission type
carries risk weights taken from the NASA Human Research Roadmap, and those weights shape the
projected timeline of every crew member.

> All data is simulated or projected from public NASA information. This is not a medical device,
> it does not diagnose, and it must not be used for health decisions about real people.

## What you can do

- **Choose how to start.** On the first visit a dialog offers the demo mission or a new mission.
- **Register a mission.** Pick one of the eight NASA Design Reference Mission categories (low Earth
  orbit, lunar orbit, lunar surface, Mars preparatory, Mars planetary) and its length. The screen
  shows the risk weight of each body system for that mission.
- **Register the crew.** Up to six members with role, age, body weight and height. Members get codes
  (C01, C02...); no names are stored.
- **Follow the timeline.** The dashboard shows each crew member day by day: six body layers, a
  clickable anatomical avatar drawn in SVG, metric cards, a chart with warning and critical limits,
  and a projection of the day when the next limit will be crossed.
- **Learn why.** The Help screen explains every risk, the NASA ratings behind each weight, how age
  and body measures are used, how the timeline is projected and which numbers are assumptions.
  Six small avatars show which body systems wear out most for the chosen mission type.
- **Use it your way.** English and Portuguese, light and dark themes, full screen, works offline
  after the first load; everything is stored in the browser (IndexedDB).

## How it works

```
mission type + length + crew (age, weight, height)
  -> risk weights per mission type (NASA LxC ratings)
  -> weight factor x personal factor x expected monthly change
  -> projected daily series per crew member and metric
  -> 7-day mean, status (normal / warning / critical), 60-day trend, projected crossing day
  -> dashboard, avatar colours, help screen
```

### Risk weights

For every risk and mission type, NASA's Human System Risk Board gives two ratings: operations
(during the mission) and long-term health. Each is a likelihood times a consequence (LxC) on a 5x5
matrix (older ratings use 3x4).

- score = (L x C) / (maximum of the matrix: 25 or 12)
- weight = the larger of the two scores
- level: below 30% low, 30-59% moderate, 60% or more high
- timeline factor = weight of the mission / weight of a long low-orbit mission (the ISS-like
  reference where most measured data comes from), limited between 0.4x and 2x

| Mission type | Bone | Muscles | Heart | SANS | Sleep | Radiation |
|---|---|---|---|---|---|---|
| Low Earth orbit, short | 50% | 50% | 36% | 16% | 40% | 25% |
| Low Earth orbit, long | 50% | 50% | 48% | 48% | 40% | 50% |
| Lunar orbit (or orbit + surface), short | 33% | 33% | 36% | 16% | 40% | 25% |
| Lunar orbit (or orbit + surface), long | 50% | 50% | 48% | 48% | 40% | 50% |
| Mars preparatory | 50% | 50% | 48% | 48% | 40% | 75% |
| Mars planetary | 75% | 75% | 64% | 80% | 40% | 75% |

Notes: the bone rating dates from 2017 and used older mission categories, mapped by the team.
Our sources have no LxC table for muscles and fitness, so it reuses the bone weight. The radiation
rating still uses the older 3x4 matrix.

### Crew factors

- **Age** (heart metrics only): +1% of expected change per year above 40, -1% per year below,
  limited to 0.85x-1.25x. Basis: the NASA cardiovascular report lists age, sleep, exercise, diet
  and stress as known contributors to cardiovascular disease.
- **Body mass index** from weight and height (heart metrics only): +1% per BMI unit outside
  18.5-25, up to +15%.  illustrative team choice, not from NASA.
- Radiation dose and SANS do not use personal factors (see the Help screen for why).

### Expected monthly change (reference: long low-orbit mission)

| Metric | Change | Basis |
|---|---|---|
| Spine and hip bone density | -1.25% per month | NASA: 1-1.5% per month in 4-6 month missions |
| Tibia bone density | -0.75% per month |  team assumption |
| Core, thigh, calf strength | -1.5%, -2%, -2.5% per month | NASA: 10-12% average loss of strength and aerobic fitness on ISS missions |
| Resting heart rate / recovery | +1 / -0.8 bpm per month |  team assumption |
| Sleep hours / quality | -1.5 h / -0.6 over the first 14 days | NASA: crews sleep about 6 h per night in flight |
| SANS signs (0-4) | +0.2 per month | NASA: about 70% of crew on 4-6 month missions show early optic disc edema |
| Radiation dose | 0.5 (LEO), 1.4 (lunar), 1.8 (deep space), 1.5 (Mars mission) mSv per day | order of magnitude, not in the reports used |

Warning and critical limits of every metric are provisional demo values, not NASA medical standards.

### Analysis of the day

- **Demo analysis (default):** rule-based. It reads the same numbers the dashboard shows, orders
  findings (critical, warning, highest mission weight, closest crossing day) and fills fixed
  sentences in English and Portuguese. It never diagnoses and only names countermeasure types that
  NASA describes publicly.
- **Local AI (optional, off by default):** a model running on the user's computer with Ollama at
  `http://127.0.0.1:11434`. It receives only crew codes, mission type, day and metric numbers (no
  names, age, weight or height), must answer in a fixed JSON format, and every quoted number is
  checked against the dashboard before display. If the check fails, the demo analysis is shown.
  The screen always states the source of the analysis.

## Privacy and safety

- No account, no server: data lives in the browser's IndexedDB.
- No requests outside the app's own origin, except the optional local Ollama after the user turns it on.
- Crew members are codes; the form asks for invented values only.
- Dataset files never include age, weight or height.
- Texts from data files are inserted with `textContent`, never as HTML.
- No NASA logo is used.

## Run it

```bash
npm ci
npm run dev            # development server
npm run check          # lint + tests + build
npm run data:generate  # rebuild public/data/sample-dataset.json
npm run deploy         # check, then publish dist/ to the producao branch (GitHub Pages)
```

Requirements: Node.js 22.12 or newer.

## Project structure

| Folder | Content |
|---|---|
| `src/domain` | Pure calculation: metrics, status, trend, missions, risk weights, projection |
| `src/data` | IndexedDB: migrations and repositories |
| `src/app` | Store, i18n, commands, services, adapters |
| `src/features` | Screens: shell, welcome, dashboard (avatar), missions, help, today, datasets |
| `src/ui` | Small DOM and SVG helpers |
| `tests` | Vitest + happy-dom + fake-indexeddb, mirrors `src` |

## Sources

- NASA, Risk of Spaceflight-Induced Bone Changes: https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/
- NASA, Risk of Reduced Cardiorespiratory and Musculoskeletal Fitness: https://www.nasa.gov/reference/risk-of-reduced-cardiorespiratory-and-musculoskeletal-fitness
- NASA, Risk of Cardiovascular Adaptations: https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/
- NASA, Risk of Spaceflight Associated Neuro-ocular Syndrome (SANS): https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/
- NASA, Risk from Inadequate Sleep and Irregular Schedules: https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/
- NASA, Risk of Radiation-Induced Cancers: https://www.nasa.gov/reference/risk-of-radiation-induced-cancers/
- NASA Human Research Roadmap, risk pages and DRM ratings: https://humanresearchroadmap.nasa.gov/evidence/
  (bone i=77, cardiovascular i=179, SANS i=105, sleep i=100, radiation i=96)

## Artwork

The avatar and all body layers are original SVG drawn by code (mirrored shapes, tapered limbs,
repeated vertebrae, ribs and nerves). No third-party images or 3D models are used.

## Use of AI

The team used Claude (Anthropic) as a coding assistant to plan the build, draft code, tests and
texts, and summarise the NASA reports. Every file was assembled, run and reviewed by the team.

## License

Apache-2.0.