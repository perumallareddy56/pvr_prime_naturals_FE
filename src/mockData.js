export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Organic Turmeric Powder",
    price: 9.50,
    weight: "250g",
    description: "High-curcumin organic turmeric powder for health and flavor.",
    imageUrl: "/assets/products/turmeric.png",
    active: true,
    subCategory: {
      id: 1,
      name: "Turmeric",
      productType: { id: 1, name: "Spices" }
    }
  },
  {
    id: 2,
    name: "Premium Kaju (Cashews)",
    price: 50.00,
    weight: "500g",
    description: "Nice Kaju, large and crunchy.",
    imageUrl: "/assets/products/dry_fruits.png",
    active: true,
    subCategory: {
      id: 2,
      name: "Cashews",
      productType: { id: 2, name: "Dry Fruits" }
    }
  },
  {
    id: 3,
    name: "Red Chili Powder",
    price: 7.00,
    weight: "200g",
    description: "Vibrant red chili powder with moderate heat.",
    imageUrl: "/assets/products/chilli.png",
    active: true,
    subCategory: {
      id: 3,
      name: "Chili",
      productType: { id: 1, name: "Spices" }
    }
  },
  {
    id: 4,
    name: "Black Pepper Whole",
    price: 12.00,
    weight: "100g",
    description: "Aromatic black pepper corns from Malabar.",
    imageUrl: "/assets/products/pepper.png",
    active: true,
    subCategory: {
      id: 4,
      name: "Pepper",
      productType: { id: 1, name: "Spices" }
    }
  },
  {
    id: 5,
    name: "Green Cardamom",
    price: 15.00,
    weight: "50g",
    description: "Fresh green cardamom pods with intense aroma.",
    imageUrl: "/assets/products/cardamom.png",
    active: true,
    subCategory: {
      id: 5,
      name: "Cardamom",
      productType: { id: 1, name: "Spices" }
    }
  },
  {
    id: 6,
    name: "Artisanal Arabica Coffee",
    price: 35.00,
    weight: "250g",
    description: "Slow-roasted premium arabica beans from Coorg.",
    imageUrl: "/assets/products/coffee.png",
    active: true,
    subCategory: {
      id: 6,
      name: "Coffee",
      productType: { id: 4, name: "Coffee Powders" }
    }
  },
  {
    id: 7,
    name: "Sun-Aged Mango Pickle",
    price: 12.50,
    weight: "300g",
    description: "Traditional recipe, sun-aged to perfection with natural spices.",
    imageUrl: "/assets/products/pickle.png",
    active: true,
    subCategory: {
      id: 7,
      name: "Pickles",
      productType: { id: 5, name: "Gourmet Essentials" }
    }
  }
];

export const MOCK_CATEGORIES = [
  { id: 1, name: "Spices" },
  { id: 2, name: "Dry Fruits" },
  { id: 3, name: "Masalas" },
  { id: 4, name: "Coffee Powders" }
];
