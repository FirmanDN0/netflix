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
      <div className={`absolute top-0 left-0 w-full p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between z-30 bg-gradient-to-b from-black/95 via-black/40 to-transparent transition-all duration-500 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-0">
          <Link 
            href={`/${type}/${id}`}
            className="text-white flex items-center gap-2 hover:bg-white/20 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl border border-white/10 transition-all active:scale-95 shadow-xl pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-bold text-xs sm:text-sm">Exit</span>
          </Link>
          <div className="text-white">
            <h2 className="font-black text-base sm:text-xl tracking-tight leading-none drop-shadow-2xl line-clamp-1">{title}</h2>
            {type === 'tv' && (
              <div className="flex items-center gap-2 mt-1">
                <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[8px] sm:text-[10px] font-black rounded uppercase border border-primary/30">Episode</span>
                <p className="text-[10px] sm:text-xs font-bold text-gray-300">S{season} • E{episode}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowGuide(!showGuide); }}
            className="flex items-center gap-2 text-gray-300 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full backdrop-blur-xl border border-white/5 transition-all"
          >
            <HelpCircle className="w-3 h-3 sm:w-4 h-4" />
            <span className="text-[10px] sm:text-xs font-bold">Guide</span>
          </button>

          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSources(!showSources); }}
              className="flex items-center gap-2 sm:gap-3 text-white bg-primary hover:bg-primary-hover px-4 py-2 sm:px-6 sm:py-2.5 rounded-full backdrop-blur-xl transition-all shadow-2xl shadow-primary/40 active:scale-95"
            >
              <Server className="w-3 h-3 sm:w-4 h-4" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-tighter">Server {activeSource + 1}</span>
            </button>

            {showSources && (
              <div className="absolute top-full right-0 mt-4 w-64 sm:w-80 bg-surface/95 backdrop-blur-2xl border border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-4 border-b border-border bg-white/5 flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quality Select</p>
                  <X className="w-4 h-4 cursor-pointer" onClick={() => setShowSources(false)} />
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {SOURCES.map((source, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSource(index);
                        setShowSources(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between mb-1 ${
                        activeSource === index 
                          ? "text-white bg-primary font-black shadow-xl shadow-primary/20" 
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">{source.name}</span>
                        <span className="text-[8px] sm:text-[10px] opacity-50 font-medium">{source.domain.split('/')[2]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={(e) => e.stopPropagation()}>
          <div className="bg-surface border border-border p-6 sm:p-10 rounded-3xl sm:rounded-[40px] max-w-lg w-full shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowGuide(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mb-6 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 border border-primary/20">
                <Globe className="text-primary w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-2">Fix Subtitles</h3>
            </div>
            <div className="space-y-4 sm:space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { title: "Switch Server", desc: "Try Server 1 or Server 2 for the best stability." },
                { title: "Enable CC", desc: "Click the CC icon in the bottom right corner of the player." },
                { title: "Indonesian", desc: "Choose Indonesian from the settings or use auto-translate." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 sm:gap-5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-500 font-black">
                    {i + 1}
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-bold text-sm sm:text-base mb-0.5">{step.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full mt-8 sm:mt-10 bg-primary text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs"
            >
              Start Watching
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow relative bg-black z-10">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-none shadow-2xl"
            allowFullScreen={true}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; display-capture"
            // @ts-ignore
            webkitallowfullscreen="true"
            // @ts-ignore
            mozallowfullscreen="true"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#050505]">
            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 w-full p-4 sm:p-8 flex items-center justify-between z-30 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-all duration-500 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-full border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">System Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); handleRestart(); }}
            className="flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 sm:px-6 sm:py-3 rounded-xl backdrop-blur-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-bold text-xs sm:text-sm">Restart</span>
          </button>
          
          {type === 'tv' && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
              className="flex items-center gap-2 text-white bg-primary hover:bg-primary-hover px-6 py-2 sm:px-8 sm:py-3 rounded-xl transition-all font-black shadow-lg shadow-primary/20 active:scale-95"
            >
              <span className="text-xs sm:text-sm">Next</span>
              <SkipForward className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
