import { Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
})
export class Home {
  private readonly fb = inject(FormBuilder);
  protected readonly attempted = signal(false);
  protected readonly mailDraft = signal('');
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/\S/)]],
    company: ['', Validators.maxLength(150)],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    sector: ['', Validators.maxLength(150)],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(2000),
        Validators.pattern(/\S/),
      ],
    ],
    privacyAccepted: [false, Validators.requiredTrue],
  });

  protected readonly heroHighlights = [
    'Adecuación y DPD Certificado AEPD',
    'Asesoramiento directo y cercano',
    'Salamanca y toda España',
  ];

  protected readonly services = [
    {
      number: '01',
      icon: 'document',
      title: 'Adecuación completa al RGPD y LOPDGDD',
      description:
        'El servicio base para cualquier empresa o autónomo. Auditamos tu organización y adaptamos la normativa a la operativa real de tu negocio, garantizando el cumplimiento normativo sin frenar tu actividad diaria.',
      items: [
        'Registro de Actividades de Tratamiento (RAT) y Análisis de Riesgos',
        'Cláusulas, contratos y consentimientos',
        'Textos legales web y videovigilancia',
      ],
      featured: true,
    },
    {
      number: '02',
      icon: 'shield',
      title: 'Delegado de Protección de Datos (DPD) externo',
      description:
        'Supervisión continua e interlocución oficial. Tu especialista certificado de referencia para supervisar el cumplimiento normativo, resolver consultas del día a día y actuar como escudo e interlocutor oficial ante la AEPD.',
      items: [
        'Supervisión independiente y asesoramiento continuo',
        'Gestión formal de reclamaciones y ejercicio de derechos de usuarios',
        'Interlocución directa y respuesta ante inspecciones de la AEPD',
      ],
      featured: false,
    },
    {
      number: '03',
      icon: 'risk',
      title: 'Gestión de riesgos y brechas de seguridad',
      description:
        'Servicio analítico y preventivo. Identificamos vulnerabilidades antes de que se conviertan en sanciones y preparamos a tu empresa para reaccionar con rapidez y eficacia ante cualquier incidente de seguridad.',
      items: [
        'Evaluaciones de Impacto (EIPD) en tratamientos de riesgo o datos de salud',
        'Protocolo de actuación ante brechas de seguridad (plazo 72h)',
        'Privacidad desde el diseño para nuevos proyectos, webs o herramientas',
      ],
      featured: false,
    },
    {
      number: '04',
      icon: 'training',
      title: 'Formación práctica para tu equipo',
      description:
        'La seguridad de la información depende de las personas. Capacito a tus empleados con pautas sencillas y directas para que sepan qué hacer y qué evitar en su jornada diaria.',
      items: [
        'Buenas prácticas frente a errores humanos y fugas de información',
        'Talleres prácticos adaptados a tu sector (clínico, educativo, comercial)',
        'Modalidad online o presencial',
      ],
      featured: false,
    },
  ];

  protected readonly sectors = [
    {
      number: '01',
      name: 'Sanidad y clínicas',
      text: 'Los datos de salud son categorías especiales (art. 9 RGPD) y requieren las máximas garantías de seguridad. Protegemos la custodia de historias clínicas (Ley 41/2002) y tratamientos de datos de salud (art. 9 RGPD). Gestionamos tu Evaluación de Impacto (EIPD) y la designación preceptiva de tu Delegado de Protección de Datos ante la AEPD (art. 34.1.l LOPDGDD).',
    },
    {
      number: '02',
      name: 'Centros educativos y academias',
      text: 'Blindamos el tratamiento de datos de menores en matrículas, aulas virtuales, difusión de imágenes, etc., aplicando con rigor el umbral del consentimiento parental a partir de los 14 años (art. 7 LOPDGDD).',
    },
    {
      number: '03',
      name: 'Comunidades de propietarios',
      text: 'Evitamos sanciones frecuentes de la AEPD legalizando la videovigilancia comunitaria con cartelería de primera capa (art. 22 LOPDGDD) y regulando los contratos con proveedores y las gestiones vecinales.',
    },
    {
      number: '04',
      name: 'Pymes y autónomos',
      text: 'Adecuamos tu operativa comercial, laboral y digital al principio de responsabilidad proactiva (art. 5.2 RGPD).',
    },
  ];

  protected readonly experienceSectors = [
    {
      title: 'Sector Salud y colegios profesionales',
      text: 'Designado formalmente como Delegado de Protección de Datos (DPD) del Ilustre Colegio Oficial de Médicos de Salamanca. Asimismo, ejerzo como DPD externo y responsable de adecuación integral para múltiples clínicas médicas especializadas (urología, ginecología, neurología), clínicas dentales, logopedia, psicología, centros de fisioterapia, clínicas veterinarias, farmacias, ortopedias y residencias de mayores.',
      featured: true,
    },
    {
      title: 'Transporte, logística y distribución',
      text: 'Adecuación y asesoramiento continuo para agencias de transporte urgente y paquetería, empresas de transporte pesado y logística de mercancías.',
      featured: false,
    },
    {
      title: 'Industria, agroalimentación y energía',
      text: 'Cumplimiento normativo adaptado a la cadena de producción y comercialización en industrias cárnicas y secaderos, producción y envasado agroalimentario, y distribución de combustibles y suministros.',
      featured: false,
    },
    {
      title: 'Restauración comercial, hostelería y franquicias',
      text: 'Protección de datos en entornos de atención directa al público y modelos de franquicia.',
      featured: false,
    },
    {
      title: 'Servicios, deporte, formación y comercio local',
      text: 'Asesoramiento a profesionales y negocios del día a día: centros deportivos y gimnasios; autoescuelas y centros de formación; despachos profesionales y comercio minorista con venta física y online.',
      featured: false,
    },
  ];

  protected readonly faqs = [
    {
      question: '¿Todas las empresas necesitan un Delegado de Protección de Datos (DPD)?',
      answer:
        'No, la ley fija la obligación de nombrar un DPD para sectores específicos (como clínicas y centros sanitarios, centros educativos, empresas de seguridad o tratamientos a gran escala, según el art. 34 de la LOPDGDD). Puede ser que la ley no te obligue a nombrar DPD, pero lo que sí necesitas obligatoriamente por ley es una adecuación completa para operar con seguridad jurídica. Analizo tu actividad y te digo exactamente qué te exige la ley.',
    },
    {
      question: '¿Prestas servicio fuera de Salamanca?',
      answer:
        'Sí, en toda España. La auditoría, redacción documental y asesoramiento continuo se gestionan de forma telemática y ágil con clientes de cualquier punto del país. Cuando el proyecto o la formación del equipo lo requieren, también realizo sesiones y reuniones presenciales.',
    },
    {
      question: '¿Qué incluye exactamente la adecuación al RGPD?',
      answer:
        'Todo lo necesario para que tu empresa esté blindada ante una inspección: Registro de Actividades de Tratamiento (RAT) y Análisis de Riesgos; contratos con proveedores (art. 28 RGPD), cláusulas de confidencialidad para empleados y consentimientos; textos legales web (aviso legal, privacidad, cookies LSSI) y cartelería de videovigilancia; y protocolos prácticos para el ejercicio de derechos y respuesta ante brechas.',
    },
    {
      question: '¿Cómo calculas el presupuesto?',
      answer:
        'Con precio cerrado y adaptado a tu dimensión real. No cobro lo mismo a un autónomo o comercio local que a una policlínica con historias clínicas complejas o una empresa de transportes con 50 empleados. Se evalúa el volumen de tratamientos, el tipo de datos que tratas y si necesitas acompañamiento continuo como DPD externo. Sin costes ocultos.',
    },
    {
      question: '¿Qué es una brecha de seguridad?',
      answer:
        'Cualquier incidente que exponga, altere, destruya o permita el acceso no autorizado a datos personales. No se limita a ciberataques complejos como un ransomware: un correo electrónico enviado a varios clientes sin copia oculta (CCO), la pérdida de un teléfono móvil de empresa sin cifrar o el extravío de un informe en papel son brechas de seguridad. Cuando el incidente supone un riesgo para las personas, la normativa exige aplicar protocolos inmediatos y, en su caso, notificarlo a la AEPD en un plazo máximo de 72 horas.',
    },
    {
      question: '¿Contratar a un DPD me libra al 100% de recibir sanciones?',
      answer:
        'Te da la mejor defensa legal posible. Nadie puede evitar que un ciberdelincuente ataque o que un empleado cometa un error, pero ante una denuncia o inspección de la AEPD, contar con un DPD certificado y protocolos reales demuestra responsabilidad proactiva. Esto permite solucionar reclamaciones en la fase previa (art. 37 LOPDGDD) y evitar o mitigar sanciones económicas graves.',
    },
  ];

  constructor() {
    inject(Title).setTitle('DPD externo y protección de datos en España | Alberto Maza Martín');
    const meta = inject(Meta);
    meta.updateTag({
      name: 'description',
      content:
        'Alberto Maza Martín, DPD certificado. Protección de datos, adecuación al RGPD y la LOPDGDD, gestión de riesgos y formación para empresas de toda España.',
    });
    meta.updateTag({ name: 'robots', content: 'index, follow' });
    meta.updateTag({
      property: 'og:title',
      content: 'Alberto Maza Martín · Protección de datos para empresas',
    });
    meta.updateTag({
      property: 'og:description',
      content:
        'DPD externo, cumplimiento normativo y asesoramiento cercano. Desde Salamanca, para toda España.',
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.mailDraft.set(''));
  }

  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.attempted());
  }

  protected prepareRequest(): void {
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.mailDraft.set('');
      return;
    }
    const value = this.form.getRawValue();
    const body = [
      'Hola Alberto, me gustaría realizar una consulta.',
      `Nombre: ${value.name.trim()}`,
      `Empresa / Organización: ${value.company.trim() || 'No indicada'}`,
      `Email de contacto: ${value.email.trim()}`,
      `Sector o tipo de actividad: ${value.sector.trim() || 'No indicado'}`,
      '',
      value.message.trim(),
    ].join('\n');
    this.mailDraft.set(
      `mailto:albertodatos@mazadpd.com?subject=${encodeURIComponent('Consulta · Protección de datos')}&body=${encodeURIComponent(body)}`,
    );
  }
}
