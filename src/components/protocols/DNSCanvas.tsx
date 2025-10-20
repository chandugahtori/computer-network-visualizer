import { useEffect, useRef } from "react";

interface DNSCanvasProps {
  currentStep: number;
  isPlaying: boolean;
}

export const DNSCanvas = ({ currentStep, isPlaying }: DNSCanvasProps) => {
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
    const clientX = 80;
    const clientY = height / 2;
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(clientX - 35, clientY - 25, 70, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Client", clientX, clientY + 5);

    // Draw DNS servers
    const servers = [
      { x: width * 0.4, y: height * 0.3, label: "Resolver", color: "#AA00FF" },
      { x: width * 0.6, y: height * 0.5, label: "Root", color: "#FF00AA" },
      { x: width * 0.8, y: height * 0.7, label: "TLD", color: "#00FF88" },
    ];

    servers.forEach((server) => {
      ctx.fillStyle = server.color;
      ctx.fillRect(server.x - 35, server.y - 25, 70, 50);
      ctx.fillStyle = "#fff";
      ctx.font = "12px sans-serif";
      ctx.fillText(server.label, server.x, server.y + 5);
    });

    // Animate query flow
    if (currentStep >= 0 && currentStep < 5) {
      const queries = [
        { from: { x: clientX, y: clientY }, to: servers[0], step: 0, label: "query" },
        { from: servers[0], to: servers[1], step: 1, label: "lookup" },
        { from: servers[1], to: servers[2], step: 2, label: "TLD" },
        { from: servers[2], to: servers[0], step: 3, label: "IP" },
        { from: servers[0], to: { x: clientX, y: clientY }, step: 4, label: "response" },
      ];

      queries.forEach((query) => {
        if (currentStep === query.step) {
          const progress = 0.5;
          const packetX = query.from.x + (query.to.x - query.from.x) * progress;
          const packetY = query.from.y + (query.to.y - query.from.y) * progress;

          ctx.fillStyle = "#00F0FF";
          ctx.shadowColor = "#00F0FF";
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(packetX, packetY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = "#fff";
          ctx.font = "10px sans-serif";
          ctx.fillText(query.label, packetX, packetY - 15);
        }
      });
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
