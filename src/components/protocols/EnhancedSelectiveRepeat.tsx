import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedSelectiveRepeat = ({ currentStep, isPlaying }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sender
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(50, 150, 100, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sender", 100, 210);

    // Draw receiver with buffer
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(650, 150, 100, 100);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.fillText("Receiver", 700, 210);

    // Draw receiver buffer
    for (let i = 0; i < 4; i++) {
      const x = 620;
      const y = 50 + i * 60;
      ctx.strokeStyle = "hsl(150 100% 50% / 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 40, 40);
      
      if (currentStep > i && i !== 2) {
        ctx.fillStyle = "hsl(150 100% 50% / 0.3)";
        ctx.fillRect(x, y, 40, 40);
        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.fillText(`F${i}`, x + 20, y + 25);
      }
    }

    // Animation
    const frames = [
      { id: 0, color: "hsl(192 100% 50%)", status: "sent" },
      { id: 1, color: "hsl(192 100% 50%)", status: "sent" },
      { id: 2, color: "hsl(0 85% 60%)", status: "lost" },
      { id: 3, color: "hsl(192 100% 50%)", status: "sent" },
    ];

    if (currentStep < 4) {
      const frame = frames[currentStep];
      const progress = 0.6;
      const frameX = 150 + (450 * progress);
      const frameY = 180;

      ctx.fillStyle = frame.color;
      ctx.beginPath();
      ctx.arc(frameX, frameY, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`${frame.id}`, frameX, frameY + 5);

      if (frame.status === "lost" && currentStep === 2) {
        ctx.strokeStyle = "hsl(0 85% 60%)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(frameX - 15, frameY - 15);
        ctx.lineTo(frameX + 15, frameY + 15);
        ctx.moveTo(frameX + 15, frameY - 15);
        ctx.lineTo(frameX - 15, frameY + 15);
        ctx.stroke();
      }

      ctx.shadowBlur = 20;
      ctx.shadowColor = frame.color;
      ctx.beginPath();
      ctx.arc(frameX, frameY, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (currentStep === 4) {
      // NAK for frame 2
      const nakX = 600;
      const nakY = 220;
      ctx.fillStyle = "hsl(0 85% 60%)";
      ctx.beginPath();
      ctx.arc(nakX, nakY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("NAK2", nakX, nakY + 4);
    } else if (currentStep === 5) {
      // Retransmit frame 2
      const frameX = 350;
      const frameY = 180;
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.beginPath();
      ctx.arc(frameX, frameY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("2", frameX, frameY + 5);
      ctx.font = "10px sans-serif";
      ctx.fillText("Retransmit", frameX, frameY + 35);
    }

    // Draw arrow
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 200);
    ctx.lineTo(650, 200);
    ctx.stroke();

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