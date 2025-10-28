import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedFTP = ({ currentStep, isPlaying }: Props) => {
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
    ctx.fillRect(50, 150, 100, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FTP Client", 100, 210);

    // Draw server
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(650, 150, 100, 100);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.fillText("FTP Server", 700, 210);

    // Control channel (Port 21)
    ctx.strokeStyle = "hsl(270 80% 60%)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 180);
    ctx.lineTo(650, 180);
    ctx.stroke();
    
    ctx.fillStyle = "hsl(270 80% 60%)";
    ctx.font = "12px sans-serif";
    ctx.fillText("Control (Port 21)", 400, 170);

    // Data channel (Port 20)
    ctx.strokeStyle = "hsl(192 100% 50%)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 220);
    ctx.lineTo(650, 220);
    ctx.stroke();
    
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillText("Data (Port 20)", 400, 240);

    // Step 0: Connection
    if (currentStep === 0) {
      const x = 300;
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.beginPath();
      ctx.arc(x, 180, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "10px sans-serif";
      ctx.fillText("CONN", x, 183);
    }

    // Step 1: Authentication
    if (currentStep === 1) {
      const x = 450;
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.beginPath();
      ctx.arc(x, 180, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "10px sans-serif";
      ctx.fillText("AUTH", x, 183);
      
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "11px sans-serif";
      ctx.fillText("USER & PASS", 400, 130);
    }

    // Step 2: Command
    if (currentStep === 2) {
      const x = 500;
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.beginPath();
      ctx.arc(x, 180, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "9px sans-serif";
      ctx.fillText("RETR", x, 183);
      
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "12px sans-serif";
      ctx.fillText("RETR file.txt", 400, 130);
    }

    // Step 3: Data transfer
    if (currentStep === 3) {
      // File chunks
      for (let i = 0; i < 4; i++) {
        const x = 200 + i * 100;
        ctx.fillStyle = "hsl(192 100% 50%)";
        ctx.fillRect(x, 210, 30, 20);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, 210, 30, 20);
        ctx.fillStyle = "white";
        ctx.font = "10px sans-serif";
        ctx.fillText(`${i+1}`, x + 15, 223);
      }
      
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Transferring file.txt...", 400, 280);
    }

    // Step 4: Complete
    if (currentStep === 4) {
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("✓ Transfer Complete", 400, 100);
      
      // File icon at client
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.fillRect(80, 110, 40, 50);
      ctx.fillStyle = "white";
      ctx.font = "10px sans-serif";
      ctx.fillText("file.txt", 100, 135);
    }

    // Arrow heads
    ctx.beginPath();
    ctx.moveTo(650, 180);
    ctx.lineTo(640, 175);
    ctx.lineTo(640, 185);
    ctx.closePath();
    ctx.fillStyle = "hsl(270 80% 60%)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(650, 220);
    ctx.lineTo(640, 215);
    ctx.lineTo(640, 225);
    ctx.closePath();
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fill();

  }, [currentStep, isPlaying]);

  return <canvas ref={canvasRef} className="w-full" style={{ height: "300px" }} />;
};