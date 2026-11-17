---
name: seo-technical
description: Audita, planifica o implementa SEO técnico y descubribilidad para esta web Angular. Úsala al tocar prerenderizado, rutas públicas, títulos, descripciones, canonical, robots, sitemap, datos estructurados, enlaces o contenido indexable.
---

# SEO técnico para esta aplicación Angular

Usa como fuentes principales la [guía SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Google Search Essentials](https://developers.google.com/search/docs/essentials), [SEO para JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) y la guía de [renderizado híbrido de Angular](https://angular.dev/guide/ssr). Comprueba la documentación actual antes de recomendar una característica de Google: las funciones y requisitos de resultados enriquecidos cambian.

## Procedimiento de auditoría

1. Inspecciona rutas, configuración SSR/prerender, metadatos globales y por ruta, políticas `robots`, salida del build y dominios confirmados. Distingue entre hechos del código y supuestos sobre la publicación.
2. Comprueba que cada página pública importante tiene contenido principal legible, un título descriptivo único, enlaces HTML rastreables, idioma correcto y metadatos coherentes. Revisa tanto la respuesta HTML renderizada como el comportamiento tras navegar.
3. Comprueba la salida compilada de las rutas afectadas. Angular en modo prerender facilita servir contenido indexable directamente; no supongas que Google o todos los bots ejecutarán la aplicación cliente.
4. Presenta hallazgos con archivo/ruta, evidencia, impacto y prioridad. Separa problemas demostrados de recomendaciones opcionales. Implementa únicamente lo que permita la solicitud y los datos disponibles.
5. Valida con build y pruebas existentes. Si se propone markup estructurado, valida su JSON y correspondencia con el contenido visible; el marcado no garantiza un resultado enriquecido.

## Reglas para cambios SEO

- Escribe primero para las personas: títulos y encabezados descriptivos, contenido exacto y enlaces con texto que explique el destino. Evita relleno de palabras clave, contenido repetido y páginas creadas solo para buscadores.
- No supongas longitudes mágicas de `title` o `description`, resultados, tráfico o posiciones. Redacta cada metadato de forma específica, legible y fiel al contenido de esa ruta.
- No inventes el dominio para `rel="canonical"`, sitemap, Open Graph, schema ni ejemplos que se presenten como configuración lista para publicar. Pregunta o deja una configuración explícitamente pendiente cuando el dominio de producción no conste.
- Sitemap: incluye solo URLs públicas canónicas reales que se quieran ofrecer para indexación. Un sitemap ayuda a descubrir URLs, pero no garantiza rastreo ni indexación. Para un sitio pequeño, comprueba si aporta valor antes de añadir complejidad.
- Robots: no bloquees recursos necesarios para renderizar contenido público. No uses `robots.txt` como sustituto de `noindex`; una página excluida debe recibir la instrucción de indexación adecuada en una respuesta accesible al rastreador.
- Datos estructurados: usa un tipo solo si representa fielmente el contenido visible y los datos reales. Evita reseñas, valoraciones, preguntas frecuentes, direcciones o perfiles sociales ficticios; no añadas FAQ schema por rutina ni lo presentes como garantía de resultados enriquecidos.
- Angular: prefiere metadatos disponibles en el HTML inicial/prerender. Mantén rutas navegables mediante URLs reales de Angular Router y enlaces `<a href>`, sin trasladar contenido de distintas páginas a fragmentos como si fueran rutas indexables.
- Respeta `noindex` existente para borradores legales. No elimines esa protección ni cambies la indexación de páginas legales sin autorización expresa.
- No añadas analítica, píxeles, cookies, llamadas de terceros ni tratamiento de datos personales para medir o mejorar SEO.
- Trata recomendaciones AEO/GEO y `llms.txt` como opcionales/experimentales, no como requisitos de Google ni sustitutos de contenido útil, HTML rastreable o controles de indexación.
- Las recomendaciones SEO no son asesoramiento legal ni garantía de posicionamiento. No alteres afirmaciones profesionales o legales sin fuentes y autorización.

## Lista de comprobación de entrega

- ¿Las rutas y el dominio usados están confirmados?
- ¿El título, la descripción, los encabezados, enlaces y datos estructurados coinciden con el contenido visible?
- ¿El HTML generado contiene el contenido indexable y los metadatos esperados?
- ¿Las páginas que deben quedar fuera del índice conservan `noindex`?
- ¿El cambio evita dependencias externas, tracking y datos inventados?
- ¿Se ejecutaron las pruebas y la compilación apropiadas, y se comunicaron sus resultados?
