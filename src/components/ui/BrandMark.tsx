interface BrandMarkProps {
  size?: "sm" | "lg";
  className?: string;
}

export function BrandMark({ size = "sm", className = "" }: BrandMarkProps) {
  const isLarge = size === "lg";
  const iconSize = isLarge ? 40 : 28;
  const aiText = isLarge ? "text-2xl" : "text-base";
  const nameText = isLarge ? "text-xl" : "text-[15px]";

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Graduation cap + AI */}
      <span className="relative inline-flex items-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {/* Cap top (diamond) */}
          <polygon points="32,8 58,22 32,36 6,22" fill="url(#capGrad)" />
          {/* Cap brim shadow */}
          <polygon points="32,36 58,22 58,26 32,40 6,26 6,22" fill="url(#capGrad)" opacity="0.7" />
          {/* Tassel string */}
          <line x1="52" y1="24" x2="52" y2="44" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tassel end */}
          <circle cx="52" cy="46" r="3" fill="#8b5cf6" />
          {/* Side drapes */}
          <path d="M16 28v14c0 6 7.2 10 16 10s16-4 16-10V28" stroke="url(#capGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      {/* Text */}
      <span className="flex items-baseline gap-0.5 leading-none">
        <span
          className={`${aiText} font-extrabold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent`}
        >
          AI
        </span>
        <span
          className={`${nameText} font-semibold tracking-tight text-[var(--color-text)]`}
        >
          Educademy
        </span>
      </span>
    </span>
  );
}
