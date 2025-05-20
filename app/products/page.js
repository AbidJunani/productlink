import Link from "next/link";

async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ul className="space-y-6">
        {products.map((product) => (
          <li key={product.id} className="flex gap-4 items-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-16 h-16 object-contain"
            />
            <Link
              href={`/products/${product.id}`}
              className="text-blue-600 hover:underline text-lg"
            >
              {product.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
