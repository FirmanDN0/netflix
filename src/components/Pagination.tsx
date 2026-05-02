"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
}

export default function Pagination({ currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-12 mb-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-gray-300 rounded-lg hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm">Page</span>
        <span className="bg-primary text-white font-bold w-10 h-10 flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
          {currentPage}
        </span>
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-gray-300 rounded-lg hover:text-white hover:border-gray-500 transition-all shadow-md"
      >
        <span>Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
