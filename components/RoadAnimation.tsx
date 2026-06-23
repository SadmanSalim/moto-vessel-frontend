"use client";

import { useEffect, useRef } from "react";

export default function RoadAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let scrollRatio = 0;
    let frame = 0;
    let particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
    let animFrameId: number;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onScroll() {
      scrollRatio = Math.min(
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1),
        1,
      );
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    function getRoadPath() {
      return {
        sx: W * 0.06,
        sy: H * 0.72,
        c1x: W * 0.28,
        c1y: H * 0.48,
        c2x: W * 0.62,
        c2y: H * 0.72,
        ex: W * 0.97,
        ey: H * 0.9,
      };
    }

    function bp(
      t: number,
      sx: number,
      sy: number,
      c1x: number,
      c1y: number,
      c2x: number,
      c2y: number,
      ex: number,
      ey: number,
    ) {
      const mt = 1 - t;
      return {
        x: mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * ex,
        y: mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ey,
      };
    }

    function ba(
      t: number,
      sx: number,
      sy: number,
      c1x: number,
      c1y: number,
      c2x: number,
      c2y: number,
      ex: number,
      ey: number,
    ) {
      const d = 0.001;
      const p1 = bp(Math.max(0, t - d), sx, sy, c1x, c1y, c2x, c2y, ex, ey);
      const p2 = bp(Math.min(1, t + d), sx, sy, c1x, c1y, c2x, c2y, ex, ey);
      return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    function drawCar(x: number, y: number, ang: number, s: number) {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(ang);
      ctx!.scale(s, s);
      ctx!.fillStyle = "rgba(0,0,0,.1)";
      ctx!.beginPath();
      ctx!.ellipse(0, 11, 22, 5, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#1565c0";
      ctx!.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect: (...args: number[]) => void }).roundRect(-20, -5, 40, 12, 4);
      ctx!.fill();
      ctx!.fillStyle = "#0d47a1";
      ctx!.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect: (...args: number[]) => void }).roundRect(-12, -15, 24, 11, 4);
      ctx!.fill();
      ctx!.fillStyle = "rgba(144,202,249,.6)";
      ctx!.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect: (...args: number[]) => void }).roundRect(-10, -13, 9, 7, 2);
      ctx!.fill();
      ctx!.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect: (...args: number[]) => void }).roundRect(1, -13, 8, 7, 2);
      ctx!.fill();
      ctx!.fillStyle = "rgba(144,202,249,.35)";
      ctx!.fillRect(-20, -1, 40, 1.5);
      [
        [-13, 6],
        [13, 6],
      ].forEach(([wx, wy]) => {
        ctx!.fillStyle = "#1a1a1a";
        ctx!.beginPath();
        ctx!.ellipse(wx, wy, 5, 4, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "rgba(255,255,255,.3)";
        ctx!.beginPath();
        ctx!.ellipse(wx, wy, 2, 1.5, 0, 0, Math.PI * 2);
        ctx!.fill();
      });
      ctx!.save();
      ctx!.globalAlpha = 0.35;
      const g = ctx!.createRadialGradient(21, -2, 0, 21, -2, 16);
      g.addColorStop(0, "rgba(200,230,255,.9)");
      g.addColorStop(1, "transparent");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.ellipse(21, -2, 13, 7, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
      ctx!.restore();
    }

    function drawBike(x: number, y: number, ang: number, s: number) {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(ang);
      ctx!.scale(s, s);
      ctx!.fillStyle = "rgba(0,0,0,.08)";
      ctx!.beginPath();
      ctx!.ellipse(0, 13, 11, 3, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = "#f57c00";
      ctx!.lineWidth = 2.2;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(-7, -1);
      ctx!.lineTo(0, -7);
      ctx!.lineTo(7, -1);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(-7, -1);
      ctx!.lineTo(0, 3);
      ctx!.lineTo(7, -1);
      ctx!.stroke();
      ctx!.fillStyle = "#f57c00";
      ctx!.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect: (...args: number[]) => void }).roundRect(-7, -3, 14, 5, 3);
      ctx!.fill();
      ctx!.fillStyle = "#e65100";
      ctx!.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect: (...args: number[]) => void }).roundRect(-4, -7, 9, 5, 2);
      ctx!.fill();
      [-7, 7].forEach((wx) => {
        ctx!.strokeStyle = "#1a1a1a";
        ctx!.lineWidth = 2.2;
        ctx!.beginPath();
        ctx!.arc(wx, 7, 5, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.strokeStyle = "rgba(255,255,255,.25)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(wx, 7, 2, 0, Math.PI * 2);
        ctx!.stroke();
      });
      ctx!.fillStyle = "rgba(255,213,79,.75)";
      ctx!.beginPath();
      ctx!.ellipse(9, -1, 3, 2, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawParked(x: number, y: number) {
      ctx!.save();
      const g = ctx!.createRadialGradient(x, y, 0, x, y, 65);
      g.addColorStop(0, "rgba(21,101,192,.1)");
      g.addColorStop(1, "transparent");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.ellipse(x, y, 75, 32, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
      ctx!.save();
      ctx!.translate(x - 32, y + 4);
      drawCar(0, 0, 0, 0.85);
      ctx!.restore();
      ctx!.save();
      ctx!.translate(x + 22, y + 6);
      drawBike(0, 0, 0, 0.8);
      ctx!.restore();
      ctx!.save();
      ctx!.globalAlpha = 0.7;
      ctx!.fillStyle = "rgba(13,71,161,.88)";
      ctx!.beginPath();
      (ctx as CanvasRenderingContext2D & { roundRect: (...args: number[]) => void }).roundRect(x - 50, y - 30, 100, 18, 5);
      ctx!.fill();
      ctx!.fillStyle = "#90caf9";
      ctx!.font = "600 8.5px var(--font-quicksand), Quicksand, sans-serif";
      ctx!.textAlign = "center";
      ctx!.fillText("✓ QR VERIFIED · AUTHENTIC", x, y - 18);
      ctx!.restore();
    }

    function addParticle(x: number, y: number, color: string) {
      particles.push({
        x,
        y,
        vx: -1 - Math.random() * 0.7,
        vy: (Math.random() - 0.5) * 0.4,
        life: 1,
        color,
      });
    }

    function draw() {
      frame++;
      ctx!.clearRect(0, 0, W, H);
      const p = getRoadPath();
      const { sx, sy, c1x, c1y, c2x, c2y, ex, ey } = p;

      ctx!.save();
      ctx!.strokeStyle = "rgba(21,101,192,.06)";
      ctx!.lineWidth = 22;
      ctx!.lineCap = "round";
      ctx!.setLineDash([]);
      ctx!.beginPath();
      ctx!.moveTo(sx, sy);
      ctx!.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
      ctx!.stroke();
      ctx!.strokeStyle = "rgba(144,202,249,.1)";
      ctx!.lineWidth = 1.5;
      ctx!.setLineDash([10, 8]);
      ctx!.lineDashOffset = -frame * 0.4;
      ctx!.stroke();
      ctx!.restore();

      particles = particles.filter((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.04;
        if (pt.life > 0) {
          ctx!.save();
          ctx!.globalAlpha = pt.life * 0.12;
          ctx!.fillStyle = pt.color;
          ctx!.beginPath();
          ctx!.ellipse(pt.x, pt.y, 3.5, 2, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.restore();
          return true;
        }
        return false;
      });

      const carT = Math.min(scrollRatio * 0.92, 0.92);
      const bikeT = Math.min(Math.max(0, scrollRatio * 0.88 - 0.05), 0.86);
      const parkAlpha = Math.min(Math.max(0, (scrollRatio - 0.72) / 0.22), 1);
      const moveAlpha = 1 - parkAlpha;

      if (moveAlpha > 0.02 && carT > 0.01) {
        const cp = bp(carT, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
        const ca = ba(carT, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
        ctx!.save();
        ctx!.globalAlpha = moveAlpha;
        drawCar(cp.x, cp.y, ca, 1);
        ctx!.restore();
        if (frame % 2 === 0) {
          addParticle(cp.x - Math.cos(ca) * 22, cp.y - Math.sin(ca) * 22, "#1565c0");
        }
      }

      if (moveAlpha > 0.02 && bikeT > 0.01) {
        const bp2 = bp(bikeT, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
        const ba2 = ba(bikeT, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
        ctx!.save();
        ctx!.globalAlpha = moveAlpha;
        drawBike(bp2.x, bp2.y, ba2, 1);
        ctx!.restore();
        if (frame % 3 === 0) {
          addParticle(bp2.x - Math.cos(ba2) * 12, bp2.y - Math.sin(ba2) * 12, "#f57c00");
        }
      }

      if (parkAlpha > 0.02) {
        const endP = bp(0.95, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
        ctx!.save();
        ctx!.globalAlpha = parkAlpha;
        drawParked(endP.x, endP.y);
        ctx!.restore();
      }

      animFrameId = requestAnimationFrame(draw);
    }

    onScroll();
    animFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="road-animation-wrap" aria-hidden>
      <canvas ref={canvasRef} id="road-canvas" className="road-animation-canvas" />
    </div>
  );
}
