---
name: angular-development
description: Desarrolla, corrige o revisa funcionalidades Angular en este repositorio. Úsala para componentes, templates, servicios, formularios, rutas, SSR, accesibilidad o pruebas.
---

# Desarrollo Angular en este proyecto

Aplica la guía oficial de Angular como referencia, pero comprueba siempre la versión de Angular instalada y los patrones locales antes de usar una API. La guía oficial del equipo de Angular es [angular/skills](https://github.com/angular/skills), en particular su skill `angular-developer`; [analogjs/angular-skills](https://github.com/analogjs/angular-skills) está obsoleto y recomienda migrar al paquete oficial.

## Patrones del repositorio

- Revisa `package.json`, `angular.json`, `tsconfig.json` y el código vecino antes de elegir una solución. No introduzcas APIs que no estén disponibles en la versión instalada.
- Conserva la arquitectura standalone, el tipado estricto, la estructura de `src/app`, las rutas existentes y la separación actual de HTML y CSS.
- Usa signals para estado local cuando encaje con el código existente. En templates, sigue el control de flujo moderno de Angular (`@if`, `@for`, `@switch`) si ese es el patrón del componente.
- Mantén la estrategia actual del formulario: formularios reactivos. No migres formularios existentes a una estrategia distinta ni adoptes Signal Forms, que requieren otra versión, sin una petición y verificación explícitas.
- Usa `Title` y `Meta` de Angular para metadatos dinámicos. Evita manipular el DOM directamente si Angular ofrece una API adecuada.
- Conserva los estilos globales y el tema actuales; no añadas un framework CSS ni una dependencia para resolver un cambio pequeño.

## Renderizado y rutas

- La aplicación tiene configuración Angular SSR/prerender. Inspecciona `src/app/app.routes.server.ts`, `src/app/app.config.server.ts` y `angular.json` antes de cambiar modos de renderizado, rutas o salida de compilación.
- El código ejecutado durante SSR/prerender debe ser seguro en servidor: no accedas a `window`, `document`, `localStorage` ni APIs del navegador desde inicializadores compartidos o renderizado de servidor. Usa APIs compatibles con Angular y limita lógica específica del navegador al contexto apropiado.
- No serialices secretos, datos personales ni estado de consentimiento al HTML prerenderizado. Evita estado mutable compartido entre solicitudes del servidor.
- Para cambios en contenido indexable, verifica el HTML prerenderizado en `dist/dpdlanding/browser` tras compilar; un DOM correcto solo después de hidratación no demuestra que la respuesta inicial sea correcta.

## Calidad y accesibilidad

- Conserva tipos concretos y validación explícita. Evita conversiones de tipo innecesarias, `any`, silenciamiento de errores y lógica compleja en templates.
- Mantén semántica HTML nativa, etiquetas y nombres accesibles, estados de foco y funcionamiento por teclado. No uses ARIA para reemplazar controles nativos cuando estos sean suficientes.
- Respeta preferencias de movimiento reducido y el comportamiento responsive existente al tocar estilos o interacción.
- No amplíes el alcance con refactors, dependencias o cambios de comportamiento no solicitados.

## Verificación

- Ejecuta `npm test -- --watch=false` para comprobar la suite del proyecto y `npm run build` para validar compilación y prerender.
- Si cambias rutas o prerenderizado, confirma además que las rutas previstas se generan y que las rutas legales conservan su política de indexación esperada.
- Consulta la documentación oficial vigente en [Angular](https://angular.dev/overview) cuando la versión instalada y una recomendación actualizada no coincidan.
