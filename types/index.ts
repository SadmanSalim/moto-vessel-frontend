export interface ApiProduct {
  id: number;
  /** 'pos' = synced from the POS system, 'website' = created manually in the admin panel. */
  source: "pos" | "website";
  sku: string;
  name: string;
  /** Present directly on listing/search endpoint responses; some other shapes nest it under `detail.slug` instead. */
  slug?: string;
  barcode?: string;
  average_rating?: number;
  review_count?: number;
  /** False when the product has no price set yet — storefront should hide Buy Now/Add to Cart and show only "Order on WhatsApp". */
  has_price?: boolean;
  price: number | null;
  sale_price?: number;
  effective_price: number | null;
  stock_quantity: number;
  unit?: string;
  is_active: boolean;
  primary_image?: { id: number; url: string; alt_text?: string };
  images?: { id: number; url: string; alt_text?: string; is_primary: boolean; sort_order: number }[];
  detail?: ProductDetail;
  category?: Category;
  brand?: Brand;
}

export interface ProductDetail {
  slug: string;
  short_description?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  compatible_brands?: string[];
  compatible_models?: string[];
  compatible_years?: number[];
  compatible_engines?: string[];
  specifications?: { label: string; value: string }[];
  warranty?: string;
  weight?: string;
  dimensions?: string;
  country_of_origin?: string;
  oem_number?: string;
  tags?: string[];
  is_featured: boolean;
  is_published: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  vehicle_type?: "car" | "bike";
  description?: string | null;
  image_path?: string | null;
  icon?: string | null;
  parent_id?: number | null;
  show_in_nav?: boolean;
  products_count?: number;
}

export interface CategoryMenuGroup {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  children: Array<{ id: number; name: string; slug: string }>;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface VehicleBrand {
  id: number;
  name: string;
  slug: string;
  vehicle_type?: "car" | "bike";
  logo_path?: string;
}

export interface VehicleModel {
  id: number;
  name: string;
  slug: string;
  image_path?: string;
}

export interface VehicleEngine {
  id: number;
  name: string;
  year_from?: string;
  year_to?: string;
}

export interface StoreLocation {
  id: number;
  name: string;
  branch_type: string;
  address: string;
  city: string;
  phone?: string;
  latitude: number;
  longitude: number;
  services: string[];
  opening_time: string;
  closing_time: string;
  off_days?: string[];
  is_active: boolean;
}

export interface Banner {
  id: number;
  title?: string | null;
  subtitle?: string;
  image_url: string;
  video_url?: string | null;
  button_text?: string;
  button_link?: string;
  position?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  subtotal: number;
  shipping_charge: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes?: string;
  tracking_number?: string;
  courier_provider?: string | null;
  courier_tracking_code?: string | null;
  courier_status?: string | null;
  courier_stage?: CourierStage;
  courier_sent_at?: string | null;
  created_at: string;
  items: OrderItem[];
}

export type CourierStage =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "cancelled"
  | "hold"
  | "unknown";

export interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type VehicleMatchType = "exact" | "near" | "broad" | "popular";

export interface PaginatedProducts {
  items: ApiProduct[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  /** Only present on /products/by-vehicle results — see VehicleMatchType. */
  matchType?: VehicleMatchType;
  matchedOn?: { brand?: string; model?: string; year?: string; engine?: string };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  notify_order_updates?: boolean;
  notify_marketing?: boolean;
  notify_restock?: boolean;
}

export interface Address {
  id: number;
  label?: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  area?: string | null;
  postal_code?: string | null;
  is_default: boolean;
  created_at: string;
}

export interface GarageVehicle {
  id: number;
  vehicle_type: "car" | "bike";
  year?: string | null;
  nickname?: string | null;
  is_default: boolean;
  brand: { id: number; name: string; slug: string } | null;
  model: { id: number; name: string; slug: string } | null;
  engine: { id: number; name: string; year_from?: string; year_to?: string } | null;
  created_at: string;
}

export interface MyReview {
  id: number;
  rating: number;
  title?: string | null;
  comment?: string | null;
  is_approved: boolean;
  created_at: string;
  product: ApiProduct | null;
}
