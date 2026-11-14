import { link } from './sources.js';

export default [
  {
    id: 'about',
    title: 'What this app monitors',
    paragraphs: [
      'Body in Orbit is an educational dashboard built for the NASA Space Apps Challenge 2026 ("Create Health Monitoring Software for Astronauts on Space Missions"). It follows six body systems that NASA lists among the main health risks of long missions: bone, muscles and fitness, heart and vessels, eyes and brain (SANS), sleep and workload, and radiation.',
      'All numbers in the app are simulated or projected from public NASA information. The app is not a medical device, does not make diagnoses and must not be used to make health decisions about real people.',
    ],
  },
  {
    id: 'missions',
    title: 'Mission types',
    paragraphs: [
      'NASA rates each health risk for a set of Design Reference Mission (DRM) categories in the Human Research Roadmap. The app uses the same eight categories, so the risk of each mission comes straight from those ratings.',
      'Missions beyond low Earth orbit leave the protection of Earth\'s magnetosphere, so the crew receives more space radiation. Mars missions also last much longer and are far from Earth, which limits medical care on board.',
    ],
    items: [
      'Low Earth orbit, short: less than 30 days. Long: 30 days to 1 year (like the International Space Station).',
      'Lunar orbit, short or long, and lunar orbit plus surface, short or long, with the same duration limits.',
      'Mars preparatory: deep-space missions of less than 1 year.',
      'Mars planetary: 730 to 1,224 days.',
    ],
  },
  {
    id: 'weights',
    title: 'How the risk weights are calculated',
    paragraphs: [
      'For every risk and mission type, NASA\'s Human System Risk Board gives two ratings: one for operations during the mission and one for long-term health. Each rating is a likelihood (L) times a consequence (C), written LxC, on a 5x5 matrix (older ratings use a 3x4 matrix).',
      'The app turns each rating into a score: L x C divided by the largest possible value of its matrix (25 or 12). The weight of the risk is the larger of the two scores, shown as a percentage. Below 30% is low, from 30% to 59% is moderate, and 60% or more is high.',
      'The weight changes the timeline. A long low-orbit mission is the reference, because most measured data come from the space station. The weight of the chosen mission is divided by the reference weight, limited between 0.4 and 2 times, and multiplies the expected monthly change of that body system.',
    ],
    items: [
      'Muscles and fitness: our sources have no LxC table for this risk, so it uses the bone weight. Both come from the lack of loading in weightlessness.',
      'Bone: the rating was approved in 2017 with older mission categories (6 months and 1 year in low orbit, 1-month deep-space sortie, 1-year lunar or deep-space visit, 3-year planetary). The app maps them to the current categories.',
      'Radiation: the rating still uses the older 3x4 matrix and was scheduled for review by the board in 2025.',
    ],
    sources: [link('NASA Human Research Roadmap: evidence', 'evidence')],
  },
  {
    id: 'crew',
    title: 'Age, body weight and height',
    paragraphs: [
      'The NASA cardiovascular report lists age, sleep, exercise, diet and stress as known contributors to cardiovascular disease. So the expected change of the heart metrics grows 1% for each year above 40 and shrinks 1% for each year below, limited between 0.85 and 1.25 times.',
      'Body weight and height give the body mass index (BMI). Outside the 18.5 to 25 range, the heart change grows 1% for each BMI unit, up to 15%. This BMI factor is an illustration chosen by the team. It does not come from the NASA reports.',
      'Radiation: NASA\'s cancer model estimates the lifetime risk from the dose and also considers age at exposure and sex. The dose itself does not depend on age, and the app shows the dose, not the lifetime cancer risk. SANS: genetics, anatomy, metabolism and sex are being studied as contributors, so no personal factor is applied.',
    ],
  },
];