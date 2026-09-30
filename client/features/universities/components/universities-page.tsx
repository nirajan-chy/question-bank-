"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  Leaf,
  Sprout,
  TreePine,
  Filter,
  MapPin,
  ArrowUpDown,
  GraduationCap,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { db } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  subjectCategories,
  countUniversitiesForCategory,
  type SubjectCategory,
} from "@/lib/university-subjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeFilters = ["All Types", "Public", "Private", "Open"];
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

export function UniversitiesPage() {
  const universities = db.universities;
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All Types");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("name");

  const categoriesWithCount = useMemo(
    () =>
      subjectCategories
        .map((cat) => ({
          ...cat,
          count: countUniversitiesForCategory(universities, cat),
        }))
        .filter((cat) => cat.count > 0 || cat.id === "other"),
    [universities]
  );

  const filtered = useMemo(
    () =>
      categoriesWithCount.filter((cat) => {
        if (!query) return true;
        return cat.name.toLowerCase().includes(query.toLowerCase());
      }),
    [categoriesWithCount, query]
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (sort === "count") return b.count - a.count;
        return a.name.localeCompare(b.name);
      }),
    [filtered, sort]
  );

  return (
    <div className="min-h-screen">
      {/* Search + Filters */}
      <section className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search universities, programs, locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 pl-10 text-sm"
                aria-label="Search universities and programs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11 w-full sm:w-40" aria-label="Filter by type">
                  <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
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
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-11 w-full sm:w-48" aria-label="Filter by location">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
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
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 w-full sm:w-40" aria-label="Sort by">
                  <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="count">Most Programs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/50">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold md:text-3xl">Popular Subjects</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Choose a subject to see universities offering it.
                  </p>
<<<<<<< HEAD
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {uni.programs.slice(0, 3).map((p) => (
                      <span key={p} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        {p}
                      </span>
                    ))}
                    {uni.programs.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{uni.programs.length - 3}</span>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {uni.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {formatNumber(uni.students)}
                    </span>
                    <Badge variant="secondary" className="text-2xs">{uni.type}</Badge>
                  </div>
                </Link>
=======
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="hidden border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 sm:inline-flex dark:border-green-800 dark:bg-green-950 dark:text-green-300"
            >
              <Sprout className="mr-1.5 h-4 w-4" />
              Green Education for a Sustainable Future
            </Badge>
          </div>

          {sorted.length === 0 ? (
            <Card className="flex flex-col items-center gap-4 p-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold">No subjects found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or explore all courses.
                </p>
              </div>
              <Link
                href="/courses"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                View All Courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sorted.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <SubjectCard category={cat} />
                </motion.div>
>>>>>>> origin/main
              ))}
            </div>
          )}

          {/* Can't find your subject banner */}
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
                  <p className="text-lg font-bold">Can&apos;t find your subject?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore all subjects or use our search to find the best university for you.
                  </p>
                </div>
              </div>
              <Link
                href="/courses"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg"
              >
                View All Courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Eco messaging footer */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Leaf, label: "Go Green", desc: "Less paper, more digital.", color: "text-green-600 bg-green-50 dark:bg-green-950/50" },
              { icon: Sprout, label: "Save Energy", desc: "A greener campus for future generations.", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
              { icon: TreePine, label: "Sustainable Learning", desc: "Together for a cleaner planet.", color: "text-teal-600 bg-teal-50 dark:bg-teal-950/50" },
              { icon: GraduationCap, label: "Education Builds", desc: "A Greener Tomorrow.", color: "text-green-700 bg-green-50 dark:bg-green-950/50" },
            ].map((item) => (
              <div
                key={item.label}
                className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:shadow-md"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                    item.color
                  )}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SubjectCard({ category }: { category: SubjectCategory & { count: number } }) {
  const Icon = category.icon;
  return (
    <Link
      href={`/universities/subject/${category.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
    >
      <Card className="relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl dark:hover:border-green-700 group-focus-visible:ring-2 group-focus-visible:ring-green-600">
        {/* Gradient accent */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100",
            category.color
          )}
        />

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110",
                category.color
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold leading-snug group-hover:text-green-700 dark:group-hover:text-green-400">
                {category.name}
              </h4>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>
                  {category.count} Universit{category.count === 1 ? "y" : "ies"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted/50 text-muted-foreground transition-all group-hover:border-green-300 group-hover:bg-green-50 group-hover:text-green-600 dark:group-hover:border-green-700 dark:group-hover:bg-green-950">
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
