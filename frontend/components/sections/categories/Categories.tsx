import Button from "@/components/ui/Button";
import CategoryCard from "@/components/ui/CategoryCard";

const categories = [
  {
    title: "Cannabis Seeds",
    description: "Feminized, autoflowering, regular seeds",
  },
  {
    title: "CBD Products",
    description: "CBD oils, capsules, isolates",
  },
  {
    title: "THC Products",
    description: "Flowers, concentrates, extracts",
  },
  {
    title: "Flowers",
    description: "Indoor, greenhouse, outdoor strains",
  },
  {
    title: "Concentrates",
    description: "Hash, rosin, wax, shatter",
  },
  {
    title: "Edibles",
    description: "Gummies, chocolates, infused food",
    active: true,
  },
  {
    title: "Vapes & Cartridges",
    description: "Disposable vapes, cartridges",
  },
  {
    title: "Pre-Rolls",
    description: "Ready-to-use joints",
  },
];

export default function Categories() {
  return (
    <section className="w-full px-4 pb-16 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-pr_w">Categories</h2>
          <p className=" text-sm text-pr_w/70 sm:text-base">
            Browse product categories for cultivation and distribution
          </p>
        </div>
        <Button variant="category">All Categories</Button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            description={category.description}
            active={category.active}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
