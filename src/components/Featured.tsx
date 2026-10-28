import { featured } from '~/data/content';

export default function Featured() {
  return (
    <section id="destacados" className="section bg-cream-100/60">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Más solicitados</p>
            <h2 className="section-title">Nuestros tratamientos destacados</h2>
            <p className="section-sub">
              Una selección de los procedimientos preferidos por nuestras
              pacientes, con resultados visibles y naturales.
            </p>
          </div>
          <a href="#contacto" className="btn-outline">
            Ver todos
          </a>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <li key={item.title}>
              <article className="card flex h-full flex-col">
                <div
                  aria-hidden="true"
                  className="h-32 w-full rounded-xl bg-gradient-rose opacity-80"
                />
                <h3 className="mt-5 font-serif text-xl text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">
                  {item.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-900">{item.price}</span>
                  <span className="text-ink-500">{item.duration}</span>
                </div>
                <a href="#contacto" className="btn-rose mt-5 w-full">
                  Agendar
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
