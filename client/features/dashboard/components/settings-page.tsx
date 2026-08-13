"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, Bell, Check, Palette, Save, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/use-user-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only"),
  email: z.string().email("Enter a valid email"),
  college: z.string().min(2, "Enter your school or college"),
  city: z.string().min(2, "Enter your city"),
  level: z.string().min(2, "Select your level"),
  faculty: z.string().min(2, "Enter your faculty or stream"),
  bio: z.string().max(160, "Keep it under 160 characters").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function SettingsPage() {
  const { user, setUser } = useUserStore();
  const [notifications, setNotifications] = useState({ email: true, mockTests: true, community: true, marketing: false });

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      college: user.college,
      city: user.city,
      level: user.level,
      faculty: user.faculty,
      bio: user.bio,
    },
  });

  const onSubmit = (data: ProfileForm) => {
    setUser(data);
    toast.success("Profile updated", { description: "Your changes have been saved." });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, preferences and notifications.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <UserCog className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display font-bold">Profile information</h2>
            <p className="text-xs text-muted-foreground">How you appear across PrashnaHub.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} />
              {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input id="level" {...register("level")} />
              {errors.level && <p className="text-xs text-destructive">{errors.level.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty / Stream</Label>
              <Input id="faculty" {...register("faculty")} />
              {errors.faculty && <p className="text-xs text-destructive">{errors.faculty.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">School / College</Label>
              <Input id="college" {...register("college")} />
              {errors.college && <p className="text-xs text-destructive">{errors.college.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} {...register("bio")} placeholder="A short line about you..." />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>
          </div>
          <Button type="submit" variant="gradient">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
            <Bell className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display font-bold">Notifications</h2>
            <p className="text-xs text-muted-foreground">Choose what you want to hear about.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {(
            [
              ["email", "Weekly study digest", "A summary of your sessions, streak and XP every Sunday."],
              ["mockTests", "Mock test reminders", "Get notified when new mock tests for your level go live."],
              ["community", "Community replies", "Alerts when someone answers or comments on your questions."],
              ["marketing", "Product updates", "Occasional news about new features and content."],
            ] as const
          ).map(([key, title, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={notifications[key]}
                onCheckedChange={(v) => {
                  setNotifications((n) => ({ ...n, [key]: v }));
                  toast.success(v ? "Enabled" : "Disabled", { description: `${title} notifications ${v ? "turned on" : "turned off"}.` });
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
            <Palette className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display font-bold">Appearance</h2>
            <p className="text-xs text-muted-foreground">Switch between light and dark mode from the navbar toggle (⌘⇧L).</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Light", "Dark", "System"].map((t) => (
            <span key={t} className="flex items-center gap-1 rounded-full border bg-background px-4 py-2 text-sm font-medium">
              <Check className="h-4 w-4 text-primary" /> {t}
            </span>
          ))}
        </div>
      </Card>

      <Card className="border-destructive/30 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display font-bold text-destructive">Danger zone</h2>
            <p className="text-xs text-muted-foreground">These actions cannot be undone.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => toast.info("This is a mock app — no data is actually deleted.")}>
            Reset study data
          </Button>
          <Button variant="destructive" onClick={() => toast.info("This is a mock app — no account is actually deleted.")}>
            Delete account
          </Button>
        </div>
      </Card>
    </div>
  );
}
