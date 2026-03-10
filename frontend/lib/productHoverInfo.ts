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

function hasNumber(value: string) {
  return /-?\d+(\.\d+)?/.test(value);
}

function ensureUnit(
  value: string | undefined,
  unit: string,
  unitMatchers: RegExp[],
) {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized) return undefined;
  if (unitMatchers.some((matcher) => matcher.test(normalized))) {
    return normalized;
  }
  if (!hasNumber(normalized)) return normalized;
  return `${normalized} ${unit}`;
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

  const thcWithUnit = ensureUnit(thcValue, "%", [/%/]);
  const yieldWithUnit = ensureUnit(yieldValue, "g/m²", [
    /\bg\s*\/\s*m²\b/i,
    /\bg\s*\/\s*m2\b/i,
    /\bg\/m\b/i,
  ]);
  const seedToHarvestWithUnit = ensureUnit(seedToHarvestValue, "weeks", [
    /\bweek(s)?\b/i,
    /\bwk(s)?\b/i,
  ]);
  const heightWithUnit = ensureUnit(heightValue, "cm", [/\bcm\b/i]);

  return [
    thcWithUnit ? { label: "THC", value: thcWithUnit } : null,
    yieldWithUnit ? { label: "Yield", value: yieldWithUnit } : null,
    seedToHarvestWithUnit
      ? { label: "Seed to Harvest", value: seedToHarvestWithUnit }
      : null,
    heightWithUnit
      ? { label: "Height", value: heightWithUnit }
      : null,
  ].filter((row): row is ProductHoverInfoRow => Boolean(row));
}
