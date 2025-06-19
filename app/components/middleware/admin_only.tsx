
import { useSession } from "next-auth/react";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();

  if (status === "authenticated" && (data?.user as any)?.role === "superadmin" || (data?.user as any)?.role === "operator") {
    return <>{children}</>;
  } else {
    return null;
  }
}