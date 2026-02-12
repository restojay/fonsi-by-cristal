'use client';

import React, { useEffect, useRef } from 'react';

interface SilkBackgroundProps {
  className?: string;
  speed?: number;
  scale?: number;
  color?: [number, number, number];
}

export function SilkBackground({
  className,
  speed = 0.02,
  scale = 2,
  color = [123, 116, 129],
}: SilkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    let time = 0;
    let w = 0;
    let h = 0;
    let buf: ArrayBuffer;
    let buf8: Uint8ClampedArray;
    let buf32: Uint32Array;

    const resolution = 0.5;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      w = Math.floor(window.innerWidth * resolution);
      h = Math.floor(window.innerHeight * resolution);
      offscreen.width = w;
      offscreen.height = h;
      buf = new ArrayBuffer(w * h * 4);
      buf8 = new Uint8ClampedArray(buf);
      buf32 = new Uint32Array(buf);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const cr = color[0];
    const cg = color[1];
    const cb = color[2];

    // Sin/cos lookup tables
    const LUT_SIZE = 4096;
    const LUT_MASK = LUT_SIZE - 1;
    const sinLUT = new Float32Array(LUT_SIZE);
    const cosLUT = new Float32Array(LUT_SIZE);
    const TWO_PI = Math.PI * 2;
    for (let i = 0; i < LUT_SIZE; i++) {
      const angle = (i / LUT_SIZE) * TWO_PI;
      sinLUT[i] = Math.sin(angle);
      cosLUT[i] = Math.cos(angle);
    }

    const fastSin = (x: number) => {
      const idx = ((x / TWO_PI) * LUT_SIZE) & LUT_MASK;
      return sinLUT[idx < 0 ? idx + LUT_SIZE : idx];
    };
    const fastCos = (x: number) => {
      const idx = ((x / TWO_PI) * LUT_SIZE) & LUT_MASK;
      return cosLUT[idx < 0 ? idx + LUT_SIZE : idx];
    };

    let lastFrame = 0;
    const frameInterval = 1000 / 30;

    const animate = (timestamp: number) => {
      if (timestamp - lastFrame < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp;

      const tOffset = speed * time;
      const t02 = 0.02 * tOffset;
      const t01 = 0.1 * tOffset;
      const scaleW = scale / w;
      const scaleH = scale / h;

      for (let x = 0; x < w; x++) {
        const u = x * scaleW;
        const sinVal = 0.03 * fastSin(8.0 * u - tOffset);
        const cos3u = fastCos(3.0 * u);

        for (let y = 0; y < h; y++) {
          const v = y * scaleH;
          const tex_y = v + sinVal;
          const sum = u + tex_y;

          const pattern =
            0.6 +
            0.4 * fastSin(
              5.0 * (sum + fastCos(cos3u + 5.0 * tex_y) + t02) +
              fastSin(20.0 * (sum - t01))
            );

          const r = (cr * pattern) | 0;
          const g = (cg * pattern) | 0;
          const b = (cb * pattern) | 0;

          buf32[y * w + x] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }

      const imageData = offCtx.createImageData(w, h);
      imageData.data.set(buf8);
      offCtx.putImageData(imageData, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

      const cw = canvas.width;
      const ch = canvas.height;
      const overlayGradient = ctx.createRadialGradient(
        cw / 2, ch / 2, 0,
        cw / 2, ch / 2, Math.max(cw, ch) / 2
      );
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, cw, ch);

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, scale, color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
