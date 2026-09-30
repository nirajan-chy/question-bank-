import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { navGroups } from "@/lib/nav";
import { siteConfig } from "@/lib/seo";

const CONTACT = [
  { icon: MapPin, text: "Kathmandu, Nepal" },
  { icon: Mail, text: "hello@prashnahub.com", href: "mailto:hello@prashnahub.com" },
  { icon: Phone, text: "+977 1 4000000", href: "tel:+97714000000" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
];

export function Footer() {
  // Rendered on the server; the year only changes on Jan 1 so there is no
  // hydration risk in reading it here.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground text-pretty">
              {siteConfig.description}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {CONTACT.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {href ? (
                    <a href={href} className="transition-colors hover:text-foreground">
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {navGroups.map((group) => (
            <nav key={group.id} aria-label={group.label}>
              <h2 className="font-display text-sm font-semibold">{group.label}</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row">
          <p>
            © {year} {siteConfig.fullName}. Made in Nepal.
          </p>
          <p>Built by team CirqleX</p>
        </div>
      </div>
    </footer>
  );
}
