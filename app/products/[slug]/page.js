// app/products/[slug]/page.js

async function fetchProduct(slug) {
  try {
    const id = Number(slug);
    if (isNaN(id)) return null;

    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 60 }, // Optional: revalidate every 60s
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    const product = await res.json();
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// Dynamic metadata for SEO and link previews
export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "No product with this slug.",
      openGraph: {
        title: "Product Not Found",
        description: "No product with this slug.",
        images: [
          {
            url: "https://via.placeholder.com/800x600?text=Not+Found",
            width: 800,
            height: 600,
            alt: "Not Found",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Product Not Found",
        description: "No product with this slug.",
        images: ["https://via.placeholder.com/800x600?text=Not+Found"],
      },
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      url: `https://productlink-pi.vercel.app/products/${params.slug}`,
      siteName: "My Store",
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "article", // ✅ Changed from "product" to "article"
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug);

  if (!product) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">
          Product not found
        </h1>
        <p className="text-gray-600 mt-2">
          The product you&apos;re looking for doesn&apos;t exist or the ID is
          invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        className="w-48 h-48 object-contain mb-4"
      />
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-lg font-semibold">Price: ${product.price}</p>
    </div>
  );
}
