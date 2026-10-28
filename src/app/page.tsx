import Header from "~/components/Header";
import Hero from "~/components/Hero";
import Categories from "~/components/Categories";
import Featured from "~/components/Featured";
import Promos from "~/components/Promos";
import FreeConsult from "~/components/FreeConsult";
import Doctors from "~/components/Doctors";
import Technology from "~/components/Technology";
import Testimonials from "~/components/Testimonials";
import Locations from "~/components/Locations";
import ContactForm from "~/components/ContactForm";
import Footer from "~/components/Footer";
import WhatsAppButton from "~/components/WhatsAppButton";
import { site, locations } from "~/data/content";

export const dynamic = "force-static";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: site.brand,
  description: site.description,
  url: site.url,
  telephone: site.phoneDisplay,
  email: site.email,
  priceRange: "$$",
  areaServed: "Lima, Perú",
  address: locations.map((l) => ({
    "@type": "PostalAddress",
    streetAddress: l.address,
    addressLocality: "Lima",
    addressCountry: "PE",
  })),
  openingHours: "Mo-Sa 09:00-20:00",
};

export default function HomePage() {
  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-cream-50"
      >
        Saltar al contenido
      </a>

      <Header />
      <main>
        <Hero />
        <Categories />
        <Featured />
        <Promos />
        <FreeConsult />
        <Doctors />
        <Technology />
        <Testimonials />
        <Locations />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
