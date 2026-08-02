import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { mainNav } from "@/lib/nav";
import { siteConfig } from "@/lib/seo";

const resourceLinks = [
  { label: "Notes", href: "/notes" },
  { label: "Books", href: "/books" },
  { label: "Question Banks", href: "/question-banks" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Scholarships", href: "/scholarships" },
];

const universityLinks = [
  { label: "Tribhuvan University", href: "/universities/tribhuvan-university" },
  { label: "Kathmandu University", href: "/universities/kathmandu-university" },
  { label: "Pokhara University", href: "/universities/pokhara-university" },
  { label: "Purbanchal University", href: "/universities/purbanchal-university" },
  { label: "All Universities", href: "/universities" },
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="relative border-t bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Kathmandu, Nepal
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> hello@sandarbh.edu.np
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +977 1 4000000
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary"
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {mainNav.slice(0, 7).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Resources</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Universities</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {universityLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.fullName}. Made with ❤️ in Nepal.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="transition-colors hover:text-foreground">About</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
            <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
