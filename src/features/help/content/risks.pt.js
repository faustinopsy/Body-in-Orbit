import { link } from './sources.js';

export default [
  {
    id: 'bone', riskId: 'bone', title: 'Ossos',
    paragraphs: [
      'Na microgravidade, os ossos que sustentam o peso do corpo, como a coluna e o quadril, não precisam ser tão fortes. Em média eles perdem de 1% a 1,5% da densidade por mês em missões de 4 a 6 meses, o que aumenta a chance de fraturas e de osteoporose precoce. Ainda não se sabe se a perda continua no mesmo ritmo em missões muito longas.',
      'Contramedidas: exercício resistido, exames de densidade óssea antes e depois do voo, e remédios como os bisfosfonatos já foram estudados. A coluna também se estica no espaço e o tripulante pode ficar até 3% mais alto.',
      'No app: camada do esqueleto, com a densidade da coluna, do quadril e da tíbia em porcentagem do valor inicial.',
    ],
    sources: [link('NASA: risco de alterações ósseas no voo espacial', 'bone'), link('Human Research Roadmap: risco de fratura óssea', 'boneHrr')],
  },
  {
    id: 'fitness', riskId: 'fitness', title: 'Músculos e condicionamento',
    paragraphs: [
      'Viver em microgravidade enfraquece músculos e condicionamento aeróbico. Na estação espacial, a perda média de força e de condicionamento aeróbico é de 10% a 12%, e entre 12% e 38% dos tripulantes perdem mais de 20%, conforme a forma de medir. A perda de força atinge mais pessoas que a perda aeróbica.',
      'Contramedidas: cerca de 1,5 hora de exercício resistido e aeróbico por dia, seis a sete dias por semana. As naves para a Lua e Marte terão menos espaço para aparelhos de exercício.',
      'No app: camada dos músculos, com a força do tronco, da coxa e da panturrilha em porcentagem do valor inicial.',
    ],
    sources: [link('NASA: risco de redução do condicionamento cardiorrespiratório e musculoesquelético', 'fitness')],
  },
  {
    id: 'cardiovascular', riskId: 'cardiovascular', title: 'Coração e vasos',
    paragraphs: [
      'A microgravidade leva os fluidos do corpo em direção à cabeça e altera o volume, o fluxo e a pressão do sangue. Com o tempo isso pode causar descondicionamento, pressão baixa e desmaio ao ficar de pé depois do pouso, menor capacidade de exercício e, possivelmente, coágulos e alterações do ritmo do coração. O coração pode até ficar mais arredondado. Um caso de coágulo na veia jugular já foi documentado em voo.',
      'Na órbita baixa, a maior parte dos efeitos se recupera semanas ou meses depois do pouso, mas se sabe menos sobre missões de mais de um ano ou além da órbita baixa. Contramedidas: exercício, dieta, roupas de compressão e ingestão de líquidos antes do pouso.',
      'No app: camada cardiovascular, com a frequência cardíaca de repouso e a recuperação da frequência cardíaca.',
    ],
    sources: [link('NASA: risco de adaptações cardiovasculares', 'cardiovascular'), link('Human Research Roadmap: risco cardiovascular', 'cardiovascularHrr')],
  },
  {
    id: 'sans', riskId: 'sans', title: 'Olhos e cérebro (SANS)',
    paragraphs: [
      'A síndrome neuro-ocular associada ao voo espacial (SANS) só existe em quem vai ao espaço. Os fluidos se deslocam para a cabeça e podem causar inchaço do nervo óptico (edema do disco óptico), dobras na retina, achatamento da parte de trás do olho e mudanças na visão. Cerca de 70% dos tripulantes mostram pelo menos um desses sinais.',
      'Os efeitos a longo prazo ainda são desconhecidos e o risco aumenta com a duração da missão. A NASA testa contramedidas como suplementos de vitaminas do complexo B, braçadeiras nas coxas e aparelhos que puxam o fluido para as pernas, e estuda pessoas deitadas na cama com a cabeça inclinada 6 graus para baixo.',
      'No app: camada dos olhos e do cérebro, com a média esperada de sinais de SANS de 0 a 4. As setas no corpo mostram o fluido subindo para a cabeça.',
    ],
    sources: [link('NASA: risco de SANS', 'sans'), link('Human Research Roadmap: risco de SANS', 'sansHrr')],
  },
  {
    id: 'sleep', riskId: 'sleep', title: 'Sono e carga de trabalho',
    paragraphs: [
      'Em voo, as tripulações dormem cerca de 6 horas por noite e enfrentam muito trabalho, horários irregulares e 16 nasceres e pores do sol por dia na estação espacial. Estudos na Terra mostram que isso reduz o desempenho e o humor no curto prazo e está ligado a problemas a longo prazo, como doença cardíaca e diabetes.',
      'Contramedidas: iluminação LED que imita o dia e a noite da Terra, estudos sobre luz e cafeína, e horários fixos para descanso e autocuidado.',
      'No app: camada do sono, com as horas de sono e a qualidade do sono de 1 a 5. O cérebro, a medula e os nervos aparecem porque a falta de sono afeta todo o sistema nervoso.',
    ],
    sources: [link('NASA: riscos do sono inadequado e de horários irregulares', 'sleep'), link('Human Research Roadmap: risco do sono', 'sleepHrr')],
  },
  {
    id: 'radiation', riskId: 'radiation', title: 'Radiação',
    paragraphs: [
      'No espaço, a tripulação recebe mais radiação que na Terra: principalmente prótons, um pouco de hélio e uma pequena parte de íons pesados, que causam danos difíceis de as células repararem. Isso pode aumentar a chance, ao longo da vida, de alguns tipos de câncer e de doenças do coração, dos vasos e dos olhos. As missões à Lua e a Marte saem da proteção da magnetosfera da Terra.',
      'A NASA estima o risco ao longo da vida com um modelo baseado em pessoas expostas à radiação na Terra, e a incerteza é grande. Contramedidas: dosímetros a bordo, blindagem na nave e pesquisas sobre remédios e estimativas de risco personalizadas.',
      'No app: camada da radiação, com a dose acumulada em milisievert. A aura em volta do corpo fica verde, amarela ou vermelha conforme a dose passa os limites.',
    ],
    sources: [link('NASA: risco de cânceres induzidos por radiação', 'radiation'), link('Human Research Roadmap: carcinogênese por radiação', 'radiationHrr')],
  },
];