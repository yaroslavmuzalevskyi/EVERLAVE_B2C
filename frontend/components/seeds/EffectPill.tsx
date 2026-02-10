type EffectPillProps = {
  label: string;
};

export default function EffectPill({ label }: EffectPillProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-pr_dg/30 px-3 py-1 text-xs text-pr_dg">
      {label}
    </span>
  );
}
