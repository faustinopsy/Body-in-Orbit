export default [
  {
    id: 'timeline',
    title: 'Como a linha do tempo é projetada',
    paragraphs: [
      'Ao criar uma missão, o app gera uma série diária para cada tripulante e cada métrica. Ele parte de um valor normal, aplica a mudança mensal esperada abaixo, multiplica pelo fator de peso da missão e pelo fator pessoal e soma uma pequena variação diária. O painel usa então a média dos últimos 7 dias.',
      'Os limites de atenção e crítico de cada métrica são valores provisórios escolhidos para a demonstração. Não são padrões médicos da NASA.',
    ],
    items: [
      'Densidade óssea da coluna e do quadril: -1,25% por mês. A NASA relata perda média de 1% a 1,5% por mês em missões de 4 a 6 meses.',
      'Densidade óssea da tíbia: -0,75% por mês. Suposição da equipe, menor que coluna e quadril.',
      'Força muscular (tronco, coxa, panturrilha): -1,5%, -2% e -2,5% por mês. Nas missões da estação espacial, força e condicionamento aeróbico caem em média de 10% a 12%.',
      'Frequência cardíaca de repouso +1 bpm e recuperação da frequência cardíaca -0,8 bpm por mês. Suposição da equipe para mostrar o descondicionamento.',
      'Sono: cai cerca de 1,5 hora nas duas primeiras semanas. A NASA relata que as tripulações dormem cerca de 6 horas por noite em voo.',
      'Sinais de SANS: +0,2 por mês. Cerca de 70% dos tripulantes em missões de 4 a 6 meses mostram sinais iniciais de inchaço do disco óptico, então a média chega a cerca de um sinal perto do 5º mês.',
      'Dose de radiação por dia: órbita baixa 0,5, órbita e superfície lunar 1,4, espaço profundo 1,8 e a missão a Marte inteira 1,5 milisievert. São ordens de grandeza que não estão nos relatórios usados aqui e ainda precisam ser conferidas pela equipe.',
    ],
  },
  {
    id: 'demoAnalysis',
    title: 'A análise de demonstração (por regras, sem IA real)',
    paragraphs: [
      'A análise de demonstração lê exatamente o que o painel mostra para o tripulante e o dia escolhidos: o status de cada métrica, a tendência de 60 dias, o dia em que o próximo limite deve ser cruzado e os pesos da missão.',
      'Ela ordena os achados: primeiro os críticos, depois os de atenção, depois os riscos com maior peso na missão e por fim o cruzamento previsto mais próximo. As frases vêm de arquivos de texto fixos em inglês e português, e os números são inseridos pelo código, então sempre batem com o painel.',
      'Ela nunca dá diagnóstico. Quando cita o que pode ajudar, apenas repete os tipos de contramedida que a NASA descreve publicamente, como exercício, horários de iluminação ou roupas de compressão. A tela sempre informa que o texto vem da análise de demonstração.',
    ],
  },
  {
    id: 'localAi',
    title: 'IA local (opcional)',
    paragraphs: [
      'Você pode ligar um modelo de linguagem que roda no seu próprio computador com o Ollama. Ele vem desligado. Quando ligado, o app conversa só com http://127.0.0.1:11434 neste computador; nada é enviado para a internet.',
      'O app envia apenas os códigos dos tripulantes, o tipo de missão, o dia e os valores, status, tendência e pesos de cada métrica. Nunca envia nomes, idade, peso ou altura.',
      'O modelo precisa responder num formato JSON fixo. Antes de mostrar a resposta, o app confere se cada número citado existe no painel. Se a conferência falhar, o app mostra a análise de demonstração no lugar. A tela sempre informa de onde veio a análise.',
    ],
    items: [
      'Regras do prompt de sistema: você é um assistente de monitoramento de saúde da missão para uma demonstração educativa.',
      'Use só os números dos dados recebidos. Nunca invente valores.',
      'Não faça diagnóstico e não recomende tratamentos ou remédios.',
      'Explique qual sistema do corpo está mudando, com que velocidade e como o tipo de missão aumenta ou diminui esse risco.',
      'Responda no idioma pedido e no formato JSON pedido.',
    ],
  },
];