import { useQuery } from "@tanstack/react-query";
import { cmsService, type CmsFooterData, type CmsHomepageData, type CmsNavItem, type CmsTheme } from "@/services/cmsService";

export function useCmsHomepage(initialData?: CmsHomepageData) {
  return useQuery({
    queryKey: ["cms", "homepage"],
    queryFn: cmsService.getHomepage,
    staleTime: 0,
    initialData,
    initialDataUpdatedAt: 0,
  });
}

// initialData below lets the root layout seed these from the server (see
// lib/serverApi.ts fetchCmsFooter/fetchCmsNavMenus/etc + app/layout.tsx) so
// Header/Footer/ThemeProvider render with real data on first paint instead
// of the shell appearing first and this content popping in post-hydration.
export function useCmsFooter(initialData?: CmsFooterData) {
  return useQuery({
    queryKey: ["cms", "footer"],
    queryFn: cmsService.getFooter,
    staleTime: 0,
    initialData,
    initialDataUpdatedAt: 0,
  });
}

export function useCmsNavMenus(initialData?: CmsNavItem[]) {
  return useQuery({
    queryKey: ["cms", "nav-menus"],
    queryFn: cmsService.getNavMenus,
    staleTime: 0,
    initialData,
    initialDataUpdatedAt: 0,
  });
}

export function useCmsSettings(initialData?: Record<string, string>) {
  return useQuery({
    queryKey: ["cms", "settings"],
    queryFn: cmsService.getSettings,
    staleTime: 0,
    initialData,
    initialDataUpdatedAt: 0,
  });
}

export function useCmsTheme(initialData?: CmsTheme) {
  return useQuery({
    queryKey: ["cms", "theme"],
    queryFn: cmsService.getTheme,
    staleTime: 0,
    initialData,
    initialDataUpdatedAt: 0,
  });
}

export function useCmsMegaMenu() {
  return useQuery({
    queryKey: ["cms", "mega-menu"],
    queryFn: cmsService.getMegaMenu,
    staleTime: 0,
  });
}

export function useCmsServices() {
  return useQuery({
    queryKey: ["cms", "services"],
    queryFn: cmsService.getServices,
    staleTime: 0,
  });
}

export function useCmsShippingMethods() {
  return useQuery({
    queryKey: ["cms", "shipping-methods"],
    queryFn: cmsService.getShippingMethods,
    staleTime: 0,
  });
}

export function useCmsPaymentMethods() {
  return useQuery({
    queryKey: ["cms", "payment-methods"],
    queryFn: cmsService.getPaymentMethods,
    staleTime: 0,
  });
}

export function useCmsEmiPlans(amount?: number, enabled = true) {
  return useQuery({
    queryKey: ["cms", "emi-plans", amount ?? null],
    queryFn: () => cmsService.getEmiPlans(amount),
    staleTime: 0,
    enabled,
  });
}
