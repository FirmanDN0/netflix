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
  { name: "Server 1 (Highly Stable)", domain: "https://vidlink.pro/embed" },
  { name: "Server 2 (Auto-Indo)", domain: "https://vidsrc.xyz/embed" },
  { name: "Server 3 (VIP Subtitles)", domain: "https://vidsrc.pro/embed" },
  { name: "Server 4 (No-Error Mode)", domain: "https://embed.smashystream.com/playere.php" },
  { name: "Server 5 (Indo Focus)", domain: "https://superembed.cc/embed" },
];

export default function Player({ id, type, title, poster, season, episode }: PlayerProps) {
  const router = useRouter();
  const [activeSource, setActiveSource] = useState(0);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [showSources, setShowSources] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const source = SOURCES[activeSource];
    let url = "";
    const cleanId = id.startsWith('tt') ? id : id;

    if (source.domain.includes("vidlink.pro")) {
      url = type === 'movie' 
        ? `${source.domain}/movie/${cleanId}?primaryColor=e50914&secondaryColor=ffffff&iconColor=e50914&autoplay=false`
        : `${source.domain}/tv/${cleanId}/${season || 1}/${episode || 1}?primaryColor=e50914&secondaryColor=ffffff&iconColor=e50914&autoplay=false`;
    } else if (source.domain.includes("vidsrc.xyz")) {
      url = type === 'movie'
        ? `${source.domain}/movie/${cleanId}`
        : `${source.domain}/tv/${cleanId}/${season || 1}/${episode || 1}`;
    } else if (source.domain.includes("vidsrc.pro")) {
      url = type === 'movie' 
        ? `${source.domain}/movie/${cleanId}`
        : `${source.domain}/tv/${cleanId}/${season || 1}/${episode || 1}`;
    } else if (source.domain.includes("smashystream.com")) {
      url = type === 'movie'
        ? `${source.domain}?tmdb=${cleanId}`
        : `${source.domain}?tmdb=${cleanId}&season=${season || 1}&episode=${episode || 1}`;
    } else if (source.domain.includes("superembed.cc")) {
      url = type === 'movie'
        ? `${source.domain}/movie/${cleanId}`
        : `${source.domain}/tv/${cleanId}/${season || 1}/${episode || 1}`;
    }

    setIframeUrl(url);
  }, [id, type, season, episode, activeSource]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'timeupdate' || data.event === 'timeupdate') {
        const currentTime = data.currentTime || data.time || 0;
        const duration = data.duration || 0;
        if (currentTime > 0 && duration > 0) {
          saveProgress({
            id, type, title, poster,
            progress: currentTime,
            duration: duration,
            ...(type === 'tv' ? { season, episode } : {})
          });
        }
      } else if (data.type === 'completed' || data.event === 'ended') {
        if (type === 'tv') handleNextEpisode();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id, type, title, poster, season, episode]);

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
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden font-sans">
      {/* Premium Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/95 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-all duration-500 pointer-events-none group">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link 
            href={`/${type}/${id}`}
            className="text-white flex items-center gap-2 hover:bg-white/20 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-xl border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm">Exit</span>
          </Link>
          <div className="text-white">
            <h2 className="font-black text-xl tracking-tight leading-none drop-shadow-2xl">{title}</h2>
            {type === 'tv' && (
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded uppercase border border-primary/30">Episode</span>
                <p className="text-xs font-bold text-gray-300">S{season} • E{episode}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 text-gray-300 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full backdrop-blur-xl border border-white/5 transition-all group/btn"
          >
            <HelpCircle className="w-4 h-4 group-hover/btn:text-primary transition-colors" />
            <span className="text-xs font-bold">Subtitle Guide</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-3 text-white bg-primary hover:bg-primary-hover px-6 py-2.5 rounded-full backdrop-blur-xl transition-all shadow-2xl shadow-primary/40 group/server active:scale-95"
            >
              <Server className="w-4 h-4 group-hover/server:rotate-12 transition-transform" />
              <span className="text-sm font-black uppercase tracking-tighter">Server: {activeSource + 1}</span>
            </button>

            {showSources && (
              <div className="absolute top-full right-0 mt-4 w-80 bg-surface/95 backdrop-blur-2xl border border-border rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-5 border-b border-border bg-white/5 flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">Quality Select</p>
                  <ShieldCheck className="w-4 h-4 text-green-500 opacity-50" />
                </div>
                <div className="p-3">
                  {SOURCES.map((source, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveSource(index);
                        setShowSources(false);
                      }}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-sm transition-all flex items-center justify-between mb-2 group/item ${
                        activeSource === index 
                          ? "text-white bg-primary font-black shadow-xl shadow-primary/20" 
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">{source.name}</span>
                        <span className="text-[10px] opacity-50 font-medium">Provider: {source.domain.split('/')[2]}</span>
                      </div>
                      {activeSource === index && <Globe className="w-4 h-4 text-white animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Subtitle Guide Modal */}
      {showGuide && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-surface border border-border p-10 rounded-[40px] max-w-lg shadow-[0_0_100px_rgba(229,9,20,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <button 
              onClick={() => setShowGuide(false)} 
              className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-primary/20">
                <Globe className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Fix Subtitles</h3>
              <p className="text-gray-400 text-sm">Follow these steps if subtitles are missing or failing</p>
            </div>

            <div className="space-y-6">
              {[
                { title: "Switch Server", desc: "If you see 'Subtitles failed', click the red 'Server' button and try Server 1 or Server 4." },
                { title: "Enable CC", desc: "Click the CC icon in the bottom right of the video player." },
                { title: "Auto-Translate", desc: "Choose 'Indonesian' from the subtitle list or use 'Auto-Translate' if not available." },
                { title: "Refresh", desc: "If video is stuck, use the 'Restart Stream' button below." }
              ].map((step, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-gray-500 font-black group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {i + 1}
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-bold mb-1">{step.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full mt-12 bg-white hover:bg-primary text-black hover:text-white font-black py-4 rounded-2xl transition-all shadow-2xl shadow-white/5 uppercase tracking-widest text-xs"
            >
              Got it, let's watch!
            </button>
          </div>
        </div>
      )}

      {/* High Fidelity Player Area */}
      <div className="flex-grow relative bg-black">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-none shadow-2xl scale-[1.002]"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-white font-black text-sm tracking-widest uppercase">Initializing Secure Stream</p>
                <p className="text-gray-600 text-[10px] font-bold">PLEASE WAIT A FEW SECONDS...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full p-8 flex items-center justify-between z-20 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-full border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live System Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={handleRestart}
            className="flex items-center gap-3 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl transition-all group/restart"
          >
            <RotateCcw className="w-4 h-4 group-hover/restart:rotate-[-180deg] transition-transform duration-500" />
            <span className="font-bold text-sm">Restart Stream</span>
          </button>
          
          {type === 'tv' && (
            <button 
              onClick={handleNextEpisode}
              className="flex items-center gap-3 text-white bg-primary hover:bg-primary-hover px-8 py-3 rounded-2xl transition-all font-black shadow-[0_20px_40px_-10px_rgba(229,9,20,0.5)] active:scale-95 group/next"
            >
              <span>Next Episode</span>
              <SkipForward className="w-4 h-4 group-hover/next:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
