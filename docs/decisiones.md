# Decisiones del proyecto

## Stack

- Solo front: React + Vite + TypeScript + Tailwind v4 + Zustand. Se usa npm.
- ESLint + Prettier. TypeScript fijado en 6.0 porque `typescript-eslint` no soporta TS 7.
- shadcn/ui para los componentes comunes (botones, diálogos, pestañas, avisos). Se agregan con `npx shadcn add`.
- TanStack Router con rutas basadas en archivos (plugin de Vite).
- Idioma: solo español de Argentina.
- Tests: no por ahora.
- Cuando algo se pueda generar con un comando o CLI, se usa el comando.

## Pendiente de decidir

- **PWA** (instalable y sin conexión): no por ahora. Se vuelve a evaluar al cerrar el MVP (`vite-plugin-pwa`).
- Gráficos: símbolos de plano y dibujos de protecciones reales, más adelante.
  - **Imágenes reales:** 35 fotos de uso libre de Wikimedia Commons, con licencia y atribución, en `docs/imagenes-libres.md`. Falta decidir si se descargan al proyecto o se enlazan.
  - **Símbolos en SVG:** [Xaival/Simbologia-Electrica](https://github.com/Xaival/Simbologia-Electrica) ([vista HTML](https://xaival.github.io/Simbologia-Electrica)). Tiene 461 SVG: 118 de unifilar, 292 de multifilar y 51 sueltos.
    - **No tiene licencia** (sin archivo LICENSE ni mención en el README): se puede enlazar como referencia, pero no copiar sus SVG a la app sin pedirle permiso al autor.
    - **Simbología de España** (REBT: "PIA unipolar", "ICP", "Cuadro general de mando y protección"). Antes de usarlo hay que comparar cada símbolo con la simbología argentina (IRAM / AEA y el plano de la carpeta ERSeP).

## Pendientes (para hacer)

- **Ejercicios que se repiten: resuelto.**
  - `generarEjercicio` recuerda los últimos 12 ejercicios y prueba hasta 20 veces para no repetirlos. Si el banco es chico (un tema con 6 preguntas), devuelve el que salió hace más tiempo.
  - En `grado`, «circuitos mínimos» y «grado» (pocas respuestas posibles) salen con menos peso.
  - Tipo nuevo **«Cuentas rápidas»** (`cuentas`): ÷ y × 220, factores 0,8 y 0,7, porcentajes, √3, unidades (W/kW, mA/A) y despejes, cada uno con su atajo de cálculo mental. Está en el modo práctica y al final de Matemática aplicada. Las partidas existentes lo reciben activado (migración v2 del store).

## Normativa

- Los cálculos usan la **AEA 90364-7-770:2017**. Es la vigente para viviendas y la que usa la carpeta modelo del ERSeP.
- Donde el manual del curso (basado en la AEA 771:2006) da otro valor, el juego muestra una nota con la diferencia.
- Las reglas se guardan como datos con su fuente (norma y cláusula). Investigación completa en `docs/normativa.md`.

## Juego

- **MVP: Cálculo rápido.** Tipos de ejercicio:
  - corriente desde potencia (monofásica y trifásica);
  - sección del conductor y protección (Iz con factores de corrección; Ib ≤ In ≤ Iz);
  - caída de tensión;
  - grado de electrificación y demanda (superficie límite → grado → circuitos mínimos → DPMS).
- **Formato de respuesta configurable:** cálculo mental con tolerancia, calculadora en pantalla u opción múltiple.
- **Corrección configurable:**
  - Práctica: sin reloj y con corrección al instante, citando la norma.
  - Examen: rondas de 10 ejercicios con tiempo y corrección al final.
- **Progreso:** se guarda en el navegador. Hay **varias partidas** (por ejemplo "repaso examen" y "práctica libre"), y se puede empezar de cero.
- **Armá el tablero** (`/tablero`): primera versión hecha. Se arma el tablero principal de una vivienda generada al azar (la misma de los ejercicios de división): se agregan cabecera, diferencial y PIA al riel, se ordenan arrastrando (dnd-kit, funciona con el dedo) y se elige polos, calibre, curva, sensibilidad y circuito de cada uno; después, los colores de fase, neutro, PE y retorno. La verificación (`src/dominio/tablero.ts`, sin React) devuelve errores y avisos con su cita: orden, bipolar, Ib ≤ In ≤ Iz (cabecera contra la línea principal y PIA contra la sección), tope por tipo de circuito, 30 mA, diferencial protegido contra sobrecarga, un PIA por circuito y colores.
  - Pendiente: guardar resultados en la partida, casos con TPA (tablero que arranca con el diferencial), varios diferenciales por grupo de circuitos, DPS y tableros seccionales.
- **Circuitos en el plano en planta** (modo nuevo, diseñado, sin empezar). Idea tomada de un plano del material del curso: vivienda con sala, patio, cocina, baño y dormitorio; circuito de iluminación en línea punteada roja (llaves → bocas de techo), circuito de tomas en línea llena azul, y C1/C2 saliendo del tablero.
  - **Qué hace el usuario: ubicar y conectar.** El plano viene con paredes, puertas y ambientes. El usuario pone bocas de techo, llaves y tomas en cada ambiente y después traza cada circuito desde el tablero.
  - **Qué se corrige:** puntos mínimos por ambiente (Tabla 770.7.III, la misma lógica de los ejercicios de división), máximo 15 bocas por circuito, luz y tomas en circuitos separados, cada boca de luz comandada por una llave del mismo ambiente, tomas en las paredes y luces en el techo, y que todos los circuitos salgan del tablero.
  - **Planos:** dibujados por nosotros en SVG (algunas plantas típicas). Más adelante, un **generador** para practicar algo específico (por ejemplo, solo cocinas o solo pasillos con combinación).
  - **Símbolos:** los del plano del curso son la referencia argentina: boca de techo (círculo con cruz), llave (círculo chico junto a la puerta), tomacorriente (símbolo con dos rayitas sobre la pared) y tablero (rectángulo con una X). Se redibujan como SVG propios. La imagen del curso no se sube al repo.
  - **Tecnología:** React Flow encaja acá: cada elemento es un nodo con su borne, los circuitos son conexiones y el plano va de fondo. Es la misma base que después usa el simulador (accionar la llave y ver si la lámpara prende).
  - **Etapas propuestas:**
    1. Símbolos SVG propios, una planta dibujada y ubicar elementos con corrección de puntos mínimos.
    2. Trazar los circuitos y corregirlos; los circuitos trazados pasan a «Armá el tablero».
    3. Simulador sobre el mismo plano (llaves, lámparas, combinación).
    4. Generador de plantas para práctica dirigida.
- **Después:** obra completa, inspector y lectura de planos.
- **Simulación de estados:** llaves encendidas o apagadas, lámpara que prende solo si la instalación está bien, borne sin conectar. Es un modelo propio de bornes y conexiones (TS + Zustand + SVG); no viene en ninguna librería.
  - **Propuesta (sugerida por Gemini):** Falstad para simular, React Flow para símbolos y nodos conectables, y `strokeDasharray` para mostrar la corriente alterna en el SVG. Evaluación:
    - **React Flow** ([`@xyflow/react`](https://reactflow.dev), MIT): **sí**. Da nodos propios (cada símbolo es un componente con sus bornes como _handles_), cables arrastrables, zoom y soporte táctil. Nos ahorra todo el manejo de arrastre y conexiones.
    - **Falstad** ([CircuitJS](https://github.com/pfalstad/circuitjs1)): **no como motor**. Es Java compilado a JS con GWT, sin API para React, y tiene licencia GPL-2.0 (si lo empaquetamos, toda la app pasa a ser GPL). Simula electrónica analógica, que es más de lo que hace falta: para saber si la lámpara prende alcanza con recorrer el grafo de conexiones desde la fase hasta el neutro pasando por llaves cerradas, y detectar cortocircuitos (fase con neutro sin carga) y bornes sueltos. Se puede enlazar o embeber en un iframe como «laboratorio libre» aparte.
    - **`strokeDasharray` animado:** **sí**, para marcar qué cables están con tensión. React Flow ya lo trae (`animated` en los _edges_). Como 50 Hz no se ve, la animación es simbólica: conviene que el trazo vaya y vuelva (alterna) en lugar de correr en un solo sentido, y explicarlo en la guía.
  - **Reemplazo de Falstad: simulador propio en tres niveles.** Sin dependencias pesadas; cada nivel se agrega cuando un ejercicio lo necesite.
    1. **Conectividad** (para el MVP de circuitos): grafo de bornes y cables (cables de React Flow + conexiones internas de cada componente según su estado), resuelto con _union-find_. Detecta: lámpara que prende (un borne a fase y otro a neutro), cortocircuito, llave que corta el neutro en lugar de la fase, borne suelto, masa sin PE y color de cable incorrecto.
    2. **Régimen permanente con fasores** (análisis nodal, MNA): matriz de admitancias complejas resuelta con [math.js](https://mathjs.org) (Apache-2.0, `lusolve` y números complejos). Las cargas son impedancias que salen de P y cos φ. Sirve también para **trifásico**: tres fuentes de 220 V desfasadas 120° contra el neutro. Permite mostrar la corriente de neutro con cargas desequilibradas y el **corte de neutro** (sobretensión en las fases poco cargadas), la corriente en la pinza, la caída en un cable largo y la fuga que dispara el diferencial. **Motores y heladeras** en marcha: impedancia equivalente a partir de P, cos φ y rendimiento.
    3. **Reglas para lo que no es régimen permanente:** el **arranque** de motores y compresores se modela como otra impedancia (rotor bloqueado: varias veces In, cos φ bajo) y se compara con el umbral magnético de la curva B/C/D. El **disparo térmico** se resuelve con la tabla I/In → tiempo de la curva, no simulando en el tiempo. Quedan afuera los transitorios reales, los armónicos (equipos inverter) y la saturación: no hacen falta para Cat. III.
  - **Los ejercicios de cálculo siguen usando las fórmulas** de `src/dominio/calculos.ts`: el simulador es para los modos visuales, no los reemplaza. Lo que se calcule en los dos lados (por ejemplo la corriente de un motor trifásico) tiene que dar lo mismo, y conviene verificarlo con un test cuando se agreguen tests.
- Herramientas de desarrollo: Zustand devtools. Evaluar un panel de depuración propio para forzar escenarios.

## Guía

- La app es también una **guía de estudio**, además del entrenamiento. El inicio tiene dos entradas: Guía (`/guia`) y Práctica (`/practica`).
- **Contenido en MDX** (`src/guia/contenido/<tema>.mdx`), con Tailwind Typography para el estilo y `remark-gfm` para las tablas.
  - Un tema aparece disponible cuando existe su `.mdx`. El índice está en `src/guia/temas.ts`.
  - Dentro de un `<Aviso>`, las listas tienen que ir con una línea en blanco antes y después; si no, Prettier las convierte en un solo párrafo.
- **Índice por tema práctico**, en el orden de una obra, con la unidad UTN correspondiente en cada tema. Hay un bloque de **Fundamentos** para quien no tiene base.
  - Bloques: Fundamentos · Instalación domiciliaria · Cálculos · Planos y documentación · Profesional (ERSeP) · Complementarios.
- **Lo escribe Claude y el usuario revisa** que coincida con lo que se enseña en el curso.
- **Componentes para usar en el MDX:**
  - `Aviso` (nota, atajo, cuidado, norma) y `Formula`;
  - tablas generadas desde `dominio/normativa.ts`, para que la guía y los ejercicios usen los mismos valores;
  - simuladores interactivos;
  - `PracticaTema` (mini práctica que no guarda estadísticas).
- La corrección de los ejercicios tiene el link "Repasar en la guía".
- **Primer bloque escrito:** Cálculos (corriente, sección y protección, caída de tensión, grado y DPMS).
- **Segundo bloque escrito:** Fundamentos (matemática, electricidad básica, potencia y energía, corriente alterna, seguridad, mediciones). Tiene simuladores de Ohm, serie/paralelo, energía, corriente por el cuerpo y la onda de 50 Hz.
- **Tercer bloque, en curso:** Instalación domiciliaria. Escritos: conductores y colores, canalizaciones, circuitos, protecciones, tableros y puesta a tierra, cada uno con 6 a 8 preguntas de práctica. Faltan **conexionado** (depende de esquemas dibujados: conviene hacerlo con el simulador o con SVG propios) y **locales especiales** (las zonas del baño están en la AEA 90364-7-701, que no tenemos relevada).
- **Modo oscuro:** botón sol/luna arriba a la derecha. Arranca según la preferencia del sistema y recuerda la elección (`src/store/tema.ts`).
- **Tipos de ejercicio nuevos:** `ohm`, `energia` y `conceptos`.
- **División de circuitos y tablero** (`division`): parte de una vivienda generada al azar (chica, mediana o grande, para que salgan los grados mínimo, medio y elevado). Pregunta las bocas mínimas de luz y de tomas (Tabla 770.7.III), qué división en circuitos cumple la norma (15 bocas por circuito, mínimos del grado, TUE para aires u horno), el calibre de la cabecera a partir de la DPMS y la composición del tablero principal (orden, 30 mA, diferencial ≥ cabecera, PIA bipolares). Está en el modo práctica y al final de Circuitos y de Tableros.
  - Simplificaciones: los módulos de la cocina para artefactos fijos no se cuentan como bocas; los diferenciales se eligen entre 25, 40 y 63 A (habituales en el mercado, sin verificar en la norma); no hay viviendas de grado superior.
  - `conceptos` es un banco de preguntas de opción múltiple en `dominio/ejercicios/conceptos.ts`. Cada pregunta tiene su tema, explicación y fuente, y se filtra por tema en la guía.
  - Las partidas creadas antes de este cambio no los incluyen: hay que activarlos en la configuración de la partida.

## Referencias

- **Toda cita lleva un enlace a un PDF público abierto en la página citada** (`url#page=N`), si existe. El registro central está en `src/dominio/referencias.ts`.
  - **AEA 770:** copia de la Municipalidad de Junín. La página de cada cláusula está en `PAGINAS_AEA770`; hay que agregarla al citar una cláusula nueva.
  - **Programa UTN:** página por unidad.
  - **Carpeta ERSeP:** enlace sin página, porque el sitio bloquea la descarga automática y no se pudo relevar.
  - **Manual del ERSeP:** no tiene copia pública, así que se cita como texto, sin enlace.
- En los MDX se usa `<Ref aea="770.15.6" />`, `<Ref manual="2.19" />`, `<Ref utn={6} />` o `<Ref carpeta />`. `<Formula aea="...">` pone la cita al pie.
