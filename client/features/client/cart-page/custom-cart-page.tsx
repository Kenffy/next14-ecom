// app/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, TruckIcon, ShieldCheck, RefreshCw } from "lucide-react";
import { CgShoppingBag } from "react-icons/cg";
import { useSession } from "next-auth/react";
import CheckoutAuthOptions from "@/components/CheckoutAuthOptions";
import useCartService from "@/hooks/useCartStore";

// Types pour notre système de panier
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  inStock: boolean;
}

export default function CartPage() {

  const { data: session } = useSession();
  const cart = useCartService();
  const [onCheckout, setOnCheckout] = useState<boolean>(false);
  const [onDialog, setOnDialog] = useState<boolean>(false);
  // État initial du panier
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "T-shirt Premium",
      price: 29.99,
      quantity: 1,
      image: "/api/placeholder/80/80",
      size: "M",
      color: "Noir",
      inStock: true,
    },
    {
      id: 2,
      name: "Chaussures de sport",
      price: 89.99,
      quantity: 1,
      image: "/api/placeholder/80/80",
      size: "42",
      color: "Bleu",
      inStock: true,
    },
    {
      id: 3,
      name: "Sac à dos - Collection Aventure",
      price: 49.99,
      quantity: 1,
      image: "/api/placeholder/80/80",
      color: "Vert",
      inStock: true,
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculs du panier
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% de réduction si un code promo est appliqué
  const shipping = subtotal > 100 ? 0 : 5.99; // Livraison gratuite au-dessus de 100€
  const total = subtotal - discount + shipping;

  // Gestion de la quantité
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Suppression d'un article
  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Application du code promo
  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    
    // Simuler une vérification API
    setTimeout(() => {
      if (promoCode.toLowerCase() === "bienvenue10") {
        setPromoApplied(true);
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleCheckout = () => {
    if(session){
      setOnCheckout(true);
    } else {
      setOnDialog(true);
    }
  }

  // Vérifier si le panier est vide
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="container mx-auto py-36 px-4">
      {onDialog && !session && <CheckoutAuthOptions onClose={setOnDialog} />}
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <CgShoppingBag className="mr-3 h-7 w-7" />
        Votre Panier
      </h1>

      {isCartEmpty ? (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <CgShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Votre panier est vide
            </h2>
            <p className="text-gray-500 mb-6">
              Explorez notre catalogue et trouvez des produits qui vous
              plaisent.
            </p>
            <Button className="px-6">
              <Link href="/products">Découvrir nos produits</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Articles ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-gray-500">
                          {item.size && (
                            <span className="mr-2">Taille: {item.size}</span>
                          )}
                          {item.color && <span>Couleur: {item.color}</span>}
                        </div>
                        <div className="text-sm font-medium">
                          {item.price.toFixed(2)} €
                        </div>
                        {item.inStock ? (
                          <span className="text-sm text-green-600 flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                            En stock
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 flex items-center">
                            <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                            Stock limité
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0 w-full sm:w-auto">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Réduire la quantité"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Input
                      placeholder="Code promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={isApplyingPromo || !promoCode || promoApplied}
                    >
                      {isApplyingPromo ? "Vérification..." : "Appliquer"}
                    </Button>
                  </div>

                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Select defaultValue="standard">
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Mode de livraison" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          Standard (3-5 jours)
                        </SelectItem>
                        <SelectItem value="express">
                          Express (1-2 jours)
                        </SelectItem>
                        <SelectItem value="pickup">
                          Retrait en magasin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-4">
                <Button variant="outline">
                  <Link href="/products">Continuer les achats</Link>
                </Button>
                <Button variant="outline" onClick={() => setCartItems([])}>
                  Vider le panier
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4 text-center flex flex-col items-center">
                <TruckIcon className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium">Livraison rapide</h3>
                <p className="text-sm text-gray-500">Expédition sous 24h</p>
              </Card>

              <Card className="p-4 text-center flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium">Retours gratuits</h3>
                <p className="text-sm text-gray-500">Pendant 30 jours</p>
              </Card>

              <Card className="p-4 text-center flex flex-col items-center">
                <ShieldCheck className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium">Paiement sécurisé</h3>
                <p className="text-sm text-gray-500">Transactions cryptées</p>
              </Card>
            </div>
          </div>

          {/* Récapitulatif et paiement */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Réduction (10%)</span>
                      <span>-{discount.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Frais de livraison</span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratuit</span>
                    ) : (
                      <span>{shipping.toFixed(2)} €</span>
                    )}
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>

                {subtotal < 100 && (
                  <Alert className="bg-blue-50 border-blue-200 mt-4">
                    <AlertDescription className="text-sm text-blue-700">
                      Plus que {(100 - subtotal).toFixed(2)} € pour bénéficier
                      de la livraison gratuite !
                    </AlertDescription>
                  </Alert>
                )}

                {promoApplied && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-sm text-green-700">
                      Code promo "BIENVENUE10" appliqué avec succès !
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                {session && session?.user ? (
                  <Button
                    disabled={cart.items.length === 0}
                    className="w-full flex items-center justify-center"
                    asChild
                  >
                    <Link href="/checkout">
                      Passer à la caisse <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckout}
                    disabled={cart.items.length === 0}
                    className="w-full flex items-center justify-center"
                  >
                      Passer à la caisse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className="mt-6 p-4">
              <div className="text-sm space-y-2">
                <h3 className="font-semibold">Nous acceptons</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="border rounded-md px-3 py-1 text-xs">
                    Visa
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    Mastercard
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    American Express
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    PayPal
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    Apple Pay
                  </div>
                </div>
              </div>
            </Card>

            <Card className="mt-6 p-4">
              <div className="text-sm space-y-2">
                <h3 className="font-semibold">Besoin d'aide ?</h3>
                <p className="text-gray-500">
                  Notre service client est disponible 7j/7 de 9h à 19h.
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Contactez-nous
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}