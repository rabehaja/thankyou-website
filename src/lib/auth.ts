import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

/** Page-level guard: bounce to /login when the session cookie is invalid. */
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdminSession())) redirect("/login");
}

/** Action-level guard: throw so a forged request never reaches the database. */
export async function requireAdminAction(): Promise<void> {
  if (!(await isAdminSession())) throw new Error("Unauthorized");
}
