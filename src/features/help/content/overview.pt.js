import { link } from './sources.js';

export default [
  {
    id: 'about',
    title: 'O que este app monitora',
    paragraphs: [
      'O Corpo em Órbita é um painel educativo feito para o NASA Space Apps Challenge 2026 (desafio "Create Health Monitoring Software for Astronauts on Space Missions"). Ele acompanha seis sistemas do corpo que a NASA aponta entre os principais riscos à saúde em missões longas: ossos, músculos e condicionamento, coração e vasos, olhos e cérebro (SANS), sono e carga de trabalho, e radiação.',
      'Todos os números do app são simulados ou projetados a partir de informações públicas da NASA. O app não é um dispositivo médico, não faz diagnóstico e não deve ser usado para decisões de saúde sobre pessoas reais.',
    ],
  },
  {
    id: 'missions',
    title: 'Tipos de missão',
    paragraphs: [
      'A NASA classifica cada risco à saúde para um conjunto de categorias de missão de referência (Design Reference Mission, DRM) no Human Research Roadmap. O app usa as mesmas oito categorias, então o risco de cada missão vem direto dessas classificações.',
      'Missões além da órbita baixa saem da proteção da magnetosfera da Terra, e a tripulação recebe mais radiação espacial. As missões a Marte também duram muito mais e ficam longe da Terra, o que limita o atendimento médico a bordo.',
    ],
    items: [
      'Órbita baixa da Terra, curta: menos de 30 dias. Longa: de 30 dias a 1 ano (como a Estação Espacial Internacional).',
      'Órbita lunar, curta ou longa, e órbita mais superfície lunar, curta ou longa, com os mesmos limites de duração.',
      'Preparatória para Marte: missões no espaço profundo com menos de 1 ano.',
      'Marte planetária: de 730 a 1.224 dias.',
    ],
  },
  {
    id: 'weights',
    title: 'Como os pesos de risco são calculados',
    paragraphs: [
      'Para cada risco e tipo de missão, o Human System Risk Board da NASA dá duas classificações: uma para as operações durante a missão e outra para a saúde a longo prazo. Cada classificação é uma probabilidade (L) vezes uma consequência (C), escrita LxC, numa matriz 5x5 (as classificações mais antigas usam uma matriz 3x4).',
      'O app transforma cada classificação numa nota: L x C dividido pelo maior valor possível da matriz (25 ou 12). O peso do risco é a maior das duas notas, mostrado em porcentagem. Abaixo de 30% é baixo, de 30% a 59% é moderado e a partir de 60% é alto.',
      'O peso muda a linha do tempo. A missão longa em órbita baixa é a referência, porque a maior parte dos dados medidos vem da estação espacial. O peso da missão escolhida é dividido pelo peso de referência, limitado entre 0,4 e 2 vezes, e multiplica a mudança mensal esperada daquele sistema do corpo.',
    ],
    items: [
      'Músculos e condicionamento: as nossas fontes não trazem tabela LxC para este risco, então ele usa o peso dos ossos. Os dois vêm da falta de carga na microgravidade.',
      'Ossos: a classificação foi aprovada em 2017 com categorias de missão antigas (6 meses e 1 ano em órbita baixa, saída de 1 mês ao espaço profundo, visita de 1 ano à Lua ou ao espaço profundo, missão planetária de 3 anos). O app as associa às categorias atuais.',
      'Radiação: a classificação ainda usa a matriz antiga 3x4 e estava prevista para revisão do conselho em 2025.',
    ],
    sources: [link('NASA Human Research Roadmap: evidências', 'evidence')],
  },
  {
    id: 'crew',
    title: 'Idade, peso e altura',
    paragraphs: [
      'O relatório cardiovascular da NASA cita idade, sono, exercício, dieta e estresse como fatores conhecidos de doença cardiovascular. Por isso, a mudança esperada nas métricas do coração cresce 1% a cada ano acima de 40 e diminui 1% a cada ano abaixo, limitada entre 0,85 e 1,25 vez.',
      'Peso e altura dão o índice de massa corporal (IMC). Fora da faixa de 18,5 a 25, a mudança do coração cresce 1% por unidade de IMC, até 15%. Esse fator de IMC é uma ilustração escolhida pela equipe e não vem dos relatórios da NASA.',
      'Radiação: o modelo de câncer da NASA estima o risco ao longo da vida a partir da dose e também considera a idade na exposição e o sexo. A dose em si não depende da idade, e o app mostra a dose, não o risco de câncer ao longo da vida. SANS: genética, anatomia, metabolismo e sexo estão sendo estudados como fatores, então nenhum fator pessoal é aplicado.',
    ],
  },
];