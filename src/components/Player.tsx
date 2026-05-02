"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, SkipForward, Server, HelpCircle, X, Maximize, Minimize } from "lucide-react";
import { useRef } from "react";
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
  { name: "Server 1", domain: "https://vidsrc.xyz/embed", pattern: 'path' },
  { name: "Server 2", domain: "https://embed.smashystream.com/playere.php", pattern: 'query' },
  { name: "Server 3 (VidAPI)", domain: "https://vaplayer.ru/embed", pattern: 'path' },
];

export default function Player({ id, type, title, poster, season, episode }: PlayerProps) {
  const router = useRouter();
  const [activeSource, setActiveSource] = useState(0);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [showSources, setShowSources] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  useEffect(() => {
    const source = SOURCES[activeSource];
    let url = "";
    const cleanId = id;

    if (source.pattern === 'path') {
      url = type === 'movie'
        ? `${source.domain}/movie/${id}`
        : `${source.domain}/tv/${id}/${season || 1}/${episode || 1}`;
    } else if (source.pattern === 'query') {
      url = type === 'movie'
        ? `${source.domain}?tmdb=${id}`
        : `${source.domain}?tmdb=${id}&season=${season || 1}&episode=${episode || 1}`;
    } else if (source.pattern === 'query_video') {
      url = type === 'movie'
        ? `${source.domain}?video_id=${id}`
        : `${source.domain}?video_id=${id}&s=${season || 1}&e=${episode || 1}`;
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

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    const elem = containerRef.current as any;
    if (!document.fullscreenElement && 
        //@ts-ignore
        !document.webkitFullscreenElement && 
        //@ts-ignore
        !document.mozFullScreenElement &&
        //@ts-ignore
        !document.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      const doc = document as any;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  // Sync fullscreen state if changed via escape key or system controls
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-[9999] flex flex-col overflow-hidden font-sans select-none">
      
      {/* SENSOR AREA: Detects movement to show controls */}
      <div 
        className="absolute inset-0 z-[110] cursor-pointer"
        onMouseMove={() => setShowControls(true)}
        onClick={() => setShowControls(!showControls)}
        style={{ pointerEvents: showControls ? 'none' : 'auto' }}
      />

      {/* TOP CONTROLS - Fades in/out based on state */}
      <div className={`absolute top-0 left-0 w-full p-3 sm:p-6 z-[120] transition-all duration-500 ease-in-out pointer-events-none ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/40 to-transparent -z-10" />
        
        <div className="flex items-start justify-between gap-4 pointer-events-auto">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 max-w-[75%]">
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
              <h2 className="text-white font-black text-xs sm:text-base tracking-tight drop-shadow-md line-clamp-1 opacity-60">
                {title} {type === 'tv' ? `(S${season}E${episode})` : ""}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowGuide(!showGuide); }}
              className="hidden xs:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all shadow-lg"
            >
              <HelpCircle className="w-4 h-4 text-gray-300" />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all shadow-lg"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-white" />
              ) : (
                <Maximize className="w-4 h-4 text-white" />
              )}
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
        {useMemo(() => iframeUrl ? (
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{
              __html: `
                <iframe 
                  src="${iframeUrl}" 
                  style="width: 100%; height: 100%; border: none;" 
                  allowfullscreen="true" 
                  webkitallowfullscreen="true" 
                  mozallowfullscreen="true" 
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; display-capture"
                ></iframe>
              `
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ), [iframeUrl])}
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
