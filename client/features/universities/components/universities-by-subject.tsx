"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  ArrowUpRight,
  Leaf,
  TreePine,
  BookOpen,
  Filter,
} from "lucide-react";
import { db } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import { subjectCategories, matchSubjectCategory } from "@/lib/university-subjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const locationFilters = [
  "All Locations",
  "Kathmandu",
  "Pokhara",
  "Chitwan",
  "Biratnagar",
  "Lalitpur",
  "Surkhet",
  "Mahendranagar",
];
const typeFilters = ["All Types", "Public", "Private", "Open"];

export function UniversitiesBySubject({ slug }: { slug: string }) {
  const universities = db.universities;
  const category = subjectCategories.find((c) => c.slug === slug);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [type, setType] = useState("All Types");

  if (!category) return notFound();

  const matched = useMemo(
    () => universities.filter((u) => matchSubjectCategory(u.programs, category)),
    [universities, category]
  );

  const filtered = useMemo(
    () =>
      matched.filter((u) => {
        const matchesQuery =
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.location.toLowerCase().includes(query.toLowerCase());
        const matchesLocation = location === "All Locations" || u.location.includes(location);
        const matchesType = type === "All Types" || u.type === type;
        return matchesQuery && matchesLocation && matchesType;
      }),
    [matched, query, location, type]
  );

  const Icon = category.icon;

  const getProgramColor = (program: string) => {
    const p = program.toLowerCase();
    if (p.includes("csit") || p.includes("computer"))
      return "bg-blue-500 text-white shadow-blue-500/25";
    if (p.includes("be") || p.includes("b.tech") || p.includes("engineering"))
      return "bg-orange-500 text-white shadow-orange-500/25";
    if (p.includes("mbbs") || p.includes("medical"))
      return "bg-red-500 text-white shadow-red-500/25";
    if (p.includes("bba"))
      return "bg-emerald-500 text-white shadow-emerald-500/25";
    if (p.includes("bbs"))
      return "bg-violet-500 text-white shadow-violet-500/25";
    if (p.includes("bca"))
      return "bg-cyan-500 text-white shadow-cyan-500/25";
    if (p.includes("bit"))
      return "bg-indigo-500 text-white shadow-indigo-500/25";
    if (p.includes("nursing"))
      return "bg-pink-500 text-white shadow-pink-500/25";
    if (p.includes("pharm"))
      return "bg-teal-500 text-white shadow-teal-500/25";
    return "bg-primary text-primary-foreground shadow-primary/25";
  };

  const getTypeBadge = (t: string) => {
    if (t === "Public")
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800";
    if (t === "Private")
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800";
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
  };

  const getUniversityGradient = (short: string) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-violet-500 to-purple-600",
      "from-emerald-500 to-green-600",
      "from-orange-500 to-amber-600",
      "from-pink-500 to-rose-600",
      "from-cyan-500 to-teal-600",
      "from-red-500 to-rose-600",
      "from-indigo-500 to-blue-600",
      "from-teal-500 to-cyan-600",
      "from-fuchsia-500 to-pink-600",
    ];
    const index = short.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="min-h-screen">
      <section className="py-10 md:py-14">
        <div className="container">
          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 pl-10 text-sm"
                aria-label="Search universities"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-11 w-full sm:w-48" aria-label="Filter by location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locationFilters.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11 w-full sm:w-48" aria-label="Filter by type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeFilters.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-6 text-sm font-medium text-muted-foreground"
          >
            <span className="text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "university" : "universities"} found
          </motion.p>

          {filtered.length === 0 ? (
            <Card className="flex flex-col items-center gap-4 p-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold">No universities found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((uni, i) => {
                const relevantPrograms = uni.programs.filter((p) =>
                  matchSubjectCategory([p], category)
                );

                return (
                  <motion.div
                    key={uni.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/universities/${uni.slug}`}
                      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                    >
                      <Card className="relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl dark:hover:border-green-700 group-focus-visible:ring-2 group-focus-visible:ring-green-600">
                        {/* Gradient accent top */}
                        <div
                          className={cn(
                            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100",
                            getUniversityGradient(uni.short)
                          )}
                        />

                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-base font-bold text-white shadow-lg transition-transform group-hover:scale-110",
                                getUniversityGradient(uni.short)
                              )}
                            >
                              {uni.short}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold group-hover:text-green-700 dark:group-hover:text-green-400">
                                {uni.name}
                              </h3>
                              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" /> {uni.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted/50 text-muted-foreground transition-all group-hover:border-green-300 group-hover:bg-green-50 group-hover:text-green-600 dark:group-hover:border-green-700 dark:group-hover:bg-green-950">
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </div>
                        </div>

                        {/* Program badges */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {relevantPrograms.slice(0, 3).map((p) => (
                            <span
                              key={p}
                              className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
                                getProgramColor(p)
                              )}
                            >
                              {p}
                            </span>
                          ))}
                          {relevantPrograms.length > 3 && (
                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                              +{relevantPrograms.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto flex items-center gap-2 pt-4 border-t">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                              getTypeBadge(uni.type)
                            )}
                          >
                            {uni.type} University
                          </span>
                          {uni.ecoFriendly && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                              <Leaf className="h-3.5 w-3.5" />
                              Eco Friendly
                            </span>
                          )}
                          {uni.greenCampus && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <TreePine className="h-3.5 w-3.5" />
                              Green Campus
                            </span>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Still confused banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:border-green-800 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/30"
          >
            <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 shadow-sm dark:bg-green-900/50">
                  <BookOpen className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">Still confused?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore all subjects or use our search to find the best university for you.
                  </p>
                </div>
              </div>
              <Link
                href="/universities"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg"
              >
                View All Universities
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
