import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedDNSProps {
  currentStep: number;
  isPlaying: boolean;
}

interface Tooltip {
  x: number;
  y: number;
  content: string;
}

export const EnhancedDNS = ({ currentStep, isPlaying }: EnhancedDNSProps) => {
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
    const boxWidth = Math.min(70, width * 0.11);
    const boxHeight = Math.min(50, height * 0.17);
    const margin = Math.min(50, width * 0.07);

    // Draw client
    const clientX = margin + boxWidth / 2;
    const clientY = height / 2;
    ctx.shadowColor = "#00F0FF";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(clientX - boxWidth / 2, clientY - boxHeight / 2, boxWidth, boxHeight);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0A0E27";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Client", clientX, clientY + 5);

    // Draw DNS servers
    const servers = [
      { x: width * 0.4, y: height * 0.35, label: "Resolver", color: "#AA00FF" },
      { x: width * 0.6, y: height * 0.5, label: "Root", color: "#FF00AA" },
      { x: width * 0.8, y: height * 0.65, label: "TLD", color: "#00FF88" },
    ];

    servers.forEach((server) => {
      ctx.shadowColor = server.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = server.color;
      ctx.fillRect(server.x - boxWidth / 2, server.y - boxHeight / 2, boxWidth, boxHeight);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(server.label, server.x, server.y + 4);
    });

    // Animate query flow
    const queries = [
      { from: { x: clientX, y: clientY }, to: servers[0], step: 0, label: "example.com?", info: "Query Type: A | Recursion: True" },
      { from: servers[0], to: servers[1], step: 1, label: "Root NS", info: "Asking for .com nameserver" },
      { from: servers[1], to: servers[2], step: 2, label: ".com NS", info: "Delegated to TLD server" },
      { from: servers[2], to: servers[0], step: 3, label: "93.184.216.34", info: "Authoritative answer" },
      { from: servers[0], to: { x: clientX, y: clientY }, step: 4, label: "Response", info: "TTL: 3600s | IP: 93.184.216.34" },
    ];

    if (currentStep < 5) {
      const query = queries[currentStep];
      const packetX = query.from.x + (query.to.x - query.from.x) * 0.5;
      const packetY = query.from.y + (query.to.y - query.from.y) * 0.5;

      // Draw connection line
      ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(query.from.x, query.from.y);
      ctx.lineTo(query.to.x, query.to.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw packet
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#00F0FF";
      ctx.beginPath();
      ctx.arc(packetX, packetY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#0A0E27";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText(query.label, packetX, packetY + 25);

      const rect = canvas.getBoundingClientRect();
      const packetScreenX = (packetX / canvas.offsetWidth) * rect.width;
      const packetScreenY = (packetY / canvas.offsetHeight) * rect.height;
      
      if (Math.abs(mousePos.x - packetScreenX) < 20 && Math.abs(mousePos.y - packetScreenY) < 20) {
        setTooltip({
          x: mousePos.x,
          y: mousePos.y,
          content: query.info
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
