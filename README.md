# Colima en el mapa — demo independiente

Esta rama contiene una demo frontend que funciona sin el backend de Wanderly.

## Requisitos

- Node.js 22 o compatible
- npm

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre la URL local que muestra Vite (normalmente http://localhost:5173).

## Datos

El catálogo inicial está en `src/data/places.json`. Se generó a partir de `app/seed.csv` del repositorio backend e incluye los 18 registros, coordenadas, categorías, etiquetas, horarios, imágenes, créditos y fuentes disponibles en ese archivo.

La aplicación no realiza peticiones HTTP al backend. Leaflet obtiene los mosaicos del mapa desde OpenStreetMap y las imágenes se cargan desde sus fuentes externas, por lo que esas dos funciones sí requieren conexión a internet.

## Administración de demostración

Entra desde el enlace **Administración** o visita `/admin`. No requiere usuario ni contraseña.

La administración permite activar y desactivar registros. Los cambios se guardan en `localStorage` del navegador actual; no modifican el JSON del repositorio, no se comparten entre dispositivos y se pierden al limpiar los datos del sitio. Para restaurar el estado inicial, elimina la clave `wanderly_demo_places` del almacenamiento local del navegador.

**Importante:** esta administración no es segura y no debe utilizarse como panel real de producción. Es exclusivamente para presentar el flujo de la demo.

## Compilar para Cloudflare Pages

```bash
npm run build
```

Configura Cloudflare Pages con:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

No se necesita `VITE_API_BASE_URL` ni configurar un backend.

## Volver a la versión conectada al backend

Esta implementación está aislada en la rama `demo-sin-backend`. La rama `master` no forma parte de este cambio. Cuando el servidor esté disponible, se puede descartar esta rama o recuperar selectivamente los cambios que resulten útiles.
