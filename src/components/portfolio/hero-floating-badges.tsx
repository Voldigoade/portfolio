"use client";

import { motion, useReducedMotion } from "framer-motion";

const floatingBadges = [
  {
    text: "Systems & Rust",
    className:
      "-top-5 left-2 rotate-[-10deg] bg-accent text-accent-foreground md:-left-8",
    animate: { y: [0, -6, 0], x: [0, 2, 0] },
  },
  {
    text: "Security & Privacy",
    className:
      "right-2 top-14 rotate-[6deg] bg-secondary text-secondary-foreground md:right-3 md:top-16",
    animate: { y: [0, 6, 0], x: [0, -2, 0] },
  },
  {
    text: "Open Source",
    className:
      "-bottom-5 left-8 rotate-[6deg] bg-primary text-primary-foreground md:-left-6",
    animate: { y: [0, -4, 0], x: [0, 3, 0] },
  },
];

export function HeroFloatingBadges() {
  const reduceMotion = useReducedMotion();
  return (
    <>
      {floatingBadges.map((badge) => (
        <motion.div
          key={badge.text}
          animate={reduceMotion ? undefined : badge.animate}
          transition={{
            duration: 3.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className={`absolute z-20 border-4 border-black px-3 py-1 text-xs font-black uppercase shadow-retro ${badge.className}`}
        >
          {badge.text}
        </motion.div>
      ))}
    </>
  );
}
