/**
 * Central tracking layer for the whole site.
 *
 * Every event is fired through `gtag()` (which also feeds Google Tag
 * Manager, since gtag.js and GTM share the same `window.dataLayer`), and
 * mirrored to the Meta Pixel via `fbq()` where there's a sensible standard
 * event to map to. Call sites never touch `window.gtag`/`window.fbq`
 * directly — everything funnels through the helpers below so the event
 * shapes stay consistent (GA4's recommended ecommerce schema) no matter
 * where in the app they're fired from.
 *
 * All three scripts (gtag.js, the GTM container, and the Meta Pixel base
 * code) are loaded by components/analytics/AnalyticsScripts.tsx. If an ID
 * env var is left blank, that script simply isn't injected — every
 * function here is a safe no-op until then.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const CURRENCY = "BDT";

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_PURCHASE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

export type TrackItem = {
  id: number | string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
  brand?: string;
};

function toGtagItem(item: TrackItem) {
  return {
    item_id: String(item.id),
    item_name: item.name,
    price: item.price,
    quantity: item.quantity ?? 1,
    ...(item.category ? { item_category: item.category } : {}),
    ...(item.brand ? { item_brand: item.brand } : {}),
  };
}

function itemsValue(items: TrackItem[]) {
  return items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
}

export const analytics = {
  /** SPA route change — call on every client-side navigation. */
  pageview(url: string) {
    gtag("event", "page_view", { page_path: url });
    fbq("track", "PageView");
  },

  viewItem(item: TrackItem) {
    gtag("event", "view_item", {
      currency: CURRENCY,
      value: item.price,
      items: [toGtagItem(item)],
    });
    fbq("track", "ViewContent", {
      content_ids: [String(item.id)],
      content_name: item.name,
      content_type: "product",
      value: item.price,
      currency: CURRENCY,
    });
  },

  viewItemList(items: TrackItem[], listName?: string) {
    if (!items.length) return;
    gtag("event", "view_item_list", {
      item_list_name: listName,
      items: items.map(toGtagItem),
    });
  },

  selectItem(item: TrackItem, listName?: string) {
    gtag("event", "select_item", {
      item_list_name: listName,
      items: [toGtagItem(item)],
    });
  },

  addToCart(item: TrackItem) {
    const value = item.price * (item.quantity ?? 1);
    gtag("event", "add_to_cart", {
      currency: CURRENCY,
      value,
      items: [toGtagItem(item)],
    });
    fbq("track", "AddToCart", {
      content_ids: [String(item.id)],
      content_name: item.name,
      content_type: "product",
      value,
      currency: CURRENCY,
    });
  },

  removeFromCart(item: TrackItem) {
    gtag("event", "remove_from_cart", {
      currency: CURRENCY,
      value: item.price * (item.quantity ?? 1),
      items: [toGtagItem(item)],
    });
  },

  viewCart(items: TrackItem[]) {
    if (!items.length) return;
    gtag("event", "view_cart", {
      currency: CURRENCY,
      value: itemsValue(items),
      items: items.map(toGtagItem),
    });
  },

  addToWishlist(item: TrackItem) {
    gtag("event", "add_to_wishlist", {
      currency: CURRENCY,
      value: item.price,
      items: [toGtagItem(item)],
    });
    fbq("track", "AddToWishlist", {
      content_ids: [String(item.id)],
      content_name: item.name,
      value: item.price,
      currency: CURRENCY,
    });
  },

  beginCheckout(items: TrackItem[]) {
    if (!items.length) return;
    const value = itemsValue(items);
    gtag("event", "begin_checkout", {
      currency: CURRENCY,
      value,
      items: items.map(toGtagItem),
    });
    fbq("track", "InitiateCheckout", {
      content_ids: items.map((i) => String(i.id)),
      value,
      currency: CURRENCY,
      num_items: items.length,
    });
  },

  addPaymentInfo(items: TrackItem[], paymentType: string) {
    gtag("event", "add_payment_info", {
      currency: CURRENCY,
      value: itemsValue(items),
      payment_type: paymentType,
      items: items.map(toGtagItem),
    });
    fbq("track", "AddPaymentInfo", {
      value: itemsValue(items),
      currency: CURRENCY,
    });
  },

  purchase(order: {
    /** Order number — used as the GA4/Ads transaction_id. */
    id: string;
    value: number;
    shipping?: number;
    tax?: number;
    items: TrackItem[];
  }) {
    gtag("event", "purchase", {
      transaction_id: order.id,
      currency: CURRENCY,
      value: order.value,
      shipping: order.shipping,
      tax: order.tax,
      items: order.items.map(toGtagItem),
    });

    if (GOOGLE_ADS_ID) {
      gtag("event", "conversion", {
        send_to: GOOGLE_ADS_PURCHASE_LABEL ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}` : GOOGLE_ADS_ID,
        value: order.value,
        currency: CURRENCY,
        transaction_id: order.id,
      });
    }

    fbq("track", "Purchase", {
      content_ids: order.items.map((i) => String(i.id)),
      value: order.value,
      currency: CURRENCY,
      contents: order.items.map((i) => ({ id: String(i.id), quantity: i.quantity ?? 1 })),
    });
  },

  signUp(method: string = "email") {
    gtag("event", "sign_up", { method });
    fbq("track", "CompleteRegistration");
  },

  login(method: string = "email") {
    gtag("event", "login", { method });
  },

  search(term: string) {
    if (!term) return;
    gtag("event", "search", { search_term: term });
    fbq("track", "Search", { search_string: term });
  },
};
