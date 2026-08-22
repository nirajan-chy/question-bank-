"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { admin } from "@/services/api";
import { useAdminUsers } from "@/services/queries";
import { useAuthStore } from "@/store/use-auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersManager() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useAdminUsers();
  const currentUserId = useAuthStore(s => s.user?.id);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const setRole = async (user: { id: string; role: string }, role: string) => {
    setSavingId(user.id);
    try {
      await admin.updateUser(user.id, { role: role as "user" | "admin" });
      toast.success("User role updated");
      invalidate();
    } catch (error) {
      toast.error("Update failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSavingId(null);
    }
  };
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return 0;
  });

  const remove = async (id: string) => {
    try {
      await admin.deleteUser(id);
      toast.success("User deleted");
      invalidate();
    } catch (error) {
      toast.error("Delete failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage accounts and permissions across PrashnaHub.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No users yet.
            </p>
          ) : (
            <ul className="divide-y">
              {sortedUsers.map(u => (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                        u.role === "admin"
                          ? "bg-gradient-to-br from-violet-500 to-purple-600"
                          : "bg-gradient-to-br from-slate-500 to-slate-700"
                      }`}
                    >
                      {u.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                        {u.name}
                        {u.id === currentUserId && (
                          <Badge variant="outline" className="text-[9px]">
                            you
                          </Badge>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={u.role === "admin" ? "default" : "outline"}
                      className={u.role === "admin" ? "gap-1" : ""}
                    >
                      {u.role === "admin" && (
                        <ShieldCheck className="h-3 w-3" />
                      )}
                      {u.role === "admin" ? "Admin" : "User"}
                    </Badge>

                    {u.role === "admin" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={u.id === currentUserId || savingId === u.id}
                        onClick={() => setRole(u, "user")}
                      >
                        Demote
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={savingId === u.id}
                        onClick={() => setRole(u, "admin")}
                      >
                        Make admin
                      </Button>
                    )}

                    {confirmingId === u.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={u.id === currentUserId}
                          onClick={() => remove(u.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" /> Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setConfirmingId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        disabled={u.id === currentUserId}
                        onClick={() => setConfirmingId(u.id)}
                        aria-label={`Delete ${u.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
