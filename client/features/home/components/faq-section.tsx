"use client";

import { getFaqs } from "@/services/db";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = getFaqs();

  return (
    <section className="py-16 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Everything you need to know about Sandarbh — and what it means for your studies."
            className="mb-0"
          />
        </div>
        <Accordion type="single" collapsible className="w-full lg:col-span-3">
          {faqs.slice(0, 6).map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
