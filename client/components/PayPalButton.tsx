"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialOptions = {
    clientId: "test",//process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "EUR",
    intent: "capture",
  };

export default function PaymentButtons() {
    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons style={{ layout: "vertical" }} />
        </PayPalScriptProvider>
    );
}