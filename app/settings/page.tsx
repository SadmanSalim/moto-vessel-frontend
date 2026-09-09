import { redirect } from "next/navigation";

/**
 * Legacy path. The account module now lives at /account/* (profile,
 * security, addresses, vehicles, orders, reviews, wishlist, notifications).
 * Redirect any stale links/bookmarks there.
 */
export default function SettingsRedirect() {
  redirect("/account/profile");
}
