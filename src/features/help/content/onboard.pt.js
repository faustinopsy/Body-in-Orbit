const OLLAMA_SOURCES = [
  { label: 'Ollama FAQ: origens permitidas no navegador (OLLAMA_ORIGINS)', url: 'https://docs.ollama.com/faq' },
  { label: 'Ollama: respostas estruturadas', url: 'https://docs.ollama.com/capabilities/structured-outputs' },
];

export default [
  {
    id: 'superAi',
    title: 'Superinteligência embarcada',
    paragraphs: [
      'A superinteligência embarcada transforma a análise do dia num resumo curto para o tripulante, com até três hábitos práticos. Ela roda num modelo de linguagem instalado neste computador pelo Ollama, então nenhum dado de saúde sai do computador.',
      'Ela nunca trabalha sozinha. O app primeiro monta a análise com as próprias regras e só depois envia esses fatos ao modelo. A resposta precisa voltar num formato JSON fixo, e cada número dela é comparado com as medições. Uma resposta com número diferente, ou fora do formato, é descartada, e a tela mantém a análise por regras.',
      'A tela sempre diz de onde veio o texto: regras do app, análise de demonstração preparada ou o modelo local, com o nome dele. Na missão de demonstração nenhum modelo é chamado; os resumos são montados pelo app a partir dos mesmos fatos.',
      'Isto não é avaliação médica. Numa missão real, quem decide é o médico de voo.',
    ],
    items: [
      'Instale o Ollama neste computador e baixe um modelo, por exemplo: ollama pull llama3.2.',
      'Em Configurações, aba "Superinteligência embarcada", ligue a opção, escreva o nome do modelo e use "Testar ligação".',
      'O Ollama aceita chamadas do navegador vindas de localhost e 127.0.0.1. Se o app for aberto por outro endereço, acrescente esse endereço em OLLAMA_ORIGINS antes de abrir o Ollama.',
    ],
    sources: OLLAMA_SOURCES,
  },
];