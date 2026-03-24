const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const XP_SOURCES = [
  "habit",
  "task",
  "focus",
  "journal",
  "weekly_reset",
  "badge",
  "streak_bonus",
  "milestone",
  "system",
] as const;

type XpSource = (typeof XP_SOURCES)[number];

type AwardBody = {
  userId: string;
  amount: number;
  source: XpSource;
  sourceId?: string | null;
  metadata?: Record<string, unknown> | null;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ error: "Missing Supabase environment" }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice("Bearer ".length).trim();

  let body: AwardBody;
  try {
    body = (await req.json()) as AwardBody;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { userId, amount, source, sourceId, metadata } = body;

  if (!userId || typeof amount !== "number" || !Number.isFinite(amount)) {
    return json({ error: "userId and numeric amount are required" }, 400);
  }

  if (!XP_SOURCES.includes(source as XpSource)) {
    return json({ error: "Invalid source" }, 400);
  }

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
    },
  });

  if (!userRes.ok) {
    return json({ error: "Invalid token" }, 401);
  }

  const userJson = (await userRes.json()) as { id?: string };
  if (userJson.id !== userId) {
    return json({ error: "Forbidden" }, 403);
  }

  const insertPayload = {
    user_id: userId,
    amount,
    source,
    source_id: sourceId ?? null,
    metadata: metadata ?? null,
  };

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/xp_transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(insertPayload),
  });

  if (!insertRes.ok) {
    const errText = await insertRes.text();
    return json({ error: "Insert failed", detail: errText }, 500);
  }

  const profileRes = await fetch(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(
      userId
    )}&select=total_xp,current_level`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );

  if (!profileRes.ok) {
    const errText = await profileRes.text();
    return json({ error: "Profile fetch failed", detail: errText }, 500);
  }

  const profiles = (await profileRes.json()) as {
    total_xp: number;
    current_level: number;
  }[];

  const row = profiles[0];
  if (!row) {
    return json({ error: "Profile not found" }, 404);
  }

  return json({
    total_xp: row.total_xp,
    level: row.current_level,
  });
});

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
