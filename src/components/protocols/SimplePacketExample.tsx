import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { AnimatedPacket } from "./AnimatedPacket";

interface SimplePacketExampleProps {
  currentStep: number;
  isPlaying: boolean;
}

/**
 * SimplePacketExample - A React-based protocol visualization demonstrating
 * left-to-right packet animation without using Canvas.
 * 
 * This component shows:
 * - A Sender div on the left
 * - A Receiver div on the right  
 * - An animated packet moving from sender to receiver
 * - Support for bidirectional movement (packet going right, ACK going left)
 * 
 * This is a complete, ready-to-use example you can adapt for any protocol visualization.
 */
export const SimplePacketExample = ({ currentStep, isPlaying }: SimplePacketExampleProps) => {
  const senderRef = useRef<HTMLDivElement>(null);
  const receiverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState({ startX: 0, endX: 0 });

  // Calculate exact positions of sender and receiver for precise animation
  useEffect(() => {
    const updatePositions = () => {
      if (senderRef.current && receiverRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const senderRect = senderRef.current.getBoundingClientRect();
        const receiverRect = receiverRef.current.getBoundingClientRect();
        
        setPositions({
          startX: senderRect.left + senderRect.width / 2 - containerRect.left,
          endX: receiverRect.left + receiverRect.width / 2 - containerRect.left,
        });
      }
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  // Calculate progress for packet moving right (Sender -> Receiver)
  // Step 0: packet at sender (progress = 0)
  // Step 1: packet moving (progress = 0 to 1)
  // Step 2: packet at receiver (progress = 1)
  const packetProgress = currentStep >= 2 ? 1 : currentStep === 1 ? 0.5 : 0;
  const packetIsActive = currentStep >= 0 && currentStep < 3;

  // Calculate progress for ACK moving left (Receiver -> Sender)
  // For left movement, we invert the progress: progress 1 = at receiver, progress 0 = at sender
  // Step 3: ACK at receiver (progress = 1, but we show it inverted)
  // Step 4: ACK moving (progress = 1 to 0)
  // Step 5: ACK at sender (progress = 0)
  const ackProgress = currentStep >= 5 ? 0 : currentStep >= 4 ? 0.5 : currentStep >= 3 ? 1 : 1;
  const ackIsActive = currentStep >= 3 && currentStep < 6;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[300px] flex items-center justify-between px-4 sm:px-8"
    >
      {/* Connection line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-px bg-primary/30 relative">
          {/* Arrow indicators */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-primary/30" />
        </div>
      </div>

      {/* Sender Box */}
      <motion.div
        ref={senderRef}
        className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex flex-col items-center justify-center border-2 shadow-lg"
        style={{
          backgroundColor: "hsl(var(--primary))",
          borderColor: "hsl(var(--primary))",
          boxShadow: currentStep >= 0 && currentStep < 3 
            ? "0 0 30px hsl(var(--primary) / 0.5)" 
            : "0 0 20px hsl(var(--primary) / 0.3)",
        }}
        animate={{
          scale: currentStep >= 0 && currentStep < 3 ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: currentStep >= 0 && currentStep < 3 ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      >
        <span className="text-xs sm:text-sm font-bold text-primary-foreground">SENDER</span>
        <span className="text-[10px] text-primary-foreground/80 mt-1">
          {currentStep >= 5 ? "Ready" : currentStep >= 3 ? "Waiting" : "Sending"}
        </span>
      </motion.div>

      {/* Animated Packet (moving right: Sender -> Receiver) */}
      <AnimatedPacket
        progress={packetProgress}
        yOffset={-40}
        label="Frame 0"
        subtitle="Seq: 0"
        color="hsl(var(--primary))"
        isActive={packetIsActive}
        duration={1}
        startX={positions.startX}
        endX={positions.endX}
      />

      {/* Animated ACK (moving left: Receiver -> Sender)
          Note: For left movement, we use inverted progress */}
      <AnimatedPacket
        progress={1 - ackProgress} // Invert for left movement
        yOffset={40}
        label="ACK 0"
        subtitle="Ack: 1"
        color="hsl(142 76% 36%)" // Green color for ACK
        isActive={ackIsActive}
        duration={1}
        startX={positions.endX} // Start at receiver
        endX={positions.startX} // End at sender
      />

      {/* Receiver Box */}
      <motion.div
        ref={receiverRef}
        className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex flex-col items-center justify-center border-2 shadow-lg"
        style={{
          backgroundColor: "hsl(142 76% 36%)",
          borderColor: "hsl(142 76% 36%)",
          boxShadow: currentStep >= 2 && currentStep < 5
            ? "0 0 30px hsl(142 76% 36% / 0.5)"
            : "0 0 20px hsl(142 76% 36% / 0.3)",
        }}
        animate={{
          scale: currentStep >= 2 && currentStep < 5 ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: currentStep >= 2 && currentStep < 5 ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      >
        <span className="text-xs sm:text-sm font-bold text-white">RECEIVER</span>
        <span className="text-[10px] text-white/80 mt-1">
          {currentStep >= 5 ? "Ready" : currentStep >= 3 ? "Sending ACK" : currentStep >= 2 ? "Received" : "Listening"}
        </span>
      </motion.div>
    </div>
  );
};

