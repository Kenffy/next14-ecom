"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { LoadingIndicator } from "./ui/loading";
import {
  CreateOrderActions,
  CreateOrderData,
  CreateOrderRequestBody,
} from "@paypal/paypal-js";
import { PayInitialOptions } from "@/features/theme/theme-config";

// const initialOptions = {
//   clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
//   currency: "EUR",
//   intent: "capture",
//   disableFunding: ["credit", "card","paylater"],
// };

export default function PaymentButtons() {
  return (
    //<Button>Paypal</Button>
    <PayPalScriptProvider options={PayInitialOptions}>
      <ButtonWrapper currency={PayInitialOptions.currency} showSpinner={false} />
    </PayPalScriptProvider>
    // <PayPalScriptProvider options={initialOptions}>
    //   <PayPalButtons style={{ layout: "vertical" }} />
    // </PayPalScriptProvider>
  );
}

const ButtonWrapper = ({
  currency,
  showSpinner,
}: {
  currency: string;
  showSpinner: boolean;
}) => {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const style = { layout: "vertical" };
  const amount = "1.00";

//   useEffect(() => {
//     dispatch({
//       type: "resetOptions" as any,
//       value: {
//         ...options,
//         currency: currency,
//       },
//     });
//   }, [currency, dispatch, options]);

  const onCreateOrder = (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    const createOptions: CreateOrderRequestBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    };
    return actions.order.create(createOptions).then((orderId: string) => {
      return orderId;
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      const name = details.payer.name.given_name;
      const shipping = details.purchase_units[0].shipping;
      alert(`Thank you ${name}! Your order is being processed!`);
    });
  };

  return (
    <>
      {showSpinner && isPending && <LoadingIndicator isLoading={showSpinner} />}
      <PayPalButtons
        style={{ layout: "vertical" }}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => onCreateOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
    </>
  );
};
