import { create } from "zustand";
import { persist } from "zustand/middleware";
import { round2 } from "@/lib/utils";
import { AddressModel, Cart, OrderItem } from "@/schemas/models";


const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
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
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentMethod, shippingAddress } = cartStore();

  const updateCart = (updatedItems: OrderItem[]) => {
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedItems);
    cartStore.setState({
      items: updatedItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
  };

  const findItem = (item: OrderItem) => {
    return item.variable
      ? items.find((x) => x.slug === item.slug && x.variantId === item.variantId)
      : items.find((x) => x.slug === item.slug);
  };

  const increase = (item: OrderItem) => {
    const exist = findItem(item);
    const updatedCartItems = exist
      ? items.map((x) =>
          x.slug === item.slug && (!item.variable || x.variantId === item.variantId)
            ? { ...exist, qty: exist.qty + 1 }
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
        ? items.filter((x) => x.slug !== item.slug || (item.variable && x.variantId !== item.variantId))
        : items.map((x) =>
            x.slug === item.slug && (!item.variable || x.variantId === item.variantId)
              ? { ...exist, qty: exist.qty - 1 }
              : x
          );
    updateCart(updatedCartItems);
  };

  const remove = (item: OrderItem) => {
    const exist = findItem(item);
    if (!exist) return;

    const updatedCartItems = items.filter(
      (x) => x.slug !== item.slug || (item.variable && x.variantId !== item.variantId)
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

  const init = () => cartStore.setState(initialState);

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
    increase,
    decrease,
    remove,
    clearCart,
    saveShippingAddress,
    savePaymentMethod,
    clear,
    init,
  };
}

const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(items.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shippingPrice = 0;
  const taxPrice = round2(0.19 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};


// const initialState: Cart = {
//   items: [],
//   itemsPrice: 0,
//   taxPrice: 0,
//   shippingPrice: 0,
//   totalPrice: 0,
//   paymentMethod: "PayPal",
//   shippingAddress: {
//     street: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "",
//   },
// };

// export const cartStore = create<Cart>()(
//   persist(() => initialState, {
//     name: "cartStore",
//   })
// );

// export default function useCartService() {
//   const {
//     items,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//     paymentMethod,
//     shippingAddress,
//   } = cartStore();

//   return {
//     items,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//     paymentMethod,
//     shippingAddress,

//     increase: (item: OrderItem) => {
//       const exist = item.variable ? 
//           items.find((x)=> x.slug === item.slug && (x.variable && item.variable && x.variantId === item.variantId)): 
//           items.find((x) => x.slug === item.slug);

//       const updatedCartItems = exist? 
//         exist.variable ? 
//           items.map((x) => (x.slug === item.slug && x.variantId === item.variantId) ? { ...exist, qty: exist.qty + 1 } : x):
//           items.map((x) => x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x)
//         : [...items, { ...item, qty: 1 }];
//       const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
//         calcPrice(updatedCartItems);
//       cartStore.setState({
//         items: updatedCartItems,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//       });
//     },

//     decrease: (item: OrderItem) => {
//       const exist = item.variable ? 
//           items.find((x)=> x.slug === item.slug && (x.variable && item.variable && x.variantId === item.variantId)): 
//           items.find((x) => x.slug === item.slug);
//       if (!exist) return;
//       const updatedCartItems = exist.qty === 1 ?
//         item.variable ? 
//           items.filter((x) => x.slug !== item.slug && x.variantId !== item.variantId):
//           items.filter((x) => x.slug !== item.slug)
//           : item.variable ?
//            items.map((x) => (x.slug === item.slug && x.variantId === item.variantId) ? { ...exist, qty: exist.qty - 1 } : x):
//            items.map((x) => x.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : x);

//       const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
//         calcPrice(updatedCartItems);
//       cartStore.setState({
//         items: updatedCartItems,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//       });
//     },

//     remove: (item: OrderItem) => {
//       const exist = item.variable ? 
//           items.find((x)=> x.slug === item.slug && (x.variable && item.variable && x.variantId === item.variantId)): 
//           items.find((x) => x.slug === item.slug);

//       if (!exist) return;

//       const updatedCartItems = item.variable ? 
//       items.filter((x) => x.slug !== item.slug && x.variantId !== item.variantId) : 
//       items.filter((x) => x.slug !== item.slug);
//       const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
//         calcPrice(updatedCartItems);
//       cartStore.setState({
//         items: updatedCartItems,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//       });
//     },

//     clearCart: () => {
//       const updatedCartItems: OrderItem[] = [];
//       const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
//         calcPrice(updatedCartItems);
//       cartStore.setState({
//         items: updatedCartItems,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//       });
//     },

//     saveShippingAddrress: (shippingAddress: AddressModel) => {
//       cartStore.setState({
//         shippingAddress,
//       });
//     },
//     savePaymentMethod: (paymentMethod: string) => {
//       cartStore.setState({
//         paymentMethod,
//       });
//     },

//     clear: () => {
//       cartStore.setState({
//         items: [],
//       });
//     },

//     init: () => cartStore.setState(initialState),
//   };
// }

// const calcPrice = (items: OrderItem[]) => {
//   const itemsPrice = round2(
//       items.reduce((acc, item) => acc + item.price * item.qty, 0)
//     ),
//     shippingPrice = 0,
//     taxPrice = round2(Number(0.19 * itemsPrice)),
//     totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
//   return { itemsPrice, shippingPrice, taxPrice, totalPrice };
// };
