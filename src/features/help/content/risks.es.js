import { link } from './sources.js';

export default [
  {
    id: 'bone', riskId: 'bone', title: 'Huesos',
    paragraphs: [
      'En microgravedad, los huesos que sostienen el peso del cuerpo, como la columna y la cadera, no necesitan ser tan fuertes. En promedio pierden entre un 1% y un 1,5% de su densidad por mes en misiones de 4 a 6 meses, lo que aumenta la probabilidad de fracturas y de osteoporosis temprana. Todavía no se sabe si la pérdida sigue al mismo ritmo en misiones muy largas.',
      'Contramedidas: se estudiaron el ejercicio de resistencia, los estudios de densidad ósea antes y después del vuelo y medicamentos como los bifosfonatos. La columna también se estira en el espacio y el tripulante puede llegar a ser hasta un 3% más alto.',
      'En la app: capa del esqueleto, con la densidad de la columna, la cadera y la tibia en porcentaje del valor inicial.',
    ],
    sources: [link('NASA: riesgo de cambios óseos por el vuelo espacial', 'bone'), link('Human Research Roadmap: riesgo de fractura ósea', 'boneHrr')],
  },
  {
    id: 'fitness', riskId: 'fitness', title: 'Músculos y condición física',
    paragraphs: [
      'Vivir en microgravedad debilita los músculos y la condición aeróbica. En la estación espacial, la pérdida media de fuerza y de condición aeróbica es del 10% al 12%, y entre el 12% y el 38% de los tripulantes pierden más del 20%, según cómo se mida. La pérdida de fuerza afecta a más personas que la pérdida aeróbica.',
      'Contramedidas: cerca de 1,5 horas de ejercicio de resistencia y aeróbico por día, seis o siete días por semana. Las naves para la Luna y Marte tendrán menos espacio para aparatos de ejercicio.',
      'En la app: capa de los músculos, con la fuerza del tronco, el muslo y la pantorrilla en porcentaje del valor inicial.',
    ],
    sources: [link('NASA: riesgo de menor condición cardiorrespiratoria y musculoesquelética', 'fitness')],
  },
  {
    id: 'cardiovascular', riskId: 'cardiovascular', title: 'Corazón y vasos',
    paragraphs: [
      'La microgravedad lleva los fluidos del cuerpo hacia la cabeza y cambia el volumen, el flujo y la presión de la sangre. Con el tiempo esto puede causar desacondicionamiento, presión baja y desmayos al ponerse de pie después del aterrizaje, menor capacidad de ejercicio y, posiblemente, coágulos y alteraciones del ritmo del corazón. El corazón incluso puede volverse más redondo. Ya se documentó en vuelo un caso de coágulo en la vena yugular.',
      'En la órbita baja, la mayoría de los efectos se recuperan semanas o meses después del aterrizaje, pero se sabe menos sobre misiones de más de un año o más allá de la órbita baja. Contramedidas: ejercicio, dieta, ropa de compresión y tomar líquidos antes del aterrizaje.',
      'En la app: capa cardiovascular, con la frecuencia cardíaca en reposo y la recuperación de la frecuencia cardíaca.',
    ],
    sources: [link('NASA: riesgo de adaptaciones cardiovasculares', 'cardiovascular'), link('Human Research Roadmap: riesgo cardiovascular', 'cardiovascularHrr')],
  },
  {
    id: 'sans', riskId: 'sans', title: 'Ojos y cerebro (SANS)',
    paragraphs: [
      'El síndrome neuroocular asociado a los vuelos espaciales (SANS) solo existe en quienes viajan al espacio. Los fluidos se desplazan hacia la cabeza y pueden causar hinchazón del nervio óptico (edema del disco óptico), pliegues en la retina, aplanamiento de la parte trasera del ojo y cambios en la visión. Cerca del 70% de los tripulantes muestran al menos uno de estos signos.',
      'Los efectos a largo plazo todavía se desconocen y el riesgo crece con la duración de la misión. La NASA prueba contramedidas como suplementos de vitaminas del complejo B, brazaletes en los muslos y aparatos que llevan el fluido hacia las piernas, y estudia a personas acostadas con la cabeza inclinada 6 grados hacia abajo.',
      'En la app: capa de los ojos y el cerebro, con el promedio esperado de signos de SANS de 0 a 4. Las flechas en el cuerpo muestran el fluido subiendo hacia la cabeza.',
    ],
    sources: [link('NASA: riesgo de SANS', 'sans'), link('Human Research Roadmap: riesgo de SANS', 'sansHrr')],
  },
  {
    id: 'sleep', riskId: 'sleep', title: 'Sueño y carga de trabajo',
    paragraphs: [
      'En vuelo, las tripulaciones duermen unas 6 horas por noche y enfrentan mucho trabajo, horarios irregulares y 16 amaneceres y atardeceres por día en la estación espacial. Los estudios en la Tierra muestran que esto reduce el rendimiento y el ánimo a corto plazo y está ligado a problemas a largo plazo, como enfermedades del corazón y diabetes.',
      'Contramedidas: iluminación LED que imita el día y la noche de la Tierra, estudios sobre la luz y la cafeína, y horarios fijos para el descanso y el cuidado personal.',
      'En la app: capa del sueño, con las horas de sueño y la calidad del sueño de 1 a 5. El cerebro, la médula y los nervios aparecen porque la falta de sueño afecta a todo el sistema nervioso.',
    ],
    sources: [link('NASA: riesgos del sueño insuficiente y de los horarios irregulares', 'sleep'), link('Human Research Roadmap: riesgo del sueño', 'sleepHrr')],
  },
  {
    id: 'radiation', riskId: 'radiation', title: 'Radiación',
    paragraphs: [
      'En el espacio, la tripulación recibe más radiación que en la Tierra: sobre todo protones, algo de helio y una pequeña parte de iones pesados, que causan daños difíciles de reparar para las células. Esto puede aumentar la probabilidad, a lo largo de la vida, de algunos tipos de cáncer y de enfermedades del corazón, los vasos y los ojos. Las misiones a la Luna y a Marte salen de la protección de la magnetosfera de la Tierra.',
      'La NASA estima el riesgo a lo largo de la vida con un modelo basado en personas expuestas a la radiación en la Tierra, y la incertidumbre es grande. Contramedidas: dosímetros a bordo, blindaje en la nave e investigaciones sobre medicamentos y estimaciones de riesgo personalizadas.',
      'En la app: capa de la radiación, con la dosis acumulada en milisievert. El aura alrededor del cuerpo se pone verde, amarilla o roja según la dosis supera los límites.',
    ],
    sources: [link('NASA: riesgo de cánceres inducidos por radiación', 'radiation'), link('Human Research Roadmap: carcinogénesis por radiación', 'radiationHrr')],
  },
];