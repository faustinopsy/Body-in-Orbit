const OLLAMA_SOURCES = [
  { label: 'Ollama FAQ: origens permitidas no navegador (OLLAMA_ORIGINS)', url: 'https://docs.ollama.com/faq' },
  { label: 'Ollama: respostas estruturadas', url: 'https://docs.ollama.com/capabilities/structured-outputs' },
];

const BLUETOOTH_SOURCES = [
  { label: 'Chrome for Developers: comunicar com aparelhos Bluetooth pelo JavaScript', url: 'https://developer.chrome.com/docs/capabilities/bluetooth' },
  { label: 'MDN: Web Bluetooth API e compatibilidade dos navegadores', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API' },
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
  {
    id: 'heartSensor',
    title: 'Sensor Bluetooth',
    paragraphs: [
      'A pergunta "Frequência cardíaca de repouso" pode ser respondida com uma cinta de peito Bluetooth. O app usa o serviço padrão de frequência cardíaca (Heart Rate), que a maioria das cintas de peito oferece. Relógios costumam não oferecer esse serviço para outros aparelhos.',
      'A medição é só em repouso: são 2 minutos parado e vale a mediana do último minuto, quando o coração já acalmou. Leituras sem contato com a pele são descartadas. Se a frequência variar mais de 15 bpm no último minuto, ou se houver menos de 30 leituras boas, o app pede para medir de novo. Esses números são critérios do próprio app e não foram validados cientificamente.',
      'O valor medido só entra na resposta quando o tripulante aperta "Usar … bpm na resposta", e só fica guardado quando ele salva as respostas do dia. Nenhuma leitura é guardada sozinha e nada sai do computador.',
      'Limitação: o Web Bluetooth só funciona no Google Chrome e no Microsoft Edge (e outros navegadores baseados no Chromium) no computador, com o app aberto em localhost ou HTTPS. No Firefox e no Safari o botão avisa e a resposta continua sendo digitada com − e +. No Linux, o Chrome pede ligar uma opção experimental. Na missão de demonstração o sensor é simulado e os 2 minutos passam em 12 segundos.',
    ],
    items: [
      'Molhe os eletrodos da cinta, vista-a no peito e ligue o Bluetooth do computador.',
      'Em Hoje, na pergunta da frequência cardíaca, aperte "Medir com o sensor" e escolha a cinta na janela do navegador.',
      'Deite-se ou sente-se, fique parado e aperte "Começar a medição". No fim, confira o resultado e aperte "Usar … bpm na resposta".',
      'Se aparecer "sem contato com a pele", ajuste a cinta. Se a conexão cair, conecte de novo. O app sai sozinho depois de 3 minutos sem uso, então comece a medição logo depois de conectar.',
    ],
    sources: BLUETOOTH_SOURCES,
  },
];