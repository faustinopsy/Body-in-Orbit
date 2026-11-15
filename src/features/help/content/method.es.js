export default [
  {
    id: 'timeline',
    title: 'Cómo se proyecta la línea de tiempo',
    paragraphs: [
      'Al crear una misión, la app genera una serie diaria para cada tripulante y cada métrica. Parte de un valor normal, aplica el cambio mensual esperado de abajo, lo multiplica por el factor de peso de la misión y por el factor personal y suma una pequeña variación diaria. El panel usa luego el promedio de los últimos 7 días.',
      'Los límites de atención y crítico de cada métrica son valores provisionales elegidos para la demostración. No son estándares médicos de la NASA.',
    ],
    items: [
      'Densidad ósea de la columna y de la cadera: -1,25% por mes. La NASA informa una pérdida media del 1% al 1,5% por mes en misiones de 4 a 6 meses.',
      'Densidad ósea de la tibia: -0,75% por mes. Suposición del equipo, menor que la columna y la cadera.',
      'Fuerza muscular (tronco, muslo, pantorrilla): -1,5%, -2% y -2,5% por mes. En las misiones de la estación espacial, la fuerza y la condición aeróbica bajan en promedio entre un 10% y un 12%.',
      'Frecuencia cardíaca en reposo +1 lpm y recuperación de la frecuencia cardíaca -0,8 lpm por mes. Suposición del equipo para mostrar el desacondicionamiento.',
      'Sueño: baja cerca de 1,5 horas en las dos primeras semanas. La NASA informa que las tripulaciones duermen unas 6 horas por noche en vuelo.',
      'Signos de SANS: +0,2 por mes. Cerca del 70% de los tripulantes en misiones de 4 a 6 meses muestran signos iniciales de hinchazón del disco óptico, así que el promedio llega a cerca de un signo hacia el 5.º mes.',
      'Dosis de radiación por día: órbita baja 0,5, órbita y superficie lunar 1,4, espacio profundo 1,8 y la misión entera a Marte 1,5 milisievert. Son órdenes de magnitud que no están en los informes usados aquí y que el equipo todavía tiene que verificar.',
    ],
  },
  {
    id: 'demoAnalysis',
    title: 'El análisis de demostración (por reglas, sin IA real)',
    paragraphs: [
      'El análisis de demostración lee exactamente lo que el panel muestra para el tripulante y el día elegidos: el estado de cada métrica, la tendencia de 60 días, el día en que se espera cruzar el próximo límite y los pesos de la misión.',
      'Ordena los hallazgos: primero los críticos, después los de atención, después los riesgos con mayor peso en la misión y por último el cruce previsto más cercano. Las frases vienen de archivos de texto fijos en los idiomas de la app, y el código inserta los números, así que siempre coinciden con el panel.',
      'Nunca da un diagnóstico. Cuando menciona lo que puede ayudar, solo repite los tipos de contramedida que la NASA describe públicamente, como el ejercicio, los horarios de iluminación o la ropa de compresión. La pantalla siempre indica que el texto viene del análisis de demostración.',
    ],
  },
  {
    id: 'localAi',
    title: 'IA local (opcional)',
    paragraphs: [
      'Puedes conectar un modelo de lenguaje que corre en tu propia computadora con Ollama. Viene apagado. Cuando está encendido, la app habla solo con http://127.0.0.1:11434 en esta computadora; no se envía nada a internet.',
      'La app envía solo los códigos de los tripulantes, el tipo de misión, el día y los valores, estados, tendencias y pesos de cada métrica. Nunca envía nombres, edad, peso ni altura.',
      'El modelo tiene que responder en un formato JSON fijo. Antes de mostrar la respuesta, la app verifica que cada número citado exista en el panel. Si la verificación falla, la app muestra el análisis de demostración en su lugar. La pantalla siempre indica de dónde vino el análisis.',
    ],
    items: [
      'Reglas del prompt de sistema: eres un asistente de monitoreo de salud de la misión para una demostración educativa.',
      'Usa solo los números de los datos recibidos. Nunca inventes valores.',
      'No hagas diagnósticos ni recomiendes tratamientos o medicamentos.',
      'Explica qué sistema del cuerpo está cambiando, a qué velocidad y cómo el tipo de misión aumenta o reduce ese riesgo.',
      'Responde en el idioma pedido y en el formato JSON pedido.',
    ],
  },
];