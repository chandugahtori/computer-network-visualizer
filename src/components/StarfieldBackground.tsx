import kingdomBackground from "@/assets/kingdom-background.png";
import spaceBackgroundLight from "@/assets/space-background-light.webp";
import labyrinthBackground from "@/assets/labyrinth-background.png";
import plainsBackground from "@/assets/plains-background.png";
import { useTheme } from "@/contexts/ThemeContext";

interface StarfieldBackgroundProps {
  variant?: 'home' | 'protocols';
}

export const StarfieldBackground = ({ variant = 'home' }: StarfieldBackgroundProps) => {
  const { isDark } = useTheme();
  
  const darkImage = variant === 'protocols' ? labyrinthBackground : kingdomBackground;
  const lightImage = variant === 'protocols' ? plainsBackground : spaceBackgroundLight;
  
  return (
    <div 
      className="absolute inset-0 w-full min-h-screen pointer-events-none bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{ 
        backgroundImage: `url(${isDark ? darkImage : lightImage})`,
        filter: isDark ? "brightness(0.7)" : "brightness(0.9)",
        backgroundAttachment: 'scroll',
      }}
    />
  );
};
