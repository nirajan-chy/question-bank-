"use client";

import { Building2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { universityColleges, type CollegeGroup, type ProgramColleges } from "@/data/colleges";

const COUNT_NOUN: Record<CollegeGroup["kind"], string> = {
  public: "constituent",
  private: "affiliated",
  community: "community",
};

const splitItem = (item: string) => {
  const i = item.indexOf(" — ");
  return i === -1 ? { name: item, location: "" } : { name: item.slice(0, i), location: item.slice(i + 3) };
};

const initials = (name: string) => {
  const words = name.split(/[\s&]+/).filter((w) => /^[A-Za-z]/.test(w));
  if (!words.length) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const summarize = (groups: CollegeGroup[]) => {
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const parts = [
    `${total} campuses`,
    ...(["public", "private", "community"] as const).map((kind) => {
      const n = groups.find((g) => g.kind === kind)?.items.length ?? 0;
      if (kind === "community" && n === 0) return null;
      return `${n} ${COUNT_NOUN[kind]}`;
    }),
  ];
  return parts.filter(Boolean).join(" · ");
};

function CollegeGrid({ group }: { group: CollegeGroup }) {
  if (!group.items.length) return null;

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {group.label} ({group.items.length})
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {group.items.map((item, i) => {
          const { name, location } = splitItem(item);
          return (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-2.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground">
                {initials(name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{name}</span>
                {location ? (
                  <span className="block truncate text-xs text-muted-foreground">{location}</span>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AffiliatedColleges({ slug }: { slug: string }) {
  const programs: ProgramColleges[] | undefined = universityColleges[slug];
  if (!programs?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Affiliated Colleges &amp; Campuses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-3">
          {programs.map(({ program, groups }) => (
            <AccordionItem
              key={program}
              value={program}
              className="overflow-hidden rounded-xl border bg-muted/20 px-4"
            >
              <AccordionTrigger className="py-4 text-left hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-bold">{program}</span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {summarize(groups)}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-5">
                {groups.map((group) => (
                  <CollegeGrid key={group.label} group={group} />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
