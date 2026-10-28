"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { site, categories, locations, allTreatments } from "~/data/content";
import { api } from "~/trpc/react";

type FieldErrors = Partial<Record<
  "nombre" | "email" | "telefono" | "tratamiento" | "mensaje",
  string
>>;

export default function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const searchParams = useSearchParams();
  const prefill = useMemo(() => {
    const slug = searchParams?.get("tratamiento") ?? "";
    if (!slug) return "";
    // Accept either a treatment slug (e.g. "hydraglow-facial") or a category
    // title we might have put in the URL.
    const match = allTreatments.find(
      ({ category, treatment }) =>
        treatment.slug === slug || category.slug === slug,
    );
    if (match) return match.treatment.name;
    const cat = categories.find((c) => c.slug === slug);
    if (cat) return cat.title;
    return "";
  }, [searchParams]);

  const createLead = api.contact.createLead.useMutation({
    onSuccess: () => {
      setErrors({});
      setSubmitted(true);
    },
    onError: (err) => {
      const fieldErrors = err.data?.zodError?.fieldErrors;
      if (fieldErrors) {
        const mapped: FieldErrors = {};
        for (const key of [
          "nombre",
          "email",
          "telefono",
          "tratamiento",
          "mensaje",
        ] as const) {
          const msg = fieldErrors[key]?.[0];
          if (msg) mapped[key] = msg;
        }
        setErrors(mapped);
      }
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(false);
    const form = e.currentTarget;
    const data = new FormData(form);

    createLead.mutate(
      {
        nombre: (data.get("nombre") ?? "").toString(),
        email: (data.get("email") ?? "").toString(),
        telefono: (data.get("telefono") ?? "").toString(),
        tratamiento: (data.get("tratamiento") ?? "").toString(),
        mensaje: (data.get("mensaje") ?? "").toString(),
        sede: (data.get("sede") ?? "").toString() || undefined,
      },
      {
        onSuccess: () => form.reset(),
      },
    );
  }

  const serverError =
    createLead.isError && !createLead.error.data?.zodError
      ? createLead.error.message
      : null;

  return (
    <section id="contacto" className="section bg-cream-100/60">
      <div className="container-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Contacto</p>
          <h2 className="section-title">Agenda tu consulta</h2>
          <p className="section-sub">
            Déjanos tus datos y una asesora se pondrá en contacto para coordinar
            una evaluación personalizada. Todos los datos de contacto son de
            ejemplo.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-ink-700">
            <li>
              <span className="text-ink-500">Email: </span>
              <a href={`mailto:${site.email}`} className="hover:text-rose-gold">
                {site.email}
              </a>
            </li>
            <li>
              <span className="text-ink-500">Teléfono: </span>
              <a
                href={`tel:${site.phoneHref}`}
                className="hover:text-rose-gold"
              >
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <span className="text-ink-500">WhatsApp: </span>
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-gold"
              >
                {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <span className="text-ink-500">Dirección: </span>
              <span className="text-ink-900">{site.address}</span>
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-describedby="form-status"
          className="rounded-3xl border border-cream-200 bg-white p-6 shadow-soft md:col-span-7 md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Nombre completo"
              name="nombre"
              autoComplete="name"
              error={errors.nombre}
            />
            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              autoComplete="email"
              error={errors.email}
            />
            <Field
              label="Teléfono"
              name="telefono"
              type="tel"
              autoComplete="tel"
              error={errors.telefono}
            />
            <div>
              <label
                htmlFor="tratamiento"
                className="mb-1 block text-sm font-medium text-ink-900"
              >
                Tratamiento de interés
              </label>
              <select
                id="tratamiento"
                name="tratamiento"
                key={prefill}
                defaultValue={prefill}
                aria-invalid={errors.tratamiento ? true : undefined}
                className="w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-rose-gold focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {prefill &&
                  !categories.some((c) => c.title === prefill) &&
                  !allTreatments.some(
                    ({ treatment }) => treatment.name === prefill,
                  ) && <option value={prefill}>{prefill}</option>}
                <optgroup label="Categorías">
                  {categories.map((c) => (
                    <option key={c.slug} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Tratamientos">
                  {allTreatments.map(({ treatment }) => (
                    <option
                      key={treatment.slug}
                      value={treatment.name}
                    >
                      {treatment.name}
                    </option>
                  ))}
                </optgroup>
                <option value="Otro">Otro</option>
              </select>
              {errors.tratamiento && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.tratamiento}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="sede"
                className="mb-1 block text-sm font-medium text-ink-900"
              >
                Sede preferida (opcional)
              </label>
              <select
                id="sede"
                name="sede"
                defaultValue=""
                className="w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-rose-gold focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
              >
                <option value="">Sin preferencia</option>
                {locations.map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="mensaje"
              className="mb-1 block text-sm font-medium text-ink-900"
            >
              Cuéntanos qué buscas
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              aria-invalid={errors.mensaje ? true : undefined}
              className="w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-rose-gold focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
            />
            {errors.mensaje && (
              <p className="mt-1 text-xs text-red-600">{errors.mensaje}</p>
            )}
          </div>

          <label className="mt-5 flex items-start gap-3 text-xs text-ink-700">
            <input
              type="checkbox"
              name="acepto"
              className="mt-1 h-4 w-4 rounded border-cream-200 text-rose-gold focus:ring-rose-gold"
              defaultChecked
              required
            />
            <span>
              Acepto ser contactada por {site.brand} para coordinar mi consulta.
              Los datos se almacenan de forma local para esta demo.
            </span>
          </label>

          <button
            type="submit"
            className="btn-primary mt-6 w-full sm:w-auto"
            disabled={createLead.isPending}
          >
            {createLead.isPending ? "Enviando..." : "Enviar solicitud"}
          </button>

          <p
            id="form-status"
            role="status"
            aria-live="polite"
            className="mt-4 min-h-[1.25rem] text-sm"
          >
            {submitted && !createLead.isPending && (
              <span className="text-rose-gold">
                ¡Gracias! Recibimos tu solicitud. Una asesora te contactará
                pronto.
              </span>
            )}
            {serverError && (
              <span className="text-red-600">
                Ocurrió un error. Inténtalo nuevamente o escríbenos por WhatsApp.
              </span>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-ink-900"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className="w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-rose-gold focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
