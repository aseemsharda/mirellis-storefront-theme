import { createBrowserClient } from "@supabase/ssr";
import { requireStudioConfig } from "@/lib/config";

export function createStudioBrowserClient() {
  const { url, key } = requireStudioConfig();

  return createBrowserClient(url, key, {
    auth: {
      detectSessionInUrl: false,
    },
  });
}
