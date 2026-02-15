import SeedDetailPage from "../../seeds/[slug]/page";
import { fetchAllProducts } from "@/services/products";

type ProductDetailProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await fetchAllProducts();
    return products
      .map((product) => product.slug)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({ id: slug }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;
  return <SeedDetailPage params={{ slug: id }} />;
}
