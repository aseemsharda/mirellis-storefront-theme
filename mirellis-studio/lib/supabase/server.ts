import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireStudioConfig } from "@/lib/config";

export async function createStudioServerClient() {
  const { url, key } = requireStudioConfig();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. The root proxy refreshes sessions.
        }
      },
    },
  });
}
