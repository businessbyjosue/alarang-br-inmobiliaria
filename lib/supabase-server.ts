import { createClient } from "@supabase/supabase-js";

// Cliente servidor de solo lectura (anon). Para listados públicos / lecturas.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Cliente ADMIN con service_role. Solo se usa en Server Actions y Server
// Components protegidos por el middleware /admin. La key es secreta y NUNCA
// llega al browser. Bypassa RLS, por eso solo debe usarse tras verificar la
// sesión de admin.
export function createAdminClient() {
  // Blindaje explícito: si alguien lo importa desde un componente cliente,
  // falla de inmediato y de forma visible en vez de romper en silencio.
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient() es solo de servidor");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
