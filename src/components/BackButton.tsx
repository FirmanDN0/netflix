"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface BackButtonProps {
  href?: string;
}

export default function BackButton({ href = "/" }: BackButtonProps) {
  const router = useRouter();
  const [targetUrl, setTargetUrl] = useState(href);

  useEffect(() => {
    // Try to get the last remembered browse URL from localStorage
    const savedUrl = localStorage.getItem("last_browse_url");
    if (savedUrl) {
      setTargetUrl(savedUrl);
    }
  }, []);

  const handleClick = () => {
    router.push(targetUrl);
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-all mb-8 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 hover:border-white/20 backdrop-blur-md"
    >
      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      <span className="font-bold text-sm">Back to Browse</span>
    </button>
  );
}
