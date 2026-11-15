import { link } from './sources.js';

export default [
  {
    id: 'about',
    title: 'Qué monitorea esta app',
    paragraphs: [
      'Cuerpo en Órbita es un panel educativo hecho para el NASA Space Apps Challenge 2026 (desafío "Create Health Monitoring Software for Astronauts on Space Missions"). Sigue seis sistemas del cuerpo que la NASA señala entre los principales riesgos para la salud en misiones largas: huesos, músculos y condición física, corazón y vasos, ojos y cerebro (SANS), sueño y carga de trabajo, y radiación.',
      'Todos los números de la app son simulados o proyectados a partir de información pública de la NASA. La app no es un dispositivo médico, no hace diagnósticos y no debe usarse para tomar decisiones de salud sobre personas reales.',
    ],
  },
  {
    id: 'missions',
    title: 'Tipos de misión',
    paragraphs: [
      'La NASA clasifica cada riesgo para la salud según un conjunto de categorías de misión de referencia (Design Reference Mission, DRM) en el Human Research Roadmap. La app usa las mismas ocho categorías, así que el riesgo de cada misión sale directamente de esas clasificaciones.',
      'Las misiones más allá de la órbita baja salen de la protección de la magnetosfera de la Tierra, y la tripulación recibe más radiación espacial. Las misiones a Marte también duran mucho más y quedan lejos de la Tierra, lo que limita la atención médica a bordo.',
    ],
    items: [
      'Órbita baja terrestre, corta: menos de 30 días. Larga: de 30 días a 1 año (como la Estación Espacial Internacional).',
      'Órbita lunar, corta o larga, y órbita más superficie lunar, corta o larga, con los mismos límites de duración.',
      'Preparatoria para Marte: misiones en el espacio profundo de menos de 1 año.',
      'Marte planetaria: de 730 a 1.224 días.',
    ],
  },
  {
    id: 'weights',
    title: 'Cómo se calculan los pesos de riesgo',
    paragraphs: [
      'Para cada riesgo y tipo de misión, el Human System Risk Board de la NASA da dos clasificaciones: una para las operaciones durante la misión y otra para la salud a largo plazo. Cada clasificación es una probabilidad (L) por una consecuencia (C), escrita LxC, en una matriz 5x5 (las clasificaciones más antiguas usan una matriz 3x4).',
      'La app convierte cada clasificación en una nota: L x C dividido por el mayor valor posible de la matriz (25 o 12). El peso del riesgo es la mayor de las dos notas, mostrado en porcentaje. Por debajo del 30% es bajo, del 30% al 59% es moderado y desde el 60% es alto.',
      'El peso cambia la línea de tiempo. La misión larga en órbita baja es la referencia, porque la mayor parte de los datos medidos viene de la estación espacial. El peso de la misión elegida se divide por el peso de referencia, limitado entre 0,4 y 2 veces, y multiplica el cambio mensual esperado de ese sistema del cuerpo.',
    ],
    items: [
      'Músculos y condición física: nuestras fuentes no traen una tabla LxC para este riesgo, así que usa el peso de los huesos. Los dos vienen de la falta de carga en microgravedad.',
      'Huesos: la clasificación se aprobó en 2017 con categorías de misión antiguas (6 meses y 1 año en órbita baja, salida de 1 mes al espacio profundo, visita de 1 año a la Luna o al espacio profundo, misión planetaria de 3 años). La app las asocia a las categorías actuales.',
      'Radiación: la clasificación todavía usa la matriz antigua 3x4 y estaba prevista para revisión del comité en 2025.',
    ],
    sources: [link('NASA Human Research Roadmap: evidencias', 'evidence')],
  },
  {
    id: 'crew',
    title: 'Edad, peso y altura',
    paragraphs: [
      'El informe cardiovascular de la NASA cita la edad, el sueño, el ejercicio, la dieta y el estrés como factores conocidos de enfermedad cardiovascular. Por eso, el cambio esperado en las métricas del corazón crece un 1% por cada año por encima de 40 y baja un 1% por cada año por debajo, limitado entre 0,85 y 1,25 veces.',
      'El peso y la altura dan el índice de masa corporal (IMC). Fuera del rango de 18,5 a 25, el cambio del corazón crece un 1% por unidad de IMC, hasta un 15%. Ese factor de IMC es una ilustración elegida por el equipo y no viene de los informes de la NASA.',
      'Radiación: el modelo de cáncer de la NASA estima el riesgo a lo largo de la vida a partir de la dosis y también considera la edad en la exposición y el sexo. La dosis en sí no depende de la edad, y la app muestra la dosis, no el riesgo de cáncer a lo largo de la vida. SANS: la genética, la anatomía, el metabolismo y el sexo se están estudiando como factores, así que no se aplica ningún factor personal.',
    ],
  },
];