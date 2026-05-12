# Variables de Diseño y Paleta de Colores

El sistema visual de JYF Lab está construido en base a una paleta de colores oficial que utiliza variables CSS en el archivo principal `src/index.css`.

Esto permite mantener consistencia en todo el proyecto y facilitar cambios globales de diseño desde un solo lugar.

## Paleta de Colores Oficial

La paleta se divide en colores principales (Magenta/Pink/Blue/Purple) y los colores neutrales de contraste (White, text, bg).

Las variables están disponibles bajo el scope de `:root` y se pueden utilizar en cualquier archivo de CSS o como variables en línea (`var(--nombre-de-variable)`).

### Variables Definidas:

```css
:root {
  /* ─── Paleta Oficial JYF Lab ─── */
  --jyf-pink-light: #F36AD3;
  --jyf-magenta-deep: #A32485;
  --jyf-blue: #0000B8;
  --jyf-purple: #4A3D8E;
  --jyf-pink-soft: #FFB8F4;
  --jyf-pink-bright: #DB39A8;
  --jyf-white: #FFFFFF;

  /* ─── Variables de Sistema (Mapeadas a la paleta) ─── */
  --bg: #0f172a;        /* Fondo oscuro base para contraste */
  --text: #e2e8f0;      /* Color de texto principal */
  --text-h: #ffffff;    /* Color para los encabezados (h1, h2, etc.) */
  --accent: var(--jyf-pink-bright); /* Color de acento para elementos interactivos */
  --border: rgba(243, 106, 211, 0.2); /* Bordes suaves tintados de rosa */
}
```

## Guía de Uso

### 1. Elementos Interactivos (Botones, Links)
Usar degradados (*gradients*) para darle un aspecto premium y moderno. Los degradados mezclan dos colores de la paleta.

**Ejemplo en CSS:**
```css
.boton-principal {
  background: linear-gradient(135deg, var(--jyf-magenta-deep), var(--jyf-pink-bright));
  color: var(--jyf-white);
  border: none;
}
```

### 2. Layouts y Fondos (Backgrounds)
El fondo principal del Dashboard y la vista de Login está seteado a la variable `--bg` (un tono Dark Blue / Slate). Los elementos encima deben tener fondos con transparencia que incorporen los colores de JYF.

**Ejemplo (Tarjetas y menús laterales):**
```css
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
```

### 3. Iconos y Textos Destacados
Cuando se quiere resaltar un texto sin usar degradados, se puede utilizar el color de acento principal.

```css
.texto-resaltado {
  color: var(--jyf-pink-bright);
}
```

## Implementación actual en el proyecto
*   **Login (`Login.css`)**: Utiliza `var(--jyf-purple)` y `var(--jyf-pink-bright)` para los focos en los inputs y la animación de esferas de fondo. El botón de acceso usa un degradado desde el Magenta Profundo hasta el Rosa Brillante.
*   **Dashboard (`Dashboard.css`)**: El logo, los badges de usuario y el banner de bienvenida adoptan los colores de marca mediante degradados translúcidos (mediante RGBA extrayendo los colores hexa de la paleta).
