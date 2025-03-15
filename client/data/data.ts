export const UsersData = [
  {
    lastName: "Admin",
    username: "Admin",
    firstName: "Etests",
    email: "",
    password: "",
    isAdmin: true,
  },
];

export const Reviews = [
  {
    id: 1,
    desc: "The seller is friendly and answers questions very quickly. The sweater is neatly printed and the quality of the fabric is as good as you would expect from well-known fashion chains. The durability will of course become apparent over time, but everything makes a good impression! I rate the seller as reputable.",
    username: "Solanie",
    profile: "/images/user2.png",
    rating: 5,
    createdAt: "20 Mar, 2024",
    productId: "",
  },
  {
    id: 2,
    desc: "I love this sweater. Would buy him again.",
    username: "Claudia",
    profile: "",
    rating: 5,
    createdAt: "13 Jan, 2024",
    productId: "",
  },
  {
    id: 3,
    desc: "Beautiful and high quality sweater. Thanks so much:)",
    username: "mirjamhaitz",
    profile: "",
    rating: 5,
    createdAt: "13 Sep, 2023",
    productId: "",
  },
  {
    id: 4,
    desc: "Everything as indicated. Once ordered for men, once for toddlers and once for women. Everything fit great and the quality is also good 👍🏼",
    username: "Vanessa",
    profile: "/images/user1.png",
    rating: 4.5,
    createdAt: "03 Feb, 2023",
    productId: "",
  },
];

export const Sorts = [
  //{ id: 1, type: "Relevancy", value: "relevancy" },
  { id: 2, type: "Lowest Price", value: "asc" },
  { id: 3, type: "Highest Price", value: "desc" },
  { id: 4, type: "Most Recent", value: "recent" },
];

export const FilterPrices = [
  { id: 1, type: "< EUR 19,00", value: "0, 19.0" },
  { id: 2, type: "EUR 19,00 - 35,00", value: "19.0, 35.0" },
  { id: 3, type: "> EUR 35,00", value: "35.0, 9999" },
];

export const Paymentmethods = [
  { id: 1, type: "Card", icon: "/images/mcard.png", value: "Card" },
  { id: 2, type: "Paypal", icon: "/images/paypal.png", value: "Paypal" },
  {
    id: 3,
    type: "Google Pay",
    icon: "/images/gpay.png/card",
    value: "Google-Pay",
  },
  // { id: 4, type: "Cash on delivery", icon:"/card", value: "Cash" },
];

export const PaymentMethods = [
  {
    id: "67a8d354f1415cf70505586a",
    name: "Mastercard",
    icon: "/images/mcard.png",
    available: false,
  },
  {
    id: "67a8d595f1415cf70505589e",
    name: "Visa",
    icon: "/images/visa.png",
    available: false,
  },
  {
    id: "67af1a1372bc0d309c1a6fa4",
    name: "Google Pay",
    icon: "/images/gpay.png",
    available: false,
  },
  {
    id: "67a8d5e8f1415cf7050558b5",
    name: "Paypal",
    icon: "/images/paypal.png",
    available: true,
  },
  {
    id: "67a8d662f1415cf7050558f4",
    name: "Cash",
    icon: "/images/cash.png",
    available: true,
  },
];

export const Titles = [
  { id: 1, label: "Mr", value: "mr" },
  { id: 2, label: "Mrs", value: "mrs" },
];

export const Genders = [
  { id: 1, label: "Male", value: "male" },
  { id: 2, label: "Female", value: "female" },
];
