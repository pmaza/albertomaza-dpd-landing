# Alberto Maza Martín · Landing Angular

Web local en español para presentar servicios de DPD externo y protección de datos a empresas de toda España. Diseño basado en el dossier: azul oscuro, verde petróleo, arena, geometría y fotografía original.

## Desarrollo local

```powershell
npm install
npm start -- --host 127.0.0.1 --port 4200
```

Abrir `http://127.0.0.1:4200`. Angular 21 requiere una versión compatible de Node.js (20.19+, 22.12+ o 24+). Se ha trabajado con Node.js 26.

```powershell
npm run build
npm test -- --watch=false
```

## Estructura

- `src\app\home.ts` y `home.html`: servicios, sectores, preguntas y formulario.
- `src\app\app.*`: navegación responsive y pie de página.
- `src\app\legal.ts`: borradores legales y página no encontrada.
- `src\styles.css` y `theme.css`: identidad visual y adaptación a móvil.
- `public\alberto-maza.webp`: fotografía extraída del dossier proporcionado.
- `public\favicon.ico`: icono geométrico multirresolución (16, 32, 48, 64, 128 y 256 px), con los colores del dossier. Incluye una alternativa vectorial en `favicon.svg`.

## Diseño móvil

La web utiliza una etiqueta viewport sin limitar el zoom, cuadrículas adaptativas, menú desplegable accesible y controles cómodos para interacción táctil. En pantallas estrechas las tarjetas se apilan y el formulario pasa a una columna. Se respeta la preferencia de movimiento reducido y no se utilizan fuentes remotas.

## Formulario local

No existe un backend, una conexión a proveedores ni una simulación de envío exitoso. El formulario valida los campos y genera un enlace `mailto:`; el usuario debe abrir su correo, revisar y enviar el mensaje. Los datos no se guardan en cookies, almacenamiento local ni bases de datos. No introducir datos sensibles o de pacientes.

## SEO y privacidad

Las rutas públicas se prerenderizan. Se incluyen idioma español, títulos, descripciones, metadatos sociales, HTML semántico y contenido orientado a servicios nacionales, con Salamanca como base. Los borradores legales tienen `noindex`.

No se ha configurado un dominio personalizado ni se ha publicado el sitio todavía. No se añaden URLs canónicas, sitemap con dominio inventado, herramientas de analítica, rastreadores ni fuentes remotas. Los datos estructurados, el sitemap definitivo y Search Console deberán revisarse cuando se decida publicar. Ninguna implementación garantiza una posición concreta en Google.

Los documentos legales son borradores visibles como tales: antes de publicar deben completarse y revisarse con la identidad fiscal, domicilio legal, tratamientos y proveedores reales.

## Publicación en Cloudflare Pages

El workflow `.github/workflows/build-and-deploy.yml` compila y ejecuta las pruebas automáticamente al abrir o actualizar una pull request dirigida a `main`; también guarda `dist/dpdlanding/browser` como artefacto `dpd-landing-artifact`. Esta ejecución no despliega. Para publicar, inicia el workflow manualmente desde **Actions → Build and deploy → Run workflow**, selecciona la rama `main` y el entorno `development` o `production`. Esa ejecución compila `main` y despliega su artefacto en el proyecto Cloudflare Pages configurado para el entorno seleccionado.

En **Settings → Environments**, configura en cada entorno (`development` y `production`) estos valores:

- Secret `CLOUDFLARE_API_TOKEN`: token de API con permisos de despliegue de Cloudflare Pages.
- Secret `CLOUDFLARE_ACCOUNT_ID`: identificador de la cuenta de Cloudflare.
- Variable `CLOUDFLARE_PROJECT_NAME`: nombre del proyecto Cloudflare Pages de ese entorno.

Configura un proyecto Pages diferente para cada entorno si quieres que desarrollo y producción publiquen sitios separados. Si `production` tiene revisores requeridos, GitHub pedirá aprobación antes de que el job acceda a sus secretos y despliegue. La disponibilidad de las reglas de protección de Environments en repositorios privados depende del plan de GitHub; el inicio manual del workflow permite controlar cuándo se solicita cada despliegue.

## Cookies y consentimiento

Rama de implementación: `feature/cookie-consent`. Se incluye un aviso informativo no bloqueante, panel accesible con `dialog` nativo y enlace permanente «Configurar cookies». El rechazo y la aceptación, cuando exista analítica configurada, tienen botones con igual presentación.

El aviso puede cerrarse sin guardar preferencias ni aceptar cookies. El panel mantiene el foco al navegar con Tab y Shift+Tab, se cierra con Escape y devuelve el foco al control de apertura.

Actualmente **no hay Analytics ni publicidad**. Solo se crea la cookie propia `am_privacy_preferences` al guardar una elección. Dura 180 días, con `Path=/`, `SameSite=Lax` y `Secure` en HTTPS. Conserva fecha, caducidad, versión y elección, sin identificadores aleatorios ni datos del formulario. Su función es recordar una preferencia solicitada; no se necesita instalarla durante la primera visita. No constituye un registro centralizado o inalterable de consentimiento. La cookie se transmite al host, por lo que deberán revisarse los registros del alojamiento.

La categoría analítica aparece deshabilitada, sin consentimiento anticipado para futuros proveedores. Cookies ausentes, caducadas, dañadas o de otra versión bloquean las opcionales. Global Privacy Control bloquea también la analítica opcional de manera conservadora. La configuración se aplica igual a todos los visitantes, sin geolocalización.

### Integración futura de Analytics

1. Completar y revisar `/cookies`, `/privacidad` y `/aviso-legal` con los datos reales, proveedor, cookies, plazos, destinatarios, transferencias y normativa aplicable.
2. Cambiar `COOKIE_POLICY_VERSION` y activar `analyticsAvailable` en `COOKIE_POLICY` **solo cuando exista el proveedor descrito**. Cambiar la versión invalida elecciones anteriores.
3. Implementar un cargador de Analytics con Consent Mode **básico**: no insertar scripts, enviar eventos ni hacer solicitudes a Google mientras `CookieConsent.canUseAnalytics()` sea falso. La comprobación debe preceder a la carga y a cada evento, no solo ejecutarse una vez al arrancar.
4. Implementar y verificar la retirada en el proveedor: detener eventos, actualizar consentimiento, retirar cookies de analítica accesibles en sus paths/domains reales y evitar nuevos envíos. Borrar un script no detiene por sí solo un SDK ya ejecutado. Esta rama no implementa un SDK ni un cargador ficticio.
5. No enviar datos del formulario, correos, teléfonos, contenido libre ni URLs con datos personales. Revisar renovación del consentimiento, auditoría mínima necesaria, accesibilidad, navegación SPA, CSP y pruebas de red.

La política actual se basa en España/UE y la guía AEPD, no certifica cumplimiento mundial. Los requisitos de otros países, menores, transferencias, contratos y tratamiento efectivo requieren revisión específica. No se añaden banners de publicidad o venta de datos para tratamientos inexistentes.

## Agente de desarrollo Angular y SEO

El agente personalizado `Angular + SEO`, disponible en `.github/agents/angular-seo.agent.md`, combina las skills del proyecto para Angular y SEO técnico:

- `.github/skills/angular-development/SKILL.md`: patrones y comprobaciones para la versión Angular instalada, formularios reactivos y SSR/prerender.
- `.github/skills/seo-technical/SKILL.md`: auditorías de indexabilidad, metadatos, renderizado y datos estructurados basadas en la documentación de Google.

Selecciona `Angular + SEO` como agente del repositorio al trabajar en esta aplicación. Las skills siguen el formato de GitHub Copilot y se cargan cuando son relevantes. Para crearlas se contrastaron las [skills oficiales de Angular](https://github.com/angular/skills) —el proyecto anterior de Analog está obsoleto— y las guías de [Google Search Central](https://developers.google.com/search/docs/essentials) y [Angular SSR](https://angular.dev/guide/ssr).
