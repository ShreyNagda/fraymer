import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
}

export default function Logo({
  className = "",
  iconSize = 30, // Slightly larger default for this style
  showText = true,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 font-display font-bold text-xl tracking-tight group ${className}`}
    >
      {/* Icon Container */}
      <div className="relative flex items-center justify-center rounded-lg group-hover:scale-110 transition-all duration-200">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={iconSize}
          height={iconSize}
          loading="eager"
          className="size-8"
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <span className="text-white text-3xl group-hover:text-orange-400 transition-colors duration-300">
          Fraymer
        </span>
      )}
    </Link>
  );
}
