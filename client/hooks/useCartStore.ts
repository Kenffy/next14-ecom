import { create } from "zustand";
import { persist } from "zustand/middleware";
import { round2 } from "@/lib/utils";
import { AddressModel, Cart, OrderItem } from "@/schemas/models";

const initialState: Cart = {
  items: [],
  shopTax: 0,
  couponCode: "",
  couponDiscount: 0,
  shopDiscount: 0,
  taxPrice: 0,
  itemsPrice: 0,
  subTotalPrice: 0,
  totalPrice: 0,
  shippingPrice: 0,
  itemsDiscountPrice: 0,
  shopDiscountPrice: 0,
  couponDiscountPrice: 0,
  totalDiscountPrice: 0,
  paymentMethod: "PayPal",
  shippingAddress: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
};

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cartStore",
  })
);

export default function useCartService() {
  const {
    items,
    shopTax,
    couponCode,
    couponDiscount,
    shopDiscount,
    itemsPrice,
    taxPrice,
    subTotalPrice,
    totalPrice,
    itemsDiscountPrice,
    shopDiscountPrice,
    couponDiscountPrice,
    totalDiscountPrice,
    shippingPrice,
    paymentMethod,
    shippingAddress,
  } = cartStore();

  const updateCart = (updatedItems: OrderItem[]) => {
    const prices = calcPrice(updatedItems);
    cartStore.setState({
      items: updatedItems,
      ...prices
    });
  };

  const updateShopDiscount = (shopDiscount: number) => {
    cartStore.setState({ shopDiscount });
  };

  const updateShopTax = (shopTax: number) => {
    cartStore.setState({ shopTax });
  };

  const updateShopSettings = (shopDiscount: number, shopTax: number) => {
    cartStore.setState({ shopDiscount, shopTax });
  };

  const findItem = (item: OrderItem) => {
    return item.variable
      ? items.find(
          (x) => x.slug === item.slug && x.variantId === item.variantId
        )
      : items.find((x) => x.slug === item.slug);
  };

  const increase = (item: OrderItem) => {
    const exist = findItem(item);
    const updatedCartItems = exist
      ? items.map((x) =>
          x.slug === item.slug &&
          (!item.variable || x.variantId === item.variantId)
            ? {
                ...exist,
                qty: exist.qty + 1,
                personalisation:
                  x.personalisation !== item.personalisation
                    ? item.personalisation
                    : x.personalisation,
              }
            : x
        )
      : [...items, { ...item, qty: 1 }];
    updateCart(updatedCartItems);
  };

  const decrease = (item: OrderItem) => {
    const exist = findItem(item);
    if (!exist) return;

    const updatedCartItems =
      exist.qty === 1
        ? items.filter(
            (x) =>
              x.slug !== item.slug ||
              (item.variable && x.variantId !== item.variantId)
          )
        : items.map((x) =>
            x.slug === item.slug &&
            (!item.variable || x.variantId === item.variantId)
              ? {
                  ...exist,
                  qty: exist.qty - 1,
                  personalisation:
                    x.personalisation !== item.personalisation
                      ? item.personalisation
                      : x.personalisation,
                }
              : x
          );
    updateCart(updatedCartItems);
  };

  const remove = (item: OrderItem) => {
    const exist = findItem(item);
    if (!exist) return;

    const updatedCartItems = items.filter(
      (x) =>
        x.slug !== item.slug ||
        (item.variable && x.variantId !== item.variantId)
    );
    updateCart(updatedCartItems);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const saveShippingAddress = (shippingAddress: AddressModel) => {
    cartStore.setState({ shippingAddress });
  };

  const savePaymentMethod = (paymentMethod: string) => {
    cartStore.setState({ paymentMethod });
  };

  const clear = () => {
    cartStore.setState({ items: [] });
  };

  // Appliquer un code promo et recalculer les prix
  const applyCoupon = (coupon: string, discount: number) => {
    cartStore.setState({ couponCode: coupon, couponDiscount: discount });
    updateCart(items);
  };

  const calcPrice = (items: OrderItem[]) => {

    const shippingPrice = 0;

    const itemsPrice = round2(
      items.reduce(
        (acc, item) =>
          item.discount && item.discount > 0
            ? acc + (item.price - item.price * item.discount * 0.01) * item.qty
            : acc + item.price * item.qty,
        0
      )
    );
    const itemsDiscountPrice = round2(
      items.reduce(
        (acc, item) =>
          item.discount && item.discount > 0
            ? acc + ((item.price * item.discount * 0.01) as number) * item.qty
            : acc + 0,
        0
      )
    );

    const totalItemsPrice = itemsPrice - itemsDiscountPrice;

    const shopDiscountPrice = round2(shopDiscount * 0.01 * totalItemsPrice);
    const couponDiscountPrice =
      couponDiscount > 0 ? round2(couponDiscount * 0.01 * totalItemsPrice) : 0;
    const totalDiscountPrice = round2(
      itemsDiscountPrice + shopDiscountPrice + couponDiscountPrice
    );

    const itemsPriceWithoutTax = round2(
      totalItemsPrice - (shopTax * 0.01 * totalItemsPrice)
    );
    
    const taxPrice = round2(shopTax * 0.01 * totalItemsPrice);
    const subTotalPrice = itemsPriceWithoutTax;
    const totalPrice = round2(subTotalPrice + taxPrice);

    return {
      itemsPrice,
      itemsDiscountPrice,
      shippingPrice,
      taxPrice,
      subTotalPrice,
      totalPrice,
      totalDiscountPrice,
      shopDiscountPrice,
      couponDiscountPrice,
    };
  };

  const init = () => cartStore.setState(initialState);

  return {
    items,
    shopTax,
    shopDiscount,
    couponCode,
    couponDiscount,
    itemsPrice,
    taxPrice,
    subTotalPrice,
    totalPrice,
    shopDiscountPrice,
    couponDiscountPrice,
    itemsDiscountPrice,
    totalDiscountPrice,
    shippingPrice,
    paymentMethod,
    shippingAddress,
    increase,
    decrease,
    remove,
    clearCart,
    applyCoupon,
    updateShopTax,
    updateShopDiscount,
    updateShopSettings,
    saveShippingAddress,
    savePaymentMethod,
    clear,
    init,
  };
}
