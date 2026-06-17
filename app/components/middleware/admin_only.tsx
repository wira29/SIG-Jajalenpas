
import { useSession } from "next-auth/react";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();

  const user = data?.user as any;
  const isAdmin = status === "authenticated" && (user?.role === "superadmin" || user?.role === "operator");

  if (isAdmin) {
    return <>{children}</>;
  } else {
    return null;
  }
}