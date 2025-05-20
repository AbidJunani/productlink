import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchProducts() {
  const res = await fetch("https://dummyjson.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
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
              src={product.thumbnail}
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
