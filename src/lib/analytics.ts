"use client";

/**
 * E-commerce event tracking helpers for GA4.
 * Only fires events when cookie consent is granted and GA is loaded.
 */

type GtagEvent = Record<string, unknown>;

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag(...args);
  }
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("hout-shop-cookie-consent") === "granted";
}

function trackEvent(eventName: string, params: GtagEvent) {
  if (!hasConsent()) return;
  gtag("event", eventName, params);
}

/** Product list viewed (e.g. category page) */
export function trackViewItemList(items: { id: string; name: string; category?: string; price?: number }[], listName?: string) {
  trackEvent("view_item_list", {
    item_list_name: listName || "Products",
    items: items.map((item, i) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || "",
      price: item.price || 0,
      index: i,
    })),
  });
}

/** Single product viewed */
export function trackViewItem(product: { id: string; name: string; category?: string; price?: number }) {
  trackEvent("view_item", {
    currency: "EUR",
    value: product.price || 0,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category || "",
      price: product.price || 0,
    }],
  });
}

/** Item added to cart */
export function trackAddToCart(item: { id: string; name: string; category?: string; price: number; quantity: number }) {
  trackEvent("add_to_cart", {
    currency: "EUR",
    value: item.price * item.quantity,
    items: [{
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || "",
      price: item.price,
      quantity: item.quantity,
    }],
  });
}

/** Item removed from cart */
export function trackRemoveFromCart(item: { id: string; name: string; price: number; quantity: number }) {
  trackEvent("remove_from_cart", {
    currency: "EUR",
    value: item.price * item.quantity,
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }],
  });
}

/** Checkout started */
export function trackBeginCheckout(value: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  trackEvent("begin_checkout", {
    currency: "EUR",
    value,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/** Purchase completed */
export function trackPurchase(transactionId: string, value: number, shipping: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  trackEvent("purchase", {
    transaction_id: transactionId,
    currency: "EUR",
    value,
    shipping,
    tax: Math.round(value / 1.21 * 0.21 * 100) / 100,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}
