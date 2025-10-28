import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedTCPHandshakeProps {
  currentStep: number;
  isPlaying: boolean;
}

interface Tooltip {
  x: number;
  y: number;
  content: string;
}

export const EnhancedTCPHandshake = ({ currentStep, isPlaying }: EnhancedTCPHandshakeProps) => {
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

    // Responsive sizing
    const boxWidth = Math.min(90, width * 0.13);
    const boxHeight = Math.min(70, height * 0.23);
    const margin = Math.min(60, width * 0.08);

    // Draw client
    const clientX = margin + boxWidth / 2;
    const clientY = height / 2;
    
    ctx.shadowColor = "#00F0FF";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(clientX - boxWidth / 2, clientY - boxHeight / 2, boxWidth, boxHeight);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = "#0A0E27";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CLIENT", clientX, clientY);
    ctx.font = "9px sans-serif";
    ctx.fillText("192.168.1.100", clientX, clientY + 15);

    // Draw server
    const serverX = width - margin - boxWidth / 2;
    const serverY = height / 2;
    
    ctx.shadowColor = "#AA00FF";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#AA00FF";
    ctx.fillRect(serverX - boxWidth / 2, serverY - boxHeight / 2, boxWidth, boxHeight);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("SERVER", serverX, serverY);
    ctx.font = "9px sans-serif";
    ctx.fillText("203.0.113.42:80", serverX, serverY + 15);

    // Connection line
    ctx.strokeStyle = "rgba(170, 0, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#AA00FF";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(clientX + boxWidth / 2, clientY);
    ctx.lineTo(serverX - boxWidth / 2, serverY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const packetDistance = serverX - clientX - boxWidth;
    const packetYOffset = height * 0.13;

    // SYN
    if (currentStep === 0) {
      const synX = clientX + boxWidth / 2 + packetDistance * 0.5;
      const synY = clientY - packetYOffset;
      
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#00F0FF";
      ctx.fillRect(synX - 30, synY - 15, 60, 30);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#0A0E27";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("SYN", synX, synY - 3);
      ctx.font = "8px sans-serif";
      ctx.fillText("Seq: 1000", synX, synY + 8);

      const rect = canvas.getBoundingClientRect();
      const packetScreenX = (synX / canvas.offsetWidth) * rect.width;
      const packetScreenY = ((synY + canvas.offsetHeight / 2) / canvas.offsetHeight) * rect.height;
      
      if (Math.abs(mousePos.x - packetScreenX) < 35 && Math.abs(mousePos.y - packetScreenY) < 20) {
        setTooltip({
          x: mousePos.x,
          y: mousePos.y,
          content: "SYN | Seq: 1000 | Flags: SYN | Window: 65535 | Port: 443"
        });
      }
    }

    // SYN-ACK
    if (currentStep === 1) {
      const synAckX = serverX - boxWidth / 2 - packetDistance * 0.5;
      const synAckY = clientY;
      
      ctx.shadowColor = "#AA00FF";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#AA00FF";
      ctx.fillRect(synAckX - 35, synAckY - 15, 70, 30);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("SYN-ACK", synAckX, synAckY - 3);
      ctx.font = "8px sans-serif";
      ctx.fillText("Seq: 2000", synAckX, synAckY + 8);

      const rect = canvas.getBoundingClientRect();
      const packetScreenX = (synAckX / canvas.offsetWidth) * rect.width;
      const packetScreenY = ((synAckY + canvas.offsetHeight / 2) / canvas.offsetHeight) * rect.height;
      
      if (Math.abs(mousePos.x - packetScreenX) < 40 && Math.abs(mousePos.y - packetScreenY) < 20) {
        setTooltip({
          x: mousePos.x,
          y: mousePos.y,
          content: "SYN-ACK | Seq: 2000 | Ack: 1001 | Flags: SYN+ACK | Window: 32768"
        });
      }
    }

    // ACK
    if (currentStep === 2) {
      const ackX = clientX + boxWidth / 2 + packetDistance * 0.5;
      const ackY = clientY + packetYOffset;
      
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#00FF88";
      ctx.fillRect(ackX - 30, ackY - 15, 60, 30);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#0A0E27";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("ACK", ackX, ackY - 3);
      ctx.font = "8px sans-serif";
      ctx.fillText("Ack: 2001", ackX, ackY + 8);

      const rect = canvas.getBoundingClientRect();
      const packetScreenX = (ackX / canvas.offsetWidth) * rect.width;
      const packetScreenY = ((ackY + canvas.offsetHeight / 2) / canvas.offsetHeight) * rect.height;
      
      if (Math.abs(mousePos.x - packetScreenX) < 35 && Math.abs(mousePos.y - packetScreenY) < 20) {
        setTooltip({
          x: mousePos.x,
          y: mousePos.y,
          content: "ACK | Ack: 2001 | Flags: ACK | Window: 65535 | State: ESTABLISHED"
        });
      }
    }

    // Connected
    if (currentStep >= 3) {
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#00FF88";
      ctx.font = "18px bold sans-serif";
      ctx.fillText("✓ CONNECTION ESTABLISHED", width / 2, height - 30);
      ctx.shadowBlur = 0;
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
