
import { useSession } from "next-auth/react";

export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();

  if (status === "authenticated" && (data?.user as any)?.role === "guest") {
    return <>{children}</>;
  } else {
    return null;
  }
}