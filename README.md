# Electricista Cat. III

Guía y juego de práctica para el curso de **Electricista Habilitado Categoría III** (UTN FRC, Córdoba), según la Ley 10281 de Seguridad Eléctrica y la reglamentación **AEA 90364-7-770:2017**.

Es una web pensada para el celular: se estudia un tema en la guía y se practica con ejercicios que corrigen al instante y citan la norma.

## Qué tiene

- **Guía** en bloques: Fundamentos, Instalación domiciliaria y Cálculos. Tiene tablas, simuladores interactivos y una práctica corta al final de cada tema. Cada cita lleva un enlace al PDF de la norma, abierto en la página citada.
- **Práctica** con partidas guardadas en el navegador:
  - **Modo práctica:** corrección al instante, con los pasos y un atajo de cálculo mental.
  - **Modo examen:** rondas de 10 ejercicios con tiempo y corrección al final.
  - **Formato de respuesta:** cálculo mental (±5 %), con calculadora (±1 %) u opción múltiple.
  - **Ejercicios:** cuentas rápidas, ley de Ohm, energía, preguntas de teoría, corriente desde la potencia, sección y protección, caída de tensión, grado y DPMS, y división de circuitos y tablero. Se repasa más lo que más se erra y se evita repetir los últimos ejercicios.
- **Armá el tablero:** se eligen y ordenan las protecciones del tablero principal de una vivienda y los colores de los cables, y se verifica contra la norma con cada error citado.
- **Circuitos en el plano:** se ubican bocas de techo, llaves y tomas en la planta de una casa, con los símbolos del curso, y se trazan los circuitos desde el tablero. Se verifican los puntos mínimos de cada ambiente y los circuitos (tipo, 15 bocas, mínimos del grado, luces con su llave). Con los circuitos trazados se arma el tablero de esa casa, y en el modo Probar se accionan las llaves y las protecciones del tablero. Además de la casa tipo, se pueden generar casas al azar, chicas, grandes o con pasillo.
- **Conexionado:** se conectan cable por cable una luz con su llave, un tomacorriente y una luz con combinación, eligiendo el color de cada cable. Se prueba en vivo y la verificación detecta cortos, fugas, llave en el neutro, falta de PE y colores fuera de norma.
- **Modo oscuro.**

## Cómo correrlo

Hace falta [Node.js](https://nodejs.org) 20.19 o superior (o 22.12+), que es lo que pide Vite.

```sh
npm install
npm run dev
```

Abrí la dirección que muestra la consola (por defecto http://localhost:5173). Para verla desde el celular en la misma red: `npm run dev -- --host`.

| Comando                | Qué hace                                 |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                   |
| `npm run build`        | Compila para producción en `dist/`       |
| `npm run preview`      | Sirve lo compilado para probarlo         |
| `npm run lint`         | Revisa el código con ESLint              |
| `npm run format`       | Formatea con Prettier                    |
| `npm run format:check` | Verifica el formato sin cambiar archivos |

> **WSL:** si el proyecto está en el disco de Windows (`/mnt/c/...`), los cambios de archivos no le llegan a Vite por eventos. Por eso `vite.config.ts` usa _polling_.

## Tecnologías

React 19, TypeScript, Vite, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com), [React Flow](https://reactflow.dev) (plano interactivo), Zustand (estado y guardado local), TanStack Router (rutas por archivos) y MDX (contenido de la guía). ESLint y Prettier para el código.

## Estructura

```
src/
  dominio/            Normativa, cálculos y generadores de ejercicios (sin React)
    normativa.ts      Valores de la AEA 770, cada uno con su fuente
    referencias.ts    Documentos citados y página del PDF de cada cláusula
    ejercicios/       Un generador por tipo de ejercicio
  guia/
    temas.ts          Índice de la guía (bloques, temas y unidades UTN)
    contenido/        Un archivo .mdx por tema
  components/         guia/ (tablas, simuladores, avisos), juego/ y ui/ (shadcn)
  routes/             Páginas (TanStack Router)
  store/              Partidas, ronda en juego y tema claro/oscuro
docs/
  normativa.md        Relevamiento de la normativa, con fuentes
  decisiones.md       Decisiones del proyecto y pendientes
  imagenes-libres.md  Fotos de uso libre y símbolos para más adelante
```

### Agregar contenido

- **Un tema de la guía:** crear `src/guia/contenido/<id>.mdx` con el mismo `id` que figura en `src/guia/temas.ts`. Mientras el archivo no existe, el índice lo muestra como «Próximamente».
- **Una pregunta de teoría:** agregarla a `PREGUNTAS` en `src/dominio/ejercicios/conceptos.ts`, con el `tema` y la fuente.
- **Una cita:** usar `<Ref aea="770.15.6" />` en el MDX o `aea('770.15.6')` en el código. Si la cláusula es nueva, agregar su página en `PAGINAS_AEA770` (`src/dominio/referencias.ts`).

## Fuentes

- [AEA 90364-7-770:2017](https://www.junin.gob.ar/sites/default/files/programas/archivos/reglamento_aea.pdf) (copia publicada por la Municipalidad de Junín).
- [Programa del curso Cat. III, UTN FRC 2025](https://portalseu.frc.utn.edu.ar/wp-content/uploads/2024/02/Programa-Curso-Electricista-Habilitado-Cat-III-UTN-2025.pdf).
- [Carpeta Técnica Modelo del ERSeP](https://ersep.cba.gov.ar/wp-content/uploads/2022/05/Carpeta_Tecnica_Modelo.pdf).
- Manual del Instalador Electricista Cat. III (ERSeP, 2.ª ed.), sin copia pública online.

El detalle está en [`docs/normativa.md`](docs/normativa.md).

> **Aviso:** es material de estudio. No reemplaza a la reglamentación vigente ni al material oficial del curso. Ante cualquier diferencia, vale la norma.
