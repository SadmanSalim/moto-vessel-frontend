"use client";

import { Banknote, Globe, Lock, Loader2, Minus, Plus, Shield, ShieldCheck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { useAddresses, useCreateAddress } from "@/hooks/useAddresses";
import { useMe } from "@/hooks/useAuth";
import { useCmsPaymentMethods, useCmsSettings, useCmsShippingMethods } from "@/hooks/useCms";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useReveal } from "@/hooks/useReveal";
import { analytics } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/api";
import { resolveCmsIcon } from "@/lib/cmsIcons";
import { formatPrice } from "@/lib/mapProduct";
import { cn } from "@/lib/utils";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { Order } from "@/types";

// Used only if the admin hasn't configured any shipping/payment methods yet
// (or the API call fails) so checkout never renders empty.
const fallbackShippingMethods: Array<{
  key: string;
  label: string;
  description: string | null;
  price: number;
  estimated_days: string | null;
  icon: string;
}> = [
  { key: "express", label: "Express Delivery", description: null, price: 24, estimated_days: "2-3 Business Days", icon: "zap" },
  { key: "standard", label: "Standard Shipping", description: null, price: 0, estimated_days: "5-7 Business Days", icon: "truck" },
  { key: "overnight", label: "Overnight Priority", description: null, price: 45, estimated_days: "Next Day by 10 AM", icon: "plane" },
];

const fallbackPaymentMethods: Array<{ code: string; label: string; description: string | null }> = [
  { code: "cod", label: "Cash on Delivery", description: "Pay when your order arrives" },
  { code: "sslcommerz", label: "Pay Online", description: "Card, mobile banking & more via SSLCommerz" },
  { code: "bank_transfer", label: "Bank Transfer", description: "We'll share account details after you order" },
];

const paymentIconByCode: Record<string, typeof Banknote> = {
  cod: Banknote,
  sslcommerz: ShieldCheck,
  bank_transfer: Lock,
};

export default function CheckoutPage() {
  const [shipping, setShipping] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentRedirectError, setPaymentRedirectError] = useState("");
  const [pendingOrderNumber, setPendingOrderNumber] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();
  const items = useCartStore((s) => s.items);
  const cartTotal = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // Checkout supports both guest orders and logged-in orders — the backend
  // (OrderController@store) intentionally sits outside auth middleware for
  // exactly this reason. This page used to force a login redirect here,
  // which blocked guest checkout entirely; that's no longer the case.
  const mounted = useHasMounted();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storedUser = useAuthStore((s) => s.user);
  const { data: profile } = useMe();
  const { data: savedAddresses } = useAddresses();
  const createAddress = useCreateAddress();
  const user = profile ?? storedUser;

  useReveal();

  // Fire once per visit to this page (not on every cart mutation) — this is
  // the closest thing this single-page checkout has to a distinct "viewed
  // cart, then began checkout" funnel step.
  const checkoutTrackedRef = useRef(false);
  useEffect(() => {
    if (checkoutTrackedRef.current || items.length === 0) return;
    const trackItems = items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }));
    analytics.viewCart(trackItems);
    analytics.beginCheckout(trackItems);
    checkoutTrackedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const { data: apiShippingMethods } = useCmsShippingMethods();
  const { data: apiPaymentMethods } = useCmsPaymentMethods();
  const { data: settings } = useCmsSettings();

  // Prefill contact fields from the logged-in profile as soon as it loads,
  // without clobbering anything the person has already typed.
  useEffect(() => {
    if (!user) return;
    const [first, ...rest] = (user.name ?? "").split(" ");
    setFirstName((v) => v || first || "");
    setLastName((v) => v || rest.join(" "));
    setEmail((v) => v || user.email || "");
    setPhone((v) => v || user.phone || "");
    setShippingAddress((v) => v || user.address || "");
    setCity((v) => v || user.city || "");
  }, [user]);

  // A saved default address is more accurate for shipping than the bare
  // profile fields, so once it loads it takes priority (one time only, so
  // it doesn't overwrite manual edits made after it arrives).
  const addressPrefilledRef = useRef(false);
  useEffect(() => {
    if (addressPrefilledRef.current) return;
    if (!savedAddresses || savedAddresses.length === 0) return;
    const def = savedAddresses.find((a) => a.is_default) ?? savedAddresses[0];
    const [first, ...rest] = def.recipient_name.split(" ");
    setFirstName(first || "");
    setLastName(rest.join(" "));
    setPhone(def.phone);
    setShippingAddress(def.address_line);
    setCity(def.city);
    addressPrefilledRef.current = true;
  }, [savedAddresses]);

  const shippingOptions = apiShippingMethods?.length
    ? apiShippingMethods.map((m) => ({
        key: String(m.id),
        label: m.label,
        description: m.description,
        price: m.price,
        estimated_days: m.estimated_days,
        icon: m.icon || "truck",
      }))
    : fallbackShippingMethods;

  const paymentOptions = apiPaymentMethods?.length
    ? apiPaymentMethods.map((m) => ({ code: m.code, label: m.label, description: m.description }))
    : fallbackPaymentMethods;

  // Default to the first available option once the list loads, and keep the
  // selection valid if it ever falls outside the current list.
  useEffect(() => {
    if (shippingOptions.length && !shippingOptions.some((o) => o.key === shipping)) {
      setShipping(shippingOptions[0].key);
    }
  }, [shippingOptions, shipping]);

  useEffect(() => {
    if (paymentOptions.length && !paymentOptions.some((o) => o.code === paymentMethod)) {
      setPaymentMethod(paymentOptions[0].code);
    }
  }, [paymentOptions, paymentMethod]);

  const subtotal = cartTotal();
  const selectedShipping = shippingOptions.find((o) => o.key === shipping);
  const shippingCost = selectedShipping?.price ?? 0;
  // Admin-configurable (General Settings > Checkout, defaults to 8%) instead
  // of hardcoded — this is a display estimate that matches what the backend
  // (OrderService::create) actually calculates and charges from the same
  // setting, so the number shown here matches the real order total.
  const taxRate = Number(settings?.tax_rate ?? 8);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + shippingCost + tax;
  const shippingLabel = selectedShipping?.label ?? "Standard";

  const initPayment = useMutation({
    mutationFn: (orderNumber: string) => paymentService.initSslCommerz(orderNumber),
  });

  const createOrder = useMutation({
    mutationFn: (data: Record<string, unknown>) => orderService.create(data),
    onSuccess: async (order: Order) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });

      analytics.purchase({
        id: order.order_number,
        value: Number(order.total),
        shipping: Number(order.shipping_charge ?? 0),
        tax,
        items: order.items.map((i) => ({
          id: i.product_sku,
          name: i.product_name,
          price: Number(i.unit_price),
          quantity: i.quantity,
        })),
      });

      // Auto-save this delivery address to the account for next time, as
      // long as it isn't already saved (compares the fields that matter for
      // delivery so re-ordering to the same place doesn't pile up
      // duplicates). Best-effort — never blocks the order confirmation.
      if (isAuthenticated && saveAddress) {
        const normalize = (v: string) => v.trim().toLowerCase();
        const isDuplicate = (savedAddresses ?? []).some(
          (a) =>
            normalize(a.address_line) === normalize(shippingAddress) &&
            normalize(a.city) === normalize(city) &&
            normalize(a.phone) === normalize(phone),
        );
        if (!isDuplicate && shippingAddress && city && phone) {
          createAddress.mutate({
            recipient_name: `${firstName} ${lastName}`.trim(),
            phone,
            address_line: shippingAddress,
            city,
          });
        }
      }

      if (order.payment_method !== "sslcommerz") {
        router.push(`/checkout/success?order=${encodeURIComponent(order.order_number)}`);
        return;
      }

      try {
        const { gateway_url } = await initPayment.mutateAsync(order.order_number);
        window.location.href = gateway_url;
      } catch (err) {
        setPendingOrderNumber(order.order_number);
        setPaymentRedirectError(getErrorMessage(err));
      }
    },
  });

  const handleSubmit = () => {
    setPaymentRedirectError("");
    createOrder.mutate({
      customer_name: `${firstName} ${lastName}`.trim(),
      customer_email: email,
      customer_phone: phone,
      shipping_address: shippingAddress,
      city,
      payment_method: paymentMethod,
      shipping_charge: shippingCost,
      items: items.map((item) =>
        item.source === "website"
          ? { website_product_id: item.id, quantity: item.quantity }
          : { pos_product_id: item.id, quantity: item.quantity },
      ),
    });
  };

  // Avoid a flash of "cart is empty" before the persisted cart store has
  // hydrated from localStorage on first client render.
  if (!mounted) return null;

  if (items.length === 0 && !paymentRedirectError) {
    return (
      <div className="bg-mv-bg">
        <div className="border-b border-mv-border bg-white py-3">
          <div className="mv-container text-[12px] text-mv-muted">
            <Link href="/" className="hover:text-mv-primary">Home</Link>
            {" > "}
            <span className="text-mv-text">Checkout</span>
          </div>
        </div>
        <div className="mv-container py-16 text-center">
          <p className="text-[16px] font-semibold text-mv-text">Your cart is empty</p>
          <p className="mt-2 text-[13px] text-mv-muted">Add parts to your cart before checking out.</p>
          <Link
            href="/products/all"
            className="mt-6 inline-flex rounded-xl bg-mv-primary px-6 py-3 text-[13px] font-semibold text-white"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && paymentRedirectError) {
    return (
      <div className="bg-mv-bg">
        <div className="border-b border-mv-border bg-white py-3">
          <div className="mv-container text-[12px] text-mv-muted">
            <Link href="/" className="hover:text-mv-primary">Home</Link>
            {" > "}
            <span className="text-mv-text">Checkout</span>
          </div>
        </div>
        <div className="mv-container py-16 text-center">
          <div className="mx-auto max-w-md space-y-3 text-left">
            <ErrorMessage message={paymentRedirectError} />
            {pendingOrderNumber ? (
              <p className="text-[13px] text-mv-muted">
                Your order <span className="font-semibold text-mv-text">{pendingOrderNumber}</span> was placed but payment didn&apos;t start.{" "}
                <Link href={`/track-order?order=${encodeURIComponent(pendingOrderNumber)}`} className="font-semibold text-mv-primary hover:underline">
                  Track it here
                </Link>{" "}
                or contact support to complete payment another way.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mv-bg">
        {/* Breadcrumb */}
        <div className="border-b border-mv-border bg-white py-3">
          <div className="mv-container text-[12px] text-mv-muted">
            <Link href="/" className="hover:text-mv-primary">Home</Link>
            {" > "}
            <Link href="/products/all" className="hover:text-mv-primary">Products</Link>
            {" > "}
            <span className="text-mv-text">Checkout ({items.length} {items.length === 1 ? "item" : "items"})</span>
          </div>
        </div>

        <div className="mv-container py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,400px)]">
            <div className="space-y-6">
              <section className="reveal mv-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-mv-text">Contact Information</h2>
                  {isAuthenticated ? (
                    <span className="text-[12px] font-medium text-mv-muted">
                      Signed in as <span className="font-semibold text-mv-text">{user?.email}</span>
                    </span>
                  ) : (
                    <Link href="/sign-in" className="text-[12px] font-semibold text-mv-primary hover:underline">Log In</Link>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="mv-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12px] text-mv-muted">
                  <button
                    type="button"
                    onClick={() => setEmailUpdates((v) => !v)}
                    className={cn("relative h-5 w-9 rounded-full transition", emailUpdates ? "bg-mv-primary" : "bg-mv-border")}
                  >
                    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", emailUpdates ? "left-[18px]" : "left-0.5")} />
                  </button>
                  Email me with precision updates and exclusive offers
                </label>
              </section>

              <section className="reveal d1 mv-card p-6">
                <h2 className="mb-4 text-[16px] font-bold text-mv-text">Delivery Details</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  className="mt-3 w-full rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="City"
                    className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {isAuthenticated ? (
                  <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12px] text-mv-muted">
                    <button
                      type="button"
                      onClick={() => setSaveAddress((v) => !v)}
                      className={cn("relative h-5 w-9 rounded-full transition", saveAddress ? "bg-mv-primary" : "bg-mv-border")}
                    >
                      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", saveAddress ? "left-[18px]" : "left-0.5")} />
                    </button>
                    Save this address to my account for faster checkout next time
                  </label>
                ) : null}
              </section>

              <section className="reveal d2 mv-card p-6">
                <h2 className="mb-4 text-[16px] font-bold text-mv-text">Shipping Velocity</h2>
                <div className="space-y-3">
                  {shippingOptions.map((opt) => {
                    const Icon = resolveCmsIcon(opt.icon);
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setShipping(opt.key)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition",
                          shipping === opt.key ? "border-mv-primary bg-mv-blue-light/30" : "border-mv-border hover:border-mv-primary/50",
                        )}
                      >
                        <Icon size={20} className={shipping === opt.key ? "text-mv-primary" : "text-mv-muted"} />
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold text-mv-text">{opt.label}</p>
                          <p className="text-[11px] text-mv-muted">{opt.estimated_days}</p>
                        </div>
                        <p className="text-[12px] font-semibold text-[#1a2744]">
                          {opt.price > 0 ? formatPrice(opt.price) : "FREE"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="reveal d3 mv-card p-6">
                <h2 className="mb-4 text-[16px] font-bold text-mv-text">Payment Method</h2>
                <div className="space-y-3">
                  {paymentOptions.map((method) => {
                    const Icon = paymentIconByCode[method.code] ?? Lock;
                    return (
                      <button
                        key={method.code}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(method.code);
                          analytics.addPaymentInfo(
                            items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
                            method.code,
                          );
                        }}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition",
                          paymentMethod === method.code ? "border-mv-primary bg-mv-blue-light/30" : "border-mv-border hover:border-mv-primary/50",
                        )}
                      >
                        <Icon size={20} className={paymentMethod === method.code ? "text-mv-primary" : "text-mv-muted"} />
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold text-mv-text">{method.label}</p>
                          <p className="text-[11px] text-mv-muted">{method.description}</p>
                        </div>
                        <span
                          className={cn(
                            "h-4 w-4 shrink-0 rounded-full border-2",
                            paymentMethod === method.code ? "border-mv-primary bg-mv-primary" : "border-mv-border",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
                {paymentMethod === "sslcommerz" ? (
                  <p className="mt-4 flex items-center gap-2 rounded-xl bg-mv-blue-light/50 px-4 py-3 text-[12px] text-mv-primary">
                    <Lock size={14} />
                    You&apos;ll be redirected to SSLCommerz&apos;s secure page to complete payment. We never see or store your card details.
                  </p>
                ) : null}
              </section>
            </div>

            <div>
              <div className="reveal-right sticky top-24 rounded-xl border border-mv-primary/20 bg-white p-6">
                <h2 className="text-[16px] font-bold text-mv-text">Order Architecture</h2>
                <div className="mt-4 space-y-4">
                  {items.map((item) => (
                    <div key={`${item.source}-${item.id}`} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-mv-bg">
                        <Image
                          src={item.image ?? "/images/placeholders/product.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-mv-text">{item.name}</p>
                        <p className="text-[11px] text-mv-muted">{item.sku}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-mv-border">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.source, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="px-2 py-0.5 text-mv-muted hover:text-mv-text disabled:opacity-40"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-5 text-center text-[11px] font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.source, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="px-2 py-0.5 text-mv-muted hover:text-mv-text"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id, item.source)}
                            aria-label={`Remove ${item.name}`}
                            className="text-mv-muted hover:text-mv-red"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                      <p className="text-[13px] font-bold text-mv-text">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input type="text" placeholder="Promo Code" className="flex-1 rounded-xl border border-mv-border px-3 py-2 text-[12px] outline-none" />
                  <button type="button" className="rounded-xl bg-mv-primary px-4 py-2 text-[12px] font-semibold text-white">Apply</button>
                </div>

                <div className="mt-4 space-y-2 border-t border-mv-border pt-4 text-[13px]">
                  <div className="flex justify-between text-mv-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-mv-muted">
                    <span>Shipping ({shippingLabel})</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-mv-muted">
                    <span>Estimated Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-mv-border pt-2">
                    <span className="font-bold text-mv-text">Total</span>
                    <span className="text-right">
                      <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-mv-muted">BDT</span>
                      <span className="text-[22px] font-bold text-mv-primary">{formatPrice(total)}</span>
                    </span>
                  </div>
                </div>

                {createOrder.isError ? (
                  <div className="mt-4">
                    <ErrorMessage message={getErrorMessage(createOrder.error)} />
                  </div>
                ) : null}

                {paymentRedirectError ? (
                  <div className="mt-4 space-y-2">
                    <ErrorMessage message={paymentRedirectError} />
                    {pendingOrderNumber ? (
                      <p className="text-[12px] text-mv-muted">
                        Your order <span className="font-semibold text-mv-text">{pendingOrderNumber}</span> was placed but payment didn&apos;t start.{" "}
                        <Link href={`/track-order?order=${encodeURIComponent(pendingOrderNumber)}`} className="font-semibold text-mv-primary hover:underline">
                          Track it here
                        </Link>{" "}
                        or contact support to complete payment another way.
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createOrder.isPending || initPayment.isPending}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-mv-navy py-3.5 text-[14px] font-bold text-white disabled:opacity-70"
                >
                  {createOrder.isPending || initPayment.isPending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  {paymentMethod === "sslcommerz" ? "Continue to Payment" : "Place Order"}
                </button>
                <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-widest text-mv-muted">
                  Encrypted &amp; Powered By MotoVessel Core
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-mv-border pt-4 text-center">
                  {[
                    { icon: Shield, label: "Lifetime Warranty" },
                    { icon: Globe, label: "ISO Certified" },
                    { icon: Globe, label: "Global Support" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="text-[9px] text-mv-muted">
                      <Icon size={16} className="mx-auto mb-1 text-mv-primary" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini footer */}
        <div className="border-t border-mv-border bg-white py-4">
          <div className="mv-container flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-wider text-mv-muted">
            <div className="flex flex-wrap gap-4">
              <span>MOTOVESSEL</span>
              <span>SECURE CHECKOUT</span>
              <Link href="/privacy" className="hover:text-mv-primary">PRIVACY POLICY</Link>
              <Link href="/service" className="hover:text-mv-primary">SHIPPING INFO</Link>
              <Link href="/contact" className="hover:text-mv-primary">SUPPORT</Link>
            </div>
            <span>{settings?.footer_copyright || "© 2024 MOTOVESSEL. PRECISION ENGINEERED."}</span>
          </div>
        </div>
    </div>
  );
}
