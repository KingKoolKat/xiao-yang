import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "xiao-yangs-admin-session";
const ADMIN_SESSION_LABEL = "xiao-yangs-garden-admin";
export const DEFAULT_DEV_PASSWORD = "4921";

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function valuesMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_DEV_PASSWORD;
}

export function verifyAdminPassword(password: string): boolean {
  return valuesMatch(password, getAdminPassword());
}

export function createAdminSessionValue(): string {
  return createHmac("sha256", getSessionSecret())
    .update(ADMIN_SESSION_LABEL)
    .digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return Boolean(
    sessionCookie && valuesMatch(sessionCookie, createAdminSessionValue())
  );
}

export async function requireAdminAuthenticated(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}
