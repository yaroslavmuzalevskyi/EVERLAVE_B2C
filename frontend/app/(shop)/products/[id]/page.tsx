import SeedDetailPage from "../../seeds/[slug]/page";
import { fetchAllProducts } from "@/services/products";

type ProductDetailProps = {
  params: { id: string };
};

export const dynamicParams = false;

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

export default function ProductDetailPage({ params }: ProductDetailProps) {
  return <SeedDetailPage params={{ slug: params.id }} />;
}
