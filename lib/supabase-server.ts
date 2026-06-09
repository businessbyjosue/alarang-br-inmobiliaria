import { createClient } from "@supabase/supabase-js";

// Cliente servidor de solo lectura (anon). Para listados públicos / lecturas.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Cliente ADMIN con service_role. Solo se usa en Server Actions protegidas
// por el middleware /admin. La key es secreta y NUNCA llega al browser.
// Bypassa RLS, por eso solo debe usarse en operaciones de admin verificadas.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
