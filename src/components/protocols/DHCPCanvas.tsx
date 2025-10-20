import { useEffect, useRef } from "react";

interface DHCPCanvasProps {
  currentStep: number;
  isPlaying: boolean;
}

export const DHCPCanvas = ({ currentStep, isPlaying }: DHCPCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(clientX - 40, clientY - 30, 80, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CLIENT", clientX, clientY + 5);

    // Draw DHCP server
    const serverX = width - 100;
    const serverY = height / 2;
    ctx.fillStyle = "#00FF88";
    ctx.fillRect(serverX - 40, serverY - 30, 80, 60);
    ctx.fillStyle = "#fff";
    ctx.fillText("DHCP", serverX, serverY - 5);
    ctx.font = "10px sans-serif";
    ctx.fillText("SERVER", serverX, serverY + 10);

    // Connection line
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(clientX + 40, clientY);
    ctx.lineTo(serverX - 40, serverY);
    ctx.stroke();
    ctx.setLineDash([]);

    const packetDistance = serverX - clientX - 80;

    const messages = [
      { label: "DISCOVER", color: "#00F0FF", direction: "right", y: -35 },
      { label: "OFFER", color: "#AA00FF", direction: "left", y: -10 },
      { label: "REQUEST", color: "#00F0FF", direction: "right", y: 15 },
      { label: "ACK", color: "#00FF88", direction: "left", y: 40 },
    ];

    if (currentStep < 4) {
      const msg = messages[currentStep];
      const progress = 0.5;
      
      let packetX;
      if (msg.direction === "right") {
        packetX = clientX + 40 + packetDistance * progress;
      } else {
        packetX = serverX - 40 - packetDistance * progress;
      }
      
      const packetY = clientY + msg.y;

      ctx.fillStyle = msg.color;
      ctx.shadowColor = msg.color;
      ctx.shadowBlur = 20;
      ctx.fillRect(packetX - 30, packetY - 10, 60, 20);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#fff";
      ctx.font = "10px bold sans-serif";
      ctx.fillText(msg.label, packetX, packetY + 4);
    }

    // Show assigned IP
    if (currentStep >= 3) {
      ctx.fillStyle = "#00FF88";
      ctx.font = "14px bold sans-serif";
      ctx.fillText("IP: 192.168.1.100", clientX, clientY + 60);
    }

  }, [currentStep, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: "100%", height: "400px" }}
    />
  );
};
