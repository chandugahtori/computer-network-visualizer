import { useEffect, useRef } from "react";

interface TCPHandshakeCanvasProps {
  currentStep: number;
  isPlaying: boolean;
}

export const TCPHandshakeCanvas = ({ currentStep, isPlaying }: TCPHandshakeCanvasProps) => {
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

    // Draw server
    const serverX = width - 100;
    const serverY = height / 2;
    ctx.fillStyle = "#AA00FF";
    ctx.fillRect(serverX - 40, serverY - 30, 80, 60);
    ctx.fillStyle = "#fff";
    ctx.fillText("SERVER", serverX, serverY + 5);

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

    // Step 0: SYN
    if (currentStep >= 0 && currentStep < 1) {
      const synX = clientX + 40 + packetDistance * Math.min((currentStep + 0.5), 1);
      const synY = clientY - 30;
      
      ctx.fillStyle = "#00F0FF";
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 20;
      ctx.fillRect(synX - 20, synY - 10, 40, 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.fillText("SYN", synX, synY + 3);
    }

    // Step 1: SYN-ACK
    if (currentStep >= 1 && currentStep < 2) {
      const synAckX = serverX - 40 - packetDistance * Math.min((currentStep - 1 + 0.5), 1);
      const synAckY = clientY;
      
      ctx.fillStyle = "#AA00FF";
      ctx.shadowColor = "#AA00FF";
      ctx.shadowBlur = 20;
      ctx.fillRect(synAckX - 25, synAckY - 10, 50, 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.fillText("SYN-ACK", synAckX, synAckY + 3);
    }

    // Step 2: ACK
    if (currentStep >= 2 && currentStep < 3) {
      const ackX = clientX + 40 + packetDistance * Math.min((currentStep - 2 + 0.5), 1);
      const ackY = clientY + 30;
      
      ctx.fillStyle = "#00FF88";
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 20;
      ctx.fillRect(ackX - 20, ackY - 10, 40, 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.fillText("ACK", ackX, ackY + 3);
    }

    // Step 3: Connected
    if (currentStep >= 3) {
      ctx.fillStyle = "#00FF88";
      ctx.font = "16px bold sans-serif";
      ctx.fillText("✓ Connected", width / 2, height - 30);
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
