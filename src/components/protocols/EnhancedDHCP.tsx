import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedDHCPProps {
  currentStep: number;
  isPlaying: boolean;
}

interface Tooltip {
  x: number;
  y: number;
  content: string;
}

export const EnhancedDHCP = ({ currentStep, isPlaying }: EnhancedDHCPProps) => {
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

    // Draw client
    const clientX = 100;
    const clientY = height / 2;
    ctx.shadowColor = "#00F0FF";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(clientX - 40, clientY - 30, 80, 60);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0A0E27";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CLIENT", clientX, clientY + 5);

    // Draw DHCP server
    const serverX = width - 100;
    const serverY = height / 2;
    ctx.shadowColor = "#00FF88";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00FF88";
    ctx.fillRect(serverX - 40, serverY - 30, 80, 60);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0A0E27";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("DHCP", serverX, serverY - 5);
    ctx.font = "10px sans-serif";
    ctx.fillText("SERVER", serverX, serverY + 10);

    // Connection line
    ctx.strokeStyle = "rgba(0, 255, 136, 0.3)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00FF88";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(clientX + 40, clientY);
    ctx.lineTo(serverX - 40, serverY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const packetDistance = serverX - clientX - 80;

    const messages = [
      { label: "DISCOVER", color: "#00F0FF", direction: "right", y: -35, info: "Broadcast | Transaction ID: 0x3d1d | Options: Requested IP" },
      { label: "OFFER", color: "#AA00FF", direction: "left", y: -10, info: "Offered IP: 192.168.1.100 | Lease: 86400s | Gateway: 192.168.1.1" },
      { label: "REQUEST", color: "#00F0FF", direction: "right", y: 15, info: "Requesting: 192.168.1.100 | Client ID: MAC" },
      { label: "ACK", color: "#00FF88", direction: "left", y: 40, info: "Confirmed IP: 192.168.1.100 | DNS: 8.8.8.8" },
    ];

    if (currentStep < 4) {
      const msg = messages[currentStep];
      
      let packetX;
      if (msg.direction === "right") {
        packetX = clientX + 40 + packetDistance * 0.5;
      } else {
        packetX = serverX - 40 - packetDistance * 0.5;
      }
      
      const packetY = clientY + msg.y;

      ctx.shadowColor = msg.color;
      ctx.shadowBlur = 25;
      ctx.fillStyle = msg.color;
      ctx.fillRect(packetX - 35, packetY - 12, 70, 24);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = msg.direction === "right" ? "#0A0E27" : "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(msg.label, packetX, packetY + 4);

      const rect = canvas.getBoundingClientRect();
      const packetScreenX = (packetX / canvas.offsetWidth) * rect.width;
      const packetScreenY = (packetY / canvas.offsetHeight) * rect.height;
      
      if (Math.abs(mousePos.x - packetScreenX) < 40 && Math.abs(mousePos.y - packetScreenY) < 20) {
        setTooltip({
          x: mousePos.x,
          y: mousePos.y,
          content: msg.info
        });
      }
    }

    // Show assigned IP
    if (currentStep >= 3) {
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#00FF88";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("✓ IP: 192.168.1.100", clientX, clientY + 60);
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
