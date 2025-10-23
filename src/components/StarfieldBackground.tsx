import spaceBackgroundDark from "@/assets/space-background-dark.png";
import spaceBackgroundLight from "@/assets/space-background-light.png";
import { useTheme } from "@/contexts/ThemeContext";

export const StarfieldBackground = () => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none bg-center bg-no-repeat transition-all duration-500"
      style={{ 
        backgroundImage: `url(${isDark ? spaceBackgroundDark : spaceBackgroundLight})`,
        backgroundSize: '100% 100%',
        filter: isDark ? "brightness(0.7)" : "brightness(0.9)"
      }}
    />
  );
};
