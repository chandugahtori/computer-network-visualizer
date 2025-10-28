import { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  isPlaying: boolean;
}

export const EnhancedHTTP = ({ currentStep, isPlaying }: Props) => {
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

    // Draw browser
    ctx.fillStyle = "hsl(192 100% 50%)";
    ctx.fillRect(50, 150, 100, 100);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Browser", 100, 210);

    // Draw web server
    ctx.fillStyle = "hsl(150 100% 50%)";
    ctx.fillRect(650, 150, 100, 100);
    ctx.fillStyle = "hsl(225 30% 10%)";
    ctx.fillText("Web Server", 700, 210);

    // Step 0: HTTP Request
    if (currentStep === 0) {
      const reqX = 250;
      const reqY = 180;
      
      ctx.fillStyle = "hsl(192 100% 50%)";
      ctx.fillRect(reqX - 50, reqY - 30, 100, 60);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(reqX - 50, reqY - 30, 100, 60);
      
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("GET /index", reqX, reqY - 10);
      ctx.fillText("Host: api.com", reqX, reqY + 5);
      ctx.fillText("Accept: */*", reqX, reqY + 20);

      ctx.shadowBlur = 20;
      ctx.shadowColor = "hsl(192 100% 50%)";
      ctx.strokeRect(reqX - 50, reqY - 30, 100, 60);
      ctx.shadowBlur = 0;
    }

    // Step 1: Request traveling
    if (currentStep === 1) {
      const reqX = 450;
      const reqY = 180;
      
      ctx.fillStyle = "hsl(192 100% 50% / 0.8)";
      ctx.fillRect(reqX - 40, reqY - 25, 80, 50);
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("GET", reqX, reqY);
      
      // Motion lines
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `hsl(192 100% 50% / ${0.3 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(reqX - 50 - i * 20, reqY - 15);
        ctx.lineTo(reqX - 40 - i * 20, reqY - 15);
        ctx.moveTo(reqX - 50 - i * 20, reqY);
        ctx.lineTo(reqX - 40 - i * 20, reqY);
        ctx.moveTo(reqX - 50 - i * 20, reqY + 15);
        ctx.lineTo(reqX - 40 - i * 20, reqY + 15);
        ctx.stroke();
      }
    }

    // Step 2: Server processing
    if (currentStep === 2) {
      ctx.fillStyle = "hsl(270 80% 60%)";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("Processing...", 700, 130);
      
      // Spinner
      const spinnerX = 700;
      const spinnerY = 280;
      ctx.strokeStyle = "hsl(270 80% 60%)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(spinnerX, spinnerY, 15, 0, Math.PI * 1.5);
      ctx.stroke();
    }

    // Step 3: HTTP Response
    if (currentStep === 3) {
      const resX = 550;
      const resY = 220;
      
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.fillRect(resX - 50, resY - 30, 100, 60);
      ctx.strokeStyle = "hsl(225 30% 10%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(resX - 50, resY - 30, 100, 60);
      
      ctx.fillStyle = "hsl(225 30% 10%)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("200 OK", resX, resY - 10);
      ctx.fillText("Content-Type:", resX, resY + 5);
      ctx.fillText("text/html", resX, resY + 20);

      ctx.shadowBlur = 20;
      ctx.shadowColor = "hsl(150 100% 50%)";
      ctx.strokeRect(resX - 50, resY - 30, 100, 60);
      ctx.shadowBlur = 0;
    }

    // Step 4: Response received
    if (currentStep === 4) {
      ctx.fillStyle = "hsl(150 100% 50%)";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("✓ Page Loaded", 100, 130);
    }

    // Draw bidirectional arrow
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

  return <canvas ref={canvasRef} className="w-full" style={{ height: "300px" }} />;
};