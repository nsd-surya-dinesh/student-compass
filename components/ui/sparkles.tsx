
"use client";
import React, { useMemo, useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "../../lib/utils";

interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
  speed?: number;
}

export const SparklesCore = (props: SparklesProps) => {
  const {
    id = "sparkles",
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 120,
    className,
    particleColor = "#FFFFFF",
    speed = 1,
  } = props;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const particles = useRef<any[]>([]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      setContext(ctx);
      
      const resizeCanvas = () => {
        if (canvasRef.current) {
          canvasRef.current.width = canvasRef.current.offsetWidth;
          canvasRef.current.height = canvasRef.current.offsetHeight;
          initParticles();
        }
      };

      const initParticles = () => {
        const p: any[] = [];
        const numParticles = particleDensity;
        for (let i = 0; i < numParticles; i++) {
          p.push({
            x: Math.random() * canvasRef.current!.width,
            y: Math.random() * canvasRef.current!.height,
            size: Math.random() * (maxSize - minSize) + minSize,
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            opacity: Math.random(),
          });
        }
        particles.current = p;
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      let animationFrameId: number;
      const render = () => {
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          particles.current.forEach((particle) => {
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = particle.opacity;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = canvasRef.current!.width;
            if (particle.x > canvasRef.current!.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvasRef.current!.height;
            if (particle.y > canvasRef.current!.height) particle.y = 0;
          });
          animationFrameId = requestAnimationFrame(render);
        }
      };
      render();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [maxSize, minSize, particleColor, particleDensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("h-full w-full", className)}
      style={{ background }}
    />
  );
};
