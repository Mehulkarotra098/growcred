"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: MotionProps) {
  void delay;

  return (
    <motion.div className={className}>
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className, delay = 0 }: MotionProps) {
  void delay;

  return (
    <motion.div
      whileHover={{ y: -7, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function DriftIn({ children, className, delay = 0 }: MotionProps) {
  void delay;

  return (
    <motion.div className={className}>
      {children}
    </motion.div>
  );
}
