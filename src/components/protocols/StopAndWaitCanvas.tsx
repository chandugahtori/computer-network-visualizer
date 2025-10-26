import { useEffect, useRef } from "react";

interface StopAndWaitCanvasProps {
  currentStep: number;
  isPlaying: boolean;
}

export const StopAndWaitCanvas = ({ currentStep, isPlaying }: StopAndWaitCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw sender
    const senderX = 100;
    const senderY = height / 2;
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(senderX - 40, senderY - 30, 80, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SENDER", senderX, senderY + 5);

    // Draw receiver
    const receiverX = width - 100;
    const receiverY = height / 2;
    ctx.fillStyle = "#00FF88";
    ctx.fillRect(receiverX - 40, receiverY - 30, 80, 60);
    ctx.fillStyle = "#fff";
    ctx.fillText("RECEIVER", receiverX, receiverY + 5);

    // Draw connection line
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(senderX + 40, senderY);
    ctx.lineTo(receiverX - 40, receiverY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Animate based on step
    const progress = currentStep / 4;

    if (currentStep >= 0 && currentStep < 2) {
      // Frame moving from sender to receiver
      const packetX = senderX + 40 + (receiverX - senderX - 80) * Math.min(progress * 2, 1);
      const packetY = senderY - 20;
      
      ctx.fillStyle = "#00F0FF";
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 20;
      ctx.fillRect(packetX - 15, packetY - 10, 30, 20);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.fillText("Frame 0", packetX, packetY + 3);
    }

    if (currentStep >= 3) {
      // ACK moving from receiver to sender
      const ackProgress = Math.min((currentStep - 3) / 1, 1);
      const ackX = receiverX - 40 - (receiverX - senderX - 80) * ackProgress;
      const ackY = senderY + 20;
      
      ctx.fillStyle = "#00FF88";
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 20;
      ctx.fillRect(ackX - 15, ackY - 10, 30, 20);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.fillText("ACK 0", ackX, ackY + 3);
    }

  }, [currentStep, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: "100%", height: "300px" }}
    />
  );
};
