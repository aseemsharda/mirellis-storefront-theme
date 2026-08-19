import { requireStudioIdentity } from "@/lib/auth";
import { StudioShell } from "@/app/_components/studio-shell";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStudioIdentity();
  return <StudioShell profile={profile}>{children}</StudioShell>;
}
