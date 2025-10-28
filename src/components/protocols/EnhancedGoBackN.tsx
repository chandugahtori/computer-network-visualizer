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

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = 300 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Dynamic positioning
    const senderX = width * 0.15;
    const receiverX = width * 0.85;
    const centerY = height / 2;
    const boxSize = Math.min(80, width * 0.1);

    // Draw sender
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(senderX - boxSize / 2, centerY - boxSize / 2, boxSize, boxSize);
    ctx.fillStyle = "white";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sender", senderX, centerY + 5);

    // Draw receiver
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(receiverX - boxSize / 2, centerY - boxSize / 2, boxSize, boxSize);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.fillText("Receiver", receiverX, centerY + 5);

    // Draw window
    const windowSize = 4;
    const windowStartX = width * 0.3;
    const frameSize = Math.min(45, width * 0.08);
    const frameGap = Math.min(10, width * 0.02);
    
    for (let i = 0; i < windowSize; i++) {
      const x = windowStartX + i * (frameSize + frameGap);
      const y = 40;
      
      if (i <= currentStep && currentStep < windowSize) {
        ctx.fillStyle = "hsl(192 100% 50% / 0.3)";
        ctx.fillRect(x, y, frameSize, frameSize);
        ctx.strokeStyle = "hsl(192 100% 50%)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, frameSize, frameSize);
        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`F${i}`, x + frameSize / 2, y + frameSize / 2 + 4);
      } else {
        ctx.strokeStyle = "hsl(192 100% 50% / 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, frameSize, frameSize);
        ctx.fillStyle = "hsl(192 100% 50% / 0.5)";
        ctx.fillText(`F${i}`, x + frameSize / 2, y + frameSize / 2 + 4);
      }
    }

    // Animation based on step
    const packetRadius = Math.min(15, width * 0.025);
    if (currentStep < windowSize) {
      // Send frames
      const progress = (currentStep + 1) * 0.25;
      const frameX = senderX + boxSize / 2 + ((receiverX - senderX - boxSize) * progress);
      const frameY = centerY;
      
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.beginPath();
      ctx.arc(frameX, frameY, packetRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "white";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(`${currentStep}`, frameX, frameY + 4);
      
      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = "hsl(192 100% 50%)";
      ctx.beginPath();
      ctx.arc(frameX, frameY, packetRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (currentStep === windowSize) {
      // Frame lost (Frame 2)
      const midX = (senderX + receiverX) / 2;
      ctx.fillStyle = "hsl(0 85% 60%)";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Frame 2 Lost!", midX, centerY - 20);
      
      // Red X
      ctx.strokeStyle = "hsl(0 85% 60%)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(midX - 15, centerY);
      ctx.lineTo(midX + 15, centerY + 30);
      ctx.moveTo(midX + 15, centerY);
      ctx.lineTo(midX - 15, centerY + 30);
      ctx.stroke();
    } else if (currentStep > windowSize) {
      // Retransmit from Frame 2
      const retransmitFrame = currentStep - windowSize - 1;
      if (retransmitFrame >= 0) {
        const progress = 0.5;
        const frameX = senderX + boxSize / 2 + ((receiverX - senderX - boxSize) * progress);
        const frameY = centerY;
        
        ctx.fillStyle = "hsl(270 80% 60%)";
        ctx.beginPath();
        ctx.arc(frameX, frameY, packetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(`${2 + retransmitFrame}`, frameX, frameY + 4);
        
        ctx.fillStyle = "hsl(270 80% 60%)";
        ctx.font = "11px sans-serif";
        ctx.fillText("Retransmit", frameX, frameY + 30);
      }
    }

    // Draw arrow
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(senderX + boxSize / 2, centerY);
    ctx.lineTo(receiverX - boxSize / 2, centerY);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(receiverX - boxSize / 2, centerY);
    ctx.lineTo(receiverX - boxSize / 2 - 10, centerY - 5);
    ctx.lineTo(receiverX - boxSize / 2 - 10, centerY + 5);
    ctx.closePath();
    ctx.fillStyle = "hsl(225 10% 65%)";
    ctx.fill();

  }, [currentStep, isPlaying]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full" style={{ height: "300px" }} />
      <div
        ref={tooltipRef}
        className="absolute hidden bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-lg pointer-events-none"
      >
        <p className="text-sm font-semibold">Packet Info</p>
      </div>
    </div>
  );
};