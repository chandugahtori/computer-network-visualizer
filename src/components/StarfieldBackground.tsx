import labyrinthBackground from "@/assets/labyrinth-background.png";
import plainsBackground from "@/assets/plains-background.png";
import { useTheme } from "@/contexts/ThemeContext";

export const StarfieldBackground = () => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className="absolute inset-0 w-full min-h-screen pointer-events-none bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{ 
        backgroundImage: `url(${isDark ? labyrinthBackground : plainsBackground})`,
        filter: isDark ? "brightness(0.7)" : "brightness(0.9)"
      }}
    />
  );
};
