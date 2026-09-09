// These run in the visitor's own browser ("use client" pages), so a bare
// `new Date(...).toLocaleDateString(undefined, ...)` follows THEIR device's
// timezone/locale — a customer browsing from abroad would see their own
// local date instead of MotoVessel's. Since order dates are a Bangladesh
// business's dates (and should read the same for every customer and staff
// member no matter where they're browsing from), pin them to Asia/Dhaka
// explicitly instead of leaving it to the visitor's device.

const DHAKA_TIME_ZONE = "Asia/Dhaka";

export function formatDhakaDate(
  date: Date | string | null | undefined,
  month: "short" | "long" = "long"
): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: DHAKA_TIME_ZONE,
    year: "numeric",
    month,
    day: "numeric",
  });
}

export function formatDhakaDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    timeZone: DHAKA_TIME_ZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
