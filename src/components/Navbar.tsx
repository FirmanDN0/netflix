"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlaySquare } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-40 transition-colors duration-300 ${
        isScrolled ? "bg-surface shadow-md" : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
            <PlaySquare className="w-8 h-8 fill-primary" />
            <span className="hidden sm:inline">Vidia</span>
          </Link>

          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/tv" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
