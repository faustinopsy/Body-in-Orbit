const OLLAMA_SOURCES = [
  { label: 'Ollama FAQ: orígenes permitidos en el navegador (OLLAMA_ORIGINS)', url: 'https://docs.ollama.com/faq' },
  { label: 'Ollama: respuestas estructuradas', url: 'https://docs.ollama.com/capabilities/structured-outputs' },
];

const BLUETOOTH_SOURCES = [
  { label: 'Chrome for Developers: comunicarse con dispositivos Bluetooth desde JavaScript', url: 'https://developer.chrome.com/docs/capabilities/bluetooth' },
  { label: 'MDN: Web Bluetooth API y compatibilidad de los navegadores', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API' },
];

export default [
  {
    id: 'superAi',
    title: 'Superinteligencia a bordo',
    paragraphs: [
      'La superinteligencia a bordo convierte el análisis del día en un resumen corto para el tripulante, con hasta tres hábitos prácticos. Funciona con un modelo de lenguaje instalado en esta computadora mediante Ollama, así que ningún dato de salud sale de la computadora.',
      'Nunca trabaja sola. La app primero arma el análisis con sus propias reglas y solo después envía esos hechos al modelo. La respuesta debe volver en un formato JSON fijo, y cada número se compara con las mediciones. Una respuesta con un número distinto, o fuera del formato, se descarta y la pantalla mantiene el análisis por reglas.',
      'La pantalla siempre dice de dónde vino el texto: reglas de la app, análisis de demostración preparado o el modelo local, con su nombre. En la misión de demostración no se llama a ningún modelo; los resúmenes los arma la app a partir de los mismos hechos.',
      'Esto no es una evaluación médica. En una misión real, decide el médico de vuelo.',
    ],
    items: [
      'Instala Ollama en esta computadora y descarga un modelo, por ejemplo: ollama pull llama3.2.',
      'En Configuración, pestaña "Superinteligencia a bordo", activa la opción, escribe el nombre del modelo y usa "Probar conexión".',
      'Ollama acepta llamadas del navegador desde localhost y 127.0.0.1. Si la app se abre desde otra dirección, agrega esa dirección en OLLAMA_ORIGINS antes de abrir Ollama.',
    ],
    sources: OLLAMA_SOURCES,
  },
  {
    id: 'heartSensor',
    title: 'Sensor Bluetooth',
    paragraphs: [
      'La pregunta "Frecuencia cardíaca en reposo" se puede responder con una banda de pecho Bluetooth. La app usa el servicio estándar de frecuencia cardíaca (Heart Rate), que ofrece la mayoría de las bandas de pecho. Los relojes no suelen ofrecer ese servicio a otros dispositivos.',
      'La medición es solo en reposo: 2 minutos quieto, y cuenta la mediana del último minuto, cuando el corazón ya se calmó. Las lecturas sin contacto con la piel se descartan. Si la frecuencia varía más de 15 lpm en el último minuto, o hay menos de 30 lecturas buenas, la app pide medir de nuevo. Estos números son criterios propios de la app y no fueron validados científicamente.',
      'El valor medido solo entra en la respuesta cuando el tripulante pulsa "Usar … lpm en la respuesta", y solo se guarda cuando guarda las respuestas del día. Ninguna lectura se guarda sola y nada sale de la computadora.',
      'Limitación: Web Bluetooth solo funciona en Google Chrome y Microsoft Edge (y otros navegadores basados en Chromium) en la computadora, con la app abierta en localhost o HTTPS. En Firefox y Safari el botón lo avisa y la respuesta se sigue escribiendo con − y +. En Linux, Chrome pide activar una opción experimental. En la misión de demostración el sensor es simulado y los 2 minutos pasan en 12 segundos.',
    ],
    items: [
      'Moje los electrodos de la banda, colóquela en el pecho y encienda el Bluetooth de la computadora.',
      'En Hoy, en la pregunta de frecuencia cardíaca, pulse "Medir con el sensor" y elija la banda en la ventana del navegador.',
      'Acuéstese o siéntese, quédese quieto y pulse "Empezar la medición". Al final, revise el resultado y pulse "Usar … lpm en la respuesta".',
      'Si aparece "sin contacto con la piel", ajuste la banda. Si se cae la conexión, conecte de nuevo. La app cierra la sesión tras 3 minutos sin uso, así que empiece la medición justo después de conectar.',
    ],
    sources: BLUETOOTH_SOURCES,
  },
];