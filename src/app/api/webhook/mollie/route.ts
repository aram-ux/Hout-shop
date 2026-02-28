import { NextRequest, NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie";
import { PaymentStatus } from "@mollie/api-client";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

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
    const paymentId = body.id;

    if (!paymentId) {
      return NextResponse.json({ error: "No payment ID" }, { status: 400 });
    }

    const mollieClient = getMollieClient();
    const payment = await mollieClient.payments.get(paymentId);

    const metadata = payment.metadata as {
      orderNumber: string;
      orderId: string;
    };

    if (!metadata?.orderId) {
      return NextResponse.json(
        { error: "No order ID in metadata" },
        { status: 400 }
      );
    }

    // Map Mollie status to our order status
    let orderStatus = "pending";
    if (payment.status === PaymentStatus.paid) {
      orderStatus = "paid";
    } else if (
      payment.status === PaymentStatus.failed ||
      payment.status === PaymentStatus.expired
    ) {
      orderStatus = "cancelled";
    }

    // Update order status in Sanity
    await writeClient
      .patch(metadata.orderId)
      .set({ status: orderStatus })
      .commit();

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
