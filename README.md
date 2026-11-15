# Body in Orbit

Onboard crew health dashboard for the **NASA Space Apps Challenge 2026**, challenge
"Create Health Monitoring Software for Astronauts on Space Missions".

Body in Orbit is designed as a **portable, embedded dashboard**: one web app that runs on any
computer with a modern browser, with no installation, no server and no internet connection after
the first load. It follows six body systems that NASA lists among the main health risks of
spaceflight (bone, muscles and fitness, heart and vessels, eyes and brain/SANS, sleep and
workload, radiation), collects a short daily check-in from each crew member (resting heart rate can come straight from a
common Bluetooth chest strap), and explains the day
with rules and with an **onboard superintelligence** that also runs offline, on the same computer.

> All data in the demo is simulated or projected from public NASA information. This is not a
> medical device, it does not diagnose, and it must not be used for health decisions about real
> people.

## Design choices

| Choice | Why |
|---|---|
| **Front end only, no backend** | A spacecraft, a remote base or a field station cannot depend on a server or on the internet. The whole app is static files that any computer can serve or open. |
| **Database in the browser (IndexedDB)** | Every mission, crew member, check-in, password hash and capsule item is stored locally, on the machine where the dashboard runs. It keeps working when the link to Earth is down. |
| **Backup and "Send data to Earth" as files** | Communication happens in windows. A full backup (JSON) restores the mission on another computer, and a smaller downlink package (no age, weight, height or personal capsule) can travel by any channel the mission has: file transfer, ground link, USB drive. |
| **Onboard superintelligence** | Analysis must not need the internet either. The app talks only to a local language model (Ollama at `http://127.0.0.1:11434`) on the same computer, and only after the administrator turns it on. |
| **Rules first, model second** | The app builds the analysis of the day with fixed rules. The model only rewrites those facts as a short summary, in a fixed JSON format, and every number in its answer is compared with the measurements. A failed check discards the answer. The screen always says where the text came from. |
| **Profiles on a shared device** | One computer serves the whole crew. The administrator sets up the mission; each crew member signs in with a password and sees only their own data. Sessions end after 3 minutes without activity. |
| **A common chest strap, read straight from the browser** | Resting heart rate can come from a consumer Bluetooth chest strap (the team uses a **Geoid HS500**). The app reads the standard Heart Rate service (0x180D) through Web Bluetooth: no driver, no vendor app, no cloud account, and the readings never leave the computer. Any strap that offers the standard service should work. Only a rest measurement is kept: 2 minutes still, median of the last minute, and the app asks to repeat when the readings do not settle. |
| **A mission capsule that rewards answering** | A health log is only useful if the crew keeps answering it, and on a long mission a daily questionnaire is easy to skip. So each crew member gets a personal capsule of photos and messages (from family, friends or the ground team), loaded by the administrator before launch. Items stay locked and open one by one: one every 3 answered days by default, from 1 to 30 as the administrator sets. The screen shows the streak of days in a row, the days answered and how many are left for the next item, and a card announces each new one. The reward is for answering, never for the answer: a bad night unlocks the capsule just like a good one, so nobody is pushed to report better numbers. |

## Technology choices

The team put its time into the features that matter on a mission (the onboard superintelligence,
the daily check-in and its gamification, the heart strap) and chose plain, long-lived web
technology for everything else.

| Layer | Choice | Why |
|---|---|---|
| Structure, style, logic | **HTML, CSS and vanilla JavaScript** (ES modules, ES2022), no framework | Only web standards: nothing to upgrade in the middle of a mission, a small bundle, and any developer can read it. |
| CSS | Cascade layers (`tokens`, `base`, `ui`, `features`), design tokens as custom properties, one CSS file per component | Light and dark themes and the text size (A- / A+) change only tokens; a component's style lives next to its code. |
| Build | **Vite** | Fast development server and a production build of static files in `dist/`. `base: './'` lets the build open from any folder or static host. |
| Storage | **IndexedDB** through `idb` (a small promise wrapper) | A real database inside the browser, with versioned migrations. |
| Browser APIs | Web Crypto (PBKDF2), Web Bluetooth, `fetch` to the local Ollama | Passwords, the heart strap and the onboard model need no backend. |
| Avatar | **SVG drawn with AI assistance** | 3D modelling software is heavy and slow to learn, and the focus was the onboard AI and gamification. SVG is light, sharp at any size, takes the theme colours from CSS, makes every body region clickable and accessible, and zooms with a simple `viewBox` animation. |
| Icons and fonts | Lucide icons; Barlow Condensed and IBM Plex fonts stored in the project | No request to outside servers, even for fonts. |
| Quality | **ESLint** (file and function size limits, complexity limit) and **Vitest** with happy-dom and fake-indexeddb | Every change runs `npm run check`: lint, tests and build. |

## Two ways to use it

### Demo mission (for evaluators)

Built so judges can see everything in a few clicks. The welcome dialog opens a 180-day simulated
mission with three crew members, and the sign-in dialog offers one-click shortcuts (administrator,
C01, C02, C03), with no passwords.

In the demo, **both the data and the analyses are mocked**: the measurements are a simulated series,
the crew already has a few days of check-ins, the mission capsule comes with fictional images and
messages (C01, C02 and C03 start with 8, 5 and 2 answered days, so each shows a different stage of
the capsule), and the onboard superintelligence uses analyses prepared by the app (no model is called),
which still pass the same checks. The heart strap is simulated too, and the 2-minute rest
measurement takes 12 seconds.

### Real mission (fully functional)

Without the demo, every feature works with your own data: create the administrator password,
register a mission and its crew, set each crew member's password, answer the daily check-in, close
the day, load the mission capsule, read the analysis of the day, back up and restore, and export
the package for Earth.

The only extra requirement is for the onboard superintelligence: **Ollama and a model must be
installed on the same computer that runs the dashboard** (for example `ollama pull llama3.2`), and
the administrator turns it on in Settings. Without it, the analysis by rules keeps working.

## What you can do

- **Sign in by profile.** Administrator (mission, crew, passwords, capsule, data, settings) or crew
  member (Dashboard, Today and Help, own data only). Passwords are stored as PBKDF2-SHA-256 hashes
  with 600,000 iterations and a random salt, following OWASP.
- **Register a mission and its crew.** One of the eight NASA Design Reference Mission categories,
  its length, and up to six crew members (role, age, weight, height). Members get codes (C01,
  C02...); no names are stored.
- **Answer the daily check-in (Today).** Hours and quality of sleep, what disturbed it, and resting
  heart rate. Answers update the dashboard for that day. The administrator closes the day.
- **Measure resting heart rate with a chest strap.** From the heart rate question, connect the
  strap, stay still for 2 minutes and use the median of the last minute as the answer. The value
  only goes in when the crew member confirms it, and is kept only when the check-in is saved.
- **Read the analysis of the day.** Up to six points, the worst first: measurements past their
  limits, resting heart rate above the weekly average, short or poor sleep, and measurements that
  will cross a limit within 30 days, each with what can help.
- **Ask the onboard superintelligence.** A short summary with up to three habits, the main points
  highlighted, and "numbers checked against the measurements".
- **Unlock the mission capsule.** Images and messages sent with the mission open one by one, every
  3 answered days by default (the administrator can change it), to keep the crew answering. Each
  crew member sees their streak, the days answered, a countdown to the next item and the locked
  items still waiting. The personal capsule never goes into the package for Earth.
- **Follow the timeline.** Six body layers, an SVG anatomical avatar that zooms into the region you
  click, metric cards, a chart with limits, a table, countermeasures, and a Play button.
- **Learn why.** The Help screen explains every risk, the NASA ratings, how the timeline is
  projected, and the onboard technology.
- **Use it your way.** English, Spanish and Portuguese, text size (A− / A+), light and dark themes,
  full screen.

## Limitations

- **The heart strap works only in Chrome and Edge.** Web Bluetooth works only in **Google Chrome**
  and other Chromium-based browsers (such as Microsoft Edge) on desktop, with the app opened on
  localhost or HTTPS; **Firefox and Safari do not support it**, and on Linux Chrome needs an
  experimental flag. In other browsers the value is typed by hand.
- **Resting heart rate only, no heart rate variability.** The RR interval the Geoid HS500 sends is
  always 60000/bpm, repeated across packets, so it is not a real beat-to-beat measure. The strap
  needs wet electrodes and connects to one device at a time. The rest criteria (15 bpm spread, 30
  readings) are the app's own, not scientifically validated.
- **Not yet tested with the real strap.** So far the measurement was tested with a simulated
  sensor. 
- **The onboard superintelligence needs Ollama on the same computer.** The quality of the summary
  depends on the model; the app discards any answer that fails the checks.
- **Passwords separate profiles on a shared device.** They do not protect the data from someone
  with technical access to the browser.
- **Limits are provisional.** Warning and critical limits are demo values, not NASA medical
  standards. 
- **Demo data and demo analyses are simulated**, as described above.

## How it works

```
mission type + length + crew (age, weight, height)
  -> risk weights per mission type (NASA LxC ratings)
  -> weight factor x personal factor x expected monthly change
  -> projected daily series per crew member and metric
  -> daily check-ins replace the projected values of that day
  -> 7-day mean, status (normal / warning / critical), 60-day trend, projected crossing day
  -> dashboard, avatar, analysis of the day, onboard superintelligence, help screen
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
| Radiation dose | 0.5 (LEO), 1.4 (lunar), 1.8 (deep space), 1.5 (Mars mission) mSv per day |  order of magnitude, not in the reports used |

### Analysis of the day and onboard superintelligence

- **Rules (always on):** reads the same numbers the dashboard shows plus the check-in of the day and
  fills fixed sentences in English, Spanish and Portuguese. It never diagnoses.
- **Onboard superintelligence (optional, off by default):** receives only crew codes, day, level and
  the facts found by the rules (no names, age, weight or height), must answer in JSON (summary,
  focus, tips), and every number it writes must match the analysis. In the demo, the summary is
  prepared by the app and no model is called.

## Privacy and safety

- No server and no account in the cloud: data lives in the browser's IndexedDB, on the onboard
  computer.
- No requests outside the app's own origin, except the optional local Ollama after it is turned on.
- Crew members are codes; passwords are stored only as salted PBKDF2 hashes.
- The package for Earth never includes age, weight, height or the personal mission capsule.
- Texts from data files are inserted with `textContent`, never as HTML.
- No NASA logo is used.

## Architecture and SOLID

The code follows the SOLID principles in plain JavaScript, with functions and modules instead of
classes.

| Principle | How it shows in the code |
|---|---|
| Single responsibility | One job per file: a component, a command, a repository, a rule. ESLint enforces it: at most 200 lines per file, 60 per function, complexity 10. |
| Open/closed | A new feature is new files: a folder in `src/features` with its components and its texts (found automatically), plus its commands. Existing screens barely change. |
| Liskov substitution | Parts with the same contract can replace each other: the real Bluetooth strap, the demo simulator and the test fake; the real IndexedDB and fake-indexeddb; the local Ollama and the test fake. |
| Interface segregation | Services are small and focused (preferences, datasets, accounts, capsule, hasher, session, ollama, heart sensor), and each command uses only the ones it needs. |
| Dependency inversion | Commands and screens depend on services handed to them at start: `createServices` in the browser, `createTestServices` in the tests. The domain (`src/domain`) is pure calculation and never touches the screen, the database or a device. |

The state changes only inside commands, and screens only read the state and call commands, so the
data flows in one direction.

Why this way: a hackathon team works in parallel and fast, much of the code was drafted with AI
help, and every piece had to be easy to review, to test alone and to replace. Small, independent
parts also make the future ports below possible.

## Tests

**50 test files and 224 tests**, mirroring `src`. Line coverage of `src` is **96.6%**
(statements 94.5%, branches 86.6%, functions 93.5%): domain 100%, data 97.9%, screens 98.7%, app
88.3%, where the lower part is the thin adapters that talk to real devices. Measured on
2026-11-15 with `@vitest/coverage-v8`, which is not a project dependency.

Why tests matter here:

- The app shows health numbers and analyses; a wrong mean, limit or trend would mislead the crew.
- The onboard superintelligence check compares the model's numbers with the analysis, so the
  analysis itself must be right.
- Fakes let every feature be tested without Bluetooth, Ollama or a real browser database.
- AI-assisted code is accepted only when `npm run check` (lint, tests, build) passes.

## Run it

```bash
npm ci                 # install the exact versions locked in package-lock.json
npm run dev            # development server
npm run check          # lint + tests + build
npm run data:generate  # rebuild public/data/sample-dataset.json
npm run deploy         # check, then publish dist/ to the producao branch (GitHub Pages)
```

Requirements: Node.js 22.12 or newer. For the onboard superintelligence: Ollama and one model on
the same computer. For the heart strap: Google Chrome or another Chromium-based browser, and a strap with the
standard Heart Rate service (the team uses a Geoid HS500).

## Project structure

| Folder | Content |
|---|---|
| `src/domain` | Pure calculation: metrics, status, trend, missions, check-in, capsule rules, access rules, rest heart rate measurement, analysis and its checks |
| `src/data` | IndexedDB: migrations and repositories (missions, datasets, accounts, capsule, backup) |
| `src/app` | Store, i18n, commands, services, adapters (Ollama, Bluetooth heart strap and its demo simulator, password hashing, session, image files) |
| `src/features` | Screens: shell, access, welcome, dashboard (avatar), today, heart sensor, analysis, capsule, missions, settings, help, datasets |
| `src/ui` | Small DOM and SVG helpers |
| `tests` | Vitest + happy-dom + fake-indexeddb, mirrors `src` |

## Future work

- **Desktop and mobile apps from the same code.** The app is static files, and the parts that
  depend on the platform (Bluetooth, files, the local model, the session) are isolated in
  adapters. The same build can be wrapped as a desktop app (Electron or Tauri) or installed on a
  tablet or phone (an installable web app, or Capacitor), replacing only those adapters.
- **Test with the real strap** and add straps that send real beat-to-beat intervals, to measure
  heart rate variability.
- **Review the limits with flight surgeons**, replacing the provisional values marked.

## Sources

- NASA, Risk of Spaceflight-Induced Bone Changes: https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/
- NASA, Risk of Reduced Cardiorespiratory and Musculoskeletal Fitness: https://www.nasa.gov/reference/risk-of-reduced-cardiorespiratory-and-musculoskeletal-fitness
- NASA, Risk of Cardiovascular Adaptations: https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/
- NASA, Risk of Spaceflight Associated Neuro-ocular Syndrome (SANS): https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/
- NASA, Risk from Inadequate Sleep and Irregular Schedules: https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/
- NASA, Risk of Radiation-Induced Cancers: https://www.nasa.gov/reference/risk-of-radiation-induced-cancers/
- NASA Human Research Roadmap, risk pages and DRM ratings: https://humanresearchroadmap.nasa.gov/evidence/
  (bone i=77, cardiovascular i=179, SANS i=105, sleep i=100, radiation i=96)
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Ollama FAQ (allowed origins) and structured outputs: https://docs.ollama.com/faq and
  https://docs.ollama.com/capabilities/structured-outputs
- Chrome for Developers, communicating with Bluetooth devices over JavaScript: https://developer.chrome.com/docs/capabilities/bluetooth
- MDN, Web Bluetooth API and browser compatibility: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API

## Artwork

The avatar, all body layers and the five demo capsule illustrations are original SVG made for this
project, drawn with AI assistance and reviewed by the team. No photos of real people, third-party images or 3D models are used.

Icons: Lucide (https://lucide.dev), ISC License.
Fonts: Barlow Condensed and IBM Plex Sans/Mono, SIL Open Font License 1.1 (licence files in
src/styles/fonts).

## Use of AI

The team used Claude (Anthropic) as a coding assistant to plan the build, draft code, tests and
texts, draw the SVG avatar and the capsule illustrations, and summarise the NASA reports. Every file was assembled, run and reviewed by the team.
Inside the app, the optional onboard superintelligence runs a local model through Ollama.

## License

Apache-2.0.

---

### Resumo em português

O Corpo em Órbita foi pensado como um **painel embarcado e portátil**: roda em qualquer computador
com navegador, sem instalação, sem servidor e sem internet. Os dados ficam no próprio navegador
(IndexedDB), e o backup e o pacote "Enviar dados à Terra" são arquivos que podem ser enviados por
qualquer meio. A análise do dia usa regras do app e, se ligada, uma **superinteligência
embarcada** (modelo local pelo Ollama), também sem internet, com cada número conferido.

Para manter o questionário diário vivo durante a missão, cada tripulante tem uma **cápsula da
missão**: fotos e mensagens enviadas com a missão (da família, dos amigos ou da equipe em terra)
que ficam trancadas e abrem uma a uma, por padrão a cada 3 dias respondidos. A tela mostra a
sequência de dias seguidos e quanto falta para o próximo item. A recompensa vem por responder,
nunca pelo valor da resposta: uma noite ruim abre a cápsula igual a uma noite boa.

A tecnologia é simples de propósito: HTML, CSS e JavaScript puro, com Vite para o build. O avatar é
um SVG desenhado com ajuda de IA, sem software pesado de modelagem 3D, porque o foco foi a IA
embarcada e a gamificação. O código segue os princípios SOLID, com peças pequenas e trocáveis, e
tem 224 testes (96,6% das linhas cobertas). Por isso o mesmo código pode virar, no futuro, um app
de desktop ou de celular, trocando só as partes que falam com o aparelho.

A **demonstração** existe para facilitar a vida dos avaliadores: entra com um clique, e tanto os
dados quanto as análises são simulados. O **modo real** é totalmente funcional; a única
exigência extra é ter o Ollama e um modelo instalados no mesmo computador para usar a
superinteligência. A frequência cardíaca de repouso pode vir de uma **cinta de peito Bluetooth comum** (a equipe
usa a Geoid HS500), lida direto pelo navegador pelo serviço padrão Heart Rate: sem driver, sem app
do fabricante e sem nuvem. A medição é só em repouso (2 minutos parado, mediana do último minuto).
Ela usa Web Bluetooth, que só funciona no Google Chrome (e navegadores da mesma base, como o Edge),
não no Firefox nem no Safari; na demonstração a cinta é simulada. Os dados são simulados; o app não é
dispositivo médico e não faz diagnóstico.