"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height * 0.69;
      const horizon = height * 0.42;
      const pulse = reducedMotion ? 0 : Math.sin(time * 0.0005) * 10;

      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.42);
      glow.addColorStop(0, "rgba(25, 207, 252, 0.20)");
      glow.addColorStop(0.35, "rgba(25, 207, 252, 0.06)");
      glow.addColorStop(1, "rgba(25, 207, 252, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.save();
      context.globalAlpha = 0.4;
      context.strokeStyle = "rgba(25, 207, 252, 0.32)";
      context.lineWidth = 1;
      for (let row = 0; row < 15; row += 1) {
        const progress = row / 14;
        const y = horizon + Math.pow(progress, 1.8) * (height - horizon + 70) + pulse * progress;
        context.beginPath();
        context.ellipse(centerX, y, width * (0.06 + progress * 0.78), 8 + progress * 25, 0, 0, Math.PI * 2);
        context.stroke();
      }
      for (let column = -12; column <= 12; column += 1) {
        context.beginPath();
        context.moveTo(centerX, horizon);
        context.lineTo(centerX + column * width * 0.09, height + 80);
        context.stroke();
      }
      context.restore();

      context.save();
      context.globalCompositeOperation = "lighter";
      for (let index = 0; index < 72; index += 1) {
        const phase = (index * 0.73 + time * (reducedMotion ? 0 : 0.00008)) % 1;
        const angle = index * 2.399;
        const radius = 18 + phase * width * 0.39;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.2 - phase * 90;
        const size = 0.8 + (1 - phase) * 2;
        context.fillStyle = `rgba(25, 207, 252, ${0.12 + (1 - phase) * 0.5})`;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    };

    const motionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };
    resize();
    window.addEventListener("resize", resize);
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", motionChange);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.matchMedia("(prefers-reduced-motion: reduce)").removeEventListener("change", motionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="particle-canvas" />;
}