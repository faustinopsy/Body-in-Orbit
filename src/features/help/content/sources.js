export const SOURCES = {
  evidence: 'https://humanresearchroadmap.nasa.gov/evidence/',
  bone: 'https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/',
  boneHrr: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=77',
  fitness: 'https://www.nasa.gov/reference/risk-of-reduced-cardiorespiratory-and-musculoskeletal-fitness',
  cardiovascular: 'https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/',
  cardiovascularHrr: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=179',
  sans: 'https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/',
  sansHrr: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=105',
  sleep: 'https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/',
  sleepHrr: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=100',
  radiation: 'https://www.nasa.gov/reference/risk-of-radiation-induced-cancers/',
  radiationHrr: 'https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=96',
};

export const link = (label, key) => ({ label, url: SOURCES[key] });