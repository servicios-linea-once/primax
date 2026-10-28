El **Master Roadmap Definitivo de `@servicio-linea-once/primax**` consolida en un solo documento de ingeniería las **9 familias de componentes (+45 componentes)**, la **serie secuencial de Cards (`01` a `08`)**, los **4 temas prediseñados**, el **puente nativo con Inertia.js** y la regla obligatoria de **Documentación + Visualización en Vivo por cada componente**, listo para ejecutarse en **Antigravity**.

---

# 🏛️ Especificación Maestra: `@servicio-linea-once/primax`

### 1. Reglas Inquebrantables de Arquitectura

1. **El Triplete de Entrega (DSDD):** Ningún componente se marca como completado sin entregar simultáneamente:

* **Código Fuente & Tipos:** `packages/primax/src/components/<component>/` (`.vue`, `.types.ts`, `index.ts`).
* **Visualización en Vivo (Demo):** `apps/docs/demos/<component>/` (Muestras interactivas de variantes, tamaños, estados y PassThrough).
* **Documentación Técnica:** `apps/docs/pages/components/<component>.md` (Guía de uso, anatomía visual de PassThrough y tablas de API: Props, Eventos, Slots y claves `pt`).

1. **Cero Dependencias UI de Terceros:** Todas las primitivas DOM y de accesibilidad se construyen internamente en `src/composables/` (solo se permite `@floating-ui/dom`, `clsx` y `tailwind-merge`).
2. **Cero Bloques `<style>` en Componentes:** Todo el estilizado se resuelve con clases de Tailwind CSS procesadas por `resolvePT()` y variables CSS de temas.
3. **SSR & Hydration Safe:** Uso estricto de `useId()` determinista y acceso a `window`/`document` únicamente dentro de `onMounted`.

---

### 2. Estructura Definitiva del Monorepo

```text
primax-ecosystem/
├── packages/
│   └── primax/                           # Paquete NPM: @servicio-linea-once/primax
│       ├── src/
│       │   ├── composables/              # Primitivas Headless y gestores globales
│       │   ├── components/               # Las 8 familias de componentes UI
│       │   │   ├── buttons/
│       │   │   ├── cards/                # Serie secuencial 01 — 08
│       │   │   ├── forms/
│       │   │   ├── data/
│       │   │   ├── panels/
│       │   │   ├── overlays/
│       │   │   ├── navigation/
│       │   │   └── feedback/
│       │   ├── inertia/                  # Módulo @servicio-linea-once/primax/inertia
│       │   ├── tailwind/                 # Módulo @servicio-linea-once/primax/tailwind
│       │   ├── themes/                   # aura.css, lara.css, nora.css, obsidian.css
│       │   ├── types/                    # Contratos globales TypeScript
│       │   ├── utils/                    # cn.ts, resolvePT.ts
│       │   └── index.ts                  # Plugin createPrimax() y exports
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── apps/
│   └── docs/                             # Portal VitePress de Documentación y Demos en Vivo
│       ├── .vitepress/
│       ├── components/                   # <ComponentPreview>, <PtViewer>, <ApiTable>, <ThemeBar>
│       ├── demos/                        # Demos interactivos por cada componente
│       └── pages/                        # Páginas Markdown (.md) de toda la librería
├── pnpm-workspace.yaml
└── package.json

```

---

# 🚀 Cronograma Secuencial de Fases (12 Fases)

```
[F1: Monorepo & Docs] ──► [F2: Motor PT & Temas] ──► [F3: Primitivas Headless]
                                                              │
┌─────────────────────────────────────────────────────────────┘
▼
[F4: Botones & Feedback] ──► [F5: Cards 01-08] ──► [F6: Forms I] ──► [F7: Forms II]
                                                                           │
┌──────────────────────────────────────────────────────────────────────────┘
▼
[F8: Puente Inertia] ──► [F9: Paneles & Nav] ──► [F10: Overlays] ──► [F11: Data Engine] ──► [F12: Release]

```

---

## FASE 1: Infraestructura del Monorepo, Bundler y Portal de Documentación

**Objetivo:** Configurar la compilación del paquete y levantar el visor interactivo VitePress con recarga en caliente (HMR).

* **1.1 Workspace:** Crear `pnpm-workspace.yaml` conectando `packages/primax` y `apps/docs`.
* **1.2 Bundler Multi-Export (`packages/primax/vite.config.ts`):**
* Configurar puntos de entrada: `.` (`src/index.ts`), `./inertia` (`src/inertia/index.ts`), `./tailwind` (`src/tailwind/index.ts`) y copia estática de `./themes/*`.
* Integrar `vite-plugin-dts` para generación estricta de `.d.ts`.

* **1.3 Motor del Visor (`apps/docs/`):**
* Configurar VitePress + Tailwind CSS con alias directo a `packages/primax/src`.
* Construir los 4 bloques del visor de documentación:
* `<ThemeFloatingBar/>`: Selector superior persistente (Aura, Lara, Nora, Obsidian + Toggle Light/Dark).
* `<ComponentPreview/>`: Pestaña de renderizado en vivo + pestaña de código fuente con botón de copiado.
* `<PtViewer/>`: Inspector interactivo que resalta las secciones DOM de PassThrough del componente.
* `<ApiTable/>`: Renderizador estandarizado de tablas para Props, Eventos, Slots y claves `pt`.

---

## FASE 2: Motor PassThrough (`pt`), Tokens y Los 4 Temas Prediseñados

**Objetivo:** Construir el sistema de diseño sin CSS en runtime y su documentación visual interactiva.

* **2.1 Contratos y Resolución (`src/types/` y `src/utils/`):**
* Definir `PassThroughContext`, `PassThroughValue`, `ComponentPassThrough` y `PrimaxOptions`.
* Implementar `cn()` (`clsx` + `tailwind-merge`), `resolvePT()` (prioridad: Base $\rightarrow$ Global Plugin $\rightarrow$ Prop `:pt` local) y el composable `usePassthrough()`.

* **2.2 Temas y Preset Tailwind (`src/themes/` y `src/tailwind/`):**
* Crear las 4 hojas de tokens CSS:
* **`aura.css`**: Esmeralda orgánico, bordes suaves (`0.625rem`).
* **`lara.css`**: Índigo corporativo, corte clásico (`0.375rem`).
* **`nora.css`**: Ámbar industrial, alto contraste, esquinas rectas (`0.125rem`).
* **`obsidian.css`**: Monocromático OLED negro/blanco de lujo (`0.5rem`).

* Exportar el preset en `src/tailwind/index.ts` y el gestor `useTheme.ts`.

* **2.3 Docs & Visualización (`apps/docs/pages/guide/`):**
* Página `theming.md` con matriz interactiva de colores en vivo y página `passthrough.md` con editor en tiempo real de clases `pt`.

---

## FASE 3: Las 7 Primitivas Headless y Accesibilidad WAI-ARIA

**Objetivo:** Construir los motores de física de interfaz, foco y teclado desde cero.

| Código | Composable | Responsabilidad Técnica | Demo en `apps/docs/pages/primitives/` |
| --- | --- | --- | --- |
| **3.1** | `useId.ts` | Generación de IDs únicos SSR-safe para enlazar labels y errores ARIA. | Inspector de atributos ARIA autogenerados. |
| **3.2** | `useControllable.ts` | Sincronización dual: funciona con `v-model` externo o estado reactivo interno. | Comparativa visual Controlled vs Uncontrolled. |
| **3.3** | `useClickOutside.ts` | Detección de clics fuera del contenedor respetando portales anidados (`data-primax-portal`). | Caja interactiva con contador de clics externos. |
| **3.4** | `useScrollLock.ts` | Bloqueo de scroll del `<body>` compensando `padding-right` del scrollbar. | Toggle de bloqueo sin salto horizontal de layout. |
| **3.5** | `useFocusTrap.ts` | Captura cíclica de `Tab` / `Shift+Tab` y restauración al elemento origen al cerrar. | Zona de foco atrapado con indicadores visuales. |
| **3.6** | `useFloating.ts` | Posicionamiento dinámico con `@floating-ui/dom` (`offset`, `flip`, `shift`, `arrow`, `size`). | Contenedor con scroll mostrando auto-flip en bordes. |
| **3.7** | `useKeyboardNavigation.ts` | Navegación de listas con `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, `Escape`. | Lista navegable íntegramente por teclado. |

---

## FASE 4: Botones, Acciones e Indicadores Atómicos (Con Docs + Demos)

**Objetivo:** Construir los componentes base que serán reutilizados por el resto del ecosistema.

| Orden | Componente | Variantes y Capacidades Clave | Secciones `pt` Expuestas |
| --- | --- | --- | --- |
| **4.1** | **`Button`** | Variantes: `primary`, `secondary`, `outlined`, `ghost`, `danger`, `glass`. Tamaños: `sm`, `md`, `lg`. Estado `loading` e iconos. | `root`, `label`, `icon`, `spinner` |
| **4.2** | **`ButtonGroup` & `SplitButton**` | Agrupación sin bordes duplicados y botón con menú desplegable de acciones secundarias. | `root`, `mainButton`, `menuButton`, `menu` |
| **4.3** | **`SpeedDial`** | Botón flotante (FAB) con despliegue radial o lineal de acciones rápidas. | `root`, `trigger`, `list`, `item`, `action` |
| **4.4** | **`Badge` & `Tag**` | Severidades (`success`, `info`, `warn`, `danger`, `contrast`), modo píldora y contador numérico. | `root`, `icon`, `label`, `removeButton` |
| **4.5** | **`Avatar` & `AvatarGroup**` | Imagen, iniciales o icono; indicador de estado (`online`/`offline`/`busy`); apilamiento con contador `+N`.

 | `root`, `image`, `label`, `statusDot`, `group` |
| **4.6** | **`Skeleton` & `ProgressBar**` | Formas (`text`, `circle`, `rectangle`) con pulso suave y barra de progreso determinada/indeterminada. | `root`, `fill`, `label` |
| **4.7** | **`Alert` (Message)** | Banners estáticos cerrables con icono de severidad y acciones integradas. | `root`, `icon`, `wrapper`, `title`, `content`, `closeButton` |

---

## FASE 5: Suite Secuencial `Card` (`01` al `08` — Con Showcase Triple)

**Objetivo:** Implementar los 8 modelos numerados de tarjetas combinando las 5 superficies de diseño y los 3 presets compuestos.

### 5.1 Motor de Superficies (`<PrimaxCard :model="..."/>`)

* **`01 — Glassmorphism` (`01-glassmorphism`):** Cristal translúcido (`backdrop-blur-xl`), borde especular brillante y sombras suaves.

* *Showcase en Docs:* Tarjeta central *Explore Beautiful Destinations* + laterales *Sophie Carter Profile* y *Special Offer 50% Off*.

* **`02 — Neumorphism` (`02-neumorphism`):** Superficie mate extruida con doble sombra proyectada suave y controles en relieve/hundidos.

* *Showcase en Docs:* Tarjeta central *Feel the Difference* + laterales *Appearance Light/Dark/Auto* y *Upgrade Plan*.

* **`03 — Minimal Editorial` (`03-minimal-editorial`):** Tipografía serif de revista, numeración (`01 / 05`), líneas divisoras finas y mucho aire negativo.

* *Showcase en Docs:* Tarjeta central *A Softer Way of Living* + laterales *Effortless Elegance* y *A Calmer Mindset*.

* **`04 — Bold Gradient` (`04-bold-gradient`):** Malla de gradientes vibrantes (índigo, púrpura, ámbar), textos blancos de alto impacto y CTA tipo píldora.

* *Showcase en Docs:* Tarjeta central *Limitless Possibilities* + laterales *Get 50% Off Today* y *Live Event Design Tomorrow*.

* **`05 — Dark Luxury` (`05-dark-luxury`):** Fondo negro obsidiana profundo (`#0B0A09`), bordes dorados metálicos y tipografía serif dorada.

* *Showcase en Docs:* Tarjeta central *Timeless Elegance* + laterales *Premium Membership* y *Limited Edition Aurora*.

### 5.2 Presets Especializados Compuestos

* **`06 — E-commerce Product` (`<ProductCard/>`):** Badge superior (`BEST SELLER` / `NEW` / `20% OFF`), botón flotante de wishlist (`heart`), contenedor de imagen con iluminación suave, título, subtítulo, rating de estrellas con conteo de reseñas, bloque de precio actual + precio original tachado y botón ancho `Add to Cart`.

* *Showcase en Docs:* Trío en vivo con *Nova Pro Headphones*, *Luna Handbag* y *Bloom Perfume*.

* **`07 — Profile / Social` (`<ProfileCard/>`):** Pill superior de rol (`Creator`), menú de 3 puntos, avatar circular con anillo y punto verde de estado online, nombre con check azul de verificado, bio, grilla dividida de 3 métricas (`Posts`, `Followers`, `Following`), botón `Follow` + botón de mensaje directo y tira inferior de 5 miniaturas redondeadas.

* *Showcase en Docs:* Trío en vivo con *Sophie Carter*, *Global Creators Community* y *Creator Spotlight Quote*.

* **`08 — Dashboard / Stats` (`<StatsCard/>`):** Título de métrica, cifra principal masiva (`$24,890`), pill de tendencia positiva/negativa (`+12.5% vs last month`), gráfico SVG de área suave con tooltip flotante (`$4,280`) y fila inferior de 3 sub-tarjetas KPI con icono (`Total Orders`, `Active Users`, `Avg. Order`).

* *Showcase en Docs:* Trío en vivo con *Total Revenue*, *Audience Donut Chart 64%* y *Sales Overview Bar Chart*.

---

## FASE 6: Form Engine Parte I — Entradas de Texto, Numéricas y Máscaras (Con Docs + Demos)

**Objetivo:** Construir los controles de texto y número con soporte de addons, formateo e integración reactiva.

| Orden | Componente | Características Técnicas y Visualizaciones | Secciones `pt` Expuestas |
| --- | --- | --- | --- |
| **6.1** | **`InputText`** | Iconos prefijo/sufijo, grupos de addons (`https://`, `@`), botón `clearable`, tamaños `sm`/`md`/`lg`, estado `invalid`. | `root`, `input`, `prefix`, `suffix`, `addon`, `clearButton` |
| **6.2** | **`InputNumber`** | Formateo `Intl.NumberFormat` (monedas `PEN`, `USD`, porcentajes, decimales), límites `min`/`max`, botones `+/-` horizontales o apilados. | `root`, `input`, `buttonGroup`, `incrementButton`, `decrementButton` |
| **6.3** | **`Password`** | Toggle de visibilidad accesible + barra desplegable con medidor de fortaleza y checklist de requisitos en vivo. | `root`, `input`, `toggleButton`, `panel`, `meter`, `meterLabel` |
| **6.4** | **`Textarea`** | Crecimiento automático vertical (`autoResize`), contador de caracteres restantes y estado de error. | `root`, `textarea`, `footer`, `counter` |
| **6.5** | **`InputMask` & `InputOtp**` | Máscaras personalizables (DNI, RUC, teléfono, tarjetas) y entrada de código de verificación por cajas con auto-avance y soporte de pegado (`paste`). | `root`, `input`, `box`, `separator` |

---

## FASE 7: Form Engine Parte II — Selección, Fechas y Archivos (Con Docs + Demos)

**Objetivo:** Desarrollar los selectores avanzados basados en `useFloating` y `useKeyboardNavigation`.

| Orden | Componente | Características Técnicas y Visualizaciones | Secciones `pt` Expuestas |
| --- | --- | --- | --- |
| **7.1** | **`Checkbox` & `Radio**` | Booleano simple, binding a arrays múltiples, estado `indeterminate` y tarjetas seleccionables completas. | `root`, `box`, `input`, `icon`, `label` |
| **7.2** | **`ToggleSwitch`** | Interruptor accesible (`role="switch"`), iconos personalizables en el thumb (check/cross) y tamaños. | `root`, `slider`, `thumb`, `icon`, `input` |
| **7.3** | **`Select` (Dropdown)** | Selector simple con buscador local integrado (`filterable`), opción `clearable`, agrupación de opciones y slot `#option` para avatares/iconos. | `root`, `trigger`, `label`, `dropdownIcon`, `panel`, `filterInput`, `list`, `option`, `emptyMessage` |
| **7.4** | **`MultiSelect`** | Selección múltiple con visualización resumida (`3 seleccionados`) o modo `chips`/`tags`, checkbox "Seleccionar todos". | `root`, `trigger`, `chip`, `chipRemoveIcon`, `panel`, `header`, `list`, `option` |
| **7.5** | **`Combobox` (AutoComplete)** | Búsqueda predictiva asíncrona con debounce, resaltado de coincidencias y creación de nuevas etiquetas al vuelo. | `root`, `input`, `loadingIcon`, `panel`, `list`, `option` |
| **7.6** | **`DatePicker`** | Calendario emergente propio (día, mes, año), selección de fecha única, rango de fechas (`start` - `end`), selector de hora y presets rápidos (*Hoy*, *Últimos 7 días*). | `root`, `input`, `panel`, `header`, `title`, `navButton`, `grid`, `dayCell`, `timePicker` |
| **7.7** | **`FileUpload`** | Zona Drag & Drop con validación de tamaño/MIME, galería de previsualización de imágenes y barra de progreso conectada a `form.progress` de Inertia. | `root`, `dropzone`, `input`, `previewList`, `fileItem`, `progressBar`, `removeButton` |
| **7.8** | **`Slider` & `Rating**` | Selector deslizante de uno o dos pulgares (rango de precios) y calificador de estrellas interactivo con soporte de medias estrellas.

 | `root`, `track`, `range`, `thumb`, `starIcon` |

---

## FASE 8: Puente Nativo con Inertia.js (`@servicio-linea-once/primax/inertia`)

**Objetivo:** Conectar automáticamente los componentes de las Fases 4, 6 y 7 con el ciclo de vida de `useForm()` y `<Link>` de Inertia.

* **8.1 `<InertiaForm :form="form">` (`src/inertia/InertiaForm.vue`):**
* Provee la instancia reactiva del formulario mediante `provide('primax_inertia_form')`.
* Propaga automáticamente `disabled="true"` a todos los controles hijos y `loading="true"` al botón `type="submit"` mientras `form.processing` está activo.

* **8.2 `<InertiaFormField hint="..." label="..." name="campo">`:**
* Enlaza automáticamente el `v-model` del input hijo con `form[name]` sin declararlo manualmente en el input.
* Escucha `form.errors[name]`: si existe error, inyecta `invalid="true"` al componente hijo y despliega el mensaje de validación animado con enlace `aria-describedby`.
* Limpia automáticamente el error del campo apenas el usuario vuelve a escribir (`form.clearErrors(name)`).

* **8.3 `<InertiaLinkButton>`:**
* Componente `Button` de Primax que renderiza internamente un `<Link>` de Inertia conservando todas las variantes visuales (`primary`, `outlined`, `glass`, etc.) y soportando `href`, `method`, `data`, `preserve-scroll` y `prefetch`.

* **8.4 Simulador en Vivo en Documentación (`apps/docs/pages/inertia/forms.md`):**
* Panel interactivo donde el usuario prueba un formulario completo haciendo clic en *"Simular Submit 200 OK"* o *"Simular Error 422 de Laravel"* viendo la inyección automática de errores en tiempo real.

---

## FASE 9: Paneles, Estructura y Navegación (Con Docs + Demos)

**Objetivo:** Construir los componentes de organización espacial y navegación de aplicaciones SaaS/ERP.

| Orden | Componente | Características Técnicas y Visualizaciones | Secciones `pt` Expuestas |
| --- | --- | --- | --- |
| **9.1** | **`Tabs` (`TabView`/`TabPanel`)** | Pestañas con indicador activo deslizante animado, soporte de iconos/badges y carga perezosa (`lazy`). | `root`, `nav`, `tab`, `activeBar`, `panelContainer`, `panel` |
| **9.2** | **`Accordion`** | Expansión única o múltiple con transiciones suaves de altura y cabeceras personalizables. | `root`, `item`, `header`, `trigger`, `icon`, `content` |
| **9.3** | **`Divider` & `Toolbar**` | Separadores horizontales/verticales con etiqueta central y barra de herramientas superior para módulos. | `root`, `line`, `content`, `start`, `center`, `end` |
| **9.4** | **`Splitter`** | Paneles divididos (horizontal o vertical) redimensionables arrastrando el manejador central con soporte táctil. | `root`, `panel`, `gutter`, `gutterHandle` |
| **9.5** | **`Breadcrumb` & `Steps**` | Migas de pan integradas con Inertia y asistente paso a paso (`Stepper`) lineal o interactivo. | `root`, `list`, `item`, `link`, `separator`, `stepNumber` |
| **9.6** | **`DropdownMenu` & `Menu**` | Menú contextual y desplegable con submenús en cascada, atajos visuales (`⌘K`) y navegación por flechas. | `root`, `trigger`, `panel`, `list`, `groupLabel`, `item`, `icon`, `shortcut` |
| **9.7** | **`Menubar` & `CommandPalette**` | Barra de navegación superior/lateral responsiva y buscador global modal (`Ctrl+K` / `Cmd+K`) con filtrado instantáneo de rutas. | `root`, `input`, `resultsList`, `category`, `item`, `footer` |

---

## FASE 10: Overlays, Portales y Feedback Imperativo (Con Docs + Demos)

**Objetivo:** Implementar capas modales accesibles y servicios globales de notificación conectados a Laravel.

| Orden | Componente / Servicio | Características Técnicas y Visualizaciones | Secciones `pt` Expuestas |
| --- | --- | --- | --- |
| **10.1** | **`Dialog` (Modal)** | Renderizado en `<Teleport to="body">`, `useFocusTrap`, `useScrollLock`, tamaños (`sm` a `full`), maximizable y cierre con `Escape`. | `mask`, `root`, `header`, `title`, `headerActions`, `closeButton`, `content`, `footer` |
| **10.2** | **`Drawer` (Sidebar)** | Panel deslizable desde `left`, `right`, `top`, `bottom` con tamaños configurables y fondo translúcido. | `mask`, `root`, `header`, `title`, `closeButton`, `content`, `footer` |
| **10.3** | **`Popover` & `Tooltip**` | Panel flotante para filtros/perfiles y directiva `v-tooltip` de posicionamiento inteligente con flecha direccional. | `root`, `content`, `arrow` |
| **10.4** | **`Toast` & `useInertiaFlash**` | Servicio `useToast()` + `<ToastContainer/>` en 6 posiciones + watcher automático de `$page.props.flash` (`success`, `error`, `warning`, `info`). | `container`, `root`, `icon`, `content`, `title`, `description`, `closeButton`, `progressBar` |
| **10.5** | **`ConfirmDialog` (`useConfirm`)** | API basada en promesas (`const ok = await confirm({ title, message, variant: 'danger' })`) sin declarar modales repetitivos en cada plantilla. | `mask`, `root`, `icon`, `header`, `message`, `footer`, `acceptButton`, `rejectButton` |
| **10.6** | **`Image` & `Carousel**` | Imagen con vista previa a pantalla completa (Lightbox con zoom/rotación) y carrusel responsivo con soporte swipe. | `root`, `image`, `previewMask`, `toolbar`, `track`, `slide`, `indicators` |

---

## FASE 11: Data Engine — `DataTable`, `ServerDataTable` y `DataView` (Con Docs + Demos)

**Objetivo:** Superar el `DataTable` de PrimeVue con soporte nativo para `LengthAwarePaginator` de Laravel y sincronización automática con el router de Inertia.

* **11.1 `DataTable.vue`, `Column.vue` y `Paginator.vue` (Modo Cliente):**
* Ordenamiento simple y múltiple, filtrado global y por columna en memoria.
* Selección de filas (única, múltiple con checkbox e `indeterminate`, barra flotante de acciones masivas).
* Expansión de filas (`#expansion="{ row }"`) para ver detalles sin salir de la tabla.
* Columnas fijas (`frozen`) y cabeceras fijas (`sticky header`).
* Transición automática a filas `Skeleton` cuando `loading="true"`.

* **11.2 `ServerDataTable.vue` (Modo Inertia Server-Side):**
* Acepta directamente `:data="$page.props.users"` (estructura `LengthAwarePaginator` de Laravel).
* Composable `useTableUrlSync`: sincroniza búsqueda global (con debounce de `300ms`), filtros por columna, `sort_by`, `sort_dir`, `page` y `per_page` ejecutando `router.get()` con `{ preserveState: true, preserveScroll: true, replace: true, only: [resourceKey] }`.

* **11.3 `DataView.vue`, `Timeline.vue` y `Tree.vue`:**
* `DataView`: Contenedor con barra de herramientas que alterna entre vista de lista y cuadrícula renderizando las tarjetas `06 — E-commerce Product` o `07 — Profile / Social`.

* `Timeline` y `Tree`: Línea de tiempo de eventos y árbol jerárquico con selección por checkboxes.

* **11.4 Simulador Laravel en Documentación (`apps/docs/pages/components/datatable.md`):**
* Demo interactivo con 100 registros paginados que muestra en vivo cómo muta la barra de direcciones URL (`?page=2&sort_by=price&sort_dir=desc&search=nova`) con skeleton loaders reales.

---

## FASE 12: "Primax Theme Studio", QA y Empaquetado de Producción

**Objetivo:** Unificar todo el ecosistema en un dashboard interactivo de demostración y certificar el paquete para publicación en NPM.

* **12.1 Página "Primax Theme Studio" (`apps/docs/pages/showcase.md`):**
* Vista de aplicación completa en vivo que integra simultáneamente las **Cards `01` a `08**`, un **`ServerDataTable`** interactivo, un formulario conectado con **`InertiaForm`**, gráficas de **`StatsCard`** y disparadores de **`Dialog`**, **`Drawer`**, **`CommandPalette`** y **`Toast`**.

* Permite conmutar en tiempo real entre **Aura, Lara, Nora y Obsidian** (Claro y Oscuro) e inspeccionar el código de toda la pantalla.

* **12.2 Auditoría Final y Build:**
* Ejecución de suite de tests unitarios en Vitest (`pnpm test`).
* Verificación estricta de tipos (`vue-tsc --noEmit` con 0 errores).
* Compilación de producción (`pnpm build:primax` y `pnpm build:docs`) validando tree-shaking y exportaciones en `dist/`.

---
