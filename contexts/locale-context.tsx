"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import es, { type Messages } from "@/messages/es";
import en from "@/messages/en";

export type Locale = "es" | "en";

const MESSAGES: Record<Locale, Messages> = { es, en };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: Messages;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "es",
  setLocale: async () => {},
  t: es,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("logr-locale") as Locale | null;
      if (stored === "es" || stored === "en") {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {}
  }, []);

  async function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("logr-locale", newLocale);
      document.documentElement.lang = newLocale;
      document.cookie = `logr-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ locale: newLocale })
          .eq("id", user.id);
      }
    } catch {}
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: MESSAGES[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
