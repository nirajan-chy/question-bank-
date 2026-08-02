"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const channels = [
  { icon: Mail, title: "Email", value: "hello@sandarbh.com.np", href: "mailto:hello@sandarbh.com.np" },
  { icon: MessageSquare, title: "Community", value: "Ask in our community forum", href: "/community" },
  { icon: Phone, title: "Support", value: "+977 9800 000000 (9 AM–6 PM)", href: "tel:+9779800000000" },
  { icon: MapPin, title: "Kathmandu", value: "New Baneshwor, Kathmandu, Nepal", href: "#" },
];

const topics = ["General question", "Report an issue", "Content suggestion", "School/college partnership", "Press & media", "Other"];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent", { description: "We'll get back to you within a day." });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-4">
        {channels.map((c, i) => (
          <motion.a
            key={c.title}
            href={c.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-start gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{c.value}</p>
            </div>
          </motion.a>
        ))}
        <Card className="border-primary/30 bg-brand-gradient p-6 text-white">
          <p className="font-display font-bold">For institutions</p>
          <p className="mt-2 text-sm text-white/80">
            Schools, colleges and universities can host their question banks and notices on Sandarbh for free.
          </p>
          <Button variant="secondary" size="sm" className="mt-4" asChild>
            <a href="mailto:partners@sandarbh.com.np">partner@sandarbh.com.np</a>
          </Button>
        </Card>
      </div>

      <Card className="p-6 md:p-8">
        {sent ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <Send className="h-7 w-7" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold">Message sent!</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Thank you for reaching out. Our team usually replies within one working day.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-lg font-bold">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fill in the form and we’ll get back to you shortly.</p>
            <form onSubmit={submit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" placeholder="Sujan Adhikari" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <label key={t} className="cursor-pointer">
                      <input type="radio" name="topic" value={t} defaultChecked={t === topics[0]} className="peer sr-only" />
                      <span className="inline-block rounded-full border bg-background px-3 py-1.5 text-xs font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="How can we help?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={5} placeholder="Write your message here..." required />
              </div>
              <Button type="submit" variant="gradient" className="w-full sm:w-auto">
                <Send className="h-4 w-4" /> Send message
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
