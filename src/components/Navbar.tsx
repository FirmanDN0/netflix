"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlaySquare, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-surface shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter shrink-0">
            <PlaySquare className="w-8 h-8 fill-primary" />
            <span>Vidia</span>
          </Link>

          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/tv" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <SearchBar />
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-white/5 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4 text-lg font-bold">
            <Link 
              href="/" 
              className="hover:text-primary transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/movies" 
              className="hover:text-primary transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              href="/tv" 
              className="hover:text-primary transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TV Shows
            </Link>
            <Link 
              href="/watchlist" 
              className="hover:text-primary transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Watchlist
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
