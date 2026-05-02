"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProgress, getProgress } from "@/lib/storage";
import { ArrowLeft, RotateCcw, SkipForward, Server, Globe, HelpCircle, X, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface PlayerProps {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  season?: number;
  episode?: number;
}

const SOURCES = [
  { name: "Server 1 (Auto-Indo)", domain: "https://vidsrc.xyz/embed" },
  { name: "Server 2 (No-Error Mode)", domain: "https://embed.smashystream.com/playere.php" },
];

export default function Player({ id, type, title, poster, season, episode }: PlayerProps) {
  const router = useRouter();
  const [activeSource, setActiveSource] = useState(0);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [showSources, setShowSources] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [showControls]);

  useEffect(() => {
    const source = SOURCES[activeSource];
    let url = "";
    const cleanId = id;

    if (source.domain.includes("vidsrc.xyz")) {
      url = type === 'movie'
        ? `${source.domain}/movie/${cleanId}`
        : `${source.domain}/tv/${cleanId}/${season || 1}/${episode || 1}`;
    } else if (source.domain.includes("smashystream.com")) {
      url = type === 'movie'
        ? `${source.domain}?tmdb=${cleanId}`
        : `${source.domain}?tmdb=${cleanId}&season=${season || 1}&episode=${episode || 1}`;
    }

    setIframeUrl(url);
  }, [id, type, season, episode, activeSource]);

  const handleNextEpisode = () => {
    if (type !== 'tv') return;
    const nextEp = (episode || 1) + 1;
    router.push(`/watch/tv/${id}?season=${season || 1}&episode=${nextEp}`);
  };

  const handleRestart = () => {
    const currentUrl = iframeUrl;
    setIframeUrl("");
    setTimeout(() => setIframeUrl(currentUrl), 100);
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden font-sans"
      onClick={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
    >
      {/* TOP CONTROLS */}
      <div className={`absolute top-0 left-0 w-full p-4 sm:p-6 z-30 bg-gradient-to-b from-black/95 via-black/60 to-transparent transition-all duration-500 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href={`/${type}/${id}`}
                className="text-white flex items-center gap-2 hover:bg-white/20 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl border border-white/10 transition-all active:scale-95 shadow-xl pointer-events-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-bold text-[10px] sm:text-xs">Exit</span>
              </Link>

              <button 
                onClick={(e) => { e.stopPropagation(); handleRestart(); }}
                className="flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl transition-all pointer-events-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="font-bold text-[10px] sm:text-xs">Restart</span>
              </button>

              {type === 'tv' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
                  className="flex items-center gap-2 text-white bg-primary hover:bg-primary-hover px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all font-black shadow-lg shadow-primary/20 active:scale-95 pointer-events-auto"
                >
                  <span className="text-[10px] sm:text-xs">Next</span>
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowGuide(!showGuide); }}
                className="hidden xs:flex items-center gap-2 text-gray-300 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full backdrop-blur-xl border border-white/5 transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">Guide</span>
              </button>

              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSources(!showSources); }}
                  className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-xl border border-white/10 transition-all shadow-2xl active:scale-95"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-tighter">S{activeSource + 1}</span>
                </button>

                {showSources && (
                  <div className="absolute top-full right-0 mt-4 w-48 sm:w-64 bg-surface/95 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="p-3 border-b border-border bg-white/5 flex items-center justify-between">
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Servers</p>
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setShowSources(false)} />
                    </div>
                    <div className="p-1">
                      {SOURCES.map((source, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSource(index);
                            setShowSources(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[10px] sm:text-xs transition-all flex items-center justify-between mb-1 ${
                            activeSource === index 
                              ? "text-white bg-primary font-black" 
                              : "text-gray-400 hover:bg-white/5"
                          }`}
                        >
                          <span>{source.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-white ml-1">
            <h2 className="font-black text-sm sm:text-lg tracking-tight leading-none drop-shadow-2xl line-clamp-1">{title}</h2>
            {type === 'tv' && (
              <p className="text-[10px] font-bold text-primary mt-1">S{season} • E{episode}</p>
            )}
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={(e) => e.stopPropagation()}>
          <div className="bg-surface border border-border p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowGuide(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-white mb-6">Subtitle Guide</h3>
            <div className="space-y-4">
              <p className="text-gray-400 text-xs leading-relaxed">1. Click the **CC** icon in the bottom right corner of the video player.</p>
              <p className="text-gray-400 text-xs leading-relaxed">2. Choose **Indonesian** or **English** from the list.</p>
              <p className="text-gray-400 text-xs leading-relaxed">3. If subtitles don't appear, try switching to **Server 1**.</p>
            </div>
            <button onClick={() => setShowGuide(false)} className="w-full mt-8 bg-primary text-white font-black py-3 rounded-xl uppercase tracking-widest text-[10px]">Close</button>
          </div>
        </div>
      )}

      {/* VIDEO AREA */}
      <div className="flex-grow relative bg-black z-10">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-none"
            allowFullScreen={true}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; display-capture"
            // @ts-ignore
            webkitallowfullscreen="true"
            // @ts-ignore
            mozallowfullscreen="true"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#050505]">
            <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* BOTTOM AREA (Empty to avoid blocking CC) */}
      <div className={`absolute bottom-0 left-0 w-full p-8 z-30 bg-gradient-to-t from-black/80 to-transparent transition-all duration-500 pointer-events-none ${showControls ? "opacity-100" : "opacity-0"}`}>
        {/* No buttons here anymore to keep CC area clear */}
      </div>
    </div>
  );
}
