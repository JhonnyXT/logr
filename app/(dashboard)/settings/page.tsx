"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { WeeklyResetWizard } from "@/components/weekly-reset/WeeklyResetWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export default function SettingsPage() {
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
    else setMessage("¡Guardado!");
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
        <PageHeader title="Ajustes" description="Gestiona tu perfil y tu ritmo semanal." />
        <p className="text-sm text-muted">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <PageHeader title="Ajustes" description="Gestiona tu perfil y tu ritmo semanal." />

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perfil</CardTitle>
            <p className="text-sm text-muted">Esta información se guarda en tu cuenta.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Nombre de usuario
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
                Nombre completo
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
                Biografía
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
                <p className="text-sm font-medium text-foreground">Perfil público</p>
                <p className="text-xs text-muted">Haz tu perfil visible para otros</p>
              </div>
            </label>
            {message ? (
              <p
                className={cn(
                  "text-sm",
                  message.includes("Guardado") ? "text-accent" : "text-destructive"
                )}
              >
                {message}
              </p>
            ) : null}
            <Button type="submit" variant="accent" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <WeeklyResetWizard />

      <div className="border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => void handleSignOut()}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
