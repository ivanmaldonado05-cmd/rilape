# Rilape Velas — sitio web

Sitio multipágina estático para **Rilape**, la primera fábrica de velas del Paraguay (desde 1981).
Catálogo con más de 70 productos, carrito de pedido persistente y checkout por WhatsApp con opción de
retiro en local o delivery con marcación en el mapa.

## Estructura

```
index.html          Inicio (hero, destacados, categorías, historia)
catalogo.html       Catálogo completo con filtros por categoría, subcategoría y buscador
nosotros.html       Historia de la marca
contacto.html       Datos de contacto, horario y mapa embebido (Google Maps)
404.html            Página de error
assets/
  css/style.css     Sistema de diseño (paleta cálida, serif + sans)
  js/data.js         Datos de productos y categorías (generado desde _build/products.json)
  js/store.js        Carrito (localStorage)
  js/app.js          UI: grilla, filtros, buscador, modal, carrito, mapa y WhatsApp
  img/               Logo (SVG), fotos de producto (WebP + JPG), heros, favicon, OG
robots.txt · sitemap.xml · .nojekyll
```

## Cómo se despliega

Es un sitio 100% estático — no necesita backend. Subí el contenido de esta carpeta a
cualquier hosting (GitHub Pages, Netlify, Vercel o el hosting propio). En GitHub Pages,
el archivo `.nojekyll` ya está incluido. **No hace falta desplegar** `node_modules/`,
`_build/` ni `_extract/` (ver `.gitignore`).

## Carrito y pedido por WhatsApp

- El carrito vive en `localStorage` y persiste entre páginas.
- "Finalizar pedido por WhatsApp" abre `https://wa.me/595986238556` con el mensaje
  prellenado: lista de productos + cantidades, tipo de entrega (retiro/delivery),
  nombre y, si es delivery, un enlace de Google Maps con el punto marcado.
- El mapa de delivery usa **Leaflet + OpenStreetMap** (sin API key), cargado bajo demanda.

## Regenerar imágenes o datos (opcional)

Los scripts en `_build/` reconstruyen los assets a partir de los PDF originales
(`_extract/`, no versionado). Requieren Node + las dependencias del `package.json`:

```bash
npm install
node _build/build-data.mjs      # regenera assets/js/data.js desde _build/products.json
node _build/build-images.mjs    # regenera fotos de producto y heros
node _build/build-icons.mjs     # regenera favicons y og-image
```

Para editar productos (nombres, medidas, fragancias), modificar `_build/products.json`
y correr `node _build/build-data.mjs`.

## Datos de contacto

- **Dirección:** Tte. Federico Delgado 535 casi Av. España, Asunción, Paraguay
- **WhatsApp:** +595 986 238 556
- **Instagram:** [@rilapevelas](https://www.instagram.com/rilapevelas/)
- **Horario:** Lunes a viernes 07:30–17:30 · Sábados 07:30–12:30
