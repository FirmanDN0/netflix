"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function BrowseTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construct the full URL with search params
    const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    
    // Save to localStorage so we can "remember" where we were
    localStorage.setItem("last_browse_url", fullUrl);
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
