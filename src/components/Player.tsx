"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, SkipForward, Server, HelpCircle, X, Lock, Unlock } from "lucide-react";
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
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!showControls || isLocked) return;
    const timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [showControls, isLocked]);

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

  const toggleControls = () => {
    if (isLocked) return;
    setShowControls(!showControls);
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] flex flex-col overflow-hidden font-sans"
      onClick={toggleControls}
    >
      {/* LOCK BUTTON - ALWAYS ACCESSIBLE BUT MINIMAL */}
      <div className="fixed left-4 bottom-24 z-[200] pointer-events-auto">
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLocked(!isLocked); if(!isLocked) setShowControls(false); }}
          className={`p-4 rounded-full backdrop-blur-md border transition-all active:scale-95 ${
            isLocked 
              ? "bg-primary text-white border-primary shadow-xl shadow-primary/40" 
              : "bg-white/10 text-white/40 border-white/10 opacity-20 hover:opacity-100"
          }`}
        >
          {isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
        </button>
      </div>

      {/* TOP CONTROLS */}
      <div className={`fixed top-0 left-0 w-full p-3 sm:p-6 z-[100] transition-all duration-500 ${showControls && !isLocked ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-transparent -z-10" />
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-auto max-w-[70%]">
            <Link 
              href={`/${type}/${id}`}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md transition-all active:scale-95 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-[10px] sm:text-xs">Exit</span>
            </Link>

            <button 
              onClick={(e) => { e.stopPropagation(); handleRestart(); }}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md transition-all active:scale-95 shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-bold text-[10px] sm:text-xs">Restart</span>
            </button>

            {type === 'tv' && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-full shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                <span className="text-white font-black text-[10px] sm:text-xs uppercase tracking-tight">Next</span>
                <SkipForward className="w-3.5 h-3.5 text-white" />
              </button>
            )}

            <div className="w-full mt-2 sm:mt-0 sm:w-auto">
              <h2 className="text-white font-black text-xs sm:text-base tracking-tight drop-shadow-md line-clamp-1 opacity-80">
                {title} {type === 'tv' ? `(S${season}E${episode})` : ""}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowGuide(!showGuide); }}
              className="hidden xs:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all shadow-lg"
            >
              <HelpCircle className="w-4 h-4 text-gray-300" />
            </button>

            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSources(!showSources); }}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-4 py-1.5 rounded-full shadow-xl shadow-primary/30 transition-all active:scale-95 border border-white/10"
              >
                <Server className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-[10px] sm:text-xs font-black">S{activeSource + 1}</span>
              </button>

              {showSources && (
                <div className="absolute top-full right-0 mt-3 w-40 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-white/5 bg-white/5 text-center">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Servers</p>
                  </div>
                  {SOURCES.map((source, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSource(index);
                        setShowSources(false);
                      }}
                      className={`w-full text-center py-2.5 text-[10px] transition-all ${
                        activeSource === index ? "bg-primary text-white font-black" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO AREA */}
      <div className="flex-grow relative bg-black">
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
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Guide Overlay */}
      {showGuide && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="bg-surface border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative text-center">
            <button onClick={() => setShowGuide(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-black text-white mb-4 uppercase">Subtitle Guide</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">Click CC in the player bottom right.</p>
            <button onClick={() => setShowGuide(false)} className="w-full bg-primary text-white font-black py-3 rounded-xl uppercase tracking-widest text-[10px]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
