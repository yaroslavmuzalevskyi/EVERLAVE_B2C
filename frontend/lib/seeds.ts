export type SeedItem = {
  productId?: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  category: string;
  thc: string;
  seedType: string;
  flowering: string;
  yield: string;
  effects: string[];
  rating: number;
  sold: number;
  sections: Array<{ heading: string; body: string[] }>;
};

export const seedItems: SeedItem[] = [
  {
    productId: "og-kush-feminized-seeds",
    slug: "og-kush-feminized-seeds",
    title: "OG Kush Feminized Seeds",
    description:
      "High-yield feminized genetics for indoor growing with stable performance.",
    price: "€25.34",
    category: "Outdoor",
    thc: "Medium-High (20–24%)",
    seedType: "Feminized / Autoflower",
    flowering: "9–10 weeks",
    yield: "500–650 g/m²",
    effects: ["Deep Relaxation", "Pleasant Euphoria", "Creative Lift"],
    rating: 4.5,
    sold: 25,
    sections: [
      {
        heading: "Description",
        body: [
          "Cherry Cola Auto RF3 is a refined autoflowering cultivar developed through multiple generations to ensure genetic stability and reliable performance.",
          "It is known for its expressive terpene profile, combining sweet cherry notes with a smooth, soda-like finish.",
          "The plant produces dense, resin-rich flowers with strong bag appeal and excellent aromatic intensity.",
        ],
      },
      {
        heading: "Genetic Balance",
        body: [
          "Indica-dominant structure with resilient growth for both indoor and outdoor environments.",
        ],
      },
    ],
  },
  {
    productId: "gelato-auto-seeds",
    slug: "gelato-auto-seeds",
    title: "Gelato Auto Seeds",
    description:
      "Fast-flowering autoflowering strain with stable genetics and smooth flavor.",
    price: "€22.23",
    category: "Indoor",
    thc: "Medium (18–20%)",
    seedType: "Autoflower",
    flowering: "8–9 weeks",
    yield: "450–550 g/m²",
    effects: ["Relaxed Focus", "Balanced Mood"],
    rating: 4.3,
    sold: 18,
    sections: [
      {
        heading: "Description",
        body: [
          "Gelato Auto delivers consistent structure with a creamy aroma and smooth finish.",
        ],
      },
    ],
  },
  {
    productId: "cbd-full-spectrum-oil-10",
    slug: "cbd-full-spectrum-oil-10",
    title: "CBD Full Spectrum Oil 10%",
    description: "Premium full spectrum CBD oil for daily wellness.",
    price: "€39.56",
    category: "Wellness",
    thc: "Low",
    seedType: "N/A",
    flowering: "N/A",
    yield: "N/A",
    effects: ["Calm", "Balance"],
    rating: 4.6,
    sold: 32,
    sections: [
      {
        heading: "Description",
        body: [
          "Full spectrum oil formulated for everyday calm and balance.",
        ],
      },
    ],
  },
  {
    productId: "cbd-isolate-99",
    slug: "cbd-isolate-99",
    title: "CBD Isolate 99%",
    description: "Highly purified CBD isolate for professional use.",
    price: "€56.32",
    category: "Isolate",
    thc: "0%",
    seedType: "N/A",
    flowering: "N/A",
    yield: "N/A",
    effects: ["Neutral"],
    rating: 4.7,
    sold: 41,
    sections: [
      {
        heading: "Description",
        body: ["Ultra-refined isolate for precise formulations."],
      },
    ],
  },
  {
    productId: "lemon-haze-cannabis-flower",
    slug: "lemon-haze-cannabis-flower",
    title: "Lemon Haze Cannabis Flower",
    description:
      "Aromatic indoor-grown flower with high terpene content.",
    price: "€18",
    category: "Indoor",
    thc: "High (22–26%)",
    seedType: "Feminized",
    flowering: "9–10 weeks",
    yield: "450–550 g/m²",
    effects: ["Uplifted", "Energized"],
    rating: 4.4,
    sold: 21,
    sections: [
      {
        heading: "Description",
        body: ["Bright citrus profile with uplifting effects."],
      },
    ],
  },
  {
    productId: "thc-extract-live-rosin",
    slug: "thc-extract-live-rosin",
    title: "THC Extract – Live Rosin",
    description:
      "Solventless concentrate with preserved cannabinoid profile.",
    price: "€34.80",
    category: "Extract",
    thc: "High",
    seedType: "N/A",
    flowering: "N/A",
    yield: "N/A",
    effects: ["Potent", "Relaxing"],
    rating: 4.2,
    sold: 12,
    sections: [
      {
        heading: "Description",
        body: ["Cold-pressed rosin with rich flavor and potency."],
      },
    ],
  },
  {
    productId: "cbd-gummies",
    slug: "cbd-gummies",
    title: "CBD Gummies",
    description: "Infused gummies with precise CBD dosage.",
    price: "€21",
    category: "Edible",
    thc: "0%",
    seedType: "N/A",
    flowering: "N/A",
    yield: "N/A",
    effects: ["Calm", "Sleep Support"],
    rating: 4.5,
    sold: 27,
    sections: [
      {
        heading: "Description",
        body: ["Tasty gummies designed for daily calm."],
      },
    ],
  },
  {
    productId: "disposable-vape-cbd-blend",
    slug: "disposable-vape-cbd-blend",
    title: "Disposable Vape – CBD Blend",
    description:
      "Ready-to-use vape with balanced cannabinoid blend.",
    price: "€24",
    category: "Vape",
    thc: "Low",
    seedType: "N/A",
    flowering: "N/A",
    yield: "N/A",
    effects: ["Relaxed", "Clear"],
    rating: 4.1,
    sold: 16,
    sections: [
      {
        heading: "Description",
        body: ["Compact disposable with smooth draw."],
      },
    ],
  },
];
