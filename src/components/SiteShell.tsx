import Header from "~/components/Header";
import Footer from "~/components/Footer";
import WhatsAppButton from "~/components/WhatsAppButton";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-cream-50"
      >
        Saltar al contenido
      </a>

      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
