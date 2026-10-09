import type { Category, Product, Settings, Zone } from "./menu";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    slug: "signature-desserts",
    name: "Signature Desserts",
    tagline: "Chocolate-loaded waffle bowls",
    image_key: "desserts",
    sort: 1,
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    slug: "quick-bites",
    name: "Quick Bites",
    tagline: "Patties, pizza & Korean buns",
    image_key: "quickbites",
    sort: 2,
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    slug: "sandwiches-maggie",
    name: "Sandwiches & Maggie",
    tagline: "Grilled, cheesy, satisfying",
    image_key: "sandwich",
    sort: 3,
  },
  {
    id: "c1000000-0000-0000-0000-000000000004",
    slug: "beverages",
    name: "Beverages",
    tagline: "Hot & cold, cool vibes",
    image_key: "beverages",
    sort: 4,
  },
  {
    id: "c1000000-0000-0000-0000-000000000005",
    slug: "pastries-cakes",
    name: "Pastries & Cakes",
    tagline: "Freshly baked every day",
    image_key: "pastries",
    sort: 5,
  },
  {
    id: "c1000000-0000-0000-0000-000000000006",
    slug: "burgers",
    name: "Burgers",
    tagline: "Stacked & saucy",
    image_key: "burger",
    sort: 6,
  },
  {
    id: "c1000000-0000-0000-0000-000000000007",
    slug: "french-fries",
    name: "French Fries",
    tagline: "Crispy & irresistible",
    image_key: "fries",
    sort: 7,
  },
  {
    id: "c1000000-0000-0000-0000-000000000008",
    slug: "momos",
    name: "Momos",
    tagline: "Steamed, fried & kurkure",
    image_key: "momos",
    sort: 8,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // Signature Desserts
  {
    id: "p1000000-0000-0000-0000-000000000001",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Sprinkled Baby",
    description: "Waffle bites with rainbow sprinkles and chocolate drizzle",
    subgroup: null,
    price: 49,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000002",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Dark & White Delight",
    description: "Dark and white chocolate layered dessert",
    subgroup: null,
    price: 59,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000003",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Dark & Milk Delight",
    description: "Dark and milk chocolate layered dessert",
    subgroup: null,
    price: 59,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 3,
  },
  {
    id: "p1000000-0000-0000-0000-000000000004",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Oreo Dark Crunch",
    description: "Crushed Oreo over rich dark chocolate",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 4,
  },
  {
    id: "p1000000-0000-0000-0000-000000000005",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Dark Chocolate Fantasy",
    description: "Intense dark chocolate indulgence",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 5,
  },
  {
    id: "p1000000-0000-0000-0000-000000000006",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Milk Chocolate Fantasy",
    description: "Creamy milk chocolate indulgence",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 6,
  },
  {
    id: "p1000000-0000-0000-0000-000000000007",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Sweetheart",
    description: "Strawberry and chocolate love",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 7,
  },
  {
    id: "p1000000-0000-0000-0000-000000000008",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "I'm a Gems Baby",
    description: "Loaded with colourful Gems",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 8,
  },
  {
    id: "p1000000-0000-0000-0000-000000000009",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Triple Chocolate",
    description: "Dark, milk and white chocolate — our best seller",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    sort: 9,
  },
  {
    id: "p1000000-0000-0000-0000-000000000010",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "Naughty Nutella",
    description: "Generous Nutella with waffle crunch",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    sort: 10,
  },
  {
    id: "p1000000-0000-0000-0000-000000000011",
    category_id: "c1000000-0000-0000-0000-000000000001",
    name: "KitKat-ishh",
    description: "KitKat pieces over chocolate waffles",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "desserts",
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    sort: 11,
  },

  // Quick Bites
  {
    id: "p1000000-0000-0000-0000-000000000012",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Masala Patties",
    description: "Flaky puff with spiced potato filling",
    subgroup: "Patties",
    price: 25,
    unit: null,
    image_key: "patties",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000013",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Regular Patties",
    description: "Classic flaky veg puff",
    subgroup: "Patties",
    price: 20,
    unit: null,
    image_key: "patties",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000014",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Paneer Patties",
    description: "Puff filled with spiced paneer",
    subgroup: "Patties",
    price: 30,
    unit: null,
    image_key: "patties",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 3,
  },
  {
    id: "p1000000-0000-0000-0000-000000000015",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Cheese Masala Patties",
    description: "Spiced filling with melted cheese",
    subgroup: "Patties",
    price: 35,
    unit: null,
    image_key: "patties",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 4,
  },
  {
    id: "p1000000-0000-0000-0000-000000000016",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Regular Veg Pizza",
    description: "Cheesy pizza with fresh veggies",
    subgroup: "Pizza",
    price: 59,
    unit: null,
    image_key: "pizza",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 5,
  },
  {
    id: "p1000000-0000-0000-0000-000000000017",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Korean Bun (1 Pc)",
    description: "Soft cream-cheese garlic bun",
    subgroup: "Pizza",
    price: 39,
    unit: null,
    image_key: "pizza",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 6,
  },
  {
    id: "p1000000-0000-0000-0000-000000000018",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Korean Bun (2 Pcs)",
    description: "Two soft cream-cheese garlic buns",
    subgroup: "Pizza",
    price: 59,
    unit: null,
    image_key: "pizza",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 7,
  },
  {
    id: "p1000000-0000-0000-0000-000000000019",
    category_id: "c1000000-0000-0000-0000-000000000002",
    name: "Paneer Pizza",
    description: "Loaded with paneer and cheese",
    subgroup: "Pizza",
    price: 69,
    unit: null,
    image_key: "pizza",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 8,
  },

  // Sandwiches & Maggie
  {
    id: "p1000000-0000-0000-0000-000000000020",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Veg Sandwich",
    description: "Grilled with fresh veggies",
    subgroup: "Grilled Sandwiches",
    price: 39,
    unit: null,
    image_key: "sandwich",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000021",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Cheese Sandwich",
    description: "Grilled with gooey cheese",
    subgroup: "Grilled Sandwiches",
    price: 59,
    unit: null,
    image_key: "sandwich",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000022",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Paneer Sandwich",
    description: "Grilled with spiced paneer",
    subgroup: "Grilled Sandwiches",
    price: 59,
    unit: null,
    image_key: "sandwich",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 3,
  },
  {
    id: "p1000000-0000-0000-0000-000000000023",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Corn Cheese Sandwich",
    description: "Sweet corn and cheese",
    subgroup: "Grilled Sandwiches",
    price: 59,
    unit: null,
    image_key: "sandwich",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 4,
  },
  {
    id: "p1000000-0000-0000-0000-000000000024",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Tandoori Sandwich",
    description: "Smoky tandoori filling",
    subgroup: "Grilled Sandwiches",
    price: 69,
    unit: null,
    image_key: "sandwich",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 5,
  },
  {
    id: "p1000000-0000-0000-0000-000000000025",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Veg Maggie",
    description: "Masala Maggie with veggies",
    subgroup: "Maggie",
    price: 39,
    unit: null,
    image_key: "maggie",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 6,
  },
  {
    id: "p1000000-0000-0000-0000-000000000026",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Paneer Maggie",
    description: "Maggie with paneer cubes",
    subgroup: "Maggie",
    price: 59,
    unit: null,
    image_key: "maggie",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 7,
  },
  {
    id: "p1000000-0000-0000-0000-000000000027",
    category_id: "c1000000-0000-0000-0000-000000000003",
    name: "Cheese Maggie",
    description: "Maggie with melted cheese",
    subgroup: "Maggie",
    price: 59,
    unit: null,
    image_key: "maggie",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 8,
  },

  // Beverages
  {
    id: "p1000000-0000-0000-0000-000000000028",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Tea",
    description: "Fresh masala chai",
    subgroup: "Hot",
    price: 15,
    unit: null,
    image_key: "tea",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000029",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Hot Coffee",
    description: "Frothy hot coffee",
    subgroup: "Hot",
    price: 30,
    unit: null,
    image_key: "tea",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000030",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Cold Coffee",
    description: "Chilled creamy cold coffee",
    subgroup: "Cold",
    price: 49,
    unit: null,
    image_key: "beverages",
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    sort: 3,
  },
  {
    id: "p1000000-0000-0000-0000-000000000031",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Mango Shake",
    description: "Thick mango milkshake",
    subgroup: "Cold",
    price: 30,
    unit: null,
    image_key: "beverages",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 4,
  },
  {
    id: "p1000000-0000-0000-0000-000000000032",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Lassi",
    description: "Sweet chilled lassi",
    subgroup: "Cold",
    price: 30,
    unit: null,
    image_key: "beverages",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 5,
  },
  {
    id: "p1000000-0000-0000-0000-000000000033",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Mojito",
    description: "Mint and lime refresher",
    subgroup: "Cold",
    price: 49,
    unit: null,
    image_key: "mojito",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 6,
  },
  {
    id: "p1000000-0000-0000-0000-000000000034",
    category_id: "c1000000-0000-0000-0000-000000000004",
    name: "Blue Lagoon",
    description: "Blue curaçao-style mocktail",
    subgroup: "Cold",
    price: 49,
    unit: null,
    image_key: "mojito",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 7,
  },

  // Pastries & Cakes
  {
    id: "p1000000-0000-0000-0000-000000000035",
    category_id: "c1000000-0000-0000-0000-000000000005",
    name: "Pineapple Pastry",
    description: "Light sponge with pineapple cream",
    subgroup: null,
    price: 39,
    unit: null,
    image_key: "pastries",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000036",
    category_id: "c1000000-0000-0000-0000-000000000005",
    name: "Chocolate Pastry",
    description: "Moist chocolate sponge pastry",
    subgroup: null,
    price: 49,
    unit: null,
    image_key: "pastries",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000037",
    category_id: "c1000000-0000-0000-0000-000000000005",
    name: "Hot Chocolate Brownie Cup",
    description: "Warm brownie with chocolate sauce",
    subgroup: null,
    price: 49,
    unit: null,
    image_key: "pastries",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 3,
  },
  {
    id: "p1000000-0000-0000-0000-000000000038",
    category_id: "c1000000-0000-0000-0000-000000000005",
    name: "Brownie Tub",
    description: "Fudgy brownie tub",
    subgroup: null,
    price: 59,
    unit: null,
    image_key: "pastries",
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    sort: 4,
  },
  {
    id: "p1000000-0000-0000-0000-000000000039",
    category_id: "c1000000-0000-0000-0000-000000000005",
    name: "Celebration Cake (per kg)",
    description: "Made to order — tell us the flavour in notes",
    subgroup: null,
    price: 600,
    unit: "per kg",
    image_key: "cake",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 5,
  },

  // Burgers
  {
    id: "p1000000-0000-0000-0000-000000000040",
    category_id: "c1000000-0000-0000-0000-000000000006",
    name: "Veg Burger",
    description: "Crispy veg patty burger",
    subgroup: null,
    price: 49,
    unit: null,
    image_key: "burger",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000041",
    category_id: "c1000000-0000-0000-0000-000000000006",
    name: "Cheese Burger",
    description: "Veg patty with cheese slice",
    subgroup: null,
    price: 59,
    unit: null,
    image_key: "burger",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000042",
    category_id: "c1000000-0000-0000-0000-000000000006",
    name: "Paneer Burger",
    description: "Crispy paneer patty burger",
    subgroup: null,
    price: 59,
    unit: null,
    image_key: "burger",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 3,
  },

  // French Fries
  {
    id: "p1000000-0000-0000-0000-000000000043",
    category_id: "c1000000-0000-0000-0000-000000000007",
    name: "Classic Fries",
    description: "Salted golden fries",
    subgroup: null,
    price: 39,
    unit: null,
    image_key: "fries",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000044",
    category_id: "c1000000-0000-0000-0000-000000000007",
    name: "Peri Peri Fries",
    description: "Tossed in peri peri spice",
    subgroup: null,
    price: 49,
    unit: null,
    image_key: "fries",
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000045",
    category_id: "c1000000-0000-0000-0000-000000000007",
    name: "Cheesy Fries",
    description: "Smothered in cheese sauce",
    subgroup: null,
    price: 59,
    unit: null,
    image_key: "fries",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 3,
  },

  // Momos
  {
    id: "p1000000-0000-0000-0000-000000000046",
    category_id: "c1000000-0000-0000-0000-000000000008",
    name: "Veg Momos",
    description: "Steamed veg momos with chutney",
    subgroup: null,
    price: 49,
    unit: null,
    image_key: "momos",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 1,
  },
  {
    id: "p1000000-0000-0000-0000-000000000047",
    category_id: "c1000000-0000-0000-0000-000000000008",
    name: "Fried Momos",
    description: "Crispy fried momos",
    subgroup: null,
    price: 59,
    unit: null,
    image_key: "momos",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 2,
  },
  {
    id: "p1000000-0000-0000-0000-000000000048",
    category_id: "c1000000-0000-0000-0000-000000000008",
    name: "Kurkure Momos",
    description: "Extra crunchy coated momos",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "momos",
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    sort: 3,
  },
  {
    id: "p1000000-0000-0000-0000-000000000049",
    category_id: "c1000000-0000-0000-0000-000000000008",
    name: "Cheese Momos",
    description: "Momos stuffed with cheese",
    subgroup: null,
    price: 69,
    unit: null,
    image_key: "momos",
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    sort: 4,
  },
];

export const MOCK_SETTINGS: Settings = {
  cafe_name: "The Classic Crush",
  phone_primary: "8090205081",
  phone_secondary: "8318008104",
  address: "School of Hotel Management Campus",
  opening_hours: "10:00 AM – 9:00 PM",
  is_open: true,
  delivery_slabs: [
    { max_km: 2, fee: 20 },
    { max_km: 4, fee: 30 },
    { max_km: 6, fee: 40 },
  ],
  max_radius_km: 6,
  free_delivery_threshold: 499,
  min_order_value: 99,
  tax_percent: 5,
  prep_minutes: 20,
  delivery_minutes: 25,
  instagram_url: "https://instagram.com",
};

export const MOCK_ZONES: Zone[] = [
  {
    id: "z1000000-0000-0000-0000-000000000001",
    name: "Campus & Hostel Area",
    distance_km: 0.5,
    is_active: true,
  },
  {
    id: "z1000000-0000-0000-0000-000000000002",
    name: "Near Market (within 2 km)",
    distance_km: 1.8,
    is_active: true,
  },
  {
    id: "z1000000-0000-0000-0000-000000000003",
    name: "City Centre",
    distance_km: 3.2,
    is_active: true,
  },
  {
    id: "z1000000-0000-0000-0000-000000000004",
    name: "Railway Station Area",
    distance_km: 4.5,
    is_active: true,
  },
  {
    id: "z1000000-0000-0000-0000-000000000005",
    name: "Outer Colony",
    distance_km: 5.8,
    is_active: true,
  },
];

export interface MockOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface MockOrderEvent {
  id: string;
  order_id: string;
  status: string;
  note?: string | null;
  created_at: string;
}

export interface MockOrder {
  id: string;
  order_number: string;
  tracking_token: string;
  customer_name: string;
  phone: string;
  fulfillment: "delivery" | "pickup";
  address: { line1: string; landmark?: string; pincode: string } | null;
  zone_name: string | null;
  distance_km: number | null;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  payment_method: "upi" | "card" | "cod" | "pay_at_cafe";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_ref: string | null;
  status:
    | "placed"
    | "accepted"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "picked_up"
    | "cancelled";
  delivery_partner: string | null;
  delivery_partner_phone: string | null;
  eta_minutes: number;
  created_at: string;
  updated_at: string;
  order_items: MockOrderItem[];
  order_events: MockOrderEvent[];
}

// Storage helpers
const STORAGE_KEYS = {
  CATEGORIES: "tcc_mock_categories",
  PRODUCTS: "tcc_mock_products",
  SETTINGS: "tcc_mock_settings",
  ZONES: "tcc_mock_zones",
  ORDERS: "tcc_mock_orders",
  ADMIN_AUTH: "tcc_mock_admin_auth",
};

export function getMockCategories(): Category[] {
  if (typeof window === "undefined") return MOCK_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return MOCK_CATEGORIES;
}

export function saveMockCategories(categories: Category[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

export function getMockProducts(): Product[] {
  if (typeof window === "undefined") return MOCK_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return MOCK_PRODUCTS;
}

export function saveMockProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function getMockSettings(): Settings {
  if (typeof window === "undefined") return MOCK_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return MOCK_SETTINGS;
}

export function saveMockSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getMockZones(): Zone[] {
  if (typeof window === "undefined") return MOCK_ZONES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ZONES);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return MOCK_ZONES;
}

export function saveMockZones(zones: Zone[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
}

export function getMockOrders(): MockOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveMockOrders(orders: MockOrder[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

export function createMockOrder(data: {
  customer_name: string;
  phone: string;
  fulfillment: "delivery" | "pickup";
  address: { line1: string; landmark?: string; pincode: string } | null;
  zone_name: string | null;
  distance_km: number | null;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  payment_method: "upi" | "card" | "cod" | "pay_at_cafe";
  items: {
    product_id: string;
    name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[];
  eta_minutes: number;
}): { ok: true; token: string } {
  const orderId = "ord-" + Math.random().toString(36).slice(2, 11);
  const token = "tok-" + Math.random().toString(36).slice(2, 11) + "-" + Date.now();
  const orderNumber = "TCC" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
  const now = new Date().toISOString();
  const paid = data.payment_method === "upi" || data.payment_method === "card";

  const orderItems: MockOrderItem[] = data.items.map((i, idx) => ({
    id: `item-${idx}-${Date.now()}`,
    order_id: orderId,
    product_id: i.product_id,
    name: i.name,
    unit_price: i.unit_price,
    quantity: i.quantity,
    line_total: i.line_total,
  }));

  const orderEvents: MockOrderEvent[] = [
    {
      id: `ev-1-${Date.now()}`,
      order_id: orderId,
      status: "placed",
      created_at: now,
    },
  ];

  const newOrder: MockOrder = {
    id: orderId,
    order_number: orderNumber,
    tracking_token: token,
    customer_name: data.customer_name,
    phone: data.phone,
    fulfillment: data.fulfillment,
    address: data.address,
    zone_name: data.zone_name,
    distance_km: data.distance_km,
    notes: data.notes,
    subtotal: data.subtotal,
    delivery_fee: data.delivery_fee,
    tax: data.tax,
    total: data.total,
    payment_method: data.payment_method,
    payment_status: paid ? "paid" : "pending",
    payment_ref: paid ? "SIM-" + Math.random().toString(36).slice(2, 10).toUpperCase() : null,
    status: "placed",
    delivery_partner: null,
    delivery_partner_phone: null,
    eta_minutes: data.eta_minutes,
    created_at: now,
    updated_at: now,
    order_items: orderItems,
    order_events: orderEvents,
  };

  const orders = getMockOrders();
  orders.unshift(newOrder);
  saveMockOrders(orders);

  return { ok: true, token };
}

export function updateMockOrder(id: string, patch: Partial<MockOrder>): MockOrder | null {
  const orders = getMockOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  const current = orders[idx];
  if (!current) return null;

  const now = new Date().toISOString();
  const updatedEvents = [...current.order_events];

  if (patch.status && patch.status !== current.status) {
    updatedEvents.push({
      id: `ev-${updatedEvents.length + 1}-${Date.now()}`,
      order_id: id,
      status: patch.status,
      created_at: now,
    });
  }

  const updated: MockOrder = {
    ...current,
    ...patch,
    id: current.id,
    order_number: current.order_number,
    tracking_token: current.tracking_token,
    customer_name: patch.customer_name ?? current.customer_name,
    phone: patch.phone ?? current.phone,
    fulfillment: patch.fulfillment ?? current.fulfillment,
    payment_method: patch.payment_method ?? current.payment_method,
    payment_status: patch.payment_status ?? current.payment_status,
    status: patch.status ?? current.status,
    total: patch.total ?? current.total,
    subtotal: patch.subtotal ?? current.subtotal,
    delivery_fee: patch.delivery_fee ?? current.delivery_fee,
    tax: patch.tax ?? current.tax,
    eta_minutes: patch.eta_minutes ?? current.eta_minutes,
    created_at: current.created_at,
    updated_at: now,
    order_items: patch.order_items ?? current.order_items,
    order_events: updatedEvents,
  };

  orders[idx] = updated;
  saveMockOrders(orders);
  return updated;
}
