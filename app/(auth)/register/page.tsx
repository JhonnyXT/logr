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

export default function RegisterPage() {
  const { t } = useLocale();
  const router = useRouter();
  const formId = useId();
  const usernameId = `${formId}-username`;
  const fullNameId = `${formId}-full_name`;
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const username = (
      form.elements.namedItem("username") as HTMLInputElement
    ).value.trim();
    const fullName = (
      form.elements.namedItem("full_name") as HTMLInputElement
    ).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
      .trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (!username || !fullName || !email || !password) {
      setError(t.auth.fillFields);
      return;
    }

    if (password.length < 8) {
      setError(t.auth.passwordShort);
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    });
    setPending(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSuccessMessage(t.auth.checkEmail);
  }

  return (
    <Card className="border-border/80 shadow-lg shadow-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{t.auth.createAccount}</CardTitle>
        <p className="text-sm text-muted">
          {t.auth.startTracking}
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
          aria-describedby={
            error
              ? `${formId}-error`
              : successMessage
                ? `${formId}-success`
                : undefined
          }
        >
          <div className="space-y-1.5">
            <label
              htmlFor={usernameId}
              className="block text-sm font-medium text-foreground"
            >
              {t.auth.username}
            </label>
            <input
              id={usernameId}
              name="username"
              type="text"
              autoComplete="username"
              required
              minLength={2}
              className={inputClassName}
              aria-invalid={!!error}
              aria-required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={fullNameId}
              className="block text-sm font-medium text-foreground"
            >
              {t.auth.fullName}
            </label>
            <input
              id={fullNameId}
              name="full_name"
              type="text"
              autoComplete="name"
              required
              className={inputClassName}
              aria-invalid={!!error}
              aria-required
            />
          </div>

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
                autoComplete="new-password"
                required
                minLength={8}
                className={cn(inputClassName, "pr-10")}
                aria-invalid={!!error}
                aria-describedby={`${passwordId}-hint`}
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
            <p id={`${passwordId}-hint`} className="text-xs text-muted">
              {t.auth.passwordHint}
            </p>
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

          {successMessage ? (
            <p
              id={`${formId}-success`}
              role="status"
              aria-live="polite"
              className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-foreground"
            >
              {successMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            disabled={pending || !!successMessage}
            aria-busy={pending}
          >
            {pending ? t.auth.creatingAccount : t.auth.createAccount}
          </Button>

          <p className="text-center text-sm text-muted">
            {t.auth.haveAccount}{" "}
            <Link
              href="/login"
              className="font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
            >
              {t.auth.signInLink}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
