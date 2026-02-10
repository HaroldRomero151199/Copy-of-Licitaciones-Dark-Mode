<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Run and deploy your Angular app (no Gemini key required)

This project is an Angular CLI application generated from Google AI Studio, but it has been adapted to run **entirely in the browser without any Gemini API key**.  
All data is mocked locally so the UI always works, even without `.env.local`.

View the original app in AI Studio: `https://ai.studio/apps/drive/1Mjuvrn8d8wN4GfCuRDzI6QHXWz_Mu1ju`

---

## Tech stack and toolchain

- **Framework**: Angular 21 (standalone components)
- **Dev server / build**: Angular CLI (`@angular/cli`, `@angular/build:application`)
- **Entry file**: `index.tsx`
- **Build output folder**: `dist/` (configured in `angular.json`)

---

## Run locally

**Requisitos previos**

- Node.js >= 20.19 (recomendado LTS compatible con Angular 21)
- `npm` (incluido con Node)

**Paso a paso**

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. (Opcional) Puedes borrar o ignorar el archivo `.env.local`.  
   - El valor `GEMINI_API_KEY` **ya no se usa** y la aplicación no depende de él.
3. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir el navegador en:
   - `http://localhost:3000`

---

## Build de producción

Para generar los artefactos estáticos de producción:

```bash
npm run build
```

Esto genera el build en la carpeta:

- `dist/`

El archivo de entrada será el `index.html` situado dentro de `dist/` junto con los assets generados por Angular.

---

## Flags de entorno y AI

El proyecto expone un flag simple de entorno:

- Archivo: `src/environment.ts`
- Contenido principal:
  - `ENABLE_AI = false` (por defecto)

Actualmente **no hay llamadas activas a Gemini ni a ningún otro API de IA**; los datos se generan de forma local en `TenderService` usando mocks.  
Si en el futuro vuelves a conectar Gemini u otro servicio de IA, puedes reutilizar `ENABLE_AI` para envolver toda la lógica de llamadas externas.

---

## Integración con WordPress + Elementor

Hay dos estrategias recomendadas para usar este frontend dentro de un sitio WordPress/Elementor:

### a) Hospedar `dist` en un dominio/subdominio y embeber con `<iframe>`

1. Ejecuta:
   ```bash
   npm run build
   ```
2. Sube el contenido de `dist/` a un hosting estático (por ejemplo: `https://app.tu-dominio.com/licitaciones/`).
3. En WordPress (por ejemplo en una página de Elementor), inserta un widget HTML y añade:
   ```html
   <iframe
     src="https://app.tu-dominio.com/licitaciones/index.html"
     style="width: 100%; height: 900px; border: none;"
     loading="lazy"
   ></iframe>
   ```
4. Ajusta el `height` del iframe según la altura deseada.

Gracias a que `index.html` usa:

- `<base href="./">`
- Rutas de assets relativas (por ejemplo `index.css` sin `/` inicial)

la app funcionará correctamente aunque se sirva desde un subpath.

### b) Hospedar `dist` dentro de `wp-content/uploads` y referenciar assets

1. Tras `npm run build`, copia el contenido de `dist/` a una carpeta dentro de `wp-content/uploads`, por ejemplo:
   - `wp-content/uploads/licitaciones-app/`
2. El navegador verá la app en una URL similar a:
   - `https://tu-dominio.com/wp-content/uploads/licitaciones-app/index.html`
3. En Elementor, inserta un widget HTML con:
   ```html
   <iframe
     src="https://tu-dominio.com/wp-content/uploads/licitaciones-app/index.html"
     style="width: 100%; height: 900px; border: none;"
     loading="lazy"
   ></iframe>
   ```
4. De nuevo, como `base href` es relativo (`./`) y los assets no usan rutas absolutas (`/`), no hace falta reescribir rutas adicionales.

> Nota: evita mover los archivos internos de `dist/` una vez subidos (mantén el mismo árbol de directorios) para que todas las rutas de scripts y estilos sigan resolviéndose correctamente.

---

## Troubleshooting (blank page, base href, assets)

- **Pantalla en blanco dentro del iframe**
  - Verifica que la URL del `src` del iframe sea accesible directamente en el navegador.
  - Abre las DevTools (F12) y revisa la pestaña *Console* por errores de JavaScript.

- **Errores de rutas o 404 en assets (CSS/JS)**
  - Asegúrate de que el `<base href="./">` en `index.html` NO se ha modificado a `/` al desplegar en un subpath.
  - Comprueba que las rutas de assets no empiecen con `/`. En este proyecto:
    - `index.css` se referencia como `index.css` (relativo), lo que es seguro en subdirectorios.

- **Necesito servir la app desde la raíz del dominio**
  - Servir desde la raíz (`https://tu-dominio.com/`) también funciona con `<base href="./">`.
  - Si más adelante usas Angular CLI con otras opciones de build (`--base-href`), revisa que el `base` de `index.html` y el entorno donde hospedas coincidan.

---

## Notas sobre `.env.local` y `GEMINI_API_KEY`

- El archivo `.env.local` puede seguir existiendo en el proyecto, pero **no es requerido** para que la app funcione.
- No hay ningún acceso a `process.env` ni a `import.meta.env` en el código.
- No se realizan llamadas reales a Gemini; la información mostrada proviene de datos mock generados en `TenderService`.

