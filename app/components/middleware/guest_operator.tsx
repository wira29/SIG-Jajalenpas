
import { useSession } from "next-auth/react";

export default function GuestOperator({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();

  if (status === "authenticated" && (data?.user as any)?.role === "guest" || (data?.user as any)?.role === "operator") {
    return <>{children}</>;
  } else {
    return null;
  }
}