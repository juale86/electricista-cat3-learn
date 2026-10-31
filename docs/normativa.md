# Normativa eléctrica para viviendas y locales chicos (Argentina / Córdoba)

**Para qué es esto:** el contenido sale de acá y va al juego/app educativa que practica las decisiones de un **Instalador Electricista Habilitado Categoría III** (curso UTN FRC, Ley 10281 de Córdoba).
**Fecha de relevamiento:** 30/10/2026.

## Cómo leer las marcas de verificación

| Marca            | Significado                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[P]**          | Lo confirmé leyendo el **texto primario** (resolución ERSeP, texto de la AEA 90364-7-770 Ed. 2017, carpeta modelo del ERSeP o programa oficial UTN/ERSeP). |
| **[P-borrador]** | Lo leí en el **borrador de discusión pública 2016** de la 770 y no lo pude cotejar con la edición 2017.                                                    |
| **[S]**          | Viene de una **fuente secundaria confiable** (apuntes de cátedra UTN/UNLP, artículos de Editores/AEA).                                                     |
| **[NV]**         | Es **conocimiento general del oficio que no verifiqué** en una fuente. Hay que confirmarlo antes de ponerlo como pregunta "dura" en el juego.              |

> **Aviso clave para el diseño del juego:** en Córdoba conviven **dos marcos de referencia**:
>
> 1. **AEA 90364-7-770 Ed. 2017** (viviendas unifamiliares de hasta 63 A). Es la que aplica la carpeta técnica modelo del ERSeP para una vivienda chica nueva.
> 2. **AEA 90364-7-771 Ed. 2006** (viviendas, oficinas y locales unitarios). Es la que cita la bibliografía del curso UTN junto con la "Guía AEA hasta 10 kW (2011)", y aplica a locales comerciales/industriales chicos.
>
> Hay valores que **difieren** entre las dos (cantidad de bocas por circuito TUE/IUE, coeficientes de simultaneidad, criterio para el grado de electrificación). El juego tendría que fijar en cada escenario **qué sección rige**. Mi recomendación: usar la 770 para vivienda unifamiliar y la 771 para local/oficina.

---

## 1. Marco legal

### 1.1 Reglamentación AEA 90364 (nacional, técnica)

| Documento                                                        | Alcance                                                                                                                                                                                                              | Estado                                                                                                                                                                         | Verif.                                            |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| AEA 90364 Partes 0 a 6 (2006)                                    | Reglas generales para instalaciones en inmuebles hasta 1000 V CA / 1500 V CC. Se basa en IEC 60364.                                                                                                                  | Vigente                                                                                                                                                                        | [S] Editores 2024                                 |
| **AEA 90364-7-770 Ed. 2017**                                     | **Viviendas unifamiliares** que cumplan **a la vez**: interruptor de cabecera del TP **≤ 63 A**; **Icc presunta en el origen ≤ 10 kA**; usuarios **BA2** (presencia de niños) y evacuación **BD1** (cláusula 770.1). | Vigente desde el 01/09/2017                                                                                                                                                    | [P] texto 2017                                    |
| AEA 90364-7-771 Ed. 2006                                         | Viviendas, oficinas y locales unitarios. Se usa para lo que excede a la 770: más de 63 A, oficinas, locales, BA3-BA5, BD2-BD4. La 770 remite a la 771 para circuitos de uso específico.                              | Vigente desde ago-2006                                                                                                                                                         | [P] cita en la 770 / [S]                          |
| AEA 90364-7-701                                                  | Baños, duchas, bañeras. La 770 remite acá para baños, cocinas y lavaderos.                                                                                                                                           | Vigente                                                                                                                                                                        | [P] cita en la 770                                |
| AEA 90364-7-722                                                  | Carga de vehículos eléctricos (contenido del curso Cat. III).                                                                                                                                                        | Vigente                                                                                                                                                                        | [P] RG ERSeP 17/2021                              |
| AEA 95150                                                        | Acometidas, suministro y medición en BT. La 770 no cubre la línea de alimentación.                                                                                                                                   | Vigente                                                                                                                                                                        | [P] 770.1                                         |
| AEA 92305                                                        | Protección contra rayos. Mapas ceráunicos (parte 11) para decidir el DPS.                                                                                                                                            | Vigente                                                                                                                                                                        | [P] 770.15.4                                      |
| Guía AEA "Instalación eléctrica en inmuebles hasta 10 kW" (2011) | Es la que usa el TP del curso UTN: superficie límite, grado de electrificación, puntos mínimos, circuitos, DPMS y PAT.                                                                                               | **No conseguí el texto.** La carpeta modelo del ERSeP la cita como "Guía AEA 770 10 kW" y usa la numeración de tablas de la 770 (770.7.I, 770.8.I, 770.8.II, 770.10.VII a IX). | [P] programa UTN y carpeta ERSeP / contenido [NV] |

**Proyecto obligatorio (770.2.1) [P]:** la instalación se ejecuta con un proyecto previo (planos + memoria técnica) firmado por un profesional matriculado o registrado con incumbencias.
**Fiscalización (770.2.2) [P]:** hay que pedirla como mínimo en dos momentos: (a) antes de tapar las canalizaciones y (b) antes de la puesta en servicio.

### 1.2 Higiene y Seguridad (Ley 19587 / Dec. 351/79)

- **Dec. 351/79, Anexo VI, Cap. 14, ítem 3.1 [S]:** manda cumplir la reglamentación de la AEA (la ex "Asociación Argentina de Electrotécnicos") en los ámbitos laborales. Fuente: artículo de Manili y García del Corro (AEA) en Editores.
- **Otros decretos que remiten a la AEA [S]:** Dec. 911/96 (construcción, art. 86), Dec. 617/97 (agro, arts. 18-19) y Dec. 249/07 (minería, art. 99).
- **Res. SRT 900/2015 [S]:** hace obligatorio en los ámbitos laborales el **protocolo de medición de puesta a tierra y continuidad de masas** y la verificación de la coordinación con el corte automático. Se apoya en AEA 90364 Parte 6. La periodicidad (habitualmente anual) es **[NV]**.
- La RG ERSeP 17/2021 incluye la Ley 19587 en el programa de Cat. III (módulos I-V) **[P]**.

### 1.3 ENRE Res. 207/95

- **Rige en el área de concesión del ENRE** (Edenor/Edesur, AMBA). Hizo obligatoria la AEA 90364 para las conexiones en esa área **[S]**. Una presentación de la UTN FRSC la da como **"reemplazada por la Res. ENRE 269/12"** **[S]**, cosa que no pude confirmar en el Boletín Oficial.
- **No es la norma aplicable en Córdoba.** Acá la autoridad de aplicación es el **ERSeP** (Ley 10281). Sirve como **pregunta trampa**.
- La 770 toma como referencia una temperatura ambiente de 40 °C, "la de la zona de concesión del ENRE" (770.12.2.1.1). Para otras regiones remite a IRAM 11603 o a la autoridad local **[P]**.

### 1.4 Córdoba: Ley 10281 de Seguridad Eléctrica (2015) y su reglamentación

| Norma                                         | Qué establece                                                                                                                                                                                                                                                                                                                                                                        | Verif.                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Ley 10281**                                 | Art. 1 inc. c: crea la figura del Instalador Electricista Habilitado. Art. 3: **el ERSeP es la autoridad de aplicación**. Art. 4: Registro de Instaladores. Arts. 5-6: el instalador emite el **Certificado de Instalación Eléctrica Apta**. Art. 7: alumbrado público y señalización. Art. 9: reclamos. Art. 10: régimen de sanciones.                                              | [P] tal como lo citan las RG ERSeP 5/2016, 43/2017 y 109/2023 |
| **Dec. 1022/2015** (reglamentario)            | Su Anexo Único define **3 categorías**: I y II son matriculados en colegios, según su título; **III son "idóneos con capacitación relacionada a la especialidad eléctrica"**. Art. 6 del Anexo: todo lo que se certifique tiene que tener **descripción, croquis y detalle de materiales**.                                                                                          | [P] según las RG ERSeP 17/2021 y 2026/041                     |
| RG ERSeP **26/2015** (30/11/2015)             | Crea el Registro (Anexo I) y aprueba los contenidos curriculares de la capacitación y el examen de Cat. III (Anexo II).                                                                                                                                                                                                                                                              | [P] según los considerandos de la RG 5/2016                   |
| RG ERSeP **5/2016** (17/02/2016)              | Art. 1: la reglamentación técnica aplicable es **la AEA vigente según el tipo de instalación**. **Arts. 2 y 3: alcance de la Cat. III y modelos de certificado** (ver 1.5). Art. 6: también se exige certificado ante **cambio de tarifa o aumento de potencia**. Art. 7 (Anexo IV): procedimiento web de administración de certificados. Art. 8 (Anexo V): régimen de infracciones. | [P]                                                           |
| RG ERSeP 49/2016 y **43/2017**                | Registro en 2 partes (Cat. I-II / Cat. III). Hace falta **CiDi nivel 2**. Art. 12: el carnet dice que "solo acredita idoneidad técnica". **Art. 14: la habilitación de Cat. III dura 3 años y hay que renovarla.**                                                                                                                                                                   | [P]                                                           |
| RG ERSeP **46/2017**                          | **El certificado es exigible desde el 01/12/2017** para todo servicio eléctrico. Los inmuebles y locales **de acceso público ya existentes** tenían **2 años** para adecuarse.                                                                                                                                                                                                       | [P]                                                           |
| RG ERSeP 50/2017 (modif. por **RG 109/2023**) | Las Cat. I y II **corresponden solo al grado del título** y no implican jerarquía de tensión o potencia. **Alumbrado público y señalización: solo ingenieros** de 8 especialidades (art. 4 bis). La RG 50/2017 también fija el **fp mínimo de 0,85** para declarar los kW.                                                                                                           | [P] RG 109/2023; el fp, según la carpeta ERSeP                |
| RG ERSeP 11/2018 y 84/2018                    | Punto de conexión y medición (acometida) en **doble aislación**. Remite a la **ET21** de la distribuidora.                                                                                                                                                                                                                                                                           | [P] citadas en la carpeta y en la RG 17/2021 / contenido [NV] |
| RG ERSeP 54/2018                              | Encuadre de las **instalaciones existentes** (relevamiento).                                                                                                                                                                                                                                                                                                                         | [P] citada en la carpeta / contenido [NV]                     |
| RG ERSeP **17/2021** Anexo II                 | Programa de capacitación de Cat. III: **200 h, 7 módulos** (incluye generación distribuida —Ley 27424 y Ley provincial 10604— y vehículo eléctrico AEA 722). Para materiales normalizados cita las Res. MP-SC **169/2018 y 338/2018**.                                                                                                                                               | [P]                                                           |

**Contradicción con lo que me pasaron:** el coordinador me indicó que la **RG 26/2015** fija los alcances de la Cat. III y el contenido del certificado. En los textos que leí, **el alcance (10 kW) y los modelos de certificado están en la RG 5/2016**, arts. 2 y 3 y Anexos II-III. La RG 26/2015 crea el Registro y el programa de capacitación. Puede que la RG 26/2015 también lo mencione, pero **no tengo su texto**.

### 1.5 Qué puede certificar un Cat. III [P]

Según la **RG ERSeP 5/2016, arts. 2-3**, y la **RG 17/2021, Anexo II, "Propósito/Alcance"**:

| Condición    | Valor                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Destino      | **Viviendas unifamiliares** y **pequeñas instalaciones comerciales o industriales**                                                                                                                                    |
| Tensión      | **Solo baja tensión**                                                                                                                                                                                                  |
| Potencia     | **Máximo 10 kW** de potencia simultánea máxima (DPMS)                                                                                                                                                                  |
| Tipo de obra | Instalaciones nuevas, modificaciones o ampliaciones (Anexo II); instalaciones existentes (Anexo III); usuarios con generación propia vinculada a la red; instalaciones provisorias o de uso circunstancial (Anexo III) |
| No puede     | Alumbrado público y señalización (solo ingenieros, RG 109/2023). Más de 10 kW. Media tensión. Multifamiliares o edificios fuera del alcance [NV sobre los multifamiliares].                                            |
| Cat. I / II  | Lo que fijen las incumbencias del título. El colegio emite una **constancia** (RG 5/2016, art. 4).                                                                                                                     |

### 1.6 EPEC (distribuidora)

- La 770 dice que **la distribuidora** define la línea de alimentación, el pilar, la caja de medidor, la PAT de servicio y la línea principal (Tabla 770.15.I). El instalador se hace cargo **desde el interruptor principal** en adelante **[P]**.
- **ET21 (EPEC):** fija el punto de conexión y medición. **No conseguí el documento.** Según la carpeta ERSeP, el **TPA (tablero de protección de acometida)** pide IP43 mínimo, va en doble aislación, **no lleva jabalina** y usa caño de bajada **IRAM 2477** de doble aislación **[P] carpeta / [NV] la ET21 en sí**.
- El curso incluye "la factura de EPEC" y el "Reglamento de Comercialización de EPEC" **[P] programa UTN y RG 17/2021**.
- **Cuándo conviene trifásico (770.8.3.3) [P]:** se recomienda pedir suministro trifásico si la carga total supera **7 kVA o 32 A** en monofásico. El umbral obligatorio lo define la distribuidora (el de EPEC es [NV]).

---

## 2. Grados de electrificación

### 2.1 Superficie límite de aplicación [P] (770.7.3)

`S_lim = S_cubierta + 0,5 × S_semicubierta`

### 2.2 Grado según superficie: AEA 770-2017, Tabla 770.7.I [P]

| grado    | sup_desde_m2 (exclusivo) | sup_hasta_m2 (inclusivo) | circuitos_min | variantes (IUG/TUG/libre) | coef_simultaneidad (Tabla 770.8.II) |
| -------- | ------------------------ | ------------------------ | ------------- | ------------------------- | ----------------------------------- |
| minimo   | 0                        | 60                       | 2             | 1/1/0                     | 1,0                                 |
| medio    | 60                       | 130                      | 3             | 2/1/0 o 1/2/0             | 0,8                                 |
| elevado  | 130                      | 200                      | 5             | 2/3/0 o 3/2/0             | 0,7                                 |
| superior | 200                      | ∞                        | 6             | 2/3/1 o 3/2/1             | 0,6                                 |

- **770.7.4 [P]:** los circuitos mínimos de la 770 son **solo de uso general (IUG/TUG)**. En el grado superior el 6º circuito es "de libre elección".
- **Tabla 770.8.II [P]:** el coeficiente de simultaneidad se indexa por **"cantidad mínima de circuitos"** (2, 3, 5 o 6), no por la cantidad real. La carpeta ERSeP, con 4 circuitos en grado medio, aplicó 0,8.
- **Nota 1 de 770.7.5 [P]:** si una vivienda de menos de 130 m² tiene un dormitorio de más de 36 m², los puntos mínimos se toman del grado **elevado**.

### 2.3 AEA 771-2006 (locales, oficinas y viviendas fuera de la 770)

- La 771 define el grado **por superficie y lo verifica por demanda**. Si la DPMS calculada supera el límite del grado, se sube de grado. Si el coeficiente da un grado menor, **se mantiene el de la superficie** **[S]** (UTN FRRO, "Proyecto de instalaciones eléctricas v3").
- Límites de DPMS por grado en viviendas, según la 771:

| grado    | superficie | DPMS máx. | Verif.                                   |
| -------- | ---------- | --------- | ---------------------------------------- |
| mínimo   | ≤ 60 m²    | 3,7 kVA   | [S] (el ejemplo de la FRRO usa 3,70 kVA) |
| medio    | 60-130 m²  | 7 kVA     | [NV]                                     |
| elevado  | 130-200 m² | 11 kVA    | [NV]                                     |
| superior | > 200 m²   | > 11 kVA  | [NV]                                     |

- Circuitos mínimos de la 771 en vivienda **[NV]**: mínimo 2 (IUG + TUG); medio 3 (IUG + TUG + **TUE**); elevado 5 (2 IUG + 2 TUG + 1 TUE); superior 6 (2 IUG + 2 TUG + 2 TUE) más circuitos de libre elección. **Ojo: la 771 incluye TUE en los mínimos y la 770 no.**
- Para **oficinas y locales** la 771 tiene tablas propias de grado y puntos mínimos que **no pude conseguir [NV]**.

### 2.4 Demanda de potencia máxima simultánea (DPMS): AEA 770, Tabla 770.8.I [P]

| tipo_circuito                                             | DPMS mínima por circuito                                                                            |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| IUG sin tomas derivados                                   | 2/3 × (n° bocas × 60 VA)                                                                            |
| IUG con tomas derivados                                   | 2200 VA                                                                                             |
| TUG                                                       | 2200 VA                                                                                             |
| TUE                                                       | 3300 VA                                                                                             |
| Uso específico (ACU, APM, MBTF, MBTS, ATE, IUE, ITE, OCE) | Potencia real × coef. de utilización × coef. de simultaneidad, a criterio del proyectista (770.8.2) |

- **Carga total (770.8.3.1) [P]:** `DPMS_grado × coef_simult + DPMS_específicos`.
- Si los consumos son conocidos y superan esos mínimos, se usan los valores reales (Nota de la Tabla 770.8.I).

### 2.5 Puntos mínimos de utilización: AEA 770, Tabla 770.7.III [P]

| ambiente                                                        | grado                  | IUG                               | TUG                                               |
| --------------------------------------------------------------- | ---------------------- | --------------------------------- | ------------------------------------------------- |
| Estar, comedor, comedor diario, escritorio, estudio, biblioteca | todos                  | 1 cada 18 m² o fracción (mín. 1)  | 1 cada 6 m² o fracción (mín. 2)                   |
| Dormitorio < 10 m²                                              | todos                  | 1                                 | 2                                                 |
| Dormitorio ≥ 10 y ≤ 36 m²                                       | todos                  | 1                                 | 3                                                 |
| Dormitorio > 36 m²                                              | elevado/superior       | 2                                 | 3                                                 |
| Cocina                                                          | mínimo                 | 1                                 | 3 bocas + 2 módulos de toma para artefactos fijos |
| Cocina                                                          | medio                  | 2                                 | 3 bocas + 2 módulos                               |
| Cocina                                                          | elevado                | 2                                 | 3 bocas + 3 módulos                               |
| Cocina                                                          | superior               | 2                                 | 4 bocas + 3 módulos                               |
| Baño (en toilette el toma puede ir al IUG)                      | todos                  | 1                                 | 1                                                 |
| Vestíbulo, garaje, hall, vestidor                               | mínimo                 | 1                                 | 1                                                 |
| Vestíbulo, garaje, hall, vestidor                               | medio/elevado/superior | 1 cada 12 m² (mín. 1)             | 1 cada 12 m² (mín. 1)                             |
| Pasillo cubierto                                                | mínimo                 | 1 cada 5 m (mín. 1)               | —                                                 |
| Pasillo cubierto                                                | medio+                 | 1 cada 5 m (si L > 2 m)           | —                                                 |
| Lavadero                                                        | mínimo                 | 1                                 | 1                                                 |
| Lavadero                                                        | medio+                 | 1                                 | 2                                                 |
| Balcón, galería, semicubierto, pasillo descubierto              | todos                  | 1 cada 5 m de longitud o fracción | —                                                 |

**Reglas adicionales de 770.7.1 y 770.7.2 [P]:**

- Escaleras y rampas: 1 boca IUG cada 5 m o en cada descanso.
- Kitchenette: 1 IUG + 2 TUG + 1 toma para artefacto fijo.
- Ambientes integrados (por ejemplo cocina-comedor): cada parte cumple sus propios mínimos.
- **Cajas en losa ≥ 100 × 100 mm cuentan como boca.**
- **Hasta 4 tomas del mismo circuito montados en el tablero cuentan como 1 boca.**
- Por caja: máximo 2 tomas en una caja 5 × 10 y 4 tomas en una caja 10 × 10.
- **Pasillos de más de 3 m: llaves combinadas en cada extremo.**
- **Tomas de piso a zócalo: arista inferior a 0,20-0,30 m** del piso terminado. Sobre mesada: ≥ 0,10 m sobre la mesada. En locales con baldeo: ≥ 0,30 m (más abajo, IP54).
- **Tomas hasta 0,90 m de altura: 2 × 10 A + T (IRAM 2071) con pantalla** contra inserción de cuerpos extraños, por la clasificación BA2.
- **Prohibido conectar al circuito de iluminación un toma a menos de 0,90 m del piso.** La boca mixta (llave + toma en el IUG) lleva el ideograma IEC 60417-5012.
- **Contradicción:** la carpeta modelo del ERSeP pone los tomas a **0,40 m** (y la leyenda del plano dice 0,30 m), mientras que la 770-2017 pide la arista inferior **entre 0,2 y 0,3 m**. El borrador 2016 decía "no menos de 0,15 m".

---

## 3. Tipos de circuitos

### 3.1 AEA 770-2017, Tabla 770.6.I y 770.6.6 [P]

| sigla          | nombre                         | máx. bocas     | protección máx. (bipolar)       | carga unitaria                                                                                               | toma                                | sección mín. (Tabla 770.11.I)                  |
| -------------- | ------------------------------ | -------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ---------------------------------------------- |
| IUG            | Iluminación de uso general     | 15             | 16 A                            | ≤ 10 A                                                                                                       | conexión fija o 2P+T 10 A IRAM 2071 | 1,5 mm² (**2,5 mm² si tiene tomas derivados**) |
| TUG            | Tomacorrientes de uso general  | 15             | 20 A                            | ≤ 10 A                                                                                                       | 2P+T 10 A IRAM 2071                 | 2,5 mm²                                        |
| TUE            | Tomacorrientes de uso especial | 15             | 32 A                            | ≤ 20 A con toma 2P+T 20 A IRAM 2071, o ≤ 16 A con IEC 60309. En la misma boca se pueden sumar tomas de 10 A. |                                     | 2,5 mm²                                        |
| uso específico | ver 771                        | según proyecto | responsabilidad del proyectista | —                                                                                                            | —                                   | 2,5 mm² (MBTF: 1,5 mm²)                        |

- Todos los circuitos tienen que ser **por lo menos bifilares** (770.6.1).
- Los circuitos de uso general son **monofásicos**.
- Las bocas en semicubiertos llevan artefactos **IP44**; a la intemperie, **IP54**.
- Ventiladores y extractores cuentan como boca IUG.
- Timbre y portero alimentados desde un IUG cuentan como 1 boca y 60 VA.

### 3.2 Circuitos de uso especial y específico de la 771

Lo que sigue es **[S] parcial / [NV]**. Los valores de bocas y protecciones de la 771 sin cita son de memoria y hay que verificarlos.

| sigla     | definición habitual                                                              | notas                                                                                                                                                                                            |
| --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| IUE       | Iluminación de uso especial (exteriores, semicubiertos)                          | En la 771: **máx. 12 bocas, ≤ 32 A** [S, diapositivas FRRO "usos especiales: bocas < 12; protección < 32 A"]. **Choca con la 770, que da 15 bocas para TUE.**                                    |
| TUE (771) | Tomas de uso especial                                                            | 12 bocas, ≤ 32 A [S]                                                                                                                                                                             |
| ACU       | Alimentación de carga única (por ejemplo un aire acondicionado o un termotanque) | Sin derivaciones. Protección según la carga [NV]                                                                                                                                                 |
| APM       | Alimentación de pequeños motores                                                 | [NV]                                                                                                                                                                                             |
| MBTF      | Muy baja tensión funcional (timbres, porteros)                                   | Sección mín. 1,5 mm². **Las masas van a tierra y el PE acompaña al circuito** [P] 770.7.1 f)                                                                                                     |
| MBTS      | Muy baja tensión sin puesta a tierra (≤ 24 V; 12 V con el cuerpo sumergido)      | Transformador de seguridad IEC 61558-2-6. **Las masas NO van a tierra.** Es obligatoria para mandos (flotantes, alarmas) en ambientes mojados como tanques y cisternas [P] 770.7.1 h) y 770.14.1 |
| ATE       | Alimentación de tensión estabilizada                                             | [NV]                                                                                                                                                                                             |
| ITE       | Iluminación con tensión específica (por ejemplo 12 V, LED)                       | [NV]                                                                                                                                                                                             |
| OCE       | Otros circuitos específicos                                                      | [NV]                                                                                                                                                                                             |

- La lista de siglas (MBTF, APM, ATE, MBTS, ACU, IUE, ITE, OCE) está en la **770.8.2 [P]**, que remite a la 771.
- **MBT con autotransformador: prohibido.** Se exige transformador con primario y secundario separados [P] 770.7.1 g).

---

## 4. Conductores

### 4.1 Cables permitidos (770.10.2) [P]

| norma         | tipo                                          | dónde se puede usar                                                                                                                    |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| IRAM NM 247-3 | Unipolar sin envoltura, PVC, 450/750 V, 70 °C | **Solo dentro de cañerías** (embutidas o a la vista) o de cablecanales. **No se puede enterrar ni dejar a la vista sin canalización.** |
| IRAM 62267    | Unipolar sin envoltura, LS0H                  | Igual que el NM 247-3                                                                                                                  |
| IRAM 2178-1   | Con envoltura (tipo subterráneo), 0,6/1,1 kV  | En cañería o cablecanal, **directamente enterrado** o en conducto enterrado                                                            |
| IRAM 62266    | Con envoltura, LS0H                           | Igual que el IRAM 2178-1                                                                                                               |

**Otras reglas [P]:**

- No se puede poner un solo unipolar dentro de un caño metálico (770.10.3.8.4).
- La canalización metálica no reemplaza al PE (770.10.3.2).
- Directamente enterrado: **profundidad ≥ 0,70 m**, cinta "PELIGRO ELÉCTRICO" a 0,20 m de la superficie y protección mecánica con ladrillos o losetas (770.10.4.2.1).
- **Máximo 3 curvas entre cajas** (770.10.3.1).
- **Un solo cable por borne**, salvo que el borne esté diseñado para más (770.16.4).

### 4.2 Secciones mínimas: Tabla 770.11.I [P]

| uso                                    | sección mín. (mm²) |
| -------------------------------------- | ------------------ |
| Línea principal                        | 4                  |
| Circuito seccional                     | 2,5                |
| IUG (fija o con toma)                  | 1,5                |
| TUG                                    | 2,5                |
| IUG que incluye tomas                  | 2,5                |
| Uso especial (TUE)                     | 2,5                |
| Uso específico (salvo MBTF)            | 2,5                |
| Uso específico, alimentación a MBTF    | 1,5                |
| Alimentación a interruptores de efecto | 1,0                |
| Retornos de interruptores de efecto    | 1,0                |
| Conductor de protección PE             | 2,5                |
| Control sin potencia (domótica)        | 0,5                |

**Contradicción:** un apunte de cátedra de la UNLP (que sigue la 771) da **1,5 mm² para "derivaciones hacia y retornos de los interruptores de efecto"**. La 770-2017 dice **1,0 mm²**. Probablemente sea una diferencia entre la 771 y la 770, o un apunte desactualizado.

### 4.3 Corriente admisible Iz: cables NM 247-3 / 62267 en cañería, a 40 °C (Tabla 770.12.I) [P]

| sección (mm²) | 2 cargados + PE (monofásico) (A) | 3 cargados + N + PE (trifásico) (A) |
| ------------- | -------------------------------- | ----------------------------------- |
| 1             | 11                               | 10                                  |
| 1,5           | 15                               | 14                                  |
| 2,5           | 21                               | 18                                  |
| 4             | 28                               | 25                                  |
| 6             | 36                               | 32                                  |
| 10            | 50                               | 44                                  |
| 16            | 66                               | 59                                  |
| 25            | 88                               | 77                                  |
| 35            | 109                              | 96                                  |
| 50            | 131                              | 117                                 |
| 70            | 167                              | 149                                 |
| 95            | 202                              | 180                                 |
| 120           | 234                              | 208                                 |

Vale para el método B1: caño embutido o a la vista, cablecanal.

**Factor por agrupamiento en la misma canalización (Tabla 770.12.II) [P]:**

| circuitos en la canalización            | factor |
| --------------------------------------- | ------ |
| 2 monofásicos (hasta 4 cables cargados) | 0,80   |
| 3 monofásicos (hasta 6 cables cargados) | 0,70   |
| 2 trifásicos (hasta 6 cables cargados)  | 0,80   |
| 3 trifásicos (hasta 9 cables cargados)  | 0,70   |

El PE no cuenta como cable cargado.

**Cables IRAM 2178-1 / 62266 (Tabla 770.12.III del borrador 2016) [P-borrador]:**

| sección (mm²) | B2 en caño, 2x (A) | B2 en caño, 3x (A) | D1 caño enterrado, 2x (A) | D1 caño enterrado, 3x (A) | D2 directamente enterrado, 2x (A) | D2 directamente enterrado, 3x (A) |
| ------------- | ------------------ | ------------------ | ------------------------- | ------------------------- | --------------------------------- | --------------------------------- |
| 1,5           | 14                 | 13                 | 25                        | 20                        | 29                                | 25                                |
| 2,5           | 20                 | 17                 | 33                        | 27                        | 39                                | 34                                |
| 4             | 26                 | 23                 | 43                        | 35                        | 51                                | 44                                |
| 6             | 33                 | 30                 | 53                        | 44                        | 65                                | 55                                |
| 10            | 45                 | 40                 | 71                        | 58                        | 88                                | 74                                |
| 16            | 60                 | 54                 | 91                        | 75                        | 112                               | 95                                |

### 4.4 Ocupación de cañerías [P] (770.10.3.8.4)

- En cablecanales y en casos que no estén en tabla: **área de los cables (con aislación) ≤ 35 %** de la sección interna menor.
- **Circuitos principales y seccionales: caño de diámetro interno ≥ 15 mm** (RL19, RS19, RSP20, RP20).
- **Circuitos terminales: diámetro interno ≥ 13 mm** (RL16, RS16, RSP16, RP16).
- Caño del TP al primer tablero seccional: **mínimo R19/R20 (3/4")**; se recomienda R25 (1") (770.7.1 p).
- Para cables de más de 2,5 mm² y hasta 16 mm², el PE se computa **de la misma sección que la fase**.

**Tabla 770.10.VIII: máxima cantidad de cables en caño aislante rígido (IRAM 62386-21) [P]**

Formato "n+PE".

| caño  | sección interna (mm²) | 1 mm² | 1,5 mm² | 2,5 mm² | 4 mm² | 6 mm² | 10 mm² | 16 mm² |
| ----- | --------------------- | ----- | ------- | ------- | ----- | ----- | ------ | ------ |
| RP16  | 127                   | 2     | 4       | 2       | -     | -     | -      | -      |
| RSP16 | 146                   | 3     | 4       | 3       | 2     | -     | -      | -      |
| RP20  | 213                   | 8     | 7       | 4       | 3     | -     | -      | -      |
| RSP20 | 235                   | 10    | 8       | 5       | 4     | 2     | -      | -      |
| RP22  | 264                   | 12    | 9       | 6       | 4     | 2     | -      | -      |
| RSP22 | 302                   | 14    | 10      | 7       | 5     | 2     | -      | -      |
| RP25  | 347                   | -     | 13      | 9       | 6     | 3     | 2      | -      |
| RSP25 | 388                   | -     | 13      | 9       | 6     | 3     | 2      | -      |
| RP32  | 613                   | -     | -       | 15      | 11    | 6     | 4      | 3      |
| RSP32 | 649                   | -     | -       | 15      | 12    | 7     | 4      | 3      |
| RP40  | 1012                  | -     | -       | -       | -     | 10    | 7      | 5      |

**Tabla 770.10.IX: caño corrugado (IRAM 62386-22) [P]**

| caño  | sección interna (mm²) | 1 mm² | 1,5 mm² | 2,5 mm² | 4 mm² | 6 mm² |
| ----- | --------------------- | ----- | ------- | ------- | ----- | ----- |
| CSP16 | 98                    | 1     | 3       | -       | -     | -     |
| CL16  | 102                   | 1     | 3       | 2       | -     | -     |
| CSP19 | 158                   | 4     | 5       | 3       | 2     | -     |
| CL19  | 164                   | 4     | 5       | 3       | 2     | -     |
| CSP22 | 213                   | 8     | 7       | 4       | 3     | -     |
| CL22  | 223                   | 9     | 7       | 5       | 3     | 2     |
| CSP25 | 293                   | -     | 10      | 6       | 5     | 2     |
| CL25  | 309                   | -     | 10      | 7       | 5     | 2     |
| CSP32 | 509                   | -     | -       | 12      | 9     | 5     |

**Tabla 770.10.VII: caño metálico [P]**

| caño | sección interna (mm²) | 1 mm² | 1,5 mm² | 2,5 mm² | 4 mm² | 6 mm² |
| ---- | --------------------- | ----- | ------- | ------- | ----- | ----- |
| RS16 | 132                   | 2     | 4       | 2       | -     | -     |
| RL16 | 154                   | 4     | 5       | 3       | 2     | -     |
| RS19 | 177                   | 5     | 6       | 4       | 3     | -     |
| RL19 | 227                   | 9     | 7       | 5       | 4     | 2     |
| RS22 | 255                   | 11    | 9       | 6       | 4     | 2     |
| RL22 | 314                   | 15    | 11      | 7       | 5     | 3     |
| RS25 | 346                   | -     | 13      | 9       | 6     | 3     |

**Cajas (Tablas 770.10.X a XII) [P]:**

| elemento                                        | valor                      |
| ----------------------------------------------- | -------------------------- |
| Volumen utilizable, caja rectangular 5 × 10     | 120 cm³                    |
| Volumen utilizable, caja cuadrada 10 × 10       | 200 cm³                    |
| Volumen utilizable, octogonal grande            | 120 cm³                    |
| Volumen utilizable, octogonal chica             | 75 cm³                     |
| Volumen por cable de 1,5 / 2,5 / 4 / 6 / 10 mm² | 6 / 8,5 / 12 / 20 / 25 cm³ |
| Volumen de un interruptor                       | 6-25 cm³                   |
| Volumen de un toma 10 A                         | 18-38 cm³                  |
| Volumen de un toma 20 A                         | 32-40 cm³                  |

- Caño de pared interna no lisa (corrugado por dentro): se toma la **medida inmediata superior** a la de la tabla de caño liso (770.10.3.3.4 e) [P].

---

## 5. Código de colores (Tabla 770.10.XIII) [P]

| función     | sigla | color                    |
| ----------- | ----- | ------------------------ |
| Fase L1 (R) | L1    | Castaño (marrón)         |
| Fase L2 (S) | L2    | Negro                    |
| Fase L3 (T) | L3    | Rojo                     |
| Neutro      | N     | Celeste (azul claro)     |
| Protección  | PE    | Verde-amarillo (bicolor) |

**Reglas y prohibiciones (770.10.3.8.5) [P]:**

1. En monofásico la fase puede ser **cualquiera** de los tres colores de fase. Si sale de una trifásica, va **del color de la fase de origen**.
2. **Verde-amarillo es solo para PE.** No se puede usar verde ni amarillo solos, ni verde-amarillo, para otra cosa.
3. **Celeste o azul es solo para neutro.**
4. Retornos de llaves: **no se usan los colores de fase, neutro ni PE**, ni verde o amarillo por separado. Por fuerza mayor se admiten colores de fase **identificados con anillos o cinta en los dos extremos**, pero nunca celeste, azul, verde, amarillo ni verde-amarillo.
5. En la práctica de Córdoba la carpeta ERSeP usa **blanco para los retornos** y marrón identificado con anillo "R" cuando falta blanco [P carpeta].
6. **Tomas "biuso"** (aptos para patas redondas y planas): **antirreglamentarios** [P carpeta ERSeP, sec. 05].

---

## 6. Protecciones

### 6.1 Interruptores termomagnéticos (PIA)

**Lo confirmado [P]:**

- **Solo se admiten interruptores automáticos IEC 60898-1** para proteger circuitos (770.16.5.2). Tienen que ser **bloqueables en abierto** y cortar **todos los polos a la vez**.
- **En monofásico, corte y protección bipolares.** Están **prohibidos** los PIA unipolares, los "1P+N", "neutro pasante" o "neutro no protegido", y los combinados térmico-diferencial que protegen un solo polo (770.16.5.1).
- **Condición de sobrecarga:** **Ib ≤ In ≤ Iz** (770.15.2.1). La condición **I2 ≤ 1,45 Iz** aparece en la figura 770.15.A. Con IEC 60898 se da por cumplida (770.15.3: "la protección contra sobrecargas queda asegurada por la exigencia del empleo de interruptores IEC 60898").
- **Poder de corte:** **Icn ≥ Icc presunta** en el punto de instalación (770.15.2.2.2). Va marcado en un rectángulo en el aparato (por ejemplo `3000`). **La distribuidora tiene que informar la Icc.** El ámbito de la 770 llega hasta **Icc ≤ 10 kA**.
- Valores normalizados de poder de corte (Tabla 770-B.VIII): **3000 / 4500 / 6000 / 10000 A**.
- Carpeta ERSeP: **PIA de circuitos 3 kA; ITM de cabecera en el TPA 6 kA**.
- **Cortocircuito en el cable:** **k²·S² ≥ I²t**, con **k = 115** para Cu/PVC de 70 a 160 °C (Tabla 770.15.II).
- Ejemplo de la 770-B: 2,5 mm² con un C16 de 6 kA clase 3 → I²t = 42 000 A²s ≤ 115² × 2,5² = 82 656 → verifica.
- **Motores:** el PIA **no** sirve como protección de sobrecarga del motor. Hace falta protección dedicada (guardamotor/relé) y, en trifásico, detector de falta de fase (770.13.3).

**Curvas IEC 60898 [NV]** (es el estándar internacional; no lo leí en la 770):

| curva | disparo magnético | uso típico                                                  |
| ----- | ----------------- | ----------------------------------------------------------- |
| B     | 3-5 × In          | Iluminación, cables largos                                  |
| C     | 5-10 × In         | Tomas, uso general                                          |
| D     | 10-20 × In        | Motores, transformadores, cargas con mucho pico de arranque |

- Corrientes convencionales [NV]: I1 = 1,13 In (no dispara en 1 h); **I2 = 1,45 In** (dispara en menos de 1 h).
- La carpeta ERSeP usa **B10 para IUG, C10 para TUG y C32 para cabecera** [P].
- Calibres normalizados habituales [NV]: 6, 10, 13, 16, 20, 25, 32, 40, 50, 63 A.

**Calibre máximo de PIA según la sección.** Se calcula con la Tabla 770.12.I, monofásico, sin agrupar y luego con 2 circuitos en el mismo caño (×0,8):

| sección (mm²) | Iz sin agrupar (A) | PIA máx. sin agrupar  | Iz con ×0,8 (A) | PIA máx. con ×0,8 | tope por tipo de circuito |
| ------------- | ------------------ | --------------------- | --------------- | ----------------- | ------------------------- |
| 1,5           | 15                 | 10 A (13 A si existe) | 12              | 10 A              | IUG ≤ 16 A                |
| 2,5           | 21                 | 20 A                  | 16,8            | 16 A              | TUG ≤ 20 A                |
| 4             | 28                 | 25 A                  | 22,4            | 20 A              | TUE ≤ 32 A                |
| 6             | 36                 | 32 A                  | 28,8            | 25 A              | —                         |
| 10            | 50                 | 50 A                  | 40              | 40 A              | —                         |
| 16            | 66                 | 63 A                  | 52,8            | 50 A              | cabecera de la 770 ≤ 63 A |

Esta tabla la derivé yo a partir de Iz [P] y los calibres comerciales [NV].

### 6.2 Interruptores diferenciales (ID)

**Lo confirmado [P]:**

- **Todos los circuitos terminales** llevan ID de **IΔn ≤ 30 mA, no retardado** como protección complementaria contra contacto directo (770.14.2.3). **No reemplaza** a las otras medidas de protección.
- En esquema TT, **la única protección aceptada contra contactos indirectos por corte automático es el diferencial**. **No se admite usar el PIA para eso** (770.14.3.2).
- **Con IΔn ≤ 30 mA y Ra ≤ 40 Ω** el circuito se considera protegido contra contactos indirectos (UL = 24 V).
- Entre tableros se admite un ID de **hasta 300 mA**, y se recomienda que sea **selectivo** ("S") respecto de los de 30 mA aguas abajo.
- Normas: **IEC 61008** (ID puro) e **IEC 61009** (ID con protección de sobrecorriente).
- **Tipo AC** es el más habitual: detecta fuga alterna senoidal (Nota de 770.14.2.3).
- El ID tiene **baja capacidad de ruptura: mínimo 500 A o 10·In** (770-B.2.4). **Hay que protegerlo** con un dispositivo contra cortocircuito aguas arriba, o con los PIA aguas abajo **en el mismo tablero** (770.15.2.2.5).
- **Corriente asignada del ID [P] 770.15.2.2.5:** `In_ID ≥ In del ITM aguas arriba`, **o bien** `In_ID ≥ suma de las In de los PIA aguas abajo`. Ejemplo de la carpeta ERSeP: ITM 32 A en el TPA → ID 2 × 40 A.
- **Ensayos (770.19.3.1 f-g):** botón de prueba ("test"), **y además** prueba inyectando IΔn con resistencias entre la fase y el borne de tierra de cada toma o tablero; se recomienda medir el tiempo de actuación.
- Las cercas eléctricas llevan circuito propio con ID ≤ 30 mA obligatorio (770.7.7).

**Sin verificar [NV]:**

- **Tipo A** (detecta continua pulsante) recomendado para cargas electrónicas, inversores y lavarropas. Tipos F y B para variadores y para el cargador de vehículo eléctrico (AEA 722).
- Apretar el botón de test **una vez por mes**.

### 6.3 Interruptor principal o de cabecera [P] (770.16.5.3-4)

- **TP:** su cabecera es un **interruptor automático** (corte y protección general), al que se le puede asociar un diferencial. **En la 770, In ≤ 63 A**; si hace falta más, se pasa a la 771.
  - Monofásico: bipolar con los dos polos protegidos.
  - Trifásico: tetrapolar con todos los polos protegidos.
- **Todo interruptor de cabecera secciona el neutro.**
- **Tablero seccional:** su cabecera es un interruptor-seccionador, un interruptor automático o un ID (IEC 61008/61009), siempre con **aptitud de seccionamiento**. Lleva **un PIA por cada circuito derivado**.

### 6.4 Selectividad

- **[P]:** el ID de 300 mA aguas arriba se recomienda **selectivo** con los de 30 mA. La carpeta ERSeP lista "selectividad de las actuaciones" entre los ensayos del tablero.
- **[NV]:** selectividad amperométrica entre PIA (el de cabecera de mayor calibre que los de circuito). En la práctica se busca que el ITM del TPA (32 A) no salte antes que un PIA de 10 A.

### 6.5 DPS (protección contra sobretensiones transitorias): Tabla 770.15.III [P]

| alimentación del inmueble                                                                      | AQ ≤ 25 días/año (AQ1) | AQ > 25 días/año (AQ2)                                      |
| ---------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| Inmueble con pararrayos                                                                        | **Obligatorio**        | **Obligatorio**                                             |
| Red BT total o parcialmente **aérea** (no rige con conductores aislados con pantalla a tierra) | No obligatorio         | **Obligatorio**, salvo análisis de riesgo según AEA 92305-2 |
| Red BT totalmente subterránea                                                                  | No obligatorio         | No obligatorio                                              |

- El nivel ceráunico sale de los mapas de **AEA 92305-11**. El valor para la ciudad de Córdoba **no lo pude verificar [NV]**.
- La protección contra sobretensiones **permanentes** (corte de neutro) queda a criterio del proyectista (770.15.5), y la 770.13.1 la califica de "altamente recomendable".

### 6.6 Fusibles

- **[P]:** en la 770 la protección de circuitos se hace **solo con interruptores automáticos IEC 60898-1** (770.16.5.2). Los fusibles aparecen únicamente como posible **DPCC aguas arriba de un ID** (770-B.2.4) y la 770 aclara que no sirven como protección de sobrecarga de motores.
- **[NV]:** el DPLA de la distribuidora (protección en el pilar o la acometida) puede ser un fusible, según la ET de la distribuidora.

---

## 7. Tableros

### 7.1 Definiciones [P] (770.16.1)

| tablero                    | qué es                                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Caja de medidor            | Recibe la línea de alimentación, contiene el medidor y de ahí sale la línea principal                                                                                 |
| **TP (tablero principal)** | Recibe la línea principal, contiene el interruptor principal y de él salen los circuitos seccionales o terminales                                                     |
| TSG (seccional general)    | Recibe un único seccional desde el TP                                                                                                                                 |
| TS (seccional)             | Recibe un seccional y deriva circuitos                                                                                                                                |
| TPA y TPU                  | Nomenclatura de Córdoba (carpeta ERSeP): **TPA** = tablero de protección de la acometida, en el punto de conexión y medición; **TPU** = tablero principal del usuario |

### 7.2 Orden de los dispositivos, del medidor a los circuitos

| paso | elemento                                | dispositivo                                                                    | quién      | verif.                   |
| ---- | --------------------------------------- | ------------------------------------------------------------------------------ | ---------- | ------------------------ |
| 1    | Red EPEC (RDD) → LAD → DPLA             | Protección de la distribuidora                                                 | EPEC       | [P] Fig. 770.5.A         |
| 2    | Medidor (kWh)                           | —                                                                              | EPEC       | [P]                      |
| 3    | TPA (Córdoba)                           | **ITM bipolar curva C 32 A, 6 kA** (ejemplo)                                   | Instalador | [P] carpeta ERSeP        |
| 4    | Línea principal / seccional             | Cable IRAM 2178, 2 × 6 mm² enterrado (ejemplo)                                 | Instalador | [P] carpeta              |
| 5    | TP/TPU: cabecera                        | Interruptor automático bipolar (≤ 63 A) **o** ID si el TPA ya protege la línea | Instalador | [P] 770.16.5.3 y carpeta |
| 6    | DPS (si corresponde)                    | Después del interruptor principal y antes del ID                               | Instalador | [NV]                     |
| 7    | ID 30 mA                                | 2 × 40 A, 30 mA (ejemplo)                                                      | Instalador | [P] carpeta              |
| 8    | PIA por circuito                        | Bipolares, 3 kA (ejemplo C2 × 10 A)                                            | Instalador | [P] carpeta              |
| 9    | Circuitos terminales (IUG, TUG, TUE...) | —                                                                              | Instalador | [P]                      |

En el ejemplo de la carpeta, el TPU arranca directamente con el **ID**, porque el ITM de 32 A del TPA protege la línea (770.16.5.3: "si del TP se deriva un único seccional...").

**Esquema alternativo** para varios grupos [P] Nota 1 de 770.16.5.4: interruptor principal → varios ID (cada uno agrupa circuitos) → PIA por circuito. También se admite un ID por circuito.

### 7.3 Requisitos constructivos y de ubicación [P] (770.16.2 a 770.16.4)

| requisito                         | valor                                                                                                                                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grado IP del tablero              | **IP41 o IP31D** como mínimo. Sin partes con tensión accesibles aun con la puerta abierta. Barreras: **IP3XD**.                                                                                                               |
| TP a la intemperie                | ≥ **IP54**                                                                                                                                                                                                                    |
| TPA (Córdoba)                     | IP43, con gabinete estanco IP65 en la lista de materiales [P carpeta]                                                                                                                                                         |
| Altura de las palancas de comando | **entre 0,40 m y 2,00 m** del piso                                                                                                                                                                                            |
| Distancia del TP al medidor       | **≤ 2 m**, dentro de la propiedad                                                                                                                                                                                             |
| TP                                | Gabinete **Clase II** (doble aislación). La línea principal también va en doble aislación.                                                                                                                                    |
| Espacio libre al frente           | ≥ 0,90 m                                                                                                                                                                                                                      |
| Iluminación del local             | ≥ 200 lx a 1 m del piso; se recomienda iluminación de emergencia                                                                                                                                                              |
| Reserva                           | **≥ 20 %** de la capacidad, en módulos de 18 mm                                                                                                                                                                               |
| Señalización                      | **Símbolo de riesgo eléctrico (IRAM 10005-1) de ≥ 40 mm** en el frente, visible. Leyendas en español, legibles a 1 m. Marcado: fabricante o montador responsable, tensión, **Icc máxima de cálculo**.                         |
| Montaje y alimentación            | Dispositivos **verticales, alimentados por los bornes superiores**. Si se alimentan por abajo: cartel "Precaución – Alimentación por bornes inferiores".                                                                      |
| Barra de PE                       | Placa, barra o bornera de tierra identificada (símbolo o verde-amarillo), con bornes suficientes para todos los circuitos. En gabinete de doble aislación no hace falta poner a tierra el riel, la cerradura ni las bisagras. |
| Interconexiones                   | Con cable solo en tableros de hasta 3 circuitos de salida                                                                                                                                                                     |
| Ubicación prohibida               | **En baños**, **dentro de muebles** (alacenas, placares), **bajo mesadas**, en huecos o lugares de difícil acceso, cerca de agua, gas o cloaca                                                                                |
| Distancia a gas                   | Tableros y bocas a ≥ 0,50 m de las bocas o dispositivos de gas (770.17)                                                                                                                                                       |
| Verificación térmica              | Potencia disipada ≤ potencia disipable del gabinete (IEC 60670-24 / IEC 62208, Anexo 770-B)                                                                                                                                   |
| Varias plantas                    | Se sugiere un TS por planta habitable                                                                                                                                                                                         |
| Plano                             | En el interior de la tapa, plano del tablero protegido [P carpeta 02.03 e)]                                                                                                                                                   |

---

## 8. Puesta a tierra

| ítem                                        | valor                                                                                                                                                                                          | fuente                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Esquema exigido                             | **TT**: tierra de servicio de la distribuidora y **tierra de protección propia, independiente** y dentro del inmueble                                                                          | [P] 770.3.2              |
| **Resistencia máxima**                      | **Ra ≤ 40 Ω** (valor permanente, sobre el conjunto de electrodos)                                                                                                                              | [P] 770.3.2 y 770.14.4.1 |
| Electrodo                                   | Jabalina acero-cobre **IRAM 2309** (o 2310). En la carpeta: 1,5 m × 19 mm (3/4"), cobre ≥ 245 µm                                                                                               | [P]                      |
| Tierra "lejana"                             | Distancia a la tierra de servicio **> 10 × radio equivalente (10·Re)**                                                                                                                         | [P] 770.3.2 y 770.14.4.2 |
| Tabla 770.3.I, 10·Re                        | 1/2" × 1,5 m → 3,2 m; 5/8" × 1,5 m → 3,2 m; 3/4" × 1,5 m → 3,4 m; 3/4" × 3 m → 5,8 m                                                                                                           | [P]                      |
| Cámara de inspección                        | Obligatoria. Tapa removible a nivel de piso, lugar no transitado. Barra con puentes removibles, o **tomacable IRAM 2343** si hay una sola jabalina IRAM 2309.                                  | [P] 770.14.4.3           |
| Uniones enterradas                          | Soldadura cuproaluminotérmica o compresión irreversible                                                                                                                                        | [P]                      |
| Cable de puesta a tierra (jabalina → barra) | **≥ 4 mm²**, según la Tabla 770.14.I. Va **separado del PE**. Entra preferentemente por el TP. La carpeta usa 6 mm².                                                                           | [P]                      |
| Sección del PE (Tabla 770.14.I)             | S ≤ 16 → **SPE = S**; 16 < S ≤ 35 → **16**; S > 35 → **S/2**; **mínimo 2,5 mm²**                                                                                                               | [P]                      |
| Recorrido del PE                            | Recorre **toda** la instalación, incluso cajas sin tomas. **No se interrumpe** salvo en tableros y empalmes. **Prohibido conectar masas en guirnalda** (en serie): se deriva sin cortar el PE. | [P] 770.14.4.5           |
| Derivación a bornes                         | Cable verde-amarillo ≥ 2,5 mm²                                                                                                                                                                 | [P] 770.14.4.6           |
| TPA de doble aislación                      | No lleva jabalina ni PAT                                                                                                                                                                       | [P] carpeta              |
| Medición                                    | Telurímetro, o método de 3 electrodos (T2 al 62 % de la distancia T-T1, más dos lecturas a ±1 m)                                                                                               | [P] 770.19.5.3           |
| **Contradicción de redacción**              | La carpeta ERSeP dice "32 Ω, menor a los **40 Ω mínimos**". Es un error: **40 Ω es el máximo**.                                                                                                | [P]                      |

---

## 9. Caída de tensión

### 9.1 Valores admisibles

Se miden **desde los bornes de salida del TP hasta cualquier punto de utilización**.

| circuito                                                                | máx. ΔU                               | fuente                                 |
| ----------------------------------------------------------------------- | ------------------------------------- | -------------------------------------- |
| Terminales de uso general o especial (iluminación **y tomacorrientes**) | **3 %**                               | [P] 770.15.6 (2017)                    |
| Circuitos que alimentan solo motores                                    | **5 % en régimen / 15 % en arranque** | [P] 770.15.6                           |
| Circuitos seccionales (parcial)                                         | 1 % recomendado                       | [P] Nota 770.15.6                      |
| 771 (2006): iluminación / fuerza motriz                                 | 3 % / 5 %                             | [NV], es el valor habitual en cátedras |

**Contradicción:** el borrador 2016 decía "para iluminación: 3 %" sin mencionar tomas. La versión 2017 aclara "**para iluminación y tomacorrientes: 3 %**".

**Hipótesis de cálculo [P]:** los circuitos se cargan con su DPMS **en el extremo más alejado**; la iluminación, con 2/3 de la carga total en el extremo.

### 9.2 Fórmulas [P] (770.15.6 a)

```
ΔU [V] = k · I · L · (R·cosφ + X·senφ)
  k = 2   (monofásico y bifásico)
  k = √3  (trifásico)
  I en A; L en km (distancia entre los puntos, no el largo total de cable); R y X en Ω/km
  A falta de datos: cosφ = 0,85 / senφ = 0,53. Arranque de motores: cosφ = 0,30 / senφ = 0,95.

Método por tabla (cables 247-3 en caño, cosφ = 0,8, monofásico):
  ΔU [V] = c [V/(A·km)] · I [A] · L [km]
  ΔU% = ΔU / 220 · 100   (en trifásico, sobre 380 V entre fases)
```

**Tabla 770.15.IV, constante c en V/(A·km), monofásico [P]:**

| sección (mm²) | 1,5 | 2,5 | 4   | 6   | 10  | 16  | 25  | 35  | 50  | 70  | 95  | 120 |
| ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| c             | 26  | 15  | 10  | 6,5 | 3,8 | 2,4 | 1,6 | 1,2 | 0,8 | 0,6 | 0,5 | 0,4 |

**Ejemplo para el juego:** TUG de 2,5 mm², 10 A, 25 m → ΔU = 15 × 10 × 0,025 = 3,75 V → 1,7 %. Verifica.

**Corriente de proyecto [P/S]:**

- Monofásico: `I = S[VA] / 220 V`.
- Trifásico: `I = S / (√3 · 380 V)`.
- Potencia activa: `P = S · cosφ`. ERSeP: para declarar los kW en el certificado, fp mínimo **0,85** (RG 50/2017).

**Ejemplo de la carpeta ERSeP [P]:** DPMS = 7080 VA × 0,8 = 5664 VA → I = 25,75 A → ITM de 32 A → línea de 6 mm² (Iz = 36 A). Se declara 5664 × 0,85 = 4,8 kW.
La misma carpeta, en la tabla resumen, da **5533 VA / 4,70 kW** (calcula el IUG sin tomas con 2/3 × 60 VA). Es una **inconsistencia interna** que sirve como pregunta de "detectar el error".

**Iz corregida:** `Iz = I_tabla × f_agrupamiento × f_temperatura`. La corrección por temperatura está en el Anexo B de AEA 90364-5-52 [P referencia / valores NV].

---

## 10. Simbología y documentación del plano

### 10.1 Documentación mínima del proyecto: Anexo 770-A (reglamentario) [P]

1. **Síntesis del proyecto:** demanda de potencia, grado, superficie total, cantidad y destino de los circuitos, secciones, corrientes de proyecto, **Icc en el punto de suministro**, bocas por ambiente.
2. **Esquema unifilar** de los tableros: In, curva, capacidad de ruptura, secciones de la línea principal, seccionales, terminales y PE, identificación de circuitos, Icc de cálculo en cada tablero. Si la autoridad no dice otra cosa, se remite a **IRAM 4504**.
3. **Plano o croquis:** superficie de cada ambiente; canalizaciones con medida, cableado y circuito; ubicación y destino de cada boca; **ubicación de la toma de tierra** y de la canalización del cable de PAT.
4. **Listado de materiales:** marca, norma y forma de acreditar la conformidad.

### 10.2 Plano de la carpeta ERSeP: elementos y alturas [P]

Esto sirve como "leyenda" de referencia en Córdoba.

| elemento                                           | altura / dato                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| Caja de medidor (M)                                | h 0,75 m                                                              |
| TPA                                                | h 0,75 m                                                              |
| TPU                                                | h 1,30 m                                                              |
| Jabalina con tapa de inspección                    | Dispersor d 14 mm, L 1,50 m (el texto dice 19 mm: **inconsistencia**) |
| Boca de iluminación de pared                       | h 2,20 m                                                              |
| Boca de iluminación en losa                        | —                                                                     |
| Pulsador                                           | h 1,10 m                                                              |
| Campanilla o timbre                                | h 2,20 m                                                              |
| Llave de efecto de 1 punto, de 2 puntos, combinada | h 1,10 m                                                              |
| Tomacorriente monofásico 10 A IRAM 2071            | h 0,30 m (el texto dice 0,40 m)                                       |
| Toma de TV                                         | h 0,80 m                                                              |
| Toma de teléfono                                   | h 0,60 m                                                              |
| Caño aislante rígido                               | "pR 20" = caño rígido de 20 mm                                        |

**Anotación de cañerías en el plano [P carpeta]:** se escribe la cantidad de cables por sección, más T, y el caño. Ejemplos: `2x2.5 + T pR 20`, `2x2.5+2x1.5 + T pR 20`, `5x1.5 + T pR 20`. En las bocas se pone el número del circuito.

**Unifilar modelo [P carpeta]:**

```
RDD → LAD → DPLA → M(kWh) → TPA[ITM C2x32A 6kA] → CS PVC 1,1 kV Cu 2x6 IRAM 2178
     → TPU[ID 2x40A 30mA] → ITM C2x10A 3kA × 4 circuitos (L1/N; IUG 2x2.5+T, IUG 2x1.5+T, TUG 2x2.5+T, TUG 2x2.5+T)
     PE: Cu 6 mm² IRAM NM 247-3 a la jabalina
```

### 10.3 Símbolos gráficos [NV]

- La norma de **símbolos gráficos** que cita una fuente universitaria es la **IRAM 2010** ("Símbolos gráficos electrotécnicos") [S]. Hay apuntes que la ligan a IEC 60617 [NV]. Hay municipios (Rosario) que piden planos "según normas IRAM" y la "simbología de circuitos según normas AEA" [S].
- **No conseguí la tabla oficial de símbolos.** La que sigue es la simbología domiciliaria habitual en Argentina y **hay que validarla con el material del curso UTN FRC o con el Manual Cat. III del ERSeP** antes de cargarla en el juego:

| elemento                                  | símbolo usual                                                                                 | verif.                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------- |
| Boca de techo (centro)                    | Círculo (a veces con una X o con un número de circuito)                                       | [NV]                               |
| Boca de pared (aplique o brazo)           | Círculo con un trazo hacia la pared, o semicírculo                                            | [NV]                               |
| Tomacorriente                             | Semicírculo o círculo chico con dos trazos; con T si lleva tierra                             | [NV]                               |
| Llave de 1 punto / 2 puntos / combinación | Círculo chico con 1 / 2 trazos en ángulo; la combinación, con trazos opuestos                 | [NV]                               |
| Pulsador                                  | Círculo con punto                                                                             | [NV]                               |
| Timbre o campanilla                       | Semicírculo con base                                                                          | [NV]                               |
| Tablero (principal / seccional)           | Rectángulo relleno / rectángulo con diagonal                                                  | [NV]                               |
| Medidor                                   | Círculo o cuadrado con M o kWh                                                                | [P] figura 770.5.A y carpeta ("M") |
| Puesta a tierra                           | Símbolo IEC 60417-5019 (barras decrecientes)                                                  | [P] 770.14.4.6                     |
| Clase II                                  | Doble cuadrado, IEC 60417-5172                                                                | [P] 770.16.4.1.2                   |
| ID selectivo                              | "S" en un recuadro                                                                            | [P] 770.14.3.2                     |
| Cañería                                   | Línea llena = embutida en pared; línea de trazos = por piso o losa; con anotación "n×S + T Ø" | [NV] (la anotación sí [P])         |

---

## 11. Certificado de Instalación Eléctrica Apta (ERSeP)

| ítem                                     | detalle                                                                                                                                                                                                                                                                                                                          | verif.                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Quién lo emite                           | Cat. III: **certificado** según los modelos de la RG 5/2016, Anexo II (instalaciones nuevas) y Anexo III (existentes y provisorias). Cat. I-II: **constancia del colegio**.                                                                                                                                                      | [P] RG 5/2016, arts. 2-4         |
| Copias                                   | **Triplicado**: el original lo presenta el usuario ante la distribuidora, el duplicado queda en manos del solicitante y el triplicado, del instalador                                                                                                                                                                            | [P] RG 5/2016, arts. 2-3         |
| Cuándo se exige                          | Todo **nuevo servicio**, desde el 01/12/2017 (RG 46/2017). También ante **cambio de tarifa o aumento de potencia** que obligue a adecuar la alimentación o la protección (RG 5/2016, art. 6). Los inmuebles de acceso público ya existentes tenían 2 años de plazo.                                                              | [P]                              |
| Sistema                                  | Web del ERSeP (Anexo IV de la RG 5/2016) con **CiDi nivel 2**                                                                                                                                                                                                                                                                    | [P] RG 43/2017                   |
| Contenido                                | (1) **solicitud del código único de identificación** de la instalación certificada; (2) **memoria descriptiva**; (3) **esquema unifilar**; (4) **vista en planta**; (5) **lista de materiales**; (6) **fotografías**                                                                                                             | [P] programa UTN 2025, unidad 11 |
| Base legal del contenido                 | Dec. 1022/2015, Anexo Único, art. 6: descripción, croquis y detalle de materiales                                                                                                                                                                                                                                                | [P] RG 17/2021                   |
| Memoria descriptiva (carpeta modelo)     | 01 Cálculos (ubicación, superficie y grado, circuitos y DPMS, potencia de los circuitos terminales, electroductos, protecciones, resumen); 02 Descripción de los trabajos (tableros, verificación, PAT, punto de conexión, alimentación, protecciones, PE); 03 Pruebas y ensayos; 04 Especificaciones técnicas; 05 Observaciones | [P] carpeta ERSeP                |
| Ensayos que lista la carpeta             | Inspección visual; materiales; PAT y conexiones; **polaridad de tomas**; tableros: funcionamiento mecánico y **selectividad**; corte bipolar de todos los circuitos                                                                                                                                                              | [P]                              |
| Ensayos de la 770 (770.19.3.3), en orden | Continuidad → aislación → MBTS/separación → desconexión automática → protección complementaria (ID) → polaridad → secuencia de fases → funcionales → caída de tensión; además, continuidad de canalizaciones metálicas y del PE, y R de PAT                                                                                      | [P]                              |
| Aislación (Tabla 770.19.I)               | MBTS/MBTF: ensayo a 250 V CC, **≥ 0,25 MΩ**. ≤ 500 V: ensayo a 500 V CC, **≥ 0,5 MΩ**. > 500 V: 1000 V CC, ≥ 1 MΩ. Además: ≥ 1000 Ω por volt aplicado, por cada tramo de 100 m. Se mide fase-fase, fases-N, fases-PE y N-PE, con los artefactos desconectados y los interruptores cerrados.                                      | [P]                              |
| Continuidad                              | Fuente de 4-24 V y ≥ 0,2 A                                                                                                                                                                                                                                                                                                       | [P] 770.19.5.1                   |
| Inspección periódica                     | Cada **5 años como máximo**                                                                                                                                                                                                                                                                                                      | [P] 770.19.4.3                   |
| Potencia que se declara                  | En **kW**, con fp de 0,85 (RG 50/2017)                                                                                                                                                                                                                                                                                           | [P] carpeta                      |
| Vigencia del registro Cat. III           | 3 años, renovable                                                                                                                                                                                                                                                                                                                | [P] RG 43/2017, art. 14          |

---

## 12. Errores frecuentes y preguntas trampa

Cada fila indica la cláusula que lo prohíbe o lo exige.

| #   | error                                                                               | qué corresponde                                                        | fuente                                     |
| --- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| 1   | PIA unipolar o "1P+N" en un circuito monofásico                                     | Bipolar con los dos polos protegidos                                   | [P] 770.16.5.1-2                           |
| 2   | Usar el PIA como protección contra contacto indirecto en TT                         | Solo el ID (≤ 30 mA en los terminales)                                 | [P] 770.14.3.2                             |
| 3   | ID con In menor que el ITM aguas arriba (por ejemplo ID 25 A detrás de un ITM 32 A) | In_ID ≥ In del ITM, o ≥ suma de los PIA                                | [P] 770.15.2.2.5                           |
| 4   | ID sin dispositivo de cortocircuito que lo proteja                                  | DPCC aguas arriba, o PIA en el mismo tablero                           | [P] 770.15.2.2.5                           |
| 5   | "Subir el térmico porque salta": PIA de 25 A en un cable de 2,5 mm²                 | In ≤ Iz (21 A; 16,8 A agrupado) y tope TUG de 20 A                     | [P] 770.15.2.1, Tabla 770.6.I              |
| 6   | IUG con PIA de 20 A, o TUG con PIA de 25 A                                          | IUG ≤ 16 A, TUG ≤ 20 A, TUE ≤ 32 A                                     | [P] Tabla 770.6.I                          |
| 7   | Más de 15 bocas en un circuito (770)                                                | ≤ 15 bocas (12 en IUE/TUE según la 771 [S])                            | [P]                                        |
| 8   | Toma derivado del IUG en un cable de 1,5 mm²                                        | IUG con toma: ≥ 2,5 mm²                                                | [P] Tabla 770.11.I                         |
| 9   | Toma conectado al IUG a menos de 0,90 m del piso                                    | Prohibido; tiene que ir al TUG                                         | [P] 770.7.1 m)                             |
| 10  | Verde-amarillo (o verde, o amarillo) usado como retorno o fase                      | Solo PE                                                                | [P] 770.10.3.8.5                           |
| 11  | Celeste usado como fase o retorno                                                   | Solo neutro                                                            | [P]                                        |
| 12  | Retorno de color de fase sin identificar                                            | Anillo o cinta en los dos extremos                                     | [P]                                        |
| 13  | PE conectado en guirnalda (masas en serie) o cortado en las cajas                   | Derivar sin cortar                                                     | [P] 770.14.4.5                             |
| 14  | Cañería metálica usada como PE                                                      | Prohibido; el PE es un cable aparte                                    | [P] 770.10.3.2                             |
| 15  | PE de 1,5 mm² en un circuito IUG                                                    | PE ≥ 2,5 mm² siempre                                                   | [P] Tabla 770.11.I                         |
| 16  | Jabalina pegada a la tierra de servicio, o PAT compartida con el neutro de la red   | TT independiente, a > 10·Re                                            | [P] 770.3.2                                |
| 17  | R de PAT de 60 Ω "porque el ID es de 30 mA"                                         | Ra ≤ 40 Ω en la 770                                                    | [P]                                        |
| 18  | Unir neutro y tierra en el TP                                                       | En TT van independientes                                               | [P] 770.3.2 (la unión N-PE como tal: [NV]) |
| 19  | Cable IRAM NM 247-3 enterrado, o a la vista sin caño                                | Solo en canalización; para enterrar, IRAM 2178 o 62266                 | [P] 770.10.2                               |
| 20  | Enterrado a 0,40 m, sin cinta ni ladrillos                                          | ≥ 0,70 m, cinta a 0,20 m y protección mecánica                         | [P] 770.10.4.2.1                           |
| 21  | Un solo unipolar dentro de un caño metálico                                         | Prohibido                                                              | [P] 770.10.3.8.4                           |
| 22  | Más de 3 curvas entre cajas; caños sueltos en las cajas; sin conectores             | ≤ 3 curvas; caño fijado con su conector                                | [P] 770.10.3.1 / carpeta                   |
| 23  | Caño corrugado con la medida de la tabla de caño liso                               | Usar la tabla del corrugado o el diámetro inmediato superior           | [P]                                        |
| 24  | Seccional en caño de 5/8" (RS16)                                                    | ≥ 3/4" (R19/R20)                                                       | [P] 770.7.1 p) y 770.10.3.8.4              |
| 25  | Tablero en el baño, dentro de un placard o bajo la mesada                           | Prohibido                                                              | [P] 770.16.2.1                             |
| 26  | Tablero sin el 20 % de reserva o sin el cartel de riesgo eléctrico                  | Obligatorios                                                           | [P] 770.16.4 / 770.16.2.1                  |
| 27  | Dispositivos alimentados por abajo sin cartel                                       | Cartel "Precaución – Alimentación por bornes inferiores"               | [P] 770.16.4                               |
| 28  | Dos cables en el mismo borne                                                        | Uno por borne, salvo borne diseñado para eso                           | [P] 770.16.4                               |
| 29  | Tomas "biuso"                                                                       | Antirreglamentarios; solo IRAM 2071                                    | [P] carpeta ERSeP                          |
| 30  | Toma bajo sin pantalla de protección                                                | Pantalla obligatoria por BA2                                           | [P] 770.7.2                                |
| 31  | Polaridad del toma invertida (fase y neutro cruzados)                               | Se verifica en la inspección                                           | [P] 770.19.3.1 d)                          |
| 32  | Cabecera del TP de 80 A en la 770                                                   | ≤ 63 A; si no, se aplica la 771                                        | [P] 770.16.5.3                             |
| 33  | Elegir el PIA de cabecera de 3 kA sin conocer la Icc                                | Icn ≥ Icc (la informa la distribuidora; la carpeta usa 6 kA en el TPA) | [P] 770.15.2.2.2                           |
| 34  | Proteger un motor contra sobrecarga solo con el PIA                                 | Protección dedicada (guardamotor o relé) y falta de fase en trifásico  | [P] 770.13.3                               |
| 35  | Un Cat. III certifica un local de 15 kW o alumbrado público                         | Cat. III: ≤ 10 kW BT; alumbrado público: solo ingenieros               | [P] RG 5/2016, RG 109/2023                 |
| 36  | Citar la ENRE 207/95 como norma aplicable en Córdoba                                | En Córdoba rige la Ley 10281 con el ERSeP                              | [S]                                        |
| 37  | Grado calculado con la superficie semicubierta al 100 %                             | Se toma el 50 % de la semicubierta                                     | [P] 770.7.3                                |
| 38  | Usar 0,7 como coeficiente de simultaneidad en una vivienda de 4 circuitos y 72 m²   | Medio → 0,8 (por cantidad mínima de circuitos)                         | [P] Tabla 770.8.II                         |
| 39  | Caída de tensión de 5 % en un circuito de tomas (770)                               | ≤ 3 % (5 % solo en circuitos exclusivos de motores)                    | [P] 770.15.6                               |
| 40  | Medir la aislación con los artefactos conectados                                    | Con los artefactos desconectados y los interruptores cerrados          | [P] 770.19.5.2                             |
| 41  | MBT con autotransformador                                                           | Transformador de seguridad con devanados separados                     | [P] 770.7.1 g)                             |
| 42  | Flotante de tanque alimentado a 220 V                                               | MBTS                                                                   | [P] 770.7.1 h)                             |
| 43  | Masas de un circuito MBTS puestas a tierra                                          | No van a tierra; las de MBTF sí                                        | [P] 770.7.1 f)                             |
| 44  | Pasillo de 4 m con una sola llave simple                                            | Llaves combinadas en los dos extremos                                  | [P] 770.7.2                                |
| 45  | Grado mínimo con un solo circuito "mixto"                                           | Mínimo 2 circuitos (IUG + TUG); todos bifilares                        | [P] 770.7.4, 770.6.1                       |

---

## 13. Reglas verificables (SI/ENTONCES) para la lógica del juego

Formato pensado para pasar directo a TypeScript. **R** = regla confirmada en fuente primaria; **R?** = sin verificar o parametrizable.

```
# --- Alcance / marco ---
R01  SI potencia_DPMS_kW > 10 O tension != "BT"                     ENTONCES cat3_puede_certificar = false
R02  SI destino ∉ {vivienda_unifamiliar, comercio_chico, industria_chica} ENTONCES cat3_puede_certificar = false
R03  SI tipo == "alumbrado_publico" O tipo == "señalizacion"          ENTONCES requiere = "ingeniero (RG 109/2023)"
R04  SI vivienda_unifamiliar Y In_cabecera ≤ 63 Y Icc_origen_kA ≤ 10  ENTONCES seccion_aplicable = "770" SINO "771"
R05  SI nuevo_suministro O aumento_potencia O cambio_tarifa           ENTONCES exigir certificado_apta
R06  SI P_activa_declarada                                            ENTONCES P_kW = S_VA × max(fp, 0,85) / 1000

# --- Grado y circuitos (770) ---
R10  S_lim = S_cubierta + 0,5 × S_semicubierta
R11  grado = S_lim ≤ 60 ? "minimo" : S_lim ≤ 130 ? "medio" : S_lim ≤ 200 ? "elevado" : "superior"
R12  circuitos_min = {minimo:2, medio:3, elevado:5, superior:6}[grado]
R13  SI grado=="minimo"   ENTONCES IUG ≥ 1 Y TUG ≥ 1
R14  SI grado=="medio"    ENTONCES (IUG≥2 Y TUG≥1) O (IUG≥1 Y TUG≥2)
R15  SI grado=="elevado"  ENTONCES (IUG≥2 Y TUG≥3) O (IUG≥3 Y TUG≥2)
R16  SI grado=="superior" ENTONCES igual que elevado + 1 circuito libre
R17  SI S_lim < 130 Y existe dormitorio > 36 m²  ENTONCES puntos_minimos_de("elevado")
R18? SI seccion=="771" Y DPMS > limite_grado(3,7/7/11 kVA) ENTONCES subir_grado   [S/NV]

# --- DPMS ---
R20  DPMS_IUG_sin_toma = 2/3 × n_bocas × 60 VA
R21  DPMS_IUG_con_toma = 2200 VA ; DPMS_TUG = 2200 VA ; DPMS_TUE = 3300 VA   (mínimos; usar el real si es mayor)
R22  coef = {2:1,0, 3:0,8, 5:0,7, 6:0,6}[circuitos_min(grado)]
R23  carga_total = Σ DPMS_generales × coef + Σ específicos × coef_util × coef_simult
R24  I_proyecto = carga_total / 220 (mono)  |  carga_total / (√3 × 380) (tri)
R25  SI carga_total > 7000 VA O I > 32 A (mono) ENTONCES recomendar trifásico

# --- Límites por circuito ---
R30  SI tipo=="IUG" ENTONCES bocas ≤ 15 Y In ≤ 16 Y S ≥ (tiene_toma ? 2,5 : 1,5)
R31  SI tipo=="TUG" ENTONCES bocas ≤ 15 Y In ≤ 20 Y S ≥ 2,5 Y carga_unitaria ≤ 10 A
R32  SI tipo=="TUE" ENTONCES bocas ≤ 15 Y In ≤ 32 Y S ≥ 2,5 Y carga_unitaria ≤ 20 A (2P+T 20 A) o ≤ 16 A (IEC 60309)
R33  SI linea=="principal" ENTONCES S ≥ 4 ; SI "seccional" ENTONCES S ≥ 2,5 ; PE ≥ 2,5 ; retornos ≥ 1,0
R34  SI toma_en_IUG Y altura < 0,90 m ENTONCES error
R35  SI toma altura ≤ 0,90 m ENTONCES tipo = "2x10+T IRAM 2071 con pantalla"
R36  SI caja 5x10 ENTONCES tomas ≤ 2 ; SI caja 10x10 ENTONCES tomas ≤ 4

# --- Conductores / protección ---
R40  Iz = Iz_tabla(S, mono|tri) × f_agrup(n_circuitos_en_caño) × f_temp
R41  SI NO (Ib ≤ In ≤ Iz) ENTONCES error "sobrecarga mal coordinada"
R42  SI norma_PIA != "IEC 60898-1" ENTONCES error (en 770)
R43  SI PIA.polos < 2 (mono) O PIA.marca=="1P+N" ENTONCES error
R44  SI PIA.Icn < Icc_punto ENTONCES error
R45  SI k² × S² < I²t_dispositivo (k=115 Cu/PVC) ENTONCES cable no protegido contra cortocircuito
R46  SI circuito_terminal Y NO aguas_abajo_de(ID con IΔn ≤ 30 mA, no retardado) ENTONCES error
R47  SI ID.In < max(ITM_aguas_arriba.In) Y ID.In < Σ PIA_aguas_abajo.In ENTONCES error "ID subdimensionado"
R48  SI ID aguas arriba de otro ID Y ID_up.IΔn > 30 mA ENTONCES ID_up.IΔn ≤ 300 mA Y recomendado tipo "S"
R49  SI carga == motor ENTONCES requiere protección de sobrecarga dedicada (no alcanza el PIA) ; SI trifásico ENTONCES detector falta de fase
R50? SI carga ∈ {inversor, lavarropas inverter, cargador VE} ENTONCES recomendar ID tipo A (o F/B)   [NV]

# --- Tablero ---
R60  orden_TP = [cabecera(ITM bipolar ≤63 A | ID si el TPA protege), (DPS?), ID 30 mA, PIA×n]
R61  SI cabecera.In > 63 ENTONCES seccion = "771"
R62  SI tablero.IP < IP41 (y no IP31D) ENTONCES error ; SI intemperie Y IP < 54 ENTONCES error
R63  SI reserva < 20 % ENTONCES error ; SI sin_cartel_riesgo(≥40 mm) ENTONCES error
R64  SI ubicacion ∈ {baño, mueble, bajo_mesada, hueco} ENTONCES error
R65  SI distancia(TP, medidor) > 2 m ENTONCES error (salvo acuerdo)
R66  SI altura_mando ∉ [0,40 ; 2,00] m ENTONCES error
R67  SI alimentado_por_bornes_inferiores Y sin_cartel ENTONCES error
R68  SI cables_por_borne > 1 Y borne no apto ENTONCES error

# --- DPS ---
R70  SI pararrayos ENTONCES DPS obligatorio
R71  SI red_aerea Y AQ > 25 días/año Y sin analisis_riesgo ENTONCES DPS obligatorio
R72  SI red_subterranea ENTONCES DPS no obligatorio (recomendado según riesgo)

# --- PAT ---
R80  SI esquema != "TT" ENTONCES error
R81  SI Ra > 40 Ω ENTONCES error
R82  SI distancia(jabalina, PAT_servicio) ≤ 10 × Re ENTONCES error "tierra no independiente"
R83  SPE = S ≤ 16 ? S : S ≤ 35 ? 16 : S/2 ; SPE ≥ 2,5 ; S_cable_PAT ≥ 4
R84  SI masas conectadas en serie (guirnalda) O PE seccionado ENTONCES error
R85  SI sin cámara de inspección ENTONCES error

# --- Colores ---
R90  SI rol=="PE"  ENTONCES color == "verde-amarillo"
R91  SI color ∈ {verde-amarillo, verde, amarillo} Y rol != "PE" ENTONCES error
R92  SI rol=="N"   ENTONCES color ∈ {celeste, azul}
R93  SI color ∈ {celeste, azul} Y rol != "N" ENTONCES error
R94  SI rol=="fase" Y color ∉ {marrón, negro, rojo} ENTONCES requiere identificación en ambos extremos
R95  SI rol=="retorno" Y color ∈ {marrón, negro, rojo} ENTONCES requiere identificación (anillo) en ambos extremos

# --- Canalizaciones ---
R100 SI cable=="NM 247-3" Y (enterrado O sin_canalización) ENTONCES error
R101 SI enterrado Y profundidad < 0,70 m ENTONCES error
R102 SI curvas_entre_cajas > 3 ENTONCES error
R103 SI area_cables / area_interna_caño > 0,35 (casos fuera de tabla) ENTONCES error
R104 SI circuito ∈ {principal, seccional} Y d_int_caño < 15 mm ENTONCES error ; SI terminal Y d_int < 13 mm ENTONCES error
R105 SI caño_metálico Y n_unipolares == 1 ENTONCES error

# --- Caída de tensión ---
R110 ΔU = c(S) × I × L_km  (mono, tabla)   |   ΔU = k·I·L·(R cosφ + X senφ), k = 2 o √3
R111 SI circuito terminal Y ΔU% > 3 ENTONCES error
R112 SI circuito solo motores Y (ΔU%_régimen > 5 O ΔU%_arranque > 15) ENTONCES error
R113 SI seccional Y ΔU% > 1 ENTONCES advertencia

# --- Verificación final ---
R120 SI R_aislación < 0,5 MΩ (ensayo 500 V CC, circuito ≤ 500 V) ENTONCES no apto
R121 SI ID no dispara con IΔn inyectada ENTONCES no apto
R122 SI polaridad de toma incorrecta ENTONCES no apto
```

---

## 14. Datos listos para JSON (resumen)

```json
{
  "grados770": [
    { "id": "minimo", "maxM2": 60, "circMin": 2, "coef": 1.0 },
    { "id": "medio", "maxM2": 130, "circMin": 3, "coef": 0.8 },
    { "id": "elevado", "maxM2": 200, "circMin": 5, "coef": 0.7 },
    { "id": "superior", "maxM2": null, "circMin": 6, "coef": 0.6 }
  ],
  "circuitos770": {
    "IUG": {
      "maxBocas": 15,
      "maxIn": 16,
      "minS": 1.5,
      "minSConToma": 2.5,
      "dpms": "2/3*n*60 | 2200 con toma"
    },
    "TUG": { "maxBocas": 15, "maxIn": 20, "minS": 2.5, "dpms": 2200 },
    "TUE": { "maxBocas": 15, "maxIn": 32, "minS": 2.5, "dpms": 3300 }
  },
  "seccionesMin770": {
    "principal": 4,
    "seccional": 2.5,
    "IUG": 1.5,
    "TUG": 2.5,
    "TUE": 2.5,
    "especifico": 2.5,
    "MBTF": 1.5,
    "retorno": 1.0,
    "PE": 2.5,
    "cablePAT": 4
  },
  "Iz_247_3_mono": {
    "1": 11,
    "1.5": 15,
    "2.5": 21,
    "4": 28,
    "6": 36,
    "10": 50,
    "16": 66,
    "25": 88,
    "35": 109
  },
  "Iz_247_3_tri": {
    "1": 10,
    "1.5": 14,
    "2.5": 18,
    "4": 25,
    "6": 32,
    "10": 44,
    "16": 59,
    "25": 77,
    "35": 96
  },
  "fAgrup": { "2mono": 0.8, "3mono": 0.7, "2tri": 0.8, "3tri": 0.7 },
  "caidaVAkm": {
    "1.5": 26,
    "2.5": 15,
    "4": 10,
    "6": 6.5,
    "10": 3.8,
    "16": 2.4,
    "25": 1.6,
    "35": 1.2,
    "50": 0.8
  },
  "caidaMax": {
    "terminal": 3,
    "motoresRegimen": 5,
    "motoresArranque": 15,
    "seccionalRecomendado": 1
  },
  "pat": { "esquema": "TT", "RaMax": 40, "distMin": "10*Re", "jabalina": "IRAM 2309" },
  "colores": {
    "L1": "marron",
    "L2": "negro",
    "L3": "rojo",
    "N": "celeste",
    "PE": "verde-amarillo"
  },
  "tablero": {
    "ipMin": "IP41|IP31D",
    "ipIntemperie": "IP54",
    "reservaPct": 20,
    "alturaMando": [0.4, 2.0],
    "distMedidorMax": 2,
    "simboloRiesgoMinMm": 40
  },
  "aislacion": {
    "MBT": { "Vtest": 250, "Rmin_MOhm": 0.25 },
    "le500V": { "Vtest": 500, "Rmin_MOhm": 0.5 }
  },
  "cat3": { "maxKW": 10, "tension": "BT", "vigenciaAnios": 3, "fpMin": 0.85 }
}
```

---

## 15. Fuentes

### Primarias (leídas)

- **AEA 90364-7-770 Ed. 2017**, texto completo (copia publicada por la Municipalidad de Junín): https://www.junin.gob.ar/sites/default/files/programas/archivos/reglamento_aea.pdf
- AEA 90364-7-770 Ed. 2016, **borrador para discusión pública** (UTN FRRQ): https://frrq.cvg.utn.edu.ar/pluginfile.php/6787/mod_resource/content/1/770_2016_Viviendas_4.0_para_Discusi%C3%B3n_P%C3%BAblica.pdf
- **ERSeP, Carpeta Técnica Modelo para el Certificado de Instalación Eléctrica Apta**: https://ersep.cba.gov.ar/wp-content/uploads/2022/05/Carpeta_Tecnica_Modelo.pdf
- **RG ERSeP 5/2016** (reglamentación aplicable, alcance Cat. III ≤ 10 kW, certificados): https://www.cba.gov.ar/wp-content/4p96humuzp/2015/12/Resoluci%c3%b3n-General-N%c2%b0-52016-normativa-de-la-ley-de-seguridad-de-Electricistas.pdf
- RG ERSeP 46/2017 (exigibilidad desde el 01/12/2017): https://ersep.cba.gov.ar/wp-content/uploads/2021/04/RG-46-2017-Inicio-régimen-de-seguridad-eléctrica-.pdf
- RG ERSeP 43/2017 (Registro) y su Anexo: https://ersep.cba.gov.ar/wp-content/uploads/2021/04/RG-43-2017-Modificatoria-Anexo-I-RG-49-2016-Seguridad-Eléctrica-1.pdf y https://ersep.cba.gov.ar/wp-content/uploads/2021/04/RG-43-2017-Anexo.pdf
- RG ERSeP 109/2023 (modifica la RG 50/2017, incumbencias): https://ersep.cba.gov.ar/wp-content/uploads/2024/05/RG-109-2023-0521-071769-2023-Resolucion-Modificatoria-50-2017-determinacion-de-incumbencias-V2-1.docx_firmado_firmado_firmado_firmado_firmado_firmado.pdf
- RG ERSeP 17/2021, Anexo II (programa Cat. III): https://ersep.cba.gov.ar/wp-content/uploads/2021/09/RG-17-2021-ANEXO-II_firmado_firmado_firmado_firmado.pdf
- Resolución ERSeP 2026/041 (incorporación de idóneos, enero 2026): https://ersep.cba.gov.ar/wp-content/uploads/2026/01/rp2026_041.pdf
- **UTN FRC, Programa del Curso Electricista Habilitado Cat. III 2025**: https://portalseu.frc.utn.edu.ar/wp-content/uploads/2024/02/Programa-Curso-Electricista-Habilitado-Cat-III-UTN-2025.pdf

### Secundarias

- Editores, "La regla de las instalaciones eléctricas domiciliarias" (oct-2025, AEA 770, 63 A): https://www.editores-srl.com.ar/sites/default/files/si_aea_20251012_la_regla_de_las_instalaciones_electricas_domiciliarias.pdf
- Editores, "Todo sobre AEA 90364" (sep-2024): https://editores-srl.com.ar/sites/default/files/aea_20240923_todo_sobre_instalaciones_electricas_todo_sobre_aea_90364.pdf
- Manili y García del Corro (AEA), "Res. SRT 900/2015 y el marco legal" (Editores): https://www.editores-srl.com.ar/sites/default/files/ie305_manili_resolucion_900_2015.pdf
- UTN FRRO, "Proyecto de instalaciones eléctricas v3" (771): https://www.frro.utn.edu.ar/repositorio/catedras/civil/inst_electricas/Proyecto_de_instalaciones_electricas_v3.pdf
- UNLP, apuntes de cátedra (secciones mínimas y grados): https://yold.unlp.edu.ar/frontend/media/93/33793/6d2d12202e23fd66b3c5f9f0a21797fd.pdf y https://yold.unlp.edu.ar/frontend/media/91/33791/6f44bd367190f49f3ee5a5f01c608b81.pdf
- UNS, índice y notas de la AEA 771: https://servicios.uns.edu.ar/institucion/conc_nd/docs/material/C686-M631.pdf
- UTN FRSC, presentación (ENRE 207/95 reemplazada por la 269/12): https://www.frsc.utn.edu.ar/web/wp-content/uploads/2022/10/Presentacion-FRSC.pdf
- Municipalidad de Rosario, requisitos de la gráfica de instalaciones (IRAM / AEA): https://www.rosario.gob.ar/inicio/sites/default/files/2023-03/Gr%C3%A1fica%20Instalaciones.doc

### No conseguidas (huecos a cubrir con el material del curso)

- Guía AEA "Instalación eléctrica en inmuebles hasta 10 kW" (2011).
- **Manual del Instalador Electricista Cat. III del ERSeP.**
- AEA 90364-7-771 (2006): tablas de grados de oficinas y locales, IUE/TUE de 12 bocas, límites de 3,7/7/11 kVA.
- RG ERSeP 26/2015, 50/2017, 54/2018, 11/2018 y 84/2018 (textos completos).
- EPEC ET21.
- Texto de la Ley 10281 y del Anexo del Dec. 1022/2015 (los conozco por citas en resoluciones del ERSeP).
- IRAM 2010 / IEC 60617 (tabla de símbolos).
- ENRE 269/12.
