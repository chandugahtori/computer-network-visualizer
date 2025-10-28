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

    canvas.width = 800;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw client
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(50, 150, 100, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Client", 100, 210);

    // Draw server
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(650, 150, 100, 100);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.fillText("Server", 700, 210);

    // Multiple packets flying
    const packets = [
      { id: 1, y: 160, progress: currentStep >= 0 ? 0.3 : 0 },
      { id: 2, y: 190, progress: currentStep >= 1 ? 0.5 : 0 },
      { id: 3, y: 220, progress: currentStep >= 2 ? 0.7 : 0 },
      { id: 4, y: 250, progress: currentStep >= 3 ? 0.9 : 0 },
    ];

    packets.forEach((packet) => {
      if (packet.progress > 0) {
        const x = 150 + (500 * packet.progress);
        
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
      ctx.fillText("No ACK - Fire and Forget", 400, 320);
    }

    // Connection-less label
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Connectionless", 400, 50);

    // Draw dashed arrow
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(150, 200);
    ctx.lineTo(650, 200);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(650, 200);
    ctx.lineTo(640, 195);
    ctx.lineTo(640, 205);
    ctx.closePath();
    ctx.fillStyle = "hsl(225 10% 65%)";
    ctx.fill();

  }, [currentStep, isPlaying]);

  return <canvas ref={canvasRef} className="w-full h-auto" />;
};