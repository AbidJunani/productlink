export const dynamic = "force-dynamic";

async function fetchProduct(slug) {
  try {
    const id = Number(slug);
    if (isNaN(id)) return null;

    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug);
  const baseUrl = "https://productlink-pi.vercel.app";

  if (!product) {
    return {
      title: "Product Not Found | My Store",
      description: "The product you're looking for doesn't exist.",
      openGraph: {
        title: "Product Not Found | My Store",
        description: "The product you're looking for doesn't exist.",
        images: [
          {
            url: `${baseUrl}/images/not-found.png`,
            width: 1200,
            height: 630,
            alt: "Product not found",
          },
        ],
        url: `${baseUrl}/products/${params.slug}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Product Not Found | My Store",
        description: "The product you're looking for doesn't exist.",
        images: [`${baseUrl}/images/not-found.png`],
      },
    };
  }

  return {
    title: `${product.title} | My Store`,
    description: product.description,
    keywords: [product.category, product.brand, ...product.title.split(" ")],
    alternates: {
      canonical: `${baseUrl}/products/${params.slug}`,
    },
    openGraph: {
      title: `${product.title} | My Store`,
      description: product.description,
      url: `${baseUrl}/products/${params.slug}`,
      siteName: "My Store",
      images: [
        {
          url: product.thumbnail,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | My Store`,
      description: product.description,
      images: [product.thumbnail],
    },
    other: {
      "og:availability": "instock",
      "og:price:amount": product.price.toString(),
      "og:price:currency": "USD",
      "product:brand": product.brand,
      "product:retailer_item_id": params.slug,
      "product:category": product.category,
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Product Not Found
          </h1>
          <p className="text-lg text-gray-700">
            The product you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
          <a
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-6">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-auto object-contain max-h-96 mx-auto"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                {product.category}
              </span>
              <div className="ml-auto text-2xl font-bold text-gray-900">
                ${product.price}
              </div>
            </div>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
              Add to Cart
            </button>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              In Stock (Ready to ship)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
