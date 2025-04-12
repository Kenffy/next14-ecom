// app/product/[id]/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  TruckIcon, 
  RefreshCw, 
  Star, 
  StarHalf, 
  Share2, 
  CheckCircle, 
  ThumbsUp,
  Plus,
  Minus
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Types pour les données produit
interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

interface ProductVariant {
  id: number;
  name: string;
  inStock: boolean;
}

interface ProductReview {
  id: number;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  isVerified: boolean;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
}

export default function ProductPage() {
  // État du produit
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("noir");
  const [selectedSize, setSelectedSize] = useState("m");
  const [activeImageId, setActiveImageId] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Données du produit (normalement chargées depuis une API)
  const product = {
    id: "t-shirt-premium",
    name: "T-shirt Premium Uni",
    price: 29.99,
    originalPrice: 39.99,
    description: "Ce t-shirt premium est fabriqué à partir d'un coton 100% bio et offre un confort exceptionnel. Sa coupe moderne et son tissu doux en font un incontournable de votre garde-robe.",
    features: [
      "100% coton bio certifié",
      "Coupe régulière pour un confort optimal",
      "Col rond renforcé",
      "Coutures doubles pour plus de durabilité",
      "Lavable en machine à 30°"
    ],
    colors: [
      { id: 1, name: "noir", inStock: true },
      { id: 2, name: "blanc", inStock: true },
      { id: 3, name: "bleu marine", inStock: true },
      { id: 4, name: "rouge", inStock: false }
    ],
    sizes: [
      { id: 1, name: "s", inStock: true },
      { id: 2, name: "m", inStock: true },
      { id: 3, name: "l", inStock: true },
      { id: 4, name: "xl", inStock: false }
    ],
    images: [
      { id: 1, url: "/api/placeholder/500/600", alt: "T-shirt noir - Vue de face" },
      { id: 2, url: "/api/placeholder/500/600", alt: "T-shirt noir - Vue de dos" },
      { id: 3, url: "/api/placeholder/500/600", alt: "T-shirt noir - Détail du col" },
      { id: 4, url: "/api/placeholder/500/600", alt: "T-shirt noir - Porté" },
      { id: 5, url: "/api/placeholder/500/600", alt: "T-shirt noir - Porté de haut" },
      { id: 6, url: "/api/placeholder/500/600", alt: "T-shirt noir - Porté de coté" },
    ],
    rating: 4.5,
    reviewCount: 128,
    stock: 15,
    sku: "TS-PREM-001",
    brand: "EcoStyle",
    category: "Vêtements",
    subcategory: "T-shirts",
    tags: ["coton bio", "éco-responsable", "premium", "essentiel"]
  };

  // Avis clients
  const reviews: ProductReview[] = [
    {
      id: 1,
      userName: "Thomas D.",
      rating: 5,
      date: "15/03/2025",
      title: "Excellent rapport qualité-prix",
      comment: "Je suis très satisfait de ce t-shirt. La qualité du tissu est remarquable et la coupe est parfaite. Je recommande vivement !",
      isVerified: true
    },
    {
      id: 2,
      userName: "Camille L.",
      rating: 4,
      date: "02/03/2025",
      title: "Confortable mais taille légèrement petit",
      comment: "Le t-shirt est super confortable et la matière est douce. Je conseille de prendre une taille au-dessus si vous préférez un fit moins ajusté.",
      isVerified: true
    },
    {
      id: 3,
      userName: "Martin P.",
      rating: 5,
      date: "28/02/2025",
      title: "Qualité exceptionnelle",
      comment: "C'est mon troisième achat et je suis toujours aussi satisfait. Le coton est vraiment de qualité supérieure et le t-shirt garde sa forme même après plusieurs lavages.",
      isVerified: false
    }
  ];

  // Produits associés
  const relatedProducts: RelatedProduct[] = [
    { id: 1, name: "Chemise Oxford Classic", price: 49.99, image: "/api/placeholder/200/250" },
    { id: 2, name: "Polo Premium", price: 34.99, image: "/api/placeholder/200/250", discount: 25 },
    { id: 3, name: "T-shirt Col V", price: 24.99, image: "/api/placeholder/200/250" },
    { id: 4, name: "Sweat-shirt Essentiel", price: 39.99, image: "/api/placeholder/200/250" }
  ];

  // Gestion de la quantité
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Vérifier la disponibilité du produit pour la combinaison couleur/taille sélectionnée
  const isSelectedVariantInStock = () => {
    const colorInStock = product.colors.find(c => c.name === selectedColor)?.inStock;
    const sizeInStock = product.sizes.find(s => s.name === selectedSize)?.inStock;
    return colorInStock && sizeInStock;
  };

  // Ajouter au panier
  const addToCart = () => {
    // Simuler l'ajout au panier
    console.log("Ajout au panier:", {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize
    });

    // Afficher la notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Formatter le prix avec la devise
  const formatPrice = (price: number) => `${price.toFixed(2)} €`;

  // Calculer la remise en pourcentage
  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Afficher les étoiles de notation
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 stroke-yellow-400 h-4 w-4" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 stroke-yellow-400 h-4 w-4" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="stroke-gray-300 h-4 w-4" />);
    }

    return stars;
  };

  return (
    <div className="container mx-auto py-36 px-4">
      {/* Fil d'Ariane */}
      <nav className="text-sm mb-4">
        <ol className="flex flex-wrap items-center">
          <li className="flex items-center">
            <Link href="/" className="text-gray-500 hover:text-gray-900">Accueil</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/category/vetements" className="text-gray-500 hover:text-gray-900">Vêtements</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/category/t-shirts" className="text-gray-500 hover:text-gray-900">T-shirts</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Notification d'ajout au panier */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 shadow-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <p className="font-medium">Produit ajouté au panier !</p>
            <p className="text-sm">
              <Link href="/cart" className="underline font-medium">Voir mon panier</Link>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowNotification(false)}
          >
            <span className="sr-only">Fermer</span>
            <span aria-hidden="true">&times;</span>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galerie d'images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images.find(img => img.id === activeImageId)?.url}
              alt={product.images.find(img => img.id === activeImageId)?.alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map(image => (
              <button
                key={image.id}
                type="button"
                className={`aspect-square rounded overflow-hidden border-2 ${
                  activeImageId === image.id ? "border-blue-600" : "border-transparent"
                }`}
                onClick={() => setActiveImageId(image.id)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informations produit */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {renderRatingStars(product.rating)}
                  </div>
                  <Link href="#reviews" className="text-sm text-gray-500">
                    {product.reviewCount} avis
                  </Link>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500" : ""}`} />
              </Button>
            </div>
            
            <div className="mt-4 flex items-baseline">
              <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
              {product.originalPrice > product.price && (
                <>
                  <div className="ml-2 text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                  <Badge className="ml-2 bg-red-500" variant="destructive">
                    -{discountPercentage}%
                  </Badge>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="space-y-1">
            <p className="font-medium">Marque: <span className="font-normal">{product.brand}</span></p>
            <p className="font-medium">SKU: <span className="font-normal">{product.sku}</span></p>
            <p className="font-medium">
              Disponibilité: <span className="font-normal">
                {product.stock > 10 
                  ? "En stock" 
                  : product.stock > 0 
                    ? `Plus que ${product.stock} en stock` 
                    : "Rupture de stock"}
              </span>
            </p>
          </div>

          {/* Sélection de la couleur */}
          <div>
            <h3 className="text-sm font-medium mb-3">Couleur</h3>
            <RadioGroup 
              defaultValue={selectedColor} 
              onValueChange={setSelectedColor} 
              className="flex flex-wrap gap-3"
            >
              {product.colors.map(color => (
                <div key={color.id} className="flex items-center">
                  <RadioGroupItem 
                    value={color.name} 
                    id={`color-${color.name}`} 
                    disabled={!color.inStock}
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={`color-${color.name}`} 
                    className={`cursor-pointer flex flex-col items-center ${!color.inStock ? 'opacity-50' : ''}`}
                  >
                    <div 
                      className={`h-10 w-10 rounded-full border-2 ${
                        selectedColor === color.name ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <span 
                        className="block h-9 w-9 rounded-full m-[1px]" 
                        style={{ backgroundColor: color.name === 'blanc' ? '#ffffff' : color.name === 'noir' ? '#000000' : color.name === 'bleu marine' ? '#0a2463' : color.name === 'rouge' ? '#e63946' : '#cccccc' }}
                      ></span>
                    </div>
                    <span className="mt-1 text-xs capitalize">{color.name}</span>
                    {!color.inStock && <span className="text-xs text-red-500">Épuisé</span>}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sélection de la taille */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Taille</h3>
              <Button variant="link" className="p-0 h-auto text-sm">Guide des tailles</Button>
            </div>
            <RadioGroup 
              defaultValue={selectedSize} 
              onValueChange={setSelectedSize} 
              className="grid grid-cols-5 sm:grid-cols-7 gap-2"
            >
              {product.sizes.map(size => (
                <div key={size.id}>
                  <RadioGroupItem 
                    value={size.name} 
                    id={`size-${size.name}`} 
                    disabled={!size.inStock}
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={`size-${size.name}`} 
                    className={`flex h-9 w-full items-center justify-center rounded-md border text-sm font-medium uppercase
                      ${selectedSize === size.name 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                      } 
                      ${!size.inStock ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'cursor-pointer'}`
                    }
                  >
                    {size.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quantité et ajout au panier */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-md w-full sm:w-36">
              <button
                type="button"
                onClick={decrementQuantity}
                className="p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Réduire la quantité"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                type="button"
                onClick={incrementQuantity}
                className="p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Augmenter la quantité"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button 
              className="flex-1 font-medium flex items-center justify-center space-x-2"
              onClick={addToCart}
              disabled={!isSelectedVariantInStock()}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter au panier
            </Button>
          </div>

          {/* Avantages */}
          <div className="border-t border-b py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <TruckIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Livraison offerte dès 100€</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Retours gratuits sous 30 jours</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Garantie 2 ans</span>
            </div>
          </div>

          {/* Partage */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Partager:</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Détails du produit et avis */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full grid grid-cols-3 mb-8">
            <TabsTrigger value="details">Détails du produit</TabsTrigger>
            <TabsTrigger value="features">Caractéristiques</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="prose max-w-none">
              <p>Ce t-shirt premium est l'alliance parfaite entre style, confort et éco-responsabilité. Fabriqué à partir de 100% de coton bio cultivé sans pesticides ni engrais chimiques, il respecte votre peau comme l'environnement.</p>
              <p>Sa coupe régulière offre un tombé parfait qui convient à toutes les morphologies. Le col rond renforcé conserve sa forme même après de nombreux lavages.</p>
              <p>Conçu pour durer, ce t-shirt est muni de coutures doubles sur les épaules, les manches et l'ourlet. Une pièce essentielle de votre garde-robe qui vous accompagnera saison après saison.</p>
              <h3>Conseils d'entretien:</h3>
              <ul>
                <li>Lavage en machine à 30°C maximum</li>
                <li>Ne pas utiliser d'eau de javel</li>
                <li>Séchage à plat recommandé</li>
                <li>Repassage à basse température</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <ul className="space-y-4">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-medium mb-2">Matière</h3>
                <p className="text-gray-600">100% coton bio (180g/m²)</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Origine</h3>
                <p className="text-gray-600">Fabriqué au Portugal</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Certifications</h3>
                <p className="text-gray-600">GOTS, Fair Trade, OEKO-TEX</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Emballage</h3>
                <p className="text-gray-600">100% recyclable et biodégradable</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" id="reviews" className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-3xl font-bold">{product.rating.toFixed(1)}/5</div>
                  <div className="flex mt-1">
                    {renderRatingStars(product.rating)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{product.reviewCount} avis</div>
                </div>
                <div className="hidden md:block w-px h-12 bg-gray-200 mx-4"></div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-1 text-sm">
                    <span>5</span>
                    <Star className="h-3 w-3" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="text-gray-500">70%</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span>4</span>
                    <Star className="h-3 w-3" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-gray-500">20%</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span>3</span>
                    <Star className="h-3 w-3" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full rounded-full" style={{ width: '7%' }}></div>
                    </div>
                    <span className="text-gray-500">7%</span>
                  </div>
                </div>
              </div>
              <Button className="hidden md:inline-flex">Laisser un avis</Button>
            </div>

            {/* Liste des avis */}
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-t pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderRatingStars(review.rating)}
                        </div>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" /> Achat vérifié
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium mt-2">{review.title}</h4>
                    </div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-700">{review.comment}</p>
                    <div className="mt-3 flex items-center">
                      <span className="text-sm font-medium mr-2">{review.userName}</span>
                      <Button variant="ghost" size="sm" className="h-8 text-gray-500 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" /> Utile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full md:hidden">Laisser un avis</Button>
            <Button variant="outline" className="w-full">Voir tous les avis</Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Produits associés */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Vous aimerez aussi</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/5]">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-red-500" variant="destructive">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <div className="mt-1 font-medium text-sm">{formatPrice(product.price)}</div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Vu récemment & Suggestions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold mb-4">Vu récemment</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <Link href="/product/example" className="block">
                <div className="aspect-[4/5]">
                  <img 
                    src="/api/placeholder/150/190" 
                    alt="Produit vu récemment" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-2">
                  <h3 className="text-xs font-medium line-clamp-1">Sweat-shirt Essentiel</h3>
                  <div className="mt-1 text-xs font-medium">39.99 €</div>
                </CardContent>
              </Link>
            </Card>
            </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Vous pourriez aimer</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <Link href="/product/example" className="block">
                <div className="aspect-[4/5]">
                  <img 
                    src="/api/placeholder/150/190" 
                    alt="Suggestion produit" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-2">
                  <h3 className="text-xs font-medium line-clamp-1">Pantalon Chino</h3>
                  <div className="mt-1 text-xs font-medium">49.99 €</div>
                </CardContent>
              </Link>
            </Card>
            <Card className="overflow-hidden">
              <Link href="/product/example" className="block">
                <div className="aspect-[4/5]">
                  <img 
                    src="/api/placeholder/150/190" 
                    alt="Suggestion produit" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-2">
                  <h3 className="text-xs font-medium line-clamp-1">Veste Légère</h3>
                  <div className="mt-1 text-xs font-medium">59.99 €</div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Comment choisir ma taille ?</h3>
              <p className="text-gray-600 text-sm">Consultez notre guide des tailles pour trouver celle qui vous convient le mieux. Nos t-shirts ont une coupe régulière, mais si vous préférez un style plus ample, nous vous conseillons de prendre une taille au-dessus.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Quels sont les délais de livraison ?</h3>
              <p className="text-gray-600 text-sm">Les commandes sont expédiées sous 24h (jours ouvrés). La livraison standard prend généralement 2-4 jours ouvrés. La livraison express est disponible avec réception sous 24-48h.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Comment entretenir mon t-shirt ?</h3>
              <p className="text-gray-600 text-sm">Pour préserver la qualité de votre t-shirt, nous recommandons un lavage à 30°C maximum, pas de sèche-linge et un repassage à basse température sur l'envers du vêtement.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Est-ce que je peux retourner mon article ?</h3>
              <p className="text-gray-600 text-sm">Oui, vous disposez de 30 jours pour retourner votre article. Les retours sont gratuits et le remboursement est effectué sous 14 jours après réception de votre colis.</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-6">
          <Button variant="outline">Voir toutes les FAQ</Button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous avez des questions ?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Notre équipe de spécialistes est à votre disposition pour vous aider à trouver le produit qui correspond à vos besoins.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            Nous appeler
          </Button>
          <Button className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            Discuter en ligne
          </Button>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-16 border-t pt-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-2">Rejoignez notre newsletter</h2>
          <p className="text-gray-600 mb-4">Recevez 10% de réduction sur votre première commande et soyez informé des nouveautés et offres exclusives.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Votre adresse email" className="sm:flex-1" />
            <Button>S'inscrire</Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">En vous inscrivant, vous acceptez notre politique de confidentialité.</p>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="mt-16 border-t pt-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Produits</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Nouveautés</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Meilleures ventes</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Promotions</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Aide</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Livraison</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Retours</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Notre histoire</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Développement durable</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Nos engagements</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Carrières</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Moyens de paiement</p>
              <div className="flex flex-wrap gap-2">
                <div className="border rounded-md px-2 py-1 text-xs">Visa</div>
                <div className="border rounded-md px-2 py-1 text-xs">Mastercard</div>
                <div className="border rounded-md px-2 py-1 text-xs">PayPal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t py-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 EcoStyle. Tous droits réservés.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="#" className="hover:text-gray-900">Mentions légales</Link>
          <Link href="#" className="hover:text-gray-900">CGV</Link>
          <Link href="#" className="hover:text-gray-900">Politique de confidentialité</Link>
          <Link href="#" className="hover:text-gray-900">Cookies</Link>
        </div>
      </div>
    </div>
  );
};
