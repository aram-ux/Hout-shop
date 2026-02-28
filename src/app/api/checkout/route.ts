import { NextRequest, NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie";
import { Locale as MollieLocale } from "@mollie/api-client";
import { createClient } from "next-sanity";
import { generateOrderNumber } from "@/lib/utils";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Write client for creating orders
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, locale, subtotal, shipping, total } = body;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in Sanity
    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      shippingAddress: {
        street: customer.shippingStreet,
        city: customer.shippingCity,
        postalCode: customer.shippingPostalCode,
        country: customer.shippingCountry,
      },
      billingAddress: customer.sameAsBilling
        ? {
            street: customer.shippingStreet,
            city: customer.shippingCity,
            postalCode: customer.shippingPostalCode,
            country: customer.shippingCountry,
          }
        : {
            street: customer.billingStreet,
            city: customer.billingCity,
            postalCode: customer.billingPostalCode,
            country: customer.billingCountry,
            vatNumber: customer.vatNumber,
            companyName: customer.companyName,
          },
      items: items.map((item: Record<string, unknown>) => ({
        _type: "object",
        productTitle: item.productTitle,
        productSlug: item.productSlug,
        quantity: item.quantity,
        width: item.width,
        height: item.height,
        thickness: item.thickness,
        isCustomSize: item.isCustomSize,
        unitPrice: item.unitPrice,
        totalPrice:
          (item.unitPrice as number) * (item.quantity as number),
      })),
      subtotal,
      shippingCost: shipping,
      vatAmount: Math.round(total * 0.21 * 100) / 100,
      totalAmount: total,
      status: "pending",
      locale,
      notes: customer.notes || "",
    });

    // Create Mollie payment
    const mollieClient = getMollieClient();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const localePrefix = locale === "nl" ? "" : `/${locale}`;
    const successPath: Record<string, string> = {
      nl: "/afrekenen/succes",
      fr: "/paiement/succes",
      en: "/checkout/success",
    };

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: total.toFixed(2),
      },
      description: `Hout-Shop Bestelling #${orderNumber}`,
      redirectUrl: `${baseUrl}${localePrefix}${successPath[locale] || "/checkout/success"}?orderNumber=${orderNumber}`,
      webhookUrl: `${baseUrl}/api/webhook/mollie`,
      metadata: {
        orderNumber,
        orderId: order._id,
      },
      locale: locale === "nl" ? MollieLocale.nl_BE : locale === "fr" ? MollieLocale.fr_BE : MollieLocale.en_US,
    });

    // Update order with Mollie payment ID
    await writeClient
      .patch(order._id)
      .set({ molliePaymentId: payment.id })
      .commit();

    return NextResponse.json({
      checkoutUrl: payment.getCheckoutUrl(),
      orderNumber,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
