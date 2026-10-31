import { aea, carpetaERSeP, manual, programaUTN, teoria, type Referencia } from '../referencias'
import type { Ejercicio } from './tipos'
import { elegir, mezclar } from './util'

interface Pregunta {
  /** id del tema de la guía al que pertenece */
  tema: string
  enunciado: string
  correcta: string
  incorrectas: [string, string, string]
  explicacion: string
  fuente: Referencia
}

/** Banco de preguntas de teoría, agrupadas por tema de la guía. */
export const PREGUNTAS: Pregunta[] = [
  // --- Conductores y colores ---
  {
    tema: 'conductores-colores',
    enunciado: '¿De qué color tiene que ser el conductor de protección (PE)?',
    correcta: 'Verde-amarillo',
    incorrectas: ['Verde', 'Celeste', 'Negro'],
    explicacion:
      'Verde-amarillo es exclusivo del PE. No se puede usar para otra cosa, ni tampoco verde solo o amarillo solo.',
    fuente: aea('Tabla 770.10.XIII'),
  },
  {
    tema: 'conductores-colores',
    enunciado: '¿De qué color tiene que ser el neutro?',
    correcta: 'Celeste',
    incorrectas: ['Blanco', 'Negro', 'Verde-amarillo'],
    explicacion: 'El celeste (o azul claro) es exclusivo del neutro.',
    fuente: aea('Tabla 770.10.XIII'),
  },
  {
    tema: 'conductores-colores',
    enunciado: '¿Qué colores se pueden usar para la fase en un circuito monofásico?',
    correcta: 'Marrón, negro o rojo',
    incorrectas: ['Solo marrón', 'Marrón o celeste', 'Cualquier color menos verde-amarillo'],
    explicacion:
      'En monofásico vale cualquiera de los tres colores de fase. Si sale de una trifásica, va del color de la fase de origen.',
    fuente: aea('770.10.3.8.5'),
  },
  {
    tema: 'conductores-colores',
    enunciado: '¿Qué color usa la carpeta modelo del ERSeP para los retornos de las llaves?',
    correcta: 'Blanco',
    incorrectas: ['Celeste', 'Verde', 'Verde-amarillo'],
    explicacion:
      'Los retornos no pueden ser de los colores de fase, neutro ni PE. La carpeta usa blanco; si no hay, un color de fase marcado con anillos en los dos extremos.',
    fuente: carpetaERSeP('sección 05'),
  },
  {
    tema: 'conductores-colores',
    enunciado: '¿Se puede enterrar directamente un cable unipolar IRAM NM 247-3?',
    correcta: 'No, va solo dentro de caños o cablecanales',
    incorrectas: [
      'Sí, a 0,70 m de profundidad',
      'Sí, con cinta de peligro',
      'Sí, si es de 4 mm² o más',
    ],
    explicacion:
      'Para enterrar hace falta un cable con envoltura, como el IRAM 2178-1, a 0,70 m o más de profundidad.',
    fuente: aea('770.10.2'),
  },
  {
    tema: 'conductores-colores',
    enunciado: '¿Cuál es la sección mínima de un circuito de tomas de uso general (TUG)?',
    correcta: '2,5 mm²',
    incorrectas: ['1,5 mm²', '1 mm²', '4 mm²'],
    explicacion: 'TUG, TUE y el PE: 2,5 mm². Iluminación: 1,5 mm². Línea principal: 4 mm².',
    fuente: aea('Tabla 770.11.I'),
  },
  {
    tema: 'conductores-colores',
    enunciado: '¿Cuál es la sección mínima de la línea principal?',
    correcta: '4 mm²',
    incorrectas: ['2,5 mm²', '6 mm²', '10 mm²'],
    explicacion:
      'Es el mínimo de la tabla; después hay que verificar corriente y caída de tensión.',
    fuente: aea('Tabla 770.11.I'),
  },
  {
    tema: 'conductores-colores',
    enunciado: '¿A qué profundidad mínima se entierra un cable con envoltura (IRAM 2178-1)?',
    correcta: '0,70 m',
    incorrectas: ['0,20 m', '0,40 m', '1,50 m'],
    explicacion:
      'A 0,70 m o más, con cinta «PELIGRO ELÉCTRICO» a 0,20 m de la superficie y protección mecánica.',
    fuente: aea('770.10.4.2.1'),
  },
  // --- Protecciones ---
  {
    tema: 'protecciones',
    enunciado: '¿Qué protege el interruptor termomagnético (PIA)?',
    correcta: 'El cable, contra sobrecargas y cortocircuitos',
    incorrectas: [
      'A las personas, contra contactos directos',
      'Los aparatos, contra sobretensiones',
      'La instalación, contra fugas a tierra',
    ],
    explicacion:
      'El PIA protege al conductor. A las personas las protege el diferencial; contra sobretensiones, el DPS.',
    fuente: aea('770.15.2.1'),
  },
  {
    tema: 'protecciones',
    enunciado: '¿Qué tipo de PIA exige la AEA 770 en un circuito monofásico?',
    correcta: 'Bipolar, con los dos polos protegidos',
    incorrectas: ['Unipolar', '1P+N (neutro pasante)', 'Cualquiera, si es IEC 60898'],
    explicacion: 'Están prohibidos los unipolares, los 1P+N y los de neutro pasante.',
    fuente: aea('770.16.5.1'),
  },
  {
    tema: 'protecciones',
    enunciado:
      '¿Qué sensibilidad máxima tiene que tener el diferencial de los circuitos terminales?',
    correcta: '30 mA',
    incorrectas: ['10 mA', '100 mA', '300 mA'],
    explicacion:
      'Todos los circuitos terminales llevan diferencial de 30 mA o menos, no retardado. El de 300 mA solo se admite entre tableros.',
    fuente: aea('770.14.2.3'),
  },
  {
    tema: 'protecciones',
    enunciado:
      'En una vivienda (esquema TT), ¿qué protege contra contactos indirectos por corte automático?',
    correcta: 'El diferencial, junto con la puesta a tierra',
    incorrectas: ['El termomagnético', 'La puesta a tierra sola', 'El fusible de la acometida'],
    explicacion: 'En TT la norma no admite usar el PIA para esto: tiene que ser el diferencial.',
    fuente: aea('770.14.3.2'),
  },
  {
    tema: 'protecciones',
    enunciado: '¿Qué curva de PIA usa la carpeta del ERSeP para los circuitos de iluminación?',
    correcta: 'B',
    incorrectas: ['C', 'D', 'K'],
    explicacion:
      'B10 para iluminación y C10 para tomas. La curva D es para motores con mucho pico de arranque.',
    fuente: carpetaERSeP(),
  },
  {
    tema: 'protecciones',
    enunciado:
      'Un diferencial tiene aguas arriba un termomagnético de 32 A. ¿Qué corriente nominal puede tener?',
    correcta: '40 A',
    incorrectas: ['25 A', '16 A', '30 mA es suficiente'],
    explicacion:
      'La corriente nominal del ID tiene que ser igual o mayor que la del termomagnético de arriba (o que la suma de los PIA de abajo).',
    fuente: aea('770.15.2.2.5'),
  },
  {
    tema: 'protecciones',
    enunciado: '¿Qué indica el número «3000» en un rectángulo en el frente de un PIA?',
    correcta: 'Su poder de corte: 3000 A de cortocircuito',
    incorrectas: [
      'La potencia máxima en watts',
      'La cantidad de maniobras que soporta',
      'La tensión de aislación',
    ],
    explicacion:
      'Tiene que ser mayor o igual que la corriente de cortocircuito posible en el punto donde se instala.',
    fuente: aea('770.15.2.2.2'),
  },
  {
    tema: 'protecciones',
    enunciado: '¿Cuándo es obligatorio el DPS (protector de sobretensiones)?',
    correcta: 'Siempre que el edificio tenga pararrayos',
    incorrectas: [
      'En todas las viviendas',
      'Solo con red subterránea',
      'Nunca, es una recomendación',
    ],
    explicacion:
      'También es obligatorio con red aérea en zonas de más de 25 días de tormenta por año.',
    fuente: aea('Tabla 770.15.III'),
  },
  // --- Tableros ---
  {
    tema: 'tablero',
    enunciado: '¿Cuál es el orden correcto en el tablero principal?',
    correcta: 'Interruptor principal → diferencial → PIA de cada circuito',
    incorrectas: [
      'Diferencial → PIA de cada circuito → interruptor principal',
      'PIA de cada circuito → diferencial → interruptor principal',
      'Interruptor principal → PIA de cada circuito → diferencial',
    ],
    explicacion:
      'Primero se corta todo, después se protege a las personas y al final cada cable. Si el TPA ya protege la línea, el TPU puede arrancar con el diferencial.',
    fuente: aea('770.16.5.3'),
  },
  {
    tema: 'tablero',
    enunciado:
      '¿Cuál es la corriente máxima del interruptor de cabecera en una vivienda de la AEA 770?',
    correcta: '63 A',
    incorrectas: ['32 A', '40 A', '100 A'],
    explicacion: 'Si hace falta más de 63 A, la instalación pasa a la AEA 771.',
    fuente: aea('770.16.5.3'),
  },
  {
    tema: 'tablero',
    enunciado: '¿Dónde está prohibido instalar el tablero?',
    correcta: 'En el baño',
    incorrectas: ['En el pasillo', 'En la cocina, a la vista', 'En el garaje'],
    explicacion:
      'Tampoco dentro de muebles, bajo mesadas, en huecos de la construcción ni en lugares de difícil acceso.',
    fuente: aea('770.16.2'),
  },
  {
    tema: 'tablero',
    enunciado: '¿A qué altura tienen que quedar las palancas del tablero?',
    correcta: 'Entre 0,40 m y 2 m del piso',
    incorrectas: ['Entre 1 m y 1,50 m', 'A más de 2 m', 'Entre 0,20 m y 1 m'],
    explicacion: 'Tienen que ser fáciles de accionar desde el piso del local.',
    fuente: aea('770.16.4'),
  },
  {
    tema: 'tablero',
    enunciado: '¿Qué reserva de espacio libre tiene que tener un tablero?',
    correcta: '20 %',
    incorrectas: ['10 %', '30 %', '50 %'],
    explicacion: 'Sirve para agregar circuitos más adelante sin cambiar el gabinete.',
    fuente: aea('770.16.4'),
  },
  {
    tema: 'tablero',
    enunciado: '¿A qué distancia máxima del medidor va el tablero principal?',
    correcta: '2 m, dentro de la propiedad',
    incorrectas: ['5 m', '10 m', 'No hay límite'],
    explicacion:
      'El tablero principal va dentro de la propiedad, a 2 m o menos de la caja del medidor.',
    fuente: aea('770.16.3.1'),
  },
  {
    tema: 'tablero',
    enunciado: '¿Qué grado de protección mínimo tiene que tener un tablero interior?',
    correcta: 'IP41 o IP31D',
    incorrectas: ['IP20', 'IP54', 'IP65'],
    explicacion: 'A la intemperie, IP54 como mínimo.',
    fuente: aea('770.16.4'),
  },
  {
    tema: 'tablero',
    enunciado: 'En la carpeta del ERSeP, ¿qué es el TPA?',
    correcta: 'El tablero de protección de la acometida, junto al medidor',
    incorrectas: [
      'El tablero principal dentro de la casa',
      'El tablero de un aire acondicionado',
      'El tablero de la distribuidora en la calle',
    ],
    explicacion: 'El de adentro de la casa es el TPU (tablero principal del usuario).',
    fuente: carpetaERSeP(),
  },
  // --- Canalizaciones ---
  {
    tema: 'canalizaciones',
    enunciado: '¿Qué porcentaje máximo de la sección del caño pueden ocupar los cables?',
    correcta: '35 %',
    incorrectas: ['50 %', '25 %', '70 %'],
    explicacion:
      'Se cuenta el área de los cables con su aislación. Para no hacer la cuenta están las tablas de la norma.',
    fuente: aea('770.10.3.8.4'),
  },
  {
    tema: 'canalizaciones',
    enunciado: '¿Cuántas curvas se admiten como máximo entre dos cajas?',
    correcta: '3',
    incorrectas: ['2', '4', 'No hay límite'],
    explicacion: 'Si hacen falta más, se pone una caja de paso en el medio.',
    fuente: aea('770.10.3.1'),
  },
  {
    tema: 'canalizaciones',
    enunciado: '¿Qué diámetro interno mínimo tiene el caño de un circuito terminal?',
    correcta: '13 mm (caño de 16)',
    incorrectas: ['10 mm (caño de 12)', '15 mm (caño de 19)', '20 mm (caño de 25)'],
    explicacion: 'Para la línea principal y los seccionales, 15 mm (caño de 19 o 20).',
    fuente: aea('770.10.3.8.4'),
  },
  {
    tema: 'canalizaciones',
    enunciado: '¿Cuántos cables de 2,5 mm² entran en un caño rígido RP20, además del PE?',
    correcta: '4',
    incorrectas: ['2', '7', '9'],
    explicacion: 'La tabla da «4+PE». En un RP16 entran 2+PE y en un RP25, 9+PE.',
    fuente: aea('Tabla 770.10.VIII'),
  },
  {
    tema: 'canalizaciones',
    enunciado: '¿Por dónde tienen que ir los caños embutidos en la pared?',
    correcta: 'En líneas verticales y horizontales, paralelas a las aristas',
    incorrectas: [
      'Por el camino más corto, en diagonal',
      'Siempre por el piso',
      'Por donde sea más fácil canaletear',
    ],
    explicacion: 'Así se sabe por dónde pasan y nadie los perfora al colgar un cuadro.',
    fuente: aea('770.10.3.1'),
  },
  {
    tema: 'canalizaciones',
    enunciado: '¿Qué volumen útil tiene una caja rectangular de 5 × 10?',
    correcta: '120 cm³',
    incorrectas: ['75 cm³', '200 cm³', '300 cm³'],
    explicacion: 'La cuadrada de 10 × 10 tiene 200 cm³ y la octogonal chica, 75 cm³.',
    fuente: aea('Tabla 770.10.X'),
  },
  // --- Circuitos ---
  {
    tema: 'circuitos',
    enunciado: '¿Cuántas bocas puede tener como máximo un circuito IUG, TUG o TUE?',
    correcta: '15',
    incorrectas: ['10', '12', '20'],
    explicacion: 'El tope es el mismo para los tres tipos de uso general y especial.',
    fuente: aea('Tabla 770.6.I'),
  },
  {
    tema: 'circuitos',
    enunciado: '¿Cuál es la protección máxima de un circuito TUG?',
    correcta: '20 A',
    incorrectas: ['16 A', '25 A', '32 A'],
    explicacion: 'IUG hasta 16 A, TUG hasta 20 A y TUE hasta 32 A.',
    fuente: aea('Tabla 770.6.I'),
  },
  {
    tema: 'circuitos',
    enunciado: '¿Cuántos tomas como mínimo necesita un comedor de 20 m²?',
    correcta: '4',
    incorrectas: ['2', '3', '6'],
    explicacion: '1 toma cada 6 m² o fracción: 20 / 6 = 3,3, que se redondea para arriba a 4.',
    fuente: aea('Tabla 770.7.III'),
  },
  {
    tema: 'circuitos',
    enunciado: '¿Cuántos tomas como mínimo necesita un dormitorio de 12 m²?',
    correcta: '3',
    incorrectas: ['1', '2', '4'],
    explicacion: 'Menos de 10 m²: 2 tomas. De 10 a 36 m²: 3 tomas.',
    fuente: aea('Tabla 770.7.III'),
  },
  {
    tema: 'circuitos',
    enunciado: '¿A qué altura va el borde inferior de la caja de un toma sobre el zócalo?',
    correcta: 'Entre 0,20 m y 0,30 m del piso',
    incorrectas: ['Entre 0,40 m y 0,60 m', 'A 1,10 m', 'A 0,10 m'],
    explicacion: 'Es el valor de la AEA 770. La carpeta del ERSeP los dibuja a 0,40 m.',
    fuente: aea('770.7.2'),
  },
  {
    tema: 'circuitos',
    enunciado: '¿Se puede conectar al circuito de iluminación un toma a 0,30 m del piso?',
    correcta: 'No, está prohibido por debajo de 0,90 m',
    incorrectas: [
      'Sí, si es de 10 A',
      'Sí, si el cable es de 2,5 mm²',
      'Sí, en cualquier ambiente',
    ],
    explicacion: 'Las bocas mixtas (llave y toma en el IUG) tienen que estar a 0,90 m o más.',
    fuente: aea('770.7.1 m)'),
  },
  // --- Puesta a tierra ---
  {
    tema: 'puesta-tierra',
    enunciado: '¿Cuál es la resistencia máxima de la puesta a tierra en una vivienda?',
    correcta: '40 Ω',
    incorrectas: ['10 Ω', '5 Ω', '100 Ω'],
    explicacion: 'Es un máximo. La carpeta del ERSeP dice «mínimos» por error de redacción.',
    fuente: aea('770.3.2'),
  },
  {
    tema: 'puesta-tierra',
    enunciado: '¿Qué esquema de conexión a tierra se usa en las viviendas?',
    correcta: 'TT',
    incorrectas: ['TN-S', 'TN-C', 'IT'],
    explicacion:
      'La distribuidora pone a tierra el neutro y la casa tiene su propia tierra de protección, independiente.',
    fuente: aea('770.3.2'),
  },
  {
    tema: 'puesta-tierra',
    enunciado: '¿Se pueden conectar las masas a tierra en serie («en guirnalda»)?',
    correcta: 'No, el PE se deriva a cada masa sin cortarse',
    incorrectas: [
      'Sí, si el cable es de 2,5 mm²',
      'Sí, dentro de la misma habitación',
      'Sí, si son menos de 15 bocas',
    ],
    explicacion: 'Si se suelta una conexión en serie, todas las que siguen quedan sin tierra.',
    fuente: aea('770.14.4.5'),
  },
  {
    tema: 'puesta-tierra',
    enunciado: '¿Qué sección mínima tiene el conductor de protección (PE)?',
    correcta: '2,5 mm²',
    incorrectas: ['1 mm²', '1,5 mm²', '4 mm²'],
    explicacion: 'Hasta 16 mm² de fase, el PE es igual a la fase, con un mínimo de 2,5 mm².',
    fuente: aea('Tabla 770.14.I'),
  },
  {
    tema: 'puesta-tierra',
    enunciado: '¿Qué sección mínima tiene el cable que une la jabalina con la barra de tierra?',
    correcta: '4 mm²',
    incorrectas: ['1,5 mm²', '2,5 mm²', '16 mm²'],
    explicacion: 'La carpeta del ERSeP usa 6 mm².',
    fuente: aea('Tabla 770.14.I'),
  },
  {
    tema: 'puesta-tierra',
    enunciado: 'En el método de los 3 electrodos, ¿dónde se clava el electrodo de tensión?',
    correcta: 'Al 62 % de la distancia al electrodo de corriente',
    incorrectas: ['En el medio (50 %)', 'Pegado a la jabalina', 'Más lejos que el de corriente'],
    explicacion:
      'Después se repite la medición moviéndolo 1 m para cada lado y se comparan los valores.',
    fuente: aea('770.19.5.3'),
  },
  {
    tema: 'puesta-tierra',
    enunciado: '¿La cámara de inspección de la jabalina es obligatoria?',
    correcta: 'Sí, con tapa a nivel del piso',
    incorrectas: ['No, es una recomendación', 'Solo en grado elevado', 'Solo si hay dos jabalinas'],
    explicacion: 'Permite ver la conexión y desconectar la jabalina para medirla.',
    fuente: aea('770.14.4.3'),
  },
  // --- Seguridad ---
  {
    tema: 'seguridad',
    enunciado: '¿Cuál es el umbral de percepción de la corriente alterna?',
    correcta: '0,5 mA',
    incorrectas: ['10 mA', '30 mA', '100 mA'],
    explicacion: 'Es la corriente mínima que una persona siente al pasar por su cuerpo.',
    fuente: manual('2.19'),
  },
  {
    tema: 'seguridad',
    enunciado: '¿Cuál es el umbral de "no soltar" en corriente alterna?',
    correcta: '10 mA',
    incorrectas: ['0,5 mA', '30 mA', '500 mA'],
    explicacion:
      'Por encima de 10 mA los músculos se contraen (tetanización) y la persona no puede soltar lo que agarró.',
    fuente: manual('2.19'),
  },
  {
    tema: 'seguridad',
    enunciado: '¿Cuál es la principal causa de muerte por choque eléctrico?',
    correcta: 'La fibrilación ventricular',
    incorrectas: ['Las quemaduras en la piel', 'La tetanización de las manos', 'Las caídas'],
    explicacion:
      'El corazón se mueve en forma desordenada y deja de bombear sangre. Es la causa principal de muerte por choque eléctrico.',
    fuente: manual('2.19'),
  },
  {
    tema: 'seguridad',
    enunciado: '¿Qué tensión de seguridad acepta la AEA para locales secos?',
    correcta: '24 V',
    incorrectas: ['12 V', '50 V', '110 V'],
    explicacion: 'En locales secos, 24 V. En húmedos, mojados o con el cuerpo sumergido, 12 V.',
    fuente: manual('2.19'),
  },
  {
    tema: 'seguridad',
    enunciado:
      '¿Qué tensión de seguridad acepta la AEA en locales mojados o donde el cuerpo puede estar sumergido?',
    correcta: '12 V',
    incorrectas: ['24 V', '50 V', '6 V'],
    explicacion:
      'Con la piel mojada la resistencia del cuerpo baja mucho, por eso el límite es menor.',
    fuente: manual('2.19'),
  },
  {
    tema: 'seguridad',
    enunciado: '¿Qué es un contacto indirecto?',
    correcta: 'Tocar una masa metálica que quedó con tensión por una falla',
    incorrectas: [
      'Tocar un cable pelado de fase',
      'Tocar la fase y el neutro a la vez',
      'Tocar el conductor neutro',
    ],
    explicacion:
      'Las masas (carcasas, gabinetes) no deberían tener tensión: la toman por una falla de aislación. Contra esto protegen la puesta a tierra y el diferencial.',
    fuente: manual('2.20'),
  },
  {
    tema: 'seguridad',
    enunciado: '¿Qué es un contacto directo?',
    correcta: 'Tocar partes activas, que tienen tensión en servicio normal',
    incorrectas: [
      'Tocar la carcasa de un lavarropas con falla',
      'Tocar una cañería metálica',
      'Tocar el gabinete del tablero',
    ],
    explicacion:
      'Partes activas son los conductores y piezas con tensión en servicio normal, incluido el neutro.',
    fuente: manual('2.20'),
  },
  {
    tema: 'seguridad',
    enunciado: '¿Cuál es la primera de las reglas de oro para trabajar sin tensión?',
    correcta: 'Cortar efectivamente todas las fuentes de tensión',
    incorrectas: [
      'Verificar la ausencia de tensión',
      'Poner a tierra y en cortocircuito',
      'Señalizar la zona de trabajo',
    ],
    explicacion:
      'Orden: 1) corte efectivo, 2) bloqueo y traba de los aparatos de corte, 3) verificar ausencia de tensión, 4) puesta a tierra y en cortocircuito, 5) señalizar la zona de trabajo.',
    fuente: programaUTN(6),
  },
  {
    tema: 'seguridad',
    enunciado: 'Después de cortar y bloquear, ¿qué regla de oro sigue?',
    correcta: 'Verificar la ausencia de tensión',
    incorrectas: [
      'Señalizar la zona de trabajo',
      'Empezar a trabajar',
      'Medir la resistencia de aislación',
    ],
    explicacion:
      'Nunca se supone que no hay tensión: se comprueba con un detector o un instrumento en buen estado.',
    fuente: programaUTN(6),
  },
  {
    tema: 'seguridad',
    enunciado: '¿Qué valor de resistencia del cuerpo entre mano y pie considera el manual?',
    correcta: '2500 Ω',
    incorrectas: ['25 Ω', '250 000 Ω', '40 Ω'],
    explicacion:
      'Con 220 V y 2500 Ω circularían unos 88 mA: muy por encima del umbral de no soltar.',
    fuente: manual('2.19'),
  },
  {
    tema: 'seguridad',
    enunciado:
      'Con una corriente de fuga mucho mayor que su IΔn, un diferencial de 30 mA tiene que disparar en menos de…',
    correcta: '40 ms',
    incorrectas: ['1 segundo', '5 segundos', '500 ms'],
    explicacion:
      'Cuanto mayor es la fuga, más rápido corta. Así actúa antes de que se produzca la fibrilación ventricular.',
    fuente: manual('2.19'),
  },
  {
    tema: 'seguridad',
    enunciado: 'A igual valor de corriente, ¿cuál es más peligrosa para el cuerpo?',
    correcta: 'La corriente alterna de 50 Hz',
    incorrectas: ['La corriente continua', 'Son igual de peligrosas', 'La alterna de 100 kHz'],
    explicacion:
      'En continua es más fácil soltar y el umbral de fibrilación es mucho más alto que en alterna de 50 Hz.',
    fuente: manual('2.19'),
  },

  // --- Mediciones ---
  {
    tema: 'mediciones',
    enunciado: '¿Cómo se conecta un voltímetro para medir tensión?',
    correcta: 'En paralelo con lo que se mide',
    incorrectas: ['En serie con la carga', 'Abrazando un solo cable', 'Sin tensión en el circuito'],
    explicacion:
      'La tensión es una diferencia entre dos puntos: las puntas van en esos dos puntos.',
    fuente: manual('2.21'),
  },
  {
    tema: 'mediciones',
    enunciado: '¿Cómo se conecta un amperímetro (no de pinza)?',
    correcta: 'En serie con la carga',
    incorrectas: ['En paralelo con la carga', 'Entre fase y tierra', 'Entre fase y neutro'],
    explicacion:
      'Toda la corriente tiene que pasar por el instrumento. Conectado en paralelo hace un cortocircuito.',
    fuente: manual('2.21'),
  },
  {
    tema: 'mediciones',
    enunciado: 'Con una pinza amperométrica, ¿qué hay que abrazar?',
    correcta: 'Un solo conductor (la fase o el neutro)',
    incorrectas: [
      'La fase y el neutro juntos',
      'El cable completo con su vaina',
      'Los tres cables del circuito',
    ],
    explicacion:
      'Si abrazás ida y vuelta juntas, las corrientes se compensan y la pinza marca cero (o solo la fuga).',
    fuente: manual('2.22'),
  },
  {
    tema: 'mediciones',
    enunciado: '¿Con qué instrumento se mide la resistencia de aislación?',
    correcta: 'Megóhmetro',
    incorrectas: ['Telurímetro', 'Multímetro en escala de ohm', 'Pinza amperométrica'],
    explicacion:
      'El megóhmetro aplica una tensión alta (500 V CC en instalaciones domiciliarias); el óhmetro común no detecta las fugas.',
    fuente: manual('2.23'),
  },
  {
    tema: 'mediciones',
    enunciado:
      'En una instalación de hasta 500 V, ¿cuál es la resistencia de aislación mínima con un ensayo a 500 V CC?',
    correcta: '0,5 MΩ',
    incorrectas: ['40 Ω', '1000 Ω', '0,05 MΩ'],
    explicacion: 'Se mide entre fases, fases y neutro, fases y PE, y neutro y PE.',
    fuente: aea('Tabla 770.19.I'),
  },
  {
    tema: 'mediciones',
    enunciado: '¿Cómo tiene que estar la instalación para medir la aislación?',
    correcta: 'Con los artefactos desconectados y los interruptores cerrados',
    incorrectas: [
      'Con todos los artefactos conectados',
      'Con tensión y los artefactos funcionando',
      'Con los interruptores abiertos',
    ],
    explicacion:
      'Los artefactos conectados falsean la medición; los interruptores cerrados permiten medir todo el circuito.',
    fuente: aea('770.19.5.2'),
  },
  {
    tema: 'mediciones',
    enunciado: '¿Con qué instrumento se mide la resistencia de puesta a tierra?',
    correcta: 'Telurímetro',
    incorrectas: ['Megóhmetro', 'Pinza amperométrica', 'Cofímetro'],
    explicacion: 'El resultado tiene que ser de 40 Ω como máximo (AEA 770).',
    fuente: manual('2.24'),
  },
  {
    tema: 'mediciones',
    enunciado: 'Para medir resistencia con el multímetro (óhmetro), el circuito tiene que estar…',
    correcta: 'Sin tensión',
    incorrectas: ['Con tensión', 'Con la carga funcionando', 'Conectado a tierra'],
    explicacion:
      'El óhmetro usa su propia batería: con tensión externa la lectura es falsa y se puede dañar.',
    fuente: teoria(),
  },

  // --- Electricidad básica ---
  {
    tema: 'electricidad-basica',
    enunciado: 'En un circuito en serie, ¿qué magnitud es igual en todos los elementos?',
    correcta: 'La corriente',
    incorrectas: ['La tensión', 'La potencia', 'La resistencia'],
    explicacion: 'Hay un solo camino, así que la misma corriente pasa por todos.',
    fuente: manual('2.9'),
  },
  {
    tema: 'electricidad-basica',
    enunciado: 'En un circuito en paralelo, ¿qué magnitud es igual en todos los elementos?',
    correcta: 'La tensión',
    incorrectas: ['La corriente', 'La potencia', 'La resistencia'],
    explicacion: 'Todos están conectados entre los mismos dos puntos.',
    fuente: manual('2.9'),
  },
  {
    tema: 'electricidad-basica',
    enunciado: '¿Cómo se conectan los artefactos en una instalación domiciliaria?',
    correcta: 'En paralelo',
    incorrectas: ['En serie', 'En serie y paralelo alternados', 'Depende del artefacto'],
    explicacion: 'Así todos reciben 220 V y cada uno funciona independiente de los demás.',
    fuente: teoria(),
  },
  {
    tema: 'electricidad-basica',
    enunciado: 'Dos lámparas iguales de 220 V conectadas en serie a 220 V…',
    correcta: 'Iluminan menos, porque cada una recibe 110 V',
    incorrectas: ['Iluminan igual que solas', 'Iluminan el doble', 'Se queman'],
    explicacion:
      'La tensión se reparte entre las dos. Es el primer trabajo práctico del curso (unidad 2).',
    fuente: teoria(),
  },
  {
    tema: 'electricidad-basica',
    enunciado: '¿Cuál de estos materiales es aislante?',
    correcta: 'PVC',
    incorrectas: ['Cobre', 'Aluminio', 'Acero'],
    explicacion: 'El PVC es la aislación de los cables NM 247-3; el cobre es el conductor.',
    fuente: manual('2.7'),
  },

  // --- Corriente alterna ---
  {
    tema: 'corriente-alterna',
    enunciado: '¿Cuál es la frecuencia de la red eléctrica en Argentina?',
    correcta: '50 Hz',
    incorrectas: ['60 Hz', '220 Hz', '100 Hz'],
    explicacion: 'Se usan 50 Hz; en Estados Unidos, 60 Hz.',
    fuente: manual('2.19'),
  },
  {
    tema: 'corriente-alterna',
    enunciado: 'Los 220 V de un tomacorriente son el valor eficaz. ¿Cuál es el valor máximo?',
    correcta: '≈ 311 V',
    incorrectas: ['220 V', '380 V', '≈ 156 V'],
    explicacion: 'U máx = U eficaz · √2 = 220 · 1,414 ≈ 311 V.',
    fuente: manual('2.17'),
  },
  {
    tema: 'corriente-alterna',
    enunciado: 'En la red trifásica de baja tensión, ¿cuál es la tensión entre dos fases?',
    correcta: '380 V',
    incorrectas: ['220 V', '440 V', '660 V'],
    explicacion: 'Entre fase y neutro hay 220 V; entre fases, 220 · √3 ≈ 380 V.',
    fuente: manual('2.18'),
  },
  {
    tema: 'corriente-alterna',
    enunciado: '¿Qué consecuencia tiene un cos φ bajo?',
    correcta: 'Más corriente para la misma potencia activa',
    incorrectas: [
      'Menos corriente para la misma potencia',
      'Menos consumo de energía',
      'Mayor tensión en la red',
    ],
    explicacion:
      'I = P / (U · cos φ): si el cos φ baja, la corriente sube y los cables se cargan más.',
    fuente: manual('2.17'),
  },
  {
    tema: 'corriente-alterna',
    enunciado: '¿Cuánto dura un ciclo (período) de la red de 50 Hz?',
    correcta: '20 ms',
    incorrectas: ['50 ms', '2 ms', '1 s'],
    explicacion: 'T = 1 / f = 1 / 50 Hz = 0,02 s = 20 ms.',
    fuente: manual('2.17'),
  },

  // --- Potencia y energía ---
  {
    tema: 'potencia-energia',
    enunciado: '¿En qué unidad cobra la distribuidora la energía en la factura?',
    correcta: 'kWh (kilowatt hora)',
    incorrectas: ['kW (kilowatt)', 'A (ampere)', 'kVA (kilovoltampere)'],
    explicacion: 'Se cobra la energía consumida: potencia por tiempo.',
    fuente: manual('2.13'),
  },
  {
    tema: 'potencia-energia',
    enunciado: '¿A qué equivale 1 kWh?',
    correcta: 'Un aparato de 1000 W funcionando 1 hora',
    incorrectas: [
      'Un aparato de 1 W funcionando 1000 horas por día',
      'Un aparato de 1000 W funcionando 1 minuto',
      'Un aparato de 1 kW encendido',
    ],
    explicacion: 'También: 100 W durante 10 horas, o 2000 W durante media hora.',
    fuente: manual('2.13'),
  },
  {
    tema: 'potencia-energia',
    enunciado: '¿Por qué se calienta un empalme flojo?',
    correcta: 'Porque tiene más resistencia de contacto y aumenta el calor (efecto Joule)',
    incorrectas: [
      'Porque baja la tensión',
      'Porque circula menos corriente',
      'Porque aumenta la frecuencia',
    ],
    explicacion:
      'La potencia que se transforma en calor es P = I² · R: más resistencia, más calor.',
    fuente: manual('2.8 y 2.13'),
  },

  // --- Matemática ---
  {
    tema: 'matematica',
    enunciado: 'Si P = U · I, ¿cómo se despeja la corriente?',
    correcta: 'I = P / U',
    incorrectas: ['I = P · U', 'I = U / P', 'I = P − U'],
    explicacion: 'Lo que multiplica de un lado pasa dividiendo al otro.',
    fuente: manual('1.15'),
  },
  {
    tema: 'matematica',
    enunciado: '¿Cuántos ampere son 30 mA?',
    correcta: '0,03 A',
    incorrectas: ['0,3 A', '3 A', '30 000 A'],
    explicacion: 'mili = milésima: 30 / 1000 = 0,03 A.',
    fuente: manual('1.1'),
  },
  {
    tema: 'matematica',
    enunciado: '¿Cuántos watts son 2,5 kW?',
    correcta: '2500 W',
    incorrectas: ['250 W', '25 W', '0,0025 W'],
    explicacion: 'kilo = mil: 2,5 · 1000 = 2500 W.',
    fuente: manual('1.1'),
  },
  {
    tema: 'matematica',
    enunciado: '¿Cuánto vale √3, que aparece en todos los cálculos trifásicos?',
    correcta: '≈ 1,73',
    incorrectas: ['≈ 1,41', '≈ 3', '≈ 1,5'],
    explicacion: '√3 ≈ 1,732. La que vale ≈ 1,41 es √2 (pasa del valor eficaz al máximo).',
    fuente: manual('1.20'),
  },
  {
    tema: 'matematica',
    enunciado: '¿Cuánto es el 3 % de 220 V?',
    correcta: '6,6 V',
    incorrectas: ['66 V', '0,66 V', '3 V'],
    explicacion: '220 · 3 / 100 = 6,6 V. Es la caída de tensión máxima en circuitos terminales.',
    fuente: manual('1.21'),
  },
  {
    tema: 'conexionado',
    enunciado:
      '¿Desde qué largo un pasillo interior tiene que llevar llaves de combinación en cada extremo?',
    correcta: 'Más de 3 m',
    incorrectas: ['Más de 5 m', 'Más de 2 m', 'Nunca es obligatorio'],
    explicacion:
      'En pasillos interiores de más de 3 m se prevén interruptores de combinación en cada extremo, para prender y apagar desde las dos puntas.',
    fuente: aea('770.7.2'),
  },
  {
    tema: 'conexionado',
    enunciado: '¿Cuál es la sección mínima de los retornos de las llaves según la AEA 770?',
    correcta: '1 mm²',
    incorrectas: ['0,75 mm²', '2,5 mm²', '4 mm²'],
    explicacion:
      'La Tabla 770.11.I admite 1 mm² para alimentaciones y retornos de interruptores de efecto. Algunos apuntes basados en la AEA 771 piden 1,5 mm²; ante la duda, 1,5 mm² cumple las dos.',
    fuente: aea('Tabla 770.11.I'),
  },
  {
    tema: 'conexionado',
    enunciado:
      '¿Tiene que llegar el conductor de protección a una boca de techo que solo tiene una luz?',
    correcta: 'Sí: el PE recorre toda la instalación, también las bocas sin tomas',
    incorrectas: [
      'No: el PE solo va a los tomacorrientes',
      'Solo si la boca está en el baño',
      'Solo si el circuito es TUG',
    ],
    explicacion:
      'El PE recorre la instalación integralmente, incluyendo cajas y bocas sin tomacorrientes. Un artefacto metálico (clase I) conecta su masa a él; uno de doble aislación (clase II) no lo necesita, pero el PE igual tiene que estar en la caja.',
    fuente: aea('770.14.4.5'),
  },
  {
    tema: 'conexionado',
    enunciado: '¿Cuántos cables de menos de 4 mm² se pueden unir retorciendo sus hebras?',
    correcta: 'Hasta 4',
    incorrectas: ['Hasta 2', 'Hasta 6', 'Sin límite, si se cubren con cinta'],
    explicacion:
      'Hasta cuatro conductores se pueden unir intercalando y retorciendo las hebras; para más hace falta una bornera. La unión se cubre con aislante equivalente al del cable y no puede quedar tirante.',
    fuente: aea('770.10.3.8.3'),
  },
  {
    tema: 'conexionado',
    enunciado:
      'Se quiere un toma comandado por una llave a 0,30 m del piso (por ejemplo, para una lámpara de pie). ¿De qué circuito tiene que ser?',
    correcta: 'Del circuito de tomas (TUG)',
    incorrectas: [
      'Del circuito de iluminación (IUG)',
      'De cualquiera de los dos',
      'De un circuito de uso especial (TUE)',
    ],
    explicacion:
      'No se permiten tomas del circuito de iluminación a menos de 0,90 m del piso. Si un toma comandado va más abajo, pertenece al circuito de tomas, y su llave no puede compartir la caja con llaves del circuito de iluminación.',
    fuente: aea('770.7.1 m)'),
  },
  {
    tema: 'conexionado',
    enunciado: '¿Qué se verifica en todos los tomacorrientes en la inspección inicial?',
    correcta: 'Que tengan el PE conectado y cada conductor en su borne',
    incorrectas: [
      'Solo que tengan tensión',
      'Que estén a 1,20 m del piso',
      'Que sean todos del mismo circuito',
    ],
    explicacion:
      'La inspección visual pide comprobar en todos los tomas la conexión del conductor de protección a su borne de tierra y la correcta ubicación de la fase, el neutro y la protección.',
    fuente: aea('770.19.3.1'),
  },
]

export function generarConceptos(tema?: string): Omit<Ejercicio, 'id'> {
  const banco = tema ? PREGUNTAS.filter((p) => p.tema === tema) : PREGUNTAS
  const pregunta = elegir(banco.length ? banco : PREGUNTAS)

  return {
    tipo: 'conceptos',
    tema: pregunta.tema,
    enunciado: pregunta.enunciado,
    datos: [],
    respuesta: { clase: 'opcion', valor: pregunta.correcta },
    opciones: mezclar([pregunta.correcta, ...pregunta.incorrectas]),
    pasos: [pregunta.explicacion],
    fuentes: [pregunta.fuente],
  }
}
