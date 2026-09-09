import api from "@/lib/axios";
import { unwrap } from "@/lib/api";

export type CmsNavItem = {
  id: number;
  label: string;
  link: string | null;
  icon?: string | null;
  open_in_new_tab?: boolean;
  children?: CmsNavItem[];
};

export type CmsFooterMenuItem = {
  label: string;
  link: string;
  open_in_new_tab: boolean;
};

export type CmsFooterData = {
  menus: Record<string, CmsFooterMenuItem[]>;
  settings: Record<string, string>;
  stores: Array<{
    id: number;
    name: string;
    branch_type: string;
    city: string;
    address: string;
    phone?: string;
    opening_time?: string;
    closing_time?: string;
  }>;
};

export type CmsSectionExtraData = {
  layout?: "text-image" | "text-only" | "full-banner";
  image_path?: string;
  body?: string;
  button_text?: string;
  button_link?: string;
};

export type CmsHomepageSection = {
  section_key: string;
  /** 'builtin' = fixed frontend component, 'custom' = admin-authored content block. */
  section_type?: "builtin" | "custom";
  title: string | null;
  subtitle: string | null;
  is_visible: boolean;
  sort_order: number;
  extra_data?: CmsSectionExtraData | null;
};

export type CmsTheme = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  font_family: string;
  heading_font_family: string;
  border_radius: "sharp" | "rounded" | "pill";
};

export type CmsHomepageData = {
  sections: CmsHomepageSection[];
  banners: Array<{
    id: number;
    title: string;
    subtitle?: string;
    image: string | null;
    button_text?: string;
    button_link?: string;
  }>;
  feature_cards: Array<{
    id: number;
    icon: string;
    title: string;
    description: string;
    sort_order: number;
  }>;
  stats: Array<{
    id: number;
    label: string;
    value: string;
    icon?: string | null;
  }>;
  cta_banner: {
    title: string;
    subtitle?: string;
    button_text?: string;
    button_link?: string;
    button_two_text?: string;
    button_two_link?: string;
    background_color?: string;
    image?: string | null;
  } | null;
  testimonials: Array<{
    id: number;
    customer_name: string;
    customer_title?: string;
    review: string;
    rating: number;
    avatar?: string | null;
  }>;
  brands: Array<{
    id: number;
    name: string;
    slug: string;
    logo: string;
  }>;
};

export type CmsMegaMenuPanel = {
  badge_text: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
};

export type CmsMegaMenuData = {
  car: CmsMegaMenuPanel;
  bike: CmsMegaMenuPanel;
};

export type CmsService = {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
};

export type CmsShippingMethod = {
  id: number;
  label: string;
  description: string | null;
  price: number;
  estimated_days: string | null;
  icon: string | null;
};

export type CmsPaymentMethod = {
  id: number;
  code: string;
  label: string;
  description: string | null;
};

export type CmsEmiPlan = {
  id: number;
  bank_name: string;
  tenure_months: number;
  interest_rate: number;
  processing_fee_percent: number;
  min_order_amount: number;
  /** Only present when the request included ?amount=. */
  monthly_installment?: number;
  total_payable?: number;
  total_interest?: number;
  processing_fee?: number;
};

export const cmsService = {
  getHomepage: async (): Promise<CmsHomepageData> => unwrap(await api.get("/cms/homepage")),
  getSettings: async (): Promise<Record<string, string>> => unwrap(await api.get("/cms/settings")),
  getNavMenus: async (): Promise<CmsNavItem[]> => unwrap(await api.get("/cms/nav-menus")),
  getFooter: async (): Promise<CmsFooterData> => unwrap(await api.get("/cms/footer")),
  getBanners: async () => unwrap(await api.get("/cms/banners")),
  getFeatureCards: async () => unwrap(await api.get("/cms/feature-cards")),
  getStats: async () => unwrap(await api.get("/cms/stats")),
  getTestimonials: async () => unwrap(await api.get("/cms/testimonials")),
  getCtaBanners: async (position?: string) =>
    unwrap(await api.get("/cms/cta-banners", { params: position ? { position } : undefined })),
  getTheme: async (): Promise<CmsTheme> => unwrap(await api.get("/cms/theme")),
  getMegaMenu: async (): Promise<CmsMegaMenuData> => unwrap(await api.get("/cms/mega-menu")),
  getServices: async (): Promise<CmsService[]> => unwrap(await api.get("/cms/services")),
  getShippingMethods: async (): Promise<CmsShippingMethod[]> => unwrap(await api.get("/cms/shipping-methods")),
  getPaymentMethods: async (): Promise<CmsPaymentMethod[]> => unwrap(await api.get("/cms/payment-methods")),
  getEmiPlans: async (amount?: number): Promise<CmsEmiPlan[]> =>
    unwrap(await api.get("/cms/emi-plans", { params: amount ? { amount } : undefined })),
};
