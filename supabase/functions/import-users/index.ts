import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ImportEntry = {
  name: string;
  email: string;
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeEntry = (entry: Partial<ImportEntry>): ImportEntry | null => {
  const name = entry.name?.trim();
  const email = entry.email?.trim().toLowerCase();

  if (!name || !email || !isValidEmail(email)) return null;

  return { name, email };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    const rawEntries = Array.isArray(body?.entries) ? body.entries : [];

    const uniqueEntries = new Map<string, ImportEntry>();
    const skippedInvalid: string[] = [];
    const skippedDuplicate: string[] = [];

    for (const rawEntry of rawEntries) {
      const normalized = normalizeEntry(rawEntry);

      if (!normalized) {
        const fallback = String(rawEntry?.email ?? rawEntry?.name ?? "unknown");
        skippedInvalid.push(fallback);
        continue;
      }

      if (uniqueEntries.has(normalized.email)) {
        skippedDuplicate.push(normalized.email);
        continue;
      }

      uniqueEntries.set(normalized.email, normalized);
    }

    const entries = [...uniqueEntries.values()];

    const { data: authUsersData, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authUsersError) throw authUsersError;

    const authUsers = authUsersData.users ?? [];
    const authByEmail = new Map(authUsers.map((user) => [user.email?.toLowerCase(), user]));

    const emails = entries.map((entry) => entry.email);
    const { data: existingProfiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("auth_user_id, email, name, user_id")
      .in("email", emails);
    if (profilesError) throw profilesError;

    const profileByEmail = new Map(
      (existingProfiles ?? []).map((profile) => [profile.email.toLowerCase(), profile])
    );

    const created: string[] = [];
    const updated: string[] = [];
    const skippedExisting: string[] = [];

    for (const entry of entries) {
      const existingAuthUser = authByEmail.get(entry.email);
      const existingProfile = profileByEmail.get(entry.email);

      if (existingAuthUser && existingProfile) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ name: entry.name })
          .eq("auth_user_id", existingProfile.auth_user_id);

        if (error) throw error;
        updated.push(entry.email);
        continue;
      }

      if (existingAuthUser && !existingProfile) {
        skippedExisting.push(entry.email);
        continue;
      }

      const tempPassword = `${crypto.randomUUID()}Aa!1`;
      const { data: createdUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: entry.email,
        password: tempPassword,
        email_confirm: false,
        user_metadata: { name: entry.name },
      });

      if (createUserError) {
        skippedExisting.push(entry.email);
        continue;
      }

      if (createdUser.user) {
        created.push(entry.email);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalReceived: rawEntries.length,
        totalProcessed: entries.length,
        createdCount: created.length,
        updatedCount: updated.length,
        skippedExistingCount: skippedExisting.length,
        skippedDuplicateCount: skippedDuplicate.length,
        skippedInvalidCount: skippedInvalid.length,
        created,
        updated,
        skippedExisting,
        skippedDuplicate,
        skippedInvalid,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
