import { link } from './sources.js';

export default [
  {
    id: 'bone', riskId: 'bone', title: 'Bone',
    paragraphs: [
      'In weightlessness the bones that carry the body\'s weight, like the spine and the hips, do not need to be as strong. On average they lose 1% to 1.5% of their density each month in 4 to 6 month missions, which raises the chance of fractures and of early osteoporosis. It is not known yet if the loss continues at the same rate on very long missions.',
      'Countermeasures: resistance exercise, bone scans before and after flight, and medicines such as bisphosphonates have been studied. The spine also stretches in space and crew members can get up to 3% taller.',
      'In the app: skeleton layer, with spine, hip and tibia density in percent of the starting value.',
    ],
    sources: [link('NASA: Risk of spaceflight-induced bone changes', 'bone'), link('Human Research Roadmap: bone fracture risk', 'boneHrr')],
  },
  {
    id: 'fitness', riskId: 'fitness', title: 'Muscles and fitness',
    paragraphs: [
      'Living in weightlessness weakens muscles and aerobic fitness. On the space station, the average loss of strength and aerobic fitness is 10% to 12%, and between 12% and 38% of crew lose more than 20%, depending on how it is measured. Strength loss affects more people than aerobic loss.',
      'Countermeasures: about 1.5 hours of resistance and aerobic exercise per day, six to seven days a week. Moon and Mars spacecraft will have less room for exercise machines.',
      'In the app: muscles layer, with core, thigh and calf strength in percent of the starting value.',
    ],
    sources: [link('NASA: Risk of reduced cardiorespiratory and musculoskeletal fitness', 'fitness')],
  },
  {
    id: 'cardiovascular', riskId: 'cardiovascular', title: 'Heart and vessels',
    paragraphs: [
      'Weightlessness moves body fluids toward the head and changes blood volume, flow and pressure. Over time this can lead to deconditioning, low blood pressure and fainting when standing after landing, less exercise capacity, and possibly clots and heart rhythm problems. The heart can even become more round. One case of a clot in the jugular vein has been documented in flight.',
      'Most effects recover weeks or months after landing in low-orbit missions, but less is known for missions longer than a year or beyond low orbit. Countermeasures: exercise, diet, compression garments and drinking fluids before landing.',
      'In the app: cardiovascular layer, with resting heart rate and heart rate recovery.',
    ],
    sources: [link('NASA: Risk of cardiovascular adaptations', 'cardiovascular'), link('Human Research Roadmap: cardiovascular risk', 'cardiovascularHrr')],
  },
  {
    id: 'sans', riskId: 'sans', title: 'Eyes and brain (SANS)',
    paragraphs: [
      'Spaceflight associated neuro-ocular syndrome (SANS) exists only in people who fly in space. Fluids shift toward the head and can cause swelling of the optic nerve (optic disc edema), folds in the retina, flattening of the back of the eye and changes in vision. About 70% of crew show at least one of these signs.',
      'The long-term effects are still unknown and the risk grows with mission length. NASA is testing countermeasures such as B vitamin supplements, thigh cuffs and devices that pull fluid toward the legs, and studies people lying in bed with the head tilted 6 degrees down.',
      'In the app: eyes and brain layer, with the expected average number of SANS signs from 0 to 4. The arrows on the body show the fluid moving toward the head.',
    ],
    sources: [link('NASA: Risk of SANS', 'sans'), link('Human Research Roadmap: SANS risk', 'sansHrr')],
  },
  {
    id: 'sleep', riskId: 'sleep', title: 'Sleep and workload',
    paragraphs: [
      'In flight, crews sleep about 6 hours a night and deal with heavy work, irregular schedules and 16 sunrises and sunsets a day on the space station. Studies on Earth show that this lowers performance and mood in the short term and is linked to long-term problems such as heart disease and diabetes.',
      'Countermeasures: LED lighting that copies Earth\'s day and night, studies on light and caffeine, and set times for rest and self-care.',
      'In the app: sleep layer, with sleep hours and sleep quality from 1 to 5. The brain, spinal cord and nerves are shown because sleep loss affects the whole nervous system.',
    ],
    sources: [link('NASA: Risk from inadequate sleep and irregular schedules', 'sleep'), link('Human Research Roadmap: sleep risk', 'sleepHrr')],
  },
  {
    id: 'radiation', riskId: 'radiation', title: 'Radiation',
    paragraphs: [
      'In space the crew receives more radiation than on Earth: mostly protons, some helium and a small share of heavy ions that cause damage cells find hard to repair. This can raise the lifetime chance of some cancers and of diseases of the heart, vessels and eyes. Missions to the Moon and Mars leave the protection of Earth\'s magnetosphere.',
      'NASA estimates the lifetime risk with a model based on people exposed to radiation on Earth, and the uncertainty is large. Countermeasures: dosimeters on board, shielding in the spacecraft, and research on medicines and personal risk estimates.',
      'In the app: radiation layer, with the accumulated dose in millisieverts. The aura around the body turns green, yellow or red as the dose crosses the limits.',
    ],
    sources: [link('NASA: Risk of radiation-induced cancers', 'radiation'), link('Human Research Roadmap: radiation carcinogenesis', 'radiationHrr')],
  },
];