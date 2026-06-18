"use client";

import { motion } from "framer-motion";

type NeonPanelProps = {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  corners?: boolean;
  glow?: "cyan" | "magenta" | "violet";
};

export function NeonPanel({
  children,
  className = "",
  animated = false,
  corners = false,
  glow = "cyan",
}: NeonPanelProps) {
  const glowColor = {
    cyan: "rgba(0,240,255,0.12)",
    magenta: "rgba(255,45,149,0.12)",
    violet: "rgba(139,92,246,0.12)",
  }[glow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-neon glass-neon-hover relative overflow-hidden rounded-2xl ${
        animated ? "neon-border-animated" : ""
      } ${corners ? "corner-brackets" : ""} ${className}`}
      style={{ boxShadow: `0 0 60px ${glowColor}` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,240,255,0.5) 0%, transparent 50%, rgba(255,45,149,0.5) 100%)",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
