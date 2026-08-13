"use client";

import Link from "next/link";
import { ArrowUpRight, Contact, MessageSquare, PlusCircle, Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";
import { adminResources, adminUsersResource } from "@/features/admin/resource-config";
import { useAdminStats, useAdminUserStats } from "@/services/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const MODEL_TO_RESOURCE: Record<string, string> = {
  Level: "levels",
  University: "universities",
  Faculty: "faculties",
  Course: "courses",
  Semester: "semesters",
  Subject: "subjects",
  Note: "notes",
  Book: "books",
  QuestionBank: "question-banks",
  PastPaper: "past-papers",
  MockTest: "mock-tests",
  Scholarship: "scholarships",
  Notice: "notices",
  ResultEntry: "results",
  Faq: "faqs",
  Post: "posts",
  CommunityQuestion: "community",
  Community: "communities",
  CommunityMessage: "community-messages",
  LeaderboardEntry: "leaderboard",
  Contact: "contacts",
  User: "users",
};

const resourceByPath = new Map(
  [...adminResources, adminUsersResource].map((r) => [r.path, r])
);

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats();
  const { data: userStats, isLoading: loadingUserStats } = useAdminUserStats();

  const counts = data?.counts ?? {};

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your PrashnaHub content library.
          </p>
        </div>
        <Link
          href="/admin/subjects"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" /> Manage content
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(counts).map(([key, count]) => {
            const path = MODEL_TO_RESOURCE[key];
            if (!path) return null;
            const resource = resourceByPath.get(path);
            const Icon = resource?.icon ?? MessageSquare;
            return (
              <Link key={key} href={`/admin/${path}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {resource?.label ?? key}
                      </p>
                      <p className="mt-1 font-display text-3xl font-bold">{count}</p>
                    </div>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${resource?.color ?? "from-slate-500 to-slate-700"} text-white`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* User Tracking Section */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> User Tracking
        </h2>
        {loadingUserStats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : userStats ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Users</p>
                      <p className="mt-1 font-display text-3xl font-bold">{userStats.totalUsers}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active (24h)</p>
                      <p className="mt-1 font-display text-3xl font-bold">{userStats.activeUsers.last24h}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">New This Week</p>
                      <p className="mt-1 font-display text-3xl font-bold">{userStats.newThisWeek}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                      <UserPlus className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">New This Month</p>
                      <p className="mt-1 font-display text-3xl font-bold">{userStats.newThisMonth}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Retention & Insights */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">User Retention</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active in 24h</span>
                      <span className="font-semibold">{userStats.activeUsers.last24h}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${userStats.totalUsers > 0 ? (userStats.activeUsers.last24h / userStats.totalUsers) * 100 : 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active in 7d</span>
                      <span className="font-semibold">{userStats.activeUsers.last7d}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-info rounded-full" style={{ width: `${userStats.totalUsers > 0 ? (userStats.activeUsers.last7d / userStats.totalUsers) * 100 : 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active in 30d</span>
                      <span className="font-semibold">{userStats.activeUsers.last30d}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${userStats.totalUsers > 0 ? (userStats.activeUsers.last30d / userStats.totalUsers) * 100 : 0}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role Breakdown</p>
                  <div className="mt-3 space-y-3">
                    {Object.entries(userStats.roleBreakdown).map(([role, count]) => (
                      <div key={role}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize text-muted-foreground">{role}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${role === "admin" ? "bg-warning" : "bg-primary"}`}
                            style={{ width: `${userStats.totalUsers > 0 ? (count / userStats.totalUsers) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Insights</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Peak signup hour</span>
                      <span className="font-semibold">{userStats.peakHour.hour}:00 ({userStats.peakHour.count} users)</span>
                    </div>
                    {userStats.newestUser && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Newest user</span>
                        <span className="font-semibold truncate max-w-[140px]">{userStats.newestUser.name}</span>
                      </div>
                    )}
                    {userStats.oldestUser && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">First user</span>
                        <span className="font-semibold truncate max-w-[140px]">{userStats.oldestUser.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>

      {/* User Growth Chart */}
      {userStats && userStats.growth.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-muted-foreground" /> User Growth (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-40">
                {userStats.growth.map((month) => {
                  const maxCount = Math.max(...userStats.growth.map((m) => m.count), 1);
                  const height = (month.count / maxCount) * 100;
                  return (
                    <div key={month.month} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{month.count}</span>
                      <div className="w-full flex justify-center">
                        <div
                          className="w-full max-w-[48px] rounded-t-md bg-primary transition-all"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{month.month}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-muted-foreground" /> Daily Signups (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-40">
                {userStats.dailySignups.map((day) => {
                  const maxCount = Math.max(...userStats.dailySignups.map((d) => d.count), 1);
                  const height = (day.count / maxCount) * 100;
                  return (
                    <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{day.count}</span>
                      <div className="w-full flex justify-center">
                        <div
                          className="w-full max-w-[32px] rounded-t-md bg-info transition-all"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Contact className="h-4 w-4 text-muted-foreground" /> Recent contact messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data || data.recentContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contact messages yet.</p>
            ) : (
              <ul className="space-y-3">
                {data.recentContacts.map((c) => (
                  <li key={c.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <Badge variant="outline" className="text-[10px]">{c.email}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-primary">{c.subject}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-muted-foreground" /> Recent community questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data || data.recentQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No community questions yet.</p>
            ) : (
              <ul className="space-y-3">
                {data.recentQuestions.map((q) => (
                  <li key={q.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{q.title}</p>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{q.author}</span>
                      <span>·</span>
                      <span>{q.answers?.length ?? 0} answers</span>
                      <span>·</span>
                      <span>{q.createdAt}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
