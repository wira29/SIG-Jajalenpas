"use server";

import { redirect } from "next/navigation";

export async function navigateLaporan() {
  return redirect("/laporan");
}
