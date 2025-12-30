import Logo from "./Logo";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full p-4 md:p-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xs sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Logo />
      </div>
      <Link
        href="https://github.com/ShreyNagda/pola-prints"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
      >
        Star on GitHub
      </Link>
    </header>
  );
}
