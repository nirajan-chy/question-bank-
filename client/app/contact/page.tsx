import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/features/contact/components/contact-form";

export const metadata: Metadata = seo({
  title: "Contact",
  description: "Questions, feedback or partnership ideas? Reach the Sandarbh team — we usually reply within a day.",
  path: "/contact",
});

export default function Page() {
  return (
    <>
      <PageHeader
        icon={MessageSquare}
        gradient="from-sky-500 to-blue-600"
        title="We'd love to hear from you"
        description="Questions, feedback or partnership ideas? Send us a message and our team will reply within 24 hours."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
