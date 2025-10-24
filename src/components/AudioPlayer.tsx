import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="glass-card p-3 flex items-center gap-3 min-w-[200px]">
        <audio 
          ref={audioRef} 
          loop
          className="hidden"
        >
          <source src="/audio/hub-song-epic.mp3" type="audio/mpeg" />
        </audio>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? "⏸" : "▶"}
        </Button>

        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">Epic Theme</p>
          <p className="text-[10px] text-foreground/70">Background Music</p>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={toggleMute}
          className="h-8 w-8 p-0"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
