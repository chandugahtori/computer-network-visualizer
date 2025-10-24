import { useState, useRef, useEffect } from "react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AudioPlayer = () => {
  const [currentTheme, setCurrentTheme] = useState<'epic' | 'quest'>('epic');
  const audioRef = useRef<HTMLAudioElement>(null);

  const themes = {
    epic: {
      src: '/audio/hub-song-epic.mp3',
      label: '🎵 Epic Theme'
    },
    quest: {
      src: '/audio/demo-song.mp3',
      label: '🎵 Epic Quest Theme Song'
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'epic' ? 'quest' : 'epic';
    const currentTime = audioRef.current?.currentTime || 0;
    const wasPlaying = !audioRef.current?.paused;
    
    setCurrentTheme(newTheme);
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = currentTime;
        if (wasPlaying) {
          audioRef.current.play();
        }
      }
    }, 100);
  };

  return (
    <div className="fixed top-4 left-4 z-50 glass-card p-3 border-2 border-primary/30">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleTheme}>
          <Music className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {themes[currentTheme].label}
          </span>
        </div>
        
        <audio
          ref={audioRef}
          controls
          loop
          autoPlay
          src={themes[currentTheme].src}
          className="w-full"
        >
          Your browser doesn't support audio.
        </audio>
      </div>
    </div>
  );
};
