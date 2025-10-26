import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedGoBackN = ({ currentStep, isPlaying }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sender
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(50, 150, 100, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sender", 100, 210);

    // Draw receiver
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(650, 150, 100, 100);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.fillText("Receiver", 700, 210);

    // Draw window
    const windowSize = 4;
    for (let i = 0; i < windowSize; i++) {
      const x = 180 + i * 60;
      const y = 50;
      
      if (i <= currentStep && currentStep < windowSize) {
        ctx.fillStyle = "hsl(192 100% 50% / 0.3)";
        ctx.fillRect(x, y, 50, 50);
        ctx.strokeStyle = "hsl(192 100% 50%)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 50, 50);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`F${i}`, x + 25, y + 30);
      } else {
        ctx.strokeStyle = "hsl(192 100% 50% / 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, 50, 50);
        ctx.fillStyle = "hsl(192 100% 50% / 0.5)";
        ctx.fillText(`F${i}`, x + 25, y + 30);
      }
    }

    // Animation based on step
    if (currentStep < windowSize) {
      // Send frames
      const progress = (currentStep + 1) * 0.25;
      for (let i = 0; i <= currentStep; i++) {
        const frameX = 150 + (500 * progress);
        const frameY = 180;
        
        ctx.fillStyle = "hsl(192 100% 50%)";
        ctx.beginPath();
        ctx.arc(frameX, frameY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`${i}`, frameX, frameY + 4);
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = "hsl(192 100% 50%)";
        ctx.beginPath();
        ctx.arc(frameX, frameY, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    } else if (currentStep === windowSize) {
      // Frame lost (Frame 2)
      ctx.fillStyle = "hsl(0 85% 60%)";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Frame 2 Lost!", 400, 180);
      
      // Red X
      ctx.strokeStyle = "hsl(0 85% 60%)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(380, 200);
      ctx.lineTo(420, 240);
      ctx.moveTo(420, 200);
      ctx.lineTo(380, 240);
      ctx.stroke();
    } else if (currentStep > windowSize) {
      // Retransmit from Frame 2
      const retransmitFrame = currentStep - windowSize - 1;
      if (retransmitFrame >= 0) {
        const frameX = 150 + (retransmitFrame * 100);
        const frameY = 180;
        
        ctx.fillStyle = "hsl(270 80% 60%)";
        ctx.beginPath();
        ctx.arc(frameX, frameY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`${2 + retransmitFrame}`, frameX, frameY + 4);
        
        ctx.fillStyle = "hsl(270 80% 60%)";
        ctx.font = "12px sans-serif";
        ctx.fillText("Retransmit", frameX, frameY + 35);
      }
    }

    // Draw arrow
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 200);
    ctx.lineTo(650, 200);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(650, 200);
    ctx.lineTo(640, 195);
    ctx.lineTo(640, 205);
    ctx.closePath();
    ctx.fillStyle = "hsl(225 10% 65%)";
    ctx.fill();

  }, [currentStep, isPlaying]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-auto" />
      <div
        ref={tooltipRef}
        className="absolute hidden bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-lg pointer-events-none"
      >
        <p className="text-sm font-semibold">Packet Info</p>
      </div>
    </div>
  );
};