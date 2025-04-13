// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Trash2,
  PenSquare,
  MoveRight,
  Truck,
  CreditCard,
  Clock,
  Check,
} from "lucide-react";
import { AddressModel, UserModel } from "@/schemas/models";
import { profileStore, useProfileState } from "./profile-store";
import { RedirectToPage } from "@/features/common/navigation-helpers";

// Types basés sur les modèles Mongoose
interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  acceptedTerms: boolean;
}

interface Address {
  _id: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  userId: string;
  default: boolean;
}

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  qty: number;
  image: string;
  price: number;
  discount?: number;
}

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  personalisable: boolean;
  personalisation?: string;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

interface ProfilePageProps {
    currentUser: UserModel;
    shippingAddresses: AddressModel [];
}

// Composant principal de la page de profil
export default function ProfilePage(props: ProfilePageProps) {
  const { toast } = useToast();
  const {user, addresses, defaultAddress} = useProfileState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);


  useEffect(() => {
    profileStore.initProfileSession({
      user: props.currentUser,
      addresses: props.shippingAddresses,
    });
  }, [props.currentUser, props.shippingAddresses]);

  // État pour le formulaire du profil
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  // État pour le formulaire d'adresse
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    default: false,
  });

  // Simuler le chargement des données de l'utilisateur
  useEffect(() => {
    // Dans une application réelle, ceci serait remplacé par des appels API
    setTimeout(() => {

      const mockOrders: Order[] = [
        {
          _id: "order1",
          userId: "user123",
          items: [
            {
              productId: "prod1",
              name: "Chemise Élégante",
              slug: "chemise-elegante",
              qty: 2,
              image: "/placeholder-product.jpg",
              price: 39.99,
              discount: 10,
            },
            {
              productId: "prod2",
              name: "Pantalon Classique",
              slug: "pantalon-classique",
              qty: 1,
              image: "/placeholder-product.jpg",
              price: 59.99,
            },
          ],
          shippingAddress: {
            fullName: "Jean Dupont",
            street: "123 Rue de Paris",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          },
          personalisable: true,
          personalisation: "Pour Pierre",
          paymentMethod: "Carte Bancaire",
          itemsPrice: 139.97,
          shippingPrice: 5.99,
          taxPrice: 29.19,
          totalPrice: 175.15,
          isPaid: true,
          isDelivered: false,
          paidAt: new Date("2025-03-25T10:30:00"),
          createdAt: new Date("2025-03-25T10:25:00"),
        },
        {
          _id: "order2",
          userId: "user123",
          items: [
            {
              productId: "prod3",
              name: "Veste Hiver",
              slug: "veste-hiver",
              qty: 1,
              image: "/placeholder-product.jpg",
              price: 129.99,
            },
          ],
          shippingAddress: {
            fullName: "Jean Dupont",
            street: "123 Rue de Paris",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          },
          personalisable: false,
          paymentMethod: "PayPal",
          itemsPrice: 129.99,
          shippingPrice: 0,
          taxPrice: 26.0,
          totalPrice: 155.99,
          isPaid: true,
          isDelivered: true,
          paidAt: new Date("2025-03-10T14:20:00"),
          deliveredAt: new Date("2025-03-15T11:45:00"),
          createdAt: new Date("2025-03-10T14:15:00"),
        },
      ];

      setOrders(mockOrders);

      setIsLoading(false);
    }, 1000);
  }, []);

  // Gérer la mise à jour du profil
  const handleUpdateProfile = () => {
    if (!user) return;

    // Dans une application réelle, ceci enverrait les données à l'API
    profileStore.updateUser({
      ...user,
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      username: profileForm.username,
      email: profileForm.email,
    });

    toast({
      title: "Profil mis à jour",
      description:
        "Vos informations personnelles ont été mises à jour avec succès.",
    });
  };

  // Gérer le téléchargement d'image de profil
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simuler un téléchargement d'image
    // Dans une application réelle, ceci téléchargerait l'image sur un serveur
    toast({
      title: "Image téléchargée",
      description: "Votre photo de profil a été mise à jour avec succès.",
    });
  };

  // Gérer l'ajout d'une nouvelle adresse
  const handleAddAddress = () => {
    const newAddress: Omit<Address, "_id"> = {
      ...addressForm,
      userId: user?._id || "",
    };

    // Dans une application réelle, ceci enverrait les données à l'API
    // et récupérerait l'ID généré
    const mockNewAddress: Address = {
      ...(newAddress as any),
      _id: `addr${Date.now()}`,
    };

    // Si la nouvelle adresse est définie par défaut, mettre à jour les autres adresses
    // if (newAddress.default) {
    //   setAddresses(
    //     addresses.map((addr) => ({
    //       ...addr,
    //       default: false,
    //     }))
    //   );
    // }

    // setAddresses([...addresses, mockNewAddress]);
    setShowAddAddressDialog(false);
    resetAddressForm();

    toast({
      title: "Adresse ajoutée",
      description: "Votre nouvelle adresse a été ajoutée avec succès.",
    });
  };

  // Gérer la modification d'une adresse
  const handleEditAddress = () => {
    if (!editingAddress) return;

    // Dans une application réelle, ceci enverrait les données à l'API
    const updatedAddresses = addresses.map((addr) => {
      if (addr._id === editingAddress._id) {
        return {
          ...addr,
          fullName: addressForm.fullName,
          street: addressForm.street,
          city: addressForm.city,
          postalCode: addressForm.postalCode,
          country: addressForm.country,
          default: addressForm.default,
        };
      }

      // Si l'adresse éditée est définie par défaut, mettre à jour les autres adresses
      if (addressForm.default && addr._id !== editingAddress._id) {
        return {
          ...addr,
          default: false,
        };
      }

      return addr;
    });

    //setAddresses(updatedAddresses);
    setEditingAddress(null);
    resetAddressForm();

    toast({
      title: "Adresse modifiée",
      description: "Votre adresse a été mise à jour avec succès.",
    });
  };

  // Gérer la suppression d'une adresse
  const handleDeleteAddress = (addressId: string) => {
    // Dans une application réelle, ceci enverrait une requête de suppression à l'API
    //setAddresses(addresses.filter((addr) => addr._id !== addressId));

    toast({
      title: "Adresse supprimée",
      description: "L'adresse a été supprimée avec succès.",
    });
  };

  // Définir une adresse comme adresse par défaut
  const handleSetDefaultAddress = (addressId: string) => {
    // Dans une application réelle, ceci enverrait les données à l'API
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      default: addr._id === addressId,
    }));

    //setAddresses(updatedAddresses);

    toast({
      title: "Adresse par défaut",
      description: "Votre adresse par défaut a été mise à jour.",
    });
  };

  // Ouvrir le dialogue d'édition d'adresse
  const openEditAddressDialog = (address: AddressModel) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      default: address.default as boolean,
    });
  };

  // Réinitialiser le formulaire d'adresse
  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
      default: false,
    });
  };

  // Récupérer le statut de la commande
  const getOrderStatus = (order: Order) => {
    if (order.isDelivered) return "Livrée";
    if (order.isPaid) return "En cours de livraison";
    return "En attente de paiement";
  };

  // Récupérer la couleur du badge du statut de la commande
  const getOrderStatusColor = (order: Order) => {
    if (order.isDelivered) return "green";
    if (order.isPaid) return "blue";
    return "yellow";
  };

  // Formater la date
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chargement...</h2>
          <p>Nous récupérons vos informations, veuillez patienter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-36">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="addresses">Shipping Address</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Section Profil */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Informations</CardTitle>
                <CardDescription>
                Modify your personal information below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      required
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      disabled
                      value={profileForm.username}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          username: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} className="mt-6">
                  Save changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                Update your profile picture.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage
                    src={user?.image || "/placeholder-avatar.jpg"}
                    alt={user?.username}
                  />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex items-center justify-center py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                    Change the picture
                  </div>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Section Adresses */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My shipping addresses</CardTitle>
                <CardDescription>
                Manage your delivery addresses for your orders.
                </CardDescription>
              </div>
              <Dialog
                open={showAddAddressDialog}
                onOpenChange={setShowAddAddressDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add an address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a new address</DialogTitle>
                    <DialogDescription>
                    Fill in the information below to add a new delivery address.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        required
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            fullName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        required
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            street: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          required
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal code</Label>
                        <Input
                          id="postalCode"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              postalCode: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                          id="country"
                          required
                          value={addressForm.country}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              country: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      {/* <Select
                        value={addressForm.country}
                        onValueChange={(value) =>
                          setAddressForm({ ...addressForm, country: value })
                        }
                      >
                        <SelectTrigger id="country" className="mt-1">
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Belgique">Belgique</SelectItem>
                          <SelectItem value="Suisse">Suisse</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                        </SelectContent>
                      </Select> */}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="default-address"
                        checked={addressForm.default}
                        onCheckedChange={(checked) =>
                          setAddressForm({ ...addressForm, default: checked })
                        }
                      />
                      <Label htmlFor="default-address">
                      Set as default address
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddAddressDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddAddress}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dialog pour éditer une adresse */}
              <Dialog
                open={editingAddress !== null}
                onOpenChange={(open) => !open && setEditingAddress(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Address</DialogTitle>
                    <DialogDescription>
                    Modify your delivery address information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="edit-fullName">Full Name</Label>
                      <Input
                        id="edit-fullName"
                        required
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            fullName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-street">Street</Label>
                      <Input
                        id="edit-street"
                        required
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            street: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-city">City</Label>
                        <Input
                          id="edit-city"
                          required
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-postalCode">Postal Code</Label>
                        <Input
                          id="edit-postalCode"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              postalCode: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-country">Country</Label>
                      <Input
                          id="country"
                          required
                          value={addressForm.country}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              country: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-default-address"
                        checked={addressForm.default}
                        onCheckedChange={(checked) =>
                          setAddressForm({ ...addressForm, default: checked })
                        }
                      />
                      <Label htmlFor="edit-default-address">
                      Set as default address
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditingAddress(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEditAddress}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                  You have not yet added a delivery address.
                  </p>
                  <Button onClick={() => setShowAddAddressDialog(true)}>
                    Add an address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <Card
                      key={address._id}
                      className={`relative ${
                        address.default ? "border-primary" : ""
                      }`}
                    >
                      {address.default && (
                        <div className="absolute top-2 right-2">
                          <Badge>As default</Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="font-bold text-lg">
                            {address.fullName}
                          </h3>
                          <p className="text-muted-foreground">
                            {address.street}
                          </p>
                          <p className="text-muted-foreground">
                            {address.postalCode} {address.city}
                          </p>
                          <p className="text-muted-foreground">
                            {address.country}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditAddressDialog(address)}
                            >
                              <PenSquare className="h-4 w-4 mr-1" />
                              Modify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteAddress(address._id as string)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                          {!address.default && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleSetDefaultAddress(address._id as string)
                              }
                            >
                              Set as default
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Commandes */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>
              View and track the status of your orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                  You have not yet placed an order.
                  </p>
                  <Button onClick={() => RedirectToPage("shop")}>Discover our products</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order._id} className="overflow-hidden">
                      <div className="bg-muted p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Order #{order._id.substring(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <Badge
                            className={`mr-2 bg-${getOrderStatusColor(
                              order
                            )}-500`}
                          >
                            {getOrderStatus(order)}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Details
                            <MoveRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center py-2">
                              <div className="h-16 w-16 rounded-md overflow-hidden bg-muted mr-4">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="flex justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {item.qty}
                                  </p>
                                  <p className="font-medium">
                                    {item.discount ? (
                                      <>
                                        <span className="line-through text-muted-foreground mr-2">
                                          {item.price.toFixed(2)} €
                                        </span>
                                        {(
                                          item.price *
                                          (1 - item.discount / 100)
                                        ).toFixed(2)}{" "}
                                        €
                                      </>
                                    ) : (
                                      `${item.price.toFixed(2)} €`
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium flex items-center mb-2">
                              <Truck className="h-4 w-4 mr-2" />
                              Shipping Address
                            </h4>
                            <p className="text-sm">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress.street}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress.postalCode}{" "}
                              {order.shippingAddress.city}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress.country}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium flex items-center mb-2">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Payment
                            </h4>
                            <p className="text-sm">{order.paymentMethod}</p>
                            <p className="text-sm">
                              {order.isPaid
                                ? `Payé le ${formatDate(order.paidAt)}`
                                : "En attente de paiement"}
                            </p>
                            {order.personalisable && order.personalisation && (
                              <div className="mt-2">
                                <h4 className="font-medium text-sm">
                                  Personnalisation :
                                </h4>
                                <p className="text-sm italic">
                                  "{order.personalisation}"
                                </p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium flex items-center mb-2">
                              <Clock className="h-4 w-4 mr-2" />
                              Order status
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                <p className="text-sm">Order placed</p>
                              </div>
                              {order.isPaid ? (
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-500 mr-2" />
                                  <p className="text-sm">Confirmed payment</p>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="h-4 w-4 rounded-full border border-muted-foreground mr-2" />
                                  <p className="text-sm text-muted-foreground">
                                  Pending payment
                                  </p>
                                </div>
                              )}
                              {order.isDelivered ? (
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-500 mr-2" />
                                  <p className="text-sm">
                                  Delivered on {formatDate(order.deliveredAt)}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="h-4 w-4 rounded-full border border-muted-foreground mr-2" />
                                  <p className="text-sm text-muted-foreground">
                                  Pending delivery
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-col items-end">
                          <div className="space-y-1 text-right">
                            <div className="flex justify-between w-48">
                              <span className="text-sm">Subtotal:</span>
                              <span className="text-sm font-medium">
                                {order.itemsPrice.toFixed(2)} €
                              </span>
                            </div>
                            <div className="flex justify-between w-48">
                              <span className="text-sm">Shipping:</span>
                              <span className="text-sm font-medium">
                                {order.shippingPrice.toFixed(2)} €
                              </span>
                            </div>
                            <div className="flex justify-between w-48">
                              <span className="text-sm">TVA:</span>
                              <span className="text-sm font-medium">
                                {order.taxPrice.toFixed(2)} €
                              </span>
                            </div>
                            <div className="flex justify-between w-48 font-bold pt-2">
                              <span>Total:</span>
                              <span>{order.totalPrice.toFixed(2)} €</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
