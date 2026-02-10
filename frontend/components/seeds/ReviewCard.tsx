type ReviewCardProps = {
  name: string;
  rating: number;
  text: string;
};

export default function ReviewCard({ name, rating, text }: ReviewCardProps) {
  return (
    <div className="rounded-2xl bg-pr_w p-5 text-pr_dg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-5 w-5 rounded-full bg-sr_dg" />
          {name}
        </div>
        <div className="text-xs text-pr_dg/70">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
      </div>
      <p className="mt-3 text-xs text-pr_dg/70">{text}</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="h-16 rounded-lg bg-sr_dg/90" />
        <div className="h-16 rounded-lg bg-sr_dg/90" />
        <div className="h-16 rounded-lg bg-sr_dg/90" />
      </div>
    </div>
  );
}
