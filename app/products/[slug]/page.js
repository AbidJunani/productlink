// app/products/[slug]/page.js

async function fetchProduct(slug) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${slug}`);

    if (!res.ok) {
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
      url: `https://yourdomain.com/products/${params.slug}`,
      siteName: "My Store",
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "product",
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
    return <h1 className="p-6 text-xl font-semibold">Product not found</h1>;
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
