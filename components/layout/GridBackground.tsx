"use client";

import { useEffect, useRef } from "react";

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let offset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGrid = (animated: boolean) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 60;
      ctx.strokeStyle = "rgba(0, 212, 255, 0.04)";
      ctx.lineWidth = 1;

      if (animated) {
        offset = (offset + 0.15) % gridSize;
      }

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const startY = animated ? -gridSize + offset : 0;
      for (let y = startY; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const render = () => {
      drawGrid(!prefersReducedMotion);
      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      resize();
      if (prefersReducedMotion) {
        drawGrid(false);
      }
    };

    resize();
    render();

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
