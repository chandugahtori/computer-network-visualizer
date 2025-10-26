import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedICMP = ({ currentStep, isPlaying }: Props) => {
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

    // Draw source
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(50, 150, 100, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Source", 100, 200);
    ctx.font = "10px sans-serif";
    ctx.fillText("10.0.0.1", 100, 220);

    // Draw destination
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(650, 150, 100, 100);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Destination", 700, 200);
    ctx.font = "10px sans-serif";
    ctx.fillText("10.0.0.100", 700, 220);

    // Step 0-1: Echo Request (Ping)
    if (currentStep <= 1) {
      const progress = currentStep === 0 ? 0.3 : 0.7;
      const reqX = 150 + (500 * progress);
      const reqY = 180;
      
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.beginPath();
      ctx.arc(reqX, reqY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Echo", reqX, reqY - 3);
      ctx.fillText("Request", reqX, reqY + 10);

      // Ping waves
      for (let i = 1; i <= 2; i++) {
        ctx.strokeStyle = `hsl(192 100% 50% / ${0.4 - i * 0.15})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(reqX, reqY, 20 + i * 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.shadowBlur = 20;
      ctx.shadowColor = "hsl(192 100% 50%)";
      ctx.beginPath();
      ctx.arc(reqX, reqY, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Step 2-3: Echo Reply
    if (currentStep >= 2) {
      const progress = currentStep === 2 ? 0.7 : 0.3;
      const replyX = 650 - (500 * progress);
      const replyY = 220;
      
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.beginPath();
      ctx.arc(replyX, replyY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "hsl(225 30% 10%)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Echo", replyX, replyY - 3);
      ctx.fillText("Reply", replyX, replyY + 10);

      ctx.shadowBlur = 20;
      ctx.shadowColor = "hsl(150 100% 50%)";
      ctx.beginPath();
      ctx.arc(replyX, replyY, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Step 4: RTT display
    if (currentStep === 4) {
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("✓ Host is Reachable", 400, 100);
      ctx.font = "14px sans-serif";
      ctx.fillText("RTT: 12ms", 400, 330);
      
      // Success checkmark
      ctx.strokeStyle = "hsl(150 100% 50%)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(380, 120);
      ctx.lineTo(395, 135);
      ctx.lineTo(420, 110);
      ctx.stroke();
    }

    // Draw bidirectional arrows
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 190);
    ctx.lineTo(650, 190);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(150, 210);
    ctx.lineTo(650, 210);
    ctx.stroke();

    // Arrow heads
    ctx.beginPath();
    ctx.moveTo(650, 190);
    ctx.lineTo(640, 185);
    ctx.lineTo(640, 195);
    ctx.closePath();
    ctx.fillStyle = "hsl(225 10% 65%)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(150, 210);
    ctx.lineTo(160, 205);
    ctx.lineTo(160, 215);
    ctx.closePath();
    ctx.fill();

  }, [currentStep, isPlaying]);

  return <canvas ref={canvasRef} className="w-full" style={{ height: "300px" }} />;
};