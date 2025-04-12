"use client";
import { Button } from "@/components/ui/button";
import useCartService from "@/hooks/useCartStore";
import { AddressModel, PaymentType } from "@/schemas/models";
import { useSession } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import { CheckoutForm } from "./checkout-forms/checkout-form";
import { PaymentMethodForm } from "./checkout-forms/payment-method-form";
import { AddressForm } from "./checkout-forms/address-form";
import { CustomerInfoForm } from "./checkout-forms/customer-infos-form";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { computeCurrentPrice, computeDiscountPrice } from "@/lib/utils";
import { CartSummaryPrices } from "../cart-page/cart-summary-prices";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Check,
  CreditCard,
  ArrowRight,
  ShoppingCart,
  ArrowLeft,
  AppleIcon,
} from "lucide-react";
import { CartSummary } from "../cart-page/cart-summary";
import { CgAppleWatch, CgPaypal, CgShoppingBag } from "react-icons/cg";
import { FaApple } from "react-icons/fa";

interface CheckoutPageProps {}

const checkoutSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  country: z.string().min(2, "Pays requis"),
  phone: z.string().min(10, "Numéro de téléphone requis"),
  paymentMethod: z.string().min(1, "Méthode de paiement requise"),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit Card",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Secure credit card payment",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <CgPaypal className="h-5 w-5" />,
    description: "Quick payment via your PayPal account",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: <FaApple className="h-5 w-5" />,
    description: "Pay easily with Apple Pay",
  },
];

export const CheckoutPage: FC<CheckoutPageProps> = (props) => {
  const cart = useCartService();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<
    "shipping" | "payment" | "review"
  >("shipping");
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(
    null
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentType | null>(
    null
  );

  const [userInfos, setUserInfos] = useState({
    title: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
      paymentMethod: "paypal",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (cart && cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart]);

  const handleShippingAdress = (name: string, value: string) => {
    setSelectedAddress((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleUserInfos = (name: string, value: string) => {
    setUserInfos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectedPaymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Données soumises:", data);

    // Simuler une demande API
    setIsProcessing(true);
    try {
      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simuler un paiement réussi
      setOrderComplete(true);
    } catch (error) {
      console.error("Erreur lors du traitement du paiement:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToNextStep = () => {
    if (activeStep === "shipping") setActiveStep("payment");
    else if (activeStep === "payment") setActiveStep("review");
  };

  const goToPreviousStep = () => {
    if (activeStep === "payment") setActiveStep("shipping");
    else if (activeStep === "review") setActiveStep("payment");
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto py-36 px-4 max-w-4xl">
        <Card className="w-full rounded-md overflow-hidden">
          <CardHeader className="text-center bg-green-50">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Order confirmed!
            </CardTitle>
            <CardDescription>
              Your order number is <span className="font-bold">#12345</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-center text-gray-600">
              We have sent a confirmation email to{" "}
              <span className="font-medium">votre@email.com</span>.
              <span>You will soon receive information about the delivery of your order.</span>
            </p>
            <div className="flex flex-col items-center space-y-4">
              <Button className="w-full sm:w-auto">Track my order</Button>
              <Button onClick={() => router.push("/shop")} variant="outline" className="w-full sm:w-auto">
                Continue shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" w-full container mx-auto min-h-screen flex flex-col gap-4 py-16">
      <div className=" my-2 md:my-4 flex items-center justify-between pt-16">
        <span className=" flex items-center p-0 gap-2 md:gap-4 text-xl md:text-2xl">
          Checkout
        </span>
        <Button onClick={() => router.back()} variant="outline">
          Back to Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="shipping"
                disabled={activeStep !== "shipping"}
                className={activeStep === "shipping" ? "font-bold" : ""}
              >
                1. Shipping
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                disabled={activeStep !== "payment"}
                className={activeStep === "payment" ? "font-bold" : ""}
              >
                2. Payment
              </TabsTrigger>
              <TabsTrigger
                value="review"
                disabled={activeStep !== "review"}
                className={activeStep === "review" ? "font-bold" : ""}
              >
                3. Verification
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="shipping" className="space-y-6">
                <Card className=" rounded-md">
                  <CardHeader>
                    <CardTitle>Delivery information</CardTitle>
                    <CardDescription>
                      Enter your delivery address
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...register("city")}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal code</Label>
                        <Input
                          id="postalCode"
                          {...register("postalCode")}
                          className={errors.postalCode ? "border-red-500" : ""}
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm">
                            {errors.postalCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...register("country")}
                        className={errors.country ? "border-red-500" : ""}
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      className="ml-auto flex items-center"
                    >
                      Continue to checkout{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                <Card className=" rounded-md">
                  <CardHeader>
                    <CardTitle>Payment method</CardTitle>
                    <CardDescription>
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      defaultValue={selectedPaymentMethod}
                      className="space-y-4"
                      {...register("paymentMethod")}
                    >
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center space-x-2 border rounded-md p-4"
                        >
                          <RadioGroupItem
                            value={method.id}
                            id={`payment-${method.id}`}
                          />
                          <Label
                            htmlFor={`payment-${method.id}`}
                            className="flex items-center justify-between w-full cursor-pointer"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-8">{method.icon}</div>
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-gray-500">
                                  {method.description}
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {selectedPaymentMethod === "card" && (
                      <div className="mt-6 space-y-4 border rounded-md p-4 bg-gray-50">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            {...register("cardNumber")}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiration date</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/AA"
                              {...register("cardExpiry")}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input
                              id="cardCvc"
                              placeholder="123"
                              {...register("cardCvc")}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center w-32"
                      onClick={goToPreviousStep}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      className="flex items-center w-32"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="review" className="space-y-6">
                <Card className=" rounded-md">
                  <CardHeader>
                    <CardTitle>Order verification</CardTitle>
                    <CardDescription>
                      Check if all informations are correct before confirming.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">Shipping</h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-medium">
                            {watch("firstName")} {watch("lastName")}
                          </p>
                          <p>{watch("address")}</p>
                          <p>
                            {watch("postalCode")} {watch("city")},{" "}
                            {watch("country")}
                          </p>
                          <p>Email: {watch("email")}</p>
                          <p>Téléphone: {watch("phone")}</p>
                        </div>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => setActiveStep("shipping")}
                        >
                          Modify
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-lg">
                          Payment method
                        </h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>
                            {
                              paymentMethods.find(
                                (m) => m.id === watch("paymentMethod")
                              )?.name
                            }
                          </p>
                          {watch("paymentMethod") === "card" &&
                            watch("cardNumber") && (
                              <p>
                                Card end with {watch("cardNumber")?.slice(-4)}
                              </p>
                            )}
                        </div>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => setActiveStep("payment")}
                        >
                          Modify
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-lg">Produits</h3>
                        <div className="mt-2 space-y-3">
                          {cart.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex py-4 border-t-[1px] relative"
                            >
                              <Image
                                src={item.image.url}
                                alt={item.slug}
                                width={70}
                                height={70}
                                className=" flex-none w-[70px] h-[70px] rounded-md object-cover object-center cursor-pointer"
                              />

                              <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
                                <h1 className=" w-full text-sm line-clamp-2 ">
                                  {item.name}
                                </h1>

                                <div className=" flex items-center gap-2 md:gap-4">
                                  <div className=" w-full flex gap-2 flex-col items-end sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className=" text-sm md:text-md">
                                        {`${item.qty}x${
                                          item.discount && item.discount > 0
                                            ? formatCurrency(
                                                computeDiscountPrice(item)
                                              )
                                            : formatCurrency(item.price)
                                        }`}
                                      </span>

                                      <span className=" line-through text-sm md:text-md text-muted-foreground">
                                        {item.discount && item.discount > 0
                                          ? `${item.qty}x${formatCurrency(
                                              item.price
                                            )}`
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousStep}
                      className="w-full sm:w-auto"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto flex items-center"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Traitement en cours...</>
                      ) : (
                        <>Confirm and pay {cart.totalPrice.toFixed(2)} €</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-6 rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CgShoppingBag className="mr-3 h-7 w-7" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className=" flex flex-col">
                {cart.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex py-4 border-t-[1px] relative"
                  >
                    <Image
                      src={item.image.url}
                      alt={item.slug}
                      width={60}
                      height={60}
                      className=" flex-none w-[50px] h-[50px] rounded-md object-cover object-center cursor-pointer"
                    />

                    <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
                      <h1 className=" w-full text-sm line-clamp-1 ">
                        {item.name}
                      </h1>

                      <div className=" flex items-center gap-2 md:gap-4">
                        <div className=" w-full flex gap-2 flex-col items-end sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <span className=" text-sm md:text-md">
                              {`${item.qty}x${
                                item.discount && item.discount > 0
                                  ? formatCurrency(computeDiscountPrice(item))
                                  : formatCurrency(item.price)
                              }`}
                            </span>

                            <span className=" line-through text-sm md:text-md text-muted-foreground">
                              {item.discount && item.discount > 0
                                ? `${item.qty}x${formatCurrency(item.price)}`
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CartSummary cart={cart} />
              <Alert className="bg-secondary border-secondary-foreground/30 mt-4 rounded-md">
                <AlertDescription className="text-sm text-muted-foreground">
                  Estimated delivery: 2-3 days from Germany
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// const test = () => {
//   return (
//     <div className="grid md:grid-cols-3 md:gap-3">
//         <div className="col-span-1 my-6 md:mt-0 px-2 flex flex-col gap-2 sm:hidden">
//           <h2 className="text-xl">Cart Details</h2>
//           <div className=" flex flex-col">
//             {cart.items.map((item, index) => (
//               <div key={index} className="flex py-4 border-b-[1px] relative">
//                 <Image
//                   src={item.image.url}
//                   alt={item.slug}
//                   width={60}
//                   height={60}
//                   className=" flex-none w-[50px] h-[50px] rounded-md object-cover object-center cursor-pointer"
//                 />

//                 <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
//                   <h1 className=" w-full text-sm line-clamp-2 ">{item.name}</h1>

//                   <div className=" flex items-center gap-2 md:gap-4">
//                     <div className=" w-full flex gap-2 flex-col items-end sm:flex-row sm:items-center sm:justify-between">
//                       <div className="flex items-center gap-3">
//                         <span className=" text-sm md:text-md">
//                           {`${item.qty}x${
//                             item.discount && item.discount > 0
//                               ? formatCurrency(computeDiscountPrice(item))
//                               : formatCurrency(item.price)
//                           }`}
//                         </span>

//                         <span className=" line-through text-sm md:text-md text-muted-foreground">
//                           {item.discount && item.discount > 0
//                             ? `${item.qty}x${formatCurrency(item.price)}`
//                             : ""}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <CartSummaryPrices />
//         </div>

//         <div className="md:col-span-2">
//           {session && session.user ? (
//             <div className="flex flex-col gap-6">
//               <CustomerInfoForm
//                 customer={userInfos}
//                 onChangeValues={handleUserInfos}
//               />
//               <AddressForm
//                 onChange={setSelectedAddress}
//                 addressList={AddressList}
//                 selectedAddress={selectedAddress}
//                 onChangeValues={handleShippingAdress}
//               />
//               <PaymentMethodForm
//                 onChange={setSelectedMethod}
//                 selectedMethod={selectedMethod}
//               />

//               <div className="mt-3 flex items-center gap-3 w-full sm:w-[90%]">
//                 <Button
//                   onClick={() => router.push("/cart")}
//                   className="flex-1 cursor-pointer"
//                   variant="outline"
//                 >
//                   Back to Cart
//                 </Button>
//                 <Button
//                   onClick={() => console.log("checkout")}
//                   className="flex-1 cursor-pointer"
//                 >
//                   Checkout
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <CheckoutForm
//                 customer={userInfos}
//                 selectedAddress={selectedAddress}
//                 onChangeMethod={setSelectedMethod}
//                 onChangeUserValues={handleUserInfos}
//                 onChangeAddressValues={handleShippingAdress}
//                 selectedMethod={selectedMethod}
//               />
//             </>
//           )}
//         </div>

//         <div className="col-span-1 mt-6 md:mt-0 px-2 hidden sm:flex flex-col gap-2">
//           <h2 className="text-xl">Cart Details</h2>
//           <div className=" flex flex-col">
//             {cart.items.map((item, index) => (
//               <div key={index} className="flex py-4 border-b-[1px] relative">
//                 <Image
//                   src={item.image.url}
//                   alt={item.slug}
//                   width={60}
//                   height={60}
//                   className=" flex-none w-[50px] h-[50px] rounded-md object-cover object-center cursor-pointer"
//                 />

//                 <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
//                   <h1 className=" w-full text-sm line-clamp-2 ">{item.name}</h1>

//                   <div className=" flex items-center gap-2 md:gap-4">
//                     <div className=" w-full flex gap-2 flex-col items-end sm:flex-row sm:items-center sm:justify-between">
//                       <div className="flex items-center gap-3">
//                         <span className=" text-sm md:text-md">
//                           {`${item.qty}x${
//                             item.discount && item.discount > 0
//                               ? formatCurrency(computeDiscountPrice(item))
//                               : formatCurrency(item.price)
//                           }`}
//                         </span>

//                         <span className=" line-through text-sm md:text-md text-muted-foreground">
//                           {item.discount && item.discount > 0
//                             ? `${item.qty}x${formatCurrency(item.price)}`
//                             : ""}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <CartSummaryPrices />
//         </div>
//       </div>
//   )
// }
