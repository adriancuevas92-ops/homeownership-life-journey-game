// Datos de las ubicaciones. Títulos, niveles y lógica de bloqueo son reales.
// Cada ubicación tiene tarjetas de contenido en español, con fuentes del
// banco de investigación del proyecto. Los segmentos de video aún no existen.
//
// tier: 1 = Pérdidas silenciosas (desbloqueadas desde el inicio)
//       2 = La herramienta (AB 686 / SB 244)
//       3 = Casos en vivo (SEDA, Merced)

export const LOCATIONS = [
  {
    id: 'allensworth',
    tier: 1,
    title: 'Allensworth',
    subtitle: 'Fundado en 1908 — todavía lucha por el agua',
    cards: [
      {
        h: '¿Qué fue?',
        p: 'Fundado en 1908 como la primera ciudad de California financiada, construida y gobernada por afroamericanos. Lleva el nombre de su fundador, el coronel Allen Allensworth, quien había sido esclavizado.',
      },
      {
        h: 'El agua se desvió',
        p: 'Pocos años después de fundarse, agricultores blancos desviaron el arroyo que abastecía al pueblo. La compañía de terrenos que vendió el sitio nunca construyó el sistema de agua prometido.',
      },
      {
        h: 'Arsénico',
        p: 'Algunos pozos registraron 15 veces el límite legal de arsénico. Las autoridades estatales conocían el peligro desde al menos los años sesenta, pero no se lo informaron a los residentes durante décadas.',
      },
      {
        h: 'Progreso reciente',
        p: 'Una subvención de 3.8 millones de dólares del programa SAFER de la Junta Estatal de Control de Recursos Hídricos financió un pozo nuevo, un sistema para quitar el arsénico y un tanque de almacenamiento de 500,000 galones (informado en 2025-2026).',
      },
      {
        h: 'La idea central',
        p: 'Un pueblo fundado para escapar de la segregación del Valle sigue luchando por la seguridad básica del agua, 118 años después.',
      },
      {
        h: 'Fuentes',
        p: 'The FERN (2022) · KQED · KVPR (enero de 2026) · Wikipedia, Allensworth.',
      },
    ],
  },
  {
    id: 'lanare',
    tier: 1,
    title: 'Lanare',
    subtitle: 'Construido, luego cerrado',
    cards: [
      {
        h: '¿Qué es Lanare?',
        p: 'Comunidad no incorporada del condado de Fresno, cerca de Lemoore, con unos 600 residentes.',
      },
      {
        h: 'Más de 13 años con agua contaminada',
        p: 'El agua superó el límite estatal de arsénico durante más de 13 años. En 2007, una subvención estatal construyó una planta de tratamiento.',
      },
      {
        h: 'La planta cerró a los seis meses',
        p: 'Operarla le costaba a cada residente más de 120 dólares al mes, dinero que nadie tenía. Se acumularon unos 100,000 dólares de deuda. La planta estuvo parada más de una década.',
      },
      {
        h: 'La solución: pozos nuevos',
        p: 'En febrero de 2019, una subvención estatal de 3.8 millones de dólares pagó dos pozos nuevos de agua potable, en lugar de volver a poner en marcha la planta.',
      },
      {
        h: 'La lección',
        p: 'Dar acceso sin pagar la operación no es equidad. Una subvención única que ignora el costo diario es otra forma de fallar en el deber AFFH.',
      },
      {
        h: 'Fuentes',
        p: 'KVPR (2019) · Mother Jones (2015) · KQED, State of Health.',
      },
    ],
  },
  {
    id: 'kern-county',
    tier: 1,
    title: 'Condado de Kern',
    subtitle: 'Arvin y Lost Hills',
    cards: [
      {
        h: '40,000 pozos nuevos',
        p: 'La junta de supervisores del condado de Kern aprobó una sola evaluación de impacto ambiental para acelerar más de 40,000 pozos nuevos de petróleo y gas en las próximas décadas. Eso elimina la revisión específica de cada sitio y la participación pública a nivel del condado.',
      },
      {
        h: 'Quién carga el costo',
        p: 'Lost Hills, Buena Vista y el área de Bakersfield ya tienen de los peores niveles de calidad del aire del país. Son comunidades de bajos ingresos y mayoritariamente latinas.',
      },
      {
        h: 'Arvin, 2013',
        p: 'Después de una fuga de una tubería de petróleo debajo de sus casas, los residentes de Arvin estuvieron nueve meses fuera de sus hogares.',
      },
      {
        h: 'La propia evaluación del condado',
        p: 'El análisis ambiental del condado admite que la ordenanza empeorará la calidad del aire, dañará el agua subterránea, aumentará el ruido y destruirá tierras agrícolas.',
      },
      {
        h: 'Por qué importa para la ley',
        p: 'Esta es una decisión de zonificación y permisos, no de vivienda. Muestra que el lenguaje de AB 686 puede alcanzar también lo que se permite junto a las casas que ya existen.',
      },
      {
        h: 'Fuentes',
        p: 'Center for Biological Diversity (marzo de 2021) · South Kern Sol (2023) · turnto23.com.',
      },
    ],
  },
  {
    id: 'stockton',
    tier: 1,
    title: 'Stockton',
    subtitle: 'Crecimiento sin seguimiento',
    cards: [
      {
        h: 'Un programa de exenciones',
        p: 'Durante una década, el programa Stockton Economic Stimulus Program condonó cuotas de infraestructura para impulsar el crecimiento: 3,461 casas unifamiliares, 548 unidades multifamiliares y más de 17 millones de pies cuadrados de espacio industrial.',
      },
      {
        h: 'Lo que se perdió',
        p: 'Se condonaron 76.9 millones de dólares en cuotas residenciales y 17 millones en no residenciales. Las mayores pérdidas fueron en mejoras de calles y en parques.',
      },
      {
        h: 'Lo que dijo la ciudad',
        p: 'El personal municipal dijo: "esos fondos no desaparecen, deben reponerse o la infraestructura no se construye." Según la ciudad, los beneficios llegaron "de forma desigual en toda la ciudad". (Traducción no oficial.)',
      },
      {
        h: 'Mientras tanto',
        p: 'El condado de San Joaquín debe planear más de 21,000 casas para hogares de bajos ingresos para 2031. El programa de vivienda asequible de Stockton (15 proyectos, hasta 900 casas) tiene una brecha de financiamiento de más de 50 millones de dólares.',
      },
      {
        h: 'Por qué es una pérdida silenciosa',
        p: 'No hubo una pelea grande ni una conferencia de prensa. Esto pasa por defecto, a través de un programa de incentivos, no por una votación dramática.',
      },
      {
        h: 'Fuentes',
        p: 'Stocktonia (agosto de 2025 y abril de 2026).',
      },
    ],
  },
  {
    id: 'ab686-tool',
    tier: 2,
    title: 'AB 686 y SB 244',
    subtitle: 'La herramienta',
    cards: [
      {
        h: '¿Qué es AB 686?',
        p: 'Es una ley de California firmada en 2018 y vigente desde el 1 de enero de 2019. Obliga a todas las agencias públicas —estatales, ciudades, condados y autoridades de vivienda— a tomar acciones concretas para combatir la segregación.',
      },
      {
        h: 'La definición legal',
        p: 'Según la ley, esto significa "tomar acciones significativas, además de combatir la discriminación, que superen los patrones de segregación y fomenten comunidades inclusivas libres de barreras que limitan el acceso a oportunidades". (Traducción no oficial del texto en inglés, Gov. Code §8899.50(a)(1).)',
      },
      {
        h: 'Dónde vive el deber',
        p: 'En el Elemento de Vivienda (Housing Element), el plan que cada ciudad y condado debe presentar. Ya no basta con contar casas: hay que analizar dónde se construyen y quién queda afuera.',
      },
      {
        h: 'Materialmente inconsistente',
        p: 'Ninguna agencia puede tomar una acción materialmente inconsistente con este deber.',
      },
      {
        h: 'Por qué California lo escribió en la ley',
        p: 'En 2015, el gobierno federal creó una regla AFFH. Cuando se intentó debilitarla a nivel federal, California la puso en su propia ley para que no dependiera de quién gobierne en Washington.',
      },
      {
        h: 'SB 244 (2011): la mitad de infraestructura',
        p: 'SB 244 exige que cada ciudad y condado identifique las "comunidades desfavorecidas no incorporadas" (DUC) y evalúe sus brechas de agua, drenaje, alcantarillado y protección contra incendios. Tonyville, East Porterville, Lanare y Allensworth caen en esta categoría.',
      },
      {
        h: 'Por qué van juntas',
        p: 'AB 686 trata la vivienda y el uso de suelo. SB 244 trata la infraestructura. Son dos mitades del mismo problema.',
      },
      {
        h: 'Fuentes',
        p: 'Texto del proyecto AB 686 (leginfo.legislature.ca.gov) · Hoja informativa de NHLP, feb. de 2019 · Texto de SB 244 (leginfo.ca.gov) · Página AFFH de HCD (hcd.ca.gov).',
      },
    ],
  },
  {
    id: 'seda',
    tier: 3,
    title: 'SEDA',
    subtitle: 'Fresno — caso en vivo',
    cards: [
      {
        h: '¿Qué es SEDA?',
        p: 'Propuesta del alcalde Jerry Dyer para el sureste de Fresno: 9,000 acres y 45,000 casas nuevas.',
      },
      {
        h: 'El costo',
        p: 'La revisión financiera de Fresno Unified y la ciudad estima una brecha de financiamiento de infraestructura de unos 3 mil millones de dólares.',
      },
      {
        h: 'Las escuelas',
        p: 'Fresno Unified proyecta hasta 11 cierres de escuelas y una pérdida de unos 200 millones de dólares al año. Cada estudiante que se va le cuesta unos 17,000 dólares al distrito. Podría haber una caída de hasta el 20% en la matrícula.',
      },
      {
        h: 'El aire',
        p: 'El propio estudio ambiental de la ciudad estima un aumento de alrededor del 600% en la contaminación del aire.',
      },
      {
        h: 'Quién se opone',
        p: 'Fresno Unified votó 4-0 en contra (mayo de 2026). Central Unified se opuso por unanimidad. La Coalición Greenfield —sindicatos, grupos vecinales y líderes religiosos— también se opone. El pastor Simon Biasell dijo: "Por décadas, hemos visto con tristeza cómo nuestra comunidad carece de los recursos que otras comunidades sí reciben." (Traducción no oficial.)',
      },
      {
        h: 'La conexión clave',
        p: 'Sabrina Kelley, defensora del suroeste de Fresno, preguntó: "¿De dónde saldrá el dinero para esta expansión, para la infraestructura, las calles y las banquetas, mientras nuestros vecindarios de siempre se caen a pedazos?" (Traducción no oficial.) El suroeste de Fresno está en el mismo terreno que la zona D4/D5 del mapa HOLC de 1936.',
      },
      {
        h: 'Estado actual',
        p: 'En diciembre de 2025, el concejo municipal votó 5-2 para pedir un estudio de 6 meses sobre el impacto financiero y escolar. Por ahora, la decisión sigue pendiente.',
      },
      {
        h: 'Lo que aún no se ha dicho',
        p: 'Hasta ahora nadie ha conectado públicamente SEDA con AB 686. Esa conexión es un análisis original y debe presentarse como una lectura, no como un hallazgo legal.',
      },
      {
        h: 'Fuentes',
        p: 'Fresnoland (2026) · The Business Journal · KVPR (junio de 2026) · GV Wire (febrero de 2026).',
      },
    ],
  },
  {
    id: 'merced',
    tier: 3,
    title: 'Merced',
    subtitle: 'Caso en vivo',
    cards: [
      {
        h: 'Crecimiento y desplazamiento',
        p: 'Merced tuvo el mayor crecimiento de ingreso personal entre las áreas metropolitanas de EE. UU. en los últimos cinco años, impulsado por la expansión de 1,300 millones de dólares de UC Merced. Pero el crecimiento empujó a los pobres hacia las afueras.',
      },
      {
        h: 'El Tioga',
        p: 'El histórico hotel Tioga se convirtió en departamentos con 90 unidades de vivienda asequible. Una renovación de lujo eliminó esas unidades.',
      },
      {
        h: 'Cinco cartas',
        p: 'Desde junio de 2024, Leadership Counsel for Justice and Accountability ha presentado al menos cinco cartas formales sobre el Elemento de Vivienda de Merced: 12 de junio de 2024, 28 de julio de 2025, 20 de enero de 2026, 18 de marzo de 2026 y 6 de mayo de 2026.',
      },
      {
        h: 'La cifra clave',
        p: 'El propio inventario de sitios del condado asigna 51% de la vivienda planeada de bajos ingresos a áreas de bajos recursos. Mientras tanto, 39% de la vivienda de ingresos moderados altos va a áreas de altos recursos. El borrador lo presentó como una mejora contra la segregación. La carta de LCJA dice que la exacerba.',
      },
      {
        h: 'Historia que sigue viva',
        p: 'Las cartas citan la Ley de Tierras para Extranjeros de 1913/1920, el redlining y los programas de trabajo migrante como causa de la pobreza concentrada en Planada, Dos Palos y Delhi. South Dos Palos fue un pueblo segregado de personas negras durante la era de migración del Dust Bowl.',
      },
      {
        h: 'Lo que se pide y no se aprueba',
        p: 'Ordenanza de estabilización de rentas, programa de protección contra desalojos, zonificación inclusiva, límites a la expansión lechera cerca de R/ECAP, e inversión real en agua y aguas residuales en Planada y Delhi. Se han pedido en casi todas las cartas y, hasta mayo de 2026, no se han adoptado.',
      },
      {
        h: 'Daño actual',
        p: 'Las reparaciones en Planada siguen detenidas desde la inundación de 2023. El agua y el drenaje limitan hoy la construcción de vivienda en Planada y Delhi. Cerca de los R/ECAP, la expansión lechera se asocia con una tasa de asma infantil de 26%, frente a 15.2% en todo el estado (Departamento de Salud Pública del condado de Merced, 2016).',
      },
      {
        h: 'No es un solo adversario',
        p: 'La Asociación de Apartamentos de California apoya el borrador tal como está, y el sindicato de carpinteros (Local 152) pide normas laborales. Es un conflicto con varios actores, no solo LCJA contra un condado silencioso.',
      },
      {
        h: 'Fuentes',
        p: 'Cartas de LCJA al condado de Merced (2024–2026), portal de documentos públicos del Elemento de Vivienda · KQED · Zócalo Public Square.',
      },
    ],
  },
];

export const TIER1_IDS = LOCATIONS.filter(l => l.tier === 1).map(l => l.id);
export const TIER2_IDS = LOCATIONS.filter(l => l.tier === 2).map(l => l.id);
export const TIER3_IDS = LOCATIONS.filter(l => l.tier === 3).map(l => l.id);

/**
 * Given a Set of visited location ids, return the set of tiers currently
 * unlocked (1 is always included).
 *  - Tier 2 unlocks after >=1 Tier 1 location has been visited.
 *  - Tier 3 unlocks only after ALL Tier 1 locations have been visited.
 */
export function unlockedTiers(visited) {
  const tiers = new Set([1]);
  const tier1VisitedCount = TIER1_IDS.filter(id => visited.has(id)).length;
  if (tier1VisitedCount >= 1) tiers.add(2);
  if (tier1VisitedCount === TIER1_IDS.length) tiers.add(3);
  return tiers;
}

export function isLocked(location, visited) {
  return !unlockedTiers(visited).has(location.tier);
}
