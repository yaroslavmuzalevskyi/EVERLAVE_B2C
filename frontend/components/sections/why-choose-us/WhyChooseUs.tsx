const reasons = [
  {
    title: "Free and fast delivery / return",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
  },
  {
    title: "High yield genetics",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
  },
  {
    title: "Custom breeding",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
  },
  {
    title: "4.8 average customer review",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <h2 className="text-3xl font-semibold text-pr_w">Why choose us?</h2>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {reasons.map((reason) => (
          <div key={reason.title} className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold text-pr_w sm:text-xl">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
                {reason.description}
              </p>
            </div>

            <div className="h-96 w-full rounded-tl-3xl rounded-br-3xl bg-pr_w sm:h-96" />
          </div>
        ))}
      </div>
    </section>
  );
}
