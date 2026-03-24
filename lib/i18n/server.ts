import { cookies } from "next/headers";
import es from "@/messages/es";
import en from "@/messages/en";
import type { Locale } from "@/contexts/locale-context";

export async function getT() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("logr-locale")?.value ?? "es") as Locale;
  return locale === "en" ? en : es;
}
