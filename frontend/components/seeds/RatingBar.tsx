type RatingBarProps = {
  label: string;
  value: number;
  total: number;
};

export default function RatingBar({ label, value, total }: RatingBarProps) {
  const percent = Math.round((value / total) * 100);
  return (
    <div className="flex items-center gap-3 text-xs text-pr_dg">
      <span className="w-20">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-pr_dg/10">
        <div
          className="h-2 rounded-full bg-pr_lg"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-10 text-right text-pr_dg/60">{value}</span>
    </div>
  );
}
