const OLLAMA_SOURCES = [
  { label: 'Ollama FAQ: orígenes permitidos en el navegador (OLLAMA_ORIGINS)', url: 'https://docs.ollama.com/faq' },
  { label: 'Ollama: respuestas estructuradas', url: 'https://docs.ollama.com/capabilities/structured-outputs' },
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
];