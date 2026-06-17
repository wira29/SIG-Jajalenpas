import { useSession } from "next-auth/react";

export default function AuthenticatedOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status } = useSession(); 

  if (status === "authenticated" && ((data?.user as any)?.role === "superadmin" || (data?.user as any)?.role === "operator" || (data?.user as any)?.role === "opd")) {
    return <>{children}</>;
  } else {
    return null;
  }
}

export function UnauthenticatedOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status !== "authenticated") {
    return <>{children}</>;
  } else {
    return null;
  }
}
