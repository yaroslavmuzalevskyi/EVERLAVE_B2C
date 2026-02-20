export type ProductHoverInfoRow = {
  label: string;
  value: string;
};

type ProductFacts = {
  thcLevel?: string;
  yield?: string;
  seedToHarvest?: string;
  height?: string;
  plantHeight?: string;
  floweringCycle?: string;
};

type ProductHoverInfoInput = {
  content?: {
    facts?: ProductFacts;
  };
  filters?: Record<string, string>;
};

function pickFilterValue(
  filters: Record<string, string> | undefined,
  candidates: string[],
) {
  if (!filters) return undefined;
  const entries = Object.entries(filters);
  const match = entries.find(([key]) => {
    const normalized = key.toLowerCase();
    return candidates.some((candidate) => normalized.includes(candidate));
  });
  return match?.[1];
}

export function buildProductHoverInfo(
  input: ProductHoverInfoInput,
): ProductHoverInfoRow[] {
  const thcValue =
    input.content?.facts?.thcLevel ?? pickFilterValue(input.filters, ["thc"]);
  const yieldValue =
    input.content?.facts?.yield ?? pickFilterValue(input.filters, ["yield"]);
  const seedToHarvestValue =
    input.content?.facts?.seedToHarvest ??
    input.content?.facts?.floweringCycle ??
    pickFilterValue(input.filters, [
      "seed to harvest",
      "flowering",
      "cycle",
      "harvest",
    ]);
  const heightValue =
    input.content?.facts?.height ??
    input.content?.facts?.plantHeight ??
    pickFilterValue(input.filters, ["height", "plant height", "(cm)"]);

  return [
    thcValue ? { label: "THC", value: thcValue } : null,
    yieldValue ? { label: "Yield", value: yieldValue } : null,
    seedToHarvestValue
      ? { label: "Seed to Harvest", value: seedToHarvestValue }
      : null,
    heightValue
      ? { label: "Height", value: heightValue }
      : null,
  ].filter((row): row is ProductHoverInfoRow => Boolean(row));
}
