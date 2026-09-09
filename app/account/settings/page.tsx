import { redirect } from "next/navigation";

/**
 * Legacy path. Account settings now live at /account/profile as part of
 * the full /account/* module. Redirect any stale links there.
 */
export default function AccountSettingsRedirect() {
  redirect("/account/profile");
}
