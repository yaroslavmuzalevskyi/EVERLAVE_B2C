export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  tag: string;
  publishedAt: string;
  readingTime: string;
  views: string;
  sections: Array<{ heading: string; body: string[] }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "where-genetics-make-the-difference",
    title: "Where Genetics Make the Difference",
    description:
      "An educational article explaining why stable genetics and professional breeding define premium cannabis seeds.",
    tag: "Education",
    publishedAt: "January 25, 2026",
    readingTime: "10 Min",
    views: "20",
    sections: [
      {
        heading: "Premium Genetics as the Foundation of Quality",
        body: [
          "The quality of cannabis seeds begins long before they reach the customer. It starts with carefully selected genetics that have been stabilized through multiple generations.",
          "Premium seed producers focus on consistency, ensuring that each seed reflects the intended characteristics of its strain, such as vigor, structure, and genetic reliability.",
          "Reliable genetics are not only about performance but also about predictability. Customers value seeds that behave consistently, reducing uncertainty and allowing informed decisions.",
        ],
      },
      {
        heading: "Quality Control & Responsible Production",
        body: [
          "Behind every premium cannabis seed is a controlled production process. Professional breeders implement strict quality control measures, from pollination to storage, to preserve seed integrity.",
          "This includes monitoring environmental conditions and handling seeds with care to maintain viability over time.",
          "Equally important is responsible production. Established companies operate with respect for local regulations and ethical standards, ensuring that their products are intended for lawful purposes only.",
        ],
      },
      {
        heading: "Why Customers Choose Premium Seed Brands",
        body: [
          "Consistency in quality control is what separates long-term brands from short-term sellers. Customers return to suppliers who demonstrate reliability, professionalism, and accountability in every batch they release.",
          "Premium brands also provide transparency, sharing lineage, seed type, and genetic background so buyers understand exactly what they are purchasing.",
        ],
      },
    ],
  },
  {
    slug: "why-professional-seed-banks-stand-out",
    title: "Why Professional Seed Banks Stand Out",
    description:
      "Article highlighting what differentiates established cannabis seed companies from unverified sellers.",
    tag: "Buyer Guide",
    publishedAt: "January 20, 2026",
    readingTime: "8 Min",
    views: "14",
    sections: [
      {
        heading: "Transparency Builds Trust",
        body: [
          "Professional seed banks are transparent about sourcing, testing, and seed lineage. This clarity helps customers make confident purchasing decisions.",
        ],
      },
      {
        heading: "Verified Quality Standards",
        body: [
          "Established brands maintain consistent quality standards and documented processes, reducing the risk of unstable genetics or poor germination rates.",
        ],
      },
    ],
  },
  {
    slug: "transparency-in-the-cannabis-market",
    title: "Transparency in the Cannabis Market",
    description:
      "An article exploring why clear information, labeling, and ethics are essential for trust in the cannabis seed industry.",
    tag: "Industry Insights",
    publishedAt: "January 12, 2026",
    readingTime: "7 Min",
    views: "11",
    sections: [
      {
        heading: "Clear Information Matters",
        body: [
          "Customers rely on accurate labels and honest product information to make informed choices.",
          "Transparency creates accountability and supports long-term relationships between brands and buyers.",
        ],
      },
    ],
  },
];
