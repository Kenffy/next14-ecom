// app/checkout/page.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, CreditCard, ArrowRight, ShoppingCart } from "lucide-react";

// Simuler des produits du panier
const cartItems = [
  { id: 1, name: "T-shirt Premium", price: 29.99, quantity: 1, image: "/api/placeholder/60/60" },
  { id: 2, name: "Chaussures de sport", price: 89.99, quantity: 1, image: "/api/placeholder/60/60" },
];

// Interface pour les méthodes de paiement
interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Carte de crédit",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Paiement sécurisé par carte bancaire",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <div className="font-bold text-blue-600">Pay</div>,
    description: "Paiement rapide via votre compte PayPal",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: <div className="font-bold">Apple Pay</div>,
    description: "Payer facilement avec Apple Pay",
  },
];

// Schéma de validation Zod pour le formulaire
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

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [orderComplete, setOrderComplete] = useState(false);

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
      country: "France",
      phone: "",
      paymentMethod: "card",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  // Calculer le total
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Données soumises:", data);
    
    // Simuler une demande API
    setIsProcessing(true);
    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card className="w-full">
          <CardHeader className="text-center bg-green-50">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Commande confirmée!</CardTitle>
            <CardDescription>
              Votre numéro de commande est <span className="font-bold">#12345</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-center text-gray-600">
              Nous vous avons envoyé un email de confirmation à <span className="font-medium">votre@email.com</span>. 
              Vous recevrez bientôt des informations sur la livraison de votre commande.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <Button className="w-full sm:w-auto">Suivre ma commande</Button>
              <Button variant="outline" className="w-full sm:w-auto">Continuer mes achats</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Finaliser votre commande</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de commande */}
        <div className="lg:col-span-2">
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="shipping" 
                disabled={activeStep !== "shipping"}
                className={activeStep === "shipping" ? "font-bold" : ""}
              >
                1. Livraison
              </TabsTrigger>
              <TabsTrigger 
                value="payment" 
                disabled={activeStep !== "payment"}
                className={activeStep === "payment" ? "font-bold" : ""}
              >
                2. Paiement
              </TabsTrigger>
              <TabsTrigger 
                value="review" 
                disabled={activeStep !== "review"}
                className={activeStep === "review" ? "font-bold" : ""}
              >
                3. Vérification
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="shipping" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de livraison</CardTitle>
                    <CardDescription>Entrez vos coordonnées pour la livraison</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
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
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          {...register("city")}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm">{errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          {...register("postalCode")}
                          className={errors.postalCode ? "border-red-500" : ""}
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        {...register("country")}
                        className={errors.country ? "border-red-500" : ""}
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm">{errors.country.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="button" 
                      onClick={goToNextStep}
                      className="ml-auto flex items-center"
                    >
                      Continuer au paiement <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Méthode de paiement</CardTitle>
                    <CardDescription>Choisissez votre méthode de paiement préférée</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup 
                      defaultValue={selectedPaymentMethod} 
                      className="space-y-4"
                      {...register("paymentMethod")}
                    >
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                          <Label 
                            htmlFor={`payment-${method.id}`}
                            className="flex items-center justify-between w-full cursor-pointer"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-8">{method.icon}</div>
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-gray-500">{method.description}</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {selectedPaymentMethod === "card" && (
                      <div className="mt-6 space-y-4 border rounded-md p-4 bg-gray-50">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            {...register("cardNumber")}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Date d'expiration</Label>
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
                      onClick={goToPreviousStep}
                    >
                      Retour
                    </Button>
                    <Button 
                      type="button" 
                      onClick={goToNextStep}
                      className="flex items-center"
                    >
                      Continuer <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="review" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vérification de la commande</CardTitle>
                    <CardDescription>Vérifiez que toutes les informations sont correctes avant de confirmer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">Livraison</h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-medium">{watch("firstName")} {watch("lastName")}</p>
                          <p>{watch("address")}</p>
                          <p>{watch("postalCode")} {watch("city")}, {watch("country")}</p>
                          <p>Email: {watch("email")}</p>
                          <p>Téléphone: {watch("phone")}</p>
                        </div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={() => setActiveStep("shipping")}
                        >
                          Modifier
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold text-lg">Méthode de paiement</h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>{paymentMethods.find(m => m.id === watch("paymentMethod"))?.name}</p>
                          {watch("paymentMethod") === "card" && watch("cardNumber") && (
                            <p>Carte se terminant par {watch("cardNumber")?.slice(-4)}</p>
                          )}
                        </div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={() => setActiveStep("payment")}
                        >
                          Modifier
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold text-lg">Produits</h3>
                        <div className="mt-2 space-y-3">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <div className="flex items-center space-x-4">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-medium">{item.price.toFixed(2)} €</p>
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
                      Retour
                    </Button>
                    <Button 
                      type="submit"
                      className="w-full sm:w-auto flex items-center"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Traitement en cours...</>
                      ) : (
                        <>Confirmer et payer {total.toFixed(2)} €</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
        
        {/* Récapitulatif de commande */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{item.price.toFixed(2)} €</p>
                </div>
              ))}
              
              <Separator className="my-2" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frais de livraison</span>
                  <span>{shipping.toFixed(2)} €</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200 mt-4">
                <AlertDescription className="text-sm text-blue-700">
                  La livraison estimée est de 3-5 jours ouvrés.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}