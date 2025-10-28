import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedARP = ({ currentStep, isPlaying }: Props) => {
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

    // Draw Host A
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(50, height * 0.4, 100, 80);
    ctx.fillStyle = "white";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Host A", 100, height * 0.4 + 40);
    ctx.font = "10px sans-serif";
    ctx.fillText("192.168.1.10", 100, height * 0.4 + 60);

    // Draw Host B
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(width - 150, height * 0.4, 100, 80);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("Host B", width - 100, height * 0.4 + 40);
    ctx.font = "10px sans-serif";
    ctx.fillText("192.168.1.20", width - 100, height * 0.4 + 60);

    // Step 0: ARP Request broadcast
    const centerY = height * 0.4 + 40;
    if (currentStep === 0) {
      const reqX = width / 2 - 100;
      const reqY = centerY - 20;
      
      ctx.fillStyle = "hsl(39 100% 50%)";
      ctx.beginPath();
      ctx.arc(reqX, reqY, 25, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("ARP", reqX, reqY - 5);
      ctx.fillText("Request", reqX, reqY + 8);
      
      // Broadcast waves
      for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = `hsl(39 100% 50% / ${0.5 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(reqX, reqY, 25 + i * 15, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Step 1: Question shown
    if (currentStep === 1) {
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.font = "italic 13px sans-serif";
      ctx.fillText("Who has 192.168.1.20?", width / 2, 40);
      ctx.fillText("Tell 192.168.1.10", width / 2, 60);
    }

    // Step 2: ARP Reply
    if (currentStep === 2) {
      const replyX = width / 2 + 100;
      const replyY = centerY + 20;
      
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.beginPath();
      ctx.arc(replyX, replyY, 25, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "hsl(225 30% 10%)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("ARP", replyX, replyY - 5);
      ctx.fillText("Reply", replyX, replyY + 8);

      ctx.shadowBlur = 20;
      ctx.shadowColor = "hsl(150 100% 50%)";
      ctx.beginPath();
      ctx.arc(replyX, replyY, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Step 3: MAC address shown
    if (currentStep === 3) {
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.font = "italic 13px sans-serif";
      ctx.fillText("192.168.1.20 is at", width / 2, height - 60);
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("AA:BB:CC:DD:EE:FF", width / 2, height - 40);
    }

    // Step 4: Cache updated
    if (currentStep === 4) {
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("✓ ARP Cache Updated", width / 2, height - 20);
      
      // Cache table
      ctx.strokeStyle = "hsl(270 80% 60%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 20, 100, 60);
      ctx.fillStyle = "hsl(270 80% 60% / 0.2)";
      ctx.fillRect(50, 20, 100, 60);
      ctx.fillStyle = "white";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("192.168.1.20", 55, 40);
      ctx.fillText("AA:BB:CC:DD", 55, 55);
      ctx.fillText(":EE:FF", 55, 70);
    }

    // Draw network line
    ctx.textAlign = "center";
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, centerY);
    ctx.lineTo(width - 150, centerY);
    ctx.stroke();

  }, [currentStep, isPlaying]);

  return <canvas ref={canvasRef} className="w-full" style={{ height: "300px" }} />;
};