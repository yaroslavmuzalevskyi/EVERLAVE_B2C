type ReviewCardProps = {
  name: string;
  rating: number;
  text: string;
  images?: string[];
  createdAt?: string;
  isMine?: boolean;
  onDelete?: () => void;
  onOpen?: () => void;
};

export default function ReviewCard({
  name,
  rating,
  text,
  images = [],
  createdAt,
  isMine,
  onDelete,
  onOpen,
}: ReviewCardProps) {
  const visibleImages = images.slice(0, 3);

  return (
    <div
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (!onOpen) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className={
        "rounded-2xl bg-pr_w p-5 text-pr_dg" +
        (onOpen ? " cursor-pointer transition hover:shadow-sm" : "")
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-5 w-5 rounded-full bg-sr_dg" />
          {name}
        </div>
        <div className="flex items-center gap-3">
          {isMine && onDelete ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="text-xs text-pr_dr"
            >
              Delete
            </button>
          ) : null}
          <div className="text-xs text-pr_dg/70">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
        </div>
      </div>
      {createdAt ? (
        <p className="mt-1 text-xs text-pr_dg/60">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-pr_dg/70">{text}</p>
      {visibleImages.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {visibleImages.map((url, index) => (
            <img
              key={`${url}-${index}`}
              src={url}
              alt=""
              className="h-16 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
