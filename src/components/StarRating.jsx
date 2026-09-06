export default function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            onClick={
              interactive && onChange ? () => onChange(i + 1) : undefined
            }
            className={`${sizes[size]} ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            }`}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {half ? (
                <>
                  <defs>
                    <linearGradient id={`half-${i}`}>
                      <stop offset="50%" stopColor="#F97316" />
                      <stop offset="50%" stopColor="#e2e8f0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77 5.23 16.21l.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
                    fill={`url(#half-${i})`}
                    stroke="#F97316"
                    strokeWidth="0.5"
                  />
                </>
              ) : (
                <path
                  d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77 5.23 16.21l.91-5.32L2.27 7.12l5.34-.78L10 1.5z"
                  fill={filled ? "#F97316" : "#e2e8f0"}
                  stroke={filled ? "#F97316" : "#cbd5e1"}
                  strokeWidth="0.5"
                />
              )}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
