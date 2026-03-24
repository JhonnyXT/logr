"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/contexts/locale-context";
import { PageHeader } from "@/components/shared/PageHeader";
import { WeeklyResetWizard } from "@/components/weekly-reset/WeeklyResetWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export default function SettingsPage() {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name, bio, is_public")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setUsername(data.username ?? "");
      setFullName(data.full_name ?? "");
      setBio(data.bio ?? "");
      setIsPublic(data.is_public ?? false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        is_public: isPublic,
      })
      .eq("id", user.id);

    if (error) setMessage(error.message);
    else setMessage(t.settings.savedMsg);
    setSaving(false);
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title={t.settings.pageTitle} description={t.settings.pageDesc} />
        <p className="text-sm text-muted">{t.settings.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <PageHeader title={t.settings.pageTitle} description={t.settings.pageDesc} />

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.settings.profileSection}</CardTitle>
            <p className="text-sm text-muted">{t.settings.profileDesc}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                {t.settings.usernameLabel}
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                {t.settings.fullNameLabel}
              </label>
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="bio" className="text-sm font-medium text-foreground">
                {t.settings.bioLabel}
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={cn(
                  "w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                )}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{t.settings.publicProfile}</p>
                <p className="text-xs text-muted">{t.settings.publicProfileDesc}</p>
              </div>
            </label>
            {message ? (
              <p
                className={cn(
                  "text-sm",
                  message === t.settings.savedMsg ? "text-accent" : "text-destructive"
                )}
              >
                {message}
              </p>
            ) : null}
            <Button type="submit" variant="accent" disabled={saving}>
              {saving ? t.settings.saving : t.settings.saveChanges}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.settings.languageSection}</CardTitle>
          <p className="text-sm text-muted">{t.settings.languageDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(["es", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => void setLocale(lang)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  locale === lang
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:border-accent/50 hover:text-foreground"
                )}
              >
                <span>{lang === "es" ? "🇪🇸" : "🇺🇸"}</span>
                {lang === "es" ? t.settings.langES : t.settings.langEN}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <WeeklyResetWizard />

      <div className="border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => void handleSignOut()}
        >
          <LogOut className="h-4 w-4" />
          {t.settings.signOut}
        </Button>
      </div>
    </div>
  );
}
