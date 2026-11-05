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
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    company: ['', Validators.maxLength(150)],
    service: ['', Validators.required],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(2000),
        Validators.pattern(/\S/),
      ],
    ],
  });

  protected readonly services = [
    {
      number: '01',
      icon: 'shield',
      title: 'Delegado de Protección de Datos externo',
      description:
        'Un profesional de referencia para asesorarte, supervisar el cumplimiento y actuar como punto de contacto con la AEPD.',
      items: [
        'Asesoramiento y supervisión continua',
        'Gestión del ejercicio de derechos',
        'Interlocución con la AEPD',
      ],
      featured: true,
    },
    {
      number: '02',
      icon: 'document',
      title: 'Adecuación al RGPD y la LOPDGDD',
      description:
        'Del diagnóstico a la documentación: ordenamos la protección de datos de tu organización y la adaptamos a su actividad.',
      items: [
        'Registro de actividades de tratamiento',
        'Cláusulas, contratos y consentimientos',
        'Textos legales web y videovigilancia',
      ],
      featured: false,
    },
    {
      number: '03',
      icon: 'risk',
      title: 'Gestión de riesgos y brechas',
      description:
        'Anticiparse importa. Identificamos riesgos y preparamos una respuesta coordinada ante incidentes de seguridad.',
      items: [
        'Evaluaciones de impacto (EIPD)',
        'Protocolos y gestión de brechas',
        'Privacidad desde el diseño y por defecto',
      ],
      featured: false,
    },
    {
      number: '04',
      icon: 'training',
      title: 'Formación para tu equipo',
      description:
        'La privacidad también se trabaja en el día a día. Formación práctica para tratar los datos personales con criterio.',
      items: [
        'Buenas prácticas para empleados',
        'Contenidos adaptados a tu actividad',
        'Formación online o presencial',
      ],
      featured: false,
    },
  ];

  protected readonly sectors = [
    {
      number: '01',
      name: 'Sanidad y clínicas',
      text: 'Especial atención a la confidencialidad, los datos de salud y la gestión de historias clínicas.',
    },
    {
      number: '02',
      name: 'Educación y academias',
      text: 'Protección de los datos del alumnado, las familias y el equipo docente.',
    },
    {
      number: '03',
      name: 'Comunidades y administradores',
      text: 'Gestión de propietarios, proveedores, comunicaciones y videovigilancia.',
    },
    {
      number: '04',
      name: 'Pymes y autónomos',
      text: 'Una adecuación proporcionada a tu actividad, tus procesos y los datos que utilizas.',
    },
  ];

  protected readonly faqs = [
    {
      question: '¿Todas las empresas necesitan un Delegado de Protección de Datos?',
      answer:
        'No. La obligación de designar un DPD depende de la actividad y de los tratamientos realizados, conforme al artículo 37 del RGPD y al artículo 34 de la LOPDGDD. No todas las empresas están obligadas a nombrarlo, aunque sí deben cumplir la normativa cuando tratan datos personales. Revisamos tu caso para determinar qué necesitas.',
    },
    {
      question: '¿Puedo contratar tus servicios desde cualquier lugar de España?',
      answer:
        'Sí. Mi base profesional está en Salamanca, pero trabajo con empresas y organizaciones de toda España. El asesoramiento y la revisión documental pueden realizarse a distancia. La necesidad de reuniones o formación presencial se acuerda según cada proyecto.',
    },
    {
      question: '¿Qué incluye la adecuación en protección de datos?',
      answer:
        'Partimos de tu actividad y de cómo recoges, utilizas y conservas los datos. Según lo que necesites, el trabajo puede incluir el registro de actividades de tratamiento, cláusulas informativas, consentimientos, contratos con encargados, textos legales web, videovigilancia y procedimientos para atender derechos.',
    },
    {
      question: '¿Cómo se calcula el presupuesto?',
      answer:
        'El presupuesto es personalizado. Depende del sector, los tipos de datos tratados, la complejidad de los procesos, la documentación existente y el acompañamiento que necesites. Antes de empezar se concretan el alcance y las condiciones del servicio.',
    },
    {
      question: '¿Qué debo hacer ante una brecha de seguridad?',
      answer:
        'Actúa cuanto antes: contiene el incidente, conserva la información relevante y evalúa sus consecuencias. Cuando exista obligación de notificar a la AEPD, el RGPD establece un plazo de hasta 72 horas desde que se tiene constancia, salvo las excepciones previstas. Cada incidente requiere valorar el riesgo y si también debe comunicarse a las personas afectadas.',
    },
    {
      question: '¿Contratar un DPD garantiza evitar sanciones?',
      answer:
        'No. Ningún servicio puede garantizar que no habrá incidentes ni sanciones. Un asesoramiento adecuado ayuda a identificar riesgos, implantar medidas y demostrar diligencia, pero el cumplimiento es una responsabilidad continuada de la organización.',
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
      'Hola Alberto, me gustaría solicitar un presupuesto.',
      `Nombre: ${value.name.trim()}`,
      `Correo de contacto: ${value.email.trim()}`,
      `Empresa u organización: ${value.company.trim() || 'No indicada'}`,
      `Servicio: ${value.service}`,
      '',
      value.message.trim(),
    ].join('\n');
    this.mailDraft.set(
      `mailto:albertodatos@mazadpd.com?subject=${encodeURIComponent('Solicitud de presupuesto · Protección de datos')}&body=${encodeURIComponent(body)}`,
    );
  }
}
