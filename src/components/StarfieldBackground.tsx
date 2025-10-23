import kingdomBackground from "@/assets/kingdom-background.png";
import spaceBackgroundLight from "@/assets/space-background-light.webp";
import { useTheme } from "@/contexts/ThemeContext";

export const StarfieldBackground = () => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className="absolute inset-0 w-full min-h-screen pointer-events-none bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{ 
        backgroundImage: `url(${isDark ? kingdomBackground : spaceBackgroundLight})`,
        filter: isDark ? "brightness(0.7)" : "brightness(0.9)"
      }}
    />
  );
};
