import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedStopAndWaitProps {
  currentStep: number;
  isPlaying: boolean;
}

interface Tooltip {
  x: number;
  y: number;
  content: string;
}

export const EnhancedStopAndWait = ({ currentStep, isPlaying }: EnhancedStopAndWaitProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    // Draw sender with glow
    const senderX = 100;
    const senderY = height / 2;
    
    ctx.shadowColor = "#00F0FF";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(senderX - 40, senderY - 35, 80, 70);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = "#0A0E27";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SENDER", senderX, senderY);
    ctx.font = "10px sans-serif";
    ctx.fillText("Ready", senderX, senderY + 15);

    // Draw receiver with glow
    const receiverX = width - 100;
    const receiverY = height / 2;
    
    ctx.shadowColor = "#00FF88";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00FF88";
    ctx.fillRect(receiverX - 40, receiverY - 35, 80, 70);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = "#0A0E27";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("RECEIVER", receiverX, receiverY);
    ctx.font = "10px sans-serif";
    ctx.fillText("Listening", receiverX, receiverY + 15);

    // Draw connection line with glow
    ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00F0FF";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(senderX + 40, senderY);
    ctx.lineTo(receiverX - 40, receiverY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Animate packet
    const progress = (currentStep % 5) / 4;

    if (currentStep >= 0 && currentStep < 2) {
      const packetProgress = Math.min(progress * 2, 1);
      const packetX = senderX + 40 + (receiverX - senderX - 80) * packetProgress;
      const packetY = senderY - 30;
      
      // Packet glow trail
      const gradient = ctx.createLinearGradient(packetX - 30, packetY, packetX, packetY);
      gradient.addColorStop(0, "rgba(0, 240, 255, 0)");
      gradient.addColorStop(1, "rgba(0, 240, 255, 0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(packetX - 30, packetY - 12, 30, 24);
      
      // Main packet
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#00F0FF";
      ctx.fillRect(packetX - 25, packetY - 12, 50, 24);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#0A0E27";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("Frame 0", packetX, packetY - 2);
      ctx.font = "8px sans-serif";
      ctx.fillText("Seq: 0", packetX, packetY + 8);

      // Packet info for tooltip
      const rect = canvas.getBoundingClientRect();
      const packetScreenX = (packetX / canvas.offsetWidth) * rect.width;
      const packetScreenY = ((packetY + canvas.offsetHeight / 2) / canvas.offsetHeight) * rect.height;
      
      if (Math.abs(mousePos.x - packetScreenX) < 30 && Math.abs(mousePos.y - packetScreenY) < 30) {
        setTooltip({
          x: mousePos.x,
          y: mousePos.y,
          content: "Frame 0 | Seq: 0 | Size: 1024 bytes | Type: DATA"
        });
      }
    }

    if (currentStep >= 3) {
      const ackProgress = Math.min((currentStep - 3) / 1, 1);
      const ackX = receiverX - 40 - (receiverX - senderX - 80) * ackProgress;
      const ackY = senderY + 30;
      
      // ACK trail
      const gradient = ctx.createLinearGradient(ackX, ackY, ackX + 30, ackY);
      gradient.addColorStop(0, "rgba(0, 255, 136, 0)");
      gradient.addColorStop(1, "rgba(0, 255, 136, 0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(ackX, ackY - 12, 30, 24);
      
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#00FF88";
      ctx.fillRect(ackX - 25, ackY - 12, 50, 24);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#0A0E27";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("ACK 0", ackX, ackY - 2);
      ctx.font = "8px sans-serif";
      ctx.fillText("Ack: 1", ackX, ackY + 8);

      const rect = canvas.getBoundingClientRect();
      const ackScreenX = (ackX / canvas.offsetWidth) * rect.width;
      const ackScreenY = ((ackY + canvas.offsetHeight / 2) / canvas.offsetHeight) * rect.height;
      
      if (Math.abs(mousePos.x - ackScreenX) < 30 && Math.abs(mousePos.y - ackScreenY) < 30) {
        setTooltip({
          x: mousePos.x,
          y: mousePos.y,
          content: "ACK 0 | Ack#: 1 | Type: ACKNOWLEDGMENT | Window: 1"
        });
      }
    }

  }, [currentStep, isPlaying, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ width: "100%", height: "300px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-50 bg-card/95 backdrop-blur-xl border border-primary/50 rounded-lg px-3 py-2 text-xs font-mono shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 40,
            }}
          >
            {tooltip.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
