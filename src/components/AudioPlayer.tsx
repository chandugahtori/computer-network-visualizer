import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error('Audio play failed:', err);
        });
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'epic' ? 'quest' : 'epic';
    const wasPlaying = isPlaying;
    
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTheme(newTheme);
      
      setTimeout(() => {
        if (audioRef.current && wasPlaying) {
          audioRef.current.play().catch(err => {
            console.error('Audio play failed:', err);
          });
        }
      }, 100);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 glass-card p-4 border-2 border-primary/30">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {themes[currentTheme].label}
          </span>
        </div>
        
        <audio
          ref={audioRef}
          loop
          autoPlay
          src={themes[currentTheme].src}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlay}
            className="border-primary/50"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="border-primary/50"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="border-primary/50"
          >
            Switch Theme
          </Button>
        </div>
      </div>
    </div>
  );
};
