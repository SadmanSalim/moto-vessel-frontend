import type { CmsHomepageData } from "@/services/cmsService";

export function isSectionVisible(
  sections: CmsHomepageData["sections"] | undefined,
  key: string,
  defaultVisible = true,
): boolean {
  if (!sections?.length) return defaultVisible;
  const section = sections.find((s) => s.section_key === key);
  return section?.is_visible ?? defaultVisible;
}

export function getSectionTitle(
  sections: CmsHomepageData["sections"] | undefined,
  key: string,
  fallback: string,
): string {
  return sections?.find((s) => s.section_key === key)?.title ?? fallback;
}
