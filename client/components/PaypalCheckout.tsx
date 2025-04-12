import { FC, useState } from "react";

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { LoadingIndicator } from "./ui/loading";
import {
  CreateOrderActions,
  CreateOrderData,
  CreateOrderRequestBody,
} from "@paypal/paypal-js";
import useCartService from "@/hooks/useCartStore";
import { PayInitialOptions } from "@/features/theme/theme-config";

interface PaypalCheckoutProps {
    method: string;
}

type FundingSource = 'paypal' | 'paylater' | 'credit' | 'sepa' | 'sofort' | 'card';

export const PaypalCheckout: FC<PaypalCheckoutProps> = (props) => {
    const { method } = props;


    return (
        <PayPalScriptProvider options={PayInitialOptions}>
            <PaypalButtonWrapper method={method} />
        </PayPalScriptProvider>
    );
}

const PaypalButtonWrapper: FC<PaypalCheckoutProps> = ({method}: {method: string}) => {

    const [funding, setFunding] = useState<FundingSource>('paypal');
    const [currency, setCurrency] = useState<string>('EUR');
    const cart = useCartService();
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    console.log("cart currency", cart.currency);
    console.log("method: ", method);

    useEffect(() => {
    //   if (cart.currency) {
    //     dispatch({
    //       type: "resetOptions" as any,
    //       value: {
    //         ...options,
    //         currency: cart.currency.name,
    //       },
    //     });
    //     setCurrency(cart.currency.name);
    //   }
      method && setFunding(getFoundingType(method));
    }, [cart.currency, method, dispatch, options]);

      useEffect(() => {
        // dispatch({
        //   type: "resetOptions" as any,
        //   value: {
        //     ...options,
        //     currency: cart?.currency?.name || "EUR",
        //   },
        // });
      }, [cart.currency, dispatch, options]);

    const getFoundingType = (method: string): FundingSource => {
        switch (method) {
          case 'Mastercard':
          case 'Visa':
            return 'credit';
          case 'Paypal':
            return 'paypal';
        case 'Pay-Later':
            return 'paylater';
          default:
            return 'credit';
        }
      }

    const onCreateOrder = (
        data: CreateOrderData,
        actions: CreateOrderActions
      ) => {
        const createOptions: CreateOrderRequestBody = {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: cart.currency.name,
                value: cart.totalPrice.toString(),
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

      const PaypalCkeckoutButton = () => {
        const styles: PayPalButtonsComponentProps["style"] = {
            shape: "rect",
            layout: "horizontal",
            color: "blue"
        };
        return (
          <PayPalButtons
            style={styles}
            className="w-full"
            disabled={false}
            forceReRender={[cart.totalPrice, "EUR", styles]}
            fundingSource={"paypal"}
            createOrder={(data, actions) => onCreateOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
          />
        );
      }

      const SepaCheckoutButton = () => {
        const styles: PayPalButtonsComponentProps["style"] = {
            shape: "rect",
            layout: "horizontal"
        };
        return (
          <PayPalButtons
            style={styles}
            className="w-full"
            disabled={false}
            forceReRender={[cart.totalPrice, "EUR", styles]}
            fundingSource={"sepa"}
            createOrder={(data, actions) => onCreateOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
          />
        );
      }
    
      return (
        <>
          {isPending && <LoadingIndicator isLoading={isPending} />}
          {method && method === 'paypal' && <PaypalCkeckoutButton />}
          {method && method === "Sepa" && <SepaCheckoutButton />}
          {/* <PayPalButtons
            style={styles}
            className="w-full"
            disabled={false}
            forceReRender={[cart.totalPrice, "EUR", styles]}
            fundingSource={"sepa"}//{getFoundingType(method) || "credit"}
            createOrder={(data, actions) => onCreateOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
          /> */}
        </>
      );
}