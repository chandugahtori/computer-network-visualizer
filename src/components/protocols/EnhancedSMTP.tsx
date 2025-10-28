import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedSMTP = ({ currentStep, isPlaying }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sender mail client
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(30, 150, 120, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Mail Client", 90, 200);
    ctx.font = "10px sans-serif";
    ctx.fillText("user@example.com", 90, 220);

    // Draw SMTP server
    ctx.fillStyle = "hsl(270 80% 60%)";
    ctx.fillRect(340, 150, 120, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("SMTP Server", 400, 200);
    ctx.font = "10px sans-serif";
    ctx.fillText("mail.example.com", 400, 220);

    // Draw recipient server
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(650, 150, 120, 100);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("Recipient", 710, 200);
    ctx.font = "10px sans-serif";
    ctx.fillText("dest@mail.com", 710, 220);

    // Step 0: Compose email
    if (currentStep === 0) {
      // Email envelope icon
      ctx.strokeStyle = "hsl(192 100% 50%)";
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 80, 80, 50);
      ctx.beginPath();
      ctx.moveTo(50, 80);
      ctx.lineTo(90, 105);
      ctx.lineTo(130, 80);
      ctx.stroke();
      
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.font = "11px sans-serif";
      ctx.fillText("Composing...", 90, 145);
    }

    // Step 1: SMTP Handshake
    if (currentStep === 1) {
      const x = 220;
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.beginPath();
      ctx.arc(x, 190, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "white";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("HELO", x, 193);

      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.font = "11px sans-serif";
      ctx.fillText("EHLO example.com", 220, 240);
    }

    // Step 2: Send email data
    if (currentStep === 2) {
      const x = 270;
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.fillRect(x - 30, 175, 60, 30);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 30, 175, 60, 30);
      
      ctx.fillStyle = "white";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("MAIL", x, 185);
      ctx.fillText("DATA", x, 198);

      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "10px sans-serif";
      ctx.fillText("From: user@example.com", 270, 240);
      ctx.fillText("To: dest@mail.com", 270, 255);
    }

    // Step 3: Forward to recipient
    if (currentStep === 3) {
      const x = 550;
      const y = 190;
      
      // Envelope in transit
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.fillRect(x - 25, y - 20, 50, 35);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 25, y - 20, 50, 35);
      ctx.beginPath();
      ctx.moveTo(x - 25, y - 20);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 25, y - 20);
      ctx.stroke();

      // Motion lines
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = `hsl(270 80% 60% / ${0.3 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 35 - i * 15, y - 10);
        ctx.lineTo(x - 25 - i * 15, y - 10);
        ctx.moveTo(x - 35 - i * 15, y);
        ctx.lineTo(x - 25 - i * 15, y);
        ctx.stroke();
      }
    }

    // Step 4: Delivery confirmation
    if (currentStep === 4) {
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("✓ Email Delivered", 400, 80);
      
      // Success checkmark
      ctx.strokeStyle = "hsl(150 100% 50%)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(690, 110);
      ctx.lineTo(700, 120);
      ctx.lineTo(720, 100);
      ctx.stroke();
    }

    // Draw connection lines
    ctx.strokeStyle = "hsl(225 10% 65%)";
    ctx.lineWidth = 2;
    
    // Client to SMTP
    ctx.beginPath();
    ctx.moveTo(150, 200);
    ctx.lineTo(340, 200);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(340, 200);
    ctx.lineTo(335, 195);
    ctx.lineTo(335, 205);
    ctx.closePath();
    ctx.fillStyle = "hsl(225 10% 65%)";
    ctx.fill();

    // SMTP to Recipient
    ctx.beginPath();
    ctx.moveTo(460, 200);
    ctx.lineTo(650, 200);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(650, 200);
    ctx.lineTo(645, 195);
    ctx.lineTo(645, 205);
    ctx.closePath();
    ctx.fill();

  }, [currentStep, isPlaying]);

  return <canvas ref={canvasRef} className="w-full h-auto" />;
};