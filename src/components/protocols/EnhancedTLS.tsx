import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedTLS = ({ currentStep, isPlaying }: Props) => {
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

    // Step 0: Client Hello
    if (currentStep === 0) {
      const x = 250;
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.fillRect(x - 40, 175, 80, 30);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 40, 175, 80, 30);
      
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Client", x, 195);
      ctx.fillText("Hello", x, 208);

      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.font = "10px sans-serif";
      ctx.fillText("Cipher Suites, Random", 250, 240);
    }

    // Step 1: Server Hello + Certificate
    if (currentStep === 1) {
      const x = 550;
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.fillRect(x - 40, 175, 80, 30);
      ctx.strokeStyle = "hsl(225 30% 10%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 40, 175, 80, 30);
      
      ctx.fillStyle = "hsl(225 30% 10%)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Server", x, 195);
      ctx.fillText("Hello", x, 208);

      // Certificate
      ctx.fillStyle = "hsl(39 100% 50%)";
      ctx.fillRect(530, 100, 40, 50);
      ctx.strokeStyle = "hsl(225 30% 10%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(530, 100, 40, 50);
      ctx.fillStyle = "hsl(225 30% 10%)";
      ctx.font = "8px sans-serif";
      ctx.fillText("CERT", 550, 128);
    }

    // Step 2: Key Exchange
    if (currentStep === 2) {
      const x = 400;
      const y = 190;
      
      // Key icon
      ctx.strokeStyle = "hsl(270 80% 60%)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 15, y);
      ctx.lineTo(x + 30, y);
      ctx.lineTo(x + 30, y + 5);
      ctx.moveTo(x + 25, y);
      ctx.lineTo(x + 25, y + 5);
      ctx.stroke();

      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("Pre-Master Secret", 400, 160);
      ctx.fillText("(Encrypted)", 400, 230);
    }

    // Step 3: Generate Session Keys
    if (currentStep === 3) {
      // Key derivation animation
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("Generating Session Keys...", 400, 100);
      
      // Keys at both sides
      const drawKey = (x: number, y: number) => {
        ctx.strokeStyle = "hsl(270 80% 60%)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 12, y);
        ctx.lineTo(x + 22, y);
        ctx.lineTo(x + 22, y + 3);
        ctx.moveTo(x + 18, y);
        ctx.lineTo(x + 18, y + 3);
        ctx.stroke();
      };
      
      drawKey(100, 120);
      drawKey(700, 120);
      
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "10px sans-serif";
      ctx.fillText("Session Key", 100, 145);
      ctx.fillText("Session Key", 700, 145);
    }

    // Step 4: Encrypted Communication
    if (currentStep === 4) {
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("✓ Secure Connection", 400, 80);
      
      // Encrypted data
      const encX = 350;
      ctx.fillStyle = "hsl(270 80% 60% / 0.3)";
      ctx.fillRect(encX, 175, 100, 30);
      ctx.strokeStyle = "hsl(270 80% 60%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(encX, 175, 100, 30);
      
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("🔒 Encrypted", 400, 193);
      
      // Lock icon
      ctx.strokeStyle = "hsl(270 80% 60%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(390, 105, 20, 25);
      ctx.beginPath();
      ctx.arc(400, 105, 8, Math.PI, 0, true);
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

    // Arrows
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

  return <canvas ref={canvasRef} className="w-full h-auto" />;
};