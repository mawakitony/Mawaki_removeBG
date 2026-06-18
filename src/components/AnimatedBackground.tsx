"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  size: 2 + (i % 3),
  delay: i * 0.4,
  duration: 5 + (i % 4),
}));

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#030308]" />

      {/* Aurora blobs */}
      <motion.div
        className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full opacity-30 blur-[130px]"
        style={{ background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)" }}
        animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-1/4 h-[700px] w-[700px] rounded-full opacity-25 blur-[150px]"
        style={{ background: "radial-gradient(circle, #ff2d95 0%, transparent 70%)" }}
        animate={{ x: [0, -60, 0], y: [0, 70, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Perspective grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] grid-perspective"
        style={{
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "center bottom",
        }}
      />

      {/* Horizontal data lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(0,240,255,0.5) 80px, rgba(0,240,255,0.5) 81px)",
          animation: "data-stream 8s linear infinite",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? "#00f0ff" : "#ff2d95",
            boxShadow: `0 0 ${p.size * 3}px ${p.id % 2 === 0 ? "#00f0ff" : "#ff2d95"}`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scan sweep */}
      <motion.div
        className="absolute inset-x-0 h-32 opacity-[0.06]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(0,240,255,0.8), transparent)",
        }}
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(3,3,8,0.8) 100%)",
        }}
      />

      {/* Scanlines + noise */}
      <div className="absolute inset-0 scanlines" />
      <div className="absolute inset-0 noise-overlay" />
    </div>
  );
}
