"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/contexts/locale-context";

const inputClassName = cn(
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm",
  "placeholder:text-muted",
  "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
  "disabled:cursor-not-allowed disabled:opacity-60"
);

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const formId = useId();
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
      .trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (!email || !password) {
      setError(t.auth.enterCredentials);
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="border-border/80 shadow-lg shadow-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{t.auth.signIn}</CardTitle>
        <p className="text-sm text-muted">
          {t.auth.welcomeBack} {t.auth.welcomeBackDesc}
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
          aria-describedby={error ? `${formId}-error` : undefined}
        >
          <div className="space-y-1.5">
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-foreground"
            >
              {t.auth.email}
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClassName}
              aria-invalid={!!error}
              aria-required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={passwordId}
              className="block text-sm font-medium text-foreground"
            >
              {t.auth.password}
            </label>
            <div className="relative">
              <input
                id={passwordId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={cn(inputClassName, "pr-10")}
                aria-invalid={!!error}
                aria-required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <p
              id={`${formId}-error`}
              role="alert"
              aria-live="polite"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? t.auth.signingIn : t.auth.signIn}
          </Button>

          <p className="text-center text-sm text-muted">
            {t.auth.noAccount}{" "}
            <Link
              href="/register"
              className="font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
            >
              {t.auth.createOne}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
