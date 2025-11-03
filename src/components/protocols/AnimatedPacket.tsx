import { motion } from "framer-motion";

interface AnimatedPacketProps {
  /** Progress from 0 to 1, where 0 = at sender, 1 = at receiver */
  progress: number;
  /** Vertical offset from the center line (in pixels) */
  yOffset?: number;
  /** Label text displayed on the packet */
  label: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Packet color (default: primary) */
  color?: string;
  /** Whether animation is active */
  isActive: boolean;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of animation (in seconds) */
  duration?: number;
  /** Custom start position (optional, overrides default left position) */
  startX?: number;
  /** Custom end position (optional, overrides default right position) */
  endX?: number;
}

/**
 * AnimatedPacket - A reusable component for animating packets/divs
 * moving from left (Sender) to right (Receiver) in network protocol visualizations.
 * 
 * This component uses Framer Motion for smooth animations and provides:
 * - Smooth left-to-right (or right-to-left) movement
 * - Glow effects and visual feedback
 * - Support for custom start/end positions
 * - Progress-based animation (0 = start, 1 = end)
 * 
 * Usage Example:
 * ```tsx
 * <AnimatedPacket
 *   progress={currentStep >= 1 ? 1 : currentStep === 0.5 ? 0.5 : 0}
 *   label="Frame 0"
 *   subtitle="Seq: 0"
 *   isActive={currentStep >= 0 && currentStep < 2}
 *   duration={1}
 * />
 * ```
 * 
 * For reverse direction (right-to-left, e.g., ACK packets):
 * ```tsx
 * <AnimatedPacket
 *   progress={1 - ackProgress} // Invert progress
 *   label="ACK 0"
 *   color="hsl(142 76% 36%)"
 *   isActive={ackIsActive}
 * />
 * ```
 */
export const AnimatedPacket = ({
  progress,
  yOffset = 0,
  label,
  subtitle,
  color = "hsl(var(--primary))",
  isActive,
  delay = 0,
  duration = 1,
  startX,
  endX,
}: AnimatedPacketProps) => {
  // Calculate X position: 0 = start, 1 = end
  // If startX/endX are provided, use pixel-based positioning for precision
  // Otherwise, use percentage-based positioning
  const leftPosition = startX !== undefined && endX !== undefined
    ? startX + (endX - startX) * progress
    : `${10 + progress * 75}%`;

  if (!isActive) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        top: `calc(50% + ${yOffset}px)`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        left: typeof leftPosition === 'number' ? `${leftPosition}px` : leftPosition,
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.8,
      }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
    >
      {/* Packet Container */}
      <div
        className="relative px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg border-2 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px]"
        style={{
          backgroundColor: color,
          borderColor: color,
          boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`,
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-lg blur-xl opacity-50 -z-10"
          style={{
            backgroundColor: color,
          }}
        />
        
        {/* Label */}
        <span className="text-[10px] sm:text-xs font-bold text-foreground whitespace-nowrap">
          {label}
        </span>
        
        {/* Subtitle */}
        {subtitle && (
          <span className="text-[9px] sm:text-[10px] text-foreground/80 mt-0.5">
            {subtitle}
          </span>
        )}
      </div>

      {/* Motion trail effect (shows when packet is moving) */}
      {progress > 0 && progress < 1 && (
        <motion.div
          className="absolute top-1/2 -left-6 sm:-left-8 w-6 sm:w-8 h-0.5"
          style={{
            background: `linear-gradient(to right, ${color}00, ${color}80)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

