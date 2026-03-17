"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/analytics";

interface PurchaseTrackerProps {
  orderNumber: string;
}

/**
 * Fires the GA4 purchase event once per order.
 * Reads cart data from localStorage before it's cleared.
 */
export default function PurchaseTracker({ orderNumber }: PurchaseTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !orderNumber) return;
    tracked.current = true;

    try {
      // Read cart from localStorage (Zustand persisted key)
      const raw = localStorage.getItem("hout-shop-cart");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const items = parsed?.state?.items;
      if (!Array.isArray(items) || items.length === 0) return;

      const subtotal = items.reduce(
        (sum: number, item: { unitPrice: number; quantity: number }) =>
          sum + item.unitPrice * item.quantity,
        0
      );
      const shipping = subtotal >= 500 ? 0 : 29.95;
      const total = subtotal + shipping;

      trackPurchase(
        orderNumber,
        total,
        shipping,
        items.map((item: { productId: string; productTitle: { nl?: string }; unitPrice: number; quantity: number }) => ({
          id: item.productId,
          name: item.productTitle?.nl || "Product",
          price: item.unitPrice,
          quantity: item.quantity,
        }))
      );
    } catch {
      // Silent fail — tracking is non-critical
    }
  }, [orderNumber]);

  return null;
}
