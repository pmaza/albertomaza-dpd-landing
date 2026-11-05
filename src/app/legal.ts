import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  template: `
    <section class="section legal-section">
      <div class="container legal-content">
        <a class="text-link" routerLink="/">← Volver al inicio</a>
        @if (document === 'not-found') {
          <p class="eyebrow">Página no encontrada</p>
          <h1>Esta página no existe.</h1>
          <p>Puedes volver al inicio para consultar los servicios o contactar con Alberto.</p>
        } @else {
          <p class="eyebrow">Información legal</p>
          <h1>{{ document === 'notice' ? 'Aviso legal' : 'Privacidad' }}</h1>
          <div class="legal-warning">
            <strong>Borrador para la versión local.</strong>
            <p>
              Este documento no está listo para publicación. Debe completarse con los datos reales
              del titular y revisarse antes de activar cualquier recogida o envío de datos.
            </p>
          </div>
          @if (document === 'notice') {
            <h2>1. Identificación del titular</h2>
            <p>
              Nombre profesional: Alberto Maza Martín. Actividad: servicios de Delegado de
              Protección de Datos, asesoramiento normativo, gestión de riesgos y formación.
            </p>
            <p>
              Contacto: <a href="mailto:albertodatos@mazadpd.com">albertodatos&#64;mazadpd.com</a>.
              Teléfono: <a href="tel:+34696532403">696 532 403</a>. Base profesional: Salamanca, con
              atención a organizaciones de toda España.
            </p>
            <p class="pending-data">
              Pendiente de completar antes de publicar: identidad fiscal del titular, NIF, domicilio
              a efectos legales y cualquier información registral o profesional que resulte
              exigible.
            </p>
            <h2>2. Objeto y alcance</h2>
            <p>
              La web presenta los servicios profesionales del titular. La información es general y
              no sustituye el análisis individual de una organización ni constituye garantía de
              cumplimiento o de ausencia de sanciones.
            </p>
            <p>
              El alcance, los plazos y las condiciones económicas de cada servicio se acuerdan
              mediante una propuesta personalizada.
            </p>
            <h2>3. Uso de los contenidos</h2>
            <p>
              El uso de la web debe ser lícito y respetar los derechos de las personas y los
              derechos sobre sus contenidos. Antes de publicar se revisarán las autorizaciones de
              todos los recursos utilizados.
            </p>
            <h2>4. Enlaces y funcionamiento</h2>
            <p>
              Los enlaces de contacto pueden abrir aplicaciones externas, como el cliente de correo
              o el teléfono. Esta versión local no procesa solicitudes en un servidor ni acredita la
              entrega de mensajes.
            </p>
            <h2>5. Normativa aplicable</h2>
            <p>
              Los servicios se desarrollan en el marco del Reglamento (UE) 2016/679 (RGPD) y de la
              Ley Orgánica 3/2018 (LOPDGDD), según su aplicación al caso concreto.
            </p>
          } @else {
            <h2>1. Funcionamiento de esta versión local</h2>
            <p>
              El formulario prepara una solicitud en el navegador. No existe un servicio de envío
              conectado: pulsar «Preparar solicitud» no envía datos a Alberto ni almacena la
              solicitud en una base de datos.
            </p>
            <p>
              Al pulsar «Abrir correo con mi solicitud», el navegador solicita abrir tu aplicación
              de correo con el mensaje rellenado. Tú decides si lo envías. El envío se realizará a
              través de tu proveedor de correo, con sus propias condiciones.
            </p>
            <h2>2. Datos del formulario</h2>
            <p>
              Se solicita nombre, correo, servicio de interés y descripción del caso. El nombre de
              la empresa es opcional. Los valores se mantienen en memoria mientras se usa el
              formulario y no se guardan en el almacenamiento del navegador.
            </p>
            <p>
              No incluyas datos de pacientes, categorías especiales de datos ni información
              confidencial de terceros.
            </p>
            <h2>3. Contacto por correo o teléfono</h2>
            <p>
              Si decides contactar, Alberto recibirá la información que compartas por ese canal para
              atender tu consulta. Antes de publicar se debe completar la información del
              responsable y definir las bases jurídicas, los plazos de conservación y los
              proveedores implicados.
            </p>
            <h2>4. Información pendiente antes de la publicación</h2>
            <p class="pending-data">
              Identidad y domicilio completos del responsable; finalidad y base jurídica de cada
              tratamiento; plazos o criterios de conservación; destinatarios y encargados; posibles
              transferencias internacionales; y procedimiento para ejercer derechos. No se han
              supuesto estos datos.
            </p>
            <h2>5. Derechos</h2>
            <p>
              La normativa contempla, cuando corresponda, derechos de acceso, rectificación,
              supresión, oposición, limitación y portabilidad, así como la posibilidad de reclamar
              ante la Agencia Española de Protección de Datos. El procedimiento de atención debe
              concretarse en la versión definitiva.
            </p>
            <h2>6. Cookies y medición</h2>
            <p>
              Esta aplicación no incorpora herramientas de analítica, publicidad, fuentes remotas ni
              rastreadores, y no instala cookies propias. Si se incorporan servicios externos en el
              futuro, será necesario revisar sus tratamientos y las obligaciones de información y
              consentimiento.
            </p>
          }
        }
      </div>
    </section>
  `,
})
export class Legal {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });

  protected get document(): 'notice' | 'privacy' | 'not-found' {
    const value: unknown = this.routeData()['document'];
    return value === 'notice' || value === 'privacy' ? value : 'not-found';
  }

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    effect(() => {
      title.setTitle(
        `${this.document === 'notice' ? 'Aviso legal' : this.document === 'privacy' ? 'Privacidad' : 'Página no encontrada'} | Alberto Maza Martín`,
      );
      meta.updateTag({ name: 'robots', content: 'noindex, follow' });
      const description =
        this.document === 'not-found'
          ? 'Página no encontrada.'
          : 'Borrador de información legal para la versión local de la web de Alberto Maza Martín.';
      meta.updateTag({ name: 'description', content: description });
      meta.updateTag({ property: 'og:title', content: 'Información legal | Alberto Maza Martín' });
      meta.updateTag({ property: 'og:description', content: description });
    });
  }
}
