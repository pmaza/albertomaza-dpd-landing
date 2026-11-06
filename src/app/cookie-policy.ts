import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { COOKIE_NAME, COOKIE_POLICY_VERSION } from './cookie-consent.service';

@Component({
  selector: 'app-cookie-policy',
  imports: [RouterLink],
  template: `
    <section class="section legal-section">
      <div class="container legal-content">
        <a class="text-link" routerLink="/">← Volver al inicio</a>
        <p class="eyebrow">Privacidad y transparencia</p>
        <h1>Política de cookies</h1>
        <p>Versión {{ version }} · Actualizada el 6 de noviembre de 2026.</p>
        <div class="legal-warning">
          <strong>Información de la implementación actual.</strong>
          <p>
            La analítica no está conectada. Antes de publicar, deben completarse los datos legales
            del titular y revisarse el alojamiento y sus posibles cookies. Esta política no
            certifica el cumplimiento en todas las jurisdicciones.
          </p>
        </div>
        <h2>1. Titular y contacto</h2>
        <p>
          Alberto Maza Martín, servicios de protección de datos. Contacto:
          <a href="mailto:albertodatos@mazadpd.com">albertodatos&#64;mazadpd.com</a>. Los datos de
          identificación fiscal y domicilio legal siguen pendientes en el
          <a routerLink="/aviso-legal">aviso legal</a>.
        </p>
        <h2>2. Qué son las cookies</h2>
        <p>
          Son pequeños archivos que el navegador guarda y devuelve al sitio web. Pueden permitir
          funciones técnicas o, en otros casos, medir la navegación. Las obligaciones también pueden
          afectar a tecnologías similares: no basta con sustituir cookies por almacenamiento local
          para evitar el consentimiento.
        </p>
        <h2>3. Cookie utilizada actualmente</h2>
        <p>
          <strong>Nombre:</strong> <code>{{ cookieName }}</code
          >. <strong>Proveedor:</strong> propia, del titular de esta web.
          <strong>Finalidad:</strong> recordar la elección de privacidad.
          <strong>Categoría:</strong> técnica, necesaria para conservar la preferencia solicitada.
          <strong>Duración:</strong> 180 días desde que guardas o modificas la elección.
        </p>
        <p>
          Se crea únicamente al guardar una elección, no por visitar la web. Contiene la versión del
          aviso, las fechas de elección y caducidad y las preferencias. No almacena nombre, correo,
          historial de navegación ni un identificador de seguimiento. Se limita al host actual, con
          Path=/ y SameSite=Lax; en HTTPS utiliza Secure. Es accesible por el código de la web para
          leer tu elección.
        </p>
        <p>
          Al ser una cookie destinada exclusivamente a recordar la elección solicitada, se trata
          como técnica exenta de consentimiento conforme al artículo 22.2 de la LSSI. No se utiliza
          para medir visitas ni para publicidad. Puedes eliminarla desde tu navegador; entonces
          volverá a mostrarse el aviso.
        </p>
        <h2>4. Analítica y publicidad</h2>
        <p>
          Actualmente no se utilizan Google Analytics, Google Ads, píxeles publicitarios ni cookies
          de terceros en la aplicación. La categoría «Analítica» está deshabilitada. Guardar
          preferencias hoy no constituye autorización para incorporar un proveedor en el futuro.
        </p>
        <p>
          Si se incorpora analítica, antes se identificarán el proveedor, los datos tratados, las
          cookies reales y sus plazos, los destinatarios, la conservación y las posibles
          transferencias internacionales. Se actualizarán esta política y la política de privacidad,
          se cambiará la versión del aviso y se pedirá una nueva elección antes de cargar la
          herramienta. Publicidad no forma parte de esta implementación.
        </p>
        <h2>5. Elegir, rechazar y retirar</h2>
        <p>
          En el aviso actual puedes guardar «Solo necesarias» o abrir la configuración. El panel
          permite rechazar las opcionales y guardar preferencias. La web y el contacto funcionan sin
          aceptar analítica. Cerrar el panel, desplazarse o seguir navegando no equivale a aceptar.
        </p>
        <p>
          El botón «Configurar cookies» del pie de página está disponible en todas las rutas. En una
          futura versión con analítica activa, podrás desmarcarla y guardar o pulsar «Rechazar
          opcionales». Retirar el consentimiento no afecta a la licitud de tratamientos anteriores
          ni implica borrar automáticamente datos ya recibidos por un proveedor.
        </p>
        <p>
          Cuando caduca la preferencia o cambia la versión del aviso, se solicita una nueva
          elección. Si la cookie está dañada o bloqueada, las opcionales permanecen desactivadas.
          Una señal Global Privacy Control del navegador bloquea también la analítica opcional como
          medida conservadora; no se utiliza geolocalización para rebajar la protección.
        </p>
        <h2>6. Datos y derechos</h2>
        <p>
          La preferencia se guarda en tu navegador y se envía al host de la web en las solicitudes,
          como cualquier cookie propia; no existe un registro de consentimiento en una base de datos
          de esta aplicación. El alojamiento podrá recibirla, por lo que sus tratamientos y
          registros deberán revisarse antes de publicar. La preferencia local no es una prueba
          centralizada o inalterable de consentimiento.
        </p>
        <p>
          Puedes consultar la <a routerLink="/privacidad">política de privacidad</a> y ejercer los
          derechos que correspondan mediante los canales del titular. En España puedes reclamar ante
          la <a href="https://www.aepd.es/">Agencia Española de Protección de Datos</a>, sin
          perjuicio de otras autoridades competentes.
        </p>
        <h2>7. Alcance legal y revisión</h2>
        <p>
          El diseño toma como referencia la LSSI, el RGPD, la LOPDGDD y la guía de cookies de la
          AEPD: bloqueo previo de opcionales, rechazo accesible, elección por finalidad y retirada
          sencilla. No garantiza por sí solo cumplimiento mundial. Debe revisarse la normativa de
          los países donde se ofrezcan servicios o se realicen tratamientos, así como proveedores,
          menores y transferencias internacionales.
        </p>
        <p><a href="https://www.aepd.es/guias/guia-cookies.pdf">Guía de cookies de la AEPD</a>.</p>
      </div>
    </section>
  `,
})
export class CookiePolicyPage {
  protected readonly cookieName = COOKIE_NAME;
  protected readonly version = COOKIE_POLICY_VERSION;

  constructor() {
    inject(Title).setTitle('Política de cookies | Alberto Maza Martín');
    const meta = inject(Meta);
    const description =
      'Cookies técnicas, preferencias y preparación de la analítica opcional de la web de Alberto Maza Martín.';
    meta.updateTag({ name: 'description', content: description });
    meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    meta.updateTag({ property: 'og:title', content: 'Política de cookies | Alberto Maza Martín' });
    meta.updateTag({ property: 'og:description', content: description });
  }
}
