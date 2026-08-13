import { FadeIn } from "@/components/shared/motion";
import { StationeryBg } from "@/components/shared/stationery-bg";

const quotes = [
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The function of education is to teach one to think intensively and to think critically. Intelligence plus character — that is the goal of true education.",
    author: "Martin Luther King Jr.",
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
];

export function EducationQuotes() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border bg-background p-8 md:p-14">
            <StationeryBg variant="compact" />
            <div className="relative">
              <div className="text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  Words that inspire
                </span>
                <h2 className="mx-auto mt-5 max-w-2xl font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
                  Why education matters
                </h2>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {quotes.map((q) => (
                  <div
                    key={q.author}
                    className="flex flex-col rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                      &ldquo;{q.text}&rdquo;
                    </blockquote>
                    <p className="mt-4 text-sm font-semibold text-primary">
                      — {q.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
