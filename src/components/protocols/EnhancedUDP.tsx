import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedUDP = ({ currentStep, isPlaying }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = 300 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = 300;

    ctx.clearRect(0, 0, width, height);

    // Draw client
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(50, height * 0.4, 100, 80);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Client", 100, height * 0.4 + 45);

    // Draw server
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(width - 150, height * 0.4, 100, 80);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.fillText("Server", width - 100, height * 0.4 + 45);

    // Multiple packets flying
    const centerY = height * 0.4 + 40;
    const packets = [
      { id: 1, y: centerY - 30, progress: currentStep >= 0 ? 0.3 : 0 },
      { id: 2, y: centerY - 10, progress: currentStep >= 1 ? 0.5 : 0 },
      { id: 3, y: centerY + 10, progress: currentStep >= 2 ? 0.7 : 0 },
      { id: 4, y: centerY + 30, progress: currentStep >= 3 ? 0.9 : 0 },
    ];

    packets.forEach((packet) => {
      if (packet.progress > 0) {
        const x = 150 + ((width - 300) * packet.progress);
        
        // Packet
        ctx.fillStyle = "hsl(39 100% 50%)";
        ctx.beginPath();
        ctx.arc(x, packet.y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`${packet.id}`, x, packet.y + 4);

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "hsl(39 100% 50%)";
        ctx.beginPath();
        ctx.arc(x, packet.y, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Speed lines
        ctx.strokeStyle = "hsl(39 100% 50% / 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 30, packet.y);
        ctx.lineTo(x - 20, packet.y);
        ctx.stroke();
      }
    });

    // No acknowledgment indication
    if (currentStep >= 2) {
      ctx.fillStyle = "hsl(225 10% 65%)";
      ctx.font = "italic 14px sans-serif";
      ctx.fillText("No ACK - Fire and Forget", width / 2, height - 30);
    }

    // Connection-less label
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Connectionless", width / 2, 30);

    // Draw dashed arrow
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(150, centerY);
    ctx.lineTo(width - 150, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(width - 150, centerY);
    ctx.lineTo(width - 160, centerY - 5);
    ctx.lineTo(width - 160, centerY + 5);
    ctx.closePath();
    ctx.fillStyle = "hsl(225 10% 65%)";
    ctx.fill();

  }, [currentStep, isPlaying]);

  return <canvas ref={canvasRef} className="w-full" style={{ height: "300px" }} />;
};