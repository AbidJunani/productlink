export const products = [
  {
    slug: "apple-watch",
    name: "Apple Watch Series 9",
    description: "The latest Apple Watch with new features.",
  },
  {
    slug: "galaxy-buds",
    name: "Samsung Galaxy Buds Pro",
    description: "Premium sound and active noise cancellation.",
  },
  {
    slug: "macbook-pro",
    name: "MacBook Pro M3",
    description: "Powerful laptop with Apple's new M3 chip.",
  },
];

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === slug);
