export function studioConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return {
    url,
    key,
    configured: Boolean(url && key),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}

export function requireStudioConfig() {
  const config = studioConfig();
  if (!config.url || !config.key) {
    throw new Error("Studio authentication is not configured.");
  }
  return { url: config.url, key: config.key, siteUrl: config.siteUrl };
}
